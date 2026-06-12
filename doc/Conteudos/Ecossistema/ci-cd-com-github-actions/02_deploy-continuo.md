# Deploy contínuo

Publique artefatos e implante automaticamente.

> **Tema:** CI/CD · **Nível:** intermediario · **Trilha:** CI/CD com GitHub Actions

## Conceitos-chave

Nesta lição você vai entender:

- **Build e push de imagem**
- **Ambientes e aprovações**
- **Deploy com rollback**
- **Tags e releases**

## Exemplo prático

```python
      - name: build
        run: docker build -t app:${{ github.sha }} .
      - name: push
        run: docker push app:${{ github.sha }}
```

Leia o exemplo linha a linha e rode-o no seu ambiente. Em seguida, altere os valores e observe o que muda — entender *por que* o código se comporta assim vale mais do que decorar a sintaxe.

## Boas práticas

- Separe ambientes (staging/prod)
- Tenha rollback definido

## Pratique

Para fixar, escreva um pequeno script que combine **build e push de imagem** e **ambientes e aprovações** em um caso do seu dia a dia. Depois refatore aplicando "Separe ambientes (staging/prod)".

Desafio extra: explique, em uma frase, quando **não** usar esta abordagem — saber os limites de uma ferramenta é tão importante quanto saber usá-la.

## Checklist de domínio

Você domina esta lição quando consegue:

- [ ] Explicar e aplicar: Build e push de imagem
- [ ] Explicar e aplicar: Ambientes e aprovações
- [ ] Explicar e aplicar: Deploy com rollback
- [ ] Explicar e aplicar: Tags e releases

## Saiba mais

- [Documentação oficial](https://docs.github.com/actions/deployment)
