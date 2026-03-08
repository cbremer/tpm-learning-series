/* ── script.js ── */

// ── State ──
const TOPICS = ['intro', 'machine-learning', 'deep-learning', 'llm', 'ai-products'];
const completedTopics = new Set();
const STORAGE_KEY = 'ai-basics-progress';
const THEME_KEY   = 'ai-basics-theme';

// ── Dark / Light Mode ──
function toggleTheme() {
  const isDark   = document.documentElement.getAttribute('data-theme') === 'dark';
  const newTheme = isDark ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', newTheme);
  try {
    localStorage.setItem(THEME_KEY, newTheme);
  } catch (e) { /* ignore storage errors */ }
  const btn = document.getElementById('themeToggle');
  if (btn) btn.textContent = newTheme === 'dark' ? '☀️' : '🌙';
}

function loadTheme() {
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  const btn = document.getElementById('themeToggle');
  if (btn) btn.textContent = isDark ? '☀️' : '🌙';
}

// ── Progress persistence ──
function saveProgress() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...completedTopics]));
    return true;
  } catch (e) {
    return false;
  }
}

function loadProgress() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    saved.forEach(topicId => {
      if (!TOPICS.includes(topicId)) return;
      completedTopics.add(topicId);
      const markBtn = document.querySelector(`.mark-done-btn[data-topic="${topicId}"]`);
      if (markBtn) {
        markBtn.textContent = 'Completed ✓';
        markBtn.classList.add('done-btn');
        markBtn.disabled = true;
      }
      const tabBtn = document.querySelector(`[data-tab="${topicId}"]`);
      if (tabBtn) tabBtn.classList.add('done');
    });
  } catch (e) { /* ignore corrupt data */ } finally {
    updateProgress();
  }
}

// ── Tab navigation ──
function showTab(tabId) {
  document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.tab-btn').forEach(b => {
    b.classList.remove('active');
    b.setAttribute('aria-selected', 'false');
  });

  const panel = document.getElementById(tabId);
  const btn   = document.querySelector(`[data-tab="${tabId}"]`);
  if (panel) panel.classList.add('active');
  if (btn) {
    btn.classList.add('active');
    btn.setAttribute('aria-selected', 'true');
  }
}

// ── Progress tracking ──
function markDone(topicId, btn) {
  completedTopics.add(topicId);
  btn.textContent = 'Completed ✓';
  btn.classList.add('done-btn');
  btn.disabled = true;

  const tabBtn = document.querySelector(`[data-tab="${topicId}"]`);
  if (tabBtn) tabBtn.classList.add('done');

  updateProgress();
  saveProgress();

  // Auto-advance to next topic
  const idx  = TOPICS.indexOf(topicId);
  const next = TOPICS[idx + 1];
  if (next) {
    setTimeout(() => showTab(next), 600);
  }
}

function updateProgress() {
  const total   = TOPICS.length;
  const done    = completedTopics.size;
  const pct     = (done / total) * 100;

  const bar     = document.getElementById('progressBar');
  const label   = document.getElementById('progressLabel');

  if (bar) {
    bar.style.width = `${pct}%`;
    bar.setAttribute('aria-valuenow', String(Math.round(pct)));
  }
  if (label) label.textContent = `${done} / ${total} topics completed`;
}

// ── AI Hierarchy Interactive ──
const hierarchyDetails = {
  ai: {
    title: '🤖 Artificial Intelligence (AI)',
    text: 'The broadest category. AI is any technique that enables machines to mimic human intelligence — reasoning, learning, problem-solving, perception, or language understanding. AI has been around since the 1950s!'
  },
  ml: {
    title: '📊 Machine Learning (ML)',
    text: 'A subset of AI where systems learn from data to improve without being explicitly programmed. Instead of writing rules by hand, you give the model examples and it figures out the patterns itself.'
  },
  dl: {
    title: '🧠 Deep Learning (DL)',
    text: 'A subset of ML that uses artificial neural networks with many layers ("deep" = many layers). Deep learning excels at complex tasks like image recognition, speech, and language — it powers most modern AI breakthroughs.'
  },
  llm: {
    title: '💬 Large Language Models (LLMs)',
    text: 'A subset of deep learning trained on massive amounts of text. LLMs learn to predict and generate language, making them great at writing, summarizing, coding, Q&A, and conversation. GPT-4, Claude, and Gemini are all LLMs.'
  }
};

function showHierarchyDetail(key) {
  const box = document.getElementById('hierarchyDetailBox');
  if (!box) return;
  const d = hierarchyDetails[key];
  if (!d) return;
  box.innerHTML = `<strong>${d.title}</strong><br/><span class="text-muted">${d.text}</span>`;
}

// ── ML Process Steps ──
const mlProcessSteps = {
  1: {
    icon: '📊',
    title: 'Collect Data',
    text: 'Gather labeled examples. For spam detection: thousands of emails labeled "spam" or "not spam". <strong>The quality and quantity of your data is the most important factor in ML.</strong>'
  },
  2: {
    icon: '🧹',
    title: 'Clean & Prepare',
    text: 'Real-world data is messy — missing values, duplicates, inconsistent formats. This "data preprocessing" step often takes 60-80% of an ML project\'s time.'
  },
  3: {
    icon: '🏗️',
    title: 'Choose a Model',
    text: 'Select the type of algorithm: decision tree, linear regression, neural network, etc. The choice depends on your data type, size, and the problem you\'re solving.'
  },
  4: {
    icon: '🎓',
    title: 'Train',
    text: 'Feed the model your training data. It adjusts its internal parameters (weights) to minimize prediction errors. This is the "learning" part — it can take minutes to weeks depending on model size.'
  },
  5: {
    icon: '🧪',
    title: 'Evaluate',
    text: 'Test the model on data it has never seen. Measure accuracy, precision, recall, or other metrics. If performance is poor, go back and adjust data, model type, or training settings.'
  },
  6: {
    icon: '🚀',
    title: 'Deploy',
    text: 'Put the model into production where it makes real predictions. Monitor it over time — data can shift ("data drift") and models can degrade without retraining.'
  }
};

function explainMLStep(step) {
  document.querySelectorAll('.process-step').forEach(s => s.classList.remove('active'));
  const el = document.getElementById(`ml-${step}`);
  if (el) el.classList.add('active');

  const d   = mlProcessSteps[step];
  const box = document.getElementById('mlProcessDetail');
  if (box && d) {
    box.innerHTML = `<strong>${d.icon} Step ${step}: ${d.title}</strong><br/><span class="text-muted">${d.text}</span>`;
  }
}

// ── AI Products & Models data ──
const aiItemDetails = {
  chatgpt: {
    title: '💬 ChatGPT',
    badge: 'Product',
    badgeClass: 'badge-product',
    text: '<strong>What it is:</strong> A consumer product (app/website) made by OpenAI. It\'s a chat interface built on top of OpenAI\'s GPT models.<br/><br/><strong>Who uses it:</strong> Anyone — individuals, students, professionals. Available at chat.openai.com and as a mobile app.<br/><br/><strong>Analogy:</strong> ChatGPT is like Microsoft Word — it\'s the application you use. The GPT model underneath is the engine powering it.'
  },
  codex_app: {
    title: '💻 Codex (App/Agent)',
    badge: 'Product',
    badgeClass: 'badge-product',
    text: '<strong>What it is:</strong> OpenAI\'s coding agent product — a tool that can read your codebase, write code, run tests, and create pull requests autonomously. Launched in 2025.<br/><br/><strong>Who uses it:</strong> Software engineers and developers who want an AI assistant embedded in their development workflow.<br/><br/><strong>Key distinction:</strong> "Codex" the app/product is an agentic coding tool, not just a chat interface.'
  },
  claude_chat: {
    title: '🎭 Claude (claude.ai)',
    badge: 'Product',
    badgeClass: 'badge-product',
    text: '<strong>What it is:</strong> Anthropic\'s consumer-facing AI assistant product, similar to ChatGPT. Available at claude.ai.<br/><br/><strong>Who uses it:</strong> Individuals and teams who prefer Anthropic\'s approach to AI safety and helpfulness.<br/><br/><strong>Models underneath:</strong> Claude products run on Claude models (Haiku, Sonnet, Opus).'
  },
  gpt4: {
    title: '⚙️ GPT-4 / GPT-4o',
    badge: 'Model',
    badgeClass: 'badge-model',
    text: '<strong>What it is:</strong> A specific large language model made by OpenAI. GPT-4 is the 4th generation model; GPT-4o ("omni") handles text, images, and audio.<br/><br/><strong>How it\'s used:</strong> Via the OpenAI API — developers integrate it into their own applications. ChatGPT uses GPT-4 models under the hood.<br/><br/><strong>Versions:</strong> Models have specific versions like <code>gpt-4-turbo</code>, <code>gpt-4o</code>, <code>gpt-4o-mini</code> for different speed/cost tradeoffs.'
  },
  codex_model: {
    title: '🔢 Codex Models (codex-mini, etc.)',
    badge: 'API Model',
    badgeClass: 'badge-api',
    text: '<strong>What it is:</strong> OpenAI\'s code-specialized models, available through the API. Models like <code>codex-mini-latest</code> are optimized specifically for code generation and understanding.<br/><br/><strong>How it\'s used:</strong> Developers call these models via the OpenAI API, often in agentic or automated workflows.<br/><br/><strong>Historical note:</strong> The original "Codex" model (2021) was the foundation for GitHub Copilot. The name now refers to newer, more powerful code models.'
  },
  claude_sonnet: {
    title: '🎵 Claude Sonnet',
    badge: 'Model',
    badgeClass: 'badge-model',
    text: '<strong>What it is:</strong> Anthropic\'s mid-tier Claude model — balances speed, capability, and cost. Sonnet is the "workhorse" model in the Claude family.<br/><br/><strong>Best for:</strong> Most everyday AI tasks — writing, analysis, coding assistance, summarization. Faster and cheaper than Opus.<br/><br/><strong>Versions:</strong> Released in numbered series, e.g. <code>claude-sonnet-4-5</code>, <code>claude-3-7-sonnet</code>.'
  },
  claude_opus: {
    title: '🏛️ Claude Opus',
    badge: 'Model',
    badgeClass: 'badge-model',
    text: '<strong>What it is:</strong> Anthropic\'s most powerful Claude model — the top of the Claude model family. Higher capability, but slower and more expensive than Sonnet.<br/><br/><strong>Best for:</strong> Complex reasoning, nuanced writing, hard analytical tasks where quality matters more than speed or cost.<br/><br/><strong>Versions:</strong> e.g. <code>claude-opus-4-5</code>.'
  },
  claude_code: {
    title: '🛠️ Claude Code',
    badge: 'Product',
    badgeClass: 'badge-product',
    text: '<strong>What it is:</strong> Anthropic\'s agentic coding tool (similar to OpenAI\'s Codex app) — a CLI-based coding agent that reads your entire codebase and can write code, run commands, and make commits.<br/><br/><strong>Runs on:</strong> Typically uses Claude Sonnet or Opus models under the hood.<br/><br/><strong>Key distinction:</strong> Claude Code is a <em>product</em> (a coding agent), while "Claude Sonnet" and "Claude Opus" are the underlying <em>models</em> it can use. Think of it like: the app vs. the engine.'
  }
};

function showModelDetail(key) {
  // Toggle active state
  document.querySelectorAll('.model-card').forEach(c => c.classList.remove('active'));
  const card = document.querySelector(`[data-model="${key}"]`);
  if (card) card.classList.add('active');

  const box = document.getElementById('modelDetailBox');
  if (!box) return;
  const d = aiItemDetails[key];
  if (!d) return;
  box.innerHTML = `
    <strong>${d.title}</strong> <span class="mc-badge ${d.badgeClass}">${d.badge}</span><br/>
    <span class="text-muted" style="font-size:.92rem">${d.text}</span>
  `;
}

// ── Attention demo ──
function showAttention(word) {
  document.querySelectorAll('.attention-word').forEach(w => {
    w.className = 'attention-word highlight-low';
  });
  const explanations = {
    'The':     { targets: ['The'], desc: '"The" is a determiner — it has low semantic weight in most contexts.' },
    'bank':    { targets: ['bank', 'river', 'money'], desc: '"Bank" is ambiguous! The model attends strongly to "river" and "money" to figure out which meaning is correct.' },
    'by':      { targets: ['by', 'river', 'bank'], desc: '"By" indicates location — the model connects it to "river" and "bank" to understand spatial context.' },
    'the':     { targets: ['the', 'river'], desc: 'Second "the" — pairs closely with "river" ahead of it.' },
    'river':   { targets: ['river', 'bank', 'was'], desc: '"River" is a key disambiguation word — it helps the model understand that "bank" means riverbank, not a financial institution.' },
    'was':     { targets: ['was', 'flooded'], desc: '"Was" sets up past tense — attends to "flooded" to complete the predicate.' },
    'flooded': { targets: ['flooded', 'river', 'bank'], desc: '"Flooded" is the key action. The model connects it back to "bank" and "river" to understand the full meaning.' }
  };
  const info = explanations[word];
  if (!info) return;

  info.targets.forEach(t => {
    const el = document.querySelector(`.attention-word[data-word="${t}"]`);
    if (el) {
      el.className = t === word ? 'attention-word highlight-high' : 'attention-word highlight-med';
    }
  });

  const expEl = document.getElementById('attentionExplanation');
  if (expEl) expEl.textContent = info.desc;
}

// ── Quiz ──
const QUESTIONS = [
  {
    q: 'Which of the following is the correct hierarchy from broadest to most specific?',
    options: [
      'LLMs → Deep Learning → Machine Learning → AI',
      'AI → Machine Learning → Deep Learning → LLMs',
      'Machine Learning → AI → Deep Learning → LLMs',
      'Deep Learning → LLMs → AI → Machine Learning'
    ],
    correct: 1,
    explanation: '✅ Correct! AI is the broadest field. Machine Learning is a subset of AI. Deep Learning is a subset of ML. LLMs are a subset of Deep Learning.'
  },
  {
    q: 'What is the key difference between "ChatGPT" and "GPT-4"?',
    options: [
      'They are the same thing',
      'GPT-4 is the product; ChatGPT is the underlying model',
      'ChatGPT is the product (app); GPT-4 is the underlying AI model',
      'ChatGPT is only for coding tasks'
    ],
    correct: 2,
    explanation: '✅ Correct! ChatGPT is the consumer product/application. GPT-4 is the underlying AI model that powers it. This is like the difference between the car (product) and the engine (model).'
  },
  {
    q: 'What makes "deep" learning "deep"?',
    options: [
      'It uses very large datasets',
      'It can understand complex emotions',
      'It uses neural networks with many layers',
      'It takes a long time to train'
    ],
    correct: 2,
    explanation: '✅ Correct! "Deep" refers to the many layers in the neural network architecture. More layers allow the model to learn increasingly abstract representations of the data.'
  },
  {
    q: 'In machine learning, what does "training" mean?',
    options: [
      'Teaching humans how to use AI tools',
      'The process where a model adjusts its parameters by learning patterns from data',
      'Writing the code for a machine learning model',
      'Running tests on a completed model'
    ],
    correct: 1,
    explanation: '✅ Correct! Training is when the model sees labeled examples and adjusts its internal parameters (weights) to minimize prediction errors. This is the "learning" in machine learning.'
  },
  {
    q: 'What is the key difference between "Claude Code" and "Claude Sonnet"?',
    options: [
      'Claude Code is cheaper than Claude Sonnet',
      'Claude Sonnet is a product; Claude Code is a model',
      'Claude Code is an agentic coding product; Claude Sonnet is the underlying AI model',
      'They are different names for the same thing'
    ],
    correct: 2,
    explanation: '✅ Correct! Claude Code is a product — an agentic coding tool that runs in your terminal and can write code and make commits. Claude Sonnet is an AI model that Claude Code (and other products) can use under the hood.'
  }
];

let currentQuestion = 0;
let score = 0;
let quizAnswered = false;

function renderQuestion() {
  const q          = QUESTIONS[currentQuestion];
  const qEl        = document.getElementById('quizQuestion');
  const optEl      = document.getElementById('quizOptions');
  const feedEl     = document.getElementById('quizFeedback');
  const nextBtn    = document.getElementById('quizNextBtn');
  const progressEl = document.getElementById('quizProgress');

  if (!qEl) return;

  qEl.textContent  = `Q${currentQuestion + 1}: ${q.q}`;
  feedEl.textContent = '';
  nextBtn.style.display = 'none';
  quizAnswered = false;

  optEl.innerHTML = '';
  q.options.forEach((opt, i) => {
    const btn = document.createElement('button');
    btn.className   = 'quiz-option';
    btn.textContent = opt;
    btn.onclick     = () => answerQuestion(i);
    optEl.appendChild(btn);
  });

  progressEl.textContent = `Question ${currentQuestion + 1} of ${QUESTIONS.length}`;
}

function answerQuestion(selectedIndex) {
  if (quizAnswered) return;
  quizAnswered = true;

  const q       = QUESTIONS[currentQuestion];
  const options = document.querySelectorAll('.quiz-option');
  const feedEl  = document.getElementById('quizFeedback');
  const nextBtn = document.getElementById('quizNextBtn');

  options.forEach((btn, i) => {
    btn.disabled = true;
    if (i === q.correct)   btn.classList.add('correct');
    if (i === selectedIndex && i !== q.correct) btn.classList.add('wrong');
  });

  if (selectedIndex === q.correct) {
    score++;
    feedEl.style.color = '#059669';
    feedEl.textContent = q.explanation;
  } else {
    const wrongExplanation = q.explanation.replace(/^✅ Correct!\s*/, '');
    feedEl.style.color = 'var(--danger)';
    feedEl.textContent = `❌ Not quite. ${wrongExplanation}`;
  }

  const isLast = currentQuestion === QUESTIONS.length - 1;
  nextBtn.textContent   = isLast ? 'See Results 🎉' : 'Next Question →';
  nextBtn.style.display = 'inline-block';
}

function nextQuestion() {
  currentQuestion++;
  if (currentQuestion >= QUESTIONS.length) {
    showQuizResults();
  } else {
    renderQuestion();
  }
}

function showQuizResults() {
  const container = document.getElementById('quizContainer');
  if (!container) return;
  const pct   = Math.round((score / QUESTIONS.length) * 100);
  const emoji   = pct === 100 ? '🏆' : pct >= 60 ? '👍' : '📖';
  const message = pct === 100
    ? 'Perfect score! You\'re an AI expert!'
    : pct >= 60
    ? 'Great job! Review any topics you missed above.'
    : 'Keep learning! Revisit the tabs above to strengthen your understanding.';

  container.innerHTML = `
    <div class="quiz-complete">
      <div class="quiz-result-emoji">${emoji}</div>
      <div class="score" style="font-size:1.8rem;font-weight:700">${score} / ${QUESTIONS.length}</div>
      <p class="quiz-result-message">${message}</p>
      <p class="quiz-result-pct">Score: ${pct}%</p>
      <button class="quiz-next-btn quiz-retry-btn" onclick="restartQuiz()">Retry Quiz 🔄</button>
    </div>
  `;
}

function restartQuiz() {
  currentQuestion = 0;
  score = 0;
  quizAnswered = false;

  const container = document.getElementById('quizContainer');
  if (!container) return;

  container.innerHTML = `
    <div class="quiz-question" id="quizQuestion"></div>
    <div class="quiz-options" id="quizOptions"></div>
    <div class="quiz-feedback" id="quizFeedback"></div>
    <button class="quiz-next-btn" id="quizNextBtn" onclick="nextQuestion()" style="display:none">Next Question →</button>
    <div class="quiz-progress" id="quizProgress"></div>
  `;
  renderQuestion();
}

// ── Init ──
document.addEventListener('DOMContentLoaded', () => {
  loadTheme();
  restartQuiz();
  loadProgress();
});
