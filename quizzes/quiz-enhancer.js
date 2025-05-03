window.onload = () => {
  const form = document.getElementById("quizForm");
  const questions = Array.from(form.querySelectorAll(".question"));
  shuffleArray(questions);
  const container = document.getElementById("questionContainer");
  questions.forEach(q => container.appendChild(q));
  sendHeightToParent();
};

let quizSubmitted = false;

// Shuffle questions randomly
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

// Grade quiz and attach hover logic
function gradeQuiz() {
  if (quizSubmitted) {
    resetQuiz();
    return;
  }

  let score = 0;
  const questions = document.querySelectorAll(".question");

  questions.forEach((question) => {
    const name = question.querySelector("input[type='radio']").name;
    const selected = question.querySelector(`input[name="${name}"]:checked`);
    const correct = answers[name];

    question.classList.remove("correct-hover");
    question.querySelectorAll("label").forEach((label) => {
      label.classList.remove("correct-hover", "incorrect-selected");
    });

    if (selected) {
      if (selected.value === correct) {
        score++;
      } else {
        selected.parentElement.classList.add("incorrect-selected");
      }
    }

    // Add hover listeners (and store them for later removal)
    const mouseEnter = () => {
      const correctInput = question.querySelector(`input[value="${correct}"]`);
      if (correctInput) {
        correctInput.parentElement.classList.add("correct-hover");
      }
    };

    const mouseLeave = () => {
      const correctInput = question.querySelector(`input[value="${correct}"]`);
      if (correctInput) {
        correctInput.parentElement.classList.remove("correct-hover");
      }
    };

    question.addEventListener("mouseenter", mouseEnter);
    question.addEventListener("mouseleave", mouseLeave);

    question._hoverEnter = mouseEnter;
    question._hoverLeave = mouseLeave;
  });

  // Show result message and scroll to top
  document.getElementById("result").innerHTML =
    `✅ You got <strong>${score} out of ${Object.keys(answers).length}</strong> correct.`;
  document.getElementById("hoverNote")?.classList.remove("hidden");
  window.scrollTo({ top: 0, behavior: 'smooth' });

  // 🎉 Confetti if perfect score
  if (score === Object.keys(answers).length) {
    partyMode();
  }

  // Update submit button
  const btn = document.querySelector("button[type='button']");
  btn.innerText = "🔄 Try Again";
  quizSubmitted = true;

  setTimeout(sendHeightToParent, 100);
}

// Reset quiz and remove hover logic
function resetQuiz() {
  const form = document.getElementById("quizForm");
  const questions = Array.from(form.querySelectorAll(".question"));

  questions.forEach((q) => {
    // Clear radio buttons
    q.querySelectorAll("input[type='radio']").forEach(input => input.checked = false);

    // Remove highlights
    q.querySelectorAll("label").forEach(label => {
      label.classList.remove("correct-hover", "incorrect-selected");
    });

    // Remove hover listeners if they exist
    if (q._hoverEnter) {
      q.removeEventListener("mouseenter", q._hoverEnter);
      delete q._hoverEnter;
    }
    if (q._hoverLeave) {
      q.removeEventListener("mouseleave", q._hoverLeave);
      delete q._hoverLeave;
    }
  });

  // Shuffle and reinsert questions
  shuffleArray(questions);
  const container = document.getElementById("questionContainer");
  questions.forEach(q => container.appendChild(q));

  // Reset UI
  document.getElementById("result").innerHTML = "";
  document.getElementById("hoverNote")?.classList.add("hidden");

  const btn = document.querySelector("button[type='button']");
  btn.innerText = "Submit Answers";
  quizSubmitted = false;

  sendHeightToParent();
}

// Resize iframe if embedded
function sendHeightToParent() {
  const height = document.body.scrollHeight;
  window.parent.postMessage({ type: 'resize-iframe', height }, '*');
}
function partyMode() {
  const body = document.body;
  const sound = document.getElementById("partySound");

  // Shake the screen
  body.classList.add("shake");

  // Play sound
  if (sound) {
    sound.currentTime = 0;
    sound.play();
  }

  // Massive confetti burst for 5 seconds
  const duration = 5000;
  const animationEnd = Date.now() + duration;
  const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 };

  function randomInRange(min, max) {
    return Math.random() * (max - min) + min;
  }

  const interval = setInterval(function () {
    const timeLeft = animationEnd - Date.now();
    if (timeLeft <= 0) {
      clearInterval(interval);
      body.classList.remove("shake"); // remove shake
    }
    const particleCount = 100 * (timeLeft / duration);
    confetti(Object.assign({}, defaults, {
      particleCount,
      origin: { x: randomInRange(0, 1), y: Math.random() - 0.2 }
    }));
  }, 250);
}

window.addEventListener('load', sendHeightToParent);
window.addEventListener('resize', sendHeightToParent);
