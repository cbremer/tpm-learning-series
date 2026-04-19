/* ── script.js ── */

// ── State ──
const TOPICS = ['intro', 'machine-learning', 'deep-learning', 'llm', 'ai-products', 'scenarios', 'lifecycle', 'stakeholder', 'prompts', 'ethics'];
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
    text: '<strong>What it is:</strong> Anthropic\'s mid-tier Claude model — balances speed, capability, and cost. Sonnet is the "workhorse" model in the Claude family.<br/><br/><strong>Best for:</strong> Most everyday AI tasks — writing, analysis, coding assistance, summarization. Faster and cheaper than Opus.<br/><br/><strong>Versions:</strong> Models have identifiers like <code>claude-3-5-sonnet-20241022</code> or <code>claude-3-7-sonnet-20250219</code>.'
  },
  claude_opus: {
    title: '🏛️ Claude Opus',
    badge: 'Model',
    badgeClass: 'badge-model',
    text: '<strong>What it is:</strong> Anthropic\'s most powerful Claude model — the top of the Claude model family. Higher capability, but slower and more expensive than Sonnet.<br/><br/><strong>Best for:</strong> Complex reasoning, nuanced writing, hard analytical tasks where quality matters more than speed or cost.<br/><br/><strong>Versions:</strong> e.g. <code>claude-3-opus-20240229</code>.'
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
    'bank':    { targets: ['bank', 'river'], desc: '"Bank" is ambiguous! The model attends strongly to "river" to figure out which meaning is correct — riverbank, not a financial institution.' },
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
    q: 'What does "data drift" mean in an ML context?',
    options: [
      'The model\'s code has a bug that makes it slow',
      'The statistical properties of real-world data change over time, degrading model performance',
      'Data is stored in the wrong database',
      'A dataset is too small to train on'
    ],
    correct: 1,
    explanation: '✅ Correct! Data drift occurs when the real-world data the model receives in production changes from the data it was trained on. This can silently degrade model quality — which is why monitoring is critical.'
  },
  {
    q: 'In a typical ML project, which phase consumes the most time?',
    options: [
      'Choosing the model architecture',
      'Training the model',
      'Data collection, cleaning, and preparation',
      'Deploying the model to production'
    ],
    correct: 2,
    explanation: '✅ Correct! Data work (collection, cleaning, labeling, preparation) typically takes 60–80% of total project time. The "data quality is #1" principle plays out in practice here.'
  },
  {
    q: 'What does "MLOps" stand for and what does it focus on?',
    options: [
      'Machine Learning Operations — practices for deploying, monitoring, and maintaining ML models in production',
      'Multi-Layer Optimization — reducing the number of model layers',
      'Mobile Learning Operations — running ML on mobile devices',
      'Model Labeling Operations — the process of annotating training data'
    ],
    correct: 0,
    explanation: '✅ Correct! MLOps (Machine Learning Operations) applies DevOps principles to ML systems, covering deployment pipelines, model versioning, performance monitoring, and automated retraining.'
  },
  {
    q: 'What is "A/B testing" used for in AI/ML products?',
    options: [
      'Testing two different programming languages for the same model',
      'Comparing two model versions (or configurations) in production to see which performs better',
      'Running a model on two different cloud providers simultaneously',
      'Validating a model against alphabetical vs. numerical datasets'
    ],
    correct: 1,
    explanation: '✅ Correct! A/B testing (also called champion/challenger testing) lets you safely roll out a new model version to a subset of users and compare its real-world performance against the existing model before full rollout.'
  },
  {
    q: 'When explaining a model\'s "precision" to a non-technical stakeholder, the best analogy is:',
    options: [
      '"How fast the model runs on your laptop"',
      '"Of all the positive predictions the model made, how many were actually correct"',
      '"How many examples were used to train the model"',
      '"Whether the model can handle multiple languages"'
    ],
    correct: 1,
    explanation: '✅ Correct! Precision = "when the model says yes, how often is it right?" A useful real-world frame: if a spam filter flags 100 emails as spam and 90 are actually spam, its precision is 90%.'
  },
  {
    q: 'A stakeholder asks: "Why did the AI make that decision?" This relates to which AI concept?',
    options: [
      'Model training speed',
      'Explainability / Interpretability — the ability to understand and communicate why a model produced a specific output',
      'Data pipeline throughput',
      'Token context window size'
    ],
    correct: 1,
    explanation: '✅ Correct! Explainability (or interpretability) addresses the "black box" problem. Stakeholders, regulators, and users often need to understand why an AI made a decision — especially in high-stakes domains like lending, healthcare, or hiring.'
  },
  {
    q: 'What is "few-shot prompting"?',
    options: [
      'Sending only a short prompt to save tokens',
      'Providing a small number of input→output examples inside the prompt to guide the model\'s response format',
      'Training a model on a very small dataset',
      'Using an LLM with a small context window'
    ],
    correct: 1,
    explanation: '✅ Correct! Few-shot prompting provides 2–5 worked examples directly in the prompt (e.g., input → expected output pairs). This helps the LLM understand the exact format and style you want without fine-tuning.'
  },
  {
    q: 'What is "chain-of-thought" (CoT) prompting?',
    options: [
      'Chaining multiple LLM API calls together in a pipeline',
      'Asking the model to show its step-by-step reasoning before giving a final answer',
      'Using multiple prompts to translate text between languages',
      'Connecting a model to a vector database for retrieval'
    ],
    correct: 1,
    explanation: '✅ Correct! Chain-of-thought prompting tells the model to "think step by step" before answering. This dramatically improves performance on math, logic, and multi-step reasoning tasks.'
  },
  {
    q: 'What is AI "hallucination"?',
    options: [
      'A visual glitch that occurs when generating images',
      'When a model produces confident-sounding but factually incorrect or fabricated information',
      'The model running too slowly due to high compute demands',
      'A security vulnerability in model APIs'
    ],
    correct: 1,
    explanation: '✅ Correct! LLMs can generate plausible-sounding but wrong information — inventing citations, misquoting facts, or fabricating data — while sounding confident. Always verify important factual claims from LLM outputs.'
  },
  {
    q: 'Which regulation specifically applies to AI systems used in the European Union?',
    options: [
      'HIPAA',
      'The EU AI Act — a risk-based framework that categorizes AI systems by risk level',
      'CCPA',
      'SOC 2'
    ],
    correct: 1,
    explanation: '✅ Correct! The EU AI Act (2024) is the world\'s first comprehensive AI law. It classifies AI applications by risk (unacceptable, high, limited, minimal) and imposes requirements accordingly — including transparency, human oversight, and conformity assessments for high-risk systems.'
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

  if (!qEl || !optEl || !feedEl || !nextBtn || !progressEl) return;

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

// ── Keyboard navigation for tablist (WAI-ARIA pattern) ──
function initTabKeyboardNav() {
  const nav = document.querySelector('.topic-nav[role="tablist"]');
  if (!nav) return;
  nav.addEventListener('keydown', (e) => {
    const tabs = [...nav.querySelectorAll('[role="tab"]')];
    const current = tabs.indexOf(document.activeElement);
    if (current === -1) return;

    let next = -1;
    if (e.key === 'ArrowRight') next = (current + 1) % tabs.length;
    if (e.key === 'ArrowLeft')  next = (current - 1 + tabs.length) % tabs.length;
    if (e.key === 'Home')       next = 0;
    if (e.key === 'End')        next = tabs.length - 1;

    if (next !== -1) {
      e.preventDefault();
      tabs[next].focus();
      showTab(tabs[next].getAttribute('data-tab'));
    }
  });
}

// ── TPM Scenarios ──
const scenarioDetails = {
  data_pipeline: {
    title: '📉 Data Pipeline Delays',
    challenge: 'The data engineering team says the training data won\'t be ready for 3 more weeks, blocking your ML team.',
    tpmActions: [
      'Map the dependency: which model training milestones are blocked vs. unblocked?',
      'Ask what subset of data is available now — can the team start with a smaller slice?',
      'Negotiate parallel workstreams: model architecture work, infrastructure setup, evaluation framework.',
      'Re-baseline the timeline with stakeholders — communicate the impact and revised delivery date.',
      'Identify the root cause: upstream data source? Schema changes? Labeling backlog?'
    ],
    watchFor: 'Teams often underestimate labeling time. Ask specifically: "Is the data collected, or does it still need to be labeled/annotated?"'
  },
  model_perf: {
    title: '📊 Model Performance Below Target',
    challenge: 'The model reaches 72% accuracy but the product requirement was 85%. Launch is in 6 weeks.',
    tpmActions: [
      'Ask the team to diagnose the gap: is it a data problem, model architecture problem, or evaluation problem?',
      'Challenge the 85% target — is it based on user research or was it an aspirational guess?',
      'Explore the 80/20: what subset of use cases hits 90%+ accuracy? Could you launch scoped to those?',
      'Discuss a phased launch: human-in-the-loop review for low-confidence predictions.',
      'Set up a war room cadence: daily standup on accuracy improvement experiments.'
    ],
    watchFor: 'Beware of "accuracy theater" — overall accuracy can look fine while the model fails badly on minority classes that matter most to users.'
  },
  scope_creep: {
    title: '🌊 AI Scope Creep',
    challenge: 'Stakeholders keep adding new model capabilities mid-sprint: "Can it also do sentiment analysis? And detect language?"',
    tpmActions: [
      'Document every request in a backlog with the requestor and business justification.',
      'Protect the current sprint — apply standard change control, even for "quick" additions.',
      'Quantify the cost: "Adding that feature moves our delivery date by 2 weeks."',
      'Hold a roadmap review meeting to prioritize the backlog together with stakeholders.',
      'Separate the MVP from the future wishlist — use a Now/Next/Later framework.'
    ],
    watchFor: 'ML tasks take longer than expected because experimentation is non-linear. A "small" new feature may require a fundamentally different model architecture.'
  },
  team_coord: {
    title: '🤝 Research vs. Engineering Friction',
    challenge: 'Research scientists deliver promising model prototypes, but ML engineers say they\'re "unshippable" — not production-ready.',
    tpmActions: [
      'Define "done" jointly: create shared Definition of Done that includes production readiness criteria.',
      'Embed a production engineering requirement in research milestones — not just accuracy numbers.',
      'Run a tech transfer session: researcher walks engineer through the model, code, and assumptions.',
      'Build a production readiness checklist: latency targets, memory footprint, logging, monitoring hooks.',
      'Allocate explicit "productionization" time in the project plan — it\'s always underestimated.'
    ],
    watchFor: 'Research prototypes often use different libraries, data formats, and assumptions than production. Budget 2–4x the prototype time for productionization.'
  },
  stakeholder_pressure: {
    title: '📣 Unrealistic Stakeholder Expectations',
    challenge: 'An executive saw a ChatGPT demo and now expects your team to build "the same thing" in 8 weeks.',
    tpmActions: [
      'Anchor on the specific business problem — "what decision or outcome do you want AI to improve?"',
      'Educate on the AI spectrum: a GPT-4-like model took thousands of GPUs and billions of dollars to train.',
      'Propose a realistic MVP: a narrowly scoped solution using existing APIs or fine-tuned models.',
      'Share a reference timeline: typical enterprise AI project = 3–9 months from problem definition to production.',
      'Use the "buy vs. build" lens: can you achieve 80% of the value by integrating an existing API today?'
    ],
    watchFor: 'Demo ≠ production. Live demos use ideal inputs, skip edge cases, and hide failure modes. Always distinguish demo performance from real-world reliability.'
  }
};

function showScenario(key) {
  document.querySelectorAll('.scenario-card').forEach(c => c.classList.remove('active'));
  const card = document.querySelector(`[data-scenario="${key}"]`);
  if (card) card.classList.add('active');

  const box = document.getElementById('scenarioDetailBox');
  if (!box) return;
  const d = scenarioDetails[key];
  if (!d) return;

  const actionsHtml = d.tpmActions.map(a => `<li style="padding:.25rem 0;font-size:.9rem">✅ ${a}</li>`).join('');
  box.innerHTML = `
    <strong>${d.title}</strong><br/>
    <div style="font-size:.88rem;color:var(--muted)">
      <strong>Scenario:</strong> ${d.challenge}<br/><br/>
      <strong>TPM Actions:</strong>
      <ul style="list-style:none;padding:0;margin:.5rem 0">${actionsHtml}</ul>
      <div style="background:#fef3c7;border:1px solid #fcd34d;border-radius:8px;padding:.75rem 1rem;margin-top:.5rem">
        <strong>⚠️ Watch for:</strong> ${d.watchFor}
      </div>
    </div>
  `;
}

// ── AI Lifecycle ──
const lifecycleSteps = {
  1: {
    icon: '🔭', title: 'Discover',
    text: '<strong>Identify the business problem.</strong> Not every problem needs AI. Ask: Does this problem have enough data? Is the ROI worth the complexity? Could a simpler rule-based system work? <br/><br/><strong>TPM focus:</strong> Facilitate problem framing workshops. Challenge the "we need AI" assumption. Document success metrics upfront.'
  },
  2: {
    icon: '📋', title: 'Define',
    text: '<strong>Scope the ML problem.</strong> Translate the business objective into an ML task: classification, regression, ranking, generation? Define input data, expected output, and measurable accuracy targets. <br/><br/><strong>TPM focus:</strong> Get explicit alignment on "good enough" criteria. Ambiguous success metrics derail projects later.'
  },
  3: {
    icon: '🗄️', title: 'Data',
    text: '<strong>Collect, label, and prepare training data.</strong> This phase takes 60–80% of project time. Involves data sourcing, cleaning, deduplication, labeling/annotation, and train/validation/test splitting. <br/><br/><strong>TPM focus:</strong> Track labeling progress as a first-class milestone. Data quality is the #1 predictor of model quality.'
  },
  4: {
    icon: '🔬', title: 'Experiment',
    text: '<strong>Explore model approaches.</strong> Data scientists run experiments: baseline models, feature engineering, architecture choices, hyperparameter tuning. This is non-linear — expect iteration. <br/><br/><strong>TPM focus:</strong> Track experiments as tickets. Ask "what did we learn?" not just "did it work?" Use MLflow, W&B, or similar tools to log runs.'
  },
  5: {
    icon: '🏗️', title: 'Build',
    text: '<strong>Develop the production model and pipeline.</strong> The winning experiment gets productionized: training pipelines, serving infrastructure, preprocessing code, model versioning. <br/><br/><strong>TPM focus:</strong> This is where research→engineering handoff friction peaks. Have a shared Definition of Done that includes latency, memory, and reliability requirements.'
  },
  6: {
    icon: '🧪', title: 'Evaluate',
    text: '<strong>Validate model quality and safety.</strong> Offline evaluation (hold-out test sets), bias audits, edge case testing, and stakeholder reviews before launch. <br/><br/><strong>TPM focus:</strong> Don\'t skip bias testing. Ensure the test set reflects real production distribution, not just the easy cases.'
  },
  7: {
    icon: '🚀', title: 'Deploy',
    text: '<strong>Release to production.</strong> Shadow mode first (log predictions without acting on them), then canary release (small % of traffic), then full rollout. Set up a rollback plan. <br/><br/><strong>TPM focus:</strong> Agree on rollback criteria before deploying. Who has the authority to roll back, and what triggers it?'
  },
  8: {
    icon: '📡', title: 'Monitor & Iterate',
    text: '<strong>Track production performance continuously.</strong> Monitor prediction quality, data drift, latency, error rates, and business KPIs. Schedule retraining cycles. <br/><br/><strong>TPM focus:</strong> ML is never "done." Build monitoring and retraining into the ongoing operational plan — not a one-time launch activity.'
  }
};

function showLifecycleStep(step) {
  document.querySelectorAll('.lifecycle-step').forEach(s => s.classList.remove('active'));
  const el = document.getElementById(`lc-${step}`);
  if (el) el.classList.add('active');

  const d   = lifecycleSteps[step];
  const box = document.getElementById('lifecycleDetail');
  if (box && d) {
    box.innerHTML = `<strong>${d.icon} Phase ${step}: ${d.title}</strong><br/><span class="text-muted" style="font-size:.92rem">${d.text}</span>`;
  }
}

// ── Prompt Engineering ──
const promptTechniques = {
  zero_shot: {
    icon: '🎯', title: 'Zero-Shot',
    desc: 'Ask directly — no examples provided',
    explanation: 'The simplest technique. You describe the task and trust the model\'s pre-trained knowledge. Works well for common tasks; less reliable for niche formats.',
    example: `Classify the sentiment of this customer review as Positive, Negative, or Neutral.

Review: "The delivery was two days late but the product quality exceeded my expectations."

Sentiment:`
  },
  few_shot: {
    icon: '📋', title: 'Few-Shot',
    desc: 'Provide 2–5 examples in the prompt',
    explanation: 'Showing the model examples of the desired input→output pattern dramatically improves format consistency and accuracy, especially for custom tasks.',
    example: `Classify sentiment. Examples:
Review: "Fast shipping, great quality!" → Positive
Review: "Arrived broken, terrible support." → Negative
Review: "It works as described." → Neutral

Now classify:
Review: "The color was different than pictured but it fits well." →`
  },
  chain_of_thought: {
    icon: '🔗', title: 'Chain-of-Thought',
    desc: 'Ask the model to reason step by step',
    explanation: 'Adding "think step by step" or "let\'s reason through this" significantly improves performance on math, logic, planning, and multi-step problems.',
    example: `A team has 3 ML engineers and 2 data scientists. Each ML engineer needs 2 weeks for a task; each data scientist needs 3 weeks for theirs. If all tasks must complete before launch, what is the minimum launch date if they start on Jan 6?

Think step by step before giving the final answer.`
  },
  role_prompting: {
    icon: '🎭', title: 'Role Prompting',
    desc: 'Assign a persona or role to the model',
    explanation: 'Framing the model as an expert in a domain (e.g., "You are a senior TPM at a tech company") helps it adopt the appropriate tone, vocabulary, and depth of response.',
    example: `You are a senior Technical Program Manager at a large tech company with 10 years of experience managing AI/ML projects.

A VP asks you: "Our model's precision dropped from 91% to 84% in the last two weeks. What should I be worried about and what actions should we take?"

Provide a structured response with your immediate concerns and recommended next steps.`
  },
  structured_output: {
    icon: '📊', title: 'Structured Output',
    desc: 'Request a specific format (JSON, table, list)',
    explanation: 'Specifying the exact output format (JSON schema, markdown table, numbered list) makes LLM output much easier to parse programmatically or present to stakeholders.',
    example: `Summarize the following project status update as a JSON object with these fields: status (Green/Yellow/Red), summary (one sentence), blockers (array of strings), next_actions (array of strings).

Update: "The model training completed on schedule. However, we discovered the test set had 15% label noise, so evaluation results may be inflated. We're re-labeling 500 samples this week before re-running evaluation. The data team needs access to the annotation tool by Thursday."`
  }
};

function showPromptTechnique(key) {
  document.querySelectorAll('.prompt-tech-card').forEach(c => c.classList.remove('active'));
  const card = document.querySelector(`[data-technique="${key}"]`);
  if (card) card.classList.add('active');

  const box = document.getElementById('promptDetailBox');
  if (!box) return;
  const d = promptTechniques[key];
  if (!d) return;

  box.innerHTML = `
    <strong>${d.icon} ${d.title}</strong><br/>
    <span class="text-muted" style="font-size:.9rem">${d.explanation}</span>
    <br/><br/>
    <span class="prompt-label">Example Prompt</span>
    <div class="prompt-box">${d.example}</div>
  `;
}

// ── Ethics Checklist ──
function toggleChecklist(el) {
  el.classList.toggle('checked');
  const isChecked = el.classList.contains('checked');
  el.setAttribute('aria-checked', String(isChecked));
  const check = el.querySelector('.checklist-check');
  if (check) check.textContent = isChecked ? '✓' : '';
}

// ── Init ──
document.addEventListener('DOMContentLoaded', () => {
  loadTheme();
  restartQuiz();
  loadProgress();
  initTabKeyboardNav();
});
