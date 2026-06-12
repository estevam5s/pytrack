# Tensores e autograd

PyTorch oferece tensores com diferenciação automática.

> **Tema:** Deep Learning · **Nível:** avancado · **Trilha:** Deep Learning com PyTorch

## Conceitos-chave

Nesta lição você vai entender:

- **Tensores em CPU/GPU**
- **autograd calcula gradientes**
- **nn.Module define modelos**
- **Loop de treino explícito**

## Exemplo prático

```python
import torch
from torch import nn

model = nn.Sequential(nn.Linear(10, 32), nn.ReLU(), nn.Linear(32, 1))
opt = torch.optim.Adam(model.parameters())
loss = nn.MSELoss()
```

Leia o exemplo linha a linha e rode-o no seu ambiente. Em seguida, altere os valores e observe o que muda — entender *por que* o código se comporta assim vale mais do que decorar a sintaxe.

## Boas práticas

- Mova dados e modelo para o mesmo device
- Zere gradientes a cada passo

## Pratique

Para fixar, escreva um pequeno script que combine **tensores em cpu/gpu** e **autograd calcula gradientes** em um caso do seu dia a dia. Depois refatore aplicando "Mova dados e modelo para o mesmo device".

Desafio extra: explique, em uma frase, quando **não** usar esta abordagem — saber os limites de uma ferramenta é tão importante quanto saber usá-la.

## Checklist de domínio

Você domina esta lição quando consegue:

- [ ] Explicar e aplicar: Tensores em CPU/GPU
- [ ] Explicar e aplicar: autograd calcula gradientes
- [ ] Explicar e aplicar: nn.Module define modelos
- [ ] Explicar e aplicar: Loop de treino explícito

## Saiba mais

- [Documentação oficial](https://pytorch.org/docs/)
