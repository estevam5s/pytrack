# Reverse Proxy: Nginx, TLS, Roteamento e Segurança

Reverse proxy é um servidor que recebe requisições dos clientes e as encaminha para aplicações internas. Ele fica na frente da aplicação e cuida de entrada HTTP, TLS, roteamento, compressão, limites, headers e balanceamento.

Em aplicações Python, é comum usar Nginx, Apache, HAProxy, Envoy, Traefik ou Ingress Controller como reverse proxy na frente de Gunicorn/Uvicorn.

---

## Forward Proxy vs Reverse Proxy

Forward proxy representa o cliente:

```text
Cliente -> Proxy -> Internet
```

Reverse proxy representa o servidor:

```text
Cliente -> Reverse Proxy -> Aplicacao
```

Usuário acessa o proxy, não a aplicação diretamente.

---

## Por que Usar

Reverse proxy oferece:

- TLS/HTTPS;
- roteamento por domínio/path;
- balanceamento;
- compressão;
- cache;
- rate limiting;
- headers de segurança;
- upload limits;
- logs de acesso;
- proteção básica;
- isolamento da aplicação.

Uvicorn/Gunicorn não deve ser exposto diretamente à internet em produção comum.

---

## Arquitetura

```text
Internet
  -> Nginx :443
  -> 127.0.0.1:8000
  -> Uvicorn/Gunicorn
  -> FastAPI
```

A aplicação escuta em localhost. Só o proxy fica público.

---

## Configuração Básica Nginx

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

Validar:

```bash
sudo nginx -t
sudo systemctl reload nginx
```

---

## TLS

Com Certbot:

```bash
sudo certbot --nginx -d api.exemplo.com
```

Configuração típica:

```nginx
server {
    listen 443 ssl http2;
    server_name api.exemplo.com;

    ssl_certificate /etc/letsencrypt/live/api.exemplo.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.exemplo.com/privkey.pem;

    location / {
        proxy_pass http://127.0.0.1:8000;
    }
}
```

Redirecione HTTP para HTTPS:

```nginx
server {
    listen 80;
    server_name api.exemplo.com;
    return 301 https://$host$request_uri;
}
```

---

## Headers Encaminhados

```nginx
proxy_set_header Host $host;
proxy_set_header X-Real-IP $remote_addr;
proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
proxy_set_header X-Forwarded-Proto $scheme;
```

Eles permitem que a aplicação saiba:

- host original;
- IP do cliente;
- protocolo original;
- cadeia de proxies.

Configure a aplicação para confiar apenas no proxy. Não aceite esses headers de clientes diretos.

---

## Timeouts

```nginx
location / {
    proxy_connect_timeout 5s;
    proxy_send_timeout 30s;
    proxy_read_timeout 30s;
    proxy_pass http://127.0.0.1:8000;
}
```

Timeouts protegem recursos. Se uma operação demora muito, considere fila ou processamento assíncrono.

---

## Uploads

Limite tamanho:

```nginx
client_max_body_size 10m;
```

Para uploads grandes:

- use storage direto com URL assinada;
- valide tipo e tamanho;
- evite segurar worker por muito tempo;
- monitore espaço temporário.

---

## Compressão

```nginx
gzip on;
gzip_types text/plain application/json text/css application/javascript;
gzip_min_length 1024;
```

Compressão reduz tráfego, mas consome CPU. Não comprima dados já comprimidos como imagens JPEG/PNG.

---

## Cache

Cache básico:

```nginx
proxy_cache_path /var/cache/nginx levels=1:2 keys_zone=api_cache:10m max_size=1g inactive=60m;

server {
    location /public/ {
        proxy_cache api_cache;
        proxy_cache_valid 200 5m;
        proxy_pass http://127.0.0.1:8000;
    }
}
```

Cache em proxy deve respeitar autenticação e privacidade. Não cacheie resposta privada de usuário.

---

## Rate Limiting

```nginx
limit_req_zone $binary_remote_addr zone=api_limit:10m rate=10r/s;

server {
    location / {
        limit_req zone=api_limit burst=20 nodelay;
        proxy_pass http://127.0.0.1:8000;
    }
}
```

Rate limiting por IP é simples, mas pode afetar usuários atrás de NAT. Para APIs autenticadas, limite por usuário/token no gateway ou aplicação.

---

## Headers de Segurança

```nginx
add_header X-Content-Type-Options "nosniff" always;
add_header X-Frame-Options "DENY" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
```

HSTS deve ser usado com cuidado, especialmente com `includeSubDomains`. Garanta que todos os subdomínios suportam HTTPS.

---

## WebSockets

```nginx
location /ws/ {
    proxy_pass http://127.0.0.1:8000;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
    proxy_set_header Host $host;
}
```

WebSockets exigem timeouts e limites adequados para conexões longas.

---

## Roteamento por Path

```nginx
location /api/ {
    proxy_pass http://127.0.0.1:8000/;
}

location /admin/ {
    proxy_pass http://127.0.0.1:9000/;
}
```

Cuidado com barras finais em `proxy_pass`; elas alteram reescrita de path.

---

## Roteamento por Domínio

```nginx
server {
    server_name api.exemplo.com;
    location / {
        proxy_pass http://127.0.0.1:8000;
    }
}

server {
    server_name admin.exemplo.com;
    location / {
        proxy_pass http://127.0.0.1:9000;
    }
}
```

Cada domínio pode ter certificados, logs e regras próprias.

---

## Logs do Proxy

Nginx access log mostra entrada do sistema:

```nginx
log_format json_combined escape=json
  '{'
  '"time":"$time_iso8601",'
  '"remote_addr":"$remote_addr",'
  '"request":"$request",'
  '"status":$status,'
  '"body_bytes_sent":$body_bytes_sent,'
  '"request_time":$request_time,'
  '"upstream_response_time":"$upstream_response_time"'
  '}';

access_log /var/log/nginx/access.log json_combined;
```

Métricas importantes:

- status code;
- request time;
- upstream time;
- 502/503/504;
- bytes enviados;
- IP origem;
- rota.

---

## 502, 503 e 504

Erros comuns:

- **502 Bad Gateway**: upstream inválido, caiu ou respondeu mal.
- **503 Service Unavailable**: serviço indisponível ou sem upstream saudável.
- **504 Gateway Timeout**: upstream demorou demais.

Investigação:

```bash
sudo nginx -t
sudo systemctl status nginx
journalctl -u minha-api -f
curl http://127.0.0.1:8000/health
```

---

## Reverse Proxy em Kubernetes

No Kubernetes, Ingress Controller faz papel de reverse proxy:

```text
Internet -> Load Balancer -> Ingress Controller -> Service -> Pods
```

Recursos relacionados:

- Ingress;
- Gateway API;
- cert-manager;
- ExternalDNS;
- Nginx Ingress;
- Traefik;
- Istio/Envoy.

---

## Hardening

Práticas:

- expor apenas 80/443;
- aplicação escuta em localhost/rede interna;
- TLS forte;
- headers de segurança;
- rate limiting;
- limites de upload;
- ocultar versão do servidor;
- logs centralizados;
- WAF quando necessário;
- bloquear paths internos;
- autenticação em áreas administrativas.

Ocultar versão:

```nginx
server_tokens off;
```

---

## Erros Comuns

- expor aplicação diretamente;
- esquecer `X-Forwarded-Proto`;
- não redirecionar HTTP para HTTPS;
- configurar timeout alto demais;
- permitir upload sem limite;
- cachear resposta privada;
- não monitorar 502/504;
- usar HSTS sem entender impacto;
- confiar em headers enviados por cliente;
- errar barra final em `proxy_pass`.

---

## Checklist Avançado

- Proxy é o único ponto público?
- TLS está válido e renovando?
- HTTP redireciona para HTTPS?
- Headers forwarded estão corretos?
- Timeouts são coerentes?
- Upload tem limite?
- Logs incluem latência de upstream?
- Rate limiting foi avaliado?
- Headers de segurança estão configurados?
- 502/503/504 têm alerta?

Reverse proxy é a porta de entrada da aplicação. Uma configuração bem feita melhora segurança, desempenho, roteamento e capacidade de investigação em produção.

