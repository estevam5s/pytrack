# Logging estruturado

Registre eventos de forma útil para operar em produção.

> **Tema:** Observabilidade · **Nível:** intermediario · **Trilha:** Logging e Configuração

## Conceitos-chave

Nesta lição você vai entender:

- **Níveis (DEBUG..CRITICAL) e handlers**
- **Formatação e arquivos rotativos**
- **structlog/loguru para logs estruturados**
- **Correlation id em serviços web**

## Exemplo prático

```python
import logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s %(levelname)s %(message)s')
log = logging.getLogger(__name__)
log.info('app iniciada', extra={'user': 42})
```

Leia o exemplo linha a linha e rode-o no seu ambiente. Em seguida, altere os valores e observe o que muda — entender *por que* o código se comporta assim vale mais do que decorar a sintaxe.

## Boas práticas

- Não logue segredos
- Use níveis adequados

## Pratique

Para fixar, escreva um pequeno script que combine **níveis (debug..critical) e handlers** e **formatação e arquivos rotativos** em um caso do seu dia a dia. Depois refatore aplicando "Não logue segredos".

Desafio extra: explique, em uma frase, quando **não** usar esta abordagem — saber os limites de uma ferramenta é tão importante quanto saber usá-la.

## Checklist de domínio

Você domina esta lição quando consegue:

- [ ] Explicar e aplicar: Níveis (DEBUG..CRITICAL) e handlers
- [ ] Explicar e aplicar: Formatação e arquivos rotativos
- [ ] Explicar e aplicar: structlog/loguru para logs estruturados
- [ ] Explicar e aplicar: Correlation id em serviços web

## Saiba mais

- [Documentação oficial](https://docs.python.org/3/library/logging.html)
