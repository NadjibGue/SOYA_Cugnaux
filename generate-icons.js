import fs, { promises as fsp } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const publicDir = path.join(__dirname, 'public');
const iconsDir = path.join(publicDir, 'icons');
const sizes = [16, 32, 72, 96, 128, 144, 152, 192, 384, 512];

// Créer les dossiers nécessaires
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

// SVG principal
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
  <g transform="translate(256,256)">
    <ellipse cx="0" cy="-80" rx="120" ry="40" fill="#DEB887"/>
    <ellipse cx="0" cy="-50" rx="110" ry="15" fill="#228B22"/>
    <ellipse cx="0" cy="-30" rx="105" ry="12" fill="#FF6347"/>
    <ellipse cx="0" cy="-10" rx="115" ry="25" fill="#8B4513"/>
    <ellipse cx="0" cy="15" rx="120" ry="8" fill="#FFD700"/>
    <ellipse cx="0" cy="40" rx="125" ry="35" fill="#DEB887"/>
  </g>
  <text x="256" y="450" font-family="Arial, sans-serif" font-size="60" font-weight="bold" text-anchor="middle" fill="white">SOYA</text>
</svg>
`;

// favicon
const faviconSVG = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
  <rect width="32" height="32" fill="#f43f5e" rx="6"/>
  <text x="16" y="22" font-family="Arial" font-size="16" font-weight="bold" text-anchor="middle" fill="white">S</text>
</svg>
`;

function createIconGeneratorHTML() {
  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Générateur d'icônes SOYA</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      padding: 20px;
      background: linear-gradient(135deg, #f43f5e, #fd7e14, #fbbf24);
      color: white;
      min-height: 100vh;
    }
    .container {
      max-width: 1200px;
      margin: auto;
      padding: 30px;
      border-radius: 20px;
      background: rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(10px);
    }
    .title {
      text-align: center;
      font-size: 2.5em;
      margin-bottom: 20px;
    }
    .instructions, .download-info {
      background: rgba(255, 255, 255, 0.1);
      padding: 20px;
      border-radius: 15px;
      margin: 20px 0;
    }
    .icon-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
      gap: 20px;
      margin-top: 20px;
    }
    .icon-item {
      text-align: center;
    }
    canvas {
      border-radius: 10px;
      border: 2px solid white;
    }
    button {
      display: block;
      margin: 30px auto;
      padding: 15px 30px;
      font-size: 18px;
      border-radius: 12px;
      background: linear-gradient(135deg, #10b981, #059669);
      color: white;
      font-weight: bold;
      cursor: pointer;
      border: none;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1 class="title">🍔 Générateur d'icônes SOYA</h1>
    <div class="instructions">
      <strong>Instructions :</strong>
      <ol>
        <li>Cliquez sur "Générer toutes les icônes"</li>
        <li>Les fichiers se téléchargeront automatiquement</li>
        <li>Déplacez-les dans <code>public/icons/</code></li>
        <li>Votre PWA est prête 🚀</li>
      </ol>
    </div>
    <button onclick="generateAllIcons()">🎨 Générer toutes les icônes</button>
    <div class="icon-grid" id="iconGrid"></div>
    <div class="download-info" id="finalMessage"></div>
  </div>

<script>
const sizes = ${JSON.stringify(sizes)};

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function createIcon(size) {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  canvas.width = canvas.height = size;

  const grad = ctx.createLinearGradient(0, 0, size, size);
  grad.addColorStop(0, '#f43f5e');
  grad.addColorStop(0.5, '#fd7e14');
  grad.addColorStop(1, '#fbbf24');

  ctx.fillStyle = grad;
  roundRect(ctx, 0, 0, size, size, size * 0.15);
  ctx.fill();

  ctx.fillStyle = 'white';
  ctx.font = \`bold \${size * 0.25}px Arial\`;
  ctx.textAlign = 'center';
  ctx.fillText('SOYA', size / 2, size * 0.6);

  return canvas;
}

function downloadCanvas(canvas, filename) {
  const a = document.createElement('a');
  a.download = filename;
  a.href = canvas.toDataURL('image/png');
  a.click();
}

function generateAllIcons() {
  sizes.forEach(size => {
    const canvas = createIcon(size);
    downloadCanvas(canvas, \`icon-\${size}x\${size}.png\`);
  });

  document.getElementById('finalMessage').innerHTML = "✅ Téléchargement terminé ! Déplacez les fichiers dans <code>public/icons/</code>.";
}

window.onload = () => {
  const grid = document.getElementById('iconGrid');
  sizes.forEach(size => {
    const div = document.createElement('div');
    div.className = 'icon-item';
    const canvas = createIcon(size);
    canvas.onclick = () => downloadCanvas(canvas, \`icon-\${size}x\${size}.png\`);
    div.appendChild(canvas);
    const label = document.createElement('div');
    label.textContent = \`\${size}x\${size}\`;
    div.appendChild(label);
    grid.appendChild(div);
  });
};
</script>
</body>
</html>
`;
}

async function createIconAssets() {
  try {
    console.log('📱 Génération des icônes PWA...');

    // SVG principal
    fs.writeFileSync(path.join(iconsDir, 'icon.svg'), svgIcon);
    console.log('✅ icon.svg créé');

    // favicon
    fs.writeFileSync(path.join(publicDir, 'favicon.svg'), faviconSVG);
    console.log('✅ favicon.svg créé');

    // Duplication SVG tailles (en attendant PNG)
    for (const size of sizes) {
      const filename = `icon-${size}x${size}.svg`;
      fs.writeFileSync(path.join(iconsDir, filename), svgIcon);
      console.log(`✅ ${filename} créé`);
    }

    // Générateur HTML
    const html = createIconGeneratorHTML();
    await fsp.writeFile(path.join(iconsDir, 'generate-icons.html'), html);
    console.log('✅ generate-icons.html créé');

    console.log('\n📂 Ouvre public/icons/generate-icons.html dans ton navigateur');
    console.log('🎉 PWA prête après déplacement des fichiers générés dans /public/icons/');
  } catch (e) {
    console.error('❌ Erreur lors de la génération des icônes :', e.message);
  }
}

createIconAssets();
