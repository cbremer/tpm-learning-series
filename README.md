# TPM Learning Series

An interactive learning site for Technical Program Managers to understand modern AI and software technologies — no engineering degree required.

## Modules

### 🤖 AI Fundamentals (`index.html`)
A tabbed, interactive guide covering:
- **Overview** — The AI landscape: AI → ML → Deep Learning → LLMs hierarchy, and the key distinction between AI *products* (apps) and AI *models* (engines)
- **Machine Learning** — How ML works, types of learning (supervised, unsupervised, reinforcement), the ML pipeline, and real-world examples
- **Deep Learning** — Neural networks, why deep learning is a breakthrough, key architectures (CNN, Transformer, Diffusion), with an interactive neural network visual
- **Large Language Models** — Tokens, the attention mechanism (interactive demo), what LLMs can/can't do, and key concepts (RAG, fine-tuning, context window, agents)
- **AI Products vs. Models** — Clear breakdown of ChatGPT vs. GPT-4, Codex app vs. Codex models, Claude.ai vs. Claude Code, Claude Sonnet vs. Claude Opus, plus a knowledge-check quiz

### Features
- 🌙 Dark / light mode toggle
- 📊 Progress tracker (persisted in localStorage)
- 🎓 Interactive quiz with score tracking
- 📱 Fully responsive (mobile-friendly)
- ♿ Accessible (ARIA roles, keyboard navigation)

## Running Locally
Open `index.html` directly in any modern web browser — no build step required.

## Structure
```
index.html   – Main AI Fundamentals learning page
styles.css   – All styles (purple/indigo AI theme, dark mode)
script.js    – Interactivity: tabs, progress, quiz, demos
```

## Contributing / Adding New Modules
This site is designed to grow. To add a new learning module:
1. Create a new HTML file (e.g., `prompt-engineering.html`) following the same structure as `index.html`
2. Link to it from `index.html` or create a dedicated landing page
3. Re-use `styles.css` for consistent styling

