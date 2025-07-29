// Estado global do jogo
let gameState = {
    currentGame: null,
    level: 1,
    difficulty: 'easy', // easy, medium, hard
    score: 0,
    totalQuestions: 0,
    correctAnswers: 0,
    streak: 0,
    maxStreak: 0,
    lives: 3,
    timeLeft: 0,
    isTimedMode: false,
    achievements: [],
    currentTheme: 'default',
    soundEnabled: true
};

// Sistema de usuários
let userProfiles = JSON.parse(localStorage.getItem('abcUsers') || '{}');
let currentUser = localStorage.getItem('currentUser') || null;

// Configurações do jogo
const gameConfig = {
    difficulties: {
        easy: { timeLimit: 30, lives: 5, pointsMultiplier: 1 },
        medium: { timeLimit: 20, lives: 3, pointsMultiplier: 2 },
        hard: { timeLimit: 15, lives: 1, pointsMultiplier: 3 }
    },
    themes: ['default', 'ocean', 'space', 'forest', 'rainbow'],
    achievements: [
        { id: 'first_win', name: 'Primeira Vitória!', description: 'Complete um jogo', icon: '🏆' },
        { id: 'streak_5', name: 'Em Chamas!', description: '5 acertos seguidos', icon: '🔥' },
        { id: 'streak_10', name: 'Imparável!', description: '10 acertos seguidos', icon: '⚡' },
        { id: 'perfect_game', name: 'Perfeição!', description: '100% de acertos', icon: '💎' },
        { id: 'speed_demon', name: 'Velocidade!', description: 'Complete em modo difícil', icon: '🚀' }
    ]
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
        { letter: 'J', options: ['L', 'J', 'I', 'K'], correct: 1 },
        { letter: 'K', options: ['K', 'L', 'M', 'N'], correct: 0 },
        { letter: 'L', options: ['N', 'L', 'K', 'M'], correct: 1 },
        { letter: 'M', options: ['K', 'N', 'M', 'L'], correct: 2 },
        { letter: 'N', options: ['M', 'K', 'L', 'N'], correct: 3 },
        { letter: 'O', options: ['O', 'P', 'Q', 'R'], correct: 0 },
        { letter: 'P', options: ['R', 'P', 'O', 'Q'], correct: 1 },
        { letter: 'Q', options: ['O', 'R', 'Q', 'P'], correct: 2 },
        { letter: 'R', options: ['Q', 'O', 'P', 'R'], correct: 3 },
        { letter: 'S', options: ['S', 'T', 'U', 'V'], correct: 0 },
        { letter: 'T', options: ['V', 'T', 'S', 'U'], correct: 1 },
        { letter: 'U', options: ['S', 'V', 'U', 'T'], correct: 2 },
        { letter: 'V', options: ['U', 'S', 'T', 'V'], correct: 3 },
        { letter: 'W', options: ['W', 'X', 'Y', 'Z'], correct: 0 },
        { letter: 'X', options: ['Z', 'X', 'W', 'Y'], correct: 1 },
        { letter: 'Y', options: ['W', 'Z', 'Y', 'X'], correct: 2 },
        { letter: 'Z', options: ['Y', 'W', 'X', 'Z'], correct: 3 },
        { letter: 'Á', options: ['Á', 'À', 'Â', 'Ã'], correct: 0 },
        { letter: 'À', options: ['Ã', 'À', 'Á', 'Â'], correct: 1 },
        { letter: 'Â', options: ['Á', 'Ã', 'Â', 'À'], correct: 2 },
        { letter: 'Ã', options: ['Â', 'Á', 'À', 'Ã'], correct: 3 },
        { letter: 'É', options: ['É', 'È', 'Ê', 'Ë'], correct: 0 },
        { letter: 'È', options: ['Ë', 'È', 'É', 'Ê'], correct: 1 },
        { letter: 'Ê', options: ['É', 'Ë', 'Ê', 'È'], correct: 2 },
        { letter: 'Í', options: ['Í', 'Ì', 'Î', 'Ï'], correct: 0 },
        { letter: 'Ó', options: ['Ó', 'Ò', 'Ô', 'Õ'], correct: 0 },
        { letter: 'Ô', options: ['Õ', 'Ô', 'Ó', 'Ò'], correct: 1 },
        { letter: 'Ú', options: ['Ú', 'Ù', 'Û', 'Ü'], correct: 0 },
        { letter: 'Ç', options: ['Ç', 'C', 'G', 'S'], correct: 0 }
    ],
    
    words: [
        { word: 'SOL', letters: ['S', 'O', 'L'], extra: ['A', 'B', 'C', 'T', 'P'] },
        { word: 'LUA', letters: ['L', 'U', 'A'], extra: ['B', 'C', 'S', 'T', 'P'] },
        { word: 'PÃO', letters: ['P', 'Ã', 'O'], extra: ['A', 'B', 'C', 'S', 'T'] },
        { word: 'MÃE', letters: ['M', 'Ã', 'E'], extra: ['A', 'B', 'C', 'S', 'T'] },
        { word: 'PAI', letters: ['P', 'A', 'I'], extra: ['B', 'C', 'S', 'T', 'O'] },
        { word: 'CÉU', letters: ['C', 'É', 'U'], extra: ['A', 'B', 'S', 'T', 'P'] },
        { word: 'GATO', letters: ['G', 'A', 'T', 'O'], extra: ['B', 'C', 'P', 'R'] },
        { word: 'CASA', letters: ['C', 'A', 'S', 'A'], extra: ['B', 'T', 'P', 'R'] },
        { word: 'BOLA', letters: ['B', 'O', 'L', 'A'], extra: ['C', 'S', 'T', 'P'] },
        { word: 'ÁGUA', letters: ['Á', 'G', 'U', 'A'], extra: ['B', 'C', 'S', 'T'] },
        { word: 'MESA', letters: ['M', 'E', 'S', 'A'], extra: ['B', 'C', 'T', 'P'] },
        { word: 'PATO', letters: ['P', 'A', 'T', 'O'], extra: ['B', 'C', 'S', 'R'] },
        { word: 'LOBO', letters: ['L', 'O', 'B', 'O'], extra: ['A', 'C', 'S', 'T'] },
        { word: 'NUVEM', letters: ['N', 'U', 'V', 'E', 'M'], extra: ['A', 'B', 'C', 'S'] },
        { word: 'FLOR', letters: ['F', 'L', 'O', 'R'], extra: ['A', 'B', 'C', 'S'] },
        { word: 'LIVRO', letters: ['L', 'I', 'V', 'R', 'O'], extra: ['A', 'B', 'C', 'S'] },
        { word: 'PEIXE', letters: ['P', 'E', 'I', 'X', 'E'], extra: ['A', 'B', 'C', 'S'] },
        { word: 'ESCOLA', letters: ['E', 'S', 'C', 'O', 'L', 'A'], extra: ['B', 'T', 'P'] },
        { word: 'JANELA', letters: ['J', 'A', 'N', 'E', 'L', 'A'], extra: ['B', 'C', 'S'] },
        { word: 'BORBOLETA', letters: ['B', 'O', 'R', 'B', 'O', 'L', 'E', 'T', 'A'], extra: ['C', 'S'] },
        { word: 'CACHORRO', letters: ['C', 'A', 'C', 'H', 'O', 'R', 'R', 'O'], extra: ['B', 'S'] },
        { word: 'ELEFANTE', letters: ['E', 'L', 'E', 'F', 'A', 'N', 'T', 'E'], extra: ['B', 'C'] },
        { word: 'BICICLETA', letters: ['B', 'I', 'C', 'I', 'C', 'L', 'E', 'T', 'A'], extra: ['S', 'O'] },
        { word: 'COMPUTADOR', letters: ['C', 'O', 'M', 'P', 'U', 'T', 'A', 'D', 'O', 'R'], extra: ['B', 'S'] }
    ],
    
    match: [
        { word: 'GATO', image: '🐱', options: ['🐱', '🐶', '🐭', '🐸'] },
        { word: 'CACHORRO', image: '🐶', options: ['🐶', '🐱', '🐰', '🐻'] },
        { word: 'SOL', image: '☀️', options: ['☀️', '🌙', '⭐', '☁️'] },
        { word: 'LUA', image: '🌙', options: ['🌙', '☀️', '⭐', '☁️'] },
        { word: 'CASA', image: '🏠', options: ['🏠', '🏢', '🏫', '🏥'] },
        { word: 'ESCOLA', image: '🏫', options: ['🏫', '🏠', '🏢', '🏥'] },
        { word: 'BOLA', image: '⚽', options: ['⚽', '🏀', '🎾', '🏐'] },
        { word: 'ÁGUA', image: '💧', options: ['💧', '🔥', '🌪️', '❄️'] },
        { word: 'FLOR', image: '🌸', options: ['🌸', '🌳', '🌿', '🍄'] },
        { word: 'ÁRVORE', image: '🌳', options: ['🌳', '🌸', '🌿', '🍄'] },
        { word: 'PÃO', image: '🍞', options: ['🍞', '🍎', '🍌', '🍊'] },
        { word: 'MAÇÃ', image: '🍎', options: ['🍎', '🍞', '🍌', '🍊'] },
        { word: 'BANANA', image: '🍌', options: ['🍌', '🍎', '🍞', '🍊'] },
        { word: 'LIVRO', image: '📚', options: ['📚', '📱', '💻', '📺'] },
        { word: 'TELEFONE', image: '📱', options: ['📱', '📚', '💻', '📺'] },
        { word: 'CARRO', image: '🚗', options: ['🚗', '🚌', '🚲', '✈️'] },
        { word: 'AVIÃO', image: '✈️', options: ['✈️', '🚗', '🚌', '🚲'] },
        { word: 'BICICLETA', image: '🚲', options: ['🚲', '🚗', '🚌', '✈️'] },
        { word: 'CORAÇÃO', image: '❤️', options: ['❤️', '💙', '💚', '💛'] },
        { word: 'PEIXE', image: '🐠', options: ['🐠', '🐙', '🦈', '🐢'] },
        { word: 'BORBOLETA', image: '🦋', options: ['🦋', '🐝', '🐞', '🕷️'] },
        { word: 'ABELHA', image: '🐝', options: ['🐝', '🦋', '🐞', '🕷️'] },
        { word: 'PIZZA', image: '🍕', options: ['🍕', '🍔', '🌭', '🥪'] },
        { word: 'HAMBÚRGUER', image: '🍔', options: ['🍔', '🍕', '🌭', '🥪'] },
        { word: 'SORVETE', image: '🍦', options: ['🍦', '🧁', '🍰', '🍪'] },
        { word: 'BOLO', image: '🍰', options: ['🍰', '🍦', '🧁', '🍪'] },
        { word: 'CAFÉ', image: '☕', options: ['☕', '🥤', '🧃', '🍷'] },
        { word: 'LEITE', image: '🥛', options: ['🥛', '☕', '🥤', '🧃'] },
        { word: 'RELÓGIO', image: '⏰', options: ['⏰', '📱', '💻', '📺'] },
        { word: 'GUARDA-CHUVA', image: '☂️', options: ['☂️', '👒', '🧢', '👓'] },
        { word: 'CHAPÉU', image: '👒', options: ['👒', '☂️', '🧢', '👓'] },
        { word: 'PRESENTE', image: '🎁', options: ['🎁', '🎈', '🎉', '🎂'] },
        { word: 'BALÃO', image: '🎈', options: ['🎈', '🎁', '🎉', '🎂'] },
        { word: 'ESTRELA', image: '⭐', options: ['⭐', '☀️', '🌙', '☁️'] },
        { word: 'NUVEM', image: '☁️', options: ['☁️', '☀️', '🌙', '⭐'] },
        { word: 'ARCO-ÍRIS', image: '🌈', options: ['🌈', '☁️', '⭐', '☀️'] },
        { word: 'MONTANHA', image: '⛰️', options: ['⛰️', '🌋', '🏔️', '🗻'] },
        { word: 'PRAIA', image: '🏖️', options: ['🏖️', '🏝️', '🌊', '⛵'] },
        { word: 'CASTELO', image: '🏰', options: ['🏰', '🏠', '🏢', '🏫'] },
        { word: 'TESOURO', image: '💰', options: ['💰', '💎', '🏆', '👑'] },
        { word: 'COROA', image: '👑', options: ['👑', '💰', '💎', '🏆'] }
    ]
};

let currentQuestion = 0;

// Sistema de áudio
let audioContext;

function initAudioContext() {
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        if (audioContext.state === 'suspended') {
            audioContext.resume();
        }
    }
}

function playSound(frequency, duration, type = 'sine') {
    if (!audioContext || !gameState.soundEnabled) return;
    
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = frequency;
    oscillator.type = type;
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + duration);
}

function playSuccessSound() {
    // Melodia de sucesso (Dó - Mi - Sol)
    playSound(523.25, 0.2); // Dó
    setTimeout(() => playSound(659.25, 0.2), 150); // Mi
    setTimeout(() => playSound(783.99, 0.3), 300); // Sol
}

function playErrorSound() {
    // Som de erro (duas notas baixas)
    playSound(220, 0.3, 'square');
    setTimeout(() => playSound(185, 0.3, 'square'), 200);
}

// Sistema de sons musicais (sem voz)
function playLetterSound(letter) {
    // Som musical correspondente à letra
    const noteFrequencies = {
        'A': 261.63, 'B': 293.66, 'C': 329.63, 'D': 349.23, 'E': 392.00,
        'F': 440.00, 'G': 493.88, 'H': 523.25, 'I': 587.33, 'J': 659.25,
        'K': 698.46, 'L': 783.99, 'M': 880.00, 'N': 987.77, 'O': 1046.50,
        'P': 1174.66, 'Q': 1318.51, 'R': 1396.91, 'S': 1567.98, 'T': 1760.00,
        'U': 1975.53, 'V': 2093.00, 'W': 2349.32, 'X': 2637.02, 'Y': 2793.83, 'Z': 3135.96
    };
    
    const frequency = noteFrequencies[letter.toUpperCase()] || 440;
    playSound(frequency, 0.5);
}

function playWordSound(word) {
    // Toca uma sequência de notas baseada nas letras da palavra
    for (let i = 0; i < word.length; i++) {
        setTimeout(() => {
            playLetterSound(word[i]);
        }, i * 200);
    }
}

function playClickSound() {
    // Som de clique suave
    playSound(800, 0.1, 'sine');
}

function playHoverSound() {
    // Som de hover sutil
    playSound(600, 0.05, 'sine');
}

function playAmbientMusic() {
    // Música ambiente suave baseada no tema
    const themes = {
        ocean: [261.63, 329.63, 392.00, 523.25],
        space: [220.00, 277.18, 369.99, 493.88],
        forest: [293.66, 369.99, 440.00, 587.33],
        rainbow: [261.63, 293.66, 329.63, 349.23, 392.00]
    };
    
    const notes = themes[gameState.currentTheme] || themes.rainbow;
    let noteIndex = 0;
    
    const playNote = () => {
        if (gameState.currentGame && gameState.soundEnabled) {
            playSound(notes[noteIndex], 1.0, 'sine');
            noteIndex = (noteIndex + 1) % notes.length;
            setTimeout(playNote, 3000); // Notas mais espaçadas
        }
    };
    
    setTimeout(playNote, 1000);
}

// Controle de som
function toggleSound() {
    gameState.soundEnabled = !gameState.soundEnabled;
    updateSoundButton();
    
    // Salvar preferência no perfil do usuário
    if (userProfiles[currentUser]) {
        userProfiles[currentUser].settings.soundEnabled = gameState.soundEnabled;
        saveUserData();
    }
    
    // Feedback visual e sonoro
    if (gameState.soundEnabled) {
        playClickSound();
        showSoundFeedback('🔊 Som ativado!', 'success');
    } else {
        showSoundFeedback('🔇 Som desativado', 'muted');
    }
}

function showSoundFeedback(message, type) {
    // Criar elemento de feedback temporário
    const feedback = document.createElement('div');
    feedback.className = `sound-feedback ${type}`;
    feedback.textContent = message;
    
    document.body.appendChild(feedback);
    
    // Remover após animação
    setTimeout(() => {
        feedback.remove();
    }, 2000);
}

function updateSoundButton() {
    const soundBtn = document.getElementById('soundBtn');
    if (gameState.soundEnabled) {
        soundBtn.textContent = '🔊';
        soundBtn.classList.remove('muted');
        soundBtn.title = 'Desativar Som';
    } else {
        soundBtn.textContent = '🔇';
        soundBtn.classList.add('muted');
        soundBtn.title = 'Ativar Som';
    }
}

let gameTimer;

// Funções de usuário e perfil
function initializeUser() {
    if (!currentUser) {
        currentUser = 'guest_' + Date.now();
        localStorage.setItem('currentUser', currentUser);
    }
    
    if (!userProfiles[currentUser]) {
        userProfiles[currentUser] = {
            name: 'Visitante',
            level: 1,
            totalScore: 0,
            achievements: [],
            gamesCompleted: { letters: 0, words: 0, match: 0 },
            bestStreaks: { letters: 0, words: 0, match: 0 },
            settings: { difficulty: 'easy', theme: 'default', soundEnabled: true }
        };
        saveUserData();
    }
    
    loadUserProfile();
}

function loadUserProfile() {
    const profile = userProfiles[currentUser];
    document.getElementById('username').textContent = profile.name;
    document.getElementById('userLevel').textContent = `Nível ${profile.level}`;
    document.getElementById('playerName').value = profile.name;
    document.getElementById('difficultySelect').value = profile.settings.difficulty;
    document.getElementById('themeSelect').value = profile.settings.theme;
    
    gameState.difficulty = profile.settings.difficulty;
    gameState.currentTheme = profile.settings.theme;
    gameState.soundEnabled = profile.settings.soundEnabled !== undefined ? profile.settings.soundEnabled : true;
    
    applyTheme(profile.settings.theme);
    updateSoundButton();
    updateAchievementsDisplay();
    updateGameProgress();
}

function saveProfile() {
    const name = document.getElementById('playerName').value.trim();
    if (name) {
        userProfiles[currentUser].name = name;
        document.getElementById('username').textContent = name;
        saveUserData();
        hideSettings();
    }
}

function saveUserData() {
    localStorage.setItem('abcUsers', JSON.stringify(userProfiles));
}

function changeDifficulty() {
    const difficulty = document.getElementById('difficultySelect').value;
    gameState.difficulty = difficulty;
    userProfiles[currentUser].settings.difficulty = difficulty;
    gameState.lives = gameConfig.difficulties[difficulty].lives;
    updateDisplay();
    saveUserData();
}

function changeTheme() {
    const theme = document.getElementById('themeSelect').value;
    gameState.currentTheme = theme;
    userProfiles[currentUser].settings.theme = theme;
    applyTheme(theme);
    saveUserData();
}

function applyTheme(theme) {
    document.body.className = theme !== 'default' ? `theme-${theme}` : '';
}

function showSettings() {
    document.getElementById('settingsPanel').style.display = 'block';
}

function hideSettings() {
    document.getElementById('settingsPanel').style.display = 'none';
}

// Sistema de conquistas
function checkAchievements() {
    const profile = userProfiles[currentUser];
    const newAchievements = [];
    
    gameConfig.achievements.forEach(achievement => {
        if (!profile.achievements.includes(achievement.id)) {
            let unlocked = false;
            
            switch(achievement.id) {
                case 'first_win':
                    unlocked = gameState.correctAnswers > 0;
                    break;
                case 'streak_5':
                    unlocked = gameState.streak >= 5;
                    break;
                case 'streak_10':
                    unlocked = gameState.streak >= 10;
                    break;
                case 'perfect_game':
                    unlocked = gameState.totalQuestions > 5 && 
                              (gameState.correctAnswers / gameState.totalQuestions) === 1;
                    break;
                case 'speed_demon':
                    unlocked = gameState.difficulty === 'hard' && gameState.correctAnswers > 5;
                    break;
            }
            
            if (unlocked) {
                profile.achievements.push(achievement.id);
                newAchievements.push(achievement);
            }
        }
    });
    
    if (newAchievements.length > 0) {
        saveUserData();
        updateAchievementsDisplay();
        showAchievementModal(newAchievements[0]);
    }
}

function showAchievementModal(achievement) {
    document.getElementById('achievementIcon').textContent = achievement.icon;
    document.getElementById('achievementTitle').textContent = achievement.name;
    document.getElementById('achievementDesc').textContent = achievement.description;
    document.getElementById('achievementModal').style.display = 'flex';
    createConfetti();
}

function closeAchievement() {
    document.getElementById('achievementModal').style.display = 'none';
}

function updateAchievementsDisplay() {
    const container = document.getElementById('achievementsBar');
    container.innerHTML = '';
    
    gameConfig.achievements.forEach(achievement => {
        const badge = document.createElement('div');
        badge.className = 'achievement-badge';
        
        const isUnlocked = userProfiles[currentUser].achievements.includes(achievement.id);
        if (!isUnlocked) {
            badge.classList.add('locked');
        }
        
        badge.textContent = achievement.icon;
        badge.title = `${achievement.name}: ${achievement.description}`;
        container.appendChild(badge);
    });
}

function updateGameProgress() {
    const profile = userProfiles[currentUser];
    document.getElementById('lettersProgress').textContent = 
        `${profile.gamesCompleted.letters}/${gameData.letters.length}`;
    document.getElementById('wordsProgress').textContent = 
        `${profile.gamesCompleted.words}/${gameData.words.length}`;
    document.getElementById('matchProgress').textContent = 
        `${profile.gamesCompleted.match}/${gameData.match.length}`;
}

// Sistema de pontuação e display
function updateDisplay() {
    document.getElementById('scoreDisplay').textContent = gameState.score;
    document.getElementById('streakDisplay').textContent = gameState.streak;
    document.getElementById('livesDisplay').textContent = gameState.lives;
    
    if (gameState.isTimedMode) {
        document.getElementById('timeValue').textContent = gameState.timeLeft;
        document.getElementById('timerDisplay').style.display = 'block';
    } else {
        document.getElementById('timerDisplay').style.display = 'none';
    }
}

function calculateScore(timeBonus = 0) {
    const basePoints = 100;
    const difficultyMultiplier = gameConfig.difficulties[gameState.difficulty].pointsMultiplier;
    const streakBonus = gameState.streak * 10;
    return Math.round((basePoints + timeBonus + streakBonus) * difficultyMultiplier);
}

function startTimer() {
    if (!gameState.isTimedMode) return;
    
    gameTimer = setInterval(() => {
        gameState.timeLeft--;
        updateDisplay();
        
        if (gameState.timeLeft <= 0) {
            clearInterval(gameTimer);
            // Tratar timeout
            handleTimeout();
        }
    }, 1000);
}

function handleTimeout() {
    gameState.lives--;
    gameState.streak = 0;
    
    if (gameState.lives <= 0) {
        showGameOver();
    } else {
        showFeedback('⏰ Tempo esgotado! Tente novamente.', 'error');
        resetQuestion();
    }
    
    updateDisplay();
}

function resetQuestion() {
    gameState.timeLeft = gameConfig.difficulties[gameState.difficulty].timeLimit;
    startTimer();
}

function createConfetti() {
    const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24', '#f0932b', '#eb4d4b', '#6c5ce7'];
    
    for (let i = 0; i < 50; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.left = Math.random() * 100 + 'vw';
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.animationDelay = Math.random() * 3 + 's';
            document.body.appendChild(confetti);
            
            setTimeout(() => {
                confetti.remove();
            }, 3000);
        }, i * 50);
    }
}

function createParticles(x, y) {
    for (let i = 0; i < 10; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = x + 'px';
        particle.style.top = y + 'px';
        particle.style.backgroundColor = `hsl(${Math.random() * 360}, 70%, 60%)`;
        document.body.appendChild(particle);
        
        setTimeout(() => {
            particle.remove();
        }, 3000);
    }
}

// Funções auxiliares do jogo
function showHint() {
    if (gameState.currentGame === 'letters') {
        const questionsArray = gameData.lettersShuffled || gameData.letters;
        const question = questionsArray[currentQuestion];
        showFeedback(`💡 Dica: Esta é a letra "${question.letter}"`, 'info');
    } else if (gameState.currentGame === 'words') {
        const wordsArray = gameData.wordsShuffled || gameData.words;
        const wordData = wordsArray[currentQuestion];
        showFeedback(`💡 Dica: A palavra tem ${wordData.word.length} letras`, 'info');
    } else if (gameState.currentGame === 'match') {
        const matchArray = gameData.matchShuffled || gameData.match;
        const matchData = matchArray[currentQuestion];
        showFeedback(`💡 Dica: Procure por ${matchData.image}`, 'info');
    }
}

function skipQuestion() {
    if (gameState.lives > 1) {
        gameState.lives--;
        gameState.streak = 0;
        currentQuestion++;
        updateDisplay();
        
        if (gameState.currentGame === 'letters') {
            startLettersGame();
        } else if (gameState.currentGame === 'words') {
            startWordsGame();
        } else if (gameState.currentGame === 'match') {
            startMatchGame();
        }
    } else {
        showFeedback('❌ Você precisa de pelo menos 1 vida para pular!', 'error');
    }
}

function showGameOver() {
    const gameArea = document.getElementById('gameArea');
    gameArea.innerHTML = `
        <div class="welcome-message fade-in">
            <h2>😔 Game Over!</h2>
            <p>Suas vidas acabaram!</p>
            <div class="welcome-emoji">💔</div>
            <p style="margin-top: 20px; font-size: 1.1em;">
                Pontuação Final: ${gameState.score}<br>
                Melhor Sequência: ${gameState.maxStreak}
            </p>
            <button class="control-btn success" onclick="goBack()" style="margin-top: 20px;">
                Tentar Novamente
            </button>
        </div>
    `;
}

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    initializeUser();
    updateProgress();
    updateDisplay();
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

function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

function startGame(gameType) {
    // Inicializar contexto de áudio na primeira interação
    initAudioContext();
    
    gameState.currentGame = gameType;
    gameState.level = 1;
    currentQuestion = 0;
    gameState.totalQuestions = 0;
    gameState.correctAnswers = 0;
    gameState.score = 0;
    gameState.streak = 0;
    gameState.maxStreak = 0;
    gameState.lives = gameConfig.difficulties[gameState.difficulty].lives;
    gameState.timeLeft = gameConfig.difficulties[gameState.difficulty].timeLimit;
    gameState.isTimedMode = gameState.difficulty !== 'easy';
    
    // Embaralhar perguntas para maior variedade
    if (gameType === 'letters') {
        gameData.lettersShuffled = shuffleArray(gameData.letters);
    } else if (gameType === 'words') {
        gameData.wordsShuffled = shuffleArray(gameData.words);
    } else if (gameType === 'match') {
        gameData.matchShuffled = shuffleArray(gameData.match);
    }
    
    document.getElementById('backBtn').style.display = 'inline-block';
    document.getElementById('hintBtn').style.display = 'inline-block';
    document.getElementById('skipBtn').style.display = 'inline-block';
    updateDisplay();
    
    // Iniciar música ambiente
    playAmbientMusic();
    
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
    const questionsArray = gameData.lettersShuffled || gameData.letters;
    if (currentQuestion >= questionsArray.length) {
        showGameComplete();
        return;
    }
    
    clearInterval(gameTimer);
    const question = questionsArray[currentQuestion];
    const gameArea = document.getElementById('gameArea');
    
    if (gameState.isTimedMode) {
        gameState.timeLeft = gameConfig.difficulties[gameState.difficulty].timeLimit;
        startTimer();
    }
    
    gameArea.innerHTML = `
        <div class="fade-in">
            <h2>Que letra é esta?</h2>
            <div class="letter-display" onclick="playLetterSound('${question.letter}')" style="cursor: pointer;" title="Clique para ouvir o som da letra">${question.letter}</div>
            <div class="options-grid">
                ${question.options.map((option, index) => 
                    `<button class="option-btn" onclick="playClickSound(); checkLetterAnswer(${index})" onmouseover="playHoverSound(); playLetterSound('${option}')">${option}</button>`
                ).join('')}
            </div>
        </div>
    `;
    
    // Tocar som da letra automaticamente
    setTimeout(() => {
        playLetterSound(question.letter);
    }, 500);
    
    document.getElementById('nextBtn').style.display = 'none';
}

function checkLetterAnswer(selectedIndex) {
    const questionsArray = gameData.lettersShuffled || gameData.letters;
    const question = questionsArray[currentQuestion];
    const options = document.querySelectorAll('.option-btn');
    
    gameState.totalQuestions++;
    
    if (selectedIndex === question.correct) {
        clearInterval(gameTimer);
        options[selectedIndex].classList.add('correct');
        gameState.correctAnswers++;
        gameState.streak++;
        gameState.maxStreak = Math.max(gameState.maxStreak, gameState.streak);
        
        const timeBonus = gameState.isTimedMode ? gameState.timeLeft * 5 : 0;
        const points = calculateScore(timeBonus);
        gameState.score += points;
        
        playSuccessSound();
        createParticles(event.target.offsetLeft + 50, event.target.offsetTop + 25);
        showFeedback(`Muito bem! 🌟 +${points} pontos`, 'success');
        checkAchievements();
        
        setTimeout(() => {
            currentQuestion++;
            const questionsArray = gameData.lettersShuffled || gameData.letters;
            if (currentQuestion < questionsArray.length) {
                startLettersGame();
            } else {
                showGameComplete();
            }
        }, 1500);
    } else {
        clearInterval(gameTimer);
        options[selectedIndex].classList.add('incorrect');
        options[question.correct].classList.add('correct');
        gameState.lives--;
        gameState.streak = 0;
        
        playErrorSound();
        options[selectedIndex].classList.add('shake');
        showFeedback('Tente novamente! A resposta correta é: ' + question.letter, 'error');
        
        if (gameState.lives <= 0) {
            setTimeout(showGameOver, 2500);
            return;
        }
        
        setTimeout(() => {
            currentQuestion++;
            const questionsArray = gameData.lettersShuffled || gameData.letters;
            if (currentQuestion < questionsArray.length) {
                startLettersGame();
            } else {
                showGameComplete();
            }
        }, 2500);
    }
    
    // Desabilitar botões após resposta
    options.forEach(btn => btn.disabled = true);
    updateDisplay();
    updateProgress();
}

function startWordsGame() {
    const wordsArray = gameData.wordsShuffled || gameData.words;
    if (currentQuestion >= wordsArray.length) {
        showGameComplete();
        return;
    }
    
    const wordData = wordsArray[currentQuestion];
    const allLetters = [...wordData.letters, ...wordData.extra].sort(() => Math.random() - 0.5);
    
    const gameArea = document.getElementById('gameArea');
    gameArea.innerHTML = `
        <div class="word-construction fade-in">
            <h2>Monte a palavra:</h2>
            <div class="word-display" onclick="playWordSound('${wordData.word}')" style="cursor: pointer;" title="Clique para ouvir o som da palavra">${wordData.word}</div>
            <div class="letter-slots">
                ${wordData.letters.map((letter, index) => 
                    `<div class="letter-slot" data-index="${index}"></div>`
                ).join('')}
            </div>
            <div class="available-letters">
                ${allLetters.map((letter, index) => 
                    `<div class="letter-tile" onclick="playClickSound(); selectLetter('${letter}', ${index})" onmouseover="playHoverSound(); playLetterSound('${letter}')">${letter}</div>`
                ).join('')}
            </div>
            <button class="control-btn" onclick="checkWord()" style="margin-top: 20px; display: none;" id="checkWordBtn">Verificar Palavra</button>
        </div>
    `;
    
    gameState.selectedLetters = [];
    gameState.wordProgress = new Array(wordData.letters.length).fill('');
}

function selectLetter(letter, tileIndex) {
    const wordsArray = gameData.wordsShuffled || gameData.words;
    const wordData = wordsArray[currentQuestion];
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
    const wordsArray = gameData.wordsShuffled || gameData.words;
    const wordData = wordsArray[currentQuestion];
    const isCorrect = gameState.wordProgress.join('') === wordData.word;
    
    gameState.totalQuestions++;
    
    if (isCorrect) {
        clearInterval(gameTimer);
        gameState.correctAnswers++;
        gameState.streak++;
        gameState.maxStreak = Math.max(gameState.maxStreak, gameState.streak);
        
        const timeBonus = gameState.isTimedMode ? gameState.timeLeft * 5 : 0;
        const points = calculateScore(timeBonus);
        gameState.score += points;
        
        playSuccessSound();
        createConfetti();
        showFeedback(`Perfeito! Você formou a palavra corretamente! 🎉 +${points} pontos`, 'success');
        checkAchievements();
        
        setTimeout(() => {
            currentQuestion++;
            const wordsArray = gameData.wordsShuffled || gameData.words;
            if (currentQuestion < wordsArray.length) {
                startWordsGame();
            } else {
                showGameComplete();
            }
        }, 2000);
    } else {
        gameState.lives--;
        gameState.streak = 0;
        
        playErrorSound();
        showFeedback('Quase lá! Tente novamente organizando as letras. ❤️ -1 vida', 'error');
        
        if (gameState.lives <= 0) {
            setTimeout(showGameOver, 2000);
            return;
        }
        
        // Reset do jogo atual
        setTimeout(() => {
            startWordsGame();
        }, 2000);
    }
    
    updateDisplay();
    updateProgress();
}

function startMatchGame() {
    const matchArray = gameData.matchShuffled || gameData.match;
    if (currentQuestion >= matchArray.length) {
        showGameComplete();
        return;
    }
    
    const matchData = matchArray[currentQuestion];
    
    const gameArea = document.getElementById('gameArea');
    gameArea.innerHTML = `
        <div class="match-game fade-in">
            <div class="word-side">
                <h2>Encontre a imagem para:</h2>
                <div class="match-word" onclick="playWordSound('${matchData.word}')" style="cursor: pointer;" title="Clique para ouvir o som da palavra">${matchData.word}</div>
            </div>
            <div class="image-side">
                <div class="image-options">
                    ${matchData.options.map((image, index) => 
                        `<div class="image-option" onclick="playClickSound(); checkMatch(${index})" onmouseover="playHoverSound()">${image}</div>`
                    ).join('')}
                </div>
            </div>
        </div>
    `;
    
    document.getElementById('nextBtn').style.display = 'none';
}

function checkMatch(selectedIndex) {
    const matchArray = gameData.matchShuffled || gameData.match;
    const matchData = matchArray[currentQuestion];
    const correctIndex = matchData.options.indexOf(matchData.image);
    const options = document.querySelectorAll('.image-option');
    
    gameState.totalQuestions++;
    
    if (selectedIndex === correctIndex) {
        clearInterval(gameTimer);
        options[selectedIndex].classList.add('correct');
        gameState.correctAnswers++;
        gameState.streak++;
        gameState.maxStreak = Math.max(gameState.maxStreak, gameState.streak);
        
        const timeBonus = gameState.isTimedMode ? gameState.timeLeft * 5 : 0;
        const points = calculateScore(timeBonus);
        gameState.score += points;
        
        playSuccessSound();
        options[selectedIndex].classList.add('glow');
        showFeedback(`Excelente! Você acertou! 🌟 +${points} pontos`, 'success');
        checkAchievements();
        
        setTimeout(() => {
            currentQuestion++;
            const matchArray = gameData.matchShuffled || gameData.match;
            if (currentQuestion < matchArray.length) {
                startMatchGame();
            } else {
                showGameComplete();
            }
        }, 1500);
    } else {
        clearInterval(gameTimer);
        options[selectedIndex].classList.add('incorrect');
        options[correctIndex].classList.add('correct');
        gameState.lives--;
        gameState.streak = 0;
        
        playErrorSound();
        options[selectedIndex].classList.add('shake');
        showFeedback('Boa tentativa! A resposta correta é: ' + matchData.image + ' ❤️ -1 vida', 'error');
        
        if (gameState.lives <= 0) {
            setTimeout(showGameOver, 2500);
            return;
        }
        
        setTimeout(() => {
            currentQuestion++;
            const matchArray = gameData.matchShuffled || gameData.match;
            if (currentQuestion < matchArray.length) {
                startMatchGame();
            } else {
                showGameComplete();
            }
        }, 2500);
    }
    
    // Desabilitar opções após resposta
    options.forEach(option => option.style.pointerEvents = 'none');
    updateDisplay();
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
    clearInterval(gameTimer);
    const percentage = Math.round((gameState.correctAnswers / gameState.totalQuestions) * 100);
    
    // Salvar progresso do usuário
    const profile = userProfiles[currentUser];
    profile.totalScore += gameState.score;
    profile.gamesCompleted[gameState.currentGame]++;
    profile.bestStreaks[gameState.currentGame] = Math.max(
        profile.bestStreaks[gameState.currentGame], 
        gameState.maxStreak
    );
    
    // Calcular nível baseado na pontuação total
    profile.level = Math.floor(profile.totalScore / 1000) + 1;
    
    saveUserData();
    checkAchievements();
    updateGameProgress();
    
    const gameArea = document.getElementById('gameArea');
    gameArea.innerHTML = `
        <div class="welcome-message fade-in">
            <h2>Parabéns! 🎉</h2>
            <p>Você completou o jogo!</p>
            <div class="welcome-emoji">🌟</div>
            <div style="margin-top: 20px;">
                <p><strong>📊 Estatísticas:</strong></p>
                <p>Acertos: ${gameState.correctAnswers} de ${gameState.totalQuestions} (${percentage}%)</p>
                <p>Pontuação: ${gameState.score} pontos</p>
                <p>Melhor Sequência: ${gameState.maxStreak} acertos</p>
                <p>Nível Atual: ${profile.level}</p>
            </div>
            <button class="control-btn success" onclick="goBack()" style="margin-top: 20px;">
                Escolher Outro Jogo
            </button>
        </div>
    `;
    
    createConfetti();
    document.getElementById('nextBtn').style.display = 'none';
    loadUserProfile();
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
    clearInterval(gameTimer);
    gameState.currentGame = null;
    currentQuestion = 0;
    document.getElementById('backBtn').style.display = 'none';
    document.getElementById('nextBtn').style.display = 'none';
    document.getElementById('hintBtn').style.display = 'none';
    document.getElementById('skipBtn').style.display = 'none';
    showWelcomeMessage();
}

function nextLevel() {
    // Implementar lógica para próximo nível se necessário
    document.getElementById('nextBtn').style.display = 'none';
}