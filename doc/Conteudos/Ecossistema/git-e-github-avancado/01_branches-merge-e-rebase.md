# Branches, merge e rebase

Fluxos de trabalho colaborativos com Git.

> **Tema:** Versionamento · **Nível:** intermediario · **Trilha:** Git e GitHub Avançado

## Conceitos-chave

Nesta lição você vai entender:

- **Branches por feature**
- **merge vs rebase**
- **Resolução de conflitos**
- **Commits atômicos e mensagens claras**

## Exemplo prático

```python
git switch -c feature/login
git add -p
git commit -m 'feat: login com JWT'
git rebase main
```

Leia o exemplo linha a linha e rode-o no seu ambiente. Em seguida, altere os valores e observe o que muda — entender *por que* o código se comporta assim vale mais do que decorar a sintaxe.

## Boas práticas

- Commits pequenos e descritivos
- Rebase local, merge no remoto

## Pratique

Para fixar, escreva um pequeno script que combine **branches por feature** e **merge vs rebase** em um caso do seu dia a dia. Depois refatore aplicando "Commits pequenos e descritivos".

Desafio extra: explique, em uma frase, quando **não** usar esta abordagem — saber os limites de uma ferramenta é tão importante quanto saber usá-la.

## Checklist de domínio

Você domina esta lição quando consegue:

- [ ] Explicar e aplicar: Branches por feature
- [ ] Explicar e aplicar: merge vs rebase
- [ ] Explicar e aplicar: Resolução de conflitos
- [ ] Explicar e aplicar: Commits atômicos e mensagens claras

## Saiba mais

- [Documentação oficial](https://git-scm.com/doc)
