// Script simple pour créer les icônes SVG
import { writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';

const sizes = [16, 32, 72, 96, 128, 144, 152, 192, 384, 512];

// Créer le dossier icons s'il n'existe pas
try {
  mkdirSync(join(process.cwd(), 'public', 'icons'), { recursive: true });
} catch (e) {
  // Le dossier existe déjà
}

// Fonction pour créer une icône SVG
function createSVGIcon(size) {
  return `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg-${size}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#f43f5e;stop-opacity:1" />
      <stop offset="50%" style="stop-color:#fd7e14;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#fbbf24;stop-opacity:1" />
    </linearGradient>
  </defs>
  
  <!-- Background with rounded corners -->
  <rect width="${size}" height="${size}" rx="${size * 0.15}" fill="url(#bg-${size})"/>
  
  <!-- Chef hat icon -->
  <g transform="translate(${size * 0.25}, ${size * 0.25})">
    <!-- Hat main body -->
    <ellipse cx="${size * 0.25}" cy="${size * 0.2}" rx="${size * 0.18}" ry="${size * 0.12}" fill="white" opacity="0.95"/>
    
    <!-- Hat band -->
    <rect x="${size * 0.07}" y="${size * 0.3}" width="${size * 0.36}" height="${size * 0.04}" rx="${size * 0.02}" fill="white" opacity="0.9"/>
    
    <!-- Hat pleats -->
    <circle cx="${size * 0.12}" cy="${size * 0.12}" r="${size * 0.025}" fill="white" opacity="0.8"/>
    <circle cx="${size * 0.25}" cy="${size * 0.08}" r="${size * 0.03}" fill="white" opacity="0.8"/>
    <circle cx="${size * 0.38}" cy="${size * 0.12}" r="${size * 0.025}" fill="white" opacity="0.8"/>
  </g>
  
  <!-- Text SOYA -->
  <text x="${size * 0.5}" y="${size * 0.8}" text-anchor="middle" fill="white" font-family="Arial Black, Arial, sans-serif" font-weight="900" font-size="${size * 0.1}">SOYA</text>
</svg>`;
}

// Générer toutes les icônes
sizes.forEach(size => {
  const svgContent = createSVGIcon(size);
  const filename = `icon-${size}x${size}.svg`;
  const filepath = join(process.cwd(), 'public', 'icons', filename);
  
  writeFileSync(filepath, svgContent);
  console.log(`✅ Créé: ${filename}`);
});

console.log('🎉 Toutes les icônes SVG ont été générées !');
console.log('📱 Les icônes sont maintenant disponibles pour la PWA');
console.log('🔄 Rechargez votre navigateur pour voir les changements');
