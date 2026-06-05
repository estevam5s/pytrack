# Dados IoT: Séries Temporais, Dashboards, Alertas e Observabilidade

IoT gera dados ao longo do tempo. Temperatura, umidade, energia, vibração, status e eventos são séries temporais ou eventos de dispositivo. Sem modelagem, retenção e observabilidade, o sistema acumula dados difíceis de consultar e operar.

---

## Tipos de Dados IoT

- **telemetria**: medições frequentes;
- **eventos**: porta abriu, motor falhou, alarme disparou;
- **estado**: online/offline, relé ligado, modo atual;
- **comandos**: instruções enviadas;
- **respostas**: resultado de comandos;
- **logs de dispositivo**: mensagens de diagnóstico;
- **metadados**: localização, modelo, firmware, cliente.

Cada tipo tem retenção, consulta e criticidade diferentes.

---

## Modelagem de Série Temporal

Formato flexível:

```text
telemetry
├── device_id
├── timestamp
├── metric
├── value
└── unit
```

Exemplo:

```text
device_id=estufa-001
timestamp=2026-05-16T22:00:00Z
metric=temperature_c
value=27.4
unit=celsius
```

Vantagens:

- aceita novas métricas;
- bom para dashboards genéricos;
- fácil agregar por métrica.

Desvantagens:

- consultas podem ser mais complexas;
- validação por métrica precisa ser externa;
- joins/pivots podem ser caros.

---

## Bancos de Dados

Opções comuns:

- PostgreSQL: ótimo geral, pode lidar bem com volume moderado;
- TimescaleDB: extensão de séries temporais para PostgreSQL;
- InfluxDB: banco especializado em séries temporais;
- ClickHouse: analítico colunar para alto volume;
- Redis: estado atual/cache, não histórico principal;
- SQLite: local/gateway/edge;
- object storage: histórico bruto barato.

Escolha depende de volume, consultas, retenção, equipe e operação.

---

## PostgreSQL para IoT

Tabela:

```sql
CREATE TABLE telemetry (
    id BIGSERIAL PRIMARY KEY,
    device_id VARCHAR(80) NOT NULL,
    timestamp TIMESTAMPTZ NOT NULL,
    metric VARCHAR(80) NOT NULL,
    value DOUBLE PRECISION NOT NULL,
    unit VARCHAR(20) NOT NULL
);

CREATE INDEX idx_telemetry_device_time
ON telemetry (device_id, timestamp DESC);

CREATE INDEX idx_telemetry_metric_time
ON telemetry (metric, timestamp DESC);
```

Consulta:

```sql
SELECT
    date_trunc('minute', timestamp) AS minute,
    avg(value) AS avg_temperature
FROM telemetry
WHERE device_id = 'estufa-001'
  AND metric = 'temperature_c'
  AND timestamp >= now() - interval '24 hours'
GROUP BY minute
ORDER BY minute;
```

---

## Retenção e Downsampling

Guardar tudo para sempre pode ser caro.

Estratégia:

```text
dado bruto: 30 dias
agregado por minuto: 6 meses
agregado por hora: 5 anos
```

Downsampling:

```sql
SELECT
    device_id,
    metric,
    date_trunc('hour', timestamp) AS bucket,
    avg(value) AS avg_value,
    min(value) AS min_value,
    max(value) AS max_value
FROM telemetry
GROUP BY device_id, metric, bucket;
```

Retenção deve estar alinhada a produto, auditoria e custo.

---

## Qualidade de Dados

Problemas comuns:

- leitura impossível;
- sensor travado;
- timestamp errado;
- duplicidade;
- buracos na série;
- unidade inconsistente;
- firmware com bug;
- drift de calibração.

Valide:

```python
def validate_temperature(value: float) -> bool:
    return -40 <= value <= 85
```

Marque qualidade:

```text
quality = ok | suspicious | invalid | estimated
```

Não apague silenciosamente dado ruim sem registro.

---

## Estado Atual

Para dashboards operacionais, mantenha estado atual separado:

```text
device_status
├── device_id
├── online
├── last_seen_at
├── battery_pct
├── firmware_version
├── last_rssi
└── updated_at
```

Calcular estado atual sempre a partir do histórico pode ser caro.

---

## Alertas

Tipos:

- temperatura acima do limite;
- dispositivo offline;
- bateria baixa;
- sensor sem variação por muito tempo;
- falha de comando;
- aumento de erros de payload;
- fila de ingestão crescendo;
- broker sem conexão.

Exemplo de regra:

```python
def check_temperature_alert(reading) -> bool:
    return reading.metric == "temperature_c" and reading.value > 35
```

Alertas precisam de deduplicação e janela de tempo para evitar ruído.

---

## Dashboards

Um dashboard IoT deve mostrar:

- dispositivos online/offline;
- mapa/localização quando relevante;
- últimas leituras;
- séries históricas;
- alertas ativos;
- bateria;
- firmware;
- qualidade de sinal;
- volume de mensagens;
- falhas de ingestão.

Ferramentas:

- Grafana;
- Superset;
- Metabase;
- dashboards customizados;
- Streamlit para protótipos.

---

## Métricas Operacionais

Monitore:

- mensagens por segundo;
- atraso de ingestão;
- payloads inválidos;
- dispositivos offline;
- latência do broker;
- tempo de escrita no banco;
- tamanho da fila;
- falhas por firmware;
- comandos pendentes;
- comandos com timeout.

Essas métricas são tão importantes quanto CPU e memória.

---

## Logs de Dispositivo

Dispositivos podem enviar logs, mas cuidado com volume.

Payload:

```json
{
  "device_id": "esp32-001",
  "level": "warning",
  "event": "wifi_reconnect",
  "message": "reconnecting after timeout",
  "firmware_version": "1.2.0"
}
```

Não envie logs verbosos continuamente de dispositivos limitados.

---

## Correlação

Inclua IDs:

- `device_id`;
- `message_id`;
- `command_id`;
- `firmware_version`;
- `gateway_id`;
- `site_id`;
- `customer_id`.

Isso permite investigar:

```text
Comando falhou -> qual firmware? qual local? qual gateway? qual sinal?
```

---

## Erros Comuns

- armazenar telemetria sem índice;
- não ter retenção;
- misturar estado atual e histórico sem critério;
- não medir atraso de ingestão;
- alertar a cada leitura ruim;
- não detectar sensor travado;
- salvar unidade inconsistente;
- não versionar firmware nos dados;
- depender só de dashboard sem alerta.

---

## Checklist

- Dados têm timestamp confiável?
- Existe índice por dispositivo e tempo?
- Retenção está definida?
- Há agregações/downsampling?
- Estado atual é consultável rapidamente?
- Alertas têm deduplicação?
- Payload inválido é monitorado?
- Dashboards mostram saúde dos dispositivos?
- Firmware aparece nos dados?

Dados IoT têm valor quando são confiáveis, consultáveis e acionáveis. O desafio não é só armazenar medições, mas transformar medições em operação e decisão.

