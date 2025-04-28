// scripts/exportSession.js
import fs from 'fs';
import path from 'path';

const basePath = 'auth_info_baileys';

function encodeFile(filePath) {
    const data = fs.readFileSync(filePath);
    return data.toString('base64');
}

function walkDir(dir) {
    const result = {};
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        const relPath = path.relative(basePath, fullPath);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
            Object.assign(result, walkDir(fullPath));
        } else {
            result[relPath] = encodeFile(fullPath);
        }
    }
    return result;
}

const session = walkDir(basePath);
fs.writeFileSync('session.json', JSON.stringify(session, null, 2));
console.log('✅ Sesión exportada a session.json');
