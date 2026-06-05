# Linux para Deploy de Aplicações Python

Grande parte das aplicações Python em produção roda em Linux, diretamente, em containers ou em Kubernetes. Entender Linux ajuda a diagnosticar permissões, processos, portas, logs, systemd, rede, disco e segurança.

---

## Estrutura Básica

Diretórios comuns:

```text
/etc        configurações
/var/log    logs
/var/www    aplicações web tradicionais
/opt        aplicações instaladas manualmente
/srv        dados servidos por serviços
/home       usuários
/tmp        temporários
```

Para uma aplicação:

```text
/opt/minha-api/
├── .venv/
├── app/
├── requirements.txt
└── .env
```

---

## Usuário de Serviço

Não rode aplicação como root.

```bash
sudo useradd --system --create-home --shell /usr/sbin/nologin minha-api
sudo mkdir -p /opt/minha-api
sudo chown -R minha-api:minha-api /opt/minha-api
```

---

## Ambiente Virtual

```bash
cd /opt/minha-api
python3 -m venv .venv
. .venv/bin/activate
pip install -r requirements.txt
```

Em produção, use dependências fixadas.

---

## Variáveis de Ambiente

Arquivo `/etc/minha-api.env`:

```env
APP_ENV=production
DATABASE_URL=postgresql://user:pass@localhost:5432/app
SECRET_KEY=troque
```

Permissões:

```bash
sudo chown root:minha-api /etc/minha-api.env
sudo chmod 640 /etc/minha-api.env
```

---

## systemd

`/etc/systemd/system/minha-api.service`:

```ini
[Unit]
Description=Minha API Python
After=network.target

[Service]
User=minha-api
Group=minha-api
WorkingDirectory=/opt/minha-api
EnvironmentFile=/etc/minha-api.env
ExecStart=/opt/minha-api/.venv/bin/gunicorn app.main:app -k uvicorn.workers.UvicornWorker --bind 127.0.0.1:8000 --workers 2
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
```

Comandos:

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

## Portas e Processos

```bash
ss -tulpn
ps aux | grep gunicorn
systemctl status minha-api
```

Ver processo por porta:

```bash
sudo lsof -i :8000
```

---

## Permissões

```bash
ls -la
chmod 640 arquivo
chown usuario:grupo arquivo
```

Permissões mal configuradas são causa comum de falha em upload, logs e leitura de `.env`.

---

## Firewall

Ubuntu com UFW:

```bash
sudo ufw allow OpenSSH
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
sudo ufw status
```

Normalmente Gunicorn/Uvicorn fica em `127.0.0.1:8000`; público é Nginx/Apache em 80/443.

---

## Deploy Manual Controlado

```bash
cd /opt/minha-api
git fetch --all
git checkout v1.4.2
. .venv/bin/activate
pip install -r requirements.txt
alembic upgrade head
sudo systemctl restart minha-api
```

Automatize isso depois em pipeline.

---

## Checklist Linux

- aplicação roda com usuário próprio?
- segredos têm permissão restrita?
- serviço é gerenciado por systemd?
- logs aparecem no journald?
- firewall expõe só 80/443/SSH?
- dependências são fixadas?
- migrations são controladas?
- rollback é possível?
- disco, memória e CPU são monitorados?

