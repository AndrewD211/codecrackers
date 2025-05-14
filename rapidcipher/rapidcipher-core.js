window.RapidCipherState = {
  completed: {},
  unlockedHints: {},
  score: 0,
  maxPoints: 100,
  timerInterval: null,
  timeLimit: 45,
  timeRemaining: 45
};

function caesarEncrypt(word, shift = 3) {
  return word.toUpperCase().replace(/[A-Z]/g, c =>
    String.fromCharCode(((c.charCodeAt(0) - 65 + shift) % 26) + 65));
}

function runVigenereEncrypt(msg, key) {
  msg = msg.toUpperCase().replace(/[^A-Z]/g, "");
  key = key.toUpperCase();
  let out = "";
  for (let i = 0; i < msg.length; i++) {
    const m = msg.charCodeAt(i) - 65;
    const k = key.charCodeAt(i % key.length) - 65;
    out += String.fromCharCode((m + k) % 26 + 65);
  }
  return out;
}

function unlock(label) {
  const el = document.getElementById(label);
  if (!el) return;
  el.classList.add("unlocked");
  if (label.startsWith("Hint") && RapidCipherState.unlockedHints[label]) {
    el.classList.add("glow-hint");
  }
}

function checkUnlocks() {
  const completed = RapidCipherState.completed;
  if (["Caesar A", "Caesar B", "Caesar C"].filter(k => completed[k]).length >= 3) {
    ["Substitution A", "Substitution B", "Substitution C", "Hint 5", "Hint 6", "Hint 7"].forEach(label => {
      unlock(label);
      if (label.startsWith("Hint")) {
        document.getElementById(label)?.classList.remove("glow-hint");
      }
    });
  }

  if (["Substitution A", "Substitution B"].filter(k => completed[k]).length >= 2) {
    ["Vigenère A", "Vigenère B"].forEach(unlock);
  }
}

function startTimer(label) {
  clearInterval(RapidCipherState.timerInterval);
  RapidCipherState.timeRemaining = RapidCipherState.timeLimit;
  const feedback = document.getElementById("feedback");

  RapidCipherState.timerInterval = setInterval(() => {
    RapidCipherState.timeRemaining--;
    feedback.innerHTML = `⏳ Time left: ${RapidCipherState.timeRemaining}s`;

    if (RapidCipherState.timeRemaining <= 0) {
      clearInterval(RapidCipherState.timerInterval);
      feedback.innerHTML = "❌ Time’s up!";
      document.getElementById("userInput").disabled = true;
      document.querySelector(".panel button").disabled = true;
    }
  }, 1000);
}

function submitAnswer(correct, label) {
  const input = document.getElementById("userInput").value.trim().toUpperCase();
  const feedback = document.getElementById("feedback");

  if (input === correct.toUpperCase()) {
    if (!RapidCipherState.completed[label]) {
      RapidCipherState.completed[label] = true;
      document.getElementById(label)?.classList.add("completed");
      checkUnlocks();
      clearInterval(RapidCipherState.timerInterval);
      const earned = Math.max(5, RapidCipherState.timeRemaining);
      RapidCipherState.score += earned;
      document.getElementById("scoreValue").innerText = RapidCipherState.score;
      feedback.innerText = `✔ Correct! (+${earned} pts)`;
    } else {
      feedback.innerText = "✔ Already solved.";
    }
  } else {
    feedback.innerText = "✖ Incorrect. Try again.";
  }
}

window.RapidCipherCore = {
  caesarEncrypt,
  runVigenereEncrypt,
  unlock,
  checkUnlocks,
  startTimer,
  submitAnswer
};