# Regex com o módulo re

Encontre e extraia padrões em texto.

> **Tema:** Regex · **Nível:** intermediario · **Trilha:** Expressões Regulares

## Conceitos-chave

Nesta lição você vai entender:

- **search, match, findall e sub**
- **Grupos e grupos nomeados**
- **Classes, quantificadores e âncoras**
- **Compilação de padrões**

## Exemplo prático

```python
import re
texto = 'tel: (11) 99999-8888'
m = re.search(r'\((\d{2})\)\s*(\d{4,5})-(\d{4})', texto)
print(m.groups())
```

Leia o exemplo linha a linha e rode-o no seu ambiente. Em seguida, altere os valores e observe o que muda — entender *por que* o código se comporta assim vale mais do que decorar a sintaxe.

## Boas práticas

- Compile padrões reutilizados
- Evite regex para parsear HTML/JSON

## Pratique

Para fixar, escreva um pequeno script que combine **search, match, findall e sub** e **grupos e grupos nomeados** em um caso do seu dia a dia. Depois refatore aplicando "Compile padrões reutilizados".

Desafio extra: explique, em uma frase, quando **não** usar esta abordagem — saber os limites de uma ferramenta é tão importante quanto saber usá-la.

## Checklist de domínio

Você domina esta lição quando consegue:

- [ ] Explicar e aplicar: search, match, findall e sub
- [ ] Explicar e aplicar: Grupos e grupos nomeados
- [ ] Explicar e aplicar: Classes, quantificadores e âncoras
- [ ] Explicar e aplicar: Compilação de padrões

## Saiba mais

- [Documentação oficial](https://docs.python.org/3/library/re.html)
