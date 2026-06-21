/**
 * PyTrack SSH Bridge — ponte WebSocket → SSH.
 *
 * O navegador não fala SSH direto, então este pequeno servidor (que VOCÊ roda
 * na sua VPS) recebe a conexão WebSocket do terminal da IDE e abre uma sessão
 * SSH real com PTY, encaminhando a saída de volta.
 *
 * Segurança:
 *  - As credenciais SSH ficam SÓ aqui (env), nunca no navegador.
 *  - Exige um AUTH_TOKEN compartilhado (o cliente envia; o bridge valida).
 *  - Recomende rodar atrás de TLS (wss://) — ex.: via Nginx/Caddy com certificado.
 *
 * Uso:
 *   npm install
 *   cp .env.example .env   # preencha as variáveis
 *   node server.js
 */
const { WebSocketServer } = require("ws");
const { Client } = require("ssh2");
const fs = require("fs");

const PORT = Number(process.env.PORT || 8022);
const AUTH_TOKEN = process.env.AUTH_TOKEN || "";
const SSH_HOST = process.env.SSH_HOST || "127.0.0.1";
const SSH_PORT = Number(process.env.SSH_PORT || 22);
const SSH_USER = process.env.SSH_USER || "";
const SSH_PASSWORD = process.env.SSH_PASSWORD || "";
const SSH_KEY_PATH = process.env.SSH_PRIVATE_KEY_PATH || "";
// allowlist opcional de hosts que o cliente pode pedir (vazio = usa só SSH_HOST do env)
const ALLOWED_HOSTS = (process.env.ALLOWED_HOSTS || "").split(",").map((s) => s.trim()).filter(Boolean);

const wss = new WebSocketServer({ port: PORT });
console.log(`[bridge] WebSocket SSH ouvindo em ws://0.0.0.0:${PORT}`);

wss.on("connection", (ws) => {
  let ssh = null;
  let stream = null;

  const send = (obj) => { try { ws.send(JSON.stringify(obj)); } catch {} };

  ws.on("message", (raw) => {
    let msg;
    try { msg = JSON.parse(raw.toString()); } catch { return; }

    if (msg.type === "connect") {
      if (AUTH_TOKEN && msg.token !== AUTH_TOKEN) {
        send({ type: "data", data: "\r\n\x1b[31mToken inválido.\x1b[0m\r\n" });
        ws.close(); return;
      }
      const host = ALLOWED_HOSTS.length
        ? (ALLOWED_HOSTS.includes(msg.host) ? msg.host : null)
        : SSH_HOST;
      if (!host) { send({ type: "data", data: "\r\n\x1b[31mHost não permitido.\x1b[0m\r\n" }); ws.close(); return; }

      ssh = new Client();
      ssh
        .on("ready", () => {
          send({ type: "data", data: `\x1b[32mConectado a ${host}.\x1b[0m\r\n` });
          ssh.shell({ term: "xterm-256color" }, (err, s) => {
            if (err) { send({ type: "data", data: `\r\n\x1b[31m${err.message}\x1b[0m\r\n` }); ws.close(); return; }
            stream = s;
            s.on("data", (d) => send({ type: "data", data: d.toString("utf8") }));
            s.on("close", () => { send({ type: "closed" }); try { ssh.end(); } catch {} });
          });
        })
        .on("error", (err) => { send({ type: "data", data: `\r\n\x1b[31mSSH: ${err.message}\x1b[0m\r\n` }); send({ type: "closed" }); })
        .on("close", () => send({ type: "closed" }));

      const cfg = {
        host, port: SSH_PORT,
        username: msg.username || SSH_USER,
        readyTimeout: 15000,
      };
      if (SSH_KEY_PATH && fs.existsSync(SSH_KEY_PATH)) cfg.privateKey = fs.readFileSync(SSH_KEY_PATH);
      else if (SSH_PASSWORD) cfg.password = SSH_PASSWORD;
      ssh.connect(cfg);
    }

    if (msg.type === "input" && stream) stream.write(msg.data);
    if (msg.type === "resize" && stream && msg.cols) stream.setWindow(msg.rows, msg.cols, 0, 0);
  });

  ws.on("close", () => { try { stream?.end(); ssh?.end(); } catch {} });
});
