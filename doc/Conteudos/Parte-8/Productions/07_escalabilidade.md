# Escalabilidade: Capacidade, Gargalos e Arquitetura de Crescimento

Escalabilidade é a capacidade de um sistema crescer em volume de usuários, requisições, dados ou processamento mantendo desempenho, custo e confiabilidade aceitáveis.

Escalar não significa apenas "adicionar servidores". Antes de escalar, é preciso medir, entender gargalos, remover desperdícios e escolher a estratégia correta.

---

## Conceitos Essenciais

- **Carga**: volume de trabalho, como req/s, jobs/min ou mensagens/s.
- **Capacidade**: quanto o sistema suporta dentro de limites aceitáveis.
- **Latência**: tempo de resposta.
- **Throughput**: quantidade processada por tempo.
- **Saturação**: recurso chegando ao limite.
- **Gargalo**: parte que limita o sistema.
- **Backpressure**: mecanismo para controlar entrada quando saída não acompanha.

---

## Escala Vertical e Horizontal

### Vertical

Aumentar recursos da máquina:

```text
2 CPU / 4 GB -> 8 CPU / 16 GB
```

Vantagens:

- simples;
- poucas mudanças arquiteturais;
- bom para começo.

Limites:

- teto físico;
- custo cresce rápido;
- ponto único de falha continua.

### Horizontal

Adicionar instâncias:

```text
app-1
app-2
app-3
```

Vantagens:

- alta disponibilidade;
- expansão gradual;
- melhor tolerância a falhas.

Exige:

- aplicação stateless;
- balanceamento;
- sessões externas;
- storage compartilhado;
- observabilidade.

---

## Medir Antes de Escalar

Métricas mínimas:

- RPS;
- latência p50/p95/p99;
- taxa de erro;
- CPU;
- memória;
- conexões;
- queries lentas;
- cache hit ratio;
- tamanho de fila;
- tempo de jobs;
- custo.

Sem métricas, escalar vira tentativa.

---

## Teste de Carga

Ferramentas:

- k6;
- Locust;
- JMeter;
- Vegeta;
- wrk.

Exemplo com k6:

```javascript
import http from "k6/http";
import { sleep } from "k6";

export const options = {
  vus: 50,
  duration: "2m",
};

export default function () {
  http.get("https://api.exemplo.com/health");
  sleep(1);
}
```

Teste de carga deve simular fluxo real, não apenas `/health`.

---

## Aplicação Stateless

Para escalar horizontalmente:

- não guarde sessão em memória local;
- não grave upload em disco local;
- não dependa de cache local para consistência;
- não execute jobs duplicados sem trava;
- use banco, Redis, fila ou storage externo.

Ruim:

```text
usuario logado apenas em app-1
```

Melhor:

```text
sessao no Redis ou token assinado
```

---

## Banco de Dados

Banco costuma virar gargalo.

Estratégias:

- índices corretos;
- queries otimizadas;
- connection pooling;
- read replicas;
- particionamento;
- arquivamento;
- cache;
- evitar N+1;
- reduzir transações longas;
- separar leitura pesada.

Antes de escalar banco, leia planos de execução.

Exemplo de problema:

```text
endpoint lista pedidos
para cada pedido busca cliente
100 pedidos -> 101 queries
```

Use joins, prefetch/selectinload ou consulta projetada.

---

## Connection Pool

Cada instância da aplicação abre conexões.

```text
10 pods x pool 20 = 200 conexoes
```

Se o PostgreSQL suporta 100, você terá falhas.

Calcule pool por instância:

```text
max_conexoes_disponiveis / numero_de_instancias
```

Use PgBouncer quando necessário.

---

## Cache

Cache reduz latência e carga.

Tipos:

- cache HTTP;
- CDN;
- Redis;
- cache em memória;
- cache de query;
- materialized views;
- cache de objeto.

Estratégias:

- TTL;
- cache aside;
- write-through;
- write-behind;
- invalidação por evento;
- stale-while-revalidate.

Problema difícil: invalidação. Cache errado pode ser pior que cache ausente.

---

## CDN

CDN ajuda em:

- arquivos estáticos;
- imagens;
- downloads;
- frontend;
- cache HTTP;
- proteção DDoS básica;
- redução de latência global.

APIs também podem se beneficiar quando respostas são cacheáveis.

Headers:

```http
Cache-Control: public, max-age=3600
ETag: "abc123"
```

Não cacheie resposta privada como pública.

---

## Filas e Processamento Assíncrono

Use fila quando:

- tarefa é lenta;
- pode ser processada depois;
- precisa absorver pico;
- integração externa é instável;
- envio de email, relatório ou imagem demora.

Arquitetura:

```text
API -> fila -> workers
```

Monitore:

- tamanho da fila;
- idade da mensagem mais antiga;
- taxa de processamento;
- falhas;
- retries;
- DLQ.

Fila sem monitoramento apenas esconde problema.

---

## Backpressure

Quando sistema está saturado, ele deve controlar entrada.

Técnicas:

- rate limiting;
- filas com limite;
- rejeição controlada;
- circuit breaker;
- timeout curto;
- resposta 429/503;
- degradação graciosa.

Sem backpressure, um pico pode derrubar tudo.

---

## Autoscaling

Autoscaling pode usar:

- CPU;
- memória;
- RPS;
- latência;
- tamanho de fila;
- métricas customizadas.

CPU nem sempre é boa métrica. Aplicação I/O-bound pode estar lenta com CPU baixa.

Autoscaling precisa de:

- limites mínimos e máximos;
- tempo de estabilização;
- readiness;
- capacidade do banco;
- custo controlado.

---

## Escalabilidade de Escrita

Escrita é mais difícil que leitura.

Estratégias:

- reduzir transações;
- agrupar writes;
- particionar dados;
- sharding;
- filas;
- event sourcing quando fizer sentido;
- consistência eventual;
- modelos CQRS.

Sharding é caro operacionalmente. Use apenas quando alternativas acabaram.

---

## Consistência

Escalabilidade frequentemente troca consistência imediata por disponibilidade ou latência.

Perguntas:

- este dado precisa ser imediato?
- usuário aceita atraso?
- duplicidade é tolerável?
- operação é idempotente?
- existe compensação?

Exemplo:

```text
checkout: consistencia forte no pagamento
analytics: consistencia eventual aceitavel
```

---

## Degradação Graciosa

Quando dependência falha, o sistema pode continuar parcialmente.

Exemplos:

- ocultar recomendações;
- usar cache antigo;
- enfileirar email;
- mostrar status pendente;
- desabilitar feature temporariamente.

Nem todo erro precisa derrubar fluxo principal.

---

## Custo

Escalabilidade sem controle financeiro é incompleta.

Monitore:

- custo por requisição;
- custo por cliente;
- custo por job;
- tráfego;
- armazenamento;
- logs;
- métricas;
- egress;
- instâncias ociosas.

O sistema precisa escalar tecnicamente e economicamente.

---

## Erros Comuns

- escalar sem medir;
- otimizar prematuramente;
- ignorar banco;
- usar cache sem invalidação;
- abrir conexões demais;
- não monitorar filas;
- tratar CPU como única métrica;
- manter estado local;
- não fazer teste de carga;
- confundir alta disponibilidade com escalabilidade.

---

## Checklist Avançado

- Gargalos são conhecidos por métricas?
- p95/p99 estão dentro do objetivo?
- Aplicação é stateless?
- Banco tem índices e pool corretos?
- Cache tem estratégia de invalidação?
- Filas têm DLQ e alertas?
- Autoscaling usa métrica adequada?
- Backpressure existe?
- Custo por unidade é acompanhado?
- Testes de carga simulam uso real?

Escalabilidade é um processo contínuo de medição, hipótese, mudança e validação. A melhor estratégia é remover o gargalo real, não aplicar a tecnologia mais complexa disponível.

