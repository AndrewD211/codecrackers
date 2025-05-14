window.hintMessages = {
  "Caesar A": "Try shifting each letter by 3.",
  "Caesar B": "The word 'WORLD' becomes ZRUOG with a Caesar shift of 3.",
  "Caesar C": "If you get FRGHV, you're on the right track.",
  "Caesar D": "Shift of 3 wraps letters from Z back to A.",
  "Substitution A": "The word is reversed — read it backwards.",
  "Substitution B": "The mapping flips start and end letters.",
  "Substitution C": "Watch for palindromes in the reversed form.",
  "Vigenère A": "Keyword is KEY — repeat it to match message length.",
  "Vigenère B": "Try decrypting ENCRYPT with keyword LOCK."
};

window.quizBank = {
  "Hint 1": {
    unlocks: "Hint 1",
    target: "Caesar A",
    question: "Which ancient ruler used a simple letter shift to encrypt military messages?",
    options: ["Leon Battista Alberti", "Julius Caesar", "Al-Kindi", "Blaise de Vigenère"],
    answer: "Julius Caesar"
  },
  "Hint 2": {
    unlocks: "Hint 2",
    target: "Caesar B",
    question: "Which tool used a strip of parchment wrapped around a wooden rod to hide messages?",
    options: ["Cipher disk", "Scytale", "Jefferson wheels", "Enigma rotor"],
    answer: "Scytale"
  },
  "Hint 3": {
    unlocks: "Hint 3",
    target: "Caesar C",
    question: "Which text from ancient India included advice on code and substitution?",
    options: ["The Arthashastra", "The Dead Sea Scrolls", "The Rosetta Stone", "The Dharma Bums"],
    answer: "The Arthashastra"
  },
  "Hint 4": {
    unlocks: "Hint 4",
    target: "Caesar D",
    question: "Who invented the cipher disk in the 1400s?",
    options: ["Julius Caesar", "Thomas Jefferson", "Blaise de Vigenère", "Leon Battista Alberti"],
    answer: "Leon Battista Alberti"
  },
  "Hint 5": {
    unlocks: "Hint 5",
    target: "Substitution A",
    question: "What 9th-century method broke substitution ciphers using letter patterns?",
    options: ["Polyalphabetic shifting", "Brute force", "Frequency analysis", "Public-key infrastructure"],
    answer: "Frequency analysis"
  },
  "Hint 6": {
    unlocks: "Hint 6",
    target: "Substitution B",
    question: "What encryption method published in 1586 remained strong for centuries?",
    options: ["Jefferson Disk", "Vigenère Cipher", "Enigma", "RSA"],
    answer: "Vigenère Cipher"
  },
  "Hint 7": {
    unlocks: "Hint 7",
    target: "Substitution C",
    question: "Which encryption standard adopted in 2001 replaced DES?",
    options: ["RSA", "AES", "PGP", "ECC"],
    answer: "AES"
  }
};