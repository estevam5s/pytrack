# Princípios de código limpo

Escreva código legível, simples e fácil de manter.

## Pontos-chave

- Nomes claros e intenção explícita
- Funções pequenas e coesas
- Evite duplicação real (DRY)
- KISS e YAGNI

## Exemplo

```python
# ruim
d = {}
for x in l:
    d[x[0]] = x[1]
# bom
usuarios_por_id = {u.id: u for u in usuarios}
```

## Boas práticas

- Otimize para leitura
- Comente o porquê, não o quê

## Saiba mais

- [Documentação oficial](https://docs.python-guide.org/)
