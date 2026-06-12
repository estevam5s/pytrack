# Nginx e Apache como Reverse Proxy

Nginx e Apache ficam na frente da aplicação Python para receber HTTP público, terminar TLS, servir arquivos estáticos, aplicar compressão, limitar requisições e encaminhar tráfego para Gunicorn/Uvicorn.

Arquitetura comum:

```text
Internet -> Nginx/Apache -> 127.0.0.1:8000 -> Gunicorn/Uvicorn -> Python
```

---

## Nginx Reverse Proxy

`/etc/nginx/sites-available/minha-api`:

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

Ativar:

```bash
sudo ln -s /etc/nginx/sites-available/minha-api /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

---

## Nginx com WebSockets

```nginx
location /ws/ {
    proxy_pass http://127.0.0.1:8000;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
    proxy_set_header Host $host;
    proxy_read_timeout 3600;
}
```

WebSocket precisa de upgrade HTTP e timeouts maiores.

---

## Uploads no Nginx

```nginx
server {
    client_max_body_size 20M;
}
```

Sem isso, uploads maiores podem retornar `413 Request Entity Too Large`.

---

## Rate Limit no Nginx

```nginx
http {
    limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;

    server {
        location /api/ {
            limit_req zone=api burst=20 nodelay;
            proxy_pass http://127.0.0.1:8000;
        }
    }
}
```

Bom para proteção de borda.

---

## TLS com Certbot

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d api.exemplo.com
```

Renovação:

```bash
sudo certbot renew --dry-run
```

---

## Arquivos Estáticos

```nginx
location /static/ {
    alias /opt/minha-api/static/;
    expires 30d;
    add_header Cache-Control "public";
}
```

Nginx é mais eficiente para estáticos do que a aplicação Python.

---

## Apache Reverse Proxy

Habilitar módulos:

```bash
sudo a2enmod proxy proxy_http headers ssl
sudo systemctl restart apache2
```

VirtualHost:

```apache
<VirtualHost *:80>
    ServerName api.exemplo.com

    ProxyPreserveHost On
    ProxyPass / http://127.0.0.1:8000/
    ProxyPassReverse / http://127.0.0.1:8000/

    RequestHeader set X-Forwarded-Proto "http"
    ErrorLog ${APACHE_LOG_DIR}/minha-api-error.log
    CustomLog ${APACHE_LOG_DIR}/minha-api-access.log combined
</VirtualHost>
```

---

## Apache com WebSockets

```apache
ProxyPass /ws/ ws://127.0.0.1:8000/ws/
ProxyPassReverse /ws/ ws://127.0.0.1:8000/ws/
ProxyPass / http://127.0.0.1:8000/
ProxyPassReverse / http://127.0.0.1:8000/
```

Pode exigir `proxy_wstunnel`.

```bash
sudo a2enmod proxy_wstunnel
```

---

## Nginx vs Apache

Nginx:

- muito comum como reverse proxy;
- excelente em estáticos e conexões simultâneas;
- configuração simples para APIs;
- muito usado em containers e Kubernetes ingress.

Apache:

- ecossistema maduro;
- `.htaccess` em hospedagens tradicionais;
- módulos variados;
- comum em ambientes legados.

Para APIs Python modernas, Nginx é frequentemente a escolha padrão.

---

## Checklist

- app Python escuta em localhost?
- proxy envia `X-Forwarded-*`?
- TLS está ativo?
- upload tem limite configurado?
- WebSockets têm upgrade e timeout?
- arquivos estáticos são servidos pelo proxy?
- rate limit de borda foi considerado?
- logs de access/error estão disponíveis?
- `nginx -t` ou teste Apache passa antes do reload?

