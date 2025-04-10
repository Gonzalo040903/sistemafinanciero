import * as baileys from '@whiskeysockets/baileys';
import P from 'pino';

let sock;

export async function conectarWhatsApp() {
    const { state, saveCreds } = await baileys.useMultiFileAuthState('auth_info_baileys');

    sock = baileys.makeWASocket({
        auth: state,
        logger: P({ level: 'info' }),
        printQRInTerminal: true,
    });

    console.log('Socket creado, esperando QR...');
    sock.ev.on('creds.update', saveCreds);

    let yaSeEnvioResumen = false; // 🔥 Variable para evitar múltiples envíos

    sock.ev.on('connection.update', async (update) => {
        const { connection, lastDisconnect } = update;
        if (connection === 'close') {
            if ((lastDisconnect?.error)?.output?.statusCode !== baileys.DisconnectReason.loggedOut) {
                conectarWhatsApp();
            } else {
                console.log('Se cerró la sesión de WhatsApp.');
            }
        } else if (connection === 'open') {
            console.log('Bot de WhatsApp conectado ✅');

            if (!yaSeEnvioResumen) {
                yaSeEnvioResumen = true; // Marcamos que ya lo mandamos

                // 🔥 Ejecutar resumen apenas conecta
                const { enviarResumenSemanal } = await import('../cron/whatsappCron.js');
                const grupoId = '120363399349813689@g.us'; // 👈 Tu grupo real
                await enviarResumenSemanal(grupoId);
            }
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
