# Interagindo com a blockchain

web3.py conecta Python à rede Ethereum.

## Pontos-chave

- Conexão via provider (RPC)
- Ler saldos e enviar transações
- Interagir com smart contracts (ABI)
- Carteiras e chaves

## Exemplo

```python
from web3 import Web3
w3 = Web3(Web3.HTTPProvider('https://rpc...'))
print(w3.is_connected())
saldo = w3.eth.get_balance('0x...')
```

## Boas práticas

- Nunca exponha chaves privadas
- Teste em redes de teste primeiro

## Saiba mais

- [Documentação oficial](https://web3py.readthedocs.io/)
