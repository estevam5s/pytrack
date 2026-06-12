# Compose para múltiplos serviços

Orquestre app + banco + cache localmente.

## Pontos-chave

- docker-compose.yml define serviços
- Redes e volumes
- Variáveis de ambiente
- Healthchecks e depends_on

## Exemplo

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

## Boas práticas

- Não coloque segredos no compose versionado
- Use healthchecks

## Saiba mais

- [Documentação oficial](https://docs.docker.com/compose/)
