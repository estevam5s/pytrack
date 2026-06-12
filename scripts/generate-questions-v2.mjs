/**
 * Expansão do banco de perguntas de entrevista: questões reais por tecnologia
 * E por nível de senioridade (junior -> pleno -> senior -> especialista).
 * Gera supabase/questions_expansion.json (insert via REST).
 */
import { writeFileSync } from "node:fs";
import { join } from "node:path";

// Orientações (aplicação/erros/fixar) por categoria — estilo do material base.
const GUIDE = {
  "Fundamentos de Python": [
    "Aplique definindo o conceito com precisão e conectando ao comportamento real do interpretador.",
    "Erro comum: decorar a sintaxe sem entender o modelo de objetos, mutabilidade e avaliação.",
    "Fixe rápido: escreva um exemplo executável, inspecione com `id()`/`type()` e compare alternativas.",
  ],
  "Estruturas de Dados": [
    "Aplique escolhendo a estrutura pelo padrão de acesso (busca, inserção, ordem, unicidade) e custo.",
    "Erro comum: usar lista por hábito onde dict/set/deque dariam complexidade muito melhor.",
    "Fixe rápido: resolva o mesmo problema com duas estruturas e meça com `timeit`.",
  ],
  "Funções & Funcional": [
    "Aplique compondo funções pequenas, puras e previsíveis; trate funções como cidadãs de primeira classe.",
    "Erro comum: efeitos colaterais escondidos, mutar argumentos padrão e abusar de lambdas ilegíveis.",
    "Fixe rápido: refatore um trecho imperativo em funções compostas e teste cada uma isoladamente.",
  ],
  POO: [
    "Aplique modelando responsabilidades reais e coesas, com baixo acoplamento e contratos claros.",
    "Erro comum: herança profunda onde composição resolveria; classes que viram 'sacos' de métodos.",
    "Fixe rápido: modele um domínio pequeno, aplique SOLID e escreva testes do comportamento.",
  ],
  "Async & Concorrência": [
    "Aplique escolhendo o modelo pela carga: I/O-bound com asyncio/threads; CPU-bound com multiprocessing.",
    "Erro comum: bloquear o event loop, ignorar cancelamento/timeout e assumir paralelismo onde há GIL.",
    "Fixe rápido: implemente o mesmo download com asyncio e threads e compare latência e throughput.",
  ],
  "APIs & Web": [
    "Aplique definindo contratos claros: rotas, status codes, validação de entrada e respostas padronizadas.",
    "Erro comum: não validar entradas, vazar erros internos e ignorar versionamento e idempotência.",
    "Fixe rápido: construa um CRUD com FastAPI, documente no OpenAPI e teste com TestClient.",
  ],
  "Banco de Dados & ORM": [
    "Aplique modelando dados com integridade, índices conforme as queries reais e transações explícitas.",
    "Erro comum: N+1 queries, índices ausentes/excessivos e abstrair o SQL a ponto de não entendê-lo.",
    "Fixe rápido: rode `EXPLAIN` em uma query lenta e otimize com índice ou reescrita.",
  ],
  "Data Science & IA": [
    "Aplique cuidando da qualidade do dado, reprodutibilidade e validação além do algoritmo em si.",
    "Erro comum: vazamento de dados, notebooks sem rastreabilidade e métricas inadequadas ao problema.",
    "Fixe rápido: monte um pipeline ETL + modelo, versione dados/artefatos e documente decisões.",
  ],
  "Testes & Qualidade": [
    "Aplique cobrindo comportamento crítico, não detalhes; automatize lint, tipos e testes na CI.",
    "Erro comum: testes frágeis acoplados à implementação e buscar cobertura sem cobrir cenários reais.",
    "Fixe rápido: escreva um teste que falha, implemente até passar e refatore (TDD).",
  ],
  "DevOps & Produção": [
    "Aplique garantindo build reproduzível, observabilidade, healthchecks e estratégia de rollback.",
    "Erro comum: imagens gigantes, segredos no código e deploy sem métricas nem plano de reversão.",
    "Fixe rápido: containerize uma app com multi-stage e suba com docker-compose + healthcheck.",
  ],
  Segurança: [
    "Aplique validando entrada, protegendo segredos e seguindo o OWASP Top 10 desde o início.",
    "Erro comum: confiar na entrada do usuário, guardar senhas sem hash e expor dados sensíveis em logs.",
    "Fixe rápido: implemente hash de senha com bcrypt e queries parametrizadas; rode Bandit/pip-audit.",
  ],
  "Arquitetura & Design": [
    "Aplique separando domínio, aplicação e infraestrutura; escolha padrões para reduzir complexidade real.",
    "Erro comum: over-engineering, padrões sem necessidade e domínio acoplado a framework.",
    "Fixe rápido: desenhe uma feature em camadas (clean/hexagonal) e justifique cada fronteira.",
  ],
  "Performance & Internals": [
    "Aplique medindo antes de otimizar; entenda alocação, GIL, GC e o modelo de execução do CPython.",
    "Erro comum: otimizar sem profiling, microbenchmarks irreais e ignorar o gargalo de arquitetura.",
    "Fixe rápido: faça profiling com cProfile/py-spy, otimize o gargalo e comprove o ganho.",
  ],
  "Carreira & Boas Práticas": [
    "Aplique comunicando decisões com clareza, escrevendo código legível e justificando trade-offs.",
    "Erro comum: priorizar 'esperteza' sobre manutenção e não documentar decisões importantes.",
    "Fixe rápido: revise um PR focando em comportamento, testabilidade, segurança e legibilidade.",
  ],
};

const SENIORITY = { junior: 1, pleno: 2, senior: 3, especialista: 4 };

// Bancos: [categoria] -> { junior: [[q, concept]], pleno, senior, especialista }
const BANKS = {
  "Fundamentos de Python": {
    junior: [
      ["O que é tipagem dinâmica e como o Python a implementa?", "Variáveis são apenas nomes que apontam para objetos; o tipo pertence ao objeto, não ao nome, e é resolvido em tempo de execução."],
      ["Qual a diferença entre `is` e `==`?", "`==` compara valor (via `__eq__`); `is` compara identidade (mesmo objeto na memória, mesmo `id()`)."],
      ["O que são tipos mutáveis e imutáveis? Dê exemplos.", "Imutáveis (int, str, tuple, frozenset) não mudam de estado; mutáveis (list, dict, set) sim. Afeta cópia, hashing e argumentos padrão."],
      ["Para que serve uma f-string e quais vantagens ela tem?", "Interpolação legível e rápida avaliada em tempo de execução, com format specifiers e expressões embutidas."],
      ["Qual a diferença entre lista e tupla?", "Lista é mutável e usada para coleções homogêneas que mudam; tupla é imutável, hasheável e boa para registros fixos."],
      ["O que faz o `range` e por que ele é eficiente?", "Gera valores sob demanda (lazy), sem materializar a sequência na memória."],
      ["Como funciona o desempacotamento (unpacking) em Python?", "Atribui elementos de um iterável a múltiplas variáveis, com suporte a `*` para capturar o restante."],
      ["O que é truthiness em Python?", "Objetos têm valor booleano implícito: vazio/zero/None são falsy; o resto é truthy, via `__bool__`/`__len__`."],
      ["Para que serve o `None` e como testá-lo corretamente?", "Representa ausência de valor; compare com `is None`, nunca com `==`."],
      ["O que são argumentos posicionais e nomeados (keyword)?", "Posicionais são casados por ordem; nomeados por nome, permitindo clareza e valores padrão."],
      ["O que é uma list comprehension?", "Sintaxe concisa para construir listas a partir de um iterável com filtro/transformação, geralmente mais legível que loops."],
      ["Como converter tipos com segurança (ex.: str para int)?", "Use as funções de conversão dentro de try/except para tratar entradas inválidas."],
      ["O que é indentação significativa em Python?", "A indentação define blocos; consistência (4 espaços) é obrigatória e substitui chaves."],
      ["Qual a diferença entre `append` e `extend` em listas?", "`append` adiciona um elemento; `extend` concatena os elementos de um iterável."],
      ["O que é slicing e como usá-lo?", "Seleciona subsequências com `[início:fim:passo]`; `s[::-1]` inverte."],
    ],
    pleno: [
      ["Por que usar argumento padrão mutável é perigoso?", "O padrão é avaliado uma vez na definição; uma lista/dict padrão é compartilhada entre chamadas. Use `None` e crie dentro."],
      ["O que são *args e **kwargs e quando usá-los?", "Capturam argumentos posicionais e nomeados variáveis; úteis para encaminhamento e APIs flexíveis."],
      ["O que é um gerador e qual sua vantagem sobre uma lista?", "Produz valores sob demanda com `yield`, mantendo estado e economizando memória (lazy evaluation)."],
      ["Como funciona o escopo LEGB?", "Resolução de nomes em Local, Enclosing, Global, Built-in, nessa ordem; `global`/`nonlocal` alteram a ligação."],
      ["O que é um closure?", "Função que captura variáveis do escopo onde foi definida, mantendo-as vivas após o retorno do enclosing."],
      ["Para que serve `enumerate` e `zip`?", "`enumerate` dá índice+valor; `zip` itera múltiplos iteráveis em paralelo, parando no mais curto."],
      ["O que faz `*` em `def f(a, *, b)`?", "Torna `b` keyword-only, forçando passagem por nome e melhorando legibilidade da API."],
      ["Como funcionam type hints e o que muda em runtime?", "São anotações para ferramentas/leitura; não são verificadas em runtime (a menos que use Pydantic/typeguard)."],
      ["Qual a diferença entre `copy` raso e profundo?", "Cópia rasa duplica o contêiner mas compartilha referências internas; `deepcopy` duplica recursivamente."],
      ["O que é um context manager e como criar um?", "Gerencia setup/teardown com `with`; crie via classe (`__enter__`/`__exit__`) ou `@contextmanager`."],
      ["Como `dict` mantém a ordem e por que isso importa?", "Desde 3.7 preserva ordem de inserção (garantia da linguagem), útil para serialização determinística."],
      ["O que é pattern matching (`match`/`case`)?", "Correspondência estrutural a partir de 3.10 para desestruturar e ramificar por forma do dado."],
      ["Quando usar `dataclass`?", "Para classes de dados: gera `__init__`, `__repr__`, `__eq__` e reduz boilerplate, com suporte a imutabilidade."],
      ["O que são walrus operator (`:=`) e seus usos?", "Atribui dentro de expressões, evitando recomputar valores em loops/compreensões."],
      ["Como funciona `with` para múltiplos recursos?", "Pode abrir vários no mesmo `with` ou usar `ExitStack` para número dinâmico de context managers."],
    ],
    senior: [
      ["Explique o GIL e seu impacto em concorrência.", "O Global Interpreter Lock serializa bytecode por processo no CPython; limita paralelismo de CPU em threads, não de I/O."],
      ["Como o Python gerencia memória?", "Contagem de referências + coletor cíclico para ciclos; objetos pequenos usam pools (pymalloc)."],
      ["O que são descriptors e onde aparecem?", "Objetos com `__get__/__set__/__delete__` que controlam acesso a atributos; base de `property`, métodos e ORMs."],
      ["Como funciona o MRO e o algoritmo C3?", "Define a ordem de resolução em herança múltipla de forma linear e consistente; `super()` segue o MRO."],
      ["Quando usar metaclasses em vez de alternativas?", "Só quando decorators, `__init_subclass__` ou descriptors não resolvem; controlam a criação de classes."],
      ["O que são `__slots__` e seus trade-offs?", "Eliminam o `__dict__` por instância, reduzindo memória e acelerando acesso, ao custo de flexibilidade dinâmica."],
      ["Como o import system resolve e cacheia módulos?", "Usa `sys.modules` como cache, finders/loaders e `__pycache__`; evita reimportar e permite import circular controlado."],
      ["O que é `functools.lru_cache` e seus cuidados?", "Memoiza por argumentos hasheáveis; cuidado com memória ilimitada e mutabilidade dos resultados."],
      ["Explique geradores como corrotinas (send/throw).", "Geradores podem receber valores com `send` e exceções com `throw`, base histórica das corrotinas."],
      ["Como funciona `__init_subclass__`?", "Hook chamado na criação de subclasses, permitindo validar/registrar sem metaclasse."],
    ],
    especialista: [
      ["Como o CPython compila e executa bytecode?", "Fonte vira AST, depois bytecode executado por uma máquina de pilha (ceval); `dis` revela as instruções."],
      ["O que muda com o trabalho de remoção do GIL (no-GIL/PEP 703)?", "Permite paralelismo real de threads ao custo de complexidade em contagem de referências e compatibilidade de C-extensions."],
      ["Como otimizar o uso de memória de milhões de objetos?", "`__slots__`, arrays (NumPy), `array`/`struct`, geradores, e estruturas colunares; evite overhead por objeto."],
      ["Explique o protocolo de buffer e zero-copy.", "Permite compartilhar memória entre objetos (memoryview, NumPy) sem cópia, crucial para performance de I/O e dados."],
      ["Como funciona o coletor de lixo geracional e quando desativá-lo?", "Agrupa objetos por gerações; pode ser ajustado/desativado em cargas de curta duração para reduzir pausas."],
      ["Quais cuidados ao escrever C-extensions ou usar Cython?", "Gerência manual de refs, GIL, segurança de exceções e ABI; medir ganho real versus complexidade."],
    ],
  },

  "Estruturas de Dados": {
    junior: [
      ["Qual a complexidade de busca em lista vs dict?", "Lista é O(n) (busca linear); dict é O(1) médio via hashing."],
      ["O que é um set e quando usá-lo?", "Coleção não ordenada de elementos únicos com pertinência O(1); ideal para deduplicar e testar associação."],
      ["O que é uma pilha e uma fila?", "Pilha é LIFO; fila é FIFO. Em Python, lista serve de pilha e `deque` de fila eficiente."],
      ["Por que usar `collections.deque`?", "Inserção/remoção O(1) nas duas pontas, ao contrário de lista (O(n) no início)."],
      ["O que é um dicionário e como funciona a chave?", "Mapeia chaves hasheáveis a valores; a chave precisa ser imutável e ter `__hash__`."],
      ["Como ordenar uma lista de dicionários por um campo?", "Use `sorted(lst, key=lambda d: d['campo'])`."],
      ["O que faz `Counter`?", "Conta ocorrências de elementos de um iterável e oferece `most_common`."],
      ["Qual a diferença entre `sort` e `sorted`?", "`sort` ordena a lista in-place; `sorted` retorna uma nova lista e funciona com qualquer iterável."],
      ["O que é um `defaultdict`?", "Dict que cria um valor padrão para chaves ausentes, simplificando agrupamentos."],
      ["Como remover duplicatas preservando ordem?", "Use `dict.fromkeys(seq)` ou um set auxiliar percorrendo a sequência."],
    ],
    pleno: [
      ["Como funciona uma hash table e o que são colisões?", "Mapeia chave→índice via hash; colisões são resolvidas por encadeamento/endereçamento aberto, degradando para O(n) no pior caso."],
      ["Quando usar heap (heapq)?", "Para obter mínimo/máximo repetidamente em O(log n), filas de prioridade e top-k."],
      ["Explique busca binária e seus pré-requisitos.", "Divide o espaço ordenado pela metade a cada passo (O(log n)); exige dados ordenados."],
      ["O que é uma árvore binária de busca?", "Árvore onde esquerda<nó<direita, permitindo busca/inserção O(log n) se balanceada."],
      ["Como representar um grafo em Python?", "Lista de adjacência (dict de listas) para esparsos; matriz para densos."],
      ["Diferencie BFS e DFS.", "BFS explora por níveis (fila, menor caminho não ponderado); DFS aprofunda (pilha/recursão)."],
      ["O que é amortização (ex.: append de lista)?", "Custo médio por operação considerando realocações ocasionais; append é O(1) amortizado."],
      ["Quando uma tupla é melhor que uma lista como chave?", "Quando precisa ser hasheável e imutável para usar como chave de dict ou elemento de set."],
      ["Como achatar uma lista aninhada arbitrária?", "Recursão ou pilha explícita, verificando se cada item é iterável."],
      ["O que é uma trie e onde usá-la?", "Árvore de prefixos para busca/autocomplete eficiente de strings por caractere."],
    ],
    senior: [
      ["Compare estratégias de resolução de colisão em hashing.", "Encadeamento separado (listas) versus endereçamento aberto (probing); afetam fator de carga, cache e remoção."],
      ["Como o `dict` do CPython foi otimizado (compact dict)?", "Layout compacto separa entradas de índices, economizando memória e preservando ordem de inserção."],
      ["Quando usar union-find e qual sua complexidade?", "Conjuntos disjuntos para conectividade; quase O(1) amortizado com compressão de caminho e união por rank."],
      ["Explique programação dinâmica vs memoization.", "DP resolve subproblemas sobrepostos; memoization é top-down com cache, tabulação é bottom-up."],
      ["Como escolher entre B-tree e hash index em banco?", "B-tree suporta ordenação e range; hash é O(1) para igualdade mas não para intervalos."],
      ["O que são índices invertidos e onde aparecem?", "Mapeiam termos→documentos; base de motores de busca e full-text search."],
    ],
    especialista: [
      ["Como projetar uma estrutura para dados maiores que a memória?", "Estruturas externas (B-trees em disco), streaming, sketches probabilísticos (HyperLogLog, Bloom filter) e particionamento."],
      ["Quando usar estruturas probabilísticas como Bloom filter?", "Para testar pertinência com falso-positivo controlado e uso mínimo de memória em escala massiva."],
      ["Como otimizar localidade de cache em estruturas Python?", "Prefira arrays contíguos (NumPy), reduza indireções por objeto e processe em lote/colunar."],
    ],
  },

  POO: {
    junior: [
      ["O que é encapsulamento em Python?", "Agrupar dados e comportamento, expondo uma interface; por convenção `_` indica uso interno (não há private real)."],
      ["Diferencie atributo de instância e de classe.", "De instância pertence ao objeto; de classe é compartilhado por todas as instâncias."],
      ["O que faz `__init__`?", "Inicializa o estado de uma instância recém-criada; não é o construtor (isso é `__new__`)."],
      ["O que é herança e quando usá-la?", "Reuso de comportamento por especialização (is-a); prefira composição quando for apenas reuso (has-a)."],
      ["Para que serve `self`?", "Referência explícita à instância atual, passada automaticamente aos métodos."],
      ["O que é um `@property`?", "Expõe um método como atributo, permitindo validação/computação sem mudar a interface."],
      ["Diferencie `@staticmethod` e `@classmethod`.", "Staticmethod não recebe instância nem classe; classmethod recebe a classe (`cls`), útil para construtores alternativos."],
      ["O que faz `__str__` vs `__repr__`?", "`__str__` é legível para usuário; `__repr__` é não-ambíguo para desenvolvedores/depuração."],
    ],
    pleno: [
      ["O que é polimorfismo e duck typing?", "Mesmo contrato, comportamentos diferentes; duck typing aceita qualquer objeto que tenha os métodos esperados."],
      ["Quando preferir composição à herança?", "Quando precisa de reuso/flexibilidade sem acoplar hierarquia; favorece testabilidade e baixo acoplamento."],
      ["O que é uma classe abstrata (ABC)?", "Define interface com `@abstractmethod`, impedindo instanciar e forçando implementação nas subclasses."],
      ["Para que servem os métodos mágicos `__eq__`/`__hash__`?", "Definem igualdade e hashing; ao sobrescrever `__eq__` mantenha `__hash__` coerente (ou None)."],
      ["O que é um mixin?", "Classe pequena e sem estado que adiciona comportamento via herança múltipla de forma coesa."],
      ["Como implementar um iterável customizado?", "Implemente `__iter__` retornando um iterador com `__next__` que levanta `StopIteration`."],
      ["O que é um Protocol (typing) e qual vantagem?", "Tipagem estrutural: define interface por forma, sem herança explícita (duck typing tipado)."],
      ["Quando usar `dataclass(frozen=True)`?", "Para objetos de valor imutáveis e hasheáveis, com igualdade por valor."],
    ],
    senior: [
      ["Explique os princípios SOLID com exemplos em Python.", "SRP, OCP, LSP, ISP, DIP guiam baixo acoplamento e extensibilidade; em Python, Protocols e injeção de dependência ajudam a aplicá-los."],
      ["O que é inversão de dependência e como aplicá-la?", "Depender de abstrações (Protocol/ABC), não de implementações; injetar dependências em vez de instanciar internamente."],
      ["Quando design patterns ajudam e quando atrapalham?", "Ajudam ao reduzir complexidade existente e permitir troca de implementação; atrapalham se adicionam indireção sem necessidade."],
      ["Como modelar agregados e entidades (DDD)?", "Entidades têm identidade; objetos de valor são imutáveis; agregados definem fronteiras de consistência e transação."],
      ["Explique Strategy e Template Method.", "Strategy injeta algoritmos intercambiáveis; Template Method fixa o esqueleto e varia passos via subclasses."],
    ],
    especialista: [
      ["Como desenhar um domínio independente de framework?", "Isole regras de negócio em camadas puras (clean/hexagonal); frameworks ficam nas bordas (adapters)."],
      ["Quando aplicar CQRS e Event Sourcing?", "Quando leitura e escrita têm modelos/escala diferentes; ES guarda eventos como fonte da verdade, com trade-offs de complexidade."],
      ["Como evoluir uma hierarquia sem quebrar LSP?", "Garanta que subtipos honrem o contrato (pré/pós-condições, invariantes); prefira composição e interfaces segregadas."],
    ],
  },

  "Async & Concorrência": {
    junior: [
      ["O que é código assíncrono e quando usá-lo?", "Permite intercalar tarefas de I/O sem bloquear, com `async`/`await`; útil para muitas conexões simultâneas."],
      ["Diferencie I/O-bound e CPU-bound.", "I/O-bound espera por rede/disco (bom para async/threads); CPU-bound processa (precisa de multiprocessing)."],
      ["O que é `await`?", "Suspende a corrotina até o aguardável concluir, liberando o event loop para outras tarefas."],
      ["O que é o event loop?", "Agendador que executa corrotinas e callbacks de forma cooperativa em uma única thread."],
    ],
    pleno: [
      ["Como rodar tarefas async em paralelo?", "`asyncio.gather`/`TaskGroup` agenda várias corrotinas concorrentes e aguarda os resultados."],
      ["Por que threads não aceleram CPU-bound no CPython?", "O GIL serializa execução de bytecode; ganho real de CPU exige processos."],
      ["O que são cancelamento e timeout em asyncio?", "Tarefas podem ser canceladas (CancelledError) e limitadas por `asyncio.timeout`/`wait_for`."],
      ["Como limitar concorrência em chamadas async?", "Use `asyncio.Semaphore` para limitar o número de tarefas simultâneas."],
      ["Quando usar Celery/RQ?", "Para processamento em background fora do request, com retries, agendamento e escala horizontal."],
      ["Diferencie multiprocessing e multithreading.", "Processos têm memória isolada (paralelismo real de CPU); threads compartilham memória (bom para I/O)."],
    ],
    senior: [
      ["Como evitar bloquear o event loop com código síncrono?", "Rode o trabalho bloqueante em `run_in_executor`/thread pool, ou use libs async nativas."],
      ["Explique backpressure em pipelines async.", "Controle de fluxo para o produtor não sobrecarregar o consumidor, via filas limitadas e await."],
      ["Como propagar contexto (request id) em async?", "Use `contextvars`, que mantêm valores por tarefa sem vazar entre corrotinas."],
      ["Compare brokers: RabbitMQ, Kafka, Redis.", "RabbitMQ para filas/roteamento; Kafka para streaming durável e replay; Redis para filas leves e pub/sub."],
      ["Como garantir entrega e idempotência em filas?", "At-least-once + handlers idempotentes (chaves de deduplicação), DLQ e retries com backoff."],
    ],
    especialista: [
      ["Como projetar um sistema event-driven resiliente?", "Eventos imutáveis, idempotência, outbox pattern, ordering por partição e observabilidade ponta a ponta."],
      ["Quais armadilhas de estado compartilhado em concorrência?", "Race conditions, deadlocks e starvation; mitigue com locks, imutabilidade e mensagens em vez de memória compartilhada."],
      ["Como escalar WebSockets horizontalmente?", "Use um backplane (Redis pub/sub) para distribuir mensagens entre instâncias e sticky sessions/affinity."],
    ],
  },

  "APIs & Web": {
    junior: [
      ["O que é uma API REST?", "Estilo que expõe recursos via HTTP com verbos, status codes e representações (JSON), sem estado no servidor."],
      ["Diferencie GET, POST, PUT, PATCH e DELETE.", "GET lê; POST cria; PUT substitui; PATCH atualiza parcial; DELETE remove. PUT/DELETE são idempotentes."],
      ["O que significam os status 200, 201, 400, 401, 404, 500?", "OK, criado, requisição inválida, não autenticado, não encontrado e erro do servidor."],
      ["Por que validar a entrada da API?", "Para garantir contrato, segurança e mensagens de erro claras; FastAPI faz via Pydantic."],
      ["O que é JSON e por que é usado em APIs?", "Formato textual leve de troca de dados, interoperável e fácil de serializar."],
    ],
    pleno: [
      ["Quando escolher FastAPI, Flask ou Django?", "FastAPI para APIs async/tipadas; Flask para apps pequenos flexíveis; Django para produtos completos com admin/ORM."],
      ["O que é idempotência e por que importa?", "Repetir a operação não muda o resultado; essencial para retries seguros (PUT/DELETE)."],
      ["Como funciona autenticação com JWT?", "Token assinado contendo claims; o servidor valida a assinatura sem manter sessão, com expiração curta e refresh."],
      ["O que é paginação e quais estratégias existem?", "Limitar resultados; offset/limit (simples) ou keyset/cursor (estável e eficiente em grandes volumes)."],
      ["O que é CORS e quando configurá-lo?", "Política do navegador para requisições cross-origin; configure origens permitidas de forma restritiva."],
      ["Como versionar uma API?", "Por path (/v1), header ou media type; mantenha compatibilidade e deprecação planejada."],
      ["O que são WebSockets e quando usá-los?", "Canal bidirecional persistente para tempo real (chat, notificações), diferente do request/response."],
    ],
    senior: [
      ["Como projetar tratamento de erros consistente?", "Exceções de domínio mapeadas para respostas padronizadas (problem+json), com logs e correlation id."],
      ["Como aplicar rate limiting e proteção de endpoints?", "Limite por IP/usuário (token bucket) com Redis, mais autenticação e validação rígida."],
      ["REST, GraphQL ou gRPC: como decidir?", "REST para recursos/cache; GraphQL para consultas flexíveis do cliente; gRPC para contratos binários de alta performance."],
      ["Como garantir observabilidade em uma API?", "Logs estruturados com correlation id, métricas (latência/erros) e tracing distribuído (OpenTelemetry)."],
      ["Como desacoplar rotas, serviços e repositórios?", "Camadas claras: rota valida e orquestra; serviço tem regra; repositório isola persistência."],
    ],
    especialista: [
      ["Como projetar uma API para alta disponibilidade e escala?", "Stateless + balanceamento, cache, idempotência, circuit breakers, timeouts e degradação graciosa."],
      ["Como evoluir contratos sem quebrar consumidores?", "Mudanças aditivas, versionamento, contract testing e deprecação com métricas de uso."],
      ["Como modelar consistência em microsserviços?", "Sagas/coreografia, eventos, outbox e consistência eventual, evitando transações distribuídas síncronas."],
    ],
  },

  "Banco de Dados & ORM": {
    junior: [
      ["O que é CRUD?", "As quatro operações básicas: Create, Read, Update, Delete sobre registros."],
      ["O que é uma chave primária e estrangeira?", "PK identifica unicamente uma linha; FK referencia a PK de outra tabela, garantindo integridade."],
      ["O que é um JOIN?", "Combina linhas de tabelas por uma condição; INNER retorna correspondências, LEFT inclui todos da esquerda."],
      ["O que é um índice e por que usá-lo?", "Estrutura que acelera buscas e ordenações ao custo de espaço e escrita mais lenta."],
      ["O que é um ORM?", "Mapeia objetos para tabelas, gerando SQL; produtividade ao custo de abstrair o banco."],
    ],
    pleno: [
      ["O que é uma transação e ACID?", "Unidade atômica de trabalho; ACID garante Atomicidade, Consistência, Isolamento e Durabilidade."],
      ["O que é o problema N+1 e como evitá-lo?", "Uma query por item em loop; resolva com eager loading (join/`selectinload`)."],
      ["Quando usar SQL vs NoSQL?", "SQL para relacionamentos/consistência/consultas fortes; NoSQL para flexibilidade, escala e acesso por chave."],
      ["Para que serve o Redis?", "Cache, filas, locks, rate limiting e pub/sub em memória, com baixa latência."],
      ["O que são migrations e por que versioná-las?", "Mudanças de schema versionadas (Alembic) para evoluir o banco de forma reproduzível."],
      ["O que é normalização?", "Organizar dados para reduzir redundância e anomalias; desnormalize quando performance exigir."],
    ],
    senior: [
      ["Como analisar e otimizar uma query lenta?", "Use `EXPLAIN ANALYZE`, crie índices adequados, reescreva joins e evite full scans desnecessários."],
      ["Explique níveis de isolamento e seus fenômenos.", "Read committed, repeatable read, serializable controlam dirty/non-repeatable/phantom reads versus concorrência."],
      ["Quando separar leitura e escrita (CQRS/replicas)?", "Quando a carga de leitura domina; replicas e modelos de leitura otimizados, aceitando consistência eventual."],
      ["Como usar JSONB no PostgreSQL com sabedoria?", "Para dados semiestruturados, com índices GIN; não substitui modelagem relacional quando há relacionamentos fortes."],
      ["Como projetar índices para uma carga real?", "Baseie-se nas queries (colunas de filtro/ordenação), use índices compostos e parciais e monitore uso."],
    ],
    especialista: [
      ["Como particionar e escalar um banco relacional?", "Particionamento por chave/intervalo, sharding, replicas e arquivamento; planeje hot/cold data."],
      ["Como garantir consistência entre serviço e banco em eventos?", "Outbox pattern + CDC para publicar eventos atomicamente com a transação."],
      ["Quando migrar para um data warehouse/lakehouse?", "Quando analytics pesa sobre o OLTP; use Parquet/Delta, colunar e separação de cargas."],
    ],
  },

  "Data Science & IA": {
    junior: [
      ["Para que servem NumPy e Pandas?", "NumPy para arrays/vetorização; Pandas para análise tabular, limpeza e transformação."],
      ["O que é um DataFrame?", "Estrutura tabular bidimensional rotulada do Pandas, base de manipulação de dados."],
      ["O que é EDA (análise exploratória)?", "Examinar distribuições, faltantes e relações antes de modelar, para entender os dados."],
      ["O que é overfitting?", "Modelo que decora o treino e generaliza mal; mitigado com validação, regularização e mais dados."],
    ],
    pleno: [
      ["Por que vetorizar em vez de usar loops?", "Operações vetorizadas em C são muito mais rápidas e legíveis que loops Python."],
      ["O que é vazamento de dados (data leakage)?", "Informação do futuro/target contaminando o treino, inflando métricas; separe transformações por fold."],
      ["Como tratar dados faltantes?", "Remoção, imputação (média/mediana/modelo) ou flags, conforme o mecanismo de ausência."],
      ["Quando usar Polars em vez de Pandas?", "Para performance, execução lazy e datasets maiores, com API expressiva e paralelismo."],
      ["O que é validação cruzada?", "Avaliar o modelo em múltiplas divisões treino/teste para estimar generalização de forma robusta."],
      ["Como escolher métrica para classificação desbalanceada?", "Prefira precision/recall/F1/ROC-AUC em vez de acurácia, conforme o custo dos erros."],
    ],
    senior: [
      ["Como garantir reprodutibilidade em ML?", "Versione dados/código/artefatos (DVC/MLflow), fixe seeds e registre ambiente e hiperparâmetros."],
      ["Como colocar um modelo em produção (serving)?", "Empacote como API (FastAPI/BentoML), monitore latência e drift, e tenha rollback."],
      ["O que é drift e como monitorá-lo?", "Mudança na distribuição de dados/relação alvo ao longo do tempo; monitore métricas e estatísticas de entrada."],
      ["Como desenhar um pipeline de features robusto?", "Transformações reprodutíveis, validação de schema (Great Expectations) e separação treino/serviço (feature store)."],
    ],
    especialista: [
      ["Como avaliar e dar guardrails a um sistema com LLM/RAG?", "Grounding em fontes, avaliação de prompts, limites de custo/latência, e observabilidade de qualidade."],
      ["Como escalar treinamento/processamento de dados?", "Spark/Dask/Ray para distribuir, formatos colunares e orquestração (Airflow/Dagster)."],
      ["Como gerir custo e latência de modelos em produção?", "Cache, batching, quantização/destilação, escolha de modelo por tarefa e monitoramento de custo."],
    ],
  },

  "Testes & Qualidade": {
    junior: [
      ["Por que escrever testes automatizados?", "Reduzem regressões, documentam comportamento e dão confiança para evoluir o código."],
      ["O que é o pytest?", "Framework de testes idiomático com asserts simples, fixtures e plugins."],
      ["O que é uma fixture?", "Recurso reutilizável de setup/teardown injetado nos testes (dados, conexões, mocks)."],
      ["Diferencie teste unitário e de integração.", "Unitário isola uma unidade; integração verifica componentes juntos (ex.: banco real)."],
    ],
    pleno: [
      ["O que é mocking e quando usá-lo?", "Substituir dependências externas por dublês para isolar a unidade e tornar o teste determinístico."],
      ["O que é TDD?", "Escrever o teste antes do código (red-green-refactor), guiando o design pela necessidade."],
      ["Como medir e usar cobertura de testes?", "`pytest-cov` mostra linhas exercitadas; use como sinal, não meta — cubra comportamento crítico."],
      ["O que é property-based testing?", "Hypothesis gera muitos casos a partir de propriedades, encontrando bordas que exemplos fixos não cobrem."],
      ["Como testar código que depende do tempo?", "Injete um relógio ou use freezegun para fixar `now()`."],
    ],
    senior: [
      ["Como evitar testes frágeis e lentos?", "Teste comportamento (não detalhes), isole I/O, use fakes e paralelize (pytest-xdist)."],
      ["Como montar um pipeline de qualidade na CI?", "Lint (Ruff), formatação, mypy, testes, cobertura e scans de segurança em cada PR."],
      ["Como testar sistemas assíncronos?", "Use pytest-asyncio, controle o loop, e fakes para I/O; teste timeouts e cancelamento."],
      ["O que é contract testing e quando usar?", "Verifica que provider e consumer respeitam o contrato, evitando quebras em integrações."],
    ],
    especialista: [
      ["Como garantir qualidade em larga escala (monorepo/microsserviços)?", "Testes em camadas (pirâmide), contract testing, ambientes efêmeros e gates automatizados."],
      ["Como testar performance e carga?", "Locust/k6 para carga, benchmarks reprodutíveis e SLAs/SLOs medidos em condições realistas."],
    ],
  },

  "DevOps & Produção": {
    junior: [
      ["O que é Docker e por que usá-lo?", "Empacota a app e dependências em uma imagem reproduzível, isolando do ambiente."],
      ["O que é uma imagem e um container?", "Imagem é o template imutável; container é uma instância em execução dela."],
      ["O que é CI/CD?", "Integração e entrega contínuas: automatizar build, testes e deploy a cada mudança."],
      ["Por que não colocar segredos no código?", "Risco de vazamento; use variáveis de ambiente e secret managers."],
    ],
    pleno: [
      ["O que é um multi-stage build?", "Separar build e runtime para gerar imagens menores e mais seguras."],
      ["O que é um healthcheck e readiness?", "Sinalizam se o container está vivo/pronto para receber tráfego, usados por orquestradores."],
      ["Para que serve o docker-compose?", "Orquestrar múltiplos serviços (app, banco, cache) em desenvolvimento local."],
      ["O que faz Gunicorn/Uvicorn em produção?", "Servem a app (WSGI/ASGI) com múltiplos workers; geralmente atrás de um reverse proxy."],
      ["O que é IaC e qual vantagem?", "Infraestrutura como código (Terraform) versionável, reproduzível e revisável."],
    ],
    senior: [
      ["Quando usar Kubernetes em vez de docker-compose?", "Para escala, alta disponibilidade, rollouts e operação distribuída; compose para dev/ambientes simples."],
      ["Como projetar deploy com rollback seguro?", "Versionamento de artefatos, blue-green/canary, health gates e reversão automatizada."],
      ["Como implementar observabilidade completa?", "Logs estruturados, métricas (Prometheus/Grafana), tracing (OpenTelemetry) e alertas acionáveis."],
      ["Como reduzir o tamanho e a superfície de uma imagem?", "Base slim/distroless, multi-stage, usuário não-root e remoção de ferramentas de build."],
    ],
    especialista: [
      ["Como desenhar escalabilidade horizontal de uma app Python?", "Stateless, sessão externa (Redis), balanceamento, autoscaling e filas para trabalho assíncrono."],
      ["Como operar com confiabilidade (SRE)?", "SLIs/SLOs, error budgets, runbooks, circuit breakers, timeouts/retries e testes de caos."],
    ],
  },

  Segurança: {
    junior: [
      ["Por que nunca armazenar senha em texto puro?", "Vazamentos expõem todos os usuários; use hash forte com salt (bcrypt/argon2)."],
      ["O que é SQL injection e como prevenir?", "Injetar SQL via entrada; previna com queries parametrizadas, nunca concatenando strings."],
      ["O que é XSS?", "Injeção de script no navegador da vítima; previna com escaping/sanitização de saída."],
      ["O que é HTTPS e por que importa?", "Criptografa o tráfego, garantindo confidencialidade e integridade contra interceptação."],
    ],
    pleno: [
      ["Como funcionam JWT e seus riscos?", "Token assinado com claims; riscos incluem algoritmos fracos, expiração longa e armazenamento inseguro."],
      ["Diferencie autenticação e autorização.", "Autenticação prova quem é; autorização decide o que pode fazer (RBAC/ABAC)."],
      ["O que é CSRF e como mitigar?", "Forjar requisições autenticadas; mitigue com tokens CSRF e SameSite cookies."],
      ["Como gerar valores aleatórios seguros?", "Use o módulo `secrets`, não `random`, para tokens e senhas."],
      ["O que é o OWASP Top 10?", "Lista dos riscos mais críticos de aplicações web, guia de prevenção."],
    ],
    senior: [
      ["Como projetar autorização com RBAC e ABAC?", "RBAC por papéis; ABAC por atributos (usuário, recurso, contexto) para decisões finas."],
      ["Como gerir segredos e rotação em produção?", "Vaults/secret managers, injeção em runtime, rotação automática e princípio do menor privilégio."],
      ["Como integrar segurança na CI (DevSecOps)?", "Bandit, pip-audit/Safety, Semgrep e Trivy em cada pipeline, com gates."],
      ["Como prevenir desserialização insegura?", "Evite `pickle` em dados não confiáveis; valide e use formatos seguros (JSON com schema)."],
    ],
    especialista: [
      ["Como modelar ameaças (threat modeling) de um sistema?", "Mapeie ativos, entradas e fronteiras (STRIDE), priorize riscos e defina mitigações por design."],
      ["Como implementar OAuth2/OIDC corretamente?", "Authorization Code + PKCE, validação de tokens, escopos mínimos e rotação de refresh."],
    ],
  },

  "Arquitetura & Design": {
    junior: [
      ["O que é separação de responsabilidades?", "Cada módulo/camada tem um propósito único, facilitando manutenção e teste."],
      ["O que é acoplamento e coesão?", "Coesão alta (responsabilidades relacionadas) e acoplamento baixo (poucas dependências) são desejáveis."],
      ["O que é o padrão MVC?", "Separa Model (dados), View (apresentação) e Controller (coordenação)."],
    ],
    pleno: [
      ["O que é Clean/Hexagonal Architecture?", "Isola o domínio de detalhes externos; dependências apontam para dentro, com ports/adapters nas bordas."],
      ["Quando usar microsserviços vs monólito?", "Monólito é simples e suficiente na maioria; microsserviços para escala e times independentes, com custo operacional."],
      ["O que é injeção de dependência?", "Fornecer dependências de fora em vez de instanciá-las, melhorando testabilidade e flexibilidade."],
      ["O que é event-driven architecture?", "Componentes comunicam por eventos assíncronos, desacoplando produtores e consumidores."],
    ],
    senior: [
      ["Como decidir fronteiras de serviços (bounded contexts)?", "Pelo domínio (DDD), alinhando consistência transacional e times; evite dividir por camada técnica."],
      ["Quais trade-offs de consistência forte vs eventual?", "Forte simplifica raciocínio mas limita escala/disponibilidade; eventual escala mas exige idempotência e reconciliação."],
      ["Como evoluir um monólito para serviços com segurança?", "Strangler fig, extrair contextos, anti-corruption layer e medir antes/depois."],
    ],
    especialista: [
      ["Como projetar para resiliência em sistemas distribuídos?", "Timeouts, retries com backoff, circuit breakers, bulkheads, idempotência e degradação graciosa."],
      ["Como garantir observabilidade e governança em escala?", "Tracing distribuído, contratos versionados, padrões de time e plataformas internas."],
    ],
  },

  "Performance & Internals": {
    junior: [
      ["O que é complexidade Big O?", "Descreve o crescimento do custo (tempo/espaço) com a entrada, ignorando constantes."],
      ["Por que medir antes de otimizar?", "Otimizar sem dados ataca o lugar errado; o gargalo real costuma surpreender."],
      ["O que é uma operação O(1) vs O(n)?", "O(1) custo constante (acesso a dict); O(n) cresce linear (busca em lista)."],
    ],
    pleno: [
      ["Como fazer profiling de código Python?", "cProfile/pstats para tempo por função; line_profiler para linhas; memory_profiler para memória."],
      ["Por que concatenar strings em loop é ruim?", "Strings são imutáveis; cada concatenação copia tudo (O(n²)). Use `join`."],
      ["Como reduzir uso de memória de muitos objetos?", "`__slots__`, geradores, estruturas compactas e NumPy/arrays."],
      ["O que é vetorização e por que acelera?", "Operações em lote em C (NumPy) evitam o overhead do loop interpretado."],
    ],
    senior: [
      ["Como o GIL afeta estratégias de performance?", "Favorece async/processos para escalar; threads só ajudam em I/O ou libs que liberam o GIL."],
      ["Como interpretar um flame graph (py-spy)?", "Largura indica tempo gasto; identifique funções 'quentes' e otimize o caminho crítico."],
      ["Quando usar Cython/C-extensions/Numba?", "Para hotspots CPU-bound comprovados por profiling, medindo o ganho versus complexidade."],
    ],
    especialista: [
      ["Como otimizar throughput de um serviço de alta carga?", "Reduza alocações, use pools/conexões persistentes, batching, cache e perfis em produção (py-spy)."],
      ["Como o garbage collector impacta latência e como ajustar?", "Pausas do GC cíclico podem ser reduzidas ajustando thresholds ou desativando em jobs curtos."],
    ],
  },

  "Carreira & Boas Práticas": {
    junior: [
      ["O que é o PEP 8 e por que segui-lo?", "Guia de estilo oficial; consistência melhora legibilidade e colaboração."],
      ["Por que escrever código legível importa mais que esperto?", "Código é lido muito mais do que escrito; clareza reduz bugs e custo de manutenção."],
      ["O que colocar em um bom README?", "Objetivo, instalação, uso, testes e decisões; facilita onboarding e avaliação."],
    ],
    pleno: [
      ["Como fazer um bom code review?", "Foque em comportamento, testabilidade, segurança e clareza; seja específico e respeitoso."],
      ["O que demonstra senioridade além de código?", "Decisões de trade-off, comunicação, mentoria e foco no impacto de negócio."],
      ["Como priorizar dívida técnica?", "Pelo risco/custo de manutenção versus valor; torne-a visível e planejada."],
    ],
    senior: [
      ["Como liderar decisões técnicas em um time?", "Documente trade-offs (ADRs), alinhe contexto de negócio e busque reversibilidade."],
      ["Como avaliar a adoção de uma nova dependência?", "Necessidade real, manutenção, segurança, licença e custo de saída."],
    ],
    especialista: [
      ["Como definir padrões técnicos para múltiplos times?", "Plataformas internas, guidelines, automação de qualidade e avaliação crítica de trade-offs."],
      ["Como pensar em impacto de longo prazo de arquitetura?", "Otimize para mudança: simplicidade, fronteiras claras, observabilidade e custo operacional."],
    ],
  },
};

// ====== Cobertura do ecossistema: [nome, categoria] -> 5 perguntas por nível ======
const ECO = {
  "Fundamentos de Python": ["decorators", "geradores (generators)", "context managers", "type hints e mypy", "dataclasses", "comprehensions", "iteradores e o protocolo de iteração", "exceções e tratamento de erros", "módulos e pacotes", "ambientes virtuais (venv)", "pip e gerenciamento de dependências", "Poetry e uv", "pyproject.toml", "pattern matching (match/case)", "f-strings e formatação", "tipagem com Protocol e Generics", "functools (lru_cache, partial)", "itertools", "enum", "pathlib"],
  "Estruturas de Dados": ["dict e hashing", "set e frozenset", "collections.deque", "heapq", "namedtuple", "OrderedDict", "árvores de busca", "grafos", "tries", "filas de prioridade", "bisect", "array (módulo array)"],
  "Funções & Funcional": ["funções de alta ordem", "closures", "lambda", "map/filter/reduce", "currying e partial", "recursão"],
  POO: ["herança múltipla e MRO", "métodos mágicos (dunder)", "@property", "ABCs (classes abstratas)", "mixins", "descriptors", "metaclasses", "__slots__", "Protocols (tipagem estrutural)", "design patterns"],
  "Async & Concorrência": ["asyncio", "async/await", "httpx", "aiohttp", "Celery", "RQ", "Dramatiq", "Kafka", "RabbitMQ", "Redis Streams", "multiprocessing", "threading", "concurrent.futures", "APScheduler", "AnyIO/Trio"],
  "APIs & Web": ["FastAPI", "Flask", "Django", "Django REST Framework", "Starlette", "Pydantic", "GraphQL (Strawberry)", "gRPC", "WebSockets", "OAuth2 e OpenID Connect", "JWT", "OpenAPI/Swagger", "rate limiting", "CORS", "Jinja2", "HTMX"],
  "Banco de Dados & ORM": ["PostgreSQL", "SQLite", "MySQL", "Redis", "MongoDB", "Elasticsearch", "SQLAlchemy", "SQLModel", "Django ORM", "Alembic", "Tortoise ORM", "transações e isolamento", "índices", "JSONB no PostgreSQL"],
  "Data Science & IA": ["NumPy", "Pandas", "Polars", "DuckDB", "SciPy", "Matplotlib", "Seaborn", "Plotly", "Streamlit", "scikit-learn", "XGBoost", "PyTorch", "TensorFlow/Keras", "Hugging Face Transformers", "spaCy", "OpenCV", "Dask", "Jupyter", "Great Expectations", "MLflow", "LangChain e RAG", "vector databases (FAISS/Qdrant)"],
  "Testes & Qualidade": ["pytest", "unittest", "Hypothesis", "unittest.mock", "pytest-cov", "tox/nox", "Ruff", "Black", "mypy", "pre-commit", "factory-boy e Faker", "freezegun"],
  "DevOps & Produção": ["Docker", "Docker Compose", "Kubernetes", "Helm", "Terraform", "Ansible", "GitHub Actions", "GitLab CI", "Nginx", "Gunicorn", "Uvicorn", "Prometheus", "Grafana", "OpenTelemetry", "Sentry", "structlog/loguru", "AWS para Python (boto3)"],
  "Big Data": ["PySpark", "Ray", "Apache Airflow", "Prefect", "Dagster", "Parquet", "Delta Lake", "dbt", "Apache Flink", "Snowflake/BigQuery"],
  Segurança: ["bcrypt e argon2", "cryptography", "PyJWT", "Bandit", "pip-audit/Safety", "OWASP Top 10", "secrets", "Semgrep"],
  "Arquitetura & Design": ["Clean Architecture", "Hexagonal Architecture", "DDD", "CQRS", "Event Sourcing", "microsserviços", "monólito modular", "injeção de dependência"],
  "Performance & Internals": ["cProfile e profiling", "py-spy", "Cython", "Numba", "memory_profiler", "vetorização com NumPy", "o GIL", "garbage collection"],
};

const FRAMINGS = [
  ["junior", (x) => `O que é ${x} e para que serve no ecossistema Python?`,
    (x) => `Defina ${x} com precisão: propósito, onde se encaixa e o problema que resolve.`],
  ["pleno", (x) => `Quais as principais vantagens e limitações de ${x}?`,
    (x) => `Liste vantagens reais e limitações/custos de ${x}, conectando a cenários concretos de projeto.`],
  ["pleno", (x) => `Quando escolher ${x} e quais os trade-offs frente às alternativas?`,
    (x) => `Compare ${x} com alternativas e justifique a escolha por trade-offs (simplicidade, performance, ecossistema, manutenção).`],
  ["senior", (x) => `Quais boas práticas e armadilhas ao usar ${x} em produção?`,
    (x) => `Aponte configuração, boas práticas e armadilhas comuns de ${x} em produção (observabilidade, segurança, custo).`],
  ["especialista", (x) => `Como ${x} se comporta em escala e quais cuidados de performance e segurança?`,
    (x) => `Discuta ${x} em escala: gargalos, performance, segurança, operação e quando NÃO usar.`],
];

const out = [];
let n = 700000;
for (const [category, levels] of Object.entries(BANKS)) {
  const guide = GUIDE[category] ?? GUIDE["Fundamentos de Python"];
  for (const [seniority, items] of Object.entries(levels)) {
    for (const [question, concept, code] of items) {
      n += 1;
      out.push({
        num: n,
        question,
        category,
        seniority,
        intro: null,
        concept,
        application: guide[0],
        mistakes: guide[1],
        fix_fast: guide[2],
        code: code ?? null,
        order_index: SENIORITY[seniority] * 100000 + n,
      });
    }
  }
}

// Cobertura do ecossistema
for (const [category, items] of Object.entries(ECO)) {
  const guide = GUIDE[category] ?? GUIDE["Fundamentos de Python"];
  for (const item of items) {
    for (const [seniority, q, c] of FRAMINGS) {
      n += 1;
      out.push({
        num: n,
        question: q(item),
        category,
        seniority,
        intro: null,
        concept: c(item),
        application: guide[0],
        mistakes: guide[1],
        fix_fast: guide[2],
        code: null,
        order_index: SENIORITY[seniority] * 100000 + n,
      });
    }
  }
}

writeFileSync(
  join(process.cwd(), "supabase", "questions_expansion.json"),
  JSON.stringify(out),
);
const byS = {};
for (const q of out) byS[q.seniority] = (byS[q.seniority] || 0) + 1;
console.log(`Novas perguntas: ${out.length}`);
console.log("Por senioridade:", byS, "| categorias:", Object.keys(BANKS).length);
