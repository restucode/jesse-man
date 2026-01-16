"use client";

import React, { useState, useEffect, useRef } from "react";
// 1. IMPORT MINIKIT HOOKS
import { useMiniKit, useComposeCast } from "@coinbase/onchainkit/minikit";
import { minikitConfig } from "../minikit.config";
import styles from "./page.module.css";

const GAME_SPEED = 200; 
const MAP_SIZE = 15;
const STUN_DURATION = 750; // 0.75 Detik

// --- MAP CONFIGURATIONS ---
const MAP_CLASSIC = [
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 0, 1],
  [1, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 1],
  [1, 0, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 1, 1, 0, 1, 1, 1, 2, 1, 1, 1, 0, 1, 1, 1], 
  [1, 0, 0, 0, 1, 2, 2, 2, 2, 2, 1, 0, 0, 0, 1], 
  [1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 0, 1],
  [1, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 1],
  [1, 0, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
];

const MAP_ARENA = [
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 0, 1],
  [1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1],
  [1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1],
  [1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1],
  [1, 1, 1, 0, 0, 0, 1, 2, 1, 0, 0, 0, 1, 1, 1], 
  [1, 0, 0, 0, 1, 0, 2, 2, 2, 0, 1, 0, 0, 0, 1], 
  [1, 1, 1, 0, 0, 0, 1, 1, 1, 0, 0, 0, 1, 1, 1],
  [1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1],
  [1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1],
  [1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1],
  [1, 0, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
];

const MAP_MAZE = [
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1],
  [1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1],
  [1, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 1],
  [1, 0, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 1, 1, 0, 1, 1, 1, 2, 1, 1, 1, 0, 1, 1, 1], 
  [1, 0, 0, 0, 1, 2, 2, 2, 2, 2, 1, 0, 0, 0, 1], 
  [1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1],
  [1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1],
  [1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1],
  [1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1],
  [1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1],
  [1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
];

type MapName = "CLASSIC" | "ARENA" | "MAZE";
const MAPS: Record<MapName, number[][]> = {
  CLASSIC: MAP_CLASSIC,
  ARENA: MAP_ARENA,
  MAZE: MAP_MAZE
};

type Direction = "UP" | "DOWN" | "LEFT" | "RIGHT" | null;
type GameStatus = "MENU" | "PLAYING" | "WON" | "LOST";
type Difficulty = "EASY" | "MEDIUM" | "HARD";
type SkinType = "DEFAULT" | "JESSE" | "BRIAN" | "KERSA";

const SKIN_IMAGES: Record<SkinType, string | null> = {
    DEFAULT: null, 
    JESSE: "/jesse.jpg",
    BRIAN: "/brian.png",       
    KERSA: "/kersa.jpg"        
};

interface Ghost {
  id: number;
  x: number;
  y: number;
  color: string;
  type: "RED" | "CYAN" | "PINK" | "ORANGE";
  stunnedUntil: number;
}

export default function PacmanGame() {
  // 2. INITIALIZE MINIKIT HOOK
  const { composeCast } = useComposeCast();

  const [grid, setGrid] = useState<number[][]>([]);
  const [score, setScore] = useState(0);
  const [gameStatus, setGameStatus] = useState<GameStatus>("MENU");
  
  const [difficulty, setDifficulty] = useState<Difficulty>("EASY");
  const [ghostCount, setGhostCount] = useState<number>(2);
  const [selectedSkin, setSelectedSkin] = useState<SkinType>("DEFAULT");
  const [selectedMap, setSelectedMap] = useState<MapName>("CLASSIC");

  const [pacmanRenderPos, setPacmanRenderPos] = useState({ x: 1, y: 1, dir: "RIGHT" as Direction });
  const [ghostsRender, setGhostsRender] = useState<Ghost[]>([]);

  const pacmanRef = useRef({ x: 1, y: 1 });
  const ghostsRef = useRef<Ghost[]>([]);
  const currentDirRef = useRef<Direction>(null);
  const nextDirRef = useRef<Direction>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameStatus !== "PLAYING") return;
      if(["ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].includes(e.key)) e.preventDefault();
      switch (e.key) {
        case "ArrowUp": nextDirRef.current = "UP"; break;
        case "ArrowDown": nextDirRef.current = "DOWN"; break;
        case "ArrowLeft": nextDirRef.current = "LEFT"; break;
        case "ArrowRight": nextDirRef.current = "RIGHT"; break;
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [gameStatus]);

  useEffect(() => {
    if (gameStatus !== "PLAYING") return;
    const gameTick = setInterval(() => updateGameState(), GAME_SPEED);
    return () => clearInterval(gameTick);
  }, [gameStatus, grid]); 

  const startGame = () => {
    const chosenMap = MAPS[selectedMap];
    const newGrid = chosenMap.map(row => [...row]);
    
    setGrid(newGrid);
    setScore(0);
    
    pacmanRef.current = { x: 1, y: 1 };
    
    const newGhosts: Ghost[] = [];
    if (ghostCount >= 1) newGhosts.push({ id: 1, x: 7, y: 7, color: "ghostRed", type: "RED", stunnedUntil: 0 });
    if (ghostCount >= 2) newGhosts.push({ id: 2, x: 7, y: 8, color: "ghostCyan", type: "CYAN", stunnedUntil: 0 });
    if (ghostCount >= 3) newGhosts.push({ id: 3, x: 6, y: 7, color: "ghostPink", type: "PINK", stunnedUntil: 0 });
    if (ghostCount >= 4) newGhosts.push({ id: 4, x: 8, y: 7, color: "ghostOrange", type: "ORANGE", stunnedUntil: 0 });

    ghostsRef.current = newGhosts;
    currentDirRef.current = null;
    nextDirRef.current = null;

    setPacmanRenderPos({ x: 1, y: 1, dir: "RIGHT" });
    setGhostsRender([...ghostsRef.current]);
    
    setGameStatus("PLAYING");
  };

  const updateGameState = () => {
    const now = Date.now();
    const oldPacmanPos = { ...pacmanRef.current };
    
    let { x, y } = pacmanRef.current;
    let dir = currentDirRef.current;

    if (nextDirRef.current) {
      const test = getNextPos(x, y, nextDirRef.current);
      if (!isWall(test.x, test.y)) {
        currentDirRef.current = nextDirRef.current;
        dir = nextDirRef.current;
      }
    }
    if (dir) {
      const next = getNextPos(x, y, dir);
      if (!isWall(next.x, next.y)) {
        x = next.x;
        y = next.y;
      }
    }
    pacmanRef.current = { x, y };

    if (ghostsRef.current.some(g => g.x === x && g.y === y && now > g.stunnedUntil)) {
      setGameStatus("LOST");
      return;
    }

    const cellVal = grid[y][x];
    if (cellVal === 0) {
      const newGrid = [...grid];
      newGrid[y] = [...newGrid[y]];
      newGrid[y][x] = 2; 
      setGrid(newGrid);
      setScore(s => s + 10);
      if (!newGrid.some(row => row.includes(0))) setGameStatus("WON");
    }

    ghostsRef.current.forEach(g => {
        if (now < g.stunnedUntil) return; 
        const oldGhostPos = { x: g.x, y: g.y };
        const move = getSmartGhostMove(g, pacmanRef.current, difficulty);
        g.x = move.x; g.y = move.y;
        
        const overlap = g.x === pacmanRef.current.x && g.y === pacmanRef.current.y;
        const swapped = (g.x === oldPacmanPos.x && g.y === oldPacmanPos.y) && (pacmanRef.current.x === oldGhostPos.x && pacmanRef.current.y === oldGhostPos.y);
        
        if (overlap || swapped) setGameStatus("LOST");
    });

    const ghosts = ghostsRef.current;
    for (let i = 0; i < ghosts.length; i++) {
        for (let j = i + 1; j < ghosts.length; j++) {
            const g1 = ghosts[i]; const g2 = ghosts[j];
            if (g1.x === g2.x && g1.y === g2.y) {
                 const isG1Active = now > g1.stunnedUntil;
                 const isG2Active = now > g2.stunnedUntil;
                 if (isG1Active && isG2Active) {
                    const stunEndTime = now + STUN_DURATION;
                    g1.stunnedUntil = stunEndTime; g2.stunnedUntil = stunEndTime;
                 }
            }
        }
    }
    
    setPacmanRenderPos({ x, y, dir });
    setGhostsRender(ghostsRef.current.map(g => ({ ...g })));
  };

  const getSmartGhostMove = (ghost: Ghost, target: {x:number, y:number}, diff: Difficulty) => {
    const directions: Direction[] = ["UP", "DOWN", "LEFT", "RIGHT"];
    const validMoves = directions.map(d => getNextPos(ghost.x, ghost.y, d)).filter(pos => !isWall(pos.x, pos.y));
    if (validMoves.length === 0) return { x: ghost.x, y: ghost.y };
    
    let chaseChance = 0;
    if (diff === "EASY") chaseChance = ghost.type === "RED" ? 0.2 : 0.0;
    else if (diff === "MEDIUM") chaseChance = ghost.type === "RED" ? 0.6 : (ghost.type === "PINK" ? 0.4 : 0.1);
    else if (diff === "HARD") chaseChance = ghost.type === "RED" ? 0.95 : (ghost.type === "PINK" ? 0.7 : (ghost.type === "ORANGE" ? 0.5 : 0.3));
    
    if (Math.random() < chaseChance) {
        validMoves.sort((a, b) => (Math.abs(a.x - target.x) + Math.abs(a.y - target.y)) - (Math.abs(b.x - target.x) + Math.abs(b.y - target.y)));
        return validMoves[0];
    } else { return validMoves[Math.floor(Math.random() * validMoves.length)]; }
  };

  const getNextPos = (x: number, y: number, dir: Direction) => {
    switch (dir) { case "UP": return { x, y: y - 1 }; case "DOWN": return { x, y: y + 1 }; case "LEFT": return { x: x - 1, y }; case "RIGHT": return { x: x + 1, y }; default: return { x, y }; }
  };
  
  const isWall = (x: number, y: number) => (y < 0 || y >= MAP_SIZE || x < 0 || x >= MAP_SIZE) ? true : grid[y][x] === 1;
  const handleMobileInput = (d: Direction) => { nextDirRef.current = d; };

  // --- 3. URL GENERATOR UNTUK SHARE ---
  const getShareUrl = () => {
     // Gunakan origin window atau fallback kosong (untuk SSR safety)
     const origin = typeof window !== 'undefined' ? window.location.origin : '';
     const shareDataPath = `${score}-${gameStatus}`;
     return `${origin}/share/${shareDataPath}`;
  };

  // --- 4. HANDLE SHARE X (TWITTER) ---
  const getXShareLink = () => {
    const text = gameStatus === "WON" 
      ? `🏆 I just WON in Jesse-Man! Score: ${score}.`
      : `👻 I got eaten in Jesse-Man... Score: ${score}.`;
    
    const embedUrl = getShareUrl();
    const encodedText = encodeURIComponent(text);
    const encodedEmbed = encodeURIComponent(embedUrl);

    return `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedEmbed}`;
  };

  // --- 5. HANDLE SHARE FARCASTER (MINIKIT SDK) ---
  const { context } = useMiniKit();

  const handleShareFarcaster = () => {
    const userName = context?.user?.displayName || 'anonymous';
    const shareDataPath = `${score}-${gameStatus}`;
    composeCast({
      text: `Check out ${minikitConfig.miniapp.name}!`,
      embeds: [`${window.location.origin}/share/${shareDataPath}`]
    });
  };


  return (
    <div className={styles.container}>
      <div className={styles.header}><div className={styles.score}>SCORE: {score}</div></div>
      <div className={styles.gameBoard}>
        {grid.length > 0 && grid.map((row, y) => (row.map((val, x) => (<div key={`${x}-${y}`} className={styles.cell}>{val === 1 && <div className={styles.wall} />}{val === 0 && <div className={styles.pellet} />}</div>))))}

        {gameStatus !== "MENU" && (
            <>
                <div 
                    className={`${styles.actor} ${styles.pacman} ${selectedSkin === 'DEFAULT' ? styles.defaultSkin : ''}`}
                    data-direction={pacmanRenderPos.dir || "RIGHT"}
                    style={{ transform: `translate(${pacmanRenderPos.x * 100}%, ${pacmanRenderPos.y * 100}%)` }}
                >
                    {selectedSkin !== 'DEFAULT' && SKIN_IMAGES[selectedSkin] && (
                        <img src={SKIN_IMAGES[selectedSkin]!} alt="skin" className={styles.skinImage} />
                    )}
                </div>

                {ghostsRender.map((g) => {
                    const isStunned = Date.now() < g.stunnedUntil;
                    return (<div key={g.id} className={`${styles.actor} ${styles.ghost} ${styles[g.color]} ${isStunned ? styles.stunned : ''}`} style={{ transform: `translate(${g.x * 100}%, ${g.y * 100}%)` }} />);
                })}
            </>
        )}

        {gameStatus === "MENU" && (
            <div className={styles.menuOverlay}>
                <h1 className={styles.title}>JESSE-MAN</h1>
                
                {/* --- DIFFICULTY --- */}
                <div className={styles.optionsContainer}>
                    <div className={styles.label}>DIFFICULTY</div>
                    <div className={styles.btnGroup}>
                        {(['EASY', 'MEDIUM', 'HARD'] as Difficulty[]).map(d => (<button key={d} className={`${styles.optionBtn} ${difficulty === d ? styles.selected : ''}`} onClick={() => setDifficulty(d)}>{d}</button>))}
                    </div>
                </div>

                {/* --- GHOST COUNT --- */}
                <div className={styles.optionsContainer}>
                    <div className={styles.label}>GHOSTS</div>
                    <div className={styles.btnGroup}>
                        {[2, 3, 4].map(n => (<button key={n} className={`${styles.optionBtn} ${ghostCount === n ? styles.selected : ''}`} onClick={() => setGhostCount(n)}>{n}</button>))}
                    </div>
                </div>

                {/* --- MAP SELECTION --- */}
                <div className={styles.optionsContainer}>
                    <div className={styles.label}>SELECT MAP</div>
                    <div className={styles.btnGroup}>
                        {(Object.keys(MAPS) as MapName[]).map(m => (<button key={m} className={`${styles.optionBtn} ${selectedMap === m ? styles.selected : ''}`} onClick={() => setSelectedMap(m)}>{m}</button>))}
                    </div>
                </div>

                {/* --- SKIN SELECTION --- */}
                <div className={styles.optionsContainer}>
                    <div className={styles.label}>CHARACTER SKIN</div>
                    <div className={styles.btnGroup}>
                        {(Object.keys(SKIN_IMAGES) as SkinType[]).map(skinKey => (
                            <button 
                                key={skinKey}
                                className={`${styles.optionBtn} ${selectedSkin === skinKey ? styles.selected : ''}`}
                                onClick={() => setSelectedSkin(skinKey)}
                                style={{padding: '5px'}}
                            >
                                <div className={styles.skinPreviewContainer}>
                                    {skinKey === 'DEFAULT' ? (
                                        <div className={styles.skinPreviewDefault}></div>
                                    ) : (
                                        <img src={SKIN_IMAGES[skinKey]!} alt={skinKey} className={styles.skinPreviewImg} />
                                    )}
                                </div>
                                <span style={{fontSize:'0.8rem'}}>{skinKey}</span>
                            </button>
                        ))}
                    </div>
                </div>

                <button className={styles.playBtn} onClick={startGame}>START GAME</button>
            </div>
        )}

        {(gameStatus === "WON" || gameStatus === "LOST") && (
            <div className={styles.menuOverlay}>
                <h2 style={{ color: gameStatus === "WON" ? '#4ade80' : '#ef4444', fontSize: '2.5rem', marginBottom:'10px' }}>
                    {gameStatus === "WON" ? "YOU WIN!" : "GAME OVER"}
                </h2>
                <p style={{fontSize:'1.2rem', marginBottom: '10px'}}>Final Score: {score}</p>
                
                {/* --- SHARE BUTTONS --- */}
                <div className={styles.shareContainer}>
                    {/* Share X: Masih pakai Link Biasa */}
                    <a 
                        href={getXShareLink()} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className={`${styles.shareBtn} ${styles.shareX}`}
                    >
                        Share on X
                    </a>
                    
                    {/* Share Farcaster: Pakai Button & onClick Handler SDK */}
                    <button 
                        onClick={handleShareFarcaster}
                        className={`${styles.shareBtn} ${styles.shareFarcaster}`}
                    >
                        Share on Farcaster
                    </button>
                </div>

                <button className={styles.restartBtn} onClick={() => setGameStatus("MENU")}>Main Menu</button>
            </div>
        )}
      </div>
      <div className={styles.controls}><button className={`${styles.controlBtn} ${styles.btnUp}`} onClick={() => handleMobileInput("UP")}>▲</button><button className={`${styles.controlBtn} ${styles.btnLeft}`} onClick={() => handleMobileInput("LEFT")}>◀</button><button className={`${styles.controlBtn} ${styles.btnDown}`} onClick={() => handleMobileInput("DOWN")}>▼</button><button className={`${styles.controlBtn} ${styles.btnRight}`} onClick={() => handleMobileInput("RIGHT")}>▶</button></div>
    </div>
  );
}