import { createServer } from 'https';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import express from 'express';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

// Servir les fichiers statiques depuis le dossier dist
app.use(express.static(join(__dirname, 'dist')));

// Gérer toutes les routes pour le SPA
app.get('*', (req, res) => {
  res.sendFile(join(__dirname, 'dist', 'index.html'));
});

// Certificats auto-signés (seulement pour le développement)
const options = {
  key: readFileSync(join(__dirname, 'localhost-key.pem')),
  cert: readFileSync(join(__dirname, 'localhost.pem'))
};

const server = createServer(options, app);

server.listen(3000, () => {
  console.log('🚀 Serveur HTTPS disponible sur https://localhost:3000');
  console.log('📱 Testez votre PWA sur mobile avec cette URL !');
});
