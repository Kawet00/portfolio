import React, { useRef, useEffect, useState } from 'react';

const COLS = 10;
const ROWS = 20;
const CELL_SIZE = 20;
const COLORS = [
    'cyan', 'blue', 'orange', 'yellow', 'green', 'purple', 'red'
];

// Tetromino definitions (rotations)
const SHAPES = [
    [[1, 1, 1, 1]],                                    // I
    [[2, 0, 0], [2, 2, 2]],                              // J
    [[0, 0, 3], [3, 3, 3]],                              // L
    [[4, 4], [4, 4]],                                  // O
    [[0, 5, 5], [5, 5, 0]],                              // S
    [[0, 6, 0], [6, 6, 6]],                              // T
    [[7, 7, 0], [0, 7, 7]]                               // Z
];

type Piece = {
    shape: number[][];
    x: number;
    y: number;
    color: string;
};

export default function TetrisWindow() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [grid, setGrid] = useState<number[][]>(
        Array.from({ length: ROWS }, () => Array(COLS).fill(0))
    );
    const [piece, setPiece] = useState<Piece | null>(null);
    const [nextShape, setNextShape] = useState<number>(0);
    const [score, setScore] = useState(0);
    const [bestScore, setBestScore] = useState(0);
    const [dropInterval, setDropInterval] = useState(500);
    const [gameOver, setGameOver] = useState(false);

    // initialize best score
    useEffect(() => {
        const b = localStorage.getItem('tetris-best-score');
        if (b) setBestScore(parseInt(b, 10));
        spawnPiece();
    }, []);

    // spawn a new piece
    const spawnPiece = () => {
        const id = nextShape || Math.floor(Math.random() * SHAPES.length);
        const shape = SHAPES[id];
        setNextShape(Math.floor(Math.random() * SHAPES.length));
        const p: Piece = {
            shape,
            x: Math.floor(COLS / 2) - Math.ceil(shape[0].length / 2),
            y: 0,
            color: COLORS[id]
        };
        if (collision(p, grid)) {
            setGameOver(true);
            updateBestScore();
        } else {
            setPiece(p);
        }
    };

    // Enregistrer le meilleur score quand le jeu se termine
    useEffect(() => {
        if (gameOver && score > bestScore) {
            setBestScore(score);
            localStorage.setItem('tetris-best-score', score.toString());
        }
    }, [gameOver, score]);
    

    // check collision
    const collision = (p: Piece, g: number[][]) => {
        for (let y = 0; y < p.shape.length; y++) {
            for (let x = 0; x < p.shape[y].length; x++) {
                if (
                    p.shape[y][x] &&
                    (g[p.y + y] && g[p.y + y][p.x + x]) !== 0
                ) {
                    return true;
                }
            }
        }
        return false;
    };

    // merge piece into grid
    const merge = (p: Piece, g: number[][]) => {
        const newGrid = g.map(row => [...row]);
        p.shape.forEach((row, y) =>
            row.forEach((val, x) => {
                if (val) newGrid[p.y + y][p.x + x] = val;
            })
        );
        return newGrid;
    };

    // clear full lines
    const sweep = (g: number[][]) => {
        let cleared = 0;
        const newGrid = g.filter(row => {
            if (row.every(cell => cell !== 0)) {
                cleared++;
                return false;
            }
            return true;
        });
        while (newGrid.length < ROWS) {
            newGrid.unshift(Array(COLS).fill(0));
        }
        if (cleared) {
            setScore(s => s + cleared * 10);
            setDropInterval(d => Math.max(100, d - cleared * 20));
        }
        return newGrid;
    };

    // drop piece
    useEffect(() => {
        if (gameOver) return;
        const id = setInterval(() => {
            if (!piece) return;
            const moved = { ...piece, y: piece.y + 1 };
            if (!collision(moved, grid)) {
                setPiece(moved);
            } else {
                const merged = merge(piece, grid);
                setGrid(sweep(merged));
                spawnPiece();
            }
        }, dropInterval);
        return () => clearInterval(id);
    }, [piece, grid, dropInterval, gameOver]);

    // handle keyboard
    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (!piece || gameOver) return;
            const move = { ...piece };
            if (e.key === 'ArrowLeft') move.x--;
            if (e.key === 'ArrowRight') move.x++;
            if (e.key === 'ArrowDown') move.y++;
            if (e.key === ' ' || e.key === 'ArrowUp') {
                // rotate
                const rotated = piece.shape[0].map((_, i) =>
                    piece.shape.map(row => row[i]).reverse()
                );
                move.shape = rotated;
            }
            if (!collision(move, grid)) setPiece(move);
        };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [piece, grid, gameOver]);

    // draw canvas
    useEffect(() => {
        const ctx = canvasRef.current?.getContext('2d');
        if (!ctx) return;
        ctx.clearRect(0, 0, COLS * CELL_SIZE, ROWS * CELL_SIZE);
        // draw grid
        grid.forEach((row, y) =>
            row.forEach((val, x) => {
                if (val) {
                    ctx.fillStyle = COLORS[val - 1];
                    ctx.fillRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
                    ctx.strokeRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
                }
            })
        );
        // draw current piece
        if (piece) {
            piece.shape.forEach((row, y) =>
                row.forEach((val, x) => {
                    if (val) {
                        ctx.fillStyle = piece.color;
                        ctx.fillRect((piece.x + x) * CELL_SIZE, (piece.y + y) * CELL_SIZE, CELL_SIZE, CELL_SIZE);
                        ctx.strokeRect((piece.x + x) * CELL_SIZE, (piece.y + y) * CELL_SIZE, CELL_SIZE, CELL_SIZE);
                    }
                })
            );
        }
        if (gameOver) {
            ctx.fillStyle = 'black';
            ctx.globalAlpha = 0.75;
            ctx.fillRect(0, 0, COLS * CELL_SIZE, ROWS * CELL_SIZE);
            ctx.globalAlpha = 1;
            ctx.fillStyle = 'white';
            ctx.font = '24px sans-serif';
            ctx.fillText('Game Over', 30, 200);
        }
    }, [grid, piece, gameOver]);

    const updateBestScore = () => {
        if (score > bestScore) {
            setBestScore(score);
            localStorage.setItem('tetris-best-score', score.toString());
        }
    };

    const restart = () => {
        setGrid(Array.from({ length: ROWS }, () => Array(COLS).fill(0)));
        setScore(0);
        setDropInterval(500);
        setGameOver(false);
        spawnPiece();
    };

    return (
        <div className="flex flex-col items-center">
            <h2 className="text-xl font-bold mb-2">Tetris</h2>
            <div className="flex justify-between w-full px-4 mb-2">
                <span>Score: {score}</span>
                <span>High: {bestScore}</span>
            </div>
            <canvas
                ref={canvasRef}
                width={COLS * CELL_SIZE}
                height={ROWS * CELL_SIZE}
                className="border bg-gray-800"
            />
            {gameOver && (
                <button
                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
                    onClick={restart}
                >
                    Restart
                </button>
            )}
        </div>
    );
}