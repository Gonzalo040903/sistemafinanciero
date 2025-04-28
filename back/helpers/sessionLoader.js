import fs from 'fs';
import path from 'path';

export function reconstruirSesionDesdeJson(base64) {
    const sessionStr = Buffer.from(base64, 'base64').toString('utf-8');
    const sessionData = JSON.parse(sessionStr); // Es un objeto tipo { "creds.json": "...", "app-state-sync-key-AAAA.json": "..." }

    const authPath = path.resolve('auth_info_baileys');
    if (!fs.existsSync(authPath)) {
        fs.mkdirSync(authPath, { recursive: true });
    }

    for (const [fileName, fileContentBase64] of Object.entries(sessionData)) {
        const fileContent = Buffer.from(fileContentBase64, 'base64');
        fs.writeFileSync(path.join(authPath, fileName), fileContent);
    }

    console.log('Sesión de WhatsApp reconstruida exitosamente.');
}
