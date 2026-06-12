# Segurança e guardrails

Agentes que agem no mundo precisam de limites, validação e supervisão.

> **Tema:** LLMs Aplicados · **Nível:** avancado · **Trilha:** Agentes de IA com Tool Use

## Conceitos-chave

Nesta lição você vai entender:

- **Sandbox para execução de código/ferramentas**
- **Allowlist de ações permitidas**
- **Human-in-the-loop para ações irreversíveis**
- **Limites de custo, tempo e taxa**

## Exemplo prático

```python
ACOES_PERMITIDAS = {'buscar', 'ler'}

def executar(acao):
    if acao.nome not in ACOES_PERMITIDAS:
        raise PermissionError(acao.nome)
    return acao.run()
```

Leia o exemplo linha a linha e rode-o no seu ambiente. Em seguida, altere os valores e observe o que muda — entender *por que* o código se comporta assim vale mais do que decorar a sintaxe.

## Boas práticas

- Peça confirmação humana para ações destrutivas
- Nunca dê ao agente mais permissão do que a tarefa exige

## Pratique

Para fixar, escreva um pequeno script que combine **sandbox para execução de código/ferramentas** e **allowlist de ações permitidas** em um caso do seu dia a dia. Depois refatore aplicando "Peça confirmação humana para ações destrutivas".

Desafio extra: explique, em uma frase, quando **não** usar esta abordagem — saber os limites de uma ferramenta é tão importante quanto saber usá-la.

## Checklist de domínio

Você domina esta lição quando consegue:

- [ ] Explicar e aplicar: Sandbox para execução de código/ferramentas
- [ ] Explicar e aplicar: Allowlist de ações permitidas
- [ ] Explicar e aplicar: Human-in-the-loop para ações irreversíveis
- [ ] Explicar e aplicar: Limites de custo, tempo e taxa

## Saiba mais

- [Documentação oficial](https://www.anthropic.com/research/building-effective-agents)
