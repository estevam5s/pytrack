# Carga com Locust e mutação

Meça o sistema sob carga e avalie a qualidade da própria suíte de testes.

> **Tema:** Testes · **Nível:** avancado · **Trilha:** Testes de Carga, Propriedade e Mutação

## Conceitos-chave

Nesta lição você vai entender:

- **Locust simula milhares de usuários em Python**
- **Métricas: throughput, latência p95/p99, erros**
- **Mutation testing (mutmut) muda o código e vê se os testes pegam**
- **Testes que sobrevivem a mutações são fracos**

## Exemplo prático

```python
from locust import HttpUser, task

class Usuario(HttpUser):
    @task
    def home(self):
        self.client.get('/')
```

Leia o exemplo linha a linha e rode-o no seu ambiente. Em seguida, altere os valores e observe o que muda — entender *por que* o código se comporta assim vale mais do que decorar a sintaxe.

## Boas práticas

- Teste carga em ambiente parecido com produção
- Mutation score revela testes que não testam nada

## Pratique

Para fixar, escreva um pequeno script que combine **locust simula milhares de usuários em python** e **métricas: throughput, latência p95/p99, erros** em um caso do seu dia a dia. Depois refatore aplicando "Teste carga em ambiente parecido com produção".

Desafio extra: explique, em uma frase, quando **não** usar esta abordagem — saber os limites de uma ferramenta é tão importante quanto saber usá-la.

## Checklist de domínio

Você domina esta lição quando consegue:

- [ ] Explicar e aplicar: Locust simula milhares de usuários em Python
- [ ] Explicar e aplicar: Métricas: throughput, latência p95/p99, erros
- [ ] Explicar e aplicar: Mutation testing (mutmut) muda o código e vê se os testes pegam
- [ ] Explicar e aplicar: Testes que sobrevivem a mutações são fracos

## Saiba mais

- [Documentação oficial](https://locust.io/)
