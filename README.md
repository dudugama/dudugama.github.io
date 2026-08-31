# Eduardo Gama — Portfólio UX/UI

Site pessoal e portfólio de projetos de UX/UI Design, construído do zero em HTML, CSS e JavaScript puros.

🔗 **Ver ao vivo:** [dudugama.github.io](https://dudugama.github.io)

![Preview do site](imagens/capa-card.webp)

---

## 📋 Sobre o projeto

Este repositório contém o código-fonte do meu portfólio, onde apresento cases de UX/UI Design, projetos de análise de dados e as formas de contato. O objetivo foi construir um site rápido, acessível e sem dependências pesadas de frameworks — só o essencial, bem feito.

**Destaques do case em destaque — Escritório de Leilões:**
Redesign de uma plataforma de leilões de bens móveis e imóveis, com foco em arquitetura de informação, transparência na tomada de decisão e redução da taxa de abandono no fluxo de cadastro.

## ✨ Funcionalidades

- 🌓 **Modo claro/escuro** com detecção automática da preferência do sistema e persistência em `localStorage`
- 🌐 **Internacionalização (PT/EN)** via dicionário de traduções (`i18n.js`), sem reload de página
- 📱 **Totalmente responsivo**, com breakpoints para mobile, tablet e desktop
- 🔍 **Filtro de projetos por categoria** (UX/UI Design vs. Data & Code) na página de projetos
- 📬 **Formulário de contato funcional**, com:
  - Validação client-side (campos obrigatórios e formato de e-mail)
  - Checagem de domínio de e-mail via DNS antes do envio (evita erros de digitação como `gmail.con`)
  - Proteção anti-spam via honeypot
  - Envio via [Web3Forms](https://web3forms.com/)
- ♿ **Acessibilidade**: HTML semântico, `alt` descritivo em todas as imagens, `aria-label`/`aria-live`, suporte a `prefers-reduced-motion`

## 🛠️ Tecnologias

- **HTML5** semântico
- **CSS3** puro (metodologia BEM, custom properties, sem frameworks)
- **JavaScript** vanilla (sem build step, sem dependências de runtime)
- [Iconify](https://iconify.design/) para ícones
- [Web3Forms](https://web3forms.com/) para envio do formulário de contato

## 📁 Estrutura do projeto

```
dudugama.github.io/
├── index.html          # Página inicial
├── projetos.html        # Listagem de todos os projetos (com filtro por categoria)
├── projeto.html          # Case study: Escritório de Leilões
├── contato.html          # Página de contato (formulário)
├── style.css             # Estilos globais
├── script.js              # Interatividade (menu, tema, i18n, formulário, filtros)
├── i18n.js                # Dicionário de traduções PT/EN
├── imagens/                # Imagens e mockups do site (formato .webp otimizado)
├── files/                   # Currículo em PDF
└── LICENSE
```

## 🚀 Rodando localmente

Como é um site estático, não há build nem instalação de dependências. Basta servir os arquivos:

```bash
# Clone o repositório
git clone https://github.com/dudugama/dudugama.github.io.git
cd dudugama.github.io

# Sirva com qualquer servidor estático, por exemplo:
python3 -m http.server 8000
# ou
npx serve
```

Depois é só abrir `http://localhost:8000` no navegador.

> Servir os arquivos localmente (em vez de abrir o `index.html` direto via `file://`) evita problemas de CORS com as chamadas de DNS usadas na validação do formulário de contato.

## 🎨 Design

A arquitetura de informação e as telas de alta fidelidade do site e do case foram desenhadas no Figma:

🔗 [Ver arquitetura completa no Figma](https://www.figma.com/design/mSgWgML4GlrnI0De7AKHlR/Portfolio?node-id=0-1&t=bNDIwFyIIFzmzn8r-1)

## 📬 Contato

- **E-mail:** [eduardosantosgama@gmail.com](mailto:eduardosantosgama@gmail.com)
- **LinkedIn:** [linkedin.com/in/eduardogamaa](https://linkedin.com/in/eduardogamaa)
- **GitHub:** [github.com/dudugama](https://github.com/dudugama)

## 📄 Licença

Este projeto está sob a licença MIT — veja o arquivo [LICENSE](LICENSE) para mais detalhes.
