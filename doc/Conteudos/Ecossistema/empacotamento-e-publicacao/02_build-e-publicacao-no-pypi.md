# Build e publicação no PyPI

Gere e publique distribuições.

## Pontos-chave

- build gera wheel e sdist
- twine para enviar ao PyPI
- Teste no TestPyPI
- CI para publicar em tags

## Exemplo

```python
# python -m build
# twine upload dist/*
# pip install meu-pacote
```

## Boas práticas

- Publique a partir do CI em tags
- Assine/valide artefatos

## Saiba mais

- [Documentação oficial](https://packaging.python.org/en/latest/tutorials/packaging-projects/)
