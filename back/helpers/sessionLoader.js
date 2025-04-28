// helpers/sessionLoader.js
import fs from 'fs';
import path from 'path';

export function reconstruirSesionDesdeJson(jsonString, baseDir = 'auth_info_baileys') {
    const data = JSON.parse(jsonString);

    for (const [relPath, base64Content] of Object.entries(data)) {
        const fullPath = path.join(baseDir, relPath);
        fs.mkdirSync(path.dirname(fullPath), { recursive: true });
        fs.writeFileSync(fullPath, Buffer.from(base64Content, 'base64'));
    }

    console.log('🔐 Sesión reconstruida desde JSON');
}
