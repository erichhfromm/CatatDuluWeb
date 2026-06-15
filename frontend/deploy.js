import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const distDir = path.resolve(__dirname, 'dist');
const backendPublicAssetsDir = path.resolve(__dirname, '../backend/public/assets');
const backendViewsDir = path.resolve(__dirname, '../backend/resources/views');

// 1. Ensure dist exists
if (!fs.existsSync(distDir)) {
    console.error('dist directory not found. Please run build first.');
    process.exit(1);
}

// 2. Copy assets
const distAssetsDir = path.join(distDir, 'assets');
if (fs.existsSync(distAssetsDir)) {
    if (!fs.existsSync(backendPublicAssetsDir)) {
        fs.mkdirSync(backendPublicAssetsDir, { recursive: true });
    }
    const assets = fs.readdirSync(distAssetsDir);
    for (const asset of assets) {
        fs.copyFileSync(
            path.join(distAssetsDir, asset),
            path.join(backendPublicAssetsDir, asset)
        );
    }
    console.log(`Copied ${assets.length} assets to backend/public/assets`);
}

// 3. Copy index.html to react.blade.php
const indexHtmlPath = path.join(distDir, 'index.html');
const bladePath = path.join(backendViewsDir, 'react.blade.php');

if (fs.existsSync(indexHtmlPath)) {
    let html = fs.readFileSync(indexHtmlPath, 'utf8');
    // Ensure the paths to assets are correct (they should be /assets/...)
    // Vite uses /assets/ by default, so it should be fine.
    fs.writeFileSync(bladePath, html);
    console.log('Copied index.html to backend/resources/views/react.blade.php');
} else {
    console.error('index.html not found in dist.');
    process.exit(1);
}

console.log('Deployment to Laravel completed successfully!');
