# Tensores e autograd

PyTorch oferece tensores com diferenciação automática.

## Pontos-chave

- Tensores em CPU/GPU
- autograd calcula gradientes
- nn.Module define modelos
- Loop de treino explícito

## Exemplo

```python
import torch
from torch import nn

model = nn.Sequential(nn.Linear(10, 32), nn.ReLU(), nn.Linear(32, 1))
opt = torch.optim.Adam(model.parameters())
loss = nn.MSELoss()
```

## Boas práticas

- Mova dados e modelo para o mesmo device
- Zere gradientes a cada passo

## Saiba mais

- [Documentação oficial](https://pytorch.org/docs/)
