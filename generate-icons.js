import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const iconsDir = path.join(__dirname, 'public', 'icons');

// Créer le dossier icons s'il n'existe pas
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

// SVG amélioré pour les icônes
const svgIcon = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <defs>
    <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#f43f5e;stop-opacity:1" />
      <stop offset="50%" style="stop-color:#fd3f92;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#eab308;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="512" height="512" fill="url(#grad1)" rx="100"/>
  
  <!-- Burger icon -->
  <g transform="translate(256,256)">
    <!-- Top bun -->
    <ellipse cx="0" cy="-80" rx="120" ry="40" fill="#DEB887"/>
    <!-- Lettuce -->
    <ellipse cx="0" cy="-50" rx="110" ry="15" fill="#228B22"/>
    <!-- Tomato -->
    <ellipse cx="0" cy="-30" rx="105" ry="12" fill="#FF6347"/>
    <!-- Meat -->
    <ellipse cx="0" cy="-10" rx="115" ry="25" fill="#8B4513"/>
    <!-- Cheese -->
    <ellipse cx="0" cy="15" rx="120" ry="8" fill="#FFD700"/>
    <!-- Bottom bun -->
    <ellipse cx="0" cy="40" rx="125" ry="35" fill="#DEB887"/>
  </g>
  
  <!-- Text -->
  <text x="256" y="450" font-family="Arial, sans-serif" font-size="60" font-weight="bold" text-anchor="middle" fill="white">SOYA</text>
</svg>
`;

// Tailles d'icônes requises
const sizes = [16, 32, 72, 96, 128, 144, 152, 192, 384, 512];

console.log('📱 Génération des icônes PWA...');

// Créer un seul fichier SVG universel
fs.writeFileSync(path.join(iconsDir, 'icon.svg'), svgIcon);
console.log('✅ icon.svg créé (universel)');

// Créer des copies pour chaque taille (en attendant la conversion PNG)
sizes.forEach(size => {
  const filename = `icon-${size}x${size}.svg`;
  const filepath = path.join(iconsDir, filename);
  fs.writeFileSync(filepath, svgIcon);
  console.log(`✅ ${filename} créé`);
});

// Créer un favicon simplifié
const faviconSVG = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
  <rect width="32" height="32" fill="#f43f5e" rx="6"/>
  <text x="16" y="22" font-family="Arial" font-size="16" font-weight="bold" text-anchor="middle" fill="white">S</text>
</svg>
`;

fs.writeFileSync(path.join(__dirname, 'public', 'favicon.svg'), faviconSVG);
console.log('✅ favicon.svg créé');

console.log('');
console.log('🎯 Actions à effectuer :');
console.log('1. npm run generate-icons (fait)');
console.log('2. Redémarre le serveur : npm run dev');
console.log('3. Optionnel : convertir les SVG en PNG pour de meilleures performances');
console.log('');
console.log('✨ L\'app PWA devrait maintenant fonctionner correctement !');
