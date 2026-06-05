# Cache e Logs em Aplicações Python

Cache melhora latência e reduz carga. Logs tornam o sistema investigável. Em produção, ambos precisam de estratégia. Cache sem invalidação vira bug. Log sem estrutura vira ruído.

---

## Cache

Cache guarda resultado reutilizável:

- resposta de API externa;
- consulta pesada;
- sessão;
- permissões;
- configuração;
- HTML renderizado;
- token temporário.

Cache não deve ser a única fonte de verdade para dados críticos.

---

## Cache Local

```python
from functools import lru_cache


@lru_cache(maxsize=128)
def buscar_config(chave: str) -> str:
    print("buscando config")
    return "valor"
```

Bom para dados pequenos e estáveis dentro do processo.

Limitação: cada processo tem seu próprio cache.

---

## Cache com Redis

```python
import json
import redis

client = redis.Redis.from_url("redis://localhost:6379/0", decode_responses=True)


def get_or_set_json(chave: str, ttl: int, loader):
    cached = client.get(chave)
    if cached:
        return json.loads(cached)

    valor = loader()
    client.setex(chave, ttl, json.dumps(valor))
    return valor
```

Uso:

```python
def buscar_cliente_cached(cliente_id: int):
    return get_or_set_json(
        f"cliente:{cliente_id}",
        ttl=300,
        loader=lambda: buscar_cliente_no_banco(cliente_id),
    )
```

---

## Estratégias de Cache

Cache aside:

- aplicação lê cache;
- se miss, busca origem;
- salva no cache.

Write through:

- escrita passa pelo cache e origem.

Write behind:

- cache recebe escrita e origem atualiza depois.

TTL:

- expira automaticamente.

Invalidação explícita:

- apaga cache quando dado muda.

---

## Problemas de Cache

- stale data;
- cache stampede;
- chaves sem padrão;
- TTL longo demais;
- memória sem limite;
- cache de erro;
- dados sensíveis em cache;
- invalidação parcial.

Mitigação de stampede:

```python
import random

ttl = 300 + random.randint(0, 60)
```

Adicionar jitter evita expiração simultânea em massa.

---

## Logs Básicos

```python
import logging

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)s | %(name)s | %(message)s",
)

logger = logging.getLogger(__name__)
logger.info("Aplicação iniciada")
```

Em containers, logue em stdout/stderr.

---

## Logs Estruturados

```python
import json
import logging


class JsonFormatter(logging.Formatter):
    def format(self, record):
        payload = {
            "level": record.levelname,
            "logger": record.name,
            "message": record.getMessage(),
            "time": self.formatTime(record),
        }
        return json.dumps(payload)
```

Logs estruturados são melhores para busca em ELK, Loki, Datadog ou CloudWatch.

---

## Request ID

```python
import contextvars

request_id_var = contextvars.ContextVar("request_id", default="-")


class RequestIdFilter(logging.Filter):
    def filter(self, record):
        record.request_id = request_id_var.get()
        return True
```

Middleware define o request id, logs incluem o campo.

---

## Níveis de Log

- `DEBUG`: diagnóstico detalhado.
- `INFO`: eventos normais importantes.
- `WARNING`: situação anormal recuperável.
- `ERROR`: falha em operação.
- `CRITICAL`: falha grave.

Não use `ERROR` para fluxo esperado, como login inválido.

---

## O Que Logar

Logue:

- início/fim de jobs;
- falhas externas;
- decisões importantes;
- tempo de execução;
- IDs técnicos;
- status de integrações.

Não logue:

- senhas;
- tokens;
- cartões;
- documentos sensíveis;
- payload completo sem necessidade;
- dados pessoais além do necessário.

---

## Métricas e Tracing

Logs respondem "o que aconteceu?". Métricas respondem "quanto e com que frequência?". Tracing responde "por onde a request passou?".

Métricas úteis:

- requests por segundo;
- latência p95/p99;
- taxa de erro;
- cache hit rate;
- filas pendentes;
- uso de CPU/memória.

---

## Checklist

- cache tem TTL?
- chaves seguem padrão?
- invalidação está definida?
- cache não guarda segredo sem necessidade?
- aplicação funciona se cache cair?
- logs são estruturados?
- request id aparece nos logs?
- tokens/senhas são mascarados?
- níveis de log são consistentes?
- métricas críticas existem?
- alertas são acionáveis?

