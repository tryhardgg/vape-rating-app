const fs = require('fs');
const path = require('path');

const flavors = [
    {name:'Barawolf',color:'#e94560'},
    {name:'Barbahybrid',color:'#c0392b'},
    {name:'Baba Banana',color:'#f1c40f'},
    {name:'Banampus',color:'#f39c12'},
    {name:'Berry Jack',color:'#e74c3c'},
    {name:'Big Foot Cola',color:'#2c3e50'},
    {name:'Crappbie',color:'#27ae60'},
    {name:'Currummy',color:'#8e44ad'},
    {name:'Grape Cola',color:'#9b59b6'},
    {name:'Grapeena',color:'#8e44ad'},
    {name:'Grapefruit Raspberry',color:'#e67e22'},
    {name:'Ifritus',color:'#d35400'},
    {name:'Jotun Pine',color:'#1abc9c'},
    {name:'Kiwi Apple',color:'#8bc34a'},
    {name:'Leshberry',color:'#c0392b'},
    {name:'Limelops',color:'#f1c40f'},
    {name:'Mango King',color:'#ff9800'},
    {name:'Cola Kong',color:'#34495e'},
    {name:'Cola Lemon',color:'#2c3e50'},
    {name:'Mankicore',color:'#ff6b35'},
    {name:'Manoraur',color:'#ff9800'},
    {name:'Neelhu',color:'#16a085'},
    {name:'Peachansi',color:'#ffb74d'},
    {name:'Pinchezilla',color:'#ffc107'},
    {name:'Snakelon',color:'#4caf50'},
    {name:'Straw Fogler',color:'#e91e63'},
    {name:'Straw Gona',color:'#f06292'},
    {name:'Strawberry Grape',color:'#ba68c8'},
    {name:'Tropirus',color:'#ff5722'},
    {name:'Watercream',color:'#f48fb1'},
    {name:'Apple Cranberry',color:'#e53935'},
    {name:'Hypnocrank',color:'#ad1457'},
    {name:'Catrula',color:'#66bb6a'},
    {name:'Strawnergy Things',color:'#ec407a'}
];

const outputDir = path.join(__dirname, 'images', 'monster-vapor');

// Создаём директорию если не существует
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

flavors.forEach(f => {
    const safeName = f.name.replace(/[^a-zA-Z0-9]/g, '_');
    const displayName = f.name;
    
    const svg = `<svg viewBox="0 0 200 300" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad-${safeName}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${f.color};stop-opacity:0.9"/>
      <stop offset="100%" style="stop-color:${f.color};stop-opacity:0.3"/>
    </linearGradient>
    <filter id="glow-${safeName}">
      <feGaussianBlur in="SourceGraphic" stdDeviation="2"/>
    </filter>
  </defs>
  <path d="M60 20 L140 20 L150 40 L150 280 Q150 295 100 295 Q50 295 50 280 L50 40 Z" 
        fill="url(#grad-${safeName})" stroke="${f.color}" stroke-width="2"/>
  <rect x="55" y="100" width="90" height="120" rx="5" 
        fill="rgba(255,255,255,0.15)" stroke="rgba(255,255,255,0.3)" stroke-width="1"/>
  <text x="100" y="130" text-anchor="middle" font-family="Arial" font-size="10" 
        fill="rgba(255,255,255,0.7)" letter-spacing="2">MONSTER</text>
  <text x="100" y="145" text-anchor="middle" font-family="Arial" font-size="10" 
        fill="rgba(255,255,255,0.7)" letter-spacing="2">VAPOR</text>
  <text x="100" y="175" text-anchor="middle" font-family="Arial" font-size="11" 
        font-weight="bold" fill="#ffffff" filter="url(#glow-${safeName})">${displayName}</text>
  <text x="100" y="70" text-anchor="middle" font-family="Arial" font-size="36" 
        font-weight="bold" fill="rgba(255,255,255,0.2)">M</text>
</svg>`;
    
    const filename = `${safeName}.svg`;
    const filepath = path.join(outputDir, filename);
    fs.writeFileSync(filepath, svg);
    console.log('✓ Created:', filename);
});

console.log(`\n✅ Сгенерировано ${flavors.length} SVG файлов в ${outputDir}`);
