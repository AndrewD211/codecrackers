document.addEventListener("DOMContentLoaded", () => {
  const grid = document.getElementById("grid");
  const hintToCipher = {};
  Object.values(quizBank).forEach(q => {
    hintToCipher[q.unlocks] = q.target;
  });

  const cipherToHint = {};
  Object.entries(hintToCipher).forEach(([hint, cipher]) => {
    cipherToHint[cipher] = hint;
  });

  function addNode(label, type, top, left, encrypted, answer) {
    const div = document.createElement("div");
    div.id = label;
    const normalized = type.toLowerCase().replace(/[èé]/g, 'e');
    div.className = `node ${normalized} ${type === 'Hint' ? 'hint' : ''}`;
    div.innerText = label;
    div.style.top = top + "px";
    div.style.left = left + "px";

    const isInitiallyUnlocked = label.startsWith("Caesar") || (label.startsWith("Hint") && parseInt(label.split(" ")[1]) <= 4);
    if (isInitiallyUnlocked) div.classList.add("unlocked");

    div.onclick = () => {
      if (type === "Hint") showQuiz(label);
      else openPanel(type, encrypted, answer, label);
    };
    grid.appendChild(div);
  }

  function openPanel(type, encrypted, answer, label) {
    document.getElementById("panelTitle").innerText = `${type} Cipher`;
    document.getElementById("cipherText").innerText = encrypted;
    document.getElementById("userInput").value = '';
    document.getElementById("userInput").disabled = false;
    document.querySelector(".panel button").disabled = false;

    let hint = RapidCipherState.unlockedHints[label];
    if (!hint) {
      const hintKey = cipherToHint[label];
      if (hintKey) hint = RapidCipherState.unlockedHints[hintKey];
    }

    const glow = (label === "Vigenère A" && allCaesarsDone()) || (label === "Vigenère B" && allSubsDone());
    document.getElementById("hintBox").innerHTML = hint ?
      `<div class="${glow ? 'glow-hint' : ''}" style="background:#254; padding:1rem; border-radius:6px;"><strong>Hint:</strong> ${hint}</div>` : '';

    document.getElementById("panel").classList.add("active");
    document.getElementById("overlay").classList.add("active");

    document.getElementById("userInput").onkeydown = e => {
      if (e.key === "Enter") RapidCipherCore.submitAnswer(answer, label);
    };
    document.querySelector(".panel button").onclick = () => RapidCipherCore.submitAnswer(answer, label);

    RapidCipherCore.startTimer(label);
  }

  function showQuiz(label) {
    const q = quizBank[label];
    if (!q) return alert("No quiz found.");

    const questionBox = document.getElementById("quizQuestion");
    const quizOptions = document.getElementById("quizOptions");
    const quizFeedback = document.getElementById("quizFeedback");

    questionBox.innerText = q.question;
    quizOptions.innerHTML = "";
    quizFeedback.innerText = "";

    q.options.sort(() => Math.random() - 0.5).forEach(opt => {
      const btn = document.createElement("button");
      btn.innerText = opt;
      btn.onclick = () => {
        if (opt === q.answer) {
          RapidCipherState.unlockedHints[label] = hintMessages[q.target];
          RapidCipherCore.unlock(label);
          quizFeedback.innerText = `✅ Hint unlocked for ${q.target}`;
          setTimeout(closeQuiz, 800);
        } else {
          quizFeedback.innerText = "❌ Try again.";
        }
      };
      quizOptions.appendChild(btn);
    });

    document.getElementById("quizModal").style.display = "block";
  }

  function closePanel() {
    document.getElementById("panel").classList.remove("active");
    document.getElementById("overlay").classList.remove("active");
  }

  function closeQuiz() {
    document.getElementById("quizModal").style.display = "none";
  }

  function allCaesarsDone() {
    return ["Caesar A", "Caesar B", "Caesar C", "Caesar D"].every(k => RapidCipherState.completed[k]);
  }

  function allSubsDone() {
    return ["Substitution A", "Substitution B", "Substitution C"].every(k => RapidCipherState.completed[k]);
  }

  window.closePanel = closePanel;
  window.closeQuiz = closeQuiz;

  // Initialize game nodes
  ["A", "B", "C", "D"].forEach((l, i) => {
    const words = ["HELLO", "WORLD", "CODES", "SHIFT"];
    const encrypted = RapidCipherCore.caesarEncrypt(words[i], 3);
    addNode(`Caesar ${l}`, "Caesar", 100, 100 + i * 180, encrypted, words[i]);
    addNode(`Hint ${i + 1}`, "Hint", 200, 100 + i * 180, "", "");
  });

  const subsData = [
    {
      label: "Substitution A",
      plain: "SECRET",
      map: { S: "D", E: "Q", C: "A", R: "L", T: "M" }, // Only needed letters mapped
    },
    {
      label: "Substitution B",
      plain: "PUZZLE",
      map: { P: "G", U: "W", Z: "K", L: "N", E: "T" },
    },
    {
      label: "Substitution C",
      plain: "LOCKED",
      map: { L: "P", O: "X", C: "Z", K: "B", E: "J", D: "H" },
    }
  ];

subsData.forEach(({ label, plain, map }, i) => {
  const encrypted = plain.split("").map(ch => map[ch] || ch).join("");
  addNode(label, "Substitution", 400, 150 + i * 220, encrypted, plain);
  addNode(`Hint ${i + 5}`, "Hint", 500, 150 + i * 220, "", "");
});


  ["A", "B"].forEach((l, i) => {
    const data = [
      { plain: "DEFEND", keyword: "KEY" },
      { plain: "ENCRYPT", keyword: "LOCK" }
    ];
    const enc = RapidCipherCore.runVigenereEncrypt(data[i].plain, data[i].keyword);
    addNode(`Vigenère ${l}`, "Vigenère", 700, 200 + i * 240, enc, data[i].plain);
  });

 window.toggleInstructions = function () {
  const box = document.getElementById("instructionsBox");
  const header = box.previousElementSibling;
  const expanded = box.style.display === "block";
  box.style.display = expanded ? "none" : "block";
  header.innerHTML = expanded ? "▸ How to Play" : "▾ How to Play";
};
 
});