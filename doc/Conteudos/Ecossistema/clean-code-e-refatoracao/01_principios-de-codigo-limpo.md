# Princípios de código limpo

Escreva código legível, simples e fácil de manter.

> **Tema:** Qualidade · **Nível:** intermediario · **Trilha:** Clean Code e Refatoração

## Conceitos-chave

Nesta lição você vai entender:

- **Nomes claros e intenção explícita**
- **Funções pequenas e coesas**
- **Evite duplicação real (DRY)**
- **KISS e YAGNI**

## Exemplo prático

```python
# ruim
d = {}
for x in l:
    d[x[0]] = x[1]
# bom
usuarios_por_id = {u.id: u for u in usuarios}
```

Leia o exemplo linha a linha e rode-o no seu ambiente. Em seguida, altere os valores e observe o que muda — entender *por que* o código se comporta assim vale mais do que decorar a sintaxe.

## Boas práticas

- Otimize para leitura
- Comente o porquê, não o quê

## Pratique

Para fixar, escreva um pequeno script que combine **nomes claros e intenção explícita** e **funções pequenas e coesas** em um caso do seu dia a dia. Depois refatore aplicando "Otimize para leitura".

Desafio extra: explique, em uma frase, quando **não** usar esta abordagem — saber os limites de uma ferramenta é tão importante quanto saber usá-la.

## Checklist de domínio

Você domina esta lição quando consegue:

- [ ] Explicar e aplicar: Nomes claros e intenção explícita
- [ ] Explicar e aplicar: Funções pequenas e coesas
- [ ] Explicar e aplicar: Evite duplicação real (DRY)
- [ ] Explicar e aplicar: KISS e YAGNI

## Saiba mais

- [Documentação oficial](https://docs.python-guide.org/)
