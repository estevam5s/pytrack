# Mocks e cobertura

Isole dependências e meça o que é testado.

## Pontos-chave

- unittest.mock e monkeypatch
- responses/respx para HTTP
- pytest-cov para cobertura
- freezegun para tempo

## Exemplo

```python
def test_api(mocker):
    mock = mocker.patch('app.buscar', return_value=42)
    assert processar() == 42
    mock.assert_called_once()
```

## Boas práticas

- Mocke nas fronteiras (I/O)
- Cobertura é sinal, não meta

## Saiba mais

- [Documentação oficial](https://pytest-cov.readthedocs.io/)
