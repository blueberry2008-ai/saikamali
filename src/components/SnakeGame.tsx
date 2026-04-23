import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Point, GameStatus } from '../types';
import { GRID_SIZE, INITIAL_SNAKE, INITIAL_DIRECTION, TICK_RATE } from '../constants';

interface SnakeGameProps {
  onScoreChange: (score: number) => void;
  accentColor: string;
}

const SnakeGame: React.FC<SnakeGameProps> = ({ onScoreChange, accentColor }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [direction, setDirection] = useState<Point>(INITIAL_DIRECTION);
  const [status, setStatus] = useState<GameStatus>('IDLE');
  const [score, setScore] = useState(0);
  const directionRef = useRef<Point>(INITIAL_DIRECTION);

  const generateFood = useCallback((currentSnake: Point[]) => {
    let newFood;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      const isOnSnake = currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y);
      if (!isOnSnake) break;
    }
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    directionRef.current = INITIAL_DIRECTION;
    setFood(generateFood(INITIAL_SNAKE));
    setScore(0);
    onScoreChange(0);
    setStatus('IDLE');
  };

  const startGame = () => {
    if (status === 'GAMEOVER') {
      resetGame();
    }
    setStatus('PLAYING');
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
          if (directionRef.current.y === 0) setDirection({ x: 0, y: -1 });
          break;
        case 'ArrowDown':
          if (directionRef.current.y === 0) setDirection({ x: 0, y: 1 });
          break;
        case 'ArrowLeft':
          if (directionRef.current.x === 0) setDirection({ x: -1, y: 0 });
          break;
        case 'ArrowRight':
          if (directionRef.current.x === 0) setDirection({ x: 1, y: 0 });
          break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    directionRef.current = direction;
  }, [direction]);

  useEffect(() => {
    if (status !== 'PLAYING') return;

    const gameLoop = setInterval(() => {
      setSnake(prevSnake => {
        const head = prevSnake[0];
        const newHead = {
          x: head.x + directionRef.current.x,
          y: head.y + directionRef.current.y,
        };

        // Check wall collision
        if (newHead.x < 0 || newHead.x >= GRID_SIZE || newHead.y < 0 || newHead.y >= GRID_SIZE) {
          setStatus('GAMEOVER');
          return prevSnake;
        }

        // Check self collision
        if (prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
          setStatus('GAMEOVER');
          return prevSnake;
        }

        const newSnake = [newHead, ...prevSnake];

        // Check food collision
        if (newHead.x === food.x && newHead.y === food.y) {
          setScore(s => {
            const next = s + 10;
            onScoreChange(next);
            return next;
          });
          setFood(generateFood(newSnake));
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    }, TICK_RATE);

    return () => clearInterval(gameLoop);
  }, [status, food, generateFood, onScoreChange]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear board
    ctx.fillStyle = '#15171e';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grid lines (Professional Polish grid)
    ctx.strokeStyle = 'rgba(255,255,255,0.03)';
    ctx.lineWidth = 2; // Matches the 2px gap in design
    const cellSize = canvas.width / GRID_SIZE;

    for (let i = 0; i <= GRID_SIZE; i++) {
        ctx.beginPath();
        ctx.moveTo(i * cellSize, 0);
        ctx.lineTo(i * cellSize, canvas.height);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, i * cellSize);
        ctx.lineTo(canvas.width, i * cellSize);
        ctx.stroke();
    }

    // Draw snake
    snake.forEach((segment, i) => {
      // Design uses #ffffff for head and #00f3ff for body
      if (i === 0) {
        ctx.fillStyle = '#ffffff';
        ctx.shadowBlur = 15;
        ctx.shadowColor = '#ffffff';
      } else {
        ctx.fillStyle = '#00f3ff';
        ctx.shadowBlur = 8;
        ctx.shadowColor = '#00f3ff';
      }
      
      const padding = 1;
      ctx.fillRect(
        segment.x * cellSize + padding,
        segment.y * cellSize + padding,
        cellSize - padding * 2,
        cellSize - padding * 2
      );
    });

    // Draw food
    ctx.fillStyle = '#ff00e5'; // Magenta food
    ctx.shadowBlur = 12;
    ctx.shadowColor = '#ff00e5';
    ctx.beginPath();
    ctx.arc(
      food.x * cellSize + cellSize / 2,
      food.y * cellSize + cellSize / 2,
      cellSize / 3,
      0,
      Math.PI * 2
    );
    ctx.fill();

  }, [snake, food, accentColor]);

  return (
    <div className="relative aspect-square w-full max-w-[500px] border-2 border-white/10 rounded-xl overflow-hidden bg-[#0a0a0a] shadow-2xl" id="snake-container">
      <canvas
        ref={canvasRef}
        width={500}
        height={500}
        className="w-full h-full"
      />
      
      <AnimatePresence>
        {status !== 'PLAYING' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/80 backdrop-blur-md"
          >
            <h2 className="text-4xl font-black italic text-white mb-4 tracking-tighter" style={{ textShadow: `0 0 10px #00f3ff` }}>
              SYNTH<span className="text-[#ff00e5]">SNAKE</span>.OS
            </h2>
            {status === 'GAMEOVER' && (
              <p className="text-[#00f3ff] mb-8 font-mono tracking-widest text-xs uppercase">CRITICAL_FAILURE // SCORE: {score.toLocaleString('en-US', { minimumIntegerDigits: 6 })}</p>
            )}
            <button
              id="start-game-btn"
              onClick={startGame}
              className="px-10 py-3 rounded-md font-bold text-black transition-all hover:scale-105 active:scale-95 uppercase tracking-widest text-sm border-b-4 border-[#00c2cc] active:border-b-0"
              style={{ backgroundColor: '#00f3ff', boxShadow: `0 0 20px rgba(0, 243, 255, 0.4)` }}
            >
              {status === 'IDLE' ? 'INITIALIZE' : 'REBOOT'}
            </button>
            <p className="mt-8 text-white/20 text-[10px] font-mono tracking-[0.3em]">MAPPED_KEYS: ARROW_VECTORS</p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="absolute top-4 right-4 z-0 pointer-events-none">
        <span className="font-mono text-white/20 text-4xl font-black">
          {score.toString().padStart(4, '0')}
        </span>
      </div>
    </div>
  );
};

export default SnakeGame;
