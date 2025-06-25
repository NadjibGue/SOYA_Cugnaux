import { unlinkSync, existsSync } from 'fs';
import { join } from 'path';

const iconsDir = join(process.cwd(), 'public', 'icons');

// Fichiers à supprimer (doublons et fichiers inutiles)
const filesToRemove = [
  'icon-16x16 (1).png',
  'icon-16x16 (2).png',
  'icon-16x16 (3).png',
  'icon-32x32 (1).png',
  'icon-32x32 (2).png',
  'placeholder.txt',
  'generate-icons.html',
  // Garder les SVG pour backup mais utiliser les PNG
  // Vous pouvez les supprimer si vous voulez
];

console.log('🧹 Nettoyage des fichiers d\'icônes...');

filesToRemove.forEach(filename => {
  const filepath = join(iconsDir, filename);
  if (existsSync(filepath)) {
    try {
      unlinkSync(filepath);
      console.log(`✅ Supprimé: ${filename}`);
    } catch (error) {
      console.log(`❌ Erreur pour ${filename}:`, error.message);
    }
  } else {
    console.log(`⚠️  Fichier non trouvé: ${filename}`);
  }
});

console.log('✨ Nettoyage terminé !');
console.log('📁 Fichiers d\'icônes conservés:');

// Lister les fichiers restants
const remainingFiles = [
  'icon-16x16.png',
  'icon-32x32.png', 
  'icon-72x72.png',
  'icon-96x96.png',
  'icon-128x128.png',
  'icon-144x144.png',
  'icon-152x152.png',
  'icon-192x192.png',
  'icon-384x384.png',
  'icon-512x512.png'
];

remainingFiles.forEach(filename => {
  const filepath = join(iconsDir, filename);
  if (existsSync(filepath)) {
    console.log(`   ✅ ${filename}`);
  } else {
    console.log(`   ❌ MANQUANT: ${filename}`);
  }
});
