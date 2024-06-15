// Het spelbord wordt weergegeven als een array van 9 elementen, die elk een lege cel ('', 'X' of 'O') kunnen bevatten.
const board = ['', '', '', '', '', '', '', '', ''];

// Huidige speler ('X' of 'O').
let currentPlayer = 'X';

// Geeft aan of het spel nog actief is.
let gameActive = true;

// Geeft aan of de speler tegen een bot speelt.
let againstBot = false;

// Functie die wordt aangeroepen wanneer een speler een zet doet.
function makeMove(index) {
	// Controleert of het spel actief is en de geselecteerde cel leeg is.
	if (gameActive && board[index] === '') {
		// Update het bord en de weergave met de zet van de huidige speler.
		board[index] = currentPlayer;
		document.getElementsByClassName('cell')[index].innerText = currentPlayer;

		// Controleert of de huidige speler de winnaar is.
		if (checkWinner()) {
			// Toont een melding en reset het spel als de huidige speler wint.
			alert(`${currentPlayer} wint!`);
			resetGame();
		} else if (board.every(cell => cell !== '')) {
			// Toont een melding en reset het spel als het gelijkspel is.
			alert('Gelijkspel!');
			resetGame();
		} else {
			// Wisselt naar de andere speler voor de volgende zet.
			currentPlayer = currentPlayer === 'X' ? 'O' : 'X';

			// Als tegen een bot wordt gespeeld en het de beurt van de bot is, wordt een zet voor de bot gemaakt.
			if (againstBot && currentPlayer === 'O') {
				playBotMove();
			}
		}
	}
}

// Controleert of er een winnaar is op het huidige bord.
function checkWinner() {
	// Lijst van winnende combinaties op het bord.
	const winningCombinations = [
		[0, 1, 2], [3, 4, 5], [6, 7, 8], // Horizontaal
		[0, 3, 6], [1, 4, 7], [2, 5, 8], // Verticaal
		[0, 4, 8], [2, 4, 6]             // Diagonaal
	];

	// Controleert of een van de winnende combinaties op het bord overeenkomt met de huidige speler.
	for (const combination of winningCombinations) {
		const [a, b, c] = combination;
		if (board[a] && board[a] === board[b] && board[a] === board[c]) {
			gameActive = false;
			return true; 
		}
	}

	return false;
}

// Voert een zet uit voor de bot.
function playBotMove() {
	// Bepaalt de beschikbare lege cellen op het bord.
	const emptyCells = board.reduce((acc, cell, index) => {
		if (cell === '') acc.push(index);
		return acc;
	}, []);

	// Kiest een willekeurige index uit de beschikbare lege cellen en voert een zet uit.
	const randomIndex = Math.floor(Math.random() * emptyCells.length);
	makeMove(emptyCells[randomIndex]);
}

// Reset het spelbord en gerelateerde variabelen voor een nieuw spel.
function resetGame() {
	board.fill('');
	document.querySelectorAll('.cell').forEach(cell => cell.innerText = '');
	currentPlayer = 'X';
	gameActive = true;
}

// Schakelt tussen spelen tegen een bot en spelen tegen een menselijke tegenstander.
function toggleAgainstBot() {
	againstBot = !againstBot;
	resetGame();

	// Schakelt de knoppen in of uit op basis van de geselecteerde modus.
	const botButton = document.getElementById('mode-selector').children[0];
	const humanButton = document.getElementById('mode-selector').children[1];

	if (againstBot) {
		botButton.disabled = true;
		humanButton.disabled = false;
	} else {
		botButton.disabled = false;
		humanButton.disabled = true;
	}
}






// Voeg deze variabelen toe voor het bijhouden van de scores.
let player1Score = 0;
let player2Score = 0;
let botScore = 0;

// Update de makeMove-functie om de punten bij te houden en weer te geven.
function makeMove(index) {
	if (gameActive && board[index] === '') {
		board[index] = currentPlayer;
		const cell = document.getElementsByClassName('cell')[index];
		cell.innerText = currentPlayer;
		cell.classList.add(currentPlayer.toLowerCase());

		if (checkWinner()) {
			if (againstBot) {
				currentPlayer === 'X' ? (player1Score += 1) : (botScore += 1);
				updateScoreboard();
			} else {
				currentPlayer === 'X' ? (player1Score += 1) : (player2Score += 1);
				updateScoreboard();
			}

			alert(`${currentPlayer} wint!`);

			// Reset het spel en controleer of een speler 3 punten heeft behaald.
			if (player1Score === 3 || player2Score === 3 || botScore === 3) {
				alert(`Einde van het spel. 
Player 1:  ${player1Score}
Player 2:  ${player2Score}
       Bot:  ${botScore}`);
				resetScores();
			} else {
				resetGame();
			}
		} else if (board.every(cell => cell !== '')) {
			alert('Gelijkspel!');
			resetGame();
		} else {
			currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
			if (againstBot && currentPlayer === 'O') {
				playBotMove();
			}
		}
	}
}

// Voeg deze functie toe om het scorebord bij te werken.
function updateScoreboard() {
	document.getElementById('player1-score').innerText = `Player 1: ${player1Score}`;
	document.getElementById('player2-score').innerText = `Player 2: ${player2Score}`;
	document.getElementById('bot-score').innerText = `Bot: ${botScore}`;
}

// Voeg deze functie toe om de scores te resetten.
function resetScores() {
	player1Score = 0;
	player2Score = 0;
	botScore = 0;
	updateScoreboard();
}

// Voeg deze regel toe aan het einde van de resetGame-functie om het scorebord bij het resetten van het spel bij te werken.
updateScoreboard();





























