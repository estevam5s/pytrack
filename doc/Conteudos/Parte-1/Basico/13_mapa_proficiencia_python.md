# Mapa de Proficiência Python: Do Básico ao Profissional

Este mapa ajuda a medir sua evolução. Ele não é uma lista de recursos decorados, mas um conjunto de competências observáveis. Proficiência significa conseguir resolver problemas, explicar decisões, evitar armadilhas e manter código funcionando quando ele cresce.

---

## Nível 1: Iniciante Operacional

Você está neste nível quando consegue:

- executar arquivos `.py`;
- usar `print`;
- criar variáveis;
- usar `int`, `float`, `str`, `bool` e `None`;
- escrever `if`, `for` e `while`;
- criar listas e dicionários simples;
- escrever funções básicas;
- ler erros simples.

Sinais de lacuna:

- depende de copiar exemplos sem entender;
- mistura tudo em um único bloco;
- não sabe explicar o erro exibido;
- usa nomes genéricos demais;
- tem dificuldade para converter entrada de usuário.

Meta para avançar:

- escrever scripts pequenos sem consulta constante;
- explicar cada linha do próprio código;
- criar funções para evitar repetição.

---

## Nível 2: Básico Sólido

Você está neste nível quando consegue:

- validar entradas;
- usar `match`, `enumerate`, `zip` e comprehensions;
- separar funções por responsabilidade;
- entender escopo local e global;
- usar `try/except` com exceções específicas;
- ler e escrever arquivos simples;
- trabalhar com JSON e CSV;
- organizar código em dois ou mais módulos.

Sinais de lacuna:

- usa `except Exception` sem critério;
- cria funções longas demais;
- altera variáveis globais sem necessidade;
- não separa entrada, cálculo e saída;
- não sabe onde colocar cada parte do código.

Meta para avançar:

- transformar scripts em programas organizados;
- criar módulos reutilizáveis;
- começar a escrever testes.

---

## Nível 3: Intermediário Prático

Você está neste nível quando consegue:

- usar type hints em funções principais;
- criar CLIs com `argparse`;
- usar `pathlib`;
- usar `logging`;
- depurar com `breakpoint`;
- criar testes com `pytest`;
- usar ambientes virtuais;
- instalar dependências com `pip`;
- estruturar projetos com `src/`, `tests/` e `README`.

Sinais de lacuna:

- instala pacotes globalmente sem controle;
- não consegue reproduzir ambiente;
- depende de prints permanentes para diagnosticar;
- não consegue testar o código sem rodar o programa inteiro;
- usa notebooks ou scripts como depósito de tudo.

Meta para avançar:

- criar aplicações pequenas testáveis;
- configurar qualidade mínima;
- documentar como executar o projeto.

---

## Nível 4: Profissional Inicial

Você está neste nível quando consegue:

- desenhar APIs internas claras;
- usar `dataclass`, `TypedDict` e `Protocol` quando fazem sentido;
- criar exceções de domínio;
- empacotar código reutilizável;
- usar `pyproject.toml`;
- rodar `ruff`, `pytest` e verificação de tipos;
- separar domínio, infraestrutura e interface;
- revisar código pensando em manutenção.

Sinais de lacuna:

- adiciona abstrações sem necessidade;
- cria dependências circulares;
- não sabe onde tratar exceções;
- mistura regra de negócio com banco, arquivo ou CLI;
- escreve testes frágeis demais.

Meta para avançar:

- construir projetos que outra pessoa consiga instalar, testar e manter;
- explicar trade-offs de design;
- melhorar clareza antes de otimizar.

---

## Nível 5: Proficiência Avançada

Você está neste nível quando consegue:

- modelar domínios com baixo acoplamento;
- criar pacotes versionados;
- usar tipagem como contrato;
- lidar com performance de forma medida;
- projetar logs e diagnósticos para produção;
- automatizar testes e qualidade em CI;
- revisar segurança básica;
- documentar decisões técnicas;
- refatorar sem quebrar comportamento.

Sinais de lacuna:

- otimiza sem medir;
- cria arquitetura mais complexa que o problema;
- ignora compatibilidade e migração;
- não registra decisões importantes;
- não considera operação, observabilidade e manutenção.

Meta para avançar:

- estudar testes avançados, arquitetura, bancos, APIs, async, performance, segurança e deploy.

---

## Matriz de Competências

| Competência | Básico | Intermediário | Profissional |
|---|---|---|---|
| Sintaxe | Escreve comandos simples | Usa idiomatismos | Prioriza clareza e manutenção |
| Funções | Cria funções pequenas | Separa responsabilidades | Define contratos estáveis |
| Erros | Lê exceções comuns | Trata falhas esperadas | Modela exceções de domínio |
| Dados | Usa listas e dicts | Lê JSON/CSV | Valida e versiona formatos |
| Projeto | Script único | Módulos | Pacote testável |
| Testes | Assert simples | Pytest | Testes de contrato e regressão |
| Tipagem | Hints básicos | Coleções e Optional | Protocol, aliases e design |
| Debug | Print | Breakpoint e logs | Diagnóstico operacional |
| Dependências | Pip básico | Venv | Pyproject e build |

---

## Checklist Final da Parte Básica

Antes de sair desta parte, você deve conseguir:

- criar uma CLI pequena;
- persistir dados em JSON;
- separar código em módulos;
- escrever pelo menos cinco testes;
- usar ambiente virtual;
- explicar um traceback;
- validar entrada inválida;
- formatar saída;
- usar type hints;
- documentar como executar o projeto.

---

## Plano de Revisão

1. Refaça os exercícios dos arquivos 1 a 6.
2. Faça os exercícios de entrada, arquivos e módulos.
3. Construa o projeto guiado sem copiar tudo de uma vez.
4. Escreva testes para cada função de regra.
5. Revise o código procurando nomes ruins e funções longas.
6. Adicione README ao projeto.
7. Explique em voz alta como os módulos se conectam.

---

## Próximos Estudos

Depois desta trilha, avance para:

- estruturas de dados;
- orientação a objetos;
- testes mais completos;
- qualidade de código;
- HTTP e APIs;
- bancos de dados;
- automação;
- análise de dados;
- async;
- deploy e produção.

---

## Aprofundamento Complementar

### Evidências de proficiência

Guarde evidências concretas do aprendizado:

- um script interativo;
- uma CLI com `argparse`;
- um projeto com JSON;
- um pacote simples com `pyproject.toml`;
- um conjunto de testes com `pytest`;
- um README com instruções;
- uma refatoração antes/depois.

Esses artefatos mostram mais domínio do que apenas anotações.

### Autoavaliação por tarefa

Para cada novo problema, pergunte:

- consigo decompor em funções?
- sei quais dados entram e saem?
- sei onde erros podem ocorrer?
- sei como testar a parte principal?
- sei explicar as escolhas?
- consigo simplificar a solução?

### Sinais de maturidade

Um estudante está avançando quando começa a:

- apagar código desnecessário;
- preferir nomes claros;
- escrever funções menores;
- evitar abstrações prematuras;
- criar testes antes de refatorar;
- ler documentação oficial;
- aceitar que código simples é melhor que código impressionante.

### Próximo marco prático

Antes de avançar para tópicos grandes, construa três projetos pequenos:

1. Gerenciador de tarefas em JSON.
2. Calculadora financeira com CLI.
3. Leitor de CSV com relatório final.

Cada projeto deve ter README, funções separadas, validação e testes básicos.
