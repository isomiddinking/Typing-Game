const timeSelect = document.getElementById("time");
const startBtn = document.getElementById("start");
const restartBtn = document.getElementById("restart");
const timerEl = document.getElementById("timer");
const inputEl = document.getElementById("input");
const wordDisplay = document.getElementById("word-display");
const errorEl = document.getElementById("errors");
const correctEl = document.getElementById("correct");
const scoreEl = document.getElementById("score");
const wpmEl = document.getElementById("wpm");

const words = [
  "kod", "funksiya", "o'zgaruvchi", "sikl", "shart operatori", "massiv", 
  "objekt", "metod", "debug", "test", "server", "klient", "API", "framework", "bug"
];

let interval;
let time = 0;
let currentIndex = 0;
let correctWords = 0;
let errorCount = 0;
let startedAt = 0;
let usedWords = [];

function startGame() {
  time = parseInt(timeSelect.value);
  currentIndex = 0;
  correctWords = 0;
  errorCount = 0;
  usedWords = []; // So'zlar tarixini tozalash
  wordDisplay.classList.remove("hidden");
  inputEl.classList.remove("hidden");
  restartBtn.classList.add("hidden");
  inputEl.value = "";
  inputEl.focus();
  updateWord();
  startedAt = Date.now();
  updateStats();
  interval = setInterval(updateTimer, 1000);
}

function updateWord() {
  let word;
  // Yangi so'z tanlash, avvalgi ishlatilgan so'zlarni chiqarib tashlash
  do {
    word = words[Math.floor(Math.random() * words.length)];
  } while (usedWords.includes(word));
  
  usedWords.push(word);
  wordDisplay.textContent = word.toUpperCase(); // So'zlarni kattaroq qilib ko'rsatish
}

function updateTimer() {
  const elapsed = Math.floor((Date.now() - startedAt) / 1000);
  const remaining = time - elapsed;
  timerEl.textContent = `Qolgan vaqt: ${remaining}s`;
  if (remaining <= 0) {
    finishGame();
  }
}

function handleInput(e) {
  if (e.key === "Enter") { // Faqat Enter tugmasi ishlaydi
    e.preventDefault();
    const typed = inputEl.value.trim();
    const expected = wordDisplay.textContent.trim().toLowerCase(); // So'zni kichik harflarda tekshirish
    if (typed === expected) {
      correctWords++;
    } else {
      errorCount += countErrors(typed, expected);
    }
    inputEl.value = "";
    updateWord();
    updateStats();
  }
}

function countErrors(input, expected) {
  let errors = 0;
  for (let i = 0; i < Math.max(input.length, expected.length); i++) {
    if (input[i] !== expected[i]) errors++;
  }
  return errors;
}

function updateStats() {
  errorEl.textContent = errorCount;
  correctEl.textContent = correctWords;
  const totalWords = correctWords + errorCount;
  const score = totalWords > 0 ? Math.round((correctWords / totalWords) * 100) : 0;
  scoreEl.textContent = `${score}`;
  const elapsedMin = (Date.now() - startedAt) / 60000;
  const wpm = Math.round(correctWords / elapsedMin);
  wpmEl.textContent = wpm || 0;
}

function finishGame() {
  clearInterval(interval);
  inputEl.classList.add("hidden");
  restartBtn.classList.remove("hidden");
  wordDisplay.classList.add("hidden");
}

function restartGame() {
  location.reload(); // Sahifani yangilash
}

inputEl.addEventListener("keydown", handleInput);
startBtn.addEventListener("click", startGame);
restartBtn.addEventListener("click", () => {
  restartGame();
});
