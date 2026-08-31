function generateSVG(languages, username) {
  const itemsPerRow = 5;
  const itemWidth = 200;
  const itemHeight = 40;
  const rows = Math.ceil(languages.length / itemsPerRow);
  
  const width = Math.min(1100, itemsPerRow * itemWidth + 50);
  const height = rows * itemHeight + 100;
  
  let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">`;
  
  // Fundo
  svg += `<rect width="${width}" height="${height}" rx="10" fill="#0d1117"/>`;
  svg += `<rect width="${width}" height="${height}" rx="10" fill="none" stroke="#30363d" stroke-width="1.5"/>`;
  
  // Título
  svg += `<text x="24" y="32" font-family="-apple-system,BlinkMacSystemFont,Segoe UI,Helvetica,Arial,sans-serif" font-size="14" fill="#8b949e" font-weight="600">`;
  svg += `📊 Linguagens mais usadas por @${username}`;
  svg += `</text>`;
  
  svg += `<line x1="24" y1="44" x2="${width - 24}" y2="44" stroke="#30363d" stroke-width="0.5"/>`;
  
  let index = 0;
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < itemsPerRow; col++) {
      if (index >= languages.length) break;
      
      const lang = languages[index];
      const color = languageColors[lang.name] || '#6e7681';
      
      const x = 24 + col * (itemWidth + 10);
      const y = 60 + row * (itemHeight + 10);
      
      // Container
      svg += `<rect x="${x}" y="${y}" width="${itemWidth}" height="${itemHeight}" rx="6" fill="${color}10"/>`;
      svg += `<rect x="${x}" y="${y}" width="${itemWidth}" height="${itemHeight}" rx="6" fill="none" stroke="${color}30" stroke-width="1"/>`;
      
      // Círculo da cor
      svg += `<circle cx="${x + 18}" cy="${y + 20}" r="6" fill="${color}"/>`;
      
      // Nome da linguagem
      svg += `<text x="${x + 32}" y="${y + 24}" font-family="-apple-system,BlinkMacSystemFont,Segoe UI,Helvetica,Arial,sans-serif" font-size="13" fill="#c9d1d9" font-weight="500">`;
      svg += `${lang.name}`;
      svg += `</text>`;
      
      // Porcentagem (canto direito)
      svg += `<text x="${x + itemWidth - 12}" y="${y + 24}" font-family="-apple-system,BlinkMacSystemFont,Segoe UI,Helvetica,Arial,sans-serif" font-size="12" fill="#8b949e" font-weight="600" text-anchor="end">`;
      svg += `${lang.percentage.toFixed(1)}%`;
      svg += `</text>`;
      
      // Barra de progresso
      svg += `<rect x="${x + 12}" y="${y + 32}" width="${itemWidth - 24}" height="3" rx="1.5" fill="#21262d"/>`;
      svg += `<rect x="${x + 12}" y="${y + 32}" width="${(itemWidth - 24) * (lang.percentage / 100)}" height="3" rx="1.5" fill="${color}" opacity="0.9"/>`;
      
      index++;
    }
  }
  
  svg += '</svg>';
  return svg;
}