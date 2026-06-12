# Logs, métricas e traces

Os três pilares para entender sistemas em produção.

> **Tema:** Observabilidade · **Nível:** avancado · **Trilha:** Observabilidade com OpenTelemetry

## Conceitos-chave

Nesta lição você vai entender:

- **Logs estruturados em JSON**
- **Métricas (contadores, histogramas)**
- **Traces distribuídos com spans**
- **Correlação por trace_id**

## Exemplo prático

```python
from opentelemetry import trace

tracer = trace.get_tracer(__name__)

with tracer.start_as_current_span('processar_pedido'):
    # ... lógica instrumentada ...
    pass
```

Leia o exemplo linha a linha e rode-o no seu ambiente. Em seguida, altere os valores e observe o que muda — entender *por que* o código se comporta assim vale mais do que decorar a sintaxe.

## Boas práticas

- Padronize logs estruturados desde o início
- Propague o contexto entre serviços

## Pratique

Para fixar, escreva um pequeno script que combine **logs estruturados em json** e **métricas (contadores, histogramas)** em um caso do seu dia a dia. Depois refatore aplicando "Padronize logs estruturados desde o início".

Desafio extra: explique, em uma frase, quando **não** usar esta abordagem — saber os limites de uma ferramenta é tão importante quanto saber usá-la.

## Checklist de domínio

Você domina esta lição quando consegue:

- [ ] Explicar e aplicar: Logs estruturados em JSON
- [ ] Explicar e aplicar: Métricas (contadores, histogramas)
- [ ] Explicar e aplicar: Traces distribuídos com spans
- [ ] Explicar e aplicar: Correlação por trace_id

## Saiba mais

- [Documentação oficial](https://opentelemetry.io/docs/languages/python/)
