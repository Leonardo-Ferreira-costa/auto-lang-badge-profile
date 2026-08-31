const fs = require('fs');
const path = require('path');

// Cores oficiais das linguagens do GitHub
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
    // 1. Buscar repositórios do GitHub
    const username = process.env.GITHUB_REPOSITORY_OWNER || 'seu-usuario';
    const token = process.env.GITHUB_TOKEN;
    
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
    
    // 2. Contar linguagens
    const languageCount = {};
    let totalBytes = 0;
    
    // Para cada repositório, buscar as linguagens detalhadas
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
    
    // 3. Calcular porcentagens e ordenar
    const languages = Object.entries(languageCount)
      .map(([name, bytes]) => ({
        name,
        bytes,
        percentage: ((bytes / totalBytes) * 100)
      }))
      .sort((a, b) => b.bytes - a.bytes)
      .slice(0, 10); // Top 10 linguagens
    
    // 4. Gerar SVG
    const svg = generateSVG(languages, username);
    
    // 5. Salvar arquivo
    const outputPath = path.join(process.cwd(), 'assets', 'languages-badge.svg');
    fs.writeFileSync(outputPath, svg);
    
    console.log('✅ Badge gerado com sucesso!');
    console.log(`📊 ${languages.length} linguagens encontradas`);
    
  } catch (error) {
    console.error('❌ Erro ao gerar badge:', error);
    process.exit(1);
  }
}

function generateSVG(languages, username) {
  const width = Math.min(900, 120 + languages.length * 110);
  const height = 48;
  
  let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">`;
  
  // Fundo
  svg += `<rect width="${width}" height="${height}" rx="6" fill="#0d1117"/>`;
  
  // Borda sutil
  svg += `<rect width="${width}" height="${height}" rx="6" fill="none" stroke="#30363d" stroke-width="1"/>`;
  
  // Título
  svg += `<text x="14" y="28" font-family="-apple-system,BlinkMacSystemFont,Segoe UI,Helvetica,Arial,sans-serif" font-size="14" fill="#8b949e" font-weight="600">`;
  svg += `Linguagens mais usadas por @${username}`;
  svg += `</text>`;
  
  let x = 210;
  
  languages.forEach((lang) => {
    const color = languageColors[lang.name] || '#6e7681';
    const width = Math.max(65, 10 + lang.percentage * 1.8);
    
    // Container da linguagem
    svg += `<rect x="${x}" y="10" width="${width}" height="28" rx="4" fill="${color}15"/>`;
    
    // Barra de progresso
    svg += `<rect x="${x}" y="18" width="${(width - 12) * (lang.percentage / 100)}" height="12" rx="2" fill="${color}" opacity="0.3"/>`;
    
    // Círculo da cor
    svg += `<circle cx="${x + 10}" cy="24" r="5" fill="${color}"/>`;
    
    // Nome da linguagem
    svg += `<text x="${x + 20}" y="28" font-family="-apple-system,BlinkMacSystemFont,Segoe UI,Helvetica,Arial,sans-serif" font-size="11" fill="#c9d1d9" font-weight="500">`;
    svg += `${lang.name}`;
    svg += `</text>`;
    
    // Porcentagem
    svg += `<text x="${x + width - 6}" y="28" font-family="-apple-system,BlinkMacSystemFont,Segoe UI,Helvetica,Arial,sans-serif" font-size="10" fill="#8b949e" text-anchor="end">`;
    svg += `${lang.percentage.toFixed(1)}%`;
    svg += `</text>`;
    
    x += width + 6;
  });
  
  svg += '</svg>';
  return svg;
}

// Executar
generateBadge();