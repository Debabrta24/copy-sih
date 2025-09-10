import { useState, useEffect, useRef, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { soundEffects } from "@/lib/sound-effects";
import { 
  RotateCcw, 
  Play, 
  Pause, 
  Shuffle, 
  Heart,
  Star,
  Droplets,
  CircleDot,
  Palette,
  Wind,
  Grid3x3,
  Puzzle,
  Brain,
  Target,
  Zap,
  Trophy,
  Users,
  Crown,
  Gamepad,
  ExternalLink,
  Mouse,
  Sparkles
} from "lucide-react";
import { BackButton } from "@/components/ui/back-button";

// Game 1: Bubble Pop
function BubblePop() {
  const [bubbles, setBubbles] = useState<Array<{id: number, x: number, y: number, size: number, color: string}>>([]);
  const [score, setScore] = useState(0);
  const canvasRef = useRef<HTMLDivElement>(null);

  const colors = ['#FF6B9D', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F'];

  const createBubble = useCallback(() => {
    const newBubble = {
      id: Date.now() + Math.random(),
      x: Math.random() * 80,
      y: Math.random() * 60,
      size: 20 + Math.random() * 40,
      color: colors[Math.floor(Math.random() * colors.length)]
    };
    setBubbles(prev => [...prev, newBubble]);
  }, []);

  const popBubble = (id: number) => {
    setBubbles(prev => prev.filter(b => b.id !== id));
    setScore(prev => prev + 1);
    soundEffects.playBubblePop();
  };

  useEffect(() => {
    const interval = setInterval(createBubble, 2000);
    return () => clearInterval(interval);
  }, [createBubble]);

  return (
    <div className="relative h-64 bg-gradient-to-b from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-800 rounded-lg overflow-hidden" ref={canvasRef}>
      <div className="absolute top-2 left-2 text-lg font-bold text-blue-800 dark:text-blue-200">
        Score: {score}
      </div>
      {bubbles.map(bubble => (
        <div
          key={bubble.id}
          className="absolute rounded-full cursor-pointer transition-all duration-300 hover:scale-110 animate-pulse"
          style={{
            left: `${bubble.x}%`,
            top: `${bubble.y}%`,
            width: `${bubble.size}px`,
            height: `${bubble.size}px`,
            backgroundColor: bubble.color,
            boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
          }}
          onClick={() => popBubble(bubble.id)}
        />
      ))}
    </div>
  );
}

// Game 2: Stress Ball
function StressBall() {
  const [isPressed, setIsPressed] = useState(false);
  const [squeezes, setSqueezes] = useState(0);

  return (
    <div className="flex flex-col items-center justify-center h-64 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900 dark:to-pink-900 rounded-lg">
      <div className="text-lg font-bold mb-4 text-purple-800 dark:text-purple-200">
        Squeezes: {squeezes}
      </div>
      <div
        className={`w-32 h-32 rounded-full cursor-pointer transition-all duration-150 ${
          isPressed ? 'scale-75' : 'scale-100'
        }`}
        style={{
          background: 'radial-gradient(circle, #FF6B9D, #C44569)',
          boxShadow: isPressed ? '0 2px 10px rgba(0,0,0,0.3)' : '0 8px 25px rgba(0,0,0,0.2)',
        }}
        onMouseDown={() => {
          setIsPressed(true);
          setSqueezes(prev => prev + 1);
          soundEffects.playSquish();
        }}
        onMouseUp={() => setIsPressed(false)}
        onMouseLeave={() => setIsPressed(false)}
        onTouchStart={() => {
          setIsPressed(true);
          setSqueezes(prev => prev + 1);
          soundEffects.playSquish();
        }}
        onTouchEnd={() => setIsPressed(false)}
      />
      <p className="mt-4 text-sm text-purple-600 dark:text-purple-300">Click and hold to squeeze!</p>
    </div>
  );
}

// Game 3: Color Mixer
function ColorMixer() {
  const [color1, setColor1] = useState('#FF6B9D');
  const [color2, setColor2] = useState('#4ECDC4');
  const [mixedColor, setMixedColor] = useState('#FF6B9D');

  const mixColors = () => {
    // Simple color mixing algorithm
    const r1 = parseInt(color1.substring(1, 3), 16);
    const g1 = parseInt(color1.substring(3, 5), 16);
    const b1 = parseInt(color1.substring(5, 7), 16);
    
    const r2 = parseInt(color2.substring(1, 3), 16);
    const g2 = parseInt(color2.substring(3, 5), 16);
    const b2 = parseInt(color2.substring(5, 7), 16);
    
    const r = Math.floor((r1 + r2) / 2);
    const g = Math.floor((g1 + g2) / 2);
    const b = Math.floor((b1 + b2) / 2);
    
    setMixedColor(`#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`);
    soundEffects.playColorMix();
  };

  return (
    <div className="h-64 p-4 bg-gradient-to-br from-yellow-100 to-orange-100 dark:from-yellow-900 dark:to-orange-900 rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <div className="text-center">
          <div className="w-16 h-16 rounded-lg mb-2 border-2 border-white shadow-lg" style={{ backgroundColor: color1 }}></div>
          <input 
            type="color" 
            value={color1} 
            onChange={(e) => setColor1(e.target.value)}
            className="w-12 h-8 rounded border-none"
          />
        </div>
        <Button onClick={mixColors} className="mx-4" data-testid="button-mix-colors">
          <Palette className="w-4 h-4 mr-2" />
          Mix
        </Button>
        <div className="text-center">
          <div className="w-16 h-16 rounded-lg mb-2 border-2 border-white shadow-lg" style={{ backgroundColor: color2 }}></div>
          <input 
            type="color" 
            value={color2} 
            onChange={(e) => setColor2(e.target.value)}
            className="w-12 h-8 rounded border-none"
          />
        </div>
      </div>
      <div className="text-center">
        <div className="w-24 h-24 rounded-lg mx-auto mb-2 border-2 border-white shadow-lg" style={{ backgroundColor: mixedColor }}></div>
        <p className="text-sm text-gray-600 dark:text-gray-300">Mixed Color</p>
      </div>
    </div>
  );
}

// Game 4: Breathing Circles
function BreathingCircles() {
  const [isBreathing, setIsBreathing] = useState(false);
  const [phase, setPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');

  useEffect(() => {
    if (!isBreathing) return;

    const cycle = () => {
      setPhase('inhale');
      soundEffects.playBreathingChime();
      setTimeout(() => {
        setPhase('hold');
        soundEffects.playBreathingChime();
      }, 4000);
      setTimeout(() => {
        setPhase('exhale');
        soundEffects.playBreathingChime();
      }, 7000);
      setTimeout(() => setPhase('inhale'), 11000);
    };

    const interval = setInterval(cycle, 11000);
    cycle();

    return () => clearInterval(interval);
  }, [isBreathing]);

  return (
    <div className="flex flex-col items-center justify-center h-64 bg-gradient-to-br from-green-100 to-blue-100 dark:from-green-900 dark:to-blue-900 rounded-lg">
      <div className="relative mb-6">
        <div 
          className={`w-32 h-32 rounded-full transition-all duration-4000 ease-in-out ${
            isBreathing ? (phase === 'inhale' ? 'scale-125' : phase === 'exhale' ? 'scale-75' : 'scale-100') : 'scale-100'
          }`}
          style={{
            background: 'radial-gradient(circle, #4ECDC4, #44A08D)',
            boxShadow: '0 0 20px rgba(78, 205, 196, 0.5)',
          }}
        />
        {isBreathing && (
          <div className="absolute inset-0 flex items-center justify-center text-white font-bold">
            {phase.toUpperCase()}
          </div>
        )}
      </div>
      <Button 
        onClick={() => setIsBreathing(!isBreathing)}
        className="mb-2"
        data-testid="button-breathing"
      >
        <Wind className="w-4 h-4 mr-2" />
        {isBreathing ? 'Stop' : 'Start'} Breathing
      </Button>
      <p className="text-sm text-center text-gray-600 dark:text-gray-300">
        Follow the circle: Inhale (4s) → Hold (3s) → Exhale (4s)
      </p>
    </div>
  );
}

// Game 5: Pattern Draw
function PatternDraw() {
  const [pattern, setPattern] = useState<Array<{x: number, y: number}>>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const svgRef = useRef<SVGSVGElement>(null);

  const startDrawing = (e: React.MouseEvent<SVGSVGElement>) => {
    setIsDrawing(true);
    const rect = svgRef.current?.getBoundingClientRect();
    if (rect) {
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      setPattern([{x, y}]);
    }
  };

  const draw = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!isDrawing) return;
    const rect = svgRef.current?.getBoundingClientRect();
    if (rect) {
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      setPattern(prev => [...prev, {x, y}]);
      if (Math.random() < 0.1) soundEffects.playDraw(); // 10% chance to play sound
    }
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearPattern = () => {
    setPattern([]);
  };

  return (
    <div className="h-64 bg-gradient-to-br from-pink-100 to-purple-100 dark:from-pink-900 dark:to-purple-900 rounded-lg p-4">
      <div className="flex justify-between items-center mb-2">
        <h4 className="font-semibold text-purple-800 dark:text-purple-200">Draw Patterns</h4>
        <Button size="sm" onClick={clearPattern} data-testid="button-clear-pattern">
          <RotateCcw className="w-4 h-4" />
        </Button>
      </div>
      <svg
        ref={svgRef}
        className="w-full h-48 bg-white dark:bg-gray-800 rounded cursor-crosshair"
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
      >
        {pattern.length > 1 && (
          <path
            d={`M ${pattern[0].x} ${pattern[0].y} ${pattern.slice(1).map(p => `L ${p.x} ${p.y}`).join(' ')}`}
            stroke="url(#gradient)"
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
          />
        )}
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FF6B9D" />
            <stop offset="50%" stopColor="#4ECDC4" />
            <stop offset="100%" stopColor="#96CEB4" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

// Game 6: Zen Garden
function ZenGarden() {
  const [rakeLines, setRakeLines] = useState<Array<Array<{x: number, y: number}>>>([]);
  const [currentLine, setCurrentLine] = useState<Array<{x: number, y: number}>>([]);
  const [isRaking, setIsRaking] = useState(false);

  const startRaking = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsRaking(true);
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setCurrentLine([{x, y}]);
  };

  const rake = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isRaking) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setCurrentLine(prev => [...prev, {x, y}]);
  };

  const stopRaking = () => {
    if (currentLine.length > 0) {
      setRakeLines(prev => [...prev, currentLine]);
      setCurrentLine([]);
    }
    setIsRaking(false);
  };

  const clearGarden = () => {
    setRakeLines([]);
    setCurrentLine([]);
  };

  return (
    <div className="h-64 bg-gradient-to-br from-amber-100 to-yellow-100 dark:from-amber-900 dark:to-yellow-900 rounded-lg p-4">
      <div className="flex justify-between items-center mb-2">
        <h4 className="font-semibold text-amber-800 dark:text-amber-200">Zen Garden</h4>
        <Button size="sm" onClick={clearGarden} data-testid="button-clear-garden">
          <RotateCcw className="w-4 h-4" />
        </Button>
      </div>
      <div
        className="relative w-full h-48 bg-gradient-to-br from-yellow-200 to-orange-200 dark:from-yellow-800 dark:to-orange-800 rounded cursor-crosshair"
        onMouseDown={startRaking}
        onMouseMove={rake}
        onMouseUp={stopRaking}
        onMouseLeave={stopRaking}
      >
        <svg className="absolute inset-0 w-full h-full">
          {rakeLines.map((line, lineIndex) => (
            <path
              key={lineIndex}
              d={`M ${line[0]?.x} ${line[0]?.y} ${line.slice(1).map(p => `L ${p.x} ${p.y}`).join(' ')}`}
              stroke="rgba(139, 69, 19, 0.4)"
              strokeWidth="2"
              fill="none"
            />
          ))}
          {currentLine.length > 1 && (
            <path
              d={`M ${currentLine[0].x} ${currentLine[0].y} ${currentLine.slice(1).map(p => `L ${p.x} ${p.y}`).join(' ')}`}
              stroke="rgba(139, 69, 19, 0.6)"
              strokeWidth="2"
              fill="none"
            />
          )}
        </svg>
      </div>
    </div>
  );
}

// Game 7: Color Sort
function ColorSort() {
  const [colors, setColors] = useState<string[]>([]);
  const [sortedColors, setSortedColors] = useState<string[]>([]);
  const [score, setScore] = useState(0);

  const colorPalette = ['#FF6B9D', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD'];

  const generateColors = () => {
    const shuffled = [...colorPalette].sort(() => Math.random() - 0.5);
    setColors(shuffled);
    setSortedColors([]);
  };

  const sortColor = (color: string) => {
    setColors(prev => prev.filter(c => c !== color));
    setSortedColors(prev => [...prev, color]);
    setScore(prev => prev + 1);
  };

  useEffect(() => {
    generateColors();
  }, []);

  return (
    <div className="h-64 bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900 dark:to-purple-900 rounded-lg p-4">
      <div className="flex justify-between items-center mb-4">
        <h4 className="font-semibold text-indigo-800 dark:text-indigo-200">Color Sort</h4>
        <div className="flex gap-2">
          <Badge variant="secondary">Score: {score}</Badge>
          <Button size="sm" onClick={generateColors} data-testid="button-new-colors">
            <Shuffle className="w-4 h-4" />
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 h-40">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-2">
          <p className="text-sm font-medium mb-2 text-center">Unsorted</p>
          <div className="flex flex-wrap gap-2">
            {colors.map((color, index) => (
              <div
                key={index}
                className="w-8 h-8 rounded cursor-pointer hover:scale-110 transition-transform"
                style={{ backgroundColor: color }}
                onClick={() => sortColor(color)}
              />
            ))}
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-2">
          <p className="text-sm font-medium mb-2 text-center">Sorted</p>
          <div className="flex flex-wrap gap-2">
            {sortedColors.map((color, index) => (
              <div
                key={index}
                className="w-8 h-8 rounded"
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Game 8: Shape Match
function ShapeMatch() {
  const [shapes, setShapes] = useState<Array<{id: number, shape: string, color: string, matched: boolean}>>([]);
  const [selectedShape, setSelectedShape] = useState<number | null>(null);
  const [matches, setMatches] = useState(0);

  const shapeTypes = ['circle', 'square', 'triangle'];
  const shapeColors = ['#FF6B9D', '#4ECDC4', '#45B7D1'];

  const generateShapes = () => {
    const newShapes = [];
    for (let i = 0; i < 12; i++) {
      const shape = shapeTypes[Math.floor(i / 4)];
      const color = shapeColors[Math.floor(i / 4)];
      newShapes.push({ id: i, shape, color, matched: false });
    }
    setShapes(newShapes.sort(() => Math.random() - 0.5));
    setMatches(0);
    setSelectedShape(null);
  };

  const selectShape = (id: number) => {
    if (shapes[id].matched) return;
    
    if (selectedShape === null) {
      setSelectedShape(id);
    } else if (selectedShape === id) {
      setSelectedShape(null);
    } else {
      const shape1 = shapes[selectedShape];
      const shape2 = shapes[id];
      
      if (shape1.shape === shape2.shape && shape1.color === shape2.color) {
        setShapes(prev => prev.map(s => 
          s.id === selectedShape || s.id === id ? { ...s, matched: true } : s
        ));
        setMatches(prev => prev + 1);
      }
      setSelectedShape(null);
    }
  };

  useEffect(() => {
    generateShapes();
  }, []);

  const renderShape = (shape: string, color: string) => {
    const baseClasses = "w-8 h-8";
    switch (shape) {
      case 'circle':
        return <div className={`${baseClasses} rounded-full`} style={{ backgroundColor: color }} />;
      case 'square':
        return <div className={`${baseClasses} rounded`} style={{ backgroundColor: color }} />;
      case 'triangle':
        return (
          <div 
            className={baseClasses}
            style={{
              width: 0,
              height: 0,
              borderLeft: '16px solid transparent',
              borderRight: '16px solid transparent',
              borderBottom: `32px solid ${color}`,
            }}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="h-64 bg-gradient-to-br from-teal-100 to-cyan-100 dark:from-teal-900 dark:to-cyan-900 rounded-lg p-4">
      <div className="flex justify-between items-center mb-4">
        <h4 className="font-semibold text-teal-800 dark:text-teal-200">Shape Match</h4>
        <div className="flex gap-2">
          <Badge variant="secondary">Matches: {matches}</Badge>
          <Button size="sm" onClick={generateShapes} data-testid="button-new-shapes">
            <Shuffle className="w-4 h-4" />
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-6 gap-2 h-40">
        {shapes.map((shape) => (
          <div
            key={shape.id}
            className={`flex items-center justify-center cursor-pointer rounded transition-all ${
              shape.matched 
                ? 'bg-green-200 dark:bg-green-800' 
                : selectedShape === shape.id 
                  ? 'bg-yellow-200 dark:bg-yellow-800 scale-110' 
                  : 'bg-white dark:bg-gray-800 hover:scale-105'
            }`}
            onClick={() => selectShape(shape.id)}
          >
            {renderShape(shape.shape, shape.color)}
          </div>
        ))}
      </div>
    </div>
  );
}

// Game 9: Rain Drops
function RainDrops() {
  const [drops, setDrops] = useState<Array<{id: number, x: number, y: number, speed: number}>>([]);
  const [isRaining, setIsRaining] = useState(false);

  useEffect(() => {
    if (!isRaining) return;

    const interval = setInterval(() => {
      setDrops(prev => {
        const newDrops = prev
          .map(drop => ({ ...drop, y: drop.y + drop.speed }))
          .filter(drop => drop.y < 250);
        
        // Add new drops
        if (Math.random() < 0.3) {
          newDrops.push({
            id: Date.now() + Math.random(),
            x: Math.random() * 90,
            y: -10,
            speed: 2 + Math.random() * 3
          });
        }
        
        return newDrops;
      });
    }, 50);

    return () => clearInterval(interval);
  }, [isRaining]);

  return (
    <div className="h-64 bg-gradient-to-b from-gray-200 to-gray-400 dark:from-gray-700 dark:to-gray-900 rounded-lg overflow-hidden relative">
      <div className="absolute top-2 left-2 z-10">
        <Button size="sm" onClick={() => setIsRaining(!isRaining)} data-testid="button-rain">
          <Droplets className="w-4 h-4 mr-2" />
          {isRaining ? 'Stop' : 'Start'} Rain
        </Button>
      </div>
      {drops.map(drop => (
        <div
          key={drop.id}
          className="absolute w-1 h-4 bg-blue-400 rounded-full opacity-70"
          style={{
            left: `${drop.x}%`,
            top: `${drop.y}px`,
          }}
        />
      ))}
    </div>
  );
}

// Game 10: Kaleidoscope
function Kaleidoscope() {
  const [isAnimating, setIsAnimating] = useState(false);
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    if (!isAnimating) return;

    const interval = setInterval(() => {
      setRotation(prev => (prev + 2) % 360);
    }, 50);

    return () => clearInterval(interval);
  }, [isAnimating]);

  return (
    <div className="h-64 bg-gradient-to-br from-violet-100 to-fuchsia-100 dark:from-violet-900 dark:to-fuchsia-900 rounded-lg flex flex-col items-center justify-center">
      <div className="mb-4">
        <Button onClick={() => setIsAnimating(!isAnimating)} data-testid="button-kaleidoscope">
          {isAnimating ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
          {isAnimating ? 'Pause' : 'Start'} Kaleidoscope
        </Button>
      </div>
      <div className="relative w-32 h-32">
        <div 
          className="w-full h-full rounded-full overflow-hidden"
          style={{ transform: `rotate(${rotation}deg)` }}
        >
          <div className="w-full h-full relative">
            <div className="absolute inset-0 bg-gradient-to-r from-red-400 to-yellow-400 rounded-full opacity-70" />
            <div className="absolute inset-2 bg-gradient-to-l from-blue-400 to-green-400 rounded-full opacity-70" />
            <div className="absolute inset-4 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full opacity-70" />
            <div className="absolute inset-6 bg-gradient-to-l from-indigo-400 to-cyan-400 rounded-full opacity-70" />
            <div className="absolute inset-8 bg-gradient-to-r from-orange-400 to-red-400 rounded-full opacity-70" />
          </div>
        </div>
      </div>
    </div>
  );
}

// Puzzle Game 1: Sliding Puzzle
function SlidingPuzzle() {
  const [tiles, setTiles] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  const initializePuzzle = () => {
    let newTiles = Array.from({ length: 15 }, (_, i) => i + 1);
    newTiles.push(0); // Empty space
    
    // Shuffle
    for (let i = 0; i < 1000; i++) {
      const emptyIndex = newTiles.indexOf(0);
      const neighbors = [];
      if (emptyIndex % 4 !== 0) neighbors.push(emptyIndex - 1);
      if (emptyIndex % 4 !== 3) neighbors.push(emptyIndex + 1);
      if (emptyIndex >= 4) neighbors.push(emptyIndex - 4);
      if (emptyIndex < 12) neighbors.push(emptyIndex + 4);
      
      const randomNeighbor = neighbors[Math.floor(Math.random() * neighbors.length)];
      [newTiles[emptyIndex], newTiles[randomNeighbor]] = [newTiles[randomNeighbor], newTiles[emptyIndex]];
    }
    
    setTiles(newTiles);
    setMoves(0);
    setIsComplete(false);
  };

  const moveTile = (index: number) => {
    const emptyIndex = tiles.indexOf(0);
    const isAdjacent = 
      (Math.abs(index - emptyIndex) === 1 && Math.floor(index / 4) === Math.floor(emptyIndex / 4)) ||
      Math.abs(index - emptyIndex) === 4;

    if (isAdjacent) {
      const newTiles = [...tiles];
      [newTiles[index], newTiles[emptyIndex]] = [newTiles[emptyIndex], newTiles[index]];
      setTiles(newTiles);
      setMoves(prev => prev + 1);
      
      // Check if completed
      const isWin = newTiles.slice(0, 15).every((tile, i) => tile === i + 1);
      setIsComplete(isWin);
    }
  };

  useEffect(() => {
    initializePuzzle();
  }, []);

  return (
    <div className="h-64 bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900 dark:to-purple-900 rounded-lg p-4">
      <div className="flex justify-between items-center mb-4">
        <h4 className="font-semibold text-indigo-800 dark:text-indigo-200">15-Puzzle</h4>
        <div className="flex gap-2">
          <Badge variant="secondary">Moves: {moves}</Badge>
          {isComplete && <Badge className="bg-green-500">Complete!</Badge>}
          <Button size="sm" onClick={initializePuzzle} data-testid="button-new-puzzle">
            <Shuffle className="w-4 h-4" />
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-4 gap-1 w-48 h-48 mx-auto">
        {tiles.map((tile, index) => (
          <div
            key={index}
            className={`h-11 flex items-center justify-center text-sm font-bold rounded cursor-pointer transition-all ${
              tile === 0 
                ? 'bg-transparent' 
                : 'bg-white dark:bg-gray-700 hover:bg-blue-100 dark:hover:bg-gray-600 shadow-md'
            }`}
            onClick={() => moveTile(index)}
          >
            {tile !== 0 && tile}
          </div>
        ))}
      </div>
    </div>
  );
}

// Puzzle Game 2: Mini Sudoku
function MiniSudoku() {
  const [grid, setGrid] = useState<number[][]>([]);
  const [solution, setSolution] = useState<number[][]>([]);
  const [selectedCell, setSelectedCell] = useState<{row: number, col: number} | null>(null);

  const generateSudoku = () => {
    // Simple 6x6 Sudoku for mobile-friendly play
    const newGrid = Array(6).fill(null).map(() => Array(6).fill(0));
    const solutionGrid = Array(6).fill(null).map(() => Array(6).fill(0));
    
    // Fill with a valid pattern (simplified)
    const pattern = [
      [1, 2, 3, 4, 5, 6],
      [4, 5, 6, 1, 2, 3],
      [2, 3, 1, 5, 6, 4],
      [5, 6, 4, 2, 3, 1],
      [3, 1, 2, 6, 4, 5],
      [6, 4, 5, 3, 1, 2]
    ];
    
    // Copy solution and remove some numbers for puzzle
    for (let i = 0; i < 6; i++) {
      for (let j = 0; j < 6; j++) {
        solutionGrid[i][j] = pattern[i][j];
        newGrid[i][j] = Math.random() < 0.4 ? pattern[i][j] : 0;
      }
    }
    
    setGrid(newGrid);
    setSolution(solutionGrid);
    setSelectedCell(null);
  };

  const setCellValue = (row: number, col: number, value: number) => {
    const newGrid = grid.map(r => [...r]);
    newGrid[row][col] = value;
    setGrid(newGrid);
  };

  useEffect(() => {
    generateSudoku();
  }, []);

  return (
    <div className="h-64 bg-gradient-to-br from-green-100 to-teal-100 dark:from-green-900 dark:to-teal-900 rounded-lg p-4">
      <div className="flex justify-between items-center mb-4">
        <h4 className="font-semibold text-green-800 dark:text-green-200">Mini Sudoku</h4>
        <Button size="sm" onClick={generateSudoku} data-testid="button-new-sudoku">
          <Shuffle className="w-4 h-4" />
        </Button>
      </div>
      <div className="flex gap-4">
        <div className="grid grid-cols-6 gap-1 w-36 h-36">
          {grid.map((row, rowIndex) =>
            row.map((cell, colIndex) => (
              <div
                key={`${rowIndex}-${colIndex}`}
                className={`w-5 h-5 flex items-center justify-center text-xs font-bold rounded cursor-pointer border ${
                  selectedCell?.row === rowIndex && selectedCell?.col === colIndex
                    ? 'bg-blue-200 dark:bg-blue-800 border-blue-400'
                    : 'bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600'
                }`}
                onClick={() => setSelectedCell({ row: rowIndex, col: colIndex })}
              >
                {cell !== 0 && cell}
              </div>
            ))
          )}
        </div>
        <div className="flex flex-col gap-1">
          {[1, 2, 3, 4, 5, 6].map(num => (
            <Button
              key={num}
              size="sm"
              variant="outline"
              className="w-8 h-6 p-0 text-xs"
              onClick={() => {
                if (selectedCell) {
                  setCellValue(selectedCell.row, selectedCell.col, num);
                }
              }}
              data-testid={`button-sudoku-${num}`}
            >
              {num}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}

// Puzzle Game 3: Memory Grid
function MemoryGrid() {
  const [pattern, setPattern] = useState<boolean[]>([]);
  const [userPattern, setUserPattern] = useState<boolean[]>([]);
  const [showPattern, setShowPattern] = useState(false);
  const [level, setLevel] = useState(1);
  const [gameState, setGameState] = useState<'waiting' | 'showing' | 'input' | 'success' | 'fail'>('waiting');

  const startLevel = () => {
    const gridSize = 16;
    const numToShow = Math.min(level + 2, 8);
    const newPattern = Array(gridSize).fill(false);
    
    // Randomly select cells to show
    const indices = Array.from({ length: gridSize }, (_, i) => i);
    for (let i = 0; i < numToShow; i++) {
      const randomIndex = Math.floor(Math.random() * indices.length);
      newPattern[indices[randomIndex]] = true;
      indices.splice(randomIndex, 1);
    }
    
    setPattern(newPattern);
    setUserPattern(Array(gridSize).fill(false));
    setGameState('showing');
    setShowPattern(true);
    
    setTimeout(() => {
      setShowPattern(false);
      setGameState('input');
    }, 2000 + level * 500);
  };

  const toggleCell = (index: number) => {
    if (gameState !== 'input') return;
    
    const newUserPattern = [...userPattern];
    newUserPattern[index] = !newUserPattern[index];
    setUserPattern(newUserPattern);
  };

  const checkPattern = () => {
    const isCorrect = pattern.every((cell, index) => cell === userPattern[index]);
    if (isCorrect) {
      setGameState('success');
      setLevel(prev => prev + 1);
      setTimeout(() => setGameState('waiting'), 1500);
    } else {
      setGameState('fail');
      setLevel(1);
      setTimeout(() => setGameState('waiting'), 1500);
    }
  };

  return (
    <div className="h-64 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900 dark:to-pink-900 rounded-lg p-4">
      <div className="flex justify-between items-center mb-4">
        <h4 className="font-semibold text-purple-800 dark:text-purple-200">Memory Grid</h4>
        <div className="flex gap-2">
          <Badge variant="secondary">Level: {level}</Badge>
          {gameState === 'waiting' && (
            <Button size="sm" onClick={startLevel} data-testid="button-start-memory">
              <Play className="w-4 h-4" />
            </Button>
          )}
          {gameState === 'input' && (
            <Button size="sm" onClick={checkPattern} data-testid="button-check-memory">
              <Target className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>
      <div className="grid grid-cols-4 gap-2 w-32 h-32 mx-auto">
        {Array.from({ length: 16 }, (_, index) => (
          <div
            key={index}
            className={`w-6 h-6 rounded cursor-pointer transition-all ${
              showPattern && pattern[index]
                ? 'bg-yellow-400'
                : userPattern[index]
                  ? 'bg-blue-400'
                  : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
            onClick={() => toggleCell(index)}
          />
        ))}
      </div>
      <div className="text-center mt-2">
        {gameState === 'showing' && <p className="text-sm text-purple-600 dark:text-purple-300">Memorize the pattern!</p>}
        {gameState === 'input' && <p className="text-sm text-purple-600 dark:text-purple-300">Click to recreate the pattern</p>}
        {gameState === 'success' && <p className="text-sm text-green-600 dark:text-green-400">Correct! Next level!</p>}
        {gameState === 'fail' && <p className="text-sm text-red-600 dark:text-red-400">Try again!</p>}
      </div>
    </div>
  );
}

// Puzzle Game 4: Block Stacker
function BlockStacker() {
  const [blocks, setBlocks] = useState<number[][]>([]);
  const [currentBlock, setCurrentBlock] = useState<{x: number, y: number, shape: number[][]}>();
  const [score, setScore] = useState(0);
  const [gameActive, setGameActive] = useState(false);

  const shapes = [
    [[1, 1], [1, 1]], // Square
    [[1, 1, 1, 1]], // Line
    [[1, 1, 1], [0, 1, 0]], // T-shape
    [[1, 1, 0], [0, 1, 1]], // Z-shape
  ];

  const initializeGame = () => {
    const newGrid = Array(10).fill(null).map(() => Array(8).fill(0));
    setBlocks(newGrid);
    setScore(0);
    setGameActive(true);
    spawnBlock();
  };

  const spawnBlock = () => {
    const shape = shapes[Math.floor(Math.random() * shapes.length)];
    setCurrentBlock({
      x: 3,
      y: 0,
      shape
    });
  };

  const moveBlock = (dx: number) => {
    if (!currentBlock || !gameActive) return;
    
    const newX = currentBlock.x + dx;
    if (newX >= 0 && newX + currentBlock.shape[0].length <= 8) {
      setCurrentBlock(prev => prev ? { ...prev, x: newX } : undefined);
    }
  };

  const dropBlock = () => {
    if (!currentBlock || !gameActive) return;
    
    // Place block on grid
    const newBlocks = blocks.map(row => [...row]);
    currentBlock.shape.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        if (cell && currentBlock.y + rowIndex < 10) {
          newBlocks[currentBlock.y + rowIndex][currentBlock.x + colIndex] = 1;
        }
      });
    });
    
    setBlocks(newBlocks);
    setScore(prev => prev + 10);
    
    // Check for full rows
    const fullRows = newBlocks.map((row, index) => 
      row.every(cell => cell === 1) ? index : -1
    ).filter(index => index !== -1);
    
    if (fullRows.length > 0) {
      fullRows.forEach(rowIndex => {
        newBlocks.splice(rowIndex, 1);
        newBlocks.unshift(Array(8).fill(0));
      });
      setBlocks(newBlocks);
      setScore(prev => prev + fullRows.length * 100);
    }
    
    spawnBlock();
  };

  return (
    <div className="h-64 bg-gradient-to-br from-orange-100 to-red-100 dark:from-orange-900 dark:to-red-900 rounded-lg p-4">
      <div className="flex justify-between items-center mb-4">
        <h4 className="font-semibold text-orange-800 dark:text-orange-200">Block Stacker</h4>
        <div className="flex gap-2">
          <Badge variant="secondary">Score: {score}</Badge>
          <Button size="sm" onClick={initializeGame} data-testid="button-start-blocks">
            <Play className="w-4 h-4" />
          </Button>
        </div>
      </div>
      <div className="flex gap-4">
        <div className="grid grid-cols-8 gap-px bg-gray-400 dark:bg-gray-600 p-1 rounded">
          {blocks.map((row, rowIndex) =>
            row.map((cell, colIndex) => (
              <div
                key={`${rowIndex}-${colIndex}`}
                className={`w-3 h-3 ${
                  cell ? 'bg-blue-500' : 'bg-white dark:bg-gray-800'
                }`}
              />
            ))
          )}
        </div>
        {gameActive && (
          <div className="flex flex-col gap-1">
            <Button size="sm" onClick={() => moveBlock(-1)} data-testid="button-move-left">←</Button>
            <Button size="sm" onClick={() => moveBlock(1)} data-testid="button-move-right">→</Button>
            <Button size="sm" onClick={dropBlock} data-testid="button-drop">↓</Button>
          </div>
        )}
      </div>
    </div>
  );
}

// Puzzle Game 5: Number Connect
function NumberConnect() {
  const [grid, setGrid] = useState<number[][]>([]);
  const [connections, setConnections] = useState<Array<{from: {row: number, col: number}, to: {row: number, col: number}}>>([]);
  const [selectedCell, setSelectedCell] = useState<{row: number, col: number} | null>(null);
  const [completed, setCompleted] = useState(false);

  const generatePuzzle = () => {
    const newGrid = Array(6).fill(null).map(() => Array(6).fill(0));
    const numbers = [1, 2, 3, 4];
    
    // Place pairs of numbers randomly
    numbers.forEach(num => {
      for (let i = 0; i < 2; i++) {
        let row, col;
        do {
          row = Math.floor(Math.random() * 6);
          col = Math.floor(Math.random() * 6);
        } while (newGrid[row][col] !== 0);
        newGrid[row][col] = num;
      }
    });
    
    setGrid(newGrid);
    setConnections([]);
    setSelectedCell(null);
    setCompleted(false);
  };

  const selectCell = (row: number, col: number) => {
    if (grid[row][col] === 0) return;
    
    if (!selectedCell) {
      setSelectedCell({ row, col });
    } else if (selectedCell.row === row && selectedCell.col === col) {
      setSelectedCell(null);
    } else if (grid[selectedCell.row][selectedCell.col] === grid[row][col]) {
      // Same number - create connection
      setConnections(prev => [...prev, { from: selectedCell, to: { row, col } }]);
      setSelectedCell(null);
      
      // Check if all numbers are connected
      const uniqueNumbers = Array.from(new Set(grid.flat().filter(n => n > 0)));
      if (connections.length + 1 >= uniqueNumbers.length) {
        setCompleted(true);
      }
    } else {
      setSelectedCell({ row, col });
    }
  };

  useEffect(() => {
    generatePuzzle();
  }, []);

  return (
    <div className="h-64 bg-gradient-to-br from-cyan-100 to-blue-100 dark:from-cyan-900 dark:to-blue-900 rounded-lg p-4">
      <div className="flex justify-between items-center mb-4">
        <h4 className="font-semibold text-cyan-800 dark:text-cyan-200">Number Connect</h4>
        <div className="flex gap-2">
          {completed && <Badge className="bg-green-500">Complete!</Badge>}
          <Button size="sm" onClick={generatePuzzle} data-testid="button-new-connect">
            <Shuffle className="w-4 h-4" />
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-6 gap-1 w-36 h-36 mx-auto">
        {grid.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              className={`w-5 h-5 flex items-center justify-center text-xs font-bold rounded cursor-pointer ${
                selectedCell?.row === rowIndex && selectedCell?.col === colIndex
                  ? 'bg-yellow-300 border-2 border-yellow-500'
                  : cell > 0
                    ? 'bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600'
                    : 'bg-gray-100 dark:bg-gray-800'
              }`}
              onClick={() => selectCell(rowIndex, colIndex)}
            >
              {cell > 0 && cell}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// Classic Game 1: Tic Tac Toe vs Computer
function TicTacToe() {
  const [board, setBoard] = useState<(string | null)[]>(Array(9).fill(null));
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [gameStatus, setGameStatus] = useState<'playing' | 'win' | 'lose' | 'draw'>('playing');

  const checkWinner = (squares: (string | null)[]) => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
      [0, 4, 8], [2, 4, 6] // diagonals
    ];
    
    for (let line of lines) {
      const [a, b, c] = line;
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return null;
  };

  const makeMove = (index: number, player: string) => {
    if (board[index] || gameStatus !== 'playing') return false;
    
    const newBoard = [...board];
    newBoard[index] = player;
    setBoard(newBoard);
    
    const winner = checkWinner(newBoard);
    if (winner) {
      setGameStatus(winner === 'X' ? 'win' : 'lose');
      return true;
    }
    
    if (newBoard.every(cell => cell !== null)) {
      setGameStatus('draw');
      return true;
    }
    
    return false;
  };

  const playerMove = (index: number) => {
    if (!isPlayerTurn) return;
    
    const gameEnded = makeMove(index, 'X');
    if (!gameEnded) {
      setIsPlayerTurn(false);
      // Computer move after delay
      setTimeout(() => {
        computerMove();
      }, 500);
    }
  };

  const computerMove = () => {
    const availableSpots = board.map((spot, index) => spot === null ? index : null).filter(val => val !== null) as number[];
    
    if (availableSpots.length > 0) {
      const randomSpot = availableSpots[Math.floor(Math.random() * availableSpots.length)];
      const gameEnded = makeMove(randomSpot, 'O');
      if (!gameEnded) {
        setIsPlayerTurn(true);
      }
    }
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setIsPlayerTurn(true);
    setGameStatus('playing');
  };

  return (
    <div className="h-64 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900 dark:to-indigo-900 rounded-lg p-4">
      <div className="flex justify-between items-center mb-4">
        <h4 className="font-semibold text-blue-800 dark:text-blue-200">Tic Tac Toe</h4>
        <div className="flex gap-2">
          {gameStatus === 'win' && <Badge className="bg-green-500">You Win!</Badge>}
          {gameStatus === 'lose' && <Badge className="bg-red-500">Computer Wins!</Badge>}
          {gameStatus === 'draw' && <Badge variant="secondary">Draw!</Badge>}
          <Button size="sm" onClick={resetGame} data-testid="button-reset-tictactoe">
            <RotateCcw className="w-4 h-4" />
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2 w-36 h-36 mx-auto">
        {board.map((cell, index) => (
          <button
            key={index}
            className="w-10 h-10 bg-white dark:bg-gray-700 rounded border-2 border-gray-300 dark:border-gray-600 flex items-center justify-center text-xl font-bold hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
            onClick={() => playerMove(index)}
            disabled={!isPlayerTurn || cell !== null || gameStatus !== 'playing'}
            data-testid={`tictactoe-${index}`}
          >
            {cell}
          </button>
        ))}
      </div>
      <p className="text-center mt-3 text-sm text-blue-600 dark:text-blue-300">
        {gameStatus === 'playing' ? (isPlayerTurn ? "Your turn (X)" : "Computer's turn (O)") : "Game Over"}
      </p>
    </div>
  );
}

// Single Player Game: Bubble Wrap
function BubbleWrap() {
  const [bubbles, setBubbles] = useState<boolean[]>(Array(48).fill(true));
  const [poppedCount, setPoppedCount] = useState(0);

  const popBubble = (index: number) => {
    if (!bubbles[index]) return;
    
    const newBubbles = [...bubbles];
    newBubbles[index] = false;
    setBubbles(newBubbles);
    setPoppedCount(prev => prev + 1);
  };

  const resetBubbles = () => {
    setBubbles(Array(48).fill(true));
    setPoppedCount(0);
  };

  return (
    <div className="h-64 bg-gradient-to-br from-pink-100 to-rose-100 dark:from-pink-900 dark:to-rose-900 rounded-lg p-4">
      <div className="flex justify-between items-center mb-4">
        <h4 className="font-semibold text-pink-800 dark:text-pink-200">Bubble Wrap</h4>
        <div className="flex gap-2">
          <Badge variant="secondary">Popped: {poppedCount}/48</Badge>
          <Button size="sm" onClick={resetBubbles} data-testid="button-reset-bubbles">
            <RotateCcw className="w-4 h-4" />
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-8 gap-1 w-64 h-48 mx-auto overflow-hidden">
        {bubbles.map((isIntact, index) => (
          <div
            key={index}
            className={`w-6 h-6 rounded-full cursor-pointer transition-all duration-200 ${
              isIntact 
                ? 'bg-gradient-to-br from-blue-200 to-blue-300 dark:from-blue-600 dark:to-blue-700 hover:scale-110 shadow-md' 
                : 'bg-gray-200 dark:bg-gray-700 scale-75 opacity-50'
            }`}
            onClick={() => popBubble(index)}
            style={{
              boxShadow: isIntact ? 'inset 0 1px 2px rgba(255,255,255,0.3), 0 2px 4px rgba(0,0,0,0.1)' : 'none'
            }}
          />
        ))}
      </div>
      {poppedCount === 48 && (
        <p className="text-center mt-2 text-sm text-green-600 dark:text-green-400 font-semibold">
          All bubbles popped! 🎉
        </p>
      )}
    </div>
  );
}

// External Game Links Component
function ExternalGameLinks() {
  const externalGames = [
    {
      name: "Chess.com",
      description: "Play chess against AI or online players",
      url: "https://www.chess.com/play/computer",
      color: "from-amber-100 to-yellow-100 dark:from-amber-900 dark:to-yellow-900"
    },
    {
      name: "Ludo King",
      description: "Classic Ludo game with computer opponents",
      url: "https://www.ludoking.com/",
      color: "from-green-100 to-emerald-100 dark:from-green-900 dark:to-emerald-900"
    },
    {
      name: "Poki Games",
      description: "Thousands of free online games",
      url: "https://poki.com/",
      color: "from-purple-100 to-violet-100 dark:from-purple-900 dark:to-violet-900"
    },
    {
      name: "2048 Game",
      description: "Addictive number puzzle game",
      url: "https://play2048.co/",
      color: "from-orange-100 to-red-100 dark:from-orange-900 dark:to-red-900"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {externalGames.map((game, index) => (
        <Card key={index} className="overflow-hidden">
          <CardContent className="p-4">
            <div className={`h-32 bg-gradient-to-br ${game.color} rounded-lg p-4 flex flex-col justify-between`}>
              <div>
                <h4 className="font-semibold text-lg mb-2">{game.name}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">{game.description}</p>
              </div>
              <div className="flex justify-end">
                <Button 
                  size="sm" 
                  onClick={() => window.open(game.url, '_blank')}
                  data-testid={`button-external-${game.name.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Play Now
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// Simple Rock Paper Scissors vs Computer
function RockPaperScissors() {
  const [playerChoice, setPlayerChoice] = useState<string | null>(null);
  const [computerChoice, setComputerChoice] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [scores, setScores] = useState({ player: 0, computer: 0 });

  const choices = ['🪨', '📄', '✂️'];
  const choiceNames = ['Rock', 'Paper', 'Scissors'];

  const playGame = (playerPick: number) => {
    const computerPick = Math.floor(Math.random() * 3);
    
    setPlayerChoice(choices[playerPick]);
    setComputerChoice(choices[computerPick]);
    
    let gameResult = '';
    if (playerPick === computerPick) {
      gameResult = 'Draw!';
    } else if (
      (playerPick === 0 && computerPick === 2) ||
      (playerPick === 1 && computerPick === 0) ||
      (playerPick === 2 && computerPick === 1)
    ) {
      gameResult = 'You Win!';
      setScores(prev => ({ ...prev, player: prev.player + 1 }));
    } else {
      gameResult = 'Computer Wins!';
      setScores(prev => ({ ...prev, computer: prev.computer + 1 }));
    }
    
    setResult(gameResult);
  };

  const resetGame = () => {
    setPlayerChoice(null);
    setComputerChoice(null);
    setResult(null);
    setScores({ player: 0, computer: 0 });
  };

  return (
    <div className="h-64 bg-gradient-to-br from-cyan-100 to-blue-100 dark:from-cyan-900 dark:to-blue-900 rounded-lg p-4">
      <div className="flex justify-between items-center mb-4">
        <h4 className="font-semibold text-cyan-800 dark:text-cyan-200">Rock Paper Scissors</h4>
        <div className="flex gap-2">
          <Badge variant="secondary">You: {scores.player}</Badge>
          <Badge variant="secondary">Computer: {scores.computer}</Badge>
          <Button size="sm" onClick={resetGame} data-testid="button-reset-rps">
            <RotateCcw className="w-4 h-4" />
          </Button>
        </div>
      </div>
      <div className="text-center">
        <div className="flex justify-center gap-8 mb-4">
          <div className="text-center">
            <p className="text-sm font-medium mb-2">You</p>
            <div className="w-16 h-16 bg-white dark:bg-gray-700 rounded-lg flex items-center justify-center text-2xl">
              {playerChoice || '?'}
            </div>
          </div>
          <div className="text-center">
            <p className="text-sm font-medium mb-2">Computer</p>
            <div className="w-16 h-16 bg-white dark:bg-gray-700 rounded-lg flex items-center justify-center text-2xl">
              {computerChoice || '?'}
            </div>
          </div>
        </div>
        {result && (
          <p className="text-lg font-bold mb-3 text-cyan-700 dark:text-cyan-300">{result}</p>
        )}
        <div className="flex justify-center gap-2">
          {choices.map((choice, index) => (
            <Button
              key={index}
              variant="outline"
              size="sm"
              onClick={() => playGame(index)}
              data-testid={`button-rps-${choiceNames[index].toLowerCase()}`}
            >
              {choice}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Games() {
  const relaxationGames = [
    { id: 1, title: "Bubble Pop", icon: CircleDot, component: BubblePop, description: "Pop colorful bubbles for instant satisfaction!" },
    { id: 2, title: "Stress Ball", icon: Heart, component: StressBall, description: "Squeeze away your stress with a virtual stress ball." },
    { id: 3, title: "Color Mixer", icon: Palette, component: ColorMixer, description: "Mix beautiful colors and create new shades." },
    { id: 4, title: "Breathing Circles", icon: Wind, component: BreathingCircles, description: "Follow the breathing pattern to relax." },
    { id: 5, title: "Pattern Draw", icon: Star, component: PatternDraw, description: "Draw beautiful, flowing patterns." },
    { id: 6, title: "Zen Garden", icon: Wind, component: ZenGarden, description: "Rake peaceful patterns in your zen garden." },
    { id: 7, title: "Color Sort", icon: Palette, component: ColorSort, description: "Organize colors by sorting them." },
    { id: 8, title: "Shape Match", icon: Star, component: ShapeMatch, description: "Match shapes and colors in this memory game." },
    { id: 9, title: "Rain Drops", icon: Droplets, component: RainDrops, description: "Watch peaceful rain drops fall." },
    { id: 10, title: "Kaleidoscope", icon: CircleDot, component: Kaleidoscope, description: "Enjoy mesmerizing kaleidoscope patterns." },
  ];

  const puzzleGames = [
    { id: 11, title: "15-Puzzle", icon: Grid3x3, component: SlidingPuzzle, description: "Classic sliding number puzzle - arrange tiles 1-15!" },
    { id: 12, title: "Mini Sudoku", icon: Brain, component: MiniSudoku, description: "6x6 Sudoku puzzle perfect for quick brain training." },
    { id: 13, title: "Memory Grid", icon: Target, component: MemoryGrid, description: "Remember and recreate the pattern - levels get harder!" },
    { id: 14, title: "Block Stacker", icon: Puzzle, component: BlockStacker, description: "Tetris-style block stacking game." },
    { id: 15, title: "Number Connect", icon: Zap, component: NumberConnect, description: "Connect matching numbers to complete the puzzle." },
  ];

  const classicGames = [
    { id: 16, title: "Tic Tac Toe", icon: Grid3x3, component: TicTacToe, description: "Classic game vs computer - get 3 in a row!" },
    { id: 17, title: "Rock Paper Scissors", icon: Users, component: RockPaperScissors, description: "Beat the computer in this classic game." },
  ];

  const singlePlayerGames = [
    { id: 18, title: "Bubble Wrap", icon: CircleDot, component: BubbleWrap, description: "Pop all the bubbles for ultimate satisfaction!" },
  ];

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <BackButton />
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Games & Puzzles</h1>
        <p className="text-muted-foreground">
          Relax, challenge your mind, and have fun with games designed for college students. Choose between relaxing games or challenging puzzles!
        </p>
      </div>

      <Tabs defaultValue="relaxation" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="relaxation" data-testid="tab-relaxation">
            <Heart className="w-4 h-4 mr-2" />
            Relaxation
          </TabsTrigger>
          <TabsTrigger value="puzzles" data-testid="tab-puzzles">
            <Brain className="w-4 h-4 mr-2" />
            Puzzles
          </TabsTrigger>
          <TabsTrigger value="classic" data-testid="tab-classic">
            <Crown className="w-4 h-4 mr-2" />
            Classic
          </TabsTrigger>
          <TabsTrigger value="single" data-testid="tab-single">
            <Mouse className="w-4 h-4 mr-2" />
            Single Player
          </TabsTrigger>
        </TabsList>

        <TabsContent value="relaxation" className="space-y-6">
          <div className="mb-4">
            <h2 className="text-xl font-semibold mb-2">Stress Relief & Satisfaction</h2>
            <p className="text-muted-foreground text-sm">
              Perfect for quick mental breaks between study sessions. These games help reduce stress and provide instant satisfaction.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {relaxationGames.map((game) => {
              const GameComponent = game.component;
              const IconComponent = game.icon;
              
              return (
                <Card key={game.id} className="overflow-hidden">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <IconComponent className="h-5 w-5 text-primary" />
                      {game.title}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">{game.description}</p>
                  </CardHeader>
                  <CardContent>
                    <GameComponent />
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="puzzles" className="space-y-6">
          <div className="mb-4">
            <h2 className="text-xl font-semibold mb-2 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-500" />
              Challenge Your Mind
            </h2>
            <p className="text-muted-foreground text-sm">
              Engaging puzzles designed for 18+ students. Perfect for improving cognitive skills, memory, and problem-solving abilities while having fun!
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {puzzleGames.map((game) => {
              const GameComponent = game.component;
              const IconComponent = game.icon;
              
              return (
                <Card key={game.id} className="overflow-hidden border-l-4 border-l-blue-500">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <IconComponent className="h-5 w-5 text-blue-600" />
                      {game.title}
                      <Badge variant="secondary" className="ml-auto">Challenge</Badge>
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">{game.description}</p>
                  </CardHeader>
                  <CardContent>
                    <GameComponent />
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="classic" className="space-y-6">
          <div className="mb-4">
            <h2 className="text-xl font-semibold mb-2 flex items-center gap-2">
              <Crown className="w-5 h-5 text-yellow-500" />
              Classic Games vs Computer
            </h2>
            <p className="text-muted-foreground text-sm">
              Timeless games with AI opponents. Perfect for quick competitive fun between study sessions!
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {classicGames.map((game) => {
              const GameComponent = game.component;
              const IconComponent = game.icon;
              
              return (
                <Card key={game.id} className="overflow-hidden border-l-4 border-l-yellow-500">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <IconComponent className="h-5 w-5 text-yellow-600" />
                      {game.title}
                      <Badge variant="secondary" className="ml-auto">vs Computer</Badge>
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">{game.description}</p>
                  </CardHeader>
                  <CardContent>
                    <GameComponent />
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="mt-8">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <ExternalLink className="w-5 h-5 text-blue-500" />
              More Classic Games
            </h3>
            <p className="text-muted-foreground text-sm mb-4">
              Links to popular external games - Chess, Ludo, and more!
            </p>
            <ExternalGameLinks />
          </div>
        </TabsContent>

        <TabsContent value="single" className="space-y-6">
          <div className="mb-4">
            <h2 className="text-xl font-semibold mb-2 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-pink-500" />
              Single Player Satisfaction
            </h2>
            <p className="text-muted-foreground text-sm">
              Solo games for maximum satisfaction and stress relief. No competition, just pure enjoyment!
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {singlePlayerGames.map((game) => {
              const GameComponent = game.component;
              const IconComponent = game.icon;
              
              return (
                <Card key={game.id} className="overflow-hidden border-l-4 border-l-pink-500">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <IconComponent className="h-5 w-5 text-pink-600" />
                      {game.title}
                      <Badge variant="secondary" className="ml-auto">Solo</Badge>
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">{game.description}</p>
                  </CardHeader>
                  <CardContent>
                    <GameComponent />
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="mt-8">
            <Card className="border-dashed border-2 border-gray-300 dark:border-gray-600">
              <CardContent className="p-6 text-center">
                <Mouse className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Want More Single Player Games?</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  Check out Poki.com for thousands of free single-player games including bubble games, satisfying puzzles, and more!
                </p>
                <Button 
                  onClick={() => window.open('https://poki.com/en/g/bubble-shooter', '_blank')}
                  data-testid="button-more-single-games"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Explore More Games
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </main>
  );
}