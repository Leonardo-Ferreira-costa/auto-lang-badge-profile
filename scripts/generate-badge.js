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
    
    // Filtrar linguagens com 0% e ordenar
    const languages = Object.entries(languageCount)
      .map(([name, bytes]) => ({
        name,
        bytes,
        percentage: ((bytes / totalBytes) * 100)
      }))
      .filter(lang => lang.percentage > 0) // Remove linguagens com 0%
      .sort((a, b) => b.bytes - a.bytes)
      .slice(0, 10); // Top 10
    
    console.log(`📊 ${languages.length} linguagens encontradas (acima de 0%)`);
    
    if (languages.length === 0) {
      console.log('⚠️ Nenhuma linguagem encontrada!');
      // Gera um badge informativo
      const fallbackSVG = generateFallbackSVG(username);
      const outputPath = path.join(process.cwd(), 'assets', 'languages-badge.svg');
      fs.writeFileSync(outputPath, fallbackSVG);
      console.log('✅ Badge de fallback gerado');
      return;
    }
    
    const svg = generateCleanSVG(languages, username);
    
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
  // Layout com espaçamento adequado para nome + porcentagem
  const itemWidth = 160; // Aumentado para dar mais espaço
  const itemHeight = 55;
  const gap = 12;
  const padding = 24;
  
  const cols = Math.min(4, languages.length); // 4 colunas para melhor visualização
  const rows = Math.ceil(languages.length / cols);
  
  const width = cols * (itemWidth + gap) + padding * 2;
  const height = rows * (itemHeight + gap) + 110;
  
  const timestamp = new Date().toISOString();
  
  let svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <!-- Gerado em: ${timestamp} -->
  
  <defs>
    <filter id="shadow" x="-5%" y="-5%" width="110%" height="110%">
      <feDropShadow dx="0" dy="2" stdDeviation="3" flood-color="#000" flood-opacity="0.15"/>
    </filter>
    
    <linearGradient id="headerGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:#6e40c9;stop-opacity:0.8" />
      <stop offset="100%" style="stop-color:#3b82f6;stop-opacity:0.8" />
    </linearGradient>
  </defs>
  
  <!-- Fundo principal -->
  <rect x="0" y="0" width="${width}" height="${height}" rx="12" fill="#0d1117"/>
  <rect x="0" y="0" width="${width}" height="${height}" rx="12" fill="none" stroke="#30363d" stroke-width="1.5"/>
  
  <!-- Header com gradiente -->
  <rect x="0" y="0" width="${width}" height="4" rx="2" fill="url(#headerGrad)"/>
  
  <!-- Título -->
  <text x="${width / 2}" y="38" font-family="-apple-system,BlinkMacSystemFont,Segoe UI,Helvetica,Arial,sans-serif" font-size="16" fill="#e6edf3" font-weight="700" text-anchor="middle">
    📊 Minhas Linguagens Mais Usadas
  </text>
  
  <text x="${width / 2}" y="58" font-family="-apple-system,BlinkMacSystemFont,Segoe UI,Helvetica,Arial,sans-serif" font-size="12" fill="#8b949e" text-anchor="middle">
    @${username} • ${new Date().toLocaleDateString('pt-BR')}
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
      
      const x = padding + col * (itemWidth + gap);
      const y = 88 + row * (itemHeight + gap);
      
      // Card
      svg += `
  <!-- Card da linguagem -->
  <rect x="${x}" y="${y}" width="${itemWidth}" height="${itemHeight}" rx="8" fill="${color}08" filter="url(#shadow)"/>
  <rect x="${x}" y="${y}" width="${itemWidth}" height="${itemHeight}" rx="8" fill="none" stroke="${color}25" stroke-width="1"/>
  
  <!-- Barra de cor no topo -->
  <rect x="${x + 6}" y="${y + 6}" width="${itemWidth - 12}" height="3" rx="1.5" fill="${color}" opacity="0.8"/>
  
  <!-- Círculo da linguagem com a primeira letra -->
  <circle cx="${x + 22}" cy="${y + 30}" r="10" fill="${color}"/>
  <text x="${x + 22}" y="${y + 34}" font-family="Arial, sans-serif" font-size="11" fill="#fff" text-anchor="middle" font-weight="bold">
    ${lang.name.charAt(0)}
  </text>
  
  <!-- Nome da linguagem (alinhado à esquerda) -->
  <text x="${x + 40}" y="${y + 28}" font-family="-apple-system,BlinkMacSystemFont,Segoe UI,Helvetica,Arial,sans-serif" font-size="12" fill="#e6edf3" font-weight="500">
    ${lang.name}
  </text>
  
  <!-- Porcentagem (alinhado à direita, com destaque) -->
  <text x="${x + itemWidth - 10}" y="${y + 28}" font-family="-apple-system,BlinkMacSystemFont,Segoe UI,Helvetica,Arial,sans-serif" font-size="14" fill="${color}" font-weight="700" text-anchor="end">
    ${lang.percentage.toFixed(1)}%
  </text>
  
  <!-- Barra de progresso -->
  <rect x="${x + 12}" y="${y + 42}" width="${itemWidth - 24}" height="4" rx="2" fill="#21262d"/>
  <rect x="${x + 12}" y="${y + 42}" width="${(itemWidth - 24) * (lang.percentage / 100)}" height="4" rx="2" fill="${color}" opacity="0.9"/>`;
      
      index++;
    }
  }
  
  // Rodapé
  svg += `
  
  <!-- Rodapé -->
  <text x="${width / 2}" y="${height - 12}" font-family="-apple-system,BlinkMacSystemFont,Segoe UI,Helvetica,Arial,sans-serif" font-size="10" fill="#484f58" text-anchor="middle">
    🔄 Atualizado automaticamente • ${timestamp.split('T')[0]}
  </text>
  
</svg>`;
  
  return svg;
}

function generateFallbackSVG(username) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="500" height="100">
  <rect width="500" height="100" rx="12" fill="#0d1117"/>
  <rect width="500" height="100" rx="12" fill="none" stroke="#30363d" stroke-width="1.5"/>
  
  <text x="250" y="40" font-family="Arial" font-size="16" fill="#e6edf3" text-anchor="middle" font-weight="bold">
    📊 Minhas Linguagens Mais Usadas
  </text>
  
  <text x="250" y="65" font-family="Arial" font-size="14" fill="#8b949e" text-anchor="middle">
    Nenhuma linguagem encontrada para @${username}
  </text>
  
  <text x="250" y="85" font-family="Arial" font-size="11" fill="#484f58" text-anchor="middle">
    Verifique se você tem repositórios públicos com linguagens
  </text>
</svg>`;
}

// Executar
generateBadge();
