// Estado global do jogo
let gameState = {
    currentGame: null,
    level: 1,
    score: 0,
    totalQuestions: 0,
    correctAnswers: 0
};

// Dados dos jogos
const gameData = {
    letters: [
        { letter: 'A', options: ['A', 'B', 'C', 'D'], correct: 0 },
        { letter: 'B', options: ['D', 'B', 'A', 'C'], correct: 1 },
        { letter: 'C', options: ['A', 'D', 'C', 'B'], correct: 2 },
        { letter: 'D', options: ['C', 'A', 'B', 'D'], correct: 3 },
        { letter: 'E', options: ['E', 'F', 'G', 'H'], correct: 0 },
        { letter: 'F', options: ['H', 'F', 'E', 'G'], correct: 1 },
        { letter: 'G', options: ['F', 'H', 'G', 'E'], correct: 2 },
        { letter: 'H', options: ['G', 'E', 'F', 'H'], correct: 3 },
        { letter: 'I', options: ['I', 'J', 'K', 'L'], correct: 0 },
        { letter: 'J', options: ['L', 'J', 'I', 'K'], correct: 1 }
    ],
    
    words: [
        { word: 'GATO', letters: ['G', 'A', 'T', 'O'], extra: ['B', 'C', 'P', 'R'] },
        { word: 'CASA', letters: ['C', 'A', 'S', 'A'], extra: ['B', 'T', 'P', 'R'] },
        { word: 'SOL', letters: ['S', 'O', 'L'], extra: ['A', 'B', 'C', 'T', 'P'] },
        { word: 'LUA', letters: ['L', 'U', 'A'], extra: ['B', 'C', 'S', 'T', 'P'] },
        { word: 'PÃO', letters: ['P', 'Ã', 'O'], extra: ['A', 'B', 'C', 'S', 'T'] },
        { word: 'MÃE', letters: ['M', 'Ã', 'E'], extra: ['A', 'B', 'C', 'S', 'T'] },
        { word: 'BOLA', letters: ['B', 'O', 'L', 'A'], extra: ['C', 'S', 'T', 'P'] },
        { word: 'ÁGUA', letters: ['Á', 'G', 'U', 'A'], extra: ['B', 'C', 'S', 'T'] }
    ],
    
    match: [
        { word: 'GATO', image: '🐱', options: ['🐱', '🐶', '🐭', '🐸'] },
        { word: 'SOL', image: '☀️', options: ['☀️', '🌙', '⭐', '☁️'] },
        { word: 'CASA', image: '🏠', options: ['🏠', '🏢', '🏫', '🏥'] },
        { word: 'BOLA', image: '⚽', options: ['⚽', '🏀', '🎾', '🏐'] },
        { word: 'ÁGUA', image: '💧', options: ['💧', '🔥', '🌪️', '❄️'] },
        { word: 'FLOR', image: '🌸', options: ['🌸', '🌳', '🌿', '🍄'] },
        { word: 'PÃO', image: '🍞', options: ['🍞', '🍎', '🍌', '🍊'] },
        { word: 'LIVRO', image: '📚', options: ['📚', '📱', '💻', '📺'] }
    ]
};

let currentQuestion = 0;

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    updateProgress();
    showWelcomeMessage();
});

function showWelcomeMessage() {
    const gameArea = document.getElementById('gameArea');
    gameArea.innerHTML = `
        <div class="welcome-message fade-in">
            <h2>Bem-vindo ao ABC Especial!</h2>
            <p>Escolha um jogo para começar a aprender!</p>
            <div class="welcome-emoji">😊</div>
        </div>
    `;
}

function startGame(gameType) {
    gameState.currentGame = gameType;
    gameState.level = 1;
    currentQuestion = 0;
    gameState.totalQuestions = 0;
    gameState.correctAnswers = 0;
    
    document.getElementById('backBtn').style.display = 'inline-block';
    
    switch(gameType) {
        case 'letters':
            startLettersGame();
            break;
        case 'words':
            startWordsGame();
            break;
        case 'match':
            startMatchGame();
            break;
    }
}

function startLettersGame() {
    if (currentQuestion >= gameData.letters.length) {
        showGameComplete();
        return;
    }
    
    const question = gameData.letters[currentQuestion];
    const gameArea = document.getElementById('gameArea');
    
    gameArea.innerHTML = `
        <div class="fade-in">
            <h2>Que letra é esta?</h2>
            <div class="letter-display">${question.letter}</div>
            <div class="options-grid">
                ${question.options.map((option, index) => 
                    `<button class="option-btn" onclick="checkLetterAnswer(${index})">${option}</button>`
                ).join('')}
            </div>
        </div>
    `;
    
    document.getElementById('nextBtn').style.display = 'none';
}

function checkLetterAnswer(selectedIndex) {
    const question = gameData.letters[currentQuestion];
    const options = document.querySelectorAll('.option-btn');
    
    gameState.totalQuestions++;
    
    if (selectedIndex === question.correct) {
        options[selectedIndex].classList.add('correct');
        gameState.correctAnswers++;
        showFeedback('Muito bem! 🌟', 'success');
        
        setTimeout(() => {
            currentQuestion++;
            if (currentQuestion < gameData.letters.length) {
                startLettersGame();
            } else {
                showGameComplete();
            }
        }, 1500);
    } else {
        options[selectedIndex].classList.add('incorrect');
        options[question.correct].classList.add('correct');
        showFeedback('Tente novamente! A resposta correta é: ' + question.letter, 'error');
        
        setTimeout(() => {
            currentQuestion++;
            if (currentQuestion < gameData.letters.length) {
                startLettersGame();
            } else {
                showGameComplete();
            }
        }, 2500);
    }
    
    // Desabilitar botões após resposta
    options.forEach(btn => btn.disabled = true);
    updateProgress();
}

function startWordsGame() {
    if (currentQuestion >= gameData.words.length) {
        showGameComplete();
        return;
    }
    
    const wordData = gameData.words[currentQuestion];
    const allLetters = [...wordData.letters, ...wordData.extra].sort(() => Math.random() - 0.5);
    
    const gameArea = document.getElementById('gameArea');
    gameArea.innerHTML = `
        <div class="word-construction fade-in">
            <h2>Monte a palavra:</h2>
            <div class="word-display">${wordData.word}</div>
            <div class="letter-slots">
                ${wordData.letters.map((letter, index) => 
                    `<div class="letter-slot" data-index="${index}"></div>`
                ).join('')}
            </div>
            <div class="available-letters">
                ${allLetters.map((letter, index) => 
                    `<div class="letter-tile" onclick="selectLetter('${letter}', ${index})">${letter}</div>`
                ).join('')}
            </div>
            <button class="control-btn" onclick="checkWord()" style="margin-top: 20px; display: none;" id="checkWordBtn">Verificar Palavra</button>
        </div>
    `;
    
    gameState.selectedLetters = [];
    gameState.wordProgress = new Array(wordData.letters.length).fill('');
}

function selectLetter(letter, tileIndex) {
    const wordData = gameData.words[currentQuestion];
    const slots = document.querySelectorAll('.letter-slot');
    const tiles = document.querySelectorAll('.letter-tile');
    
    // Encontrar próximo slot vazio
    const emptySlotIndex = gameState.wordProgress.findIndex(slot => slot === '');
    
    if (emptySlotIndex !== -1 && !tiles[tileIndex].classList.contains('used')) {
        // Preencher slot
        slots[emptySlotIndex].textContent = letter;
        slots[emptySlotIndex].classList.add('filled');
        gameState.wordProgress[emptySlotIndex] = letter;
        
        // Marcar tile como usado
        tiles[tileIndex].classList.add('used');
        
        // Verificar se palavra está completa
        if (gameState.wordProgress.every(slot => slot !== '')) {
            document.getElementById('checkWordBtn').style.display = 'inline-block';
        }
    }
}

function checkWord() {
    const wordData = gameData.words[currentQuestion];
    const isCorrect = gameState.wordProgress.join('') === wordData.word;
    
    gameState.totalQuestions++;
    
    if (isCorrect) {
        gameState.correctAnswers++;
        showFeedback('Perfeito! Você formou a palavra corretamente! 🎉', 'success');
        
        setTimeout(() => {
            currentQuestion++;
            if (currentQuestion < gameData.words.length) {
                startWordsGame();
            } else {
                showGameComplete();
            }
        }, 2000);
    } else {
        showFeedback('Quase lá! Tente novamente organizando as letras.', 'error');
        
        // Reset do jogo atual
        setTimeout(() => {
            startWordsGame();
        }, 2000);
    }
    
    updateProgress();
}

function startMatchGame() {
    if (currentQuestion >= gameData.match.length) {
        showGameComplete();
        return;
    }
    
    const matchData = gameData.match[currentQuestion];
    
    const gameArea = document.getElementById('gameArea');
    gameArea.innerHTML = `
        <div class="match-game fade-in">
            <div class="word-side">
                <h2>Encontre a imagem para:</h2>
                <div class="match-word">${matchData.word}</div>
            </div>
            <div class="image-side">
                <div class="image-options">
                    ${matchData.options.map((image, index) => 
                        `<div class="image-option" onclick="checkMatch(${index})">${image}</div>`
                    ).join('')}
                </div>
            </div>
        </div>
    `;
    
    document.getElementById('nextBtn').style.display = 'none';
}

function checkMatch(selectedIndex) {
    const matchData = gameData.match[currentQuestion];
    const correctIndex = matchData.options.indexOf(matchData.image);
    const options = document.querySelectorAll('.image-option');
    
    gameState.totalQuestions++;
    
    if (selectedIndex === correctIndex) {
        options[selectedIndex].classList.add('correct');
        gameState.correctAnswers++;
        showFeedback('Excelente! Você acertou! 🌟', 'success');
        
        setTimeout(() => {
            currentQuestion++;
            if (currentQuestion < gameData.match.length) {
                startMatchGame();
            } else {
                showGameComplete();
            }
        }, 1500);
    } else {
        options[selectedIndex].classList.add('incorrect');
        options[correctIndex].classList.add('correct');
        showFeedback('Boa tentativa! A resposta correta é: ' + matchData.image, 'error');
        
        setTimeout(() => {
            currentQuestion++;
            if (currentQuestion < gameData.match.length) {
                startMatchGame();
            } else {
                showGameComplete();
            }
        }, 2500);
    }
    
    // Desabilitar opções após resposta
    options.forEach(option => option.style.pointerEvents = 'none');
    updateProgress();
}

function showFeedback(message, type) {
    const gameArea = document.getElementById('gameArea');
    const feedbackDiv = document.createElement('div');
    feedbackDiv.className = `feedback-message ${type}`;
    feedbackDiv.textContent = message;
    gameArea.appendChild(feedbackDiv);
}

function showGameComplete() {
    const percentage = Math.round((gameState.correctAnswers / gameState.totalQuestions) * 100);
    const gameArea = document.getElementById('gameArea');
    
    gameArea.innerHTML = `
        <div class="welcome-message fade-in">
            <h2>Parabéns! 🎉</h2>
            <p>Você completou o jogo!</p>
            <div class="welcome-emoji">🌟</div>
            <p style="margin-top: 20px; font-size: 1.1em;">
                Acertos: ${gameState.correctAnswers} de ${gameState.totalQuestions} (${percentage}%)
            </p>
            <button class="control-btn success" onclick="goBack()" style="margin-top: 20px;">
                Escolher Outro Jogo
            </button>
        </div>
    `;
    
    document.getElementById('nextBtn').style.display = 'none';
}

function updateProgress() {
    const totalGames = Object.keys(gameData).length;
    const progressPercent = (gameState.correctAnswers / Math.max(gameState.totalQuestions, 1)) * 100;
    
    document.getElementById('progressFill').style.width = progressPercent + '%';
    
    // Atualizar estrelas baseado no progresso
    const starsContainer = document.getElementById('starsContainer');
    const starCount = Math.floor(progressPercent / 20); // 1 estrela a cada 20%
    starsContainer.innerHTML = '⭐'.repeat(starCount);
}

function goBack() {
    gameState.currentGame = null;
    currentQuestion = 0;
    document.getElementById('backBtn').style.display = 'none';
    document.getElementById('nextBtn').style.display = 'none';
    showWelcomeMessage();
}

function nextLevel() {
    // Implementar lógica para próximo nível se necessário
    document.getElementById('nextBtn').style.display = 'none';
}