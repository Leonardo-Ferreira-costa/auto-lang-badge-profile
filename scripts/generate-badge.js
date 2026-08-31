const fs = require('fs');
const path = require('path');

const languageColors = {
  'JavaScript': '#f1e05a',
  'TypeScript': '#3178c6',
  'Python': '#3572A5',
  'Java': '#b07219',
  'C#': '#178600',
  'C++': '#f34b7d',
  'C': '#555555',
  'Go': '#00ADD8',
  'Rust': '#dea584',
  'Ruby': '#701516',
  'PHP': '#4F5D95',
  'HTML': '#e34c26',
  'CSS': '#563d7c',
  'Swift': '#ffac45',
  'Kotlin': '#A97BFF',
  'Dart': '#00B4AB',
  'Shell': '#89e051',
  'Vue': '#41b883',
  'React': '#61dafb',
  'Angular': '#dd0031',
  'Node.js': '#339933',
  'SCSS': '#c6538c',
  'Sass': '#a53b70',
  'Less': '#1d365d',
  'Stylus': '#ff6347',
  'Markdown': '#083fa1',
  'Dockerfile': '#384d54',
  'Makefile': '#427819',
  'Objective-C': '#438eff',
  'Perl': '#0298c3',
  'Lua': '#000080',
  'R': '#198ce7',
  'MATLAB': '#e16737',
  'SQL': '#e38c00',
  'Jupyter Notebook': '#da5b0b',
  'PowerShell': '#012456',
  'Batchfile': '#c1f12e',
  'Groovy': '#4298b8',
  'Scala': '#c22d40',
  'Elixir': '#6e4a7e',
  'Erlang': '#b83998',
  'Clojure': '#db5855',
  'Haskell': '#5e5086',
  'Julia': '#a270ba',
  'Crystal': '#000100',
  'Nim': '#37775b',
  'Solidity': '#aa6746',
  'YAML': '#cb171e',
  'JSON': '#fbb03b',
  'XML': '#0060ac'
};

async function generateBadge() {
  try {
    const username = process.env.GITHUB_REPOSITORY_OWNER || 'seu-usuario';
    const token = process.env.GITHUB_TOKEN;
    
    console.log(`🔍 Buscando repositórios de ${username}...`);
    
    const response = await fetch(
      `https://api.github.com/users/${username}/repos?per_page=100&sort=updated`,
      {
        headers: {
          'Authorization': token ? `token ${token}` : '',
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'Language-Badge-Generator'
        }
      }
    );
    
    if (!response.ok) {
      throw new Error(`Erro ao buscar repositórios: ${response.status}`);
    }
    
    const repos = await response.json();
    console.log(`📁 ${repos.length} repositórios encontrados`);
    
    const languageCount = {};
    let totalBytes = 0;
    
    for (const repo of repos) {
      if (!repo.language) continue;
      
      const langResponse = await fetch(
        `https://api.github.com/repos/${username}/${repo.name}/languages`,
        {
          headers: {
            'Authorization': token ? `token ${token}` : '',
            'Accept': 'application/vnd.github.v3+json',
            'User-Agent': 'Language-Badge-Generator'
          }
        }
      );
      
      if (langResponse.ok) {
        const languages = await langResponse.json();
        for (const [lang, bytes] of Object.entries(languages)) {
          languageCount[lang] = (languageCount[lang] || 0) + bytes;
          totalBytes += bytes;
        }
      }
    }
    
    const languages = Object.entries(languageCount)
      .map(([name, bytes]) => ({
        name,
        bytes,
        percentage: ((bytes / totalBytes) * 100)
      }))
      .sort((a, b) => b.bytes - a.bytes)
      .slice(0, 10);
    
    console.log(`📊 ${languages.length} linguagens encontradas`);
    
    const svg = generateCleanSVG(languages, username);
    
    // Salva com nome fixo
    const outputPath = path.join(process.cwd(), 'assets', 'languages-badge.svg');
    fs.writeFileSync(outputPath, svg);
    
    console.log('✅ Badge gerado com sucesso!');
    console.log(`📁 Arquivo salvo em: ${outputPath}`);
    
  } catch (error) {
    console.error('❌ Erro ao gerar badge:', error);
    process.exit(1);
  }
}

function generateCleanSVG(languages, username) {
  // Layout fixo com espaçamento adequado
  const itemWidth = 140;
  const itemHeight = 50;
  const gap = 10;
  const padding = 20;
  
  const cols = Math.min(5, languages.length);
  const rows = Math.ceil(languages.length / cols);
  
  const width = cols * (itemWidth + gap) + padding * 2 + 20;
  const height = rows * (itemHeight + gap) + 100;
  
  const timestamp = new Date().toISOString();
  
  let svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <!-- Gerado em: ${timestamp} -->
  
  <defs>
    <filter id="shadow" x="-5%" y="-5%" width="110%" height="110%">
      <feDropShadow dx="0" dy="2" stdDeviation="3" flood-color="#000" flood-opacity="0.2"/>
    </filter>
    
    <linearGradient id="headerGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:#6e40c9;stop-opacity:0.8" />
      <stop offset="100%" style="stop-color:#3b82f6;stop-opacity:0.8" />
    </linearGradient>
  </defs>
  
  <!-- Fundo principal -->
  <rect width="${width}" height="${height}" rx="12" fill="#0d1117"/>
  <rect width="${width}" height="${height}" rx="12" fill="none" stroke="#30363d" stroke-width="1.5"/>
  
  <!-- Header com gradiente -->
  <rect x="0" y="0" width="${width}" height="4" rx="2" fill="url(#headerGrad)"/>
  
  <!-- Título -->
  <text x="${width / 2}" y="38" font-family="-apple-system,BlinkMacSystemFont,Segoe UI,Helvetica,Arial,sans-serif" font-size="16" fill="#e6edf3" font-weight="700" text-anchor="middle">
    📊 Minhas Linguagens Mais Usadas
  </text>
  
  <text x="${width / 2}" y="58" font-family="-apple-system,BlinkMacSystemFont,Segoe UI,Helvetica,Arial,sans-serif" font-size="12" fill="#8b949e" text-anchor="middle">
    @${username} • Atualizado em ${new Date().toLocaleDateString('pt-BR')}
  </text>
  
  <!-- Linha separadora -->
  <line x1="${padding}" y1="72" x2="${width - padding}" y2="72" stroke="#30363d" stroke-width="0.5"/>`;
  
  // Grid de linguagens
  let index = 0;
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      if (index >= languages.length) break;
      
      const lang = languages[index];
      const color = languageColors[lang.name] || '#6e7681';
      
      const x = padding + 10 + col * (itemWidth + gap);
      const y = 85 + row * (itemHeight + gap);
      
      // Card
      svg += `
  <rect x="${x}" y="${y}" width="${itemWidth}" height="${itemHeight}" rx="8" fill="${color}10" filter="url(#shadow)"/>
  <rect x="${x}" y="${y}" width="${itemWidth}" height="${itemHeight}" rx="8" fill="none" stroke="${color}30" stroke-width="1"/>
  
  <!-- Barra de cor no topo -->
  <rect x="${x + 4}" y="${y + 4}" width="${itemWidth - 8}" height="3" rx="1.5" fill="${color}" opacity="0.8"/>
  
  <!-- Círculo da linguagem -->
  <circle cx="${x + 20}" cy="${y + 28}" r="8" fill="${color}"/>
  <text x="${x + 20}" y="${y + 32}" font-family="Arial" font-size="10" fill="#fff" text-anchor="middle" font-weight="bold">
    ${lang.name.charAt(0)}
  </text>
  
  <!-- Nome da linguagem -->
  <text x="${x + 36}" y="${y + 26}" font-family="-apple-system,BlinkMacSystemFont,Segoe UI,Helvetica,Arial,sans-serif" font-size="12" fill="#e6edf3" font-weight="500">
    ${lang.name}
  </text>
  
  <!-- Porcentagem -->
  <text x="${x + itemWidth - 12}" y="${y + 26}" font-family="-apple-system,BlinkMacSystemFont,Segoe UI,Helvetica,Arial,sans-serif" font-size="14" fill="${color}" font-weight="700" text-anchor="end">
    ${lang.percentage.toFixed(1)}%
  </text>
  
  <!-- Barra de progresso -->
  <rect x="${x + 12}" y="${y + 40}" width="${itemWidth - 24}" height="4" rx="2" fill="#21262d"/>
  <rect x="${x + 12}" y="${y + 40}" width="${(itemWidth - 24) * (lang.percentage / 100)}" height="4" rx="2" fill="${color}" opacity="0.9"/>`;
      
      index++;
    }
  }
  
  // Rodapé
  svg += `
  
  <!-- Rodapé -->
  <text x="${width / 2}" y="${height - 12}" font-family="-apple-system,BlinkMacSystemFont,Segoe UI,Helvetica,Arial,sans-serif" font-size="10" fill="#484f58" text-anchor="middle">
    🔄 Gerado automaticamente via GitHub Actions • ${timestamp.split('T')[0]}
  </text>
  
</svg>`;
  
  return svg;
}

// Executar
generateBadge();
