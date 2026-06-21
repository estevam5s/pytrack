"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef } from "react";
import "@xterm/xterm/css/xterm.css";
import { getPyodide } from "@/lib/pyodide-loader";

type FileT = { name: string; code: string };

interface Props {
  active: boolean;
  colors: { bg: string; text: string; accent: string };
  getFiles: () => FileT[];
  sshBridgeUrl?: string;
}

// Cores ANSI
const C = {
  reset: "\x1b[0m", bold: "\x1b[1m", dim: "\x1b[2m",
  red: "\x1b[31m", green: "\x1b[32m", yellow: "\x1b[33m",
  blue: "\x1b[34m", magenta: "\x1b[35m", cyan: "\x1b[36m", gray: "\x1b[90m",
};

const BANNER = [
  `${C.cyan}${C.bold}  ____        _____               _    ${C.reset}`,
  `${C.cyan}${C.bold} |  _ \\ _   _|_   _| __ __ _  ___| | __${C.reset}`,
  `${C.cyan}${C.bold} | |_) | | | | | || '__/ _\` |/ __| |/ /${C.reset}`,
  `${C.cyan}${C.bold} |  __/| |_| | | || | | (_| | (__|   < ${C.reset}`,
  `${C.cyan}${C.bold} |_|    \\__, | |_||_|  \\__,_|\\___|_|\\_\\${C.reset}`,
  `${C.cyan}${C.bold}       |___/   ${C.reset}${C.gray}terminal web · Python (Pyodide)${C.reset}`,
  ``,
  `${C.gray}Digite ${C.reset}${C.green}help${C.reset}${C.gray} para ver os comandos. ${C.reset}${C.green}py${C.reset}${C.gray} abre o REPL Python.${C.reset}`,
  ``,
];

export function IdeTerminal({ active, colors, getFiles, sshBridgeUrl }: Props) {
  const elRef = useRef<HTMLDivElement>(null);
  const termRef = useRef<any>(null);
  const fitRef = useRef<any>(null);
  const stateRef = useRef<{
    line: string; cursor: number; history: string[]; hi: number;
    mode: "shell" | "repl"; replBuffer: string; pyReady: boolean; ws: WebSocket | null;
  }>({ line: "", cursor: 0, history: [], hi: -1, mode: "shell", replBuffer: "", pyReady: false, ws: null });

  useEffect(() => {
    let term: any, fit: any, disposed = false;
    (async () => {
      const [{ Terminal }, { FitAddon }] = await Promise.all([
        import("@xterm/xterm"),
        import("@xterm/addon-fit"),
      ]);
      if (disposed || !elRef.current) return;
      term = new Terminal({
        fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
        fontSize: 13, cursorBlink: true, convertEol: true,
        theme: { background: colors.bg, foreground: colors.text, cursor: colors.accent },
      });
      fit = new FitAddon();
      term.loadAddon(fit);
      term.open(elRef.current);
      try { fit.fit(); } catch {}
      termRef.current = term; fitRef.current = fit;

      BANNER.forEach((l) => term.writeln(l));
      prompt();
      // pré-aquece o Pyodide em background
      getPyodide().then(() => { stateRef.current.pyReady = true; }).catch(() => {});

      term.onData(onData);
    })();

    const onResize = () => { try { fitRef.current?.fit(); } catch {} };
    window.addEventListener("resize", onResize);
    return () => { disposed = true; window.removeEventListener("resize", onResize); try { term?.dispose(); } catch {} };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // refit quando o painel fica visível ou redimensiona
  useEffect(() => { if (active) setTimeout(() => { try { fitRef.current?.fit(); } catch {} }, 60); }, [active]);

  const cwd = useRef("/home/pytrack");

  function term() { return termRef.current; }
  function write(s: string) { term()?.write(s); }
  function writeln(s: string) { term()?.writeln(s); }

  function promptStr() {
    const st = stateRef.current;
    if (st.ws) return `${C.red}${C.bold}ssh${C.reset} ${C.gray}»${C.reset} `;
    if (st.mode === "repl") return `${C.yellow}${C.bold}>>>${C.reset} `;
    const dir = cwd.current.replace("/home/pytrack", "~");
    return `${C.green}${C.bold}pytrack${C.reset}${C.gray}@web${C.reset}:${C.blue}${C.bold}${dir}${C.reset}${C.magenta}$${C.reset} `;
  }
  function prompt() { write("\r\n" + promptStr()); }

  // sincroniza os arquivos abertos do editor no FS do Pyodide
  async function syncFiles() {
    const py = await getPyodide();
    for (const f of getFiles()) {
      py.FS.writeFile(`/home/pytrack/${f.name}`, f.code ?? "");
    }
  }

  async function runShell(input: string): Promise<void> {
    const py = await getPyodide();
    const parts = input.trim().match(/(?:[^\s"]+|"[^"]*")+/g) || [];
    const cmd = (parts[0] || "").toLowerCase();
    const args = parts.slice(1).map((a) => a.replace(/^"|"$/g, ""));

    const builtin: Record<string, () => Promise<void> | void> = {
      help: () => {
        writeln(`${C.bold}Comandos disponíveis:${C.reset}`);
        const cmds: [string, string][] = [
          ["ls [dir]", "lista arquivos"], ["cd <dir>", "muda de diretório"], ["pwd", "diretório atual"],
          ["cat <arq>", "mostra o conteúdo"], ["echo <txt>", "imprime texto"], ["mkdir <dir>", "cria diretório"],
          ["touch <arq>", "cria arquivo"], ["rm [-r] <alvo>", "remove"], ["mv / cp", "move / copia"],
          ["tree", "árvore de arquivos"], ["python <arq>", "executa um arquivo .py"], ["py", "abre o REPL Python"],
          ["pip install <pkg>", "instala pacote (micropip)"], ["clear", "limpa a tela"], ["history", "histórico"],
          ["whoami / date / env", "info do ambiente"], ["neofetch", "info do sistema"],
          ["ssh user@host", "conecta no servidor remoto (precisa do bridge)"],
        ];
        cmds.forEach(([c, d]) => writeln(`  ${C.green}${c.padEnd(22)}${C.reset}${C.gray}${d}${C.reset}`));
      },
      clear: () => term()?.clear(),
      pwd: () => writeln(cwd.current),
      whoami: () => writeln("pytrack"),
      date: async () => writeln(await pyEval(`__import__('datetime').datetime.now().strftime('%a %d %b %Y %H:%M:%S')`)),
      history: () => stateRef.current.history.forEach((h, i) => writeln(`${C.gray}${String(i + 1).padStart(4)}${C.reset}  ${h}`)),
      env: async () => writeln(await pyEval(`'\\n'.join(f'{k}={v}' for k,v in __import__('os').environ.items()) or 'PYODIDE=1\\nHOME=/home/pytrack\\nSHELL=/bin/pysh'`)),
      neofetch: () => {
        writeln(`${C.cyan}${C.bold}pytrack@web${C.reset}`);
        writeln(`${C.gray}-----------${C.reset}`);
        writeln(`${C.yellow}OS${C.reset}      : Pyodide (WebAssembly)`);
        writeln(`${C.yellow}Kernel${C.reset}  : CPython 3.12`);
        writeln(`${C.yellow}Shell${C.reset}   : pysh (PyTrack)`);
        writeln(`${C.yellow}Host${C.reset}    : navegador`);
        writeln(`${C.yellow}Uptime${C.reset}  : sessão atual`);
      },
    };

    if (!cmd) return;
    if (builtin[cmd]) { await builtin[cmd](); return; }

    switch (cmd) {
      case "ls": writeln(await pyEval(lsPy(args[0]))); break;
      case "cd": await cd(args[0] || "/home/pytrack"); break;
      case "cat": await syncFiles(); writeln(await pyEval(`open(${pyPath(args[0])}).read()`, true)); break;
      case "echo": writeln(args.join(" ")); break;
      case "mkdir": await pyRun(`__import__('os').makedirs(${pyPath(args[0])}, exist_ok=True)`); break;
      case "touch": await pyRun(`open(${pyPath(args[0])}, 'a').close()`); break;
      case "rm": {
        const rec = args[0] === "-r" || args[0] === "-rf";
        const target = rec ? args[1] : args[0];
        await pyRun(rec ? `__import__('shutil').rmtree(${pyPath(target)}, ignore_errors=True)` : `__import__('os').remove(${pyPath(target)})`);
        break;
      }
      case "mv": await pyRun(`__import__('shutil').move(${pyPath(args[0])}, ${pyPath(args[1])})`); break;
      case "cp": await pyRun(`__import__('shutil').copy(${pyPath(args[0])}, ${pyPath(args[1])})`); break;
      case "tree": writeln(await pyEval(treePy())); break;
      case "python": case "python3": {
        if (!args[0]) { await enterRepl(); break; }
        await syncFiles();
        writeln(`${C.gray}executando ${args[0]}…${C.reset}`);
        const out = await pyExec(`exec(compile(open(${pyPath(args[0])}).read(), ${pyPath(args[0])}, 'exec'), {})`);
        if (out) write(out);
        break;
      }
      case "py": case "repl": await enterRepl(); break;
      case "pip": {
        if (args[0] === "install" && args[1]) {
          writeln(`${C.gray}instalando ${args[1]} via micropip…${C.reset}`);
          await pyRun(`import micropip`).catch(async () => { const py = await getPyodide(); await py.loadPackage("micropip"); });
          const r = await pyExec(`import micropip; await micropip.install(${pyStr(args[1])}); print('ok')`, true);
          write(r || `${C.green}instalado.${C.reset}\r\n`);
        } else writeln(`uso: pip install <pacote>`);
        break;
      }
      case "ssh": await startSsh(args); break;
      default: writeln(`${C.red}pysh: comando não encontrado: ${cmd}${C.reset}  ${C.gray}(tente 'help')${C.reset}`);
    }
  }

  // helpers Python
  function pyStr(s: string) { return JSON.stringify(s ?? ""); }
  function pyPath(p?: string) {
    const path = !p ? cwd.current : p.startsWith("/") ? p : `${cwd.current}/${p}`.replace(/\/+/g, "/");
    return JSON.stringify(path);
  }
  function lsPy(dir?: string) {
    return `__import__('os').path and (lambda p: '  '.join(sorted(__import__('os').listdir(p))) if __import__('os').path.isdir(p) else 'não é diretório')(${pyPath(dir)})`;
  }
  function treePy() {
    return `(lambda base: '\\n'.join((' ' * (r[len(base):].count('/') * 2)) + __import__('os').path.basename(r or base) + '/' + ''.join('\\n' + ' ' * (r[len(base):].count('/') * 2 + 2) + f for f in files) for r, dirs, files in __import__('os').walk(base)))(${JSON.stringify(cwd.current)})`;
  }
  async function pyEval(expr: string, raw = false): Promise<string> {
    try {
      const py = await getPyodide();
      const r = await py.runPythonAsync(expr);
      return r == null ? "" : String(r);
    } catch (e: any) {
      const m = String(e?.message || e);
      const last = m.trim().split("\n").pop() || m;
      return `${C.red}${raw ? last : last}${C.reset}`;
    }
  }
  async function pyRun(code: string): Promise<void> {
    try { const py = await getPyodide(); await py.runPythonAsync(code); }
    catch (e: any) { writeln(`${C.red}${String(e?.message || e).trim().split("\n").pop()}${C.reset}`); }
  }
  // executa capturando stdout
  async function pyExec(code: string, isAsync = false): Promise<string> {
    const py = await getPyodide();
    let buf = "";
    py.setStdout({ batched: (s: string) => (buf += s + "\n") });
    py.setStderr({ batched: (s: string) => (buf += C.red + s + C.reset + "\n") });
    try { await py.runPythonAsync(code); }
    catch (e: any) { buf += C.red + (String(e?.message || e).trim().split("\n").slice(-3).join("\n")) + C.reset + "\n"; }
    finally { py.setStdout({ batched: () => {} }); py.setStderr({ batched: () => {} }); }
    return buf;
  }

  async function cd(dir: string) {
    const py = await getPyodide();
    try {
      await py.runPythonAsync(`import os\nos.chdir(${pyPath(dir)})`);
      cwd.current = await py.runPythonAsync(`__import__('os').getcwd()`);
    } catch { writeln(`${C.red}cd: diretório não encontrado: ${dir}${C.reset}`); }
  }

  async function enterRepl() {
    stateRef.current.mode = "repl";
    writeln(`${C.gray}Python 3.12 (Pyodide) — digite ${C.reset}${C.yellow}exit()${C.reset}${C.gray} para sair.${C.reset}`);
  }

  async function replEval(line: string) {
    if (line.trim() === "exit()" || line.trim() === "exit") { stateRef.current.mode = "shell"; return; }
    const out = await pyExec(
      `import sys\n_src = ${pyStr(line)}\ntry:\n    _r = eval(_src)\n    if _r is not None: print(repr(_r))\nexcept SyntaxError:\n    exec(_src)`,
    );
    if (out) write(out);
  }

  // ── SSH via bridge WebSocket (precisa do servidor bridge na VPS) ──
  async function startSsh(args: string[]) {
    const target = args.find((a) => a.includes("@"));
    const bridge = sshBridgeUrl || (typeof window !== "undefined" ? localStorage.getItem("pytrack-ssh-bridge") || "" : "");
    if (!bridge) {
      writeln(`${C.yellow}SSH precisa de um bridge WebSocket→SSH (o navegador não fala SSH direto).${C.reset}`);
      writeln(`${C.gray}Configure a URL do bridge em Configurações → SSH, e rode o servidor bridge na sua VPS.${C.reset}`);
      writeln(`${C.gray}Ex.: ssh usuario@meuservidor.com${C.reset}`);
      return;
    }
    if (!target) { writeln(`uso: ssh usuario@host`); return; }
    const [user, host] = target.split("@");
    writeln(`${C.gray}conectando a ${host} como ${user} via bridge…${C.reset}`);
    try {
      const ws = new WebSocket(bridge);
      stateRef.current.ws = ws;
      const token = typeof window !== "undefined" ? localStorage.getItem("pytrack-ssh-token") || "" : "";
      ws.onopen = () => ws.send(JSON.stringify({ type: "connect", host, username: user, token }));
      ws.onmessage = (ev) => {
        const msg = typeof ev.data === "string" ? ev.data : "";
        try { const j = JSON.parse(msg); if (j.type === "data") write(j.data); else if (j.type === "closed") { writeln(`\r\n${C.gray}conexão encerrada.${C.reset}`); stateRef.current.ws = null; prompt(); } }
        catch { write(msg); }
      };
      ws.onerror = () => { writeln(`${C.red}falha ao conectar no bridge SSH.${C.reset}`); stateRef.current.ws = null; prompt(); };
      ws.onclose = () => { stateRef.current.ws = null; };
    } catch { writeln(`${C.red}URL de bridge inválida.${C.reset}`); stateRef.current.ws = null; }
  }

  // ── entrada de teclado ──
  async function onData(data: string) {
    const st = stateRef.current;
    // modo SSH: encaminha tudo cru pro bridge
    if (st.ws && st.ws.readyState === 1) {
      if (data === "\x1d") { st.ws.close(); st.ws = null; writeln(`\r\n${C.gray}(ssh) desconectado.${C.reset}`); prompt(); return; }
      st.ws.send(JSON.stringify({ type: "input", data }));
      return;
    }
    const code = data.charCodeAt(0);
    if (data === "\r") { // Enter
      write("\r\n");
      const line = st.line;
      st.line = ""; st.cursor = 0;
      if (line.trim()) { st.history.push(line); st.hi = st.history.length; }
      if (st.mode === "repl") { await replEval(line); }
      else { try { await runShell(line); } catch (e: any) { writeln(`${C.red}${e?.message || e}${C.reset}`); } }
      if (!st.ws) prompt();
      return;
    }
    if (code === 127 || code === 8) { // Backspace
      if (st.cursor > 0) { st.line = st.line.slice(0, st.cursor - 1) + st.line.slice(st.cursor); st.cursor--; redraw(); }
      return;
    }
    if (data === "\x03") { write("^C"); st.line = ""; st.cursor = 0; if (st.mode === "repl") st.mode = "shell"; prompt(); return; }
    if (data === "\x0c") { term()?.clear(); prompt(); write(st.line); return; } // Ctrl+L
    if (data === "\x1b[A") { // up
      if (st.history.length && st.hi > 0) { st.hi--; st.line = st.history[st.hi]; st.cursor = st.line.length; redraw(); }
      return;
    }
    if (data === "\x1b[B") { // down
      if (st.hi < st.history.length - 1) { st.hi++; st.line = st.history[st.hi]; st.cursor = st.line.length; redraw(); }
      else { st.hi = st.history.length; st.line = ""; st.cursor = 0; redraw(); }
      return;
    }
    if (data === "\x1b[C") { if (st.cursor < st.line.length) { st.cursor++; write(data); } return; } // right
    if (data === "\x1b[D") { if (st.cursor > 0) { st.cursor--; write(data); } return; } // left
    if (data === "\t") { await complete(); return; } // Tab
    if (code < 32) return; // ignora outros controles
    // caractere normal
    st.line = st.line.slice(0, st.cursor) + data + st.line.slice(st.cursor);
    st.cursor += data.length;
    redraw();
  }

  function redraw() {
    const st = stateRef.current;
    write("\r\x1b[K" + promptStr() + st.line);
    const back = st.line.length - st.cursor;
    if (back > 0) write(`\x1b[${back}D`);
  }

  const CMDS = ["help", "ls", "cd", "pwd", "cat", "echo", "mkdir", "touch", "rm", "mv", "cp", "tree", "python", "py", "pip", "clear", "history", "whoami", "date", "env", "neofetch", "ssh", "exit"];
  async function complete() {
    const st = stateRef.current;
    const parts = st.line.slice(0, st.cursor).split(" ");
    const word = parts[parts.length - 1];
    let options: string[] = [];
    if (parts.length === 1) options = CMDS.filter((c) => c.startsWith(word));
    else {
      try { const py = await getPyodide(); const files: string[] = JSON.parse(await py.runPythonAsync(`__import__('json').dumps(__import__('os').listdir('${cwd.current}'))`)); options = files.filter((f) => f.startsWith(word)); } catch {}
    }
    if (options.length === 1) {
      const add = options[0].slice(word.length);
      st.line = st.line.slice(0, st.cursor) + add + st.line.slice(st.cursor);
      st.cursor += add.length; redraw();
    } else if (options.length > 1) {
      write("\r\n" + options.map((o) => `${C.cyan}${o}${C.reset}`).join("  ") + "\r\n");
      write(promptStr() + st.line);
    }
  }

  return <div ref={elRef} className="h-full w-full" style={{ background: colors.bg }} />;
}
