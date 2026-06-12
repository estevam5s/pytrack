# CI/CD para machine learning

Automatizar treino, teste e deploy de modelos com qualidade.

> **Tema:** MLOps · **Nível:** avancado · **Trilha:** MLOps: Deploy e Serving de Modelos

## Conceitos-chave

Nesta lição você vai entender:

- **Pipelines que treinam e validam automaticamente**
- **Testes de dados (schema, distribuição)**
- **Gate de métrica: só promove se melhorar**
- **Rollback rápido quando o modelo degrada**

## Exemplo prático

```python
# pseudo-pipeline
# 1. validar dados  2. treinar  3. avaliar
# 4. if metrica > baseline: registrar e promover
assert acc >= baseline_acc, 'modelo pior que o atual'
```

Leia o exemplo linha a linha e rode-o no seu ambiente. Em seguida, altere os valores e observe o que muda — entender *por que* o código se comporta assim vale mais do que decorar a sintaxe.

## Boas práticas

- Teste os dados, não só o código
- Tenha um caminho de rollback sempre pronto

## Pratique

Para fixar, escreva um pequeno script que combine **pipelines que treinam e validam automaticamente** e **testes de dados (schema, distribuição)** em um caso do seu dia a dia. Depois refatore aplicando "Teste os dados, não só o código".

Desafio extra: explique, em uma frase, quando **não** usar esta abordagem — saber os limites de uma ferramenta é tão importante quanto saber usá-la.

## Checklist de domínio

Você domina esta lição quando consegue:

- [ ] Explicar e aplicar: Pipelines que treinam e validam automaticamente
- [ ] Explicar e aplicar: Testes de dados (schema, distribuição)
- [ ] Explicar e aplicar: Gate de métrica: só promove se melhorar
- [ ] Explicar e aplicar: Rollback rápido quando o modelo degrada

## Saiba mais

- [Documentação oficial](https://ml-ops.org/)
