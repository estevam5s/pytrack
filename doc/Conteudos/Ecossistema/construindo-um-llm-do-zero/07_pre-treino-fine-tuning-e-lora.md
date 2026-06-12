# Pré-treino, fine-tuning e LoRA

Pré-treino aprende linguagem geral; fine-tuning especializa. LoRA torna isso barato.

> **Tema:** IA Generativa · **Nível:** avancado · **Trilha:** Construindo um LLM do Zero

## Conceitos-chave

Nesta lição você vai entender:

- **Pré-treino: muito texto, caro, feito uma vez**
- **Fine-tuning supervisionado (SFT) com pares instrução-resposta**
- **LoRA treina matrizes de baixa rank, congelando o resto**
- **QLoRA: LoRA + quantização em 4 bits**

## Exemplo prático

```python
from peft import LoraConfig, get_peft_model

cfg = LoraConfig(r=8, lora_alpha=16, target_modules=['q_proj','v_proj'])
model = get_peft_model(base_model, cfg)
model.print_trainable_parameters()
```

Leia o exemplo linha a linha e rode-o no seu ambiente. Em seguida, altere os valores e observe o que muda — entender *por que* o código se comporta assim vale mais do que decorar a sintaxe.

## Boas práticas

- LoRA permite treinar 7B+ numa GPU de consumo
- Salve só os adaptadores, não o modelo inteiro

## Pratique

Para fixar, escreva um pequeno script que combine **pré-treino: muito texto, caro, feito uma vez** e **fine-tuning supervisionado (sft) com pares instrução-resposta** em um caso do seu dia a dia. Depois refatore aplicando "LoRA permite treinar 7B+ numa GPU de consumo".

Desafio extra: explique, em uma frase, quando **não** usar esta abordagem — saber os limites de uma ferramenta é tão importante quanto saber usá-la.

## Checklist de domínio

Você domina esta lição quando consegue:

- [ ] Explicar e aplicar: Pré-treino: muito texto, caro, feito uma vez
- [ ] Explicar e aplicar: Fine-tuning supervisionado (SFT) com pares instrução-resposta
- [ ] Explicar e aplicar: LoRA treina matrizes de baixa rank, congelando o resto
- [ ] Explicar e aplicar: QLoRA: LoRA + quantização em 4 bits

## Saiba mais

- [Documentação oficial](https://huggingface.co/docs/peft)
