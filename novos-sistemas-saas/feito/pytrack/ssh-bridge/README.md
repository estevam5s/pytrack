# PyTrack SSH Bridge

O navegador não fala SSH diretamente. Este servidor roda na **sua VPS** e faz a ponte
**WebSocket → SSH** para o terminal da IDE (`/ide`).

## Instalar e rodar
```bash
cd ssh-bridge
npm install
cp .env.example .env   # preencha SSH_HOST/SSH_USER + senha ou chave + AUTH_TOKEN
node server.js          # ouve em ws://0.0.0.0:8022
```

## TLS (recomendado)
Coloque atrás de Nginx/Caddy com certificado e exponha como `wss://seuservidor:8022`.
Exemplo Caddy:
```
seuservidor.com:8022 {
  reverse_proxy 127.0.0.1:8022
}
```

## Conectar pela IDE
1. Em `/ide` → painel **SSH remoto** → informe a URL `wss://seuservidor.com:8022` (e salve).
2. No terminal: `ssh seu_usuario@seuservidor.com`
3. Para sair da sessão SSH: `Ctrl+]`.

## Segurança
- As credenciais SSH ficam **só no `.env` da VPS**, nunca no navegador.
- Exige `AUTH_TOKEN`. Use `ALLOWED_HOSTS` para restringir destinos.
- Rode como usuário sem privilégios e prefira **chave** a senha.
