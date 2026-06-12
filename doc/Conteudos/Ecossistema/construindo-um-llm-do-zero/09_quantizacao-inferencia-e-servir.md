# Quantização, inferência e servir

Para usar o modelo em produção: quantizar, otimizar e servir com alta vazão.

## Pontos-chave

- Quantização 8/4 bits reduz memória drasticamente
- KV cache acelera a geração autoregressiva
- vLLM e TGI servem com batching contínuo
- GGUF/llama.cpp roda em CPU e dispositivos locais

## Exemplo

```python
from vllm import LLM, SamplingParams

llm = LLM(model='meta-llama/Llama-3.1-8B')
out = llm.generate(['Explique atenção:'], SamplingParams(max_tokens=128))
print(out[0].outputs[0].text)
```

## Boas práticas

- KV cache é essencial para latência baixa
- Quantize para caber na sua GPU sem perder muito

## Saiba mais

- [Documentação oficial](https://docs.vllm.ai/)
