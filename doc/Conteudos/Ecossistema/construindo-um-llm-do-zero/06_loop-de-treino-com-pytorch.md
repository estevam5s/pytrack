# Loop de treino com PyTorch

Treinar = prever o próximo token e minimizar a cross-entropy em muitos textos.

## Pontos-chave

- Objetivo: prever token t+1 dado tokens até t
- Loss = cross-entropy entre logits e o próximo token
- Otimizador AdamW + warmup + cosine decay
- Gradient clipping evita explosão de gradiente

## Exemplo

```python
import torch.nn.functional as F

for x, y in loader:  # y = x deslocado em 1
    logits = model(x)
    loss = F.cross_entropy(logits.view(-1, V), y.view(-1))
    loss.backward()
    torch.nn.utils.clip_grad_norm_(model.parameters(), 1.0)
    opt.step(); opt.zero_grad()
```

## Boas práticas

- Comece pequeno (nanoGPT) para entender o fluxo
- Monitore a loss de validação para overfitting

## Saiba mais

- [Documentação oficial](https://github.com/karpathy/nanoGPT)
