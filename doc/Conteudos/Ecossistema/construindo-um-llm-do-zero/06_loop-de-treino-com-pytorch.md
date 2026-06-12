# Loop de treino com PyTorch

Treinar = prever o próximo token e minimizar a cross-entropy em muitos textos.

> **Tema:** IA Generativa · **Nível:** avancado · **Trilha:** Construindo um LLM do Zero

## Conceitos-chave

Nesta lição você vai entender:

- **Objetivo: prever token t+1 dado tokens até t**
- **Loss = cross-entropy entre logits e o próximo token**
- **Otimizador AdamW + warmup + cosine decay**
- **Gradient clipping evita explosão de gradiente**

## Exemplo prático

```python
import torch.nn.functional as F

for x, y in loader:  # y = x deslocado em 1
    logits = model(x)
    loss = F.cross_entropy(logits.view(-1, V), y.view(-1))
    loss.backward()
    torch.nn.utils.clip_grad_norm_(model.parameters(), 1.0)
    opt.step(); opt.zero_grad()
```

Leia o exemplo linha a linha e rode-o no seu ambiente. Em seguida, altere os valores e observe o que muda — entender *por que* o código se comporta assim vale mais do que decorar a sintaxe.

## Boas práticas

- Comece pequeno (nanoGPT) para entender o fluxo
- Monitore a loss de validação para overfitting

## Pratique

Para fixar, escreva um pequeno script que combine **objetivo: prever token t+1 dado tokens até t** e **loss = cross-entropy entre logits e o próximo token** em um caso do seu dia a dia. Depois refatore aplicando "Comece pequeno (nanoGPT) para entender o fluxo".

Desafio extra: explique, em uma frase, quando **não** usar esta abordagem — saber os limites de uma ferramenta é tão importante quanto saber usá-la.

## Checklist de domínio

Você domina esta lição quando consegue:

- [ ] Explicar e aplicar: Objetivo: prever token t+1 dado tokens até t
- [ ] Explicar e aplicar: Loss = cross-entropy entre logits e o próximo token
- [ ] Explicar e aplicar: Otimizador AdamW + warmup + cosine decay
- [ ] Explicar e aplicar: Gradient clipping evita explosão de gradiente

## Saiba mais

- [Documentação oficial](https://github.com/karpathy/nanoGPT)
