# Mocks e cobertura

Isole dependências e meça o que é testado.

> **Tema:** Testes · **Nível:** intermediario · **Trilha:** Pytest Avançado

## Conceitos-chave

Nesta lição você vai entender:

- **unittest.mock e monkeypatch**
- **responses/respx para HTTP**
- **pytest-cov para cobertura**
- **freezegun para tempo**

## Exemplo prático

```python
def test_api(mocker):
    mock = mocker.patch('app.buscar', return_value=42)
    assert processar() == 42
    mock.assert_called_once()
```

Leia o exemplo linha a linha e rode-o no seu ambiente. Em seguida, altere os valores e observe o que muda — entender *por que* o código se comporta assim vale mais do que decorar a sintaxe.

## Boas práticas

- Mocke nas fronteiras (I/O)
- Cobertura é sinal, não meta

## Pratique

Para fixar, escreva um pequeno script que combine **unittest.mock e monkeypatch** e **responses/respx para http** em um caso do seu dia a dia. Depois refatore aplicando "Mocke nas fronteiras (I/O)".

Desafio extra: explique, em uma frase, quando **não** usar esta abordagem — saber os limites de uma ferramenta é tão importante quanto saber usá-la.

## Checklist de domínio

Você domina esta lição quando consegue:

- [ ] Explicar e aplicar: unittest.mock e monkeypatch
- [ ] Explicar e aplicar: responses/respx para HTTP
- [ ] Explicar e aplicar: pytest-cov para cobertura
- [ ] Explicar e aplicar: freezegun para tempo

## Saiba mais

- [Documentação oficial](https://pytest-cov.readthedocs.io/)
