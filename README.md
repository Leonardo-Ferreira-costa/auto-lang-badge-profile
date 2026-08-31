# 🏷️ Auto Lang Badge Profile

<div align="center">
  <h3>📊 Gerador automático de badge para linguagens usadas em seus repositórios</h3>
  <p><em>Transforme seus repositórios em um badge bonito e atualizado automaticamente!</em></p>

  <!-- Seu badge -->
  <img src="https://raw.githubusercontent.com/Leonardo-Ferreira-costa/auto-lang-badge-profile/main/assets/languages-badge.svg" width="850" alt="Minhas linguagens mais usadas" />
  
  <p>
    <img src="https://img.shields.io/badge/status-ativo-success" />
    <img src="https://img.shields.io/badge/atualização-automática-blue" />
    <img src="https://img.shields.io/badge/feito_com-❤️-red" />
  </p>
</div>

---

## 🎯 O que é este projeto?

Este repositório contém um **gerador automático** que cria um badge com as linguagens de programação mais usadas em todos os seus repositórios do GitHub.

O badge é:
- ✅ **Atualizado automaticamente** a cada 6 horas via GitHub Actions
- ✅ **Bonito e moderno** com cores oficiais das linguagens
- ✅ **Fácil de usar** - basta adicionar uma linha no seu README
- ✅ **Personalizável** - você pode alterar cores e layout

---

## 🚀 Como usar

### Fork do repositório 

1. **Faça um fork** deste repositório clicando no botão "Fork" no canto superior direito

2. **Ative o GitHub Actions** no seu fork:
   - Vá para a aba **Actions** do seu repositório
   - Clique em **"I understand my workflows, go ahead and enable them"**

3. **Adicione ao seu README.md**:
   ```markdown
   ![Languages Badge](https://raw.githubusercontent.com/SEU_USUARIO/auto-lang-badge-profile/main/assets/languages-badge.svg)

---

🔧 Como funciona
GitHub Actions executa o script a cada 6 horas

O script busca todos os seus repositórios via API do GitHub

Conta os bytes de cada linguagem em todos os repositórios

Calcula a porcentagem de uso de cada linguagem

Gera um SVG bonito com os resultados

Atualiza o arquivo assets/languages-badge.svg


---

🛠️ Tecnologias Utilizadas
Node.js - Ambiente de execução do script

GitHub Actions - Automação e atualização

GitHub API - Busca de repositórios e linguagens

SVG - Geração do badge


<div align="center"> <sub>Feito com ❤️ por <a href="https://github.com/Leonardo-Ferreira-costa">Leonardo Ferreira </a></sub> <br> <sub>⭐ Se gostou, deixe uma estrela!</sub> </div> 
