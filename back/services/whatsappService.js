import * as baileys from '@whiskeysockets/baileys';
import P from 'pino';
import fs from 'fs/promises'; // 👉 Importar para leer archivos
import path from 'path';
let sock;

export async function conectarWhatsApp() {
    let state, saveCreds;

    if (process.env.WA_SESSION_JSON) {
        const credentials = JSON.parse(process.env.WA_SESSION_JSON);

        state = {
            creds: JSON.parse(Buffer.from(credentials["creds.json"], 'base64').toString()),
            keys: {
                get: async (type, ids) => {
                    let keyData = {};
                    for (const id of ids) {
                        const fileKey = `app-state-sync-key-${id}.json`;
                        if (credentials[fileKey]) {
                            // 👇 Corregido: devolvemos el Buffer directamente
                            keyData[id] = Buffer.from(credentials[fileKey], 'base64');
                        }
                    }
                    return keyData;
                },
                set: async (type, data) => {
                    // No hacemos nada porque no queremos escribir en disco
                }
            }
        };

        saveCreds = async () => {
            // No hacemos nada aquí tampoco
        };
    } else {
        console.error('No WA_SESSION_JSON found!');
        return;
    }

    sock = baileys.makeWASocket({
        auth: state,
        logger: P({ level: 'info' }),
        printQRInTerminal: false,
    });

    console.log('Socket creado, esperando QR...');
    sock.ev.on('creds.update', saveCreds);

    sock.ev.on('connection.update', async (update) => {
        const { connection, lastDisconnect } = update;
        if (connection === 'close') {
            if ((lastDisconnect?.error)?.output?.statusCode !== baileys.DisconnectReason.loggedOut) {
                console.log('Reconectando WhatsApp...');
                conectarWhatsApp();
            } else {
                console.log('Se cerró la sesión de WhatsApp.');
            }
        } else if (connection === 'open') {
            console.log('Bot de WhatsApp conectado ✅');
            const { enviarResumenSemanal } = await import('../cron/whatsappCron.js');
            const grupoId = '120363399349813689@g.us';
            await enviarResumenSemanal(grupoId);
        }
    });
}

export async function enviarMensajeWhatsApp(chatId, mensaje) {
    if (!sock) {
        console.error('WhatsApp no está conectado');
        return;
    }

    try {
        await sock.sendMessage(chatId, { text: mensaje });
        console.log(`Mensaje enviado a ${chatId}`);
    } catch (error) {
        console.error('Error enviando mensaje de WhatsApp:', error.message);
    }
}