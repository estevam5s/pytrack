# Observabilidade e custos

Monitore, registre e controle os custos de aplicações na nuvem.

> **Tema:** Cloud · **Nível:** avancado · **Trilha:** Cloud e Serverless

## Conceitos-chave

Nesta lição você vai entender:

- **Logs estruturados (JSON) centralizados**
- **Métricas e traces (OpenTelemetry)**
- **Alertas baseados em SLO**
- **FinOps: monitore e otimize gastos**

## Exemplo prático

```python
import logging, json
logging.basicConfig(level=logging.INFO)
logging.info(json.dumps({'evento': 'pedido', 'id': 123, 'valor': 99.9}))
```

Leia o exemplo linha a linha e rode-o no seu ambiente. Em seguida, altere os valores e observe o que muda — entender *por que* o código se comporta assim vale mais do que decorar a sintaxe.

## Boas práticas

- Defina alertas antes do incidente
- Marque recursos com tags para rastrear custo

## Pratique

Para fixar, escreva um pequeno script que combine **logs estruturados (json) centralizados** e **métricas e traces (opentelemetry)** em um caso do seu dia a dia. Depois refatore aplicando "Defina alertas antes do incidente".

Desafio extra: explique, em uma frase, quando **não** usar esta abordagem — saber os limites de uma ferramenta é tão importante quanto saber usá-la.

## Checklist de domínio

Você domina esta lição quando consegue:

- [ ] Explicar e aplicar: Logs estruturados (JSON) centralizados
- [ ] Explicar e aplicar: Métricas e traces (OpenTelemetry)
- [ ] Explicar e aplicar: Alertas baseados em SLO
- [ ] Explicar e aplicar: FinOps: monitore e otimize gastos

## Saiba mais

- [Documentação oficial](https://opentelemetry.io/docs/languages/python/)
