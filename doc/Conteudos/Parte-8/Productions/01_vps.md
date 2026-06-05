# VPS: Deploy Profissional em Servidores Linux

VPS, Virtual Private Server, é um servidor virtual onde você controla sistema operacional, rede, processos, firewall, runtime e deploy. É uma das formas mais diretas de colocar uma aplicação Python em produção.

Uma VPS é simples de começar, mas exige responsabilidade operacional. Você precisa cuidar de segurança, atualizações, logs, backups, TLS, monitoramento, restart automático e capacidade.

---

## Quando Usar VPS

VPS faz sentido quando:

- você quer baixo custo e controle;
- a aplicação é pequena ou média;
- o time sabe operar Linux;
- deploy simples é suficiente;
- você não precisa de orquestração complexa;
- o tráfego é previsível;
- a arquitetura cabe em uma ou poucas máquinas.

Evite VPS sem automação quando:

- muitos serviços precisam escalar dinamicamente;
- há exigência forte de alta disponibilidade;
- o time não pode cuidar de patching e segurança;
- deploy manual virou fonte de erro;
- rollback precisa ser frequente e rápido.

---

## Arquitetura Básica

```text
Internet
  -> DNS
  -> VPS
     -> Nginx
     -> Gunicorn/Uvicorn
     -> Aplicacao Python
     -> PostgreSQL/Redis externo ou local
```

Para projetos pequenos, banco pode estar na mesma VPS. Em produção mais séria, prefira banco gerenciado ou servidor separado.

---

## Preparação Inicial

Atualize o sistema:

```bash
sudo apt update
sudo apt upgrade -y
```

Crie usuário de deploy:

```bash
sudo adduser deploy
sudo usermod -aG sudo deploy
```

Configure SSH por chave pública:

```bash
mkdir -p ~/.ssh
chmod 700 ~/.ssh
nano ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys
```

Desabilite login root por senha em `/etc/ssh/sshd_config`:

```text
PermitRootLogin no
PasswordAuthentication no
```

Reinicie SSH:

```bash
sudo systemctl restart ssh
```

Antes de fechar a sessão atual, teste novo login em outro terminal.

---

## Firewall

Com UFW:

```bash
sudo ufw allow OpenSSH
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
sudo ufw status
```

Não exponha diretamente porta da aplicação, banco ou Redis para a internet.

---

## Estrutura no Servidor

Uma organização simples:

```text
/srv/minha-api/
├── current/
├── releases/
├── shared/
│   ├── .env
│   └── logs/
└── venv/
```

Alternativa mais simples:

```text
/opt/minha-api/
├── app/
├── .venv/
├── .env
└── requirements.txt
```

O importante é separar código, ambiente, configuração e dados persistentes.

---

## Deploy Manual Básico

```bash
cd /opt/minha-api
git pull origin main
python3 -m venv .venv
. .venv/bin/activate
pip install -r requirements.txt
python -m pytest
sudo systemctl restart minha-api
```

Esse processo funciona, mas deve evoluir para script ou pipeline. Deploy manual repetitivo gera inconsistência.

---

## Variáveis de Ambiente

Arquivo `.env`:

```bash
APP_ENV=production
DATABASE_URL=postgresql://user:pass@host:5432/app
SECRET_KEY=troque-isto
LOG_LEVEL=INFO
```

Proteja:

```bash
chmod 600 /opt/minha-api/.env
```

Nunca versione `.env` com segredos.

---

## systemd

`/etc/systemd/system/minha-api.service`:

```ini
[Unit]
Description=Minha API Python
After=network.target

[Service]
User=deploy
Group=deploy
WorkingDirectory=/opt/minha-api
EnvironmentFile=/opt/minha-api/.env
ExecStart=/opt/minha-api/.venv/bin/uvicorn app.main:app --host 127.0.0.1 --port 8000
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
```

Ativar:

```bash
sudo systemctl daemon-reload
sudo systemctl enable minha-api
sudo systemctl start minha-api
sudo systemctl status minha-api
```

Logs:

```bash
journalctl -u minha-api -f
```

---

## Gunicorn com Uvicorn Workers

Para produção:

```bash
pip install gunicorn
```

`ExecStart`:

```ini
ExecStart=/opt/minha-api/.venv/bin/gunicorn app.main:app \
  -k uvicorn.workers.UvicornWorker \
  --bind 127.0.0.1:8000 \
  --workers 2 \
  --timeout 60
```

Quantidade de workers depende de CPU, memória, perfil I/O e carga. Meça antes de aumentar.

---

## Nginx como Entrada

Aplicação deve escutar localmente. Nginx recebe internet:

```nginx
server {
    listen 80;
    server_name api.exemplo.com;

    location / {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Ative:

```bash
sudo nginx -t
sudo systemctl reload nginx
```

---

## TLS com Certbot

```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d api.exemplo.com
```

Teste renovação:

```bash
sudo certbot renew --dry-run
```

HTTPS é obrigatório para APIs reais, autenticação e cookies seguros.

---

## Logs e Observabilidade

Monitore:

- status do systemd;
- logs da aplicação;
- logs do Nginx;
- uso de CPU e memória;
- disco;
- latência;
- taxa de erro;
- disponibilidade;
- certificado TLS;
- backups.

Comandos úteis:

```bash
df -h
free -m
top
ss -tulpn
journalctl -u nginx -f
```

Para produção madura, use Prometheus node exporter, logs centralizados e alertas.

---

## Backups

Backup precisa ser testado.

Cuide de:

- banco;
- arquivos enviados por usuários;
- `.env` e configuração;
- certificados quando necessário;
- scripts de deploy;
- restore documentado.

Exemplo PostgreSQL:

```bash
pg_dump "$DATABASE_URL" > backup.sql
```

Backup sem restore testado é esperança, não estratégia.

---

## Segurança

Checklist mínimo:

- SSH por chave;
- root login desabilitado;
- firewall ativo;
- portas mínimas abertas;
- sistema atualizado;
- segredos fora do Git;
- Nginx com TLS;
- permissões restritas;
- banco não exposto;
- logs sem dados sensíveis;
- fail2ban quando apropriado;
- backups criptografados.

---

## Deploy com Releases

Estrutura avançada:

```text
/srv/minha-api/
├── releases/
│   ├── 20260516120000/
│   └── 20260516123000/
├── current -> releases/20260516123000
└── shared/
```

Deploy:

```text
1. enviar nova release
2. instalar dependencias
3. rodar migrations
4. atualizar symlink current
5. restart service
6. health check
7. rollback se falhar
```

Isso permite rollback rápido para release anterior.

---

## Erros Comuns

- rodar aplicação como root;
- expor Uvicorn diretamente na internet;
- não configurar TLS;
- deixar `.env` no Git;
- atualizar servidor sem plano;
- não ter backup;
- não usar systemd;
- depender de terminal aberto;
- não monitorar disco;
- fazer deploy manual sem checklist.

---

## Checklist Avançado

- Deploy é repetível?
- Serviço reinicia automaticamente?
- Nginx faz proxy e TLS?
- Banco e Redis não estão públicos?
- Há logs e métricas?
- Backups têm restore testado?
- Existe rollback?
- Certificado renova automaticamente?
- Atualizações de segurança são aplicadas?
- Incidentes têm runbook?

VPS é uma ótima escola de produção porque expõe todos os fundamentos. Com disciplina, atende muitos produtos. Sem disciplina, vira um ponto único de falha difícil de operar.

