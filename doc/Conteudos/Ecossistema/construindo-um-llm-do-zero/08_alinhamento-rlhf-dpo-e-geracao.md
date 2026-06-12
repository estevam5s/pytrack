# Alinhamento (RLHF/DPO) e geração

Depois do SFT, alinhar o modelo às preferências humanas e gerar texto com sampling.

## Pontos-chave

- RLHF: modelo de recompensa + PPO
- DPO: alinhamento direto, mais simples que RLHF
- Geração: greedy, temperatura, top-k, top-p
- Guardrails e avaliação antes de produzir

## Exemplo

```python
import torch.nn.functional as F

def sample(logits, temperatura=0.8):
    probs = F.softmax(logits / temperatura, dim=-1)
    return torch.multinomial(probs, 1)
```

## Boas práticas

- DPO virou padrão por ser estável e barato
- Avalie sempre com um conjunto de testes próprio

## Saiba mais

- [Documentação oficial](https://arxiv.org/abs/2305.18290)
