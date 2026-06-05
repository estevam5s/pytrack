# Balanceamento de Carga: Distribuição, Saúde e Alta Disponibilidade

Balanceamento de carga distribui requisições entre múltiplas instâncias de uma aplicação ou serviço. Ele melhora disponibilidade, capacidade, manutenção e resiliência.

Um load balancer não torna automaticamente o sistema escalável. Ele precisa de health checks, timeouts, estratégia de sessão, observabilidade e instâncias saudáveis.

---

## Por que Usar

Objetivos:

- distribuir tráfego;
- evitar sobrecarga em uma instância;
- remover instâncias com falha;
- permitir deploy sem downtime;
- aumentar disponibilidade;
- suportar manutenção;
- rotear por domínio, path ou regra.

Arquitetura:

```text
Cliente
  -> Load Balancer
     -> app-1
     -> app-2
     -> app-3
```

---

## Camadas de Balanceamento

### Camada 4

Opera em TCP/UDP.

Exemplos:

- NLB;
- HAProxy TCP;
- LVS;
- MetalLB.

Vantagens: rápido e genérico.

### Camada 7

Opera em HTTP.

Exemplos:

- Nginx;
- HAProxy HTTP;
- Envoy;
- ALB;
- Traefik;
- Ingress Controller.

Permite rotear por host, path, headers, cookies e método.

---

## Algoritmos

### Round Robin

Distribui sequencialmente.

```text
req1 -> app1
req2 -> app2
req3 -> app3
```

### Least Connections

Envia para instância com menos conexões ativas.

### Weighted

Instâncias têm pesos diferentes.

```text
app1 weight=3
app2 weight=1
```

### IP Hash

Mantém cliente no mesmo backend com base no IP.

Útil para sticky session, mas tem limitações com NAT, proxies e mudanças de rede.

---

## Health Checks

Load balancer precisa saber quem está saudável.

Endpoint simples:

```python
@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}
```

Readiness:

```python
@app.get("/ready")
def ready() -> dict[str, str]:
    database.ping()
    return {"status": "ready"}
```

Diferença:

- `health`: processo vivo.
- `ready`: pronto para receber tráfego.

---

## Nginx Upstream

```nginx
upstream api_backend {
    server 10.0.1.10:8000 max_fails=3 fail_timeout=30s;
    server 10.0.1.11:8000 max_fails=3 fail_timeout=30s;
    server 10.0.1.12:8000 max_fails=3 fail_timeout=30s;
}

server {
    listen 80;
    server_name api.exemplo.com;

    location / {
        proxy_pass http://api_backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Nginx open source tem health check ativo limitado; falhas são detectadas principalmente por tentativa. Nginx Plus e outros proxies oferecem recursos avançados.

---

## HAProxy

```haproxy
frontend http_front
    bind *:80
    default_backend api_back

backend api_back
    balance roundrobin
    option httpchk GET /health
    server app1 10.0.1.10:8000 check
    server app2 10.0.1.11:8000 check
    server app3 10.0.1.12:8000 check
```

HAProxy é forte em balanceamento e health checks.

---

## Sticky Sessions

Sticky session mantém usuário no mesmo backend.

Problema: reduz flexibilidade e dificulta escala.

Prefira aplicações stateless:

- sessão em Redis;
- tokens JWT quando adequado;
- dados persistidos no banco;
- arquivos em storage externo;
- cache compartilhado.

Se precisa de sticky session, entenda impacto em deploy e falhas.

---

## Timeouts

Timeouts mal configurados causam incidentes.

Configure:

- timeout de conexão;
- timeout de leitura;
- timeout de envio;
- keep-alive;
- idle timeout;
- timeout de upstream.

Regra: timeouts devem ser coerentes entre cliente, proxy, aplicação e dependências.

Exemplo ruim:

```text
client timeout 30s
load balancer timeout 60s
app chama API externa por 120s
```

---

## TLS Termination

Load balancer pode terminar TLS:

```text
Cliente --HTTPS--> Load Balancer --HTTP--> App
```

Ou manter TLS até backend:

```text
Cliente --HTTPS--> LB --HTTPS--> App
```

Terminar no load balancer simplifica certificados. Para ambientes sensíveis, use TLS interno ou mTLS.

---

## X-Forwarded Headers

Quando há proxy, aplicação precisa saber protocolo e IP original.

Headers comuns:

- `X-Forwarded-For`;
- `X-Forwarded-Proto`;
- `X-Forwarded-Host`;
- `X-Real-IP`.

Cuidados:

- confie nesses headers apenas vindos do proxy;
- configure framework para proxy confiável;
- evite spoofing por cliente direto.

---

## Alta Disponibilidade

Um único load balancer pode virar ponto único de falha.

Soluções:

- load balancer gerenciado;
- múltiplos proxies com IP flutuante;
- DNS failover;
- Kubernetes Service/Ingress;
- health checks externos;
- múltiplas zonas.

Alta disponibilidade exige redundância em todas as camadas, não só na aplicação.

---

## Balanceamento em Kubernetes

```text
Ingress/LoadBalancer
  -> Service
     -> Pod 1
     -> Pod 2
     -> Pod 3
```

Service distribui tráfego para Pods prontos. Readiness probe controla entrada no pool.

Use `maxUnavailable: 0` e readiness correta para rolling deploy sem queda.

---

## Balanceamento Global

Para múltiplas regiões:

- DNS geográfico;
- Anycast;
- Global Load Balancer;
- CDN;
- health checks por região;
- failover.

Desafios:

- consistência de dados;
- latência;
- sessão;
- replicação;
- custo;
- operação de incidentes regionais.

---

## Observabilidade

Monitore no load balancer:

- requisições por segundo;
- status 2xx/4xx/5xx;
- latência total;
- latência de backend;
- backends saudáveis;
- conexões ativas;
- timeouts;
- retries;
- bytes enviados;
- TLS handshake;
- erros por upstream.

Sem métricas no balanceador, você perde a visão da entrada do sistema.

---

## Erros Comuns

- não configurar health check;
- deixar instância ruim recebendo tráfego;
- usar sticky session sem necessidade;
- timeouts incoerentes;
- não passar `X-Forwarded-Proto`;
- confiar em headers vindos direto do cliente;
- ter load balancer único sem redundância;
- não monitorar 502/503/504;
- fazer deploy sem remover instância do pool;
- esquecer limite de conexões.

---

## Checklist Avançado

- Há pelo menos duas instâncias da aplicação?
- Health check remove instância ruim?
- Readiness é diferente de liveness?
- Timeouts estão coerentes?
- Aplicação é stateless?
- TLS está configurado corretamente?
- Headers forwarded são confiáveis?
- Load balancer é redundante?
- Métricas do balanceador são monitoradas?
- Deploy não envia tráfego para instância não pronta?

Balanceamento de carga é uma peça central de produção. Ele aumenta disponibilidade quando a aplicação e os processos operacionais foram desenhados para instâncias descartáveis e saudáveis.

