# Sentry: Erros, Performance, Releases e Diagnóstico

Sentry é uma plataforma de monitoramento de erros e performance. Ela captura exceções, agrupa problemas, mostra stack traces, contexto de execução, usuários afetados, releases, regressões e transações lentas.

Enquanto Prometheus é forte em métricas agregadas e OpenTelemetry em tracing aberto, Sentry é especialmente útil para entender erros reais de aplicação e priorizar correções.

---

## O que o Sentry Resolve

Sem Sentry:

```text
usuario relata erro
log tem stack trace perdido
nao sabemos quantos usuarios foram afetados
nao sabemos se comecou apos deploy
erro se repete sem agrupamento
```

Com Sentry:

```text
Issue: ValueError em confirmar_pedido
afetou 312 usuarios
comecou na release 1.42.0
ocorre principalmente em /checkout
stack trace aponta linha exata
```

---

## Instalação

```bash
pip install sentry-sdk
```

FastAPI:

```bash
pip install "sentry-sdk[fastapi]"
```

Configuração:

```python
import sentry_sdk


sentry_sdk.init(
    dsn="https://public@sentry.example/1",
    environment="production",
    release="api-python@1.0.0",
    traces_sample_rate=0.1,
)
```

O DSN identifica o projeto no Sentry. Em produção, carregue por variável de ambiente.

---

## Configuração por Ambiente

```python
import os

import sentry_sdk


def setup_sentry() -> None:
    dsn = os.getenv("SENTRY_DSN")
    if not dsn:
        return

    sentry_sdk.init(
        dsn=dsn,
        environment=os.getenv("APP_ENV", "development"),
        release=os.getenv("APP_VERSION", "local"),
        traces_sample_rate=float(os.getenv("SENTRY_TRACES_SAMPLE_RATE", "0.05")),
        send_default_pii=False,
    )
```

`send_default_pii=False` reduz risco de enviar dados pessoais automaticamente.

---

## Captura Automática

Com integração FastAPI/Starlette, exceções não tratadas são capturadas automaticamente.

```python
from fastapi import FastAPI

app = FastAPI()


@app.get("/erro")
def erro():
    raise RuntimeError("falha inesperada")
```

O Sentry registra:

- stack trace;
- endpoint;
- ambiente;
- release;
- breadcrumbs;
- frequência;
- usuários afetados quando configurado.

---

## Captura Manual

Use captura manual quando você trata o erro mas ainda quer registrar.

```python
import sentry_sdk


try:
    gateway_pagamento.autorizar(pedido)
except TimeoutError as exc:
    sentry_sdk.capture_exception(exc)
    pedido.marcar_pagamento_pendente()
```

Capture com cuidado. Se o erro é esperado e frequente, talvez métrica seja melhor que issue.

---

## Contexto

Adicionar contexto melhora investigação.

```python
import sentry_sdk


def processar_pedido(pedido):
    sentry_sdk.set_tag("feature", "checkout")
    sentry_sdk.set_context(
        "pedido",
        {
            "pedido_id": str(pedido.id),
            "status": pedido.status,
            "total": str(pedido.total),
        },
    )
    confirmar(pedido)
```

Não coloque dados sensíveis em contexto.

---

## Usuário

```python
sentry_sdk.set_user(
    {
        "id": str(usuario.id),
        "segment": usuario.plano,
    }
)
```

Evite email e dados pessoais se não houver necessidade e base legal.

Saber usuários afetados ajuda priorização, mas privacidade vem primeiro.

---

## Tags

Tags são indexadas e úteis para filtro.

```python
sentry_sdk.set_tag("tenant", tenant_slug)
sentry_sdk.set_tag("payment_gateway", "provedor_x")
sentry_sdk.set_tag("worker", "celery")
```

Use tags de baixa cardinalidade. Não use request id ou IDs únicos como tag. Para valores únicos, prefira contexto.

---

## Breadcrumbs

Breadcrumbs são eventos que ocorreram antes do erro.

```python
sentry_sdk.add_breadcrumb(
    category="pedido",
    message="cupom aplicado",
    level="info",
    data={"cupom_tipo": "percentual"},
)
```

Eles ajudam a entender o caminho até a exceção.

---

## Releases

Configurar release é essencial.

```python
sentry_sdk.init(
    dsn=dsn,
    release="api-python@1.42.0",
    environment="production",
)
```

Com releases, o Sentry mostra:

- erros novos;
- regressões;
- commit suspeito;
- deploy que introduziu o problema;
- comparação entre versões.

Sem release, investigação perde contexto.

---

## Source Maps e Código Fonte

Em Python, stack trace já aponta arquivos e linhas. Em frontend, source maps são importantes para converter código minificado em código legível.

Para backend Python, garanta:

- release correta;
- imagem/container com versão rastreável;
- commits ligados ao release;
- stack trace sem paths inúteis;
- deploy registrado.

---

## Performance Monitoring

Sentry também mede transações lentas.

```python
sentry_sdk.init(
    dsn=dsn,
    traces_sample_rate=0.1,
)
```

Ele pode mostrar:

- duração de endpoints;
- spans de banco;
- chamadas HTTP;
- transações lentas;
- rotas com pior performance.

Para observabilidade avançada, integre com OpenTelemetry ou garanta correlação por trace id.

---

## Sampling

`traces_sample_rate=1.0` captura 100% das transações. Pode ser caro.

Estratégia:

- produção: amostra baixa inicial;
- staging: amostra maior;
- erros: capturar sempre que possível;
- rotas críticas: amostragem dinâmica;
- health checks: ignorar.

Exemplo:

```python
def traces_sampler(sampling_context):
    path = sampling_context.get("wsgi_environ", {}).get("PATH_INFO", "")
    if path == "/health":
        return 0.0
    if path == "/checkout":
        return 0.2
    return 0.05
```

---

## Filtros

Use `before_send` para remover dados ou ignorar erros.

```python
def before_send(event, hint):
    request = event.get("request", {})
    headers = request.get("headers", {})
    headers.pop("Authorization", None)

    if "request" in event:
        event["request"]["headers"] = headers

    return event


sentry_sdk.init(dsn=dsn, before_send=before_send)
```

Também é possível ignorar exceções conhecidas:

```python
sentry_sdk.init(
    dsn=dsn,
    ignore_errors=[KeyboardInterrupt],
)
```

Não ignore erro real para "limpar dashboard". Corrija a causa.

---

## Integração com Logging

Sentry pode capturar logs em nível `ERROR`.

```python
import logging

logger = logging.getLogger(__name__)


try:
    executar()
except Exception:
    logger.exception("falha_inesperada")
```

Dependendo da configuração, esse log vira issue no Sentry. Cuidado para não duplicar captura manual e logging automático.

---

## Celery e Workers

Sentry é útil em jobs assíncronos.

```bash
pip install "sentry-sdk[celery]"
```

Com integração, exceções em tasks podem ser capturadas com contexto.

Boas práticas:

- inclua task name;
- inclua retry count;
- registre fila;
- diferencie erro transitório de bug;
- monitore DLQ ou jobs mortos.

---

## Priorização

Nem toda issue tem a mesma prioridade.

Avalie:

- quantidade de usuários afetados;
- frequência;
- release de introdução;
- rota crítica;
- impacto financeiro;
- regressão;
- workaround;
- ambiente.

Um erro raro em checkout pode ser mais importante que muitos erros em uma rota interna pouco usada.

---

## Fluxo de Investigação

```text
1. Abrir issue
2. Verificar release e primeira ocorrencia
3. Ler stack trace
4. Conferir tags e contexto
5. Ver breadcrumbs
6. Abrir logs por trace/request id
7. Ver metricas no intervalo
8. Confirmar causa
9. Corrigir
10. Marcar como resolved na release
```

Sentry deve se conectar ao fluxo de desenvolvimento, não ser só uma caixa de erros.

---

## Erros Comuns

- não configurar release;
- enviar dados pessoais sem necessidade;
- usar tags com cardinalidade alta;
- capturar erro esperado como issue;
- duplicar eventos com logging e captura manual;
- ignorar sampling e custo;
- não separar ambientes;
- deixar DSN hardcoded;
- não integrar com deploy;
- nunca limpar issues antigas.

---

## Checklist Avançado

- DSN vem de variável de ambiente?
- `environment` e `release` estão configurados?
- Dados sensíveis são filtrados?
- Tags têm baixa cardinalidade?
- Performance monitoring tem sampling adequado?
- Workers também capturam erros?
- Issues são ligadas a releases/deploys?
- Há processo para triagem?
- Sentry é correlacionável com logs/traces?

Sentry é mais valioso quando mostra quais erros afetam usuários, quando começaram e qual mudança os introduziu. Ele não substitui métricas e traces; ele completa a visão de qualidade em produção.

