# Mocks, cobertura e CI

Isolar dependências externas, medir cobertura e rodar tudo no pipeline.

> **Tema:** Testes · **Nível:** intermediario · **Trilha:** Pytest Avançado e TDD

## Conceitos-chave

Nesta lição você vai entender:

- **monkeypatch e unittest.mock para isolar I/O**
- **pytest-cov mede cobertura de linhas/branches**
- **Marcadores para separar unit/integration**
- **Falhe o CI abaixo de um limite de cobertura**

## Exemplo prático

```python
def test_envia(monkeypatch):
    chamadas = []
    monkeypatch.setattr('app.smtp.send', lambda m: chamadas.append(m))
    notificar('oi')
    assert chamadas == ['oi']
```

Leia o exemplo linha a linha e rode-o no seu ambiente. Em seguida, altere os valores e observe o que muda — entender *por que* o código se comporta assim vale mais do que decorar a sintaxe.

## Boas práticas

- Mocke a borda (rede, disco), não a sua lógica
- Cobertura é um piso, não uma garantia de qualidade

## Pratique

Para fixar, escreva um pequeno script que combine **monkeypatch e unittest.mock para isolar i/o** e **pytest-cov mede cobertura de linhas/branches** em um caso do seu dia a dia. Depois refatore aplicando "Mocke a borda (rede, disco), não a sua lógica".

Desafio extra: explique, em uma frase, quando **não** usar esta abordagem — saber os limites de uma ferramenta é tão importante quanto saber usá-la.

## Checklist de domínio

Você domina esta lição quando consegue:

- [ ] Explicar e aplicar: monkeypatch e unittest.mock para isolar I/O
- [ ] Explicar e aplicar: pytest-cov mede cobertura de linhas/branches
- [ ] Explicar e aplicar: Marcadores para separar unit/integration
- [ ] Explicar e aplicar: Falhe o CI abaixo de um limite de cobertura

## Saiba mais

- [Documentação oficial](https://pytest-cov.readthedocs.io/)
