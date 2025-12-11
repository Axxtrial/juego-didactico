// ===================================
// MEMORAMA DEL SISTEMA INMUNOLÓGICO
// game.js - Versión con cartas idénticas
// ===================================

// Estado del juego
let gameState = {
    numPlayers: 2,
    players: [
        { name: 'Jugador 1', score: 0 },
        { name: 'Jugador 2', score: 0 }
    ],
    currentPlayer: 0,
    flippedCards: [],
    matchedPairs: [],
    cards: [],
    canFlip: true
};

// Datos de las parejas de cartas con emojis/iconos
const cardPairs = [
    { 
        id: 1, 
        text: 'Linfocito T', 
        colorClass: 'color-1',
        icon: '🔵',
        description: 'Los linfocitos T son células inmunitarias que identifican y destruyen células infectadas por virus o células cancerosas. Son esenciales en la respuesta inmune celular.'
    },
    { 
        id: 2, 
        text: 'Linfocito B', 
        colorClass: 'color-2',
        icon: '🟢',
        description: 'Los linfocitos B producen anticuerpos, proteínas específicas que se adhieren a patógenos y los marcan para su destrucción. Son clave en la inmunidad humoral.'
    },
    { 
        id: 3, 
        text: 'Macrófago', 
        colorClass: 'color-3',
        icon: '🟡',
        description: 'Los macrófagos son células que engullen y digieren patógenos, células muertas y desechos. Actúan como "limpiadores" del sistema inmune mediante fagocitosis.'
    },
    { 
        id: 4, 
        text: 'Neutrófilo', 
        colorClass: 'color-4',
        icon: '🔴',
        description: 'Los neutrófilos son los primeros en llegar al sitio de infección. Son los glóbulos blancos más abundantes y destruyen bacterias mediante fagocitosis.'
    },
    { 
        id: 5, 
        text: 'Célula NK', 
        colorClass: 'color-5',
        icon: '🟣',
        description: 'Las células Natural Killer (NK) detectan y destruyen células infectadas por virus y células tumorales sin necesidad de activación previa. Son parte de la inmunidad innata.'
    },
    { 
        id: 6, 
        text: 'Timo', 
        colorClass: 'color-6',
        icon: '💗',
        description: 'El timo es un órgano linfoide ubicado en el tórax donde los linfocitos T maduran y aprenden a distinguir células propias de extrañas antes de entrar en circulación.'
    },
    { 
        id: 7, 
        text: 'Médula ósea', 
        colorClass: 'color-7',
        icon: '🦴',
        description: 'La médula ósea es el tejido esponjoso dentro de los huesos donde se producen todas las células sanguíneas, incluyendo glóbulos rojos, blancos y plaquetas.'
    },
    { 
        id: 8, 
        text: 'Bazo', 
        colorClass: 'color-8',
        icon: '🧡',
        description: 'El bazo filtra la sangre, elimina glóbulos rojos viejos, almacena plaquetas y produce anticuerpos. Es crucial para la respuesta inmune contra infecciones sanguíneas.'
    },
    { 
        id: 9, 
        text: 'Anticuerpo', 
        colorClass: 'color-9',
        icon: '🏹',
        description: 'Los anticuerpos son proteínas en forma de Y producidas por linfocitos B. Se unen específicamente a antígenos (sustancias extrañas) marcándolos para su destrucción.'
    },
    { 
        id: 10, 
        text: 'Bacteria', 
        colorClass: 'color-10',
        icon: '🦠',
        description: 'Las bacterias son microorganismos unicelulares que pueden causar infecciones. Algunas son beneficiosas, pero otras patógenas requieren respuesta inmune para su eliminación.'
    },
    { 
        id: 11, 
        text: 'Virus', 
        colorClass: 'color-11',
        icon: '👾',
        description: 'Los virus son agentes infecciosos que necesitan invadir células vivas para reproducirse. El sistema inmune los combate destruyendo las células infectadas.'
    },
    { 
        id: 12, 
        text: 'Vacuna', 
        colorClass: 'color-12',
        icon: '💉',
        description: 'Las vacunas contienen formas debilitadas o inactivas de patógenos que entrenan al sistema inmune para reconocer y combatir infecciones futuras sin causar enfermedad.'
    }
];

// Elementos del DOM
const setupScreen = document.getElementById('setupScreen');
const gameScreen = document.getElementById('gameScreen');
const finishedScreen = document.getElementById('finishedScreen');
const playerButtons = document.querySelectorAll('.player-btn');
const playerInputsContainer = document.getElementById('playerInputs');
const startBtn = document.getElementById('startBtn');
const resetBtn = document.getElementById('resetBtn');
const playAgainBtn = document.getElementById('playAgainBtn');
const newConfigBtn = document.getElementById('newConfigBtn');
const gameBoard = document.getElementById('gameBoard');
const scoresContainer = document.getElementById('scoresContainer');
const currentTurnDiv = document.getElementById('currentTurn');
const infoModal = document.getElementById('infoModal');

// ===================================
// INICIALIZACIÓN
// ===================================

init();

function init() {
    setupEventListeners();
    updatePlayerInputs();
}

function setupEventListeners() {
    // Selección del número de jugadores
    playerButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            playerButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            gameState.numPlayers = parseInt(btn.dataset.players);
            updatePlayerInputs();
        });
    });

    // Iniciar juego
    startBtn.addEventListener('click', startGame);

    // Reiniciar juego
    resetBtn.addEventListener('click', () => {
        showScreen('setup');
    });

    // Jugar de nuevo
    playAgainBtn.addEventListener('click', () => {
        initializeGame();
        showScreen('game');
    });

    // Nueva configuración
    newConfigBtn.addEventListener('click', () => {
        showScreen('setup');
    });
}

// ===================================
// CONFIGURACIÓN DE JUGADORES
// ===================================

function updatePlayerInputs() {
    playerInputsContainer.innerHTML = '';
    gameState.players = [];

    for (let i = 0; i < gameState.numPlayers; i++) {
        const row = document.createElement('div');
        row.className = 'player-input-row';

        const number = document.createElement('span');
        number.className = 'player-number';
        number.textContent = `${i + 1}.`;

        const input = document.createElement('input');
        input.type = 'text';
        input.className = 'player-input';
        input.placeholder = `Jugador ${i + 1}`;
        input.value = `Jugador ${i + 1}`;
        input.dataset.index = i;

        input.addEventListener('input', (e) => {
            const index = parseInt(e.target.dataset.index);
            gameState.players[index].name = e.target.value || `Jugador ${index + 1}`;
        });

        row.appendChild(number);
        row.appendChild(input);
        playerInputsContainer.appendChild(row);

        gameState.players.push({
            name: `Jugador ${i + 1}`,
            score: 0
        });
    }
}

function startGame() {
    // Obtener nombres de los inputs
    const inputs = document.querySelectorAll('.player-input');
    inputs.forEach((input, index) => {
        gameState.players[index].name = input.value || `Jugador ${index + 1}`;
    });

    initializeGame();
    showScreen('game');
}

// ===================================
// LÓGICA DEL JUEGO
// ===================================

function initializeGame() {
    // Reiniciar estado del juego
    gameState.currentPlayer = 0;
    gameState.flippedCards = [];
    gameState.matchedPairs = [];
    gameState.canFlip = true;
    gameState.players.forEach(p => p.score = 0);

    // Crear cartas del juego - AHORA AMBAS CARTAS SON IDÉNTICAS
    const gameCards = [];
    cardPairs.forEach((pair, index) => {
        // Primera carta de la pareja (idéntica)
        gameCards.push({
            id: `${index}-a`,
            pairId: pair.id,
            content: pair.text,
            colorClass: pair.colorClass,
            icon: pair.icon,
            description: pair.description
        });
        // Segunda carta de la pareja (idéntica a la primera)
        gameCards.push({
            id: `${index}-b`,
            pairId: pair.id,
            content: pair.text,  // MISMO TEXTO
            colorClass: pair.colorClass,  // MISMO COLOR
            icon: pair.icon,  // MISMO ICONO
            description: pair.description  // MISMA DESCRIPCIÓN
        });
    });

    // Mezclar cartas ALEATORIAMENTE cada vez
    gameState.cards = shuffleArray(gameCards);

    // Renderizar juego
    renderGame();
}

// Función para mezclar array aleatoriamente (algoritmo Fisher-Yates)
function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

function renderGame() {
    // Renderizar puntuaciones
    scoresContainer.innerHTML = '';
    gameState.players.forEach((player, index) => {
        const scoreDiv = document.createElement('div');
        scoreDiv.className = `player-score ${index === gameState.currentPlayer ? 'active' : ''}`;
        scoreDiv.textContent = `${player.name}: ${player.score}`;
        scoresContainer.appendChild(scoreDiv);
    });

    // Renderizar turno actual
    currentTurnDiv.textContent = `Turno de: ${gameState.players[gameState.currentPlayer].name}`;

    // Renderizar tablero
    gameBoard.innerHTML = '';
    gameState.cards.forEach(card => {
        const cardElement = document.createElement('button');
        cardElement.className = 'card';
        cardElement.dataset.id = card.id;

        const isFlipped = isCardFlipped(card);
        if (isFlipped) {
            cardElement.classList.add('flipped', card.colorClass);
            cardElement.innerHTML = `
                <div class="card-image">${card.icon}</div>
                <div class="card-text">${card.content}</div>
            `;
        } else {
            cardElement.innerHTML = '<span class="card-back">🛡️</span>';
        }

        cardElement.addEventListener('click', () => handleCardClick(card));
        gameBoard.appendChild(cardElement);
    });
}

function isCardFlipped(card) {
    return gameState.flippedCards.find(c => c.id === card.id) || 
           gameState.matchedPairs.includes(card.pairId);
}

function handleCardClick(card) {
    // Validar si se puede voltear la carta
    if (!gameState.canFlip || 
        gameState.flippedCards.length >= 2 || 
        gameState.flippedCards.find(c => c.id === card.id) || 
        gameState.matchedPairs.includes(card.pairId)) {
        return;
    }

    // Voltear carta
    gameState.flippedCards.push(card);
    renderGame();

    // Si se han volteado 2 cartas
    if (gameState.flippedCards.length === 2) {
        gameState.canFlip = false;

        setTimeout(() => {
            const [card1, card2] = gameState.flippedCards;

            if (card1.pairId === card2.pairId) {
                // ¡Pareja encontrada!
                gameState.matchedPairs.push(card1.pairId);
                gameState.players[gameState.currentPlayer].score++;
                
                // Mostrar modal con información
                showInfoModal(card1);
                
                // Después de 4.2 segundos, cerrar modal y continuar
                setTimeout(() => {
                    hideInfoModal();
                    gameState.flippedCards = [];
                    gameState.canFlip = true;
                    renderGame();

                    // Verificar si el juego terminó
                    if (gameState.matchedPairs.length === cardPairs.length) {
                        setTimeout(() => {
                            showFinished();
                        }, 500);
                    }
                }, 4200);
            } else {
                // No hay pareja - Cambio automático de jugador
                gameState.flippedCards = [];
                
                // Mostrar notificación de cambio de jugador
                const nextPlayer = (gameState.currentPlayer + 1) % gameState.players.length;
                showPlayerChangeNotification(nextPlayer);
                
                setTimeout(() => {
                    gameState.currentPlayer = nextPlayer;
                    gameState.canFlip = true;
                    renderGame();
                }, 1000);
            }
        }, 1500);
    }
}

// ===================================
// MODAL DE INFORMACIÓN
// ===================================

function showInfoModal(card) {
    const modalIcon = document.getElementById('modalIcon');
    const modalTitle = document.getElementById('modalTitle');
    const modalDescription = document.getElementById('modalDescription');
    const modalDetail = document.getElementById('modalDetail');

    // Usar directamente la información de la carta
    modalIcon.textContent = card.icon;
    modalTitle.textContent = card.content;
    modalDescription.textContent = '¡Pareja encontrada!';
    modalDetail.textContent = card.description;

    infoModal.classList.add('active');
}

function hideInfoModal() {
    infoModal.classList.remove('active');
}

function showPlayerChangeNotification(nextPlayerIndex) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: linear-gradient(135deg, #3b82f6, #a855f7);
        color: white;
        padding: 30px 50px;
        border-radius: 20px;
        font-size: 24px;
        font-weight: bold;
        z-index: 999;
        box-shadow: 0 10px 40px rgba(0,0,0,0.3);
        animation: fadeIn 0.3s;
    `;
    notification.textContent = `Turno de: ${gameState.players[nextPlayerIndex].name}`;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 1000);
}

// ===================================
// PANTALLA FINAL
// ===================================

function showFinished() {
    // Encontrar ganador(es)
    let maxScore = 0;
    let winners = [];
    gameState.players.forEach((player, index) => {
        if (player.score > maxScore) {
            maxScore = player.score;
            winners = [index];
        } else if (player.score === maxScore) {
            winners.push(index);
        }
    });

    // Anuncio del ganador
    const winnerDiv = document.getElementById('winnerAnnouncement');
    if (winners.length === 1) {
        winnerDiv.innerHTML = `
            <div class="winner-announcement">🎉 Ganador: ${gameState.players[winners[0]].name}</div>
            <div class="winner-score">Con ${gameState.players[winners[0]].score} parejas encontradas</div>
        `;
    } else {
        const winnerNames = winners.map(i => gameState.players[i].name).join(' y ');
        winnerDiv.innerHTML = `
            <div class="winner-announcement">🎉 ¡Empate!</div>
            <div class="winner-score">${winnerNames}</div>
        `;
    }

    // Puntuaciones finales
    const finalScoresDiv = document.getElementById('finalScores');
    finalScoresDiv.innerHTML = '';

    const sortedPlayers = gameState.players
        .map((player, index) => ({ ...player, index }))
        .sort((a, b) => b.score - a.score);

    const medals = ['🥇', '🥈', '🥉', '🏅'];

    sortedPlayers.forEach((player, position) => {
        const scoreItem = document.createElement('div');
        scoreItem.className = 'score-item';
        scoreItem.innerHTML = `
            <div class="score-item-left">
                <span class="medal">${medals[position] || '🏅'}</span>
                <span class="player-name">${player.name}</span>
            </div>
            <span class="score-value">${player.score} parejas</span>
        `;
        finalScoresDiv.appendChild(scoreItem);
    });

    showScreen('finished');
}

// ===================================
// UTILIDADES
// ===================================

function showScreen(screen) {
    setupScreen.classList.remove('active');
    gameScreen.classList.remove('active');
    finishedScreen.classList.remove('active');

    if (screen === 'setup') {
        setupScreen.classList.add('active');
        updatePlayerInputs();
    } else if (screen === 'game') {
        gameScreen.classList.add('active');
    } else if (screen === 'finished') {
        finishedScreen.classList.add('active');
    }
}

// ===================================
// FIN DEL CÓDIGO
// ===================================