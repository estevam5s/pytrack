# Interagindo com a blockchain

web3.py conecta Python à rede Ethereum.

> **Tema:** Blockchain · **Nível:** avancado · **Trilha:** Blockchain e Web3

## Conceitos-chave

Nesta lição você vai entender:

- **Conexão via provider (RPC)**
- **Ler saldos e enviar transações**
- **Interagir com smart contracts (ABI)**
- **Carteiras e chaves**

## Exemplo prático

```python
from web3 import Web3
w3 = Web3(Web3.HTTPProvider('https://rpc...'))
print(w3.is_connected())
saldo = w3.eth.get_balance('0x...')
```

Leia o exemplo linha a linha e rode-o no seu ambiente. Em seguida, altere os valores e observe o que muda — entender *por que* o código se comporta assim vale mais do que decorar a sintaxe.

## Boas práticas

- Nunca exponha chaves privadas
- Teste em redes de teste primeiro

## Pratique

Para fixar, escreva um pequeno script que combine **conexão via provider (rpc)** e **ler saldos e enviar transações** em um caso do seu dia a dia. Depois refatore aplicando "Nunca exponha chaves privadas".

Desafio extra: explique, em uma frase, quando **não** usar esta abordagem — saber os limites de uma ferramenta é tão importante quanto saber usá-la.

## Checklist de domínio

Você domina esta lição quando consegue:

- [ ] Explicar e aplicar: Conexão via provider (RPC)
- [ ] Explicar e aplicar: Ler saldos e enviar transações
- [ ] Explicar e aplicar: Interagir com smart contracts (ABI)
- [ ] Explicar e aplicar: Carteiras e chaves

## Saiba mais

- [Documentação oficial](https://web3py.readthedocs.io/)
