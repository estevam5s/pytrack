export interface Snippet {
  title: string;
  category: string;
  code: string;
}

export const SNIPPETS: Snippet[] = [
  // ── Fundamentos ──
  { category: "Fundamentos", title: "Olá, mundo", code: 'print("Olá, mundo!")' },
  { category: "Fundamentos", title: "Variáveis e tipos", code: 'nome = "Ana"\nidade = 30\naltura = 1.65\nativo = True\nprint(f"{nome}, {idade} anos, {altura}m, ativo={ativo}")' },
  { category: "Fundamentos", title: "f-strings", code: 'preco = 19.9\nprint(f"R$ {preco:.2f}")\nprint(f"{preco = }")  # debug' },
  { category: "Fundamentos", title: "Condicionais", code: 'n = 7\nif n > 0:\n    print("positivo")\nelif n < 0:\n    print("negativo")\nelse:\n    print("zero")' },
  { category: "Fundamentos", title: "Loop for com range", code: 'for i in range(1, 6):\n    print(i, i**2)' },
  { category: "Fundamentos", title: "Loop while", code: 'n = 5\nwhile n > 0:\n    print(n)\n    n -= 1' },
  { category: "Fundamentos", title: "enumerate", code: 'frutas = ["maçã", "banana", "uva"]\nfor i, fruta in enumerate(frutas, start=1):\n    print(i, fruta)' },
  { category: "Fundamentos", title: "zip", code: 'nomes = ["Ana", "Bruno"]\nidades = [30, 25]\nfor nome, idade in zip(nomes, idades):\n    print(nome, idade)' },

  // ── Estruturas de dados ──
  { category: "Estruturas", title: "Lista — operações", code: 'nums = [3, 1, 2]\nnums.append(4)\nnums.sort()\nprint(nums, sum(nums), max(nums), len(nums))' },
  { category: "Estruturas", title: "List comprehension", code: 'pares = [x for x in range(10) if x % 2 == 0]\nquadrados = [x**2 for x in range(5)]\nprint(pares, quadrados)' },
  { category: "Estruturas", title: "Dicionário", code: 'pessoa = {"nome": "Ana", "idade": 30}\npessoa["email"] = "ana@x.com"\nfor chave, valor in pessoa.items():\n    print(chave, "->", valor)' },
  { category: "Estruturas", title: "Dict comprehension", code: 'quadrados = {n: n**2 for n in range(1, 6)}\nprint(quadrados)' },
  { category: "Estruturas", title: "Set (conjunto)", code: 'a = {1, 2, 3}\nb = {2, 3, 4}\nprint(a & b, a | b, a - b)  # interseção, união, diferença' },
  { category: "Estruturas", title: "Tupla e unpacking", code: 'ponto = (3, 4)\nx, y = ponto\nprint(x, y)\na, *resto = [1, 2, 3, 4]\nprint(a, resto)' },
  { category: "Estruturas", title: "Counter", code: 'from collections import Counter\ntexto = "banana"\nprint(Counter(texto).most_common())' },
  { category: "Estruturas", title: "defaultdict", code: 'from collections import defaultdict\ng = defaultdict(list)\ng["a"].append(1)\ng["a"].append(2)\nprint(dict(g))' },

  // ── Funções ──
  { category: "Funções", title: "Função com type hints", code: 'def soma(a: int, b: int) -> int:\n    return a + b\n\nprint(soma(2, 3))' },
  { category: "Funções", title: "Args e kwargs", code: 'def info(*args, **kwargs):\n    print("args:", args)\n    print("kwargs:", kwargs)\n\ninfo(1, 2, nome="Ana", idade=30)' },
  { category: "Funções", title: "Lambda e map/filter", code: 'nums = [1, 2, 3, 4]\ndobro = list(map(lambda x: x*2, nums))\npares = list(filter(lambda x: x%2==0, nums))\nprint(dobro, pares)' },
  { category: "Funções", title: "Decorator", code: 'import functools, time\n\ndef cronometro(fn):\n    @functools.wraps(fn)\n    def wrapper(*a, **k):\n        ini = time.perf_counter()\n        r = fn(*a, **k)\n        print(f"{fn.__name__}: {time.perf_counter()-ini:.4f}s")\n        return r\n    return wrapper\n\n@cronometro\ndef lenta():\n    sum(range(1_000_00))\n\nlenta()' },
  { category: "Funções", title: "Generator", code: 'def fib(n):\n    a, b = 0, 1\n    for _ in range(n):\n        yield a\n        a, b = b, a + b\n\nprint(list(fib(10)))' },
  { category: "Funções", title: "Cache (memoization)", code: 'from functools import lru_cache\n\n@lru_cache(maxsize=None)\ndef fib(n):\n    return n if n < 2 else fib(n-1) + fib(n-2)\n\nprint(fib(30))' },

  // ── POO ──
  { category: "POO", title: "Classe básica", code: 'class Conta:\n    def __init__(self, saldo: float = 0):\n        self.saldo = saldo\n    def depositar(self, valor: float):\n        self.saldo += valor\n    def __repr__(self):\n        return f"Conta(saldo={self.saldo})"\n\nc = Conta()\nc.depositar(100)\nprint(c)' },
  { category: "POO", title: "Dataclass", code: 'from dataclasses import dataclass\n\n@dataclass\nclass Produto:\n    nome: str\n    preco: float\n    estoque: int = 0\n\np = Produto("Café", 19.9, 5)\nprint(p)' },
  { category: "POO", title: "Herança", code: 'class Animal:\n    def som(self):\n        return "..."\n\nclass Cachorro(Animal):\n    def som(self):\n        return "au au"\n\nprint(Cachorro().som())' },
  { category: "POO", title: "Property", code: 'class Circulo:\n    def __init__(self, raio):\n        self._raio = raio\n    @property\n    def area(self):\n        return 3.14159 * self._raio ** 2\n\nprint(Circulo(2).area)' },
  { category: "POO", title: "Enum", code: 'from enum import Enum\n\nclass Cor(Enum):\n    VERMELHO = 1\n    VERDE = 2\n    AZUL = 3\n\nprint(Cor.VERDE, Cor.VERDE.value)' },

  // ── Strings ──
  { category: "Strings", title: "Métodos de string", code: 's = "  Olá Mundo  "\nprint(s.strip().lower())\nprint(s.strip().split())\nprint("-".join(["a", "b", "c"]))' },
  { category: "Strings", title: "Regex", code: 'import re\ntexto = "emails: a@x.com, b@y.com"\nemails = re.findall(r"[\\w.]+@[\\w.]+", texto)\nprint(emails)' },
  { category: "Strings", title: "Formatação de números", code: 'n = 1234567.891\nprint(f"{n:,.2f}")        # 1,234,567.89\nprint(f"{0.85:.1%}")       # 85.0%' },

  // ── Arquivos & dados ──
  { category: "Arquivos", title: "Ler/escrever arquivo", code: 'with open("dados.txt", "w") as f:\n    f.write("linha 1\\nlinha 2")\n\nwith open("dados.txt") as f:\n    print(f.read())' },
  { category: "Arquivos", title: "JSON", code: 'import json\n\ndados = {"nome": "Ana", "tags": ["py", "dev"]}\ntexto = json.dumps(dados, indent=2, ensure_ascii=False)\nprint(texto)\nprint(json.loads(texto))' },
  { category: "Arquivos", title: "CSV", code: 'import csv, io\n\nbuf = io.StringIO()\nw = csv.writer(buf)\nw.writerow(["nome", "idade"])\nw.writerow(["Ana", 30])\nprint(buf.getvalue())' },
  { category: "Arquivos", title: "pathlib", code: 'from pathlib import Path\n\np = Path("pasta/arquivo.txt")\nprint(p.name, p.suffix, p.stem, p.parent)' },

  // ── Datas ──
  { category: "Datas", title: "datetime", code: 'from datetime import datetime, timedelta\n\nagora = datetime.now()\nprint(agora.strftime("%d/%m/%Y %H:%M"))\nprint((agora + timedelta(days=7)).date())' },

  // ── Erros & testes ──
  { category: "Qualidade", title: "Try/except", code: 'try:\n    x = 10 / 0\nexcept ZeroDivisionError as e:\n    print("erro:", e)\nfinally:\n    print("sempre executa")' },
  { category: "Qualidade", title: "Exceção customizada", code: 'class SaldoInsuficiente(Exception):\n    pass\n\ndef sacar(saldo, valor):\n    if valor > saldo:\n        raise SaldoInsuficiente("Saldo insuficiente")\n    return saldo - valor\n\ntry:\n    sacar(100, 200)\nexcept SaldoInsuficiente as e:\n    print(e)' },
  { category: "Qualidade", title: "assert e testes simples", code: 'def soma(a, b):\n    return a + b\n\nassert soma(2, 3) == 5\nassert soma(-1, 1) == 0\nprint("todos os testes passaram")' },

  // ── Algoritmos ──
  { category: "Algoritmos", title: "Busca binária", code: 'def busca_binaria(lista, alvo):\n    lo, hi = 0, len(lista) - 1\n    while lo <= hi:\n        meio = (lo + hi) // 2\n        if lista[meio] == alvo:\n            return meio\n        if lista[meio] < alvo:\n            lo = meio + 1\n        else:\n            hi = meio - 1\n    return -1\n\nprint(busca_binaria([1,3,5,7,9], 7))' },
  { category: "Algoritmos", title: "Ordenação (bubble)", code: 'def bubble(a):\n    a = a[:]\n    for i in range(len(a)):\n        for j in range(len(a)-i-1):\n            if a[j] > a[j+1]:\n                a[j], a[j+1] = a[j+1], a[j]\n    return a\n\nprint(bubble([5,2,8,1,9]))' },
  { category: "Algoritmos", title: "Recursão (fatorial)", code: 'def fatorial(n):\n    return 1 if n <= 1 else n * fatorial(n-1)\n\nprint(fatorial(5))' },

  // ── Matemática & dados ──
  { category: "Dados", title: "Estatística básica", code: 'import statistics as st\nnums = [4, 8, 15, 16, 23, 42]\nprint("média:", st.mean(nums))\nprint("mediana:", st.median(nums))\nprint("desvio:", round(st.stdev(nums), 2))' },
  { category: "Dados", title: "random", code: 'import random\nrandom.seed(42)\nprint(random.randint(1, 100))\nprint(random.choice(["a", "b", "c"]))\nprint(random.sample(range(10), 3))' },
  { category: "Dados", title: "itertools", code: 'from itertools import combinations, permutations, product\nprint(list(combinations([1,2,3], 2)))\nprint(list(product([0,1], repeat=2)))' },
];

export const SNIPPET_CATEGORIES = Array.from(new Set(SNIPPETS.map((s) => s.category)));
