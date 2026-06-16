import * as vscode from "vscode";

/* ─────────────────────────  DADOS  ───────────────────────── */

const KEYWORDS = [
  "False", "None", "True", "and", "as", "assert", "async", "await", "break",
  "class", "continue", "def", "del", "elif", "else", "except", "finally",
  "for", "from", "global", "if", "import", "in", "is", "lambda", "match",
  "nonlocal", "not", "or", "pass", "raise", "return", "try", "while", "with",
  "yield", "case", "self", "cls",
];

// builtin -> [assinatura, descrição]
const BUILTINS: Record<string, [string, string]> = {
  abs: ["abs(x)", "Valor absoluto de um número."],
  aiter: ["aiter(async_iterable)", "Retorna um iterador assíncrono."],
  all: ["all(iterable)", "True se todos os elementos forem verdadeiros."],
  any: ["any(iterable)", "True se algum elemento for verdadeiro."],
  anext: ["anext(async_iterator)", "Próximo item de um iterador assíncrono."],
  ascii: ["ascii(obj)", "Representação ASCII de um objeto."],
  bin: ["bin(x)", "Converte inteiro para string binária '0b…'."],
  bool: ["bool(x=False)", "Valor booleano de um objeto."],
  breakpoint: ["breakpoint()", "Entra no depurador (pdb)."],
  bytearray: ["bytearray(...)", "Array de bytes mutável."],
  bytes: ["bytes(...)", "Sequência de bytes imutável."],
  callable: ["callable(obj)", "True se o objeto é chamável."],
  chr: ["chr(i)", "Caractere Unicode do código i."],
  classmethod: ["@classmethod", "Transforma um método em método de classe."],
  compile: ["compile(source, filename, mode)", "Compila código para objeto code."],
  complex: ["complex(real=0, imag=0)", "Número complexo."],
  delattr: ["delattr(obj, name)", "Remove um atributo do objeto."],
  dict: ["dict(**kwargs)", "Cria um dicionário."],
  dir: ["dir(obj)", "Lista atributos de um objeto."],
  divmod: ["divmod(a, b)", "Retorna (a // b, a % b)."],
  enumerate: ["enumerate(iterable, start=0)", "Itera com índice: (i, valor)."],
  eval: ["eval(expr)", "Avalia uma expressão Python (cuidado: inseguro)."],
  exec: ["exec(code)", "Executa código Python dinâmico (cuidado)."],
  filter: ["filter(function, iterable)", "Filtra itens onde function(x) é True."],
  float: ["float(x=0.0)", "Número de ponto flutuante."],
  format: ["format(value, spec='')", "Formata um valor segundo a spec."],
  frozenset: ["frozenset(iterable)", "Conjunto imutável."],
  getattr: ["getattr(obj, name, default)", "Obtém um atributo pelo nome."],
  globals: ["globals()", "Dicionário do escopo global."],
  hasattr: ["hasattr(obj, name)", "True se o objeto tem o atributo."],
  hash: ["hash(obj)", "Valor de hash do objeto."],
  help: ["help(obj)", "Ajuda interativa sobre um objeto."],
  hex: ["hex(x)", "Converte inteiro para hexadecimal '0x…'."],
  id: ["id(obj)", "Identidade (endereço) do objeto."],
  input: ["input(prompt='')", "Lê uma linha do stdin como string."],
  int: ["int(x=0, base=10)", "Número inteiro."],
  isinstance: ["isinstance(obj, classinfo)", "True se obj é instância da classe."],
  issubclass: ["issubclass(cls, classinfo)", "True se cls é subclasse."],
  iter: ["iter(obj)", "Cria um iterador."],
  len: ["len(s)", "Número de itens de um objeto."],
  list: ["list(iterable=())", "Cria uma lista."],
  locals: ["locals()", "Dicionário do escopo local."],
  map: ["map(function, iterable)", "Aplica function a cada item."],
  max: ["max(iterable, *, key=None, default)", "Maior elemento."],
  memoryview: ["memoryview(obj)", "Acesso à memória sem copiar."],
  min: ["min(iterable, *, key=None, default)", "Menor elemento."],
  next: ["next(iterator, default)", "Próximo item de um iterador."],
  object: ["object()", "Classe base de todos os objetos."],
  oct: ["oct(x)", "Converte inteiro para octal '0o…'."],
  open: ["open(file, mode='r', encoding=None)", "Abre um arquivo."],
  ord: ["ord(c)", "Código Unicode de um caractere."],
  pow: ["pow(base, exp, mod=None)", "Potência (base ** exp) % mod."],
  print: ["print(*values, sep=' ', end='\\n', file=sys.stdout)", "Imprime no stdout."],
  property: ["@property", "Cria um atributo gerenciado (getter)."],
  range: ["range(stop) | range(start, stop, step)", "Sequência de inteiros."],
  repr: ["repr(obj)", "Representação oficial do objeto."],
  reversed: ["reversed(seq)", "Iterador reverso de uma sequência."],
  round: ["round(number, ndigits=None)", "Arredonda um número."],
  set: ["set(iterable=())", "Cria um conjunto."],
  setattr: ["setattr(obj, name, value)", "Define um atributo."],
  slice: ["slice(stop) | slice(start, stop, step)", "Objeto de fatiamento."],
  sorted: ["sorted(iterable, *, key=None, reverse=False)", "Lista ordenada."],
  staticmethod: ["@staticmethod", "Transforma um método em método estático."],
  str: ["str(obj='')", "Cria uma string."],
  sum: ["sum(iterable, start=0)", "Soma os itens de um iterável."],
  super: ["super()", "Acessa métodos da superclasse."],
  tuple: ["tuple(iterable=())", "Cria uma tupla."],
  type: ["type(obj) | type(name, bases, dict)", "Tipo do objeto / cria classe."],
  vars: ["vars(obj)", "__dict__ de um objeto."],
  zip: ["zip(*iterables, strict=False)", "Agrupa iteráveis em tuplas."],
};

// módulo -> membros mais usados (nome -> dica curta)
const MODULES: Record<string, Record<string, string>> = {
  os: { getcwd: "diretório atual", listdir: "lista um diretório", mkdir: "cria diretório", makedirs: "cria diretórios recursivamente", remove: "apaga arquivo", rename: "renomeia", environ: "variáveis de ambiente (dict)", getenv: "lê variável de ambiente", path: "submódulo os.path", system: "executa comando do shell", cpu_count: "núcleos de CPU", urandom: "bytes aleatórios seguros" },
  "os.path": { join: "junta caminhos", exists: "caminho existe?", isfile: "é arquivo?", isdir: "é diretório?", basename: "nome do arquivo", dirname: "diretório do caminho", splitext: "(raiz, extensão)", abspath: "caminho absoluto", getsize: "tamanho em bytes" },
  sys: { argv: "argumentos da linha de comando", exit: "encerra o programa", path: "caminhos de import", version: "versão do Python", platform: "plataforma", stdin: "entrada padrão", stdout: "saída padrão", stderr: "erro padrão", getsizeof: "tamanho de um objeto", maxsize: "maior inteiro suportado" },
  json: { loads: "string JSON -> objeto", load: "arquivo JSON -> objeto", dumps: "objeto -> string JSON", dump: "objeto -> arquivo JSON", JSONDecodeError: "erro de parsing" },
  datetime: { datetime: "data e hora", date: "data", time: "hora", timedelta: "intervalo de tempo", timezone: "fuso horário", now: "agora (datetime.now())" },
  pathlib: { Path: "caminho orientado a objetos" },
  collections: { defaultdict: "dict com valor padrão", Counter: "contagem de itens", OrderedDict: "dict ordenado", namedtuple: "tupla nomeada", deque: "fila com 2 pontas", ChainMap: "encadeia mapas" },
  itertools: { chain: "encadeia iteráveis", count: "contador infinito", cycle: "repete em ciclo", repeat: "repete um valor", product: "produto cartesiano", permutations: "permutações", combinations: "combinações", groupby: "agrupa consecutivos", islice: "fatia um iterável", accumulate: "somas acumuladas" },
  functools: { reduce: "redução de um iterável", lru_cache: "cache de resultados", cache: "cache sem limite", partial: "fixa argumentos", wraps: "preserva metadados em decorators", cached_property: "propriedade cacheada", singledispatch: "dispatch por tipo" },
  re: { compile: "compila um padrão", match: "casa no início", search: "procura no texto", findall: "todas as ocorrências", finditer: "iterador de matches", sub: "substitui", split: "divide pelo padrão", escape: "escapa caracteres", IGNORECASE: "flag case-insensitive", MULTILINE: "flag multilinha" },
  math: { sqrt: "raiz quadrada", ceil: "teto", floor: "piso", pi: "π", e: "número de Euler", inf: "infinito", isnan: "é NaN?", pow: "potência", log: "logaritmo", sin: "seno", cos: "cosseno", factorial: "fatorial", gcd: "MDC", comb: "combinações" },
  random: { random: "float em [0,1)", randint: "inteiro no intervalo", choice: "escolhe um item", choices: "escolhe com reposição", sample: "amostra sem reposição", shuffle: "embaralha lista", uniform: "float em [a,b]", seed: "fixa a semente", gauss: "distribuição normal" },
  typing: { List: "lista tipada", Dict: "dict tipado", Tuple: "tupla tipada", Optional: "tipo | None", Union: "união de tipos", Any: "qualquer tipo", Callable: "tipo função", Iterable: "iterável", Iterator: "iterador", Sequence: "sequência", Mapping: "mapa", TypeVar: "variável de tipo", Generic: "classe genérica", Protocol: "tipagem estrutural", Literal: "valores literais", Final: "constante", Annotated: "tipo anotado", cast: "conversão de tipo" },
  asyncio: { run: "executa uma corrotina", gather: "executa em paralelo", sleep: "espera assíncrona", create_task: "agenda uma corrotina", get_event_loop: "loop de eventos", wait_for: "timeout", Queue: "fila assíncrona", Lock: "lock assíncrono", Semaphore: "semáforo", TaskGroup: "grupo de tarefas (3.11+)" },
  subprocess: { run: "executa e espera", Popen: "processo de baixo nível", check_output: "captura a saída", PIPE: "pipe de I/O", CalledProcessError: "erro de processo", DEVNULL: "descarta saída" },
  logging: { getLogger: "obtém um logger", basicConfig: "configuração básica", info: "log nível info", warning: "log nível warning", error: "log nível error", debug: "log nível debug", exception: "log de exceção", DEBUG: "nível DEBUG", INFO: "nível INFO" },
  dataclasses: { dataclass: "@dataclass", field: "configura um campo", asdict: "dataclass -> dict", astuple: "dataclass -> tupla", replace: "cópia com mudanças" },
  enum: { Enum: "enumeração", IntEnum: "enum de inteiros", auto: "valor automático", StrEnum: "enum de strings (3.11+)", Flag: "flags combináveis" },
  unittest: { TestCase: "caso de teste", main: "roda os testes", mock: "submódulo de mocks", skip: "pula um teste" },
  decimal: { Decimal: "decimal de precisão fixa", getcontext: "contexto decimal", ROUND_HALF_UP: "modo de arredondamento" },
  hashlib: { sha256: "hash SHA-256", md5: "hash MD5", sha1: "hash SHA-1", blake2b: "hash BLAKE2b", pbkdf2_hmac: "derivação de chave" },
  csv: { reader: "leitor de CSV", writer: "escritor de CSV", DictReader: "lê em dicionários", DictWriter: "escreve dicionários" },
  time: { time: "timestamp atual", sleep: "pausa em segundos", perf_counter: "contador de alta precisão", strftime: "formata data", monotonic: "relógio monotônico" },
  shutil: { copy: "copia arquivo", copytree: "copia diretório", move: "move", rmtree: "remove diretório", which: "localiza executável", disk_usage: "uso de disco" },
  uuid: { uuid4: "UUID aleatório", uuid1: "UUID por tempo+MAC", UUID: "classe UUID" },
  base64: { b64encode: "codifica base64", b64decode: "decodifica base64", urlsafe_b64encode: "base64 url-safe" },
};

// snippets -> [rótulo, corpo, descrição]
const SNIPPETS: [string, string, string][] = [
  ["main", 'def main() -> None:\n    ${0:pass}\n\n\nif __name__ == "__main__":\n    main()', "Função main + guard"],
  ["ifmain", 'if __name__ == "__main__":\n    ${0:main()}', "Guard de execução"],
  ["class", "class ${1:Nome}:\n    def __init__(self, ${2:args}) -> None:\n        ${0:pass}", "Classe com __init__"],
  ["dataclass", "from dataclasses import dataclass\n\n\n@dataclass\nclass ${1:Nome}:\n    ${2:campo}: ${3:str}\n    ${0}", "Dataclass"],
  ["def", "def ${1:nome}(${2:args}) -> ${3:None}:\n    ${0:pass}", "Função tipada"],
  ["adef", "async def ${1:nome}(${2:args}) -> ${3:None}:\n    ${0:pass}", "Função assíncrona"],
  ["try", "try:\n    ${1:pass}\nexcept ${2:Exception} as e:\n    ${0:raise}", "try/except"],
  ["tryf", "try:\n    ${1:pass}\nexcept ${2:Exception} as e:\n    ${3:raise}\nfinally:\n    ${0:pass}", "try/except/finally"],
  ["with", "with open(${1:path}, ${2:'r'}, encoding='utf-8') as f:\n    ${0:data = f.read()}", "Abrir arquivo"],
  ["forr", "for ${1:i} in range(${2:n}):\n    ${0:pass}", "for com range"],
  ["fore", "for ${1:i}, ${2:value} in enumerate(${3:iterable}):\n    ${0:pass}", "for com enumerate"],
  ["comp", "[${1:x} for ${1:x} in ${2:iterable}]", "List comprehension"],
  ["dictcomp", "{${1:k}: ${2:v} for ${1:k}, ${2:v} in ${3:items}}", "Dict comprehension"],
  ["prop", "@property\ndef ${1:nome}(self) -> ${2:str}:\n    return self._${1:nome}", "Property (getter)"],
  ["ctx", "from contextlib import contextmanager\n\n\n@contextmanager\ndef ${1:nome}():\n    ${2:# setup}\n    try:\n        yield ${3}\n    finally:\n        ${0:# teardown}", "Context manager"],
  ["test", "def test_${1:nome}() -> None:\n    ${0:assert True}", "Teste pytest"],
  ["fixture", "import pytest\n\n\n@pytest.fixture\ndef ${1:nome}():\n    ${0:return ...}", "Fixture pytest"],
  ["logger", "import logging\n\nlogger = logging.getLogger(__name__)", "Logger do módulo"],
  ["enum", "from enum import Enum\n\n\nclass ${1:Nome}(Enum):\n    ${2:OPCAO} = ${3:1}\n    ${0}", "Enum"],
  ["typeddict", "from typing import TypedDict\n\n\nclass ${1:Nome}(TypedDict):\n    ${2:campo}: ${3:str}\n    ${0}", "TypedDict"],
];

/* ─────────────────────────  PROVIDER  ───────────────────────── */

function snippetItem(label: string, body: string, detail: string): vscode.CompletionItem {
  const it = new vscode.CompletionItem(label, vscode.CompletionItemKind.Snippet);
  it.insertText = new vscode.SnippetString(body);
  it.detail = `PyTrack · ${detail}`;
  it.documentation = new vscode.MarkdownString().appendCodeblock(
    body.replace(/\$\{\d+:?([^}]*)\}/g, "$1").replace(/\$\d+/g, ""),
    "python",
  );
  it.sortText = "0_" + label; // prioriza os snippets da PyTrack
  return it;
}

export function buildBaseItems(): vscode.CompletionItem[] {
  const items: vscode.CompletionItem[] = [];

  for (const kw of KEYWORDS) {
    const it = new vscode.CompletionItem(kw, vscode.CompletionItemKind.Keyword);
    it.detail = "PyTrack · palavra-chave";
    items.push(it);
  }
  for (const [name, [sig, doc]] of Object.entries(BUILTINS)) {
    const it = new vscode.CompletionItem(name, vscode.CompletionItemKind.Function);
    it.detail = `PyTrack · builtin`;
    it.documentation = new vscode.MarkdownString(`\`${sig}\`\n\n${doc}`);
    items.push(it);
  }
  for (const mod of Object.keys(MODULES)) {
    const it = new vscode.CompletionItem(mod, vscode.CompletionItemKind.Module);
    it.detail = "PyTrack · módulo da stdlib";
    items.push(it);
  }
  for (const [label, body, detail] of SNIPPETS) {
    items.push(snippetItem(label, body, detail));
  }
  return items;
}

/** Membros de um módulo conhecido (para `modulo.`). */
export function moduleMembers(mod: string): vscode.CompletionItem[] {
  const members = MODULES[mod];
  if (!members) return [];
  return Object.entries(members).map(([name, hint]) => {
    const it = new vscode.CompletionItem(name, vscode.CompletionItemKind.Property);
    it.detail = `PyTrack · ${mod}.${name}`;
    it.documentation = new vscode.MarkdownString(hint);
    return it;
  });
}

export function knownModules(): string[] {
  return Object.keys(MODULES);
}

export const DATA = { KEYWORDS, BUILTINS, MODULES, SNIPPETS };
