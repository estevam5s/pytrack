# Regex com o módulo re

Encontre e extraia padrões em texto.

## Pontos-chave

- search, match, findall e sub
- Grupos e grupos nomeados
- Classes, quantificadores e âncoras
- Compilação de padrões

## Exemplo

```python
import re
texto = 'tel: (11) 99999-8888'
m = re.search(r'\((\d{2})\)\s*(\d{4,5})-(\d{4})', texto)
print(m.groups())
```

## Boas práticas

- Compile padrões reutilizados
- Evite regex para parsear HTML/JSON

## Saiba mais

- [Documentação oficial](https://docs.python.org/3/library/re.html)
