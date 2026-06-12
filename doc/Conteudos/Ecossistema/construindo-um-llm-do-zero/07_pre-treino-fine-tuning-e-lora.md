# Pré-treino, fine-tuning e LoRA

Pré-treino aprende linguagem geral; fine-tuning especializa. LoRA torna isso barato.

## Pontos-chave

- Pré-treino: muito texto, caro, feito uma vez
- Fine-tuning supervisionado (SFT) com pares instrução-resposta
- LoRA treina matrizes de baixa rank, congelando o resto
- QLoRA: LoRA + quantização em 4 bits

## Exemplo

```python
from peft import LoraConfig, get_peft_model

cfg = LoraConfig(r=8, lora_alpha=16, target_modules=['q_proj','v_proj'])
model = get_peft_model(base_model, cfg)
model.print_trainable_parameters()
```

## Boas práticas

- LoRA permite treinar 7B+ numa GPU de consumo
- Salve só os adaptadores, não o modelo inteiro

## Saiba mais

- [Documentação oficial](https://huggingface.co/docs/peft)
