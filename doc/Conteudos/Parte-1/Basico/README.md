# Fundamentos de Python: Trilha Completa do Básico à Proficiência

Este diretório organiza os fundamentos essenciais de Python em uma progressão de estudo. A ideia é começar pela sintaxe e pelos tipos, avançar para controle de fluxo, funções e escopo, depois chegar em recursos profissionais como tipagem, decorators, context managers, tratamento de exceções, biblioteca padrão, runtime, boas práticas, ambientes virtuais e empacotamento.

---

## Sumário da Trilha

1. [Sintaxe, Variáveis, Tipos e Operadores](./01_sintaxe_variaveis_tipos_operadores.md)
2. [Controle de Fluxo: Condicionais, Match, For e While](./02_controle_de_fluxo.md)
3. [Funções, Escopo, Comprehensions e Geradores](./03_funcoes_escopo_comprehensions_geradores.md)
4. [Decorators, Context Managers e Exceções](./04_decorators_context_managers_excecoes.md)
5. [Tipagem, PEP 8 e Boas Práticas](./05_tipagem_pep8_boas_praticas.md)
6. [Ambientes Virtuais e Empacotamento](./06_ambientes_virtuais_empacotamento.md)
7. [Entrada, Saída, CLI e Interação com Usuário](./07_entrada_saida_cli.md)
8. [Arquivos, Caminhos, JSON, CSV e Persistência](./08_arquivos_json_csv_persistencia.md)
9. [Módulos, Imports, Pacotes e Biblioteca Padrão](./09_modulos_imports_biblioteca_padrao.md)
10. [Depuração, Logs, Erros e Diagnóstico](./10_debugging_logs_diagnostico.md)
11. [Testes Básicos, Assert, Pytest e Qualidade Inicial](./11_testes_basicos_pytest_qualidade.md)
12. [Projeto Guiado: Aplicação de Linha de Comando](./12_projeto_guiado_cli.md)
13. [Mapa de Proficiência Python: Do Básico ao Profissional](./13_mapa_proficiencia_python.md)
14. [Runtime Python: GIL, Memória e Garbage Collection](./14_runtime_memoria_gil_gc.md)
15. [Core Python e Bibliotecas Built-in](./15_core_python_bibliotecas_builtin.md)

---

## Ordem Recomendada

1. Execute todos os exemplos pequenos.
2. Altere os exemplos para criar variações.
3. Transforme scripts simples em funções.
4. Adicione tipagem gradualmente.
5. Use `try/except` apenas quando houver uma decisão clara de recuperação.
6. Organize projetos com ambiente virtual.
7. Aprenda entrada e saída antes de criar programas interativos.
8. Leia e grave arquivos pequenos antes de automatizar fluxos reais.
9. Organize código em módulos quando um script começar a crescer.
10. Use logs e depuração para entender falhas, não apenas `print`.
11. Escreva testes para funções importantes.
12. Construa o projeto guiado e refatore em etapas.
13. Use o mapa de proficiência para revisar lacunas.
14. Estude runtime, memória, GIL e garbage collection para entender limites reais.
15. Revise bibliotecas built-in para resolver problemas comuns sem dependência externa.

---

## Critério de Proficiência

Cada arquivo segue a mesma progressão:

1. **Base**: sintaxe, exemplos pequenos e entendimento conceitual.
2. **Intermediário**: padrões comuns, erros frequentes e uso correto em scripts.
3. **Avançado**: armadilhas da linguagem, desempenho, design de APIs, testabilidade e código profissional.
4. **Especialista**: decisões de arquitetura, manutenção, contratos, empacotamento, automação e leitura crítica de trade-offs.

O objetivo não é apenas conhecer recursos do Python. O objetivo é saber quando usar, quando evitar, como explicar a decisão e como escrever código que continue correto quando o projeto crescer.

---

## Como Estudar Para Virar Especialista

- Leia o conteúdo uma vez sem copiar código.
- Execute os exemplos em arquivos próprios.
- Reescreva cada exemplo com dados diferentes.
- Crie testes para pelo menos uma função por seção.
- Anote armadilhas e decisões de design.
- Refatore exemplos simples para versões mais profissionais.
- Compare soluções por clareza, desempenho, tipagem e manutenção.
- Monte pequenos pacotes reutilizáveis, não apenas scripts soltos.

---

## Resultado Esperado

Ao terminar esta trilha, você deve saber:

- escrever scripts Python limpos;
- usar tipos básicos e coleções com segurança;
- escolher estruturas condicionais e laços corretamente;
- criar funções reutilizáveis;
- entender escopo, closures, geradores e comprehensions;
- aplicar decorators e context managers;
- tratar exceções de forma profissional;
- usar type hints;
- seguir PEP 8;
- criar ambientes isolados;
- estruturar e empacotar projetos Python;
- entender `Protocol`, `TypeVar`, `Generic`, decorators, generators, coroutines e context managers;
- explicar GIL, memory management e garbage collection em nível prático;
- receber dados do usuário por `input` e argumentos de linha de comando;
- ler e gravar arquivos de texto, JSON e CSV;
- usar `pathlib` para caminhos portáveis;
- organizar código em módulos e pacotes;
- usar partes essenciais da biblioteca padrão;
- escolher módulos built-in como `collections`, `itertools`, `functools`, `operator`, `subprocess`, `logging`, `asyncio`, `dataclasses`, `enum` e `abc`;
- depurar com método, logs e mensagens de erro;
- escrever testes básicos com `assert` e `pytest`;
- montar uma aplicação de linha de comando completa;
- avaliar trade-offs técnicos;
- escrever APIs internas claras;
- criar código testável;
- escolher padrões idiomáticos;
- evitar armadilhas comuns de mutabilidade, escopo, exceções e dependências;
- preparar projetos para manutenção profissional.

---

## Como Avaliar se o Conteúdo Está Realmente Dominado

Você não domina Python básico quando apenas consegue acompanhar exemplos. Você domina quando consegue:

- resolver uma variação do problema sem copiar a solução original;
- explicar por que escolheu uma estrutura de dados;
- prever o comportamento antes de executar;
- ler um erro e encontrar a causa provável;
- transformar código repetido em função;
- separar entrada, processamento e saída;
- escrever pelo menos um teste para a regra principal;
- organizar o código para outra pessoa conseguir continuar.

Uma boa regra de estudo é: para cada tópico, crie um exemplo próprio, que use nomes e contexto diferentes do material.

---

## Critérios de Revisão por Arquivo

Ao terminar cada arquivo, responda:

- Quais conceitos centrais este arquivo ensina?
- Quais erros comuns ele ajuda a evitar?
- Quais exemplos consigo reescrever sem olhar?
- Que parte desse conhecimento aparece em projetos reais?
- Que função ou miniaplicação posso criar usando esse tópico?
- Como eu testaria esse comportamento?

Se você não consegue responder essas perguntas, ainda não concluiu o arquivo. Você apenas leu.

---

## Cobertura dos Conceitos Essenciais

Esta trilha cobre explicitamente os fundamentos abaixo:

| Conceito | Arquivo principal |
|---|---|
| Primeiro programa | `01_sintaxe_variaveis_tipos_operadores.md` |
| Tipos básicos: `int`, `float`, `str`, `bool` | `01_sintaxe_variaveis_tipos_operadores.md` |
| Variáveis e comentários | `01_sintaxe_variaveis_tipos_operadores.md` |
| Operadores aritméticos, relacionais e lógicos | `01_sintaxe_variaveis_tipos_operadores.md` |
| Entrada e saída com `input` e `print` | `07_entrada_saida_cli.md` |
| Shebang e execução no terminal | `07_entrada_saida_cli.md` |
| `if`, `elif`, `else` | `02_controle_de_fluxo.md` |
| `while`, `for`, `break`, `continue` | `02_controle_de_fluxo.md` |
| Listas, tuplas, dicionários e conjuntos | `01_sintaxe_variaveis_tipos_operadores.md` |
| Comprehensions | `03_funcoes_escopo_comprehensions_geradores.md` |
| Generators e iteradores | `03_funcoes_escopo_comprehensions_geradores.md` |
| Funções, retorno e argumentos | `03_funcoes_escopo_comprehensions_geradores.md` |
| `*args` e `**kwargs` | `03_funcoes_escopo_comprehensions_geradores.md` |
| Módulos, pacotes e `import` | `09_modulos_imports_biblioteca_padrao.md` |
| `if __name__ == "__main__"` | `09_modulos_imports_biblioteca_padrao.md` |

---

## Cobertura dos Conceitos Solicitados

| Conceito | Onde estudar |
|---|---|
| Fundamentos da Linguagem Python | [01](./01_sintaxe_variaveis_tipos_operadores.md), [02](./02_controle_de_fluxo.md), [03](./03_funcoes_escopo_comprehensions_geradores.md) |
| Sintaxe, tipos, operadores, condicionais e loops | [01](./01_sintaxe_variaveis_tipos_operadores.md), [02](./02_controle_de_fluxo.md) |
| Funções, escopo, `*args`, `**kwargs`, lambdas e closures | [03](./03_funcoes_escopo_comprehensions_geradores.md) |
| List, dict e set comprehensions | [03](./03_funcoes_escopo_comprehensions_geradores.md) |
| Slicing, unpacking e string formatting | [01](./01_sintaxe_variaveis_tipos_operadores.md), [03](./03_funcoes_escopo_comprehensions_geradores.md) |
| Type hints, `typing`, `Protocol`, `TypeVar` e `Generic` | [05](./05_tipagem_pep8_boas_praticas.md) |
| Decorators, generators, coroutines e context managers | [03](./03_funcoes_escopo_comprehensions_geradores.md), [04](./04_decorators_context_managers_excecoes.md), [15](./15_core_python_bibliotecas_builtin.md) |
| GIL, memory management e garbage collection | [14](./14_runtime_memoria_gil_gc.md) |
| Ambientes virtuais, empacotamento e publicação no PyPI | [06](./06_ambientes_virtuais_empacotamento.md) |
| `collections`, `itertools`, `functools`, `operator` | [09](./09_modulos_imports_biblioteca_padrao.md), [15](./15_core_python_bibliotecas_builtin.md) |
| `pathlib`, `os`, `sys`, `subprocess`, `shutil` | [07](./07_entrada_saida_cli.md), [08](./08_arquivos_json_csv_persistencia.md), [09](./09_modulos_imports_biblioteca_padrao.md), [15](./15_core_python_bibliotecas_builtin.md) |
| `json`, `pickle`, `csv`, `configparser` | [08](./08_arquivos_json_csv_persistencia.md), [15](./15_core_python_bibliotecas_builtin.md) |
| `datetime`, `time`, `zoneinfo` | [09](./09_modulos_imports_biblioteca_padrao.md), [15](./15_core_python_bibliotecas_builtin.md) |
| `re`, `hashlib`, `hmac`, `secrets`, `logging` | [10](./10_debugging_logs_diagnostico.md), [15](./15_core_python_bibliotecas_builtin.md) |
| `threading`, `multiprocessing`, `concurrent.futures`, `asyncio` | [14](./14_runtime_memoria_gil_gc.md), [15](./15_core_python_bibliotecas_builtin.md) |
| `contextlib`, `dataclasses`, `enum`, `abc` | [04](./04_decorators_context_managers_excecoes.md), [05](./05_tipagem_pep8_boas_praticas.md), [15](./15_core_python_bibliotecas_builtin.md) |

Use esta tabela como checklist mínimo. Os demais arquivos aprofundam qualidade, ambientes, testes, depuração, arquivos, CLI e projeto prático.
