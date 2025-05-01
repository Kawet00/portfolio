import { useRef, useEffect, useState } from 'react';

const CANVAS_SIZE = 400;
const GRID_SIZE = 20;
const CELL_SIZE = CANVAS_SIZE / GRID_SIZE;

type Point = { x: number; y: number };

export default function SnakeWindow() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [started, setStarted] = useState(false);
  const [snake, setSnake] = useState<Point[]>([{ x: 10, y: 10 }]);
  const [dir, setDir] = useState<Point>({ x: 1, y: 0 });
  const [food, setFood] = useState<Point>(() => ({
    x: Math.floor(Math.random() * GRID_SIZE),
    y: Math.floor(Math.random() * GRID_SIZE),
  }));
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);

  // Charger le meilleur score depuis localStorage
  useEffect(() => {
    const b = localStorage.getItem('snake-best-score');
    if (b) setBestScore(parseInt(b, 10));
  }, []);

  // Gestion des touches (flèches, ZQSD, WSAD)
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      if ((k === 'arrowup' || k === 'w' || k === 'z') && dir.y === 0) setDir({ x: 0, y: -1 });
      if ((k === 'arrowdown' || k === 's') && dir.y === 0) setDir({ x: 0, y: 1 });
      if ((k === 'arrowleft' || k === 'a' || k === 'q') && dir.x === 0) setDir({ x: -1, y: 0 });
      if ((k === 'arrowright' || k === 'd') && dir.x === 0) setDir({ x: 1, y: 0 });
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [dir]);

  // Loop de jeu
  useEffect(() => {
    if (!started || gameOver) return;
    const interval = setInterval(() => {
      setSnake(prev => {
        const head = { x: prev[0].x + dir.x, y: prev[0].y + dir.y };
        // collision murs ou soi-même
        if (
          head.x < 0 || head.x >= GRID_SIZE ||
          head.y < 0 || head.y >= GRID_SIZE ||
          prev.some(p => p.x === head.x && p.y === head.y)
        ) {
          setGameOver(true);
          return prev;
        }
        const ate = head.x === food.x && head.y === food.y;
        const newSnake = [head, ...prev];
        if (!ate) newSnake.pop();
        else {
          setScore(s => s + 1);
          setFood({
            x: Math.floor(Math.random() * GRID_SIZE),
            y: Math.floor(Math.random() * GRID_SIZE),
          });
        }
        return newSnake;
      });
    }, 100);
    return () => clearInterval(interval);
  }, [started, dir, food, gameOver]);

  // Dessin du canvas
  useEffect(() => {
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = '#111';
    ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

    ctx.fillStyle = 'red';
    ctx.fillRect(food.x * CELL_SIZE, food.y * CELL_SIZE, CELL_SIZE, CELL_SIZE);

    ctx.fillStyle = 'lime';
    snake.forEach(p =>
      ctx.fillRect(p.x * CELL_SIZE, p.y * CELL_SIZE, CELL_SIZE - 1, CELL_SIZE - 1)
    );

    if (gameOver) {
      ctx.fillStyle = 'white';
      ctx.font = '20px sans-serif';
      ctx.fillText('Game Over', CANVAS_SIZE / 2 - 50, CANVAS_SIZE / 2);
    }
  }, [snake, food, gameOver]);

  // Enregistrer le meilleur score
  useEffect(() => {
    if (gameOver && score > bestScore) {
      setBestScore(score);
      localStorage.setItem('snake-best-score', score.toString());
    }
  }, [gameOver]);

  // Réinitialiser la partie
  const resetGame = () => {
    setSnake([{ x: 10, y: 10 }]);
    setDir({ x: 1, y: 0 });
    setFood({
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    });
    setScore(0);
    setGameOver(false);
    setStarted(true);
  };

  if (!started) {
    return (
      <div className="flex flex-col items-center">
        <h2 className="text-xl font-bold mb-2">Snake Game</h2>
        <p>High Score: {bestScore}</p>
        <button
          className="px-4 py-2 bg-green-600 text-white rounded"
          onClick={() => setStarted(true)}
        >
          Start Game
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center">
      <div className="w-full flex justify-between mb-2 px-4">
        <span>Score: {score}</span>
        <span>High: {bestScore}</span>
      </div>
      <canvas
        ref={canvasRef}
        width={CANVAS_SIZE}
        height={CANVAS_SIZE}
        className="border bg-black"
      />
      {gameOver && (
        <button
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded"
          onClick={resetGame}
        >
          Restart
        </button>
      )}
    </div>
  );
}