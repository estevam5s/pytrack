# Serverless: Funções, Containers Gerenciados e Trade-offs

Serverless é um modelo em que a plataforma gerencia servidores, escalabilidade básica, provisionamento e parte da operação. Você entrega código ou container, e o provedor cuida de executar sob demanda.

O nome "serverless" não significa ausência de servidores. Significa menos responsabilidade direta sobre servidores.

---

## Modelos Serverless

Principais modelos:

- **FaaS**: funções sob demanda, como AWS Lambda, Google Cloud Functions e Azure Functions.
- **Containers gerenciados**: Cloud Run, AWS App Runner, Azure Container Apps.
- **Backend gerenciado**: filas, bancos, autenticação, storage e eventos.

Para Python, serverless pode rodar APIs, workers, processamentos assíncronos, webhooks e tarefas event-driven.

---

## Quando Usar

Serverless faz sentido quando:

- tráfego é variável;
- você quer reduzir operação de servidores;
- eventos acionam processamento;
- jobs são curtos;
- time é pequeno;
- custo por uso é vantajoso;
- escalabilidade automática é importante.

Evite quando:

- latência fria é inaceitável;
- processamento é longo e constante;
- há dependência forte de runtime específico;
- custo por uso fica maior em alta carga constante;
- você precisa de controle fino de rede e sistema;
- há risco alto de lock-in.

---

## Função Simples

Exemplo conceitual de handler:

```python
def handler(event, context):
    nome = event.get("nome", "mundo")
    return {
        "statusCode": 200,
        "body": f"Olá, {nome}",
    }
```

Em FaaS, a plataforma chama `handler` quando ocorre evento HTTP, fila, cron, storage ou outro gatilho.

---

## FastAPI em Serverless

É possível adaptar FastAPI para Lambda com Mangum:

```bash
pip install fastapi mangum
```

```python
from fastapi import FastAPI
from mangum import Mangum

app = FastAPI()


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


handler = Mangum(app)
```

Funciona bem para APIs pequenas/médias, mas avalie cold start, tamanho do pacote e integração com API Gateway.

---

## Containers Gerenciados

Plataformas como Cloud Run executam container HTTP:

```dockerfile
FROM python:3.12-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY app ./app

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8080"]
```

A plataforma injeta porta, escala instâncias e roteia tráfego.

Vantagem: você mantém Docker padrão e reduz operação de cluster.

---

## Cold Start

Cold start é o tempo para iniciar ambiente antes de atender requisição.

Fatores:

- tamanho do pacote/imagem;
- linguagem/runtime;
- importações pesadas;
- inicialização de clientes;
- VPC/rede;
- memória configurada;
- dependências nativas.

Reduza:

- pacote menor;
- imports sob demanda quando adequado;
- conexão preguiçosa;
- evitar inicialização pesada;
- provisioned concurrency quando necessário.

---

## Stateless

Serverless exige stateless:

- não dependa de arquivo local persistente;
- não guarde sessão em memória;
- use banco/cache/storage externo;
- trate execução duplicada;
- projete idempotência.

Filesystem temporário pode existir, mas não deve guardar dado crítico.

---

## Idempotência

Eventos podem ser reentregues.

```python
def processar_pagamento(event):
    event_id = event["id"]

    if eventos_repo.ja_processado(event_id):
        return {"status": "ignored"}

    pagamento.autorizar(event["pedido_id"])
    eventos_repo.marcar_processado(event_id)
    return {"status": "ok"}
```

Sem idempotência, retries podem gerar cobrança duplicada, email duplicado ou estado incorreto.

---

## Timeouts e Retries

Cada plataforma tem limite de execução.

Cuidados:

- configure timeout menor que o limite externo;
- use retry com backoff;
- envie falhas para DLQ;
- não deixe função pendurada;
- diferencie erro transitório de erro definitivo.

Exemplo:

```text
evento -> funcao -> falha temporaria
  -> retry com backoff
  -> DLQ apos tentativas
```

---

## Banco de Dados

Serverless pode abrir muitas conexões rapidamente.

Riscos:

- esgotar conexões do PostgreSQL;
- criar conexão a cada invocação;
- latência alta;
- custo inesperado.

Soluções:

- connection pooling gerenciado;
- proxy de banco;
- limitar concorrência;
- reaproveitar cliente global;
- usar banco serverless adequado quando fizer sentido.

Cliente global:

```python
db_client = criar_cliente()


def handler(event, context):
    return db_client.query(...)
```

O runtime pode reutilizar ambiente entre invocações.

---

## Configuração e Segredos

Use variáveis de ambiente e secret manager:

```python
import os

DATABASE_URL = os.environ["DATABASE_URL"]
```

Não empacote segredos no código, layer ou imagem.

---

## Observabilidade

Serverless precisa de:

- logs estruturados;
- métricas de invocação;
- erros;
- duração;
- cold starts;
- throttling;
- retries;
- DLQ;
- custo;
- traces distribuídos.

Em serverless, custo é métrica operacional.

---

## Deploy

Ferramentas comuns:

- Serverless Framework;
- AWS SAM;
- Terraform;
- Pulumi;
- CDK;
- gcloud/Cloud Run deploy;
- GitHub Actions;
- GitLab CI.

Deploy deve ser automatizado e reproduzível. Console manual é aceitável para experimento, não para produção madura.

---

## Versionamento e Tráfego

Plataformas serverless frequentemente permitem:

- versões;
- aliases;
- traffic splitting;
- canary;
- rollback.

Exemplo:

```text
95% trafego -> versao atual
5% trafego -> nova versao
```

Monitore erros antes de aumentar.

---

## Custos

Serverless pode ser barato com baixa utilização e caro com uso constante.

Custos comuns:

- número de invocações;
- duração;
- memória;
- tráfego;
- API Gateway;
- logs;
- storage;
- filas;
- banco;
- observabilidade.

Logs excessivos em serverless podem custar caro.

---

## Lock-in

Serverless usa serviços específicos do provedor.

Reduza lock-in quando importante:

- isole handlers finos;
- coloque regra em módulos puros;
- use adapters para serviços externos;
- automatize infra com IaC;
- documente eventos e contratos.

Não exagere em abstração se o produto se beneficia claramente do provedor.

---

## Erros Comuns

- ignorar cold start;
- não tratar duplicidade de eventos;
- abrir conexão demais no banco;
- colocar regra inteira no handler;
- não configurar DLQ;
- não monitorar custo;
- empacotar dependências enormes;
- usar serverless para carga constante sem análise;
- depender de disco local;
- fazer deploy manual pelo console.

---

## Checklist Avançado

- Funções são idempotentes?
- Timeouts e retries estão configurados?
- DLQ existe para eventos?
- Cold start foi medido?
- Banco suporta concorrência?
- Segredos vêm de secret manager?
- Logs e traces são correlacionáveis?
- Custo é monitorado?
- Deploy é automatizado?
- Há rollback ou traffic splitting?

Serverless é excelente quando reduz operação sem esconder requisitos críticos. O segredo é desenhar para eventos, idempotência, limites da plataforma e observabilidade desde o início.

