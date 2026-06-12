# Checagem estática de tipos

mypy encontra erros de tipo antes da execução.

## Pontos-chave

- Type hints graduais (gradual typing)
- mypy --strict para rigor máximo
- Protocolos e generics tipados
- Stubs para libs sem tipos

## Exemplo

```python
def media(notas: list[float]) -> float:
    return sum(notas) / len(notas)

# mypy aponta: media(['a'])  -> erro de tipo
```

## Boas práticas

- Ative o modo strict em código novo
- Trate avisos do mypy como erros no CI

## Saiba mais

- [Documentação oficial](https://mypy.readthedocs.io/)
