let keys = {
  'q': '', 'w': '', 'e': '', 'r': '', 't': '', 'y': '', 'u': '', 'i': '', 'o': '', 'p': '', 'break': '',
  'a': '', 's': '', 'd': '', 'f': '', 'g': '', 'h': '', 'j': '', 'k': '', 'l': '', 'break2': '',
  'enter': '', 'z': '', 'x': '', 'c': '', 'v': '', 'b': '', 'n': '', 'm': '', '⌫': ''
};

let guesses = [];
let currentGuess = [];
let SecretWord;
let points = 0;
let uzvara = false;

let vardi = [
  "waist", "goons", "mummy", "shark", "plume", "vapes", "sunny", "koala", "weeds",
  "porch", "moron",  "wahoo", "rails", "limpy", "linen", "gyoza", "sword", "cooed",
  "knurl", "safes", "mites", "earth", "easel", "zeals", "bunny", "class", "alkas", "boxed",
  "lamps", "brake", "began", "ghill", "unbid", "taxes", "sigil", "crepe", "evoke", "sists",
  "beany", "pants", "cards", "tiros", "octal", "sound", "smile", "chose", "rhyth", "bases"
];

function randomWord() {
  SecretWord = vardi[Math.floor(Math.random() * vardi.length)];
  console.log('SecretWord chosen:', SecretWord);
}
const GuessNr = 6;
const Correct = 'correct';
const Found = 'found';
const Wrong = 'wrong';



function initialize() {
  let guessGrid = document.getElementById("guessGrid");
  for (let i = 0; i < GuessNr; i++) {
    for (let j = 0; j < SecretWord.length; j++) {
      guessGrid.innerHTML += `<div id="${i}${j}" class="key-guess"></div>`
    }
    guessGrid.innerHTML += '<br/>'
  }

  let keyboard = document.getElementById("keyboard");
  Object.keys(keys).forEach((key) => {
    if (key.includes('break')) {
      keyboard.innerHTML += '<br/>';
    } else {
      keyboard.innerHTML += `<button id="${key}" class="key" onclick="keyClick('${key}')">` + key + '</button>';
    }
  });
}

randomWord();
initialize()

//nelauj rakstit pec uzvaras
function keyClick(key) {
  if (uzvara) {
    return;
  }

  switch (key) {
    case '⌫':
      backspace();
      break;
    case 'enter':
      enter();
      break;
    default:
      if (currentGuess.length < SecretWord.length
        && guesses.length < GuessNr) {
        currentGuess.push({ key: key, result: '' });
        updateCurrentGuess();
      }
  }
}

function backspace() {
  if (currentGuess.length > 0) {
    currentGuess.pop();
  }
  updateCurrentGuess();
}

function enter() {
  if (currentGuess.length < SecretWord.length || guesses.length >= GuessNr) {
    return;
  }

  const letterCounts = {};
  for (let i = 0; i < SecretWord.length; i++) {
    const secretLetter = SecretWord[i];
    letterCounts[secretLetter] = (letterCounts[secretLetter] || 0) + 1;
    
    if (currentGuess[i].key === secretLetter) {
      currentGuess[i].result = Correct;
      letterCounts[secretLetter]--; 
    }
  }

  for (let i = 0; i < currentGuess.length; i++) {
    const keyGuess = currentGuess[i];
    if (keyGuess.result === Correct) continue; 

    const letter = keyGuess.key;
    if (letterCounts[letter] > 0) {
      keyGuess.result = Found;
      letterCounts[letter]--;
    } else {
      keyGuess.result = Wrong;
    }
  }

  currentGuess.forEach(keyGuess => {
    if (keyGuess.result === Correct || keys[keyGuess.key] !== Correct) {
      keys[keyGuess.key] = keyGuess.result;
    }
  });

  updateCurrentGuess(true);
  guesses.push(currentGuess);
  const justGuessed = currentGuess;
  currentGuess = [];
  
  checkGameEnd(justGuessed);
}

function updateKeyboard() {
  for (const key in keys) {
    if (keys[key] != '') {
      let keyElement = document.getElementById(`${key}`);
      keyElement.className = '';
      keyElement.classList.add(keys[key]);
      keyElement.classList.add('key');
    }
  }
}

function updateCurrentGuess(guessed = false) {
  let index = guesses.length;
  for (let i = 0; i < SecretWord.length; i++) {
    let guessGrid = document.getElementById(`${index}${i}`);
    if (currentGuess[i]) {
      guessGrid.innerHTML = currentGuess[i].key;
    } else {
      guessGrid.innerHTML = '';
    }
    if (guessed) {
      guessGrid.classList.add(currentGuess[i].result);
    }
  }
  if (guessed) {
    updateKeyboard();
  }
}

function checkGameEnd(lastGuess) {
  // speletaja uzvaras cheks
  const won = lastGuess && lastGuess.every(k => k.result === Correct);
  if (won) {
    points += 1;
    updatePointsDisplay();
    uzvara = true;
    setTimeout(resetGame, 1000);
    
  }
}

function updatePointsDisplay() {
  const pointsEl = document.getElementById('pointsCounter');
  if (pointsEl) {
    pointsEl.textContent = `Points: ${points}`;
  }
}

function resetGame() {
  // saak jaunu speli
  guesses = [];
  currentGuess = [];
  uzvara = false;
  keys = {
    'q': '', 'w': '', 'e': '', 'r': '', 't': '', 'y': '', 'u': '', 'i': '', 'o': '', 'p': '', 'break': '',
    'a': '', 's': '', 'd': '', 'f': '', 'g': '', 'h': '', 'j': '', 'k': '', 'l': '', 'break2': '',
    'enter': '', 'z': '', 'x': '', 'c': '', 'v': '', 'b': '', 'n': '', 'm': '', '⌫': ''
  };
  
  randomWord();
  
  // gridam restarts
  document.getElementById('guessGrid').innerHTML = '';
  let guessGrid = document.getElementById("guessGrid");
  for (let i = 0; i < GuessNr; i++) {
    for (let j = 0; j < SecretWord.length; j++) {
      guessGrid.innerHTML += `<div id="${i}${j}" class="key-guess"></div>`
    }
    guessGrid.innerHTML += '<br/>'
  }
  
  // keyboard kraasu restarts
  for (const key in keys) {
    const keyElement = document.getElementById(key);
    if (keyElement) {
      keyElement.className = 'key';
    }
  }
}
window.addEventListener('keydown', function (e) {
  const tag = e.target && e.target.tagName;
  if (tag === 'INPUT' || tag === 'TEXTAREA' || (e.target && e.target.isContentEditable)) return;

  const k = e.key === 'Enter' ? 'enter' : (e.key === 'Backspace' ? '⌫' : e.key.toLowerCase());
  if (keys[k] !== undefined && !k.includes('break')) {
    e.preventDefault();
    keyClick(k);
  }
});