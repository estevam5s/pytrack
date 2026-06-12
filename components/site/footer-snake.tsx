"use client";

import { useEffect, useRef, useState } from "react";

// Animação decorativa: uma cobrinha (🐍 Python) que joga sozinha comendo "pacotes".
// Renderiza apenas no desktop (escondida no mobile).
type Cell = { x: number; y: number };

const COLS = 52;
const ROWS = 14;
const CELL = 16;
const TICK = 100; // ms por passo

export function FooterSnake() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [eaten, setEaten] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // estado do jogo
    const SYMBOLS = ["def", "{}", "[]", "()", "pip", "()", "%", "=>", "@", "self", "import", "lambda"];
    let snake: Cell[] = [
      { x: 6, y: 5 }, { x: 5, y: 5 }, { x: 4, y: 5 }, { x: 3, y: 5 },
    ];
    let dir: Cell = { x: 1, y: 0 };
    let food: Cell = spawnFood(snake);
    let foodSymbol = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
    let raf = 0;
    let last = 0;
    let alive = true;
    let localScore = 0;
    let localEaten = 0;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = COLS * CELL * dpr;
    canvas.height = ROWS * CELL * dpr;
    ctx.scale(dpr, dpr);

    function spawnFood(s: Cell[]): Cell {
      const occ = new Set(s.map((c) => `${c.x},${c.y}`));
      let f: Cell;
      do {
        f = { x: Math.floor(Math.random() * COLS), y: Math.floor(Math.random() * ROWS) };
      } while (occ.has(`${f.x},${f.y}`));
      return f;
    }

    const key = (c: Cell) => `${c.x},${c.y}`;
    const inBounds = (c: Cell) => c.x >= 0 && c.x < COLS && c.y >= 0 && c.y < ROWS;

    // BFS do head até a comida, retorna o primeiro passo (direção)
    function bfsDir(): Cell | null {
      const head = snake[0];
      const headK = key(head);
      const body = new Set(snake.slice(0, -1).map(key)); // a cauda vai liberar
      const prev = new Map<string, string>();
      const q: Cell[] = [head];
      const seen = new Set([headK]);
      let found = false;
      while (q.length) {
        const cur = q.shift()!;
        if (cur.x === food.x && cur.y === food.y) { found = true; break; }
        for (const d of [{ x: 1, y: 0 }, { x: -1, y: 0 }, { x: 0, y: 1 }, { x: 0, y: -1 }]) {
          const nx = { x: cur.x + d.x, y: cur.y + d.y };
          const k = key(nx);
          if (!inBounds(nx) || seen.has(k) || body.has(k)) continue;
          seen.add(k);
          prev.set(k, key(cur));
          q.push(nx);
        }
      }
      if (!found) return null;
      // anda de volta da comida até achar a célula cujo anterior é o head (1º passo)
      let curK = key(food);
      if (curK === headK) return null;
      while (prev.get(curK) && prev.get(curK) !== headK) {
        curK = prev.get(curK)!;
      }
      const [sx, sy] = curK.split(",").map(Number);
      return { x: sx - head.x, y: sy - head.y };
    }

    // fallback: qualquer direção segura (não bate na parede nem em si)
    function safeDir(): Cell {
      const head = snake[0];
      const body = new Set(snake.slice(0, -1).map(key));
      const opts = [dir, { x: 0, y: 1 }, { x: 0, y: -1 }, { x: 1, y: 0 }, { x: -1, y: 0 }];
      for (const d of opts) {
        const nx = { x: head.x + d.x, y: head.y + d.y };
        if (inBounds(nx) && !body.has(key(nx))) return d;
      }
      return dir;
    }

    function step() {
      const next = bfsDir() ?? safeDir();
      dir = next;
      const head = { x: snake[0].x + dir.x, y: snake[0].y + dir.y };
      // morte → reinicia suave
      if (!inBounds(head) || snake.slice(0, -1).some((c) => c.x === head.x && c.y === head.y)) {
        snake = [{ x: 6, y: 5 }, { x: 5, y: 5 }, { x: 4, y: 5 }, { x: 3, y: 5 }];
        dir = { x: 1, y: 0 };
        food = spawnFood(snake);
        foodSymbol = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
        localScore = 0;
        setScore(0);
        return;
      }
      snake.unshift(head);
      if (head.x === food.x && head.y === food.y) {
        localScore += 10;
        localEaten += 1;
        setScore(localScore);
        setEaten(localEaten);
        food = spawnFood(snake);
        foodSymbol = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
        if (snake.length > 60) snake = snake.slice(0, 40); // mantém ágil
      } else {
        snake.pop();
      }
    }

    function draw() {
      if (!ctx) return;
      ctx.clearRect(0, 0, COLS * CELL, ROWS * CELL);
      // comida = símbolo de código Python (def, {}, pip, []...)
      const fx = food.x * CELL + CELL / 2;
      const fy = food.y * CELL + CELL / 2;
      ctx.font = "bold 11px ui-monospace, 'SF Mono', monospace";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillStyle = "#29E0A9";
      ctx.shadowColor = "#29E0A9";
      ctx.shadowBlur = 8;
      ctx.fillText(foodSymbol, fx, fy);
      ctx.shadowBlur = 0;

      // cobra (gradiente roxo → verde)
      snake.forEach((c, i) => {
        const t = i / Math.max(1, snake.length - 1);
        const r = Math.round(130 + (41 - 130) * t);
        const g = Math.round(52 + (224 - 52) * t);
        const b = Math.round(233 + (169 - 233) * t);
        const size = i === 0 ? CELL - 3 : CELL - 4;
        const off = (CELL - size) / 2;
        ctx.fillStyle = `rgb(${r},${g},${b})`;
        roundRect(ctx, c.x * CELL + off, c.y * CELL + off, size, size, 4);
        ctx.fill();
        if (i === 0) {
          // olhinhos
          ctx.fillStyle = "#fff";
          const ex = c.x * CELL + CELL / 2 + dir.x * 3;
          const ey = c.y * CELL + CELL / 2 + dir.y * 3;
          ctx.beginPath(); ctx.arc(ex - 2, ey - 2, 1.4, 0, Math.PI * 2); ctx.fill();
          ctx.beginPath(); ctx.arc(ex + 2, ey + 2, 1.4, 0, Math.PI * 2); ctx.fill();
        }
      });
    }

    function roundRect(c: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
      c.beginPath();
      c.moveTo(x + r, y);
      c.arcTo(x + w, y, x + w, y + h, r);
      c.arcTo(x + w, y + h, x, y + h, r);
      c.arcTo(x, y + h, x, y, r);
      c.arcTo(x, y, x + w, y, r);
      c.closePath();
    }

    function loop(ts: number) {
      if (!alive) return;
      if (ts - last >= TICK) {
        last = ts;
        step();
        draw();
      }
      raf = requestAnimationFrame(loop);
    }
    draw();
    raf = requestAnimationFrame(loop);

    // pausa quando a aba não está visível (economia)
    const onVis = () => { alive = !document.hidden; if (alive) raf = requestAnimationFrame(loop); };
    document.addEventListener("visibilitychange", onVis);

    return () => {
      alive = false;
      cancelAnimationFrame(raf);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  return (
    <div className="hidden select-none lg:block">
      <div className="flex items-center justify-between px-1 pb-2">
        <p className="flex items-center gap-1.5 text-xs font-medium text-text-secondary/70">
          <span className="text-sm">🐍</span> A cobra Python devorando código…
        </p>
        <p className="text-xs text-text-secondary/70">
          Score <span className="font-bold text-green">{score}</span> · {eaten} símbolos
        </p>
      </div>
      <div className="overflow-hidden">
        <canvas
          ref={canvasRef}
          style={{ width: COLS * CELL, height: ROWS * CELL, maxWidth: "100%" }}
          className="rounded-lg"
          aria-hidden
        />
      </div>
    </div>
  );
}
