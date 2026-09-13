const questions = [
  {
    emoji: "🧋",
    title: "Kalau lagi haus, paling pilih yang mana?",
    options: [
      ["🧋", "Boba / milk tea"],
      ["☕", "Kopi"],
      ["🥤", "Soda"],
      ["💧", "Air mineral"]
    ]
  },
  {
    emoji: "🌙",
    title: "Jam produktif favorit?",
    options: [
      ["🌤️", "Pagi"],
      ["☀️", "Siang"],
      ["🌆", "Sore"],
      ["🌙", "Malam"]
    ]
  },
  {
    emoji: "🎧",
    title: "Kalau lagi sendiri, paling sering ngapain?",
    options: [
      ["🎧", "Dengerin musik"],
      ["🎮", "Main game"],
      ["📱", "Scroll sosmed"],
      ["😴", "Tidur"]
    ]
  },
  {
    emoji: "🍜",
    title: "Comfort food paling aman?",
    options: [
      ["🍜", "Mie"],
      ["🍗", "Ayam"],
      ["🍰", "Dessert"],
      ["🍚", "Nasi + lauk rumahan"]
    ]
  },
  {
    emoji: "💌",
    title: "Kalau lagi sayang sama orang, paling keliatan dari?",
    options: [
      ["💬", "Sering chat"],
      ["🎁", "Kasih sesuatu"],
      ["🫶", "Perhatian kecil"],
      ["😎", "Sok cuek tapi peduli"]
    ]
  },
  {
    emoji: "✈️",
    title: "Kalau liburan dadakan, lebih pilih?",
    options: [
      ["🏖️", "Pantai"],
      ["🏙️", "Kota besar"],
      ["🌲", "Pegunungan"],
      ["🏠", "Staycation aja"]
    ]
  },
  {
    emoji: "🎬",
    title: "Genre tontonan paling menarik?",
    options: [
      ["👻", "Horror"],
      ["💗", "Romance"],
      ["🕵️", "Mystery"],
      ["⚔️", "Action"]
    ]
  },
  {
    emoji: "🛍️",
    title: "Kalau dapat uang lebih, biasanya kepikiran buat?",
    options: [
      ["🛍️", "Belanja"],
      ["🍽️", "Jajan"],
      ["💰", "Nabung"],
      ["🎮", "Top up / hobi"]
    ]
  },
  {
    emoji: "📲",
    title: "Kalau chat dibales lama, reaksinya?",
    options: [
      ["😴", "Santai aja"],
      ["🤨", "Mulai curiga"],
      ["🙄", "Ikutan lama bales"],
      ["📞", "Langsung cari orangnya"]
    ]
  },
  {
    emoji: "✨",
    title: "Satu kata yang paling menggambarkan vibe kamu?",
    options: [
      ["🌷", "Soft"],
      ["🔥", "Chaotic"],
      ["😎", "Cool"],
      ["🫠", "Random"]
    ]
  }
];

const screens = {
  home: document.getElementById("homeScreen"),
  quiz: document.getElementById("quizScreen"),
  share: document.getElementById("shareScreen"),
  friendIntro: document.getElementById("friendIntroScreen"),
  result: document.getElementById("resultScreen")
};

const nameForm = document.getElementById("nameForm");
const ownerName = document.getElementById("ownerName");
const homeError = document.getElementById("homeError");
const modeLabel = document.getElementById("modeLabel");
const questionCount = document.getElementById("questionCount");
const quizProgress = document.getElementById("quizProgress");
const questionEmoji = document.getElementById("questionEmoji");
const questionHint = document.getElementById("questionHint");
const questionTitle = document.getElementById("questionTitle");
const answerOptions = document.getElementById("answerOptions");
const backButton = document.getElementById("backButton");
const nextButton = document.getElementById("nextButton");
const shareTitle = document.getElementById("shareTitle");
const shareLink = document.getElementById("shareLink");
const copyButton = document.getElementById("copyButton");
const copyStatus = document.getElementById("copyStatus");
const previewButton = document.getElementById("previewButton");
const restartButton = document.getElementById("restartButton");
const friendIntroTitle = document.getElementById("friendIntroTitle");
const friendIntroText = document.getElementById("friendIntroText");
const startFriendQuiz = document.getElementById("startFriendQuiz");
const resultEmoji = document.getElementById("resultEmoji");
const resultHeadline = document.getElementById("resultHeadline");
const resultMessage = document.getElementById("resultMessage");
const resultPercent = document.getElementById("resultPercent");
const scoreFill = document.getElementById("scoreFill");
const answerReview = document.getElementById("answerReview");
const retryButton = document.getElementById("retryButton");
const makeOwnButton = document.getElementById("makeOwnButton");

let mode = "owner";
let currentQuestion = 0;
let owner = "";
let ownerAnswers = Array(questions.length).fill(null);
let friendAnswers = Array(questions.length).fill(null);

function showScreen(target) {
  Object.values(screens).forEach(screen => screen.hidden = true);
  screens[target].hidden = false;
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function encodeQuiz(name, answers) {
  const payload = JSON.stringify({ n: name, a: answers });
  return btoa(unescape(encodeURIComponent(payload)));
}

function decodeQuiz(value) {
  try {
    const payload = decodeURIComponent(escape(atob(value)));
    const parsed = JSON.parse(payload);
    if (
      typeof parsed.n === "string" &&
      Array.isArray(parsed.a) &&
      parsed.a.length === questions.length
    ) {
      return parsed;
    }
  } catch (err) {}
  return null;
}

function buildShareLink() {
  const url = new URL(window.location.href);
  url.search = "";
  url.hash = "";
  url.searchParams.set("q", encodeQuiz(owner, ownerAnswers));
  return url.toString();
}

function renderQuestion() {
  const q = questions[currentQuestion];
  const answers = mode === "owner" ? ownerAnswers : friendAnswers;
  const selected = answers[currentQuestion];

  modeLabel.textContent = mode === "owner" ? "VERSI KAMU" : `NEBAK ${owner.toUpperCase()}`;
  questionHint.textContent =
    mode === "owner"
      ? "PILIH YANG PALING KAMU BANGET"
      : `MENURUTMU ${owner.toUpperCase()} PILIH YANG MANA?`;

  questionCount.textContent = `${currentQuestion + 1} / ${questions.length}`;
  quizProgress.value = currentQuestion + 1;
  questionEmoji.textContent = q.emoji;
  questionTitle.textContent = q.title;

  answerOptions.innerHTML = "";

  q.options.forEach((option, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "answer-option";
    if (selected === index) button.classList.add("selected");

    button.innerHTML = `
      <span class="option-icon">${option[0]}</span>
      <span>${option[1]}</span>
    `;

    button.addEventListener("click", () => {
      answers[currentQuestion] = index;
      renderQuestion();
    });

    answerOptions.appendChild(button);
  });

  backButton.disabled = currentQuestion === 0;
  nextButton.disabled = selected === null;
  nextButton.textContent =
    currentQuestion === questions.length - 1
      ? (mode === "owner" ? "Bikin link 🎉" : "Lihat hasil ✨")
      : "Lanjut →";

  setTimeout(() => questionTitle.focus({ preventScroll: true }), 0);
}

function startOwnerQuiz() {
  mode = "owner";
  currentQuestion = 0;
  ownerAnswers = Array(questions.length).fill(null);
  showScreen("quiz");
  renderQuestion();
}

function showShareScreen() {
  shareTitle.textContent = `${owner}, quiz kamu udah jadi!`;
  shareLink.value = buildShareLink();
  copyStatus.textContent = "";
  showScreen("share");
}

function startFriendMode() {
  mode = "friend";
  currentQuestion = 0;
  friendAnswers = Array(questions.length).fill(null);
  showScreen("quiz");
  renderQuestion();
}

function showFriendIntro() {
  friendIntroTitle.textContent = `Seberapa kenal kamu sama ${owner}?`;
  friendIntroText.textContent =
    `Ada ${questions.length} pertanyaan. Pilih jawaban yang menurutmu paling cocok sama ${owner}.`;
  showScreen("friendIntro");
}

function calculateScore() {
  return friendAnswers.reduce((score, answer, index) => {
    return score + (answer === ownerAnswers[index] ? 1 : 0);
  }, 0);
}

function showResult() {
  const score = calculateScore();
  const percent = Math.round((score / questions.length) * 100);

  resultHeadline.textContent = `${score}/${questions.length}!`;
  resultPercent.textContent = `${percent}%`;
  scoreFill.style.width = `${percent}%`;

  let emoji = "🫠";
  let message = `Waduh… kamu masih perlu belajar lore ${owner}.`;

  if (score === 10) {
    emoji = "👑";
    message = `GILA. Kamu benar-benar tahu ${owner} luar dalam. Certified bestie!`;
  } else if (score >= 8) {
    emoji = "🏆";
    message = `Nyaris sempurna! Kamu jelas masuk inner circle ${owner}.`;
  } else if (score >= 6) {
    emoji = "😎";
    message = `Lumayan banget. Kamu ngerti ${owner}, walau masih ada plot twist.`;
  } else if (score >= 4) {
    emoji = "🤨";
    message = `Hmm… kenal sih, tapi kayaknya masih versi trial.`;
  }

  resultEmoji.textContent = emoji;
  resultMessage.textContent = message;

  answerReview.innerHTML = "";

  questions.forEach((q, index) => {
    const correct = friendAnswers[index] === ownerAnswers[index];
    const item = document.createElement("div");
    item.className = `review-item ${correct ? "correct" : "wrong"}`;

    const yourChoice = q.options[friendAnswers[index]];
    const actualChoice = q.options[ownerAnswers[index]];

    item.innerHTML = `
      <strong>${correct ? "✅" : "❌"} ${index + 1}. ${q.title}</strong>
      <span>Jawabanmu: ${yourChoice[0]} ${yourChoice[1]}</span>
      ${correct ? "" : `<span>Jawaban ${owner}: ${actualChoice[0]} ${actualChoice[1]}</span>`}
    `;

    answerReview.appendChild(item);
  });

  showScreen("result");
}

nameForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const name = ownerName.value.trim();

  if (!name) {
    homeError.textContent = "Namanya jangan kosong dong 😭";
    return;
  }

  owner = name;
  homeError.textContent = "";
  startOwnerQuiz();
});

backButton.addEventListener("click", () => {
  if (currentQuestion > 0) {
    currentQuestion -= 1;
    renderQuestion();
  }
});

nextButton.addEventListener("click", () => {
  const answers = mode === "owner" ? ownerAnswers : friendAnswers;
  if (answers[currentQuestion] === null) return;

  if (currentQuestion < questions.length - 1) {
    currentQuestion += 1;
    renderQuestion();
    return;
  }

  if (mode === "owner") {
    showShareScreen();
  } else {
    showResult();
  }
});

copyButton.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(shareLink.value);
    copyStatus.textContent = "Link tersalin! Tinggal kirim ke bestie kamu 💌";
    copyButton.textContent = "Copied ✓";
    setTimeout(() => copyButton.textContent = "Copy link", 1800);
  } catch (err) {
    shareLink.select();
    document.execCommand("copy");
    copyStatus.textContent = "Link tersalin! Tinggal kirim ke bestie kamu 💌";
  }
});

previewButton.addEventListener("click", showFriendIntro);

restartButton.addEventListener("click", () => {
  history.replaceState(null, "", window.location.pathname);
  owner = "";
  ownerName.value = "";
  ownerAnswers = Array(questions.length).fill(null);
  friendAnswers = Array(questions.length).fill(null);
  showScreen("home");
});

startFriendQuiz.addEventListener("click", startFriendMode);

retryButton.addEventListener("click", showFriendIntro);

makeOwnButton.addEventListener("click", () => {
  history.replaceState(null, "", window.location.pathname);
  owner = "";
  ownerName.value = "";
  ownerAnswers = Array(questions.length).fill(null);
  friendAnswers = Array(questions.length).fill(null);
  showScreen("home");
});

(function init() {
  const params = new URLSearchParams(window.location.search);
  const encoded = params.get("q");

  if (!encoded) {
    showScreen("home");
    return;
  }

  const quiz = decodeQuiz(encoded);

  if (!quiz) {
    showScreen("home");
    homeError.textContent = "Link quiz-nya kayaknya rusak. Bikin quiz baru aja ya.";
    return;
  }

  owner = quiz.n;
  ownerAnswers = quiz.a;
  showFriendIntro();
})();
