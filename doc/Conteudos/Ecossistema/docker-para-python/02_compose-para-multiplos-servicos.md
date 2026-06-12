# Compose para múltiplos serviços

Orquestre app + banco + cache localmente.

> **Tema:** Containers · **Nível:** intermediario · **Trilha:** Docker para Python

## Conceitos-chave

Nesta lição você vai entender:

- **docker-compose.yml define serviços**
- **Redes e volumes**
- **Variáveis de ambiente**
- **Healthchecks e depends_on**

## Exemplo prático

```python
services:
  app:
    build: .
    ports: ['8000:8000']
  db:
    image: postgres:16
    environment:
      POSTGRES_PASSWORD: senha
```

Leia o exemplo linha a linha e rode-o no seu ambiente. Em seguida, altere os valores e observe o que muda — entender *por que* o código se comporta assim vale mais do que decorar a sintaxe.

## Boas práticas

- Não coloque segredos no compose versionado
- Use healthchecks

## Pratique

Para fixar, escreva um pequeno script que combine **docker-compose.yml define serviços** e **redes e volumes** em um caso do seu dia a dia. Depois refatore aplicando "Não coloque segredos no compose versionado".

Desafio extra: explique, em uma frase, quando **não** usar esta abordagem — saber os limites de uma ferramenta é tão importante quanto saber usá-la.

## Checklist de domínio

Você domina esta lição quando consegue:

- [ ] Explicar e aplicar: docker-compose.yml define serviços
- [ ] Explicar e aplicar: Redes e volumes
- [ ] Explicar e aplicar: Variáveis de ambiente
- [ ] Explicar e aplicar: Healthchecks e depends_on

## Saiba mais

- [Documentação oficial](https://docs.docker.com/compose/)
