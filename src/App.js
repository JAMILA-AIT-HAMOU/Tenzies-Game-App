import Die from "./Die";
import { useState, useRef, useEffect } from "react";
import { nanoid } from "nanoid";
import Confetti from "react-confetti";

// Constants for game configuration
const GAME_DURATION = 35;
const DICE_COUNT = 10;

export default function App() {
  const [dice, setDice] = useState(() => generateAllNewDice());
  const [rolls, setRolls] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [isRunning, setIsRunning] = useState(false);
  const [hasLost, setHasLost] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);

  const buttonRef = useRef(null);

  const gameWon = dice.every((die) => die.isHeld) && 
                  dice.every((die) => die.value === dice[0].value);

  // Generate new dice array
  function generateAllNewDice() {
    return new Array(DICE_COUNT).fill(0).map(() => ({
      value: Math.ceil(Math.random() * 6),
      isHeld: false,
      id: nanoid(),
    }));
  }

  // Start a new game
  function startGame() {
    setGameStarted(true);
    setTimeLeft(GAME_DURATION);
    setIsRunning(true);
    setHasLost(false);
    setRolls(0);
    setDice(generateAllNewDice());
  }

  // Reset game completely
  function resetGame() {
    setGameStarted(false);
    setTimeLeft(GAME_DURATION);
    setIsRunning(false);
    setHasLost(false);
    setRolls(0);
    setDice(generateAllNewDice());
  }

  // Roll dice or start new game
  function rollDice() {
    if (gameWon || hasLost) {
      resetGame();
      return;
    }

    if (!gameWon && !hasLost && isRunning) {
      setRolls(prev => prev + 1);
      const newDice = dice.map((die) =>
        die.isHeld ? die : { ...die, value: Math.ceil(Math.random() * 6) }
      );
      setDice(newDice);
    }
  }

  // Hold a die
  function hold(id) {
    if (!hasLost && !gameWon && isRunning) {
      setDice((oldDice) =>
        oldDice.map((die) =>
          die.id === id ? { ...die, isHeld: !die.isHeld } : die
        )
      );
    }
  }

  // Handle game won state
  useEffect(() => {
    if (gameWon) {
      setIsRunning(false);
      buttonRef.current?.focus();
    }
  }, [gameWon]);

  // Timer logic
  useEffect(() => {
    let timer;
    if (isRunning && timeLeft > 0 && !gameWon) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && !gameWon) {
      setIsRunning(false);
      setHasLost(true);
    }
    return () => clearInterval(timer);
  }, [isRunning, timeLeft, gameWon]);

  // Render dice elements
  const diceElements = dice.map((dieObj) => (
    <Die
      key={dieObj.id}
      value={dieObj.value}
      isHeld={dieObj.isHeld}
      hold={() => hold(dieObj.id)}
      disabled={hasLost || gameWon || !isRunning}
    />
  ));

  return (
    <main>
      {!gameStarted ? (
        <div className="start-screen">
          <h1 className="title">🎲 Tenzies</h1>
          <p className="instructions">
            Roll until all dice are the same. Click each die to freeze it at its
            current value between rolls. You have {GAME_DURATION} seconds to win!
          </p>
          <button className="start-btn" onClick={startGame}>
            Start Game
          </button>
        </div>
      ) : (
        <>
          {gameWon && <Confetti />}
          
          <div aria-live="polite" className="sr-only">
            {gameWon && <p>Congratulations! You won in {rolls} rolls!</p>}
            {hasLost && <p>Time's up! You failed to complete the game.</p>}
          </div>

          <h1 className="title">🎲 Tenzies</h1>
          <p className="instructions">
            Roll until all dice are the same. Click each die to freeze it at its
            current value between rolls.
          </p>

          <div className="game-stats">
            <p className="rolls">Rolls: {rolls}</p>
            {timeLeft > 0 ? (
              <p className="timer">⏰ Time left: {timeLeft}s</p>
            ) : (
              <p className="lose-message">Time's up! You lose 😢</p>
            )}
          </div>

          <div className="dice-container">{diceElements}</div>

          <button 
            ref={buttonRef} 
            className="roll-dice"
            onClick={gameWon || hasLost ? resetGame : rollDice}
          >
            {gameWon ? "New Game" : hasLost ? "Try Again" : "Roll"}
          </button>

          {gameWon && (
            <p className="win-message">
              🎉 Congratulations! You won in {rolls} rolls! 🎉
            </p>
          )}
        </>
      )}
    </main>
  );
}