# Build e publicação no PyPI

Gere e publique distribuições.

> **Tema:** Packaging · **Nível:** intermediario · **Trilha:** Empacotamento e Publicação

## Conceitos-chave

Nesta lição você vai entender:

- **build gera wheel e sdist**
- **twine para enviar ao PyPI**
- **Teste no TestPyPI**
- **CI para publicar em tags**

## Exemplo prático

```python
# python -m build
# twine upload dist/*
# pip install meu-pacote
```

Leia o exemplo linha a linha e rode-o no seu ambiente. Em seguida, altere os valores e observe o que muda — entender *por que* o código se comporta assim vale mais do que decorar a sintaxe.

## Boas práticas

- Publique a partir do CI em tags
- Assine/valide artefatos

## Pratique

Para fixar, escreva um pequeno script que combine **build gera wheel e sdist** e **twine para enviar ao pypi** em um caso do seu dia a dia. Depois refatore aplicando "Publique a partir do CI em tags".

Desafio extra: explique, em uma frase, quando **não** usar esta abordagem — saber os limites de uma ferramenta é tão importante quanto saber usá-la.

## Checklist de domínio

Você domina esta lição quando consegue:

- [ ] Explicar e aplicar: build gera wheel e sdist
- [ ] Explicar e aplicar: twine para enviar ao PyPI
- [ ] Explicar e aplicar: Teste no TestPyPI
- [ ] Explicar e aplicar: CI para publicar em tags

## Saiba mais

- [Documentação oficial](https://packaging.python.org/en/latest/tutorials/packaging-projects/)
