# Treino e inferência

Estruture o ciclo de treino e avaliação.

> **Tema:** Deep Learning · **Nível:** avancado · **Trilha:** Deep Learning com PyTorch

## Conceitos-chave

Nesta lição você vai entender:

- **DataLoader para batches**
- **forward, backward e optimizer.step**
- **model.eval() e torch.no_grad() na inferência**
- **Salvar/carregar state_dict**

## Exemplo prático

```python
for xb, yb in loader:
    opt.zero_grad()
    out = model(xb)
    l = loss(out, yb)
    l.backward()
    opt.step()
```

Leia o exemplo linha a linha e rode-o no seu ambiente. Em seguida, altere os valores e observe o que muda — entender *por que* o código se comporta assim vale mais do que decorar a sintaxe.

## Boas práticas

- Use no_grad na avaliação
- Monitore overfitting

## Pratique

Para fixar, escreva um pequeno script que combine **dataloader para batches** e **forward, backward e optimizer.step** em um caso do seu dia a dia. Depois refatore aplicando "Use no_grad na avaliação".

Desafio extra: explique, em uma frase, quando **não** usar esta abordagem — saber os limites de uma ferramenta é tão importante quanto saber usá-la.

## Checklist de domínio

Você domina esta lição quando consegue:

- [ ] Explicar e aplicar: DataLoader para batches
- [ ] Explicar e aplicar: forward, backward e optimizer.step
- [ ] Explicar e aplicar: model.eval() e torch.no_grad() na inferência
- [ ] Explicar e aplicar: Salvar/carregar state_dict

## Saiba mais

- [Documentação oficial](https://pytorch.org/tutorials/)
