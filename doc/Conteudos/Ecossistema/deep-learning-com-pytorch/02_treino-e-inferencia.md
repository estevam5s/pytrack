# Treino e inferência

Estruture o ciclo de treino e avaliação.

## Pontos-chave

- DataLoader para batches
- forward, backward e optimizer.step
- model.eval() e torch.no_grad() na inferência
- Salvar/carregar state_dict

## Exemplo

```python
for xb, yb in loader:
    opt.zero_grad()
    out = model(xb)
    l = loss(out, yb)
    l.backward()
    opt.step()
```

## Boas práticas

- Use no_grad na avaliação
- Monitore overfitting

## Saiba mais

- [Documentação oficial](https://pytorch.org/tutorials/)
