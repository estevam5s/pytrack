# Quantização, inferência e servir

Para usar o modelo em produção: quantizar, otimizar e servir com alta vazão.

> **Tema:** IA Generativa · **Nível:** avancado · **Trilha:** Construindo um LLM do Zero

## Conceitos-chave

Nesta lição você vai entender:

- **Quantização 8/4 bits reduz memória drasticamente**
- **KV cache acelera a geração autoregressiva**
- **vLLM e TGI servem com batching contínuo**
- **GGUF/llama.cpp roda em CPU e dispositivos locais**

## Exemplo prático

```python
from vllm import LLM, SamplingParams

llm = LLM(model='meta-llama/Llama-3.1-8B')
out = llm.generate(['Explique atenção:'], SamplingParams(max_tokens=128))
print(out[0].outputs[0].text)
```

Leia o exemplo linha a linha e rode-o no seu ambiente. Em seguida, altere os valores e observe o que muda — entender *por que* o código se comporta assim vale mais do que decorar a sintaxe.

## Boas práticas

- KV cache é essencial para latência baixa
- Quantize para caber na sua GPU sem perder muito

## Pratique

Para fixar, escreva um pequeno script que combine **quantização 8/4 bits reduz memória drasticamente** e **kv cache acelera a geração autoregressiva** em um caso do seu dia a dia. Depois refatore aplicando "KV cache é essencial para latência baixa".

Desafio extra: explique, em uma frase, quando **não** usar esta abordagem — saber os limites de uma ferramenta é tão importante quanto saber usá-la.

## Checklist de domínio

Você domina esta lição quando consegue:

- [ ] Explicar e aplicar: Quantização 8/4 bits reduz memória drasticamente
- [ ] Explicar e aplicar: KV cache acelera a geração autoregressiva
- [ ] Explicar e aplicar: vLLM e TGI servem com batching contínuo
- [ ] Explicar e aplicar: GGUF/llama.cpp roda em CPU e dispositivos locais

## Saiba mais

- [Documentação oficial](https://docs.vllm.ai/)
