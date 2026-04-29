import { useState, useEffect, useCallback, useRef } from 'react';
import { Trophy, RefreshCcw, Gamepad2 } from 'lucide-react';

const GRID_SIZE = 20;
const INITIAL_SPEED = 150;
const MIN_SPEED = 60;

type Point = { x: number; y: number };

const INITIAL_SNAKE: Point[] = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];
const INITIAL_DIRECTION: Point = { x: 0, y: -1 };

function randomFoodPosition(snake: Point[]): Point {
  let newFood: Point;
  while (true) {
    newFood = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    };
    // Ensure food doesn't spawn on the snake
    const isOnSnake = snake.some(segment => segment.x === newFood.x && segment.y === newFood.y);
    if (!isOnSnake) break;
  }
  return newFood;
}

export function SnakeGame() {
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [direction, setDirection] = useState<Point>(INITIAL_DIRECTION);
  const directionRef = useRef(INITIAL_DIRECTION);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [isGameOver, setIsGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    const saved = localStorage.getItem('snakeHighScore');
    return saved ? parseInt(saved, 10) : 0;
  });

  const gameBoardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setFood(randomFoodPosition(INITIAL_SNAKE));
  }, []);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    directionRef.current = INITIAL_DIRECTION;
    setScore(0);
    setIsGameOver(false);
    setIsPaused(false);
    setFood(randomFoodPosition(INITIAL_SNAKE));
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent scrolling when playing
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
      }

      if (e.key === ' ' && !isGameOver) {
        setIsPaused(p => !p);
        return;
      }

      if (isPaused || isGameOver) return;

      const currentDir = directionRef.current;
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          if (currentDir.y === 0) directionRef.current = { x: 0, y: -1 };
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          if (currentDir.y === 0) directionRef.current = { x: 0, y: 1 };
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          if (currentDir.x === 0) directionRef.current = { x: -1, y: 0 };
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          if (currentDir.x === 0) directionRef.current = { x: 1, y: 0 };
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPaused, isGameOver]);

  const gameLoop = useCallback(() => {
    if (isGameOver || isPaused) return;

    setSnake((prevSnake) => {
      const dir = directionRef.current;
      const head = prevSnake[0];
      const newHead = {
        x: head.x + dir.x,
        y: head.y + dir.y,
      };

      // Check wall collision
      if (
        newHead.x < 0 ||
        newHead.x >= GRID_SIZE ||
        newHead.y < 0 ||
        newHead.y >= GRID_SIZE
      ) {
        setIsGameOver(true);
        return prevSnake;
      }

      // Check self collision
      if (prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
        setIsGameOver(true);
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      // Check food
      if (newHead.x === food.x && newHead.y === food.y) {
        setScore(s => {
          const newScore = s + 10;
          if (newScore > highScore) {
            setHighScore(newScore);
            localStorage.setItem('snakeHighScore', newScore.toString());
          }
          return newScore;
        });
        setFood(randomFoodPosition(newSnake));
      } else {
        newSnake.pop(); // Remove tail if no food eaten
      }

      return newSnake;
    });
  }, [food, highScore, isGameOver, isPaused]);

  useEffect(() => {
    const currentSpeed = Math.max(MIN_SPEED, INITIAL_SPEED - Math.floor(score / 50) * 10);
    const intervalId = setInterval(gameLoop, currentSpeed);
    return () => clearInterval(intervalId);
  }, [gameLoop, score]);

  return (
    <div className="flex flex-col items-center">
      <div className="w-full flex justify-between items-center mb-6 border border-cyan-500/40 bg-neutral-900/60 p-4 rounded-xl shadow-[0_0_15px_theme('colors.cyan.500/0.2')]">
        <div>
          <p className="text-xs text-cyan-400 uppercase tracking-widest mb-1">Score</p>
          <p className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-300 to-blue-500 tabular-nums shadow-cyan-500/50 drop-shadow-md">
            {score.toString().padStart(4, '0')}
          </p>
        </div>
        <div className="flex flex-col items-end">
          <p className="text-xs text-fuchsia-400 uppercase tracking-widest flex items-center gap-1 mb-1">
            <Trophy className="w-3 h-3" /> High Score
          </p>
          <p className="text-xl font-bold text-fuchsia-300 tabular-nums">
            {highScore.toString().padStart(4, '0')}
          </p>
        </div>
      </div>

      <div 
        ref={gameBoardRef}
        className="relative bg-neutral-950 border-2 border-cyan-500/50 rounded-lg shadow-[0_0_30px_theme('colors.cyan.500/0.2')] overflow-hidden"
        style={{
          width: 'min(90vw, 400px)',
          height: 'min(90vw, 400px)',
        }}
      >
        {/* Render Grid/Snake */}
        <div 
          className="absolute inset-0"
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
            gridTemplateRows: `repeat(${GRID_SIZE}, 1fr)`,
          }}
        >
          {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => {
            const x = i % GRID_SIZE;
            const y = Math.floor(i / GRID_SIZE);
            
            const isSnakeHead = snake[0].x === x && snake[0].y === y;
            const isSnakeBody = !isSnakeHead && snake.some(s => s.x === x && s.y === y);
            const isFood = food.x === x && food.y === y;

            return (
              <div 
                key={i} 
                className={`
                  w-full h-full border border-white/[0.02]
                  ${isSnakeHead ? 'bg-cyan-400 shadow-[0_0_10px_theme(colors.cyan.400)] rounded-sm z-10' : ''}
                  ${isSnakeBody ? 'bg-cyan-600/80 rounded-sm' : ''}
                  ${isFood ? 'bg-fuchsia-500 shadow-[0_0_15px_theme(colors.fuchsia.500)] rounded-full z-10 animate-pulse' : ''}
                `}
              />
            );
          })}
        </div>

        {/* Overlays */}
        {isGameOver && (
          <div className="absolute inset-0 bg-neutral-950/80 backdrop-blur-sm flex flex-col items-center justify-center z-20">
            <h3 className="text-4xl font-bold text-fuchsia-500 mb-2 drop-shadow-[0_0_10px_theme('colors.fuchsia.500')]">GAME OVER</h3>
            <p className="text-cyan-300 mb-6 font-mono">Final Score: {score}</p>
            <button 
              onClick={resetGame}
              className="flex items-center gap-2 px-6 py-3 bg-cyan-600 hover:bg-cyan-500 text-white rounded-full font-bold tracking-wide transition-all hover:shadow-[0_0_20px_theme('colors.cyan.400/0.6')] active:scale-95"
            >
              <RefreshCcw className="w-5 h-5" /> Play Again
            </button>
          </div>
        )}

        {!isGameOver && isPaused && (
          <div className="absolute inset-0 bg-neutral-950/60 backdrop-blur-sm flex flex-col items-center justify-center z-20">
            <h3 className="text-3xl font-bold text-cyan-400 tracking-widest drop-shadow-[0_0_10px_theme('colors.cyan.400')]">PAUSED</h3>
            <p className="text-neutral-400 mt-2 text-sm">Press Space to Resume</p>
          </div>
        )}
      </div>
      
      <div className="mt-8 flex gap-4 text-xs text-neutral-500 uppercase tracking-widest">
        <div className="flex items-center gap-2"><Gamepad2 className="w-4 h-4" /> WASD or Arrows to Move</div>
        <div className="text-neutral-700">•</div>
        <div>Space to Pause</div>
      </div>
    </div>
  );
}
