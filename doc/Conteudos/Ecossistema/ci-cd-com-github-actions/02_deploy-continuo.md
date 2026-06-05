# Deploy contínuo

Publique artefatos e implante automaticamente.

## Pontos-chave

- Build e push de imagem
- Ambientes e aprovações
- Deploy com rollback
- Tags e releases

## Exemplo

```python
      - name: build
        run: docker build -t app:${{ github.sha }} .
      - name: push
        run: docker push app:${{ github.sha }}
```

## Boas práticas

- Separe ambientes (staging/prod)
- Tenha rollback definido

## Saiba mais

- [Documentação oficial](https://docs.github.com/actions/deployment)
