import React, { useState, useEffect, useRef } from "react";

{/* Set constants */}
const CELL_SIZE = 20;
{/* Give a space for gameplay elements within board for classic digital look */}
const ELEMENT_SIZE = CELL_SIZE - 1;
const WIDTH = 400;
const HEIGHT = 400;

{/* Function to randomize gameplay element positions */}
const getRandomPosition = () => {
    const x = Math.floor(Math.random() * (WIDTH / CELL_SIZE)) * CELL_SIZE;
    const y = Math.floor(Math.random() * (HEIGHT / CELL_SIZE)) * CELL_SIZE;
    return { x, y };
};

{/* Main game function */}
const SnakeGame = () => {
    {/* Init gameplay elements */}
    const [snake, setSnake] = useState([{ x: 0, y: 0 }]);
    const [food, setFood] = useState(getRandomPosition());
    const [direction, setDirection] = useState({ x: CELL_SIZE, y: 0 });
    const [gameOver, setGameOver] = useState(false);
    const [score, setScore] = useState(0);
    const [started, setStarted] = useState(false);
    const boardRef = useRef(null);

    {/* Function to handle snake movement */}
    const moveSnake = () => {
        setSnake((prev) => {
            const newHead = {
                x: prev[0].x + direction.x,
                y: prev[0].y + direction.y,
            };

            if (
                newHead.x < 0 ||
                newHead.y < 0 ||
                newHead.x >= WIDTH ||
                newHead.y >= HEIGHT ||
                prev.some((segment) => segment.x === newHead.x && segment.y === newHead.y)
            ) {
                setGameOver(true);
                setStarted(false);
                return prev;
            }

            const newSnake = [newHead, ...prev];
            if (newHead.x === food.x && newHead.y === food.y) {
                setFood(getRandomPosition());
                setScore((prevScore) => prevScore + 1);
            } else {
                newSnake.pop();
            }

            return newSnake;
        });
    };

    {/* Function to handle restarting game on game over */}
    const handleRestart = () => {
        setSnake([{ x: 0, y: 0 }]);
        setFood(getRandomPosition());
        setDirection({ x: CELL_SIZE, y: 0 });
        setGameOver(false);
        setScore(0);
        setStarted(true);
    };

    {/* Logic to handle snake controls via keyboard input */}
    useEffect(() => {
        if (!started) return;

        const handleKeyDown = (e) => {
            switch (e.key) {
                case "ArrowUp":
                    if (direction.y === 0) setDirection({ x: 0, y: -CELL_SIZE });
                    break;
                case "ArrowDown":
                    if (direction.y === 0) setDirection({ x: 0, y: CELL_SIZE });
                    break;
                case "ArrowLeft":
                    if (direction.x === 0) setDirection({ x: -CELL_SIZE, y: 0 });
                    break;
                case "ArrowRight":
                    if (direction.x === 0) setDirection({ x: CELL_SIZE, y: 0 });
                    break;
                default:
                    break;
            }
        };

        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [direction, started]);

    {/* Logic to update snake placement & timing */}
    useEffect(() => {
        if (!started || gameOver) return;

        const interval = setInterval(moveSnake, 150);
        return () => clearInterval(interval);
    }, [started, direction, gameOver]);

    {/* Render game */}
    return (
        <div className="flex flex-col items-center">
            <h1 className="text-2xl font-bold mb-2">React Snake Demo</h1>
            <p className="mb-2">Score: {score}</p>

            <div
                className="relative"
                style={{ width: WIDTH, height: HEIGHT }}
            >
                {/* Start overlay */}
                {(!started && !gameOver) && (
                    <div
                        className="absolute z-10 flex flex-col items-center justify-center bg-black bg-opacity-70 text-white"
                        style={{ width: WIDTH, height: HEIGHT, boxSizing: "border-box" }}
                    >
                        <button
                            onClick={() => setStarted(true)}
                            className="px-6 py-3 bg-green-600 rounded hover:bg-green-700"
                            aria-label="start-game" 
                        >
                            Start Game
                        </button>
                    </div>
                )}

                {/* Game over overlay */}
                {gameOver && (
                    <div
                        className="absolute z-10 flex flex-col items-center justify-center bg-black bg-opacity-70 text-white"
                        style={{ width: WIDTH, height: HEIGHT, boxSizing: "border-box" }}
                    >
                        <p data-testid="game-over-message" className="text-red-500 text-lg mb-4">Game Over</p>
                        <button
                            onClick={handleRestart}
                            className="px-6 py-3 bg-blue-500 rounded hover:bg-blue-600"
                            aria-label="restart-game" 
                        >
                            Restart Game
                        </button>
                    </div>
                )}

                {/* Board container with border included in size */}
                <div
                    style={{ width: WIDTH, height: HEIGHT, boxSizing: "border-box" }}
                    className="border border-gray-500 relative"
                >
                    {/* Background and snake area fills entire container */}
                    <div
                        ref={boardRef}
                        style={{ width: "100%", height: "100%" }}
                        className="relative bg-gray-800"
                    >
                        {snake.map((segment, idx) => (
                            <div
                                key={idx}
                                className="absolute bg-green-500"
                                role="snake-segment"
                                style={{
                                    width: ELEMENT_SIZE,
                                    height: ELEMENT_SIZE,
                                    left: segment.x,
                                    top: segment.y,
                                    boxSizing: "border-box",
                                }}
                            />
                        ))}
                        <div
                            className="absolute bg-red-500"
                            role="food"
                            style={{
                                width: ELEMENT_SIZE,
                                height: ELEMENT_SIZE,
                                left: food.x,
                                top: food.y,
                                boxSizing: "border-box",
                            }}
                        />
                    </div>
                </div>
            </div>

            <h2 className="text-xl font-bold mt-2 mb-1">How To Play:</h2>
            <p>Use keyboard directional keys to control the snake.</p>
            <p>Eat the red apples to increase score.</p>
            <p>Avoid colliding with self and walls.</p>
        </div>
    );
};

export default SnakeGame;
