# Alinhamento (RLHF/DPO) e geração

Depois do SFT, alinhar o modelo às preferências humanas e gerar texto com sampling.

> **Tema:** IA Generativa · **Nível:** avancado · **Trilha:** Construindo um LLM do Zero

## Conceitos-chave

Nesta lição você vai entender:

- **RLHF: modelo de recompensa + PPO**
- **DPO: alinhamento direto, mais simples que RLHF**
- **Geração: greedy, temperatura, top-k, top-p**
- **Guardrails e avaliação antes de produzir**

## Exemplo prático

```python
import torch.nn.functional as F

def sample(logits, temperatura=0.8):
    probs = F.softmax(logits / temperatura, dim=-1)
    return torch.multinomial(probs, 1)
```

Leia o exemplo linha a linha e rode-o no seu ambiente. Em seguida, altere os valores e observe o que muda — entender *por que* o código se comporta assim vale mais do que decorar a sintaxe.

## Boas práticas

- DPO virou padrão por ser estável e barato
- Avalie sempre com um conjunto de testes próprio

## Pratique

Para fixar, escreva um pequeno script que combine **rlhf: modelo de recompensa + ppo** e **dpo: alinhamento direto, mais simples que rlhf** em um caso do seu dia a dia. Depois refatore aplicando "DPO virou padrão por ser estável e barato".

Desafio extra: explique, em uma frase, quando **não** usar esta abordagem — saber os limites de uma ferramenta é tão importante quanto saber usá-la.

## Checklist de domínio

Você domina esta lição quando consegue:

- [ ] Explicar e aplicar: RLHF: modelo de recompensa + PPO
- [ ] Explicar e aplicar: DPO: alinhamento direto, mais simples que RLHF
- [ ] Explicar e aplicar: Geração: greedy, temperatura, top-k, top-p
- [ ] Explicar e aplicar: Guardrails e avaliação antes de produzir

## Saiba mais

- [Documentação oficial](https://arxiv.org/abs/2305.18290)
