# Logging estruturado

Registre eventos de forma útil para operar em produção.

## Pontos-chave

- Níveis (DEBUG..CRITICAL) e handlers
- Formatação e arquivos rotativos
- structlog/loguru para logs estruturados
- Correlation id em serviços web

## Exemplo

```python
import logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s %(levelname)s %(message)s')
log = logging.getLogger(__name__)
log.info('app iniciada', extra={'user': 42})
```

## Boas práticas

- Não logue segredos
- Use níveis adequados

## Saiba mais

- [Documentação oficial](https://docs.python.org/3/library/logging.html)
