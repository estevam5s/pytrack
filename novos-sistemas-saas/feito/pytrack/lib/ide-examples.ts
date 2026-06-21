// Biblioteca de exemplos da IDE Python — completos e prontos para rodar.
export interface IdeExample {
  category: string;
  label: string;
  code: string;
}

export const IDE_EXAMPLES: IdeExample[] = [
  // ─────────────── Fundamentos ───────────────
  { category: "Fundamentos", label: "Olá, mundo", code: `print("Olá, mundo! 🐍")` },
  { category: "Fundamentos", label: "Variáveis e tipos", code: `nome = "Ana"\nidade = 28\naltura = 1.68\nativo = True\nprint(nome, idade, altura, ativo)\nprint(type(nome), type(idade), type(altura), type(ativo))` },
  { category: "Fundamentos", label: "Entrada e f-strings", code: `nome = "Maria"\nidade = 30\nprint(f"{nome} tem {idade} anos e nasceu em {2026 - idade}.")` },
  { category: "Fundamentos", label: "Operadores", code: `a, b = 17, 5\nprint("soma:", a + b)\nprint("divisão:", a / b)\nprint("inteira:", a // b)\nprint("resto:", a % b)\nprint("potência:", a ** 2)` },
  { category: "Fundamentos", label: "Condicionais", code: `nota = 7.5\nif nota >= 9:\n    print("Excelente")\nelif nota >= 7:\n    print("Aprovado")\nelse:\n    print("Recuperação")` },
  { category: "Fundamentos", label: "Match-case", code: `comando = "iniciar"\nmatch comando:\n    case "iniciar":\n        print("Iniciando...")\n    case "parar":\n        print("Parando...")\n    case _:\n        print("Desconhecido")` },
  { category: "Fundamentos", label: "Loop for com range", code: `for i in range(1, 6):\n    print(f"Linha {i}: {'*' * i}")` },
  { category: "Fundamentos", label: "Loop while", code: `n = 10\nwhile n > 0:\n    print(n, end=" ")\n    n -= 1\nprint("\\nDecolar! 🚀")` },
  { category: "Fundamentos", label: "Break e continue", code: `for n in range(1, 21):\n    if n % 2 == 0:\n        continue\n    if n > 15:\n        break\n    print(n, end=" ")` },
  { category: "Fundamentos", label: "Conversão de tipos", code: `print(int("42") + 8)\nprint(float("3.14") * 2)\nprint(str(2026) + " PyTrack")\nprint(list("python"))` },

  // ─────────────── Strings ───────────────
  { category: "Strings", label: "Métodos de string", code: `texto = "  Python é Incrível  "\nprint(texto.strip())\nprint(texto.upper())\nprint(texto.lower())\nprint(texto.strip().replace("Incrível", "demais"))\nprint("Python" in texto)` },
  { category: "Strings", label: "Fatiamento (slicing)", code: `s = "PyTrack"\nprint(s[0])      # P\nprint(s[-1])     # k\nprint(s[0:2])    # Py\nprint(s[::-1])   # invertido\nprint(s[::2])    # de 2 em 2` },
  { category: "Strings", label: "Split e join", code: `frase = "aprender python é divertido"\npalavras = frase.split()\nprint(palavras)\nprint("-".join(palavras))\nprint(len(palavras), "palavras")` },
  { category: "Strings", label: "Contar caracteres", code: `texto = "banana"\nfrom collections import Counter\nprint(Counter(texto))\nprint("a aparece", texto.count("a"), "vezes")` },
  { category: "Strings", label: "Palíndromo", code: `def eh_palindromo(s: str) -> bool:\n    s = s.lower().replace(" ", "")\n    return s == s[::-1]\n\nfor t in ["arara", "python", "ame a ema"]:\n    print(t, "->", eh_palindromo(t))` },
  { category: "Strings", label: "Formatação de números", code: `valor = 1234567.891\nprint(f"R$ {valor:,.2f}")\nprint(f"{0.1234:.1%}")\nprint(f"{255:08b}")  # binário\nprint(f"{255:#x}")   # hexadecimal` },

  // ─────────────── Listas ───────────────
  { category: "Listas", label: "Operações com listas", code: `nums = [3, 1, 4, 1, 5, 9, 2, 6]\nnums.append(5)\nnums.sort()\nprint("ordenada:", nums)\nprint("máx:", max(nums), "mín:", min(nums), "soma:", sum(nums))\nprint("únicos:", sorted(set(nums)))` },
  { category: "Listas", label: "Compreensão de lista", code: `quadrados = [x**2 for x in range(1, 11)]\npares = [x for x in range(20) if x % 2 == 0]\nprint(quadrados)\nprint(pares)` },
  { category: "Listas", label: "Enumerate e zip", code: `frutas = ["maçã", "banana", "uva"]\nprecos = [2.5, 3.0, 8.0]\nfor i, (f, p) in enumerate(zip(frutas, precos), 1):\n    print(f"{i}. {f}: R$ {p:.2f}")` },
  { category: "Listas", label: "Ordenar por chave", code: `pessoas = [("Ana", 30), ("Bia", 25), ("Caio", 35)]\npor_idade = sorted(pessoas, key=lambda p: p[1])\nprint(por_idade)\nmais_velho = max(pessoas, key=lambda p: p[1])\nprint("mais velho:", mais_velho[0])` },
  { category: "Listas", label: "Matriz (lista de listas)", code: `matriz = [[1, 2, 3], [4, 5, 6], [7, 8, 9]]\nfor linha in matriz:\n    print(" ".join(str(x) for x in linha))\n# transposta\nt = [[linha[i] for linha in matriz] for i in range(3)]\nprint("transposta:", t)` },
  { category: "Listas", label: "Achatar lista", code: `aninhada = [[1, 2], [3, 4], [5, 6]]\nplana = [x for sub in aninhada for x in sub]\nprint(plana)` },

  // ─────────────── Dicionários e Sets ───────────────
  { category: "Dicionários", label: "Operações com dict", code: `pessoa = {"nome": "João", "idade": 25, "cidade": "SP"}\nprint(pessoa["nome"])\npessoa["email"] = "joao@email.com"\nfor chave, valor in pessoa.items():\n    print(f"{chave}: {valor}")\nprint("idade" in pessoa)` },
  { category: "Dicionários", label: "Compreensão de dict", code: `quadrados = {n: n**2 for n in range(1, 6)}\nprint(quadrados)\nprecos = {"café": 5, "pão": 2, "leite": 4}\ncaros = {k: v for k, v in precos.items() if v > 3}\nprint(caros)` },
  { category: "Dicionários", label: "Contar palavras", code: `texto = "o gato e o cão e o rato"\ncontagem = {}\nfor palavra in texto.split():\n    contagem[palavra] = contagem.get(palavra, 0) + 1\nprint(contagem)` },
  { category: "Dicionários", label: "Agrupar com defaultdict", code: `from collections import defaultdict\nalunos = [("A", 8), ("B", 6), ("A", 9), ("B", 7)]\nnotas = defaultdict(list)\nfor turma, nota in alunos:\n    notas[turma].append(nota)\nfor t, ns in notas.items():\n    print(f"Turma {t}: média {sum(ns)/len(ns):.1f}")` },
  { category: "Dicionários", label: "Operações com sets", code: `a = {1, 2, 3, 4}\nb = {3, 4, 5, 6}\nprint("união:", a | b)\nprint("interseção:", a & b)\nprint("diferença:", a - b)\nprint("simétrica:", a ^ b)` },

  // ─────────────── Funções ───────────────
  { category: "Funções", label: "Função com tipos", code: `def saudacao(nome: str, formal: bool = False) -> str:\n    return f"Prezado(a) {nome}" if formal else f"Oi, {nome}!"\n\nprint(saudacao("Ana"))\nprint(saudacao("Dr. Silva", formal=True))` },
  { category: "Funções", label: "*args e **kwargs", code: `def resumo(*numeros, **opcoes):\n    total = sum(numeros)\n    if opcoes.get("dobrar"):\n        total *= 2\n    return total\n\nprint(resumo(1, 2, 3))\nprint(resumo(1, 2, 3, dobrar=True))` },
  { category: "Funções", label: "Lambda e funções de ordem superior", code: `nums = [1, 2, 3, 4, 5, 6]\npares = list(filter(lambda x: x % 2 == 0, nums))\ndobrados = list(map(lambda x: x * 2, nums))\nprint("pares:", pares)\nprint("dobrados:", dobrados)` },
  { category: "Funções", label: "Recursão (fatorial)", code: `def fatorial(n: int) -> int:\n    return 1 if n <= 1 else n * fatorial(n - 1)\n\nfor i in range(1, 8):\n    print(f"{i}! = {fatorial(i)}")` },
  { category: "Funções", label: "Fibonacci com cache", code: `from functools import lru_cache\n\n@lru_cache(maxsize=None)\ndef fib(n: int) -> int:\n    return n if n < 2 else fib(n - 1) + fib(n - 2)\n\nprint([fib(i) for i in range(15)])` },
  { category: "Funções", label: "Closure (contador)", code: `def criar_contador():\n    contagem = 0\n    def incrementar():\n        nonlocal contagem\n        contagem += 1\n        return contagem\n    return incrementar\n\nc = criar_contador()\nprint(c(), c(), c())` },

  // ─────────────── POO ───────────────
  { category: "POO", label: "Classe básica", code: `class Carro:\n    def __init__(self, marca: str, ano: int):\n        self.marca = marca\n        self.ano = ano\n\n    def descricao(self) -> str:\n        return f"{self.marca} ({self.ano})"\n\nc = Carro("Toyota", 2024)\nprint(c.descricao())` },
  { category: "POO", label: "Herança", code: `class Animal:\n    def __init__(self, nome): self.nome = nome\n    def falar(self): return "..."\n\nclass Cachorro(Animal):\n    def falar(self): return "Au au!"\n\nclass Gato(Animal):\n    def falar(self): return "Miau!"\n\nfor a in [Cachorro("Rex"), Gato("Mimi")]:\n    print(f"{a.nome}: {a.falar()}")` },
  { category: "POO", label: "Dataclass", code: `from dataclasses import dataclass\n\n@dataclass\nclass Produto:\n    nome: str\n    preco: float\n    estoque: int = 0\n\n    def valor_total(self) -> float:\n        return self.preco * self.estoque\n\np = Produto("Notebook", 3500.0, 4)\nprint(p)\nprint("total em estoque:", p.valor_total())` },
  { category: "POO", label: "Property (getter/setter)", code: `class Conta:\n    def __init__(self, saldo=0):\n        self._saldo = saldo\n\n    @property\n    def saldo(self):\n        return self._saldo\n\n    @saldo.setter\n    def saldo(self, valor):\n        if valor < 0:\n            raise ValueError("Saldo não pode ser negativo")\n        self._saldo = valor\n\nc = Conta(100)\nc.saldo = 250\nprint("Saldo:", c.saldo)` },
  { category: "POO", label: "Métodos especiais (__str__, __eq__)", code: `class Ponto:\n    def __init__(self, x, y):\n        self.x, self.y = x, y\n    def __str__(self):\n        return f"({self.x}, {self.y})"\n    def __eq__(self, o):\n        return self.x == o.x and self.y == o.y\n    def __add__(self, o):\n        return Ponto(self.x + o.x, self.y + o.y)\n\nprint(Ponto(1, 2) + Ponto(3, 4))\nprint(Ponto(1, 1) == Ponto(1, 1))` },

  // ─────────────── Erros ───────────────
  { category: "Erros", label: "Try/except/finally", code: `def dividir(a, b):\n    try:\n        return a / b\n    except ZeroDivisionError:\n        print("Erro: divisão por zero!")\n        return None\n    finally:\n        print("Operação finalizada.")\n\nprint(dividir(10, 2))\nprint(dividir(10, 0))` },
  { category: "Erros", label: "Exceção customizada", code: `class SaldoInsuficienteError(Exception):\n    pass\n\ndef sacar(saldo, valor):\n    if valor > saldo:\n        raise SaldoInsuficienteError(f"Faltam R$ {valor - saldo:.2f}")\n    return saldo - valor\n\ntry:\n    sacar(100, 150)\nexcept SaldoInsuficienteError as e:\n    print("Falhou:", e)` },
  { category: "Erros", label: "Validação de entrada", code: `def idade_valida(valor):\n    try:\n        idade = int(valor)\n        if not 0 <= idade <= 120:\n            raise ValueError\n        return idade\n    except ValueError:\n        return None\n\nfor v in ["25", "-5", "abc", "200"]:\n    print(v, "->", idade_valida(v))` },

  // ─────────────── Geradores e Iteradores ───────────────
  { category: "Geradores", label: "Função geradora", code: `def contador(inicio, fim):\n    n = inicio\n    while n < fim:\n        yield n\n        n += 1\n\nprint(list(contador(1, 6)))\nprint(sum(contador(1, 101)))  # soma 1..100` },
  { category: "Geradores", label: "Expressão geradora", code: `quadrados = (x**2 for x in range(1, 1_000_000))\n# lazy: só calcula o que precisa\nprint(next(quadrados))\nprint(next(quadrados))\nprint("soma dos 10 primeiros:", sum(x**2 for x in range(1, 11)))` },
  { category: "Geradores", label: "Iterator customizado", code: `class Pares:\n    def __init__(self, limite): self.limite = limite\n    def __iter__(self):\n        n = 0\n        while n < self.limite:\n            yield n\n            n += 2\n\nprint(list(Pares(10)))` },

  // ─────────────── Decoradores ───────────────
  { category: "Decoradores", label: "Decorador de tempo", code: `import time\nfrom functools import wraps\n\ndef cronometrar(func):\n    @wraps(func)\n    def wrapper(*a, **k):\n        ini = time.time()\n        r = func(*a, **k)\n        print(f"{func.__name__} levou {time.time()-ini:.4f}s")\n        return r\n    return wrapper\n\n@cronometrar\ndef soma_grande():\n    return sum(range(1_000_000))\n\nprint(soma_grande())` },
  { category: "Decoradores", label: "Decorador com argumentos", code: `def repetir(vezes):\n    def deco(func):\n        def wrapper(*a, **k):\n            for _ in range(vezes):\n                func(*a, **k)\n        return wrapper\n    return deco\n\n@repetir(3)\ndef ola():\n    print("Olá!")\n\nola()` },

  // ─────────────── Coleções ───────────────
  { category: "Coleções", label: "Counter (mais comuns)", code: `from collections import Counter\ntexto = "a b a c b a d b c"\nc = Counter(texto.split())\nprint(c)\nprint("mais comuns:", c.most_common(2))` },
  { category: "Coleções", label: "namedtuple", code: `from collections import namedtuple\nPonto = namedtuple("Ponto", ["x", "y"])\np = Ponto(3, 4)\nprint(p, p.x, p.y)\nprint("distância:", (p.x**2 + p.y**2) ** 0.5)` },
  { category: "Coleções", label: "deque (fila)", code: `from collections import deque\nfila = deque(["a", "b", "c"])\nfila.append("d")\nfila.appendleft("z")\nprint(fila)\nprint("saiu:", fila.popleft())` },

  // ─────────────── Itertools / Functools ───────────────
  { category: "Itertools", label: "Combinações e permutações", code: `from itertools import combinations, permutations\nletras = "ABC"\nprint("combinações:", list(combinations(letras, 2)))\nprint("permutações:", list(permutations(letras, 2)))` },
  { category: "Itertools", label: "groupby", code: `from itertools import groupby\ndados = "aaabbbcccd"\nfor letra, grupo in groupby(dados):\n    print(letra, len(list(grupo)))` },
  { category: "Itertools", label: "reduce e accumulate", code: `from functools import reduce\nfrom itertools import accumulate\nnums = [1, 2, 3, 4, 5]\nprint("produto:", reduce(lambda a, b: a * b, nums))\nprint("somas acumuladas:", list(accumulate(nums)))` },

  // ─────────────── Datas / Math / JSON / Regex ───────────────
  { category: "Datas", label: "Trabalhar com datas", code: `from datetime import datetime, timedelta\nagora = datetime.now()\nprint("agora:", agora.strftime("%d/%m/%Y %H:%M"))\nfutura = agora + timedelta(days=30)\nprint("daqui 30 dias:", futura.strftime("%d/%m/%Y"))` },
  { category: "Datas", label: "Diferença entre datas", code: `from datetime import date\nnascimento = date(2000, 5, 15)\nhoje = date.today()\ndias = (hoje - nascimento).days\nprint(f"Você viveu {dias} dias (~{dias // 365} anos)")` },
  { category: "Matemática", label: "Módulo math", code: `import math\nprint("raiz:", math.sqrt(144))\nprint("pi:", round(math.pi, 4))\nprint("fatorial:", math.factorial(6))\nprint("mdc:", math.gcd(48, 36))\nprint("teto/piso:", math.ceil(4.1), math.floor(4.9))` },
  { category: "Matemática", label: "Números aleatórios", code: `import random\nprint("dado:", random.randint(1, 6))\nprint("escolha:", random.choice(["pedra", "papel", "tesoura"]))\nbaralho = list(range(1, 11))\nrandom.shuffle(baralho)\nprint("embaralhado:", baralho)` },
  { category: "Matemática", label: "Estatística", code: `import statistics as st\nnotas = [7.5, 8.0, 6.0, 9.5, 7.0, 8.5]\nprint("média:", st.mean(notas))\nprint("mediana:", st.median(notas))\nprint("desvio:", round(st.stdev(notas), 2))` },
  { category: "JSON", label: "Ler e escrever JSON", code: `import json\ndados = {"nome": "PyTrack", "ativo": True, "trilhas": 22}\ntexto = json.dumps(dados, indent=2, ensure_ascii=False)\nprint(texto)\nde_volta = json.loads(texto)\nprint("trilhas:", de_volta["trilhas"])` },
  { category: "Regex", label: "Expressões regulares", code: `import re\ntexto = "Contatos: ana@x.com, bia@y.org e 11 99999-8888"\nemails = re.findall(r"[\\w.]+@[\\w.]+", texto)\ntelefone = re.search(r"\\d{2} \\d{5}-\\d{4}", texto)\nprint("e-mails:", emails)\nprint("telefone:", telefone.group())` },

  // ─────────────── Algoritmos ───────────────
  { category: "Algoritmos", label: "Bubble sort", code: `def bubble_sort(lista):\n    n = len(lista)\n    for i in range(n):\n        for j in range(n - i - 1):\n            if lista[j] > lista[j+1]:\n                lista[j], lista[j+1] = lista[j+1], lista[j]\n    return lista\n\nprint(bubble_sort([64, 34, 25, 12, 22, 11, 90]))` },
  { category: "Algoritmos", label: "Busca binária", code: `def busca_binaria(lista, alvo):\n    lo, hi = 0, len(lista) - 1\n    while lo <= hi:\n        meio = (lo + hi) // 2\n        if lista[meio] == alvo: return meio\n        if lista[meio] < alvo: lo = meio + 1\n        else: hi = meio - 1\n    return -1\n\nnums = list(range(0, 100, 5))\nprint("índice de 45:", busca_binaria(nums, 45))` },
  { category: "Algoritmos", label: "Crivo de Eratóstenes", code: `def primos_ate(n):\n    crivo = [True] * (n + 1)\n    crivo[0] = crivo[1] = False\n    for i in range(2, int(n**0.5) + 1):\n        if crivo[i]:\n            for j in range(i*i, n + 1, i):\n                crivo[j] = False\n    return [i for i, p in enumerate(crivo) if p]\n\nprint(primos_ate(50))` },
  { category: "Algoritmos", label: "FizzBuzz", code: `for n in range(1, 31):\n    if n % 15 == 0: print("FizzBuzz")\n    elif n % 3 == 0: print("Fizz")\n    elif n % 5 == 0: print("Buzz")\n    else: print(n)` },
  { category: "Algoritmos", label: "Mergesort", code: `def mergesort(a):\n    if len(a) <= 1: return a\n    meio = len(a) // 2\n    esq, dir = mergesort(a[:meio]), mergesort(a[meio:])\n    res, i, j = [], 0, 0\n    while i < len(esq) and j < len(dir):\n        if esq[i] <= dir[j]: res.append(esq[i]); i += 1\n        else: res.append(dir[j]); j += 1\n    return res + esq[i:] + dir[j:]\n\nprint(mergesort([5, 2, 9, 1, 7, 3]))` },

  // ─────────────── Mini-projetos ───────────────
  { category: "Mini-projetos", label: "Calculadora de IMC", code: `def imc(peso, altura):\n    valor = peso / altura ** 2\n    if valor < 18.5: cat = "abaixo do peso"\n    elif valor < 25: cat = "peso normal"\n    elif valor < 30: cat = "sobrepeso"\n    else: cat = "obesidade"\n    return valor, cat\n\nv, c = imc(70, 1.75)\nprint(f"IMC: {v:.1f} ({c})")` },
  { category: "Mini-projetos", label: "Jogo de adivinhação", code: `import random\nsecreto = random.randint(1, 100)\ntentativas = [50, 75, 62, secreto]  # simulação\nfor t in tentativas:\n    if t == secreto:\n        print(f"Acertou! Era {secreto}")\n        break\n    print("maior" if t < secreto else "menor")` },
  { category: "Mini-projetos", label: "Conversor de temperatura", code: `def c_para_f(c): return c * 9/5 + 32\ndef f_para_c(f): return (f - 32) * 5/9\n\nfor c in [0, 25, 37, 100]:\n    print(f"{c}°C = {c_para_f(c):.1f}°F")` },
  { category: "Mini-projetos", label: "Validador de senha", code: `import re\ndef forca_senha(s):\n    criterios = {\n        "8+ caracteres": len(s) >= 8,\n        "maiúscula": bool(re.search(r"[A-Z]", s)),\n        "número": bool(re.search(r"\\d", s)),\n        "símbolo": bool(re.search(r"[^\\w]", s)),\n    }\n    for nome, ok in criterios.items():\n        print(("✅" if ok else "❌"), nome)\n    return sum(criterios.values())\n\nprint("Força:", forca_senha("Py@2026!"), "/4")` },
  { category: "Mini-projetos", label: "Lista de tarefas (CRUD em memória)", code: `tarefas = []\ndef adicionar(t): tarefas.append({"texto": t, "feita": False})\ndef concluir(i): tarefas[i]["feita"] = True\ndef listar():\n    for i, t in enumerate(tarefas):\n        print(f"{i}. [{'x' if t['feita'] else ' '}] {t['texto']}")\n\nadicionar("Estudar Python")\nadicionar("Fazer exercícios")\nconcluir(0)\nlistar()` },
  { category: "Mini-projetos", label: "Análise de texto", code: `texto = """Python é uma linguagem poderosa.\nPython é fácil de aprender e Python é versátil."""\npalavras = texto.lower().replace(".", "").replace("\\n", " ").split()\nfrom collections import Counter\nc = Counter(palavras)\nprint("palavras:", len(palavras))\nprint("únicas:", len(set(palavras)))\nprint("top 3:", c.most_common(3))` },

  // ─────────────── Pythonic (truques) ───────────────
  { category: "Pythonic", label: "Trocar variáveis", code: `a, b = 1, 2\na, b = b, a\nprint(a, b)  # 2 1` },
  { category: "Pythonic", label: "Desempacotamento", code: `primeiro, *meio, ultimo = [1, 2, 3, 4, 5]\nprint(primeiro, meio, ultimo)\n# 1 [2, 3, 4] 5` },
  { category: "Pythonic", label: "Operador ternário", code: `idade = 20\nstatus = "maior" if idade >= 18 else "menor"\nprint(status)` },
  { category: "Pythonic", label: "any e all", code: `nums = [2, 4, 6, 8]\nprint("todos pares?", all(n % 2 == 0 for n in nums))\nprint("algum > 7?", any(n > 7 for n in nums))` },
  { category: "Pythonic", label: "Encadear comparações", code: `x = 5\nprint(1 < x < 10)        # True\nprint(0 <= x <= 3)        # False` },
  { category: "Pythonic", label: "get com padrão", code: `config = {"tema": "escuro"}\nprint(config.get("idioma", "pt-BR"))  # padrão\nprint(config.setdefault("fonte", 14))` },
  { category: "Pythonic", label: "Walrus operator", code: `dados = [1, 2, 3, 4, 5, 6]\nif (n := len(dados)) > 5:\n    print(f"Lista grande: {n} itens")` },
  { category: "Pythonic", label: "zip para dict", code: `chaves = ["a", "b", "c"]\nvalores = [1, 2, 3]\nd = dict(zip(chaves, valores))\nprint(d)` },
  { category: "Pythonic", label: "sorted com reverse", code: `palavras = ["banana", "uva", "maçã", "abacaxi"]\nprint(sorted(palavras, key=len, reverse=True))` },
  { category: "Pythonic", label: "Frequência única", code: `lista = [1, 2, 2, 3, 3, 3, 4]\nfrequencia = {x: lista.count(x) for x in set(lista)}\nprint(frequencia)` },

  // ─────────────── Funcional ───────────────
  { category: "Funcional", label: "map múltiplos", code: `a = [1, 2, 3]\nb = [10, 20, 30]\nsomas = list(map(lambda x, y: x + y, a, b))\nprint(somas)` },
  { category: "Funcional", label: "filter + lambda", code: `palavras = ["py", "java", "go", "rust", "c"]\ncurtas = list(filter(lambda w: len(w) <= 2, palavras))\nprint(curtas)` },
  { category: "Funcional", label: "partial", code: `from functools import partial\ndef potencia(base, exp): return base ** exp\nquadrado = partial(potencia, exp=2)\ncubo = partial(potencia, exp=3)\nprint(quadrado(5), cubo(2))` },
  { category: "Funcional", label: "Composição de funções", code: `def compor(*funcs):\n    def aplicada(x):\n        for f in reversed(funcs):\n            x = f(x)\n        return x\n    return aplicada\n\nf = compor(lambda x: x + 1, lambda x: x * 2)\nprint(f(5))  # (5*2)+1 = 11` },

  // ─────────────── Type Hints ───────────────
  { category: "Type Hints", label: "Tipos de coleção", code: `from typing import Optional\n\ndef media(notas: list[float]) -> float:\n    return sum(notas) / len(notas) if notas else 0.0\n\ndef achar(nome: str, lista: list[str]) -> Optional[int]:\n    return lista.index(nome) if nome in lista else None\n\nprint(media([7.0, 8.5, 9.0]))\nprint(achar("py", ["go", "py", "rust"]))` },
  { category: "Type Hints", label: "TypedDict", code: `from typing import TypedDict\n\nclass Usuario(TypedDict):\n    nome: str\n    idade: int\n    ativo: bool\n\nu: Usuario = {"nome": "Ana", "idade": 30, "ativo": True}\nprint(u["nome"], "tem", u["idade"], "anos")` },

  // ─────────────── Estruturas de Dados ───────────────
  { category: "Estruturas", label: "Pilha (stack)", code: `pilha = []\npilha.append("a")\npilha.append("b")\npilha.append("c")\nprint("topo:", pilha[-1])\nprint("desempilha:", pilha.pop())\nprint("pilha:", pilha)` },
  { category: "Estruturas", label: "Fila com deque", code: `from collections import deque\nfila = deque()\nfila.append("cliente1")\nfila.append("cliente2")\nprint("atende:", fila.popleft())\nprint("aguardando:", list(fila))` },
  { category: "Estruturas", label: "Lista ligada simples", code: `class No:\n    def __init__(self, valor):\n        self.valor = valor\n        self.prox = None\n\nclass Lista:\n    def __init__(self): self.cabeca = None\n    def add(self, v):\n        no = No(v); no.prox = self.cabeca; self.cabeca = no\n    def mostrar(self):\n        atual = self.cabeca\n        while atual:\n            print(atual.valor, end=" -> "); atual = atual.prox\n        print("None")\n\nl = Lista(); l.add(1); l.add(2); l.add(3); l.mostrar()` },
  { category: "Estruturas", label: "Árvore binária (percurso)", code: `class No:\n    def __init__(self, v): self.v, self.esq, self.dir = v, None, None\n\ndef inserir(raiz, v):\n    if raiz is None: return No(v)\n    if v < raiz.v: raiz.esq = inserir(raiz.esq, v)\n    else: raiz.dir = inserir(raiz.dir, v)\n    return raiz\n\ndef em_ordem(no):\n    if no:\n        em_ordem(no.esq); print(no.v, end=" "); em_ordem(no.dir)\n\nr = None\nfor x in [5, 3, 8, 1, 4, 7, 9]: r = inserir(r, x)\nem_ordem(r)` },

  // ─────────────── Algoritmos extra ───────────────
  { category: "Algoritmos", label: "MDC e MMC", code: `def mdc(a, b):\n    while b: a, b = b, a % b\n    return a\ndef mmc(a, b): return a * b // mdc(a, b)\nprint("MDC(12,18):", mdc(12, 18))\nprint("MMC(4,6):", mmc(4, 6))` },
  { category: "Algoritmos", label: "Quicksort", code: `def quicksort(a):\n    if len(a) <= 1: return a\n    pivo = a[len(a)//2]\n    menores = [x for x in a if x < pivo]\n    iguais = [x for x in a if x == pivo]\n    maiores = [x for x in a if x > pivo]\n    return quicksort(menores) + iguais + quicksort(maiores)\n\nprint(quicksort([3, 6, 1, 8, 2, 9, 4]))` },
  { category: "Algoritmos", label: "Torre de Hanói", code: `def hanoi(n, origem, destino, aux):\n    if n == 1:\n        print(f"Mova disco 1 de {origem} para {destino}")\n        return\n    hanoi(n-1, origem, aux, destino)\n    print(f"Mova disco {n} de {origem} para {destino}")\n    hanoi(n-1, aux, destino, origem)\n\nhanoi(3, "A", "C", "B")` },
  { category: "Algoritmos", label: "Anagramas", code: `def sao_anagramas(a, b):\n    return sorted(a.lower()) == sorted(b.lower())\n\nprint(sao_anagramas("amor", "roma"))\nprint(sao_anagramas("python", "java"))` },
  { category: "Algoritmos", label: "Soma de dois (two sum)", code: `def two_sum(nums, alvo):\n    visto = {}\n    for i, n in enumerate(nums):\n        if alvo - n in visto:\n            return [visto[alvo - n], i]\n        visto[n] = i\n    return []\n\nprint(two_sum([2, 7, 11, 15], 9))` },

  // ─────────────── NumPy / Pandas (sob demanda) ───────────────
  { category: "Dados", label: "NumPy: arrays e operações", code: `import numpy as np\na = np.array([1, 2, 3, 4, 5])\nprint("array:", a)\nprint("ao quadrado:", a ** 2)\nprint("média:", a.mean(), "soma:", a.sum())\nprint("filtro >2:", a[a > 2])` },
  { category: "Dados", label: "NumPy: matriz", code: `import numpy as np\nm = np.arange(1, 10).reshape(3, 3)\nprint(m)\nprint("transposta:\\n", m.T)\nprint("diagonal:", np.diag(m))` },
  { category: "Dados", label: "Pandas: DataFrame", code: `import pandas as pd\ndf = pd.DataFrame({\n    "nome": ["Ana", "Bia", "Caio"],\n    "idade": [30, 25, 35],\n    "nota": [8.5, 9.0, 7.0],\n})\nprint(df)\nprint("\\nmédia das notas:", df["nota"].mean())\nprint("\\nmais velho:\\n", df.loc[df["idade"].idxmax()])` },
  { category: "Dados", label: "Pandas: filtrar e ordenar", code: `import pandas as pd\ndf = pd.DataFrame({"produto": ["A", "B", "C", "D"], "preco": [10, 25, 5, 40]})\ncaros = df[df["preco"] > 10].sort_values("preco", ascending=False)\nprint(caros)` },

  // ─────────────── Mini-projetos extra ───────────────
  { category: "Mini-projetos", label: "Conversor de moeda", code: `taxas = {"USD": 5.40, "EUR": 5.85, "GBP": 6.80}\ndef para_real(valor, moeda):\n    return valor * taxas.get(moeda, 0)\n\nfor m in ["USD", "EUR", "GBP"]:\n    print(f"100 {m} = R$ {para_real(100, m):.2f}")` },
  { category: "Mini-projetos", label: "Caça-palíndromos", code: `frase = "ame a ema que a panela da Anita lava"\npalavras = frase.lower().split()\npalindromos = [p for p in palavras if p == p[::-1] and len(p) > 1]\nprint("palíndromos:", palindromos)` },
  { category: "Mini-projetos", label: "Gerador de senha", code: `import random, string\ndef gerar_senha(tamanho=12):\n    chars = string.ascii_letters + string.digits + "!@#$%&*"\n    return "".join(random.choice(chars) for _ in range(tamanho))\nprint("Senha:", gerar_senha())\nprint("Senha:", gerar_senha(16))` },
  { category: "Mini-projetos", label: "Histograma ASCII", code: `dados = {"Python": 9, "JavaScript": 7, "Go": 5, "Rust": 4}\nfor lang, valor in dados.items():\n    print(f"{lang:12} | {'█' * valor} {valor}")` },
  { category: "Mini-projetos", label: "Cronômetro Pomodoro (lógica)", code: `def pomodoros(total_min):\n    ciclos = total_min // 30\n    estudo = ciclos * 25\n    pausa = ciclos * 5\n    return ciclos, estudo, pausa\n\nc, e, p = pomodoros(120)\nprint(f"{c} ciclos · {e}min de estudo · {p}min de pausa")` },
  { category: "Mini-projetos", label: "Calculadora de juros compostos", code: `def montante(principal, taxa, meses):\n    return principal * (1 + taxa) ** meses\n\np, t = 1000, 0.01  # 1% ao mês\nfor m in [6, 12, 24]:\n    print(f"{m} meses: R$ {montante(p, t, m):.2f}")` },
  { category: "Mini-projetos", label: "Verificador de ano bissexto", code: `def bissexto(ano):\n    return ano % 4 == 0 and (ano % 100 != 0 or ano % 400 == 0)\n\nfor a in [2000, 2024, 2025, 2100]:\n    print(a, "->", "bissexto" if bissexto(a) else "comum")` },
  { category: "Mini-projetos", label: "Tabuada completa", code: `for n in range(1, 11):\n    linha = "  ".join(f"{n}x{i}={n*i:2}" for i in range(1, 11))\n    print(linha)` },

  // ─────────────── Strings extra ───────────────
  { category: "Strings", label: "Capitalizar título", code: `titulo = "aprendendo python do zero"\nprint(titulo.title())\nprint(titulo.capitalize())` },
  { category: "Strings", label: "Remover acentos", code: `import unicodedata\ndef sem_acento(s):\n    nfkd = unicodedata.normalize("NFKD", s)\n    return "".join(c for c in nfkd if not unicodedata.combining(c))\nprint(sem_acento("programação é divertido, não é?"))` },
  { category: "Strings", label: "Centralizar e preencher", code: `for s in ["py", "java", "go"]:\n    print(s.center(10, "-"))\n    print(s.ljust(10, "."), "|", s.rjust(10, "."))` },

  // ─────────────── Erros extra ───────────────
  { category: "Erros", label: "Múltiplas exceções", code: `def processar(valor):\n    try:\n        n = int(valor)\n        return 100 / n\n    except ValueError:\n        return "não é número"\n    except ZeroDivisionError:\n        return "não pode ser zero"\n\nfor v in ["5", "0", "abc"]:\n    print(v, "->", processar(v))` },
  { category: "Erros", label: "Context manager (with)", code: `class Recurso:\n    def __enter__(self):\n        print("abrindo recurso")\n        return self\n    def __exit__(self, *args):\n        print("fechando recurso")\n\nwith Recurso() as r:\n    print("usando o recurso")` },

  // ─────────────── Geradores extra ───────────────
  { category: "Geradores", label: "Pipeline com geradores", code: `def numeros(n):\n    for i in range(n): yield i\ndef pares(seq):\n    for x in seq:\n        if x % 2 == 0: yield x\ndef quadrados(seq):\n    for x in seq: yield x ** 2\n\nresultado = quadrados(pares(numeros(10)))\nprint(list(resultado))` },
  { category: "Geradores", label: "yield from", code: `def sub(): yield from [1, 2, 3]\ndef principal():\n    yield from sub()\n    yield from "ABC"\nprint(list(principal()))` },

  // ─────────────── POO avançada ───────────────
  { category: "POO Avançada", label: "Classe abstrata", code: `from abc import ABC, abstractmethod\n\nclass Forma(ABC):\n    @abstractmethod\n    def area(self): ...\n\nclass Circulo(Forma):\n    def __init__(self, r): self.r = r\n    def area(self): return 3.14159 * self.r ** 2\n\nclass Quadrado(Forma):\n    def __init__(self, l): self.l = l\n    def area(self): return self.l ** 2\n\nfor f in [Circulo(5), Quadrado(4)]:\n    print(f.__class__.__name__, "->", round(f.area(), 2))` },
  { category: "POO Avançada", label: "classmethod e staticmethod", code: `class Data:\n    def __init__(self, d, m, a): self.d, self.m, self.a = d, m, a\n    @classmethod\n    def de_string(cls, s):\n        d, m, a = map(int, s.split("/"))\n        return cls(d, m, a)\n    @staticmethod\n    def eh_valida(d, m): return 1 <= d <= 31 and 1 <= m <= 12\n    def __str__(self): return f"{self.d:02}/{self.m:02}/{self.a}"\n\nprint(Data.de_string("15/03/2026"))\nprint(Data.eh_valida(31, 13))` },
  { category: "POO Avançada", label: "Mixin", code: `class JSONMixin:\n    def to_json(self):\n        import json\n        return json.dumps(self.__dict__)\n\nclass Usuario(JSONMixin):\n    def __init__(self, nome, idade):\n        self.nome, self.idade = nome, idade\n\nu = Usuario("Ana", 30)\nprint(u.to_json())` },
  { category: "POO Avançada", label: "__slots__", code: `class Ponto:\n    __slots__ = ("x", "y")  # economiza memória\n    def __init__(self, x, y): self.x, self.y = x, y\n\np = Ponto(3, 4)\nprint(p.x, p.y)\ntry:\n    p.z = 5\nexcept AttributeError as e:\n    print("Erro:", e)` },
  { category: "POO Avançada", label: "Enum", code: `from enum import Enum\n\nclass Status(Enum):\n    ATIVO = 1\n    INATIVO = 2\n    PENDENTE = 3\n\nprint(Status.ATIVO, Status.ATIVO.value)\nfor s in Status:\n    print(s.name, "=", s.value)` },
  { category: "POO Avançada", label: "Singleton", code: `class Config:\n    _instancia = None\n    def __new__(cls):\n        if cls._instancia is None:\n            cls._instancia = super().__new__(cls)\n        return cls._instancia\n\na = Config()\nb = Config()\nprint("mesma instância?", a is b)` },

  // ─────────────── Algoritmos avançados ───────────────
  { category: "Algoritmos Avançados", label: "Programação dinâmica (moedas)", code: `def min_moedas(moedas, valor):\n    dp = [float("inf")] * (valor + 1)\n    dp[0] = 0\n    for v in range(1, valor + 1):\n        for m in moedas:\n            if m <= v:\n                dp[v] = min(dp[v], dp[v - m] + 1)\n    return dp[valor]\n\nprint("mín. moedas p/ 27:", min_moedas([1, 5, 10, 25], 27))` },
  { category: "Algoritmos Avançados", label: "Busca em largura (BFS)", code: `from collections import deque\n\ngrafo = {"A": ["B", "C"], "B": ["D"], "C": ["D", "E"], "D": ["F"], "E": ["F"], "F": []}\n\ndef bfs(inicio):\n    visitado, fila = [], deque([inicio])\n    while fila:\n        no = fila.popleft()\n        if no not in visitado:\n            visitado.append(no)\n            fila.extend(grafo[no])\n    return visitado\n\nprint("BFS:", bfs("A"))` },
  { category: "Algoritmos Avançados", label: "Busca em profundidade (DFS)", code: `grafo = {"A": ["B", "C"], "B": ["D"], "C": ["E"], "D": [], "E": ["F"], "F": []}\n\ndef dfs(no, visitado=None):\n    if visitado is None: visitado = []\n    visitado.append(no)\n    for v in grafo[no]:\n        if v not in visitado:\n            dfs(v, visitado)\n    return visitado\n\nprint("DFS:", dfs("A"))` },
  { category: "Algoritmos Avançados", label: "Maior subsequência crescente", code: `def lis(nums):\n    if not nums: return 0\n    dp = [1] * len(nums)\n    for i in range(len(nums)):\n        for j in range(i):\n            if nums[j] < nums[i]:\n                dp[i] = max(dp[i], dp[j] + 1)\n    return max(dp)\n\nprint(lis([10, 9, 2, 5, 3, 7, 101, 18]))` },
  { category: "Algoritmos Avançados", label: "Heap (fila de prioridade)", code: `import heapq\ntarefas = [(3, "média"), (1, "urgente"), (5, "baixa"), (2, "alta")]\nheapq.heapify(tarefas)\nwhile tarefas:\n    prio, nome = heapq.heappop(tarefas)\n    print(f"[{prio}] {nome}")` },
  { category: "Algoritmos Avançados", label: "Distância de Levenshtein", code: `def levenshtein(a, b):\n    if not a: return len(b)\n    if not b: return len(a)\n    if a[0] == b[0]: return levenshtein(a[1:], b[1:])\n    return 1 + min(levenshtein(a[1:], b), levenshtein(a, b[1:]), levenshtein(a[1:], b[1:]))\n\nprint(levenshtein("gato", "rato"))\nprint(levenshtein("python", "piton"))` },

  // ─────────────── Arquivos e formatos ───────────────
  { category: "Arquivos", label: "Escrever e ler arquivo", code: `# Pyodide tem um sistema de arquivos virtual\nwith open("dados.txt", "w") as f:\n    f.write("linha 1\\nlinha 2\\nlinha 3")\n\nwith open("dados.txt") as f:\n    for i, linha in enumerate(f, 1):\n        print(f"{i}: {linha.strip()}")` },
  { category: "Arquivos", label: "CSV em memória", code: `import csv, io\nbuf = io.StringIO()\nw = csv.writer(buf)\nw.writerow(["nome", "idade"])\nw.writerow(["Ana", 30])\nw.writerow(["Bia", 25])\nbuf.seek(0)\nfor linha in csv.reader(buf):\n    print(linha)` },
  { category: "Arquivos", label: "Path com pathlib", code: `from pathlib import Path\np = Path("pasta/sub/arquivo.txt")\nprint("nome:", p.name)\nprint("extensão:", p.suffix)\nprint("pai:", p.parent)\nprint("sem ext:", p.stem)` },

  // ─────────────── Datas extra ───────────────
  { category: "Datas", label: "Dia da semana", code: `from datetime import date\ndias = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado", "Domingo"]\nfor d in [date(2026, 6, 12), date(2026, 12, 25)]:\n    print(d, "->", dias[d.weekday()])` },
  { category: "Datas", label: "Contagem regressiva", code: `from datetime import date\nano_novo = date(2027, 1, 1)\nhoje = date.today()\nfaltam = (ano_novo - hoje).days\nprint(f"Faltam {faltam} dias para 2027!")` },

  // ─────────────── Matemática extra ───────────────
  { category: "Matemática", label: "Sequência de Collatz", code: `def collatz(n):\n    passos = 0\n    while n != 1:\n        n = n // 2 if n % 2 == 0 else 3 * n + 1\n        passos += 1\n    return passos\n\nfor n in [6, 27, 97]:\n    print(f"{n}: {collatz(n)} passos")` },
  { category: "Matemática", label: "Conversão de bases", code: `n = 42\nprint("binário:", bin(n))\nprint("octal:", oct(n))\nprint("hex:", hex(n))\nprint("de binário:", int("101010", 2))\nprint("de hex:", int("2a", 16))` },
  { category: "Matemática", label: "Triângulo de Pascal", code: `def pascal(n):\n    linha = [1]\n    for _ in range(n):\n        print(linha)\n        linha = [1] + [linha[i] + linha[i+1] for i in range(len(linha)-1)] + [1]\n\npascal(6)` },
  { category: "Matemática", label: "Verificar primo", code: `def eh_primo(n):\n    if n < 2: return False\n    for i in range(2, int(n**0.5) + 1):\n        if n % i == 0: return False\n    return True\n\nprimos = [n for n in range(2, 30) if eh_primo(n)]\nprint(primos)` },

  // ─────────────── Concorrência ───────────────
  { category: "Concorrência", label: "Async básico", code: `import asyncio\n\nasync def tarefa(nome, segundos):\n    print(f"{nome} iniciada")\n    await asyncio.sleep(segundos)\n    print(f"{nome} concluída")\n    return nome\n\nasync def main():\n    resultados = await asyncio.gather(\n        tarefa("A", 0.1), tarefa("B", 0.05), tarefa("C", 0.08)\n    )\n    print("todas:", resultados)\n\nasyncio.run(main())` },

  // ─────────────── Validações / utilidades ───────────────
  { category: "Utilidades", label: "Validar CPF (formato)", code: `import re\ndef cpf_formato_ok(cpf):\n    return bool(re.match(r"^\\d{3}\\.\\d{3}\\.\\d{3}-\\d{2}$", cpf))\n\nfor c in ["123.456.789-00", "12345678900"]:\n    print(c, "->", cpf_formato_ok(c))` },
  { category: "Utilidades", label: "Formatar bytes", code: `def formatar_bytes(n):\n    for unidade in ["B", "KB", "MB", "GB", "TB"]:\n        if n < 1024:\n            return f"{n:.1f} {unidade}"\n        n /= 1024\n    return f"{n:.1f} PB"\n\nfor b in [512, 1536, 5_000_000, 8_000_000_000]:\n    print(formatar_bytes(b))` },
  { category: "Utilidades", label: "Barra de progresso", code: `def barra(atual, total, largura=30):\n    pct = atual / total\n    cheio = int(largura * pct)\n    return f"[{'█' * cheio}{'░' * (largura - cheio)}] {pct:.0%}"\n\nfor i in [0, 7, 15, 23, 30]:\n    print(barra(i, 30))` },
  { category: "Utilidades", label: "Agrupar em lotes", code: `def lotes(lista, tamanho):\n    for i in range(0, len(lista), tamanho):\n        yield lista[i:i + tamanho]\n\nnums = list(range(1, 14))\nfor lote in lotes(nums, 5):\n    print(lote)` },
  { category: "Utilidades", label: "Memoization manual", code: `cache = {}\ndef fib(n):\n    if n in cache: return cache[n]\n    r = n if n < 2 else fib(n-1) + fib(n-2)\n    cache[n] = r\n    return r\n\nprint([fib(i) for i in range(20)])\nprint("itens em cache:", len(cache))` },

  // ─────────────── Jogos / simulações ───────────────
  { category: "Jogos", label: "Pedra, papel, tesoura", code: `import random\nopcoes = ["pedra", "papel", "tesoura"]\nvence = {"pedra": "tesoura", "papel": "pedra", "tesoura": "papel"}\njogador = "pedra"\ncpu = random.choice(opcoes)\nprint(f"Você: {jogador} | CPU: {cpu}")\nif jogador == cpu: print("Empate!")\nelif vence[jogador] == cpu: print("Você venceu!")\nelse: print("CPU venceu!")` },
  { category: "Jogos", label: "Forca (lógica)", code: `palavra = "python"\ntentativas = set("ptn")\nmostrado = "".join(c if c in tentativas else "_" for c in palavra)\nprint("Palavra:", mostrado)\nprint("Letras certas:", sorted(set(palavra) & tentativas))\nprint("Completou?", "_" not in mostrado)` },
  { category: "Jogos", label: "Dado viciado (simulação)", code: `import random\nfrom collections import Counter\nresultados = Counter(random.randint(1, 6) for _ in range(6000))\nfor face in range(1, 7):\n    print(f"Face {face}: {resultados[face]} ({resultados[face]/6000:.1%})")` },
  { category: "Jogos", label: "Caça ao tesouro (grid)", code: `grid = [["~"] * 5 for _ in range(5)]\ntesouro = (2, 3)\ngrid[tesouro[0]][tesouro[1]] = "X"\nfor linha in grid:\n    print(" ".join(linha))\nprint(f"\\nTesouro em linha {tesouro[0]}, coluna {tesouro[1]}")` },

  // ─────────────── Dados extra ───────────────
  { category: "Dados", label: "NumPy: estatística", code: `import numpy as np\ndados = np.array([23, 45, 12, 67, 34, 89, 21, 56])\nprint("média:", dados.mean())\nprint("mediana:", np.median(dados))\nprint("desvio:", round(dados.std(), 2))\nprint("máx/mín:", dados.max(), dados.min())\nprint("ordenado:", np.sort(dados))` },
  { category: "Dados", label: "Pandas: agrupar", code: `import pandas as pd\ndf = pd.DataFrame({\n    "setor": ["TI", "RH", "TI", "RH", "TI"],\n    "salario": [8000, 5000, 9000, 5500, 7500],\n})\nprint(df.groupby("setor")["salario"].agg(["mean", "max", "count"]))` },

  // ─────────────── Funções extra ───────────────
  { category: "Funções", label: "Função geradora de IDs", code: `def gerador_id(prefixo="ID"):\n    n = 0\n    while True:\n        n += 1\n        yield f"{prefixo}-{n:04}"\n\ng = gerador_id("USR")\nprint(next(g), next(g), next(g))` },
  { category: "Funções", label: "Validação com decorador", code: `def positivo(func):\n    def wrapper(n):\n        if n < 0:\n            raise ValueError("número deve ser positivo")\n        return func(n)\n    return wrapper\n\n@positivo\ndef raiz(n): return n ** 0.5\n\nprint(raiz(16))\ntry: raiz(-4)\nexcept ValueError as e: print("erro:", e)` },

  // ─────────────── Mini-projetos extra 2 ───────────────
  { category: "Mini-projetos", label: "Calculadora de gorjeta", code: `def dividir_conta(total, pessoas, gorjeta_pct=10):\n    com_gorjeta = total * (1 + gorjeta_pct / 100)\n    por_pessoa = com_gorjeta / pessoas\n    return com_gorjeta, por_pessoa\n\ntotal, p = dividir_conta(240, 4, 15)\nprint(f"Total com gorjeta: R$ {total:.2f}")\nprint(f"Por pessoa: R$ {p:.2f}")` },
  { category: "Mini-projetos", label: "Encurtador de URL (hash)", code: `import hashlib\ndef encurtar(url):\n    h = hashlib.md5(url.encode()).hexdigest()[:6]\n    return f"pytrack.io/{h}"\n\nfor u in ["https://pytrack.com.br/trilhas", "https://python.org"]:\n    print(u, "->", encurtar(u))` },
  { category: "Mini-projetos", label: "Sistema de votação", code: `votos = ["Python", "Java", "Python", "Go", "Python", "Java", "Rust"]\nfrom collections import Counter\nresultado = Counter(votos)\nvencedor, qtd = resultado.most_common(1)[0]\nfor lang, n in resultado.most_common():\n    print(f"{lang:8} {'■' * n} {n}")\nprint(f"\\n🏆 Vencedor: {vencedor} ({qtd} votos)")` },
  { category: "Mini-projetos", label: "Relógio digital (formatação)", code: `def formatar_tempo(segundos):\n    h, resto = divmod(segundos, 3600)\n    m, s = divmod(resto, 60)\n    return f"{h:02}:{m:02}:{s:02}"\n\nfor seg in [65, 3661, 7325, 86399]:\n    print(seg, "s =", formatar_tempo(seg))` },
  { category: "Mini-projetos", label: "Quiz interativo (lógica)", code: `perguntas = [\n    {"q": "Quem criou o Python?", "r": "Guido van Rossum"},\n    {"q": "Extensão de arquivo Python?", "r": ".py"},\n]\nrespostas = ["Guido van Rossum", ".js"]\nacertos = sum(1 for p, r in zip(perguntas, respostas) if p["r"] == r)\nprint(f"Você acertou {acertos}/{len(perguntas)}")` },
  { category: "Mini-projetos", label: "Gerador de QR (matriz ASCII)", code: `import random\nrandom.seed(42)\ntam = 12\nqr = [[random.choice("██  ") for _ in range(tam)] for _ in range(tam)]\nfor linha in qr:\n    print("".join(linha))` },

  // ─────────────── Strings extra 2 ───────────────
  { category: "Strings", label: "Inverter palavras", code: `frase = "python é incrível"\ninvertida = " ".join(reversed(frase.split()))\nprint(invertida)\nletras_invertidas = " ".join(p[::-1] for p in frase.split())\nprint(letras_invertidas)` },
  { category: "Strings", label: "Contar vogais", code: `texto = "Aprendendo Python na PyTrack"\nvogais = sum(1 for c in texto.lower() if c in "aeiou")\nconsoantes = sum(1 for c in texto.lower() if c.isalpha() and c not in "aeiou")\nprint(f"vogais: {vogais}, consoantes: {consoantes}")` },
  { category: "Strings", label: "Cifra de César", code: `def cesar(texto, desloca):\n    r = ""\n    for c in texto:\n        if c.isalpha():\n            base = ord("A") if c.isupper() else ord("a")\n            r += chr((ord(c) - base + desloca) % 26 + base)\n        else:\n            r += c\n    return r\n\ncodificado = cesar("Python", 3)\nprint("codificado:", codificado)\nprint("decodificado:", cesar(codificado, -3))` },

  // ─────────────── Listas extra 2 ───────────────
  { category: "Listas", label: "Rotacionar lista", code: `def rotacionar(lista, k):\n    k %= len(lista)\n    return lista[-k:] + lista[:-k]\n\nprint(rotacionar([1, 2, 3, 4, 5], 2))` },
  { category: "Listas", label: "Encontrar duplicatas", code: `from collections import Counter\nlista = [1, 2, 3, 2, 4, 5, 3, 3]\nduplicatas = [item for item, n in Counter(lista).items() if n > 1]\nprint("duplicatas:", duplicatas)` },
  { category: "Listas", label: "Intercalar listas", code: `a = [1, 3, 5]\nb = [2, 4, 6]\nintercalada = [x for par in zip(a, b) for x in par]\nprint(intercalada)` },
  { category: "Listas", label: "Soma de matrizes", code: `A = [[1, 2], [3, 4]]\nB = [[5, 6], [7, 8]]\nC = [[A[i][j] + B[i][j] for j in range(2)] for i in range(2)]\nfor linha in C:\n    print(linha)` },

  // ─────────────── Dicionários extra 2 ───────────────
  { category: "Dicionários", label: "Inverter dict", code: `original = {"a": 1, "b": 2, "c": 3}\ninvertido = {v: k for k, v in original.items()}\nprint(invertido)` },
  { category: "Dicionários", label: "Mesclar dicts", code: `a = {"x": 1, "y": 2}\nb = {"y": 3, "z": 4}\nprint({**a, **b})       # b sobrescreve\nprint(a | b)            # Python 3.9+` },
  { category: "Dicionários", label: "Ordenar dict por valor", code: `precos = {"café": 5, "pão": 2, "leite": 4, "ovo": 1}\nordenado = dict(sorted(precos.items(), key=lambda x: x[1]))\nprint(ordenado)` },

  // ─────────────── Testes ───────────────
  { category: "Testes", label: "assert básico", code: `def soma(a, b):\n    return a + b\n\nassert soma(2, 3) == 5\nassert soma(-1, 1) == 0\nassert soma(0, 0) == 0\nprint("Todos os asserts passaram ✓")` },
  { category: "Testes", label: "unittest", code: `import unittest\n\ndef dobro(x):\n    return x * 2\n\nclass TestDobro(unittest.TestCase):\n    def test_positivo(self):\n        self.assertEqual(dobro(4), 8)\n    def test_zero(self):\n        self.assertEqual(dobro(0), 0)\n    def test_negativo(self):\n        self.assertEqual(dobro(-3), -6)\n\nunittest.main(argv=[""], exit=False, verbosity=2)` },
  { category: "Testes", label: "Testes parametrizados", code: `casos = [(2, 4), (3, 9), (5, 25), (10, 100)]\n\ndef quadrado(n):\n    return n * n\n\nfalhas = 0\nfor entrada, esperado in casos:\n    got = quadrado(entrada)\n    ok = got == esperado\n    print(f"quadrado({entrada}) = {got} {'✓' if ok else '✗'}")\n    falhas += not ok\nprint("FALHAS:", falhas)` },
  { category: "Testes", label: "Mock simples", code: `class APIFake:\n    def __init__(self, resposta):\n        self.resposta = resposta\n        self.chamadas = 0\n    def get(self, url):\n        self.chamadas += 1\n        return self.resposta\n\napi = APIFake({"status": "ok"})\nprint(api.get("/health"))\nprint("Chamadas registradas:", api.chamadas)` },

  // ─────────────── Padrões de Projeto ───────────────
  { category: "Padrões de Projeto", label: "Singleton", code: `class Config:\n    _instancia = None\n    def __new__(cls):\n        if cls._instancia is None:\n            cls._instancia = super().__new__(cls)\n            cls._instancia.dados = {}\n        return cls._instancia\n\na = Config(); a.dados["tema"] = "dark"\nb = Config()\nprint(b.dados)\nprint("mesma instância:", a is b)` },
  { category: "Padrões de Projeto", label: "Factory", code: `class Cao:\n    def falar(self): return "Au au"\nclass Gato:\n    def falar(self): return "Miau"\n\ndef criar_animal(tipo):\n    return {"cao": Cao, "gato": Gato}[tipo]()\n\nfor t in ["cao", "gato"]:\n    print(t, "->", criar_animal(t).falar())` },
  { category: "Padrões de Projeto", label: "Observer", code: `class Evento:\n    def __init__(self):\n        self._ouvintes = []\n    def inscrever(self, fn):\n        self._ouvintes.append(fn)\n    def emitir(self, dado):\n        for fn in self._ouvintes:\n            fn(dado)\n\ne = Evento()\ne.inscrever(lambda x: print("A recebeu:", x))\ne.inscrever(lambda x: print("B recebeu:", x))\ne.emitir("nova mensagem")` },
  { category: "Padrões de Projeto", label: "Strategy", code: `pessoas = [{"nome": "Bia", "idade": 30}, {"nome": "Ana", "idade": 25}]\n\ndef ordenar(lista, estrategia):\n    return sorted(lista, key=estrategia)\n\nprint(ordenar(pessoas, lambda p: p["nome"]))\nprint(ordenar(pessoas, lambda p: p["idade"]))` },
  { category: "Padrões de Projeto", label: "Context manager", code: `class Cronometro:\n    def __enter__(self):\n        import time; self.t = time.perf_counter(); return self\n    def __exit__(self, *a):\n        import time; print(f"Levou {time.perf_counter() - self.t:.4f}s")\n\nwith Cronometro():\n    total = sum(i*i for i in range(100000))\nprint("total:", total)` },

  // ─────────────── Estruturas de Dados ───────────────
  { category: "Estruturas de Dados", label: "Pilha (stack)", code: `pilha = []\npilha.append(1); pilha.append(2); pilha.append(3)\nprint("topo:", pilha[-1])\nprint("desempilha:", pilha.pop())\nprint("pilha agora:", pilha)` },
  { category: "Estruturas de Dados", label: "Fila (deque)", code: `from collections import deque\nfila = deque()\nfila.append("a"); fila.append("b"); fila.append("c")\nprint("atende:", fila.popleft())\nprint("fila:", list(fila))` },
  { category: "Estruturas de Dados", label: "Lista ligada", code: `class No:\n    def __init__(self, valor):\n        self.valor = valor\n        self.prox = None\n\nclass Lista:\n    def __init__(self):\n        self.cabeca = None\n    def add(self, v):\n        no = No(v); no.prox = self.cabeca; self.cabeca = no\n    def mostrar(self):\n        atual, out = self.cabeca, []\n        while atual:\n            out.append(atual.valor); atual = atual.prox\n        print(" -> ".join(map(str, out)))\n\nl = Lista()\nfor x in [1, 2, 3]: l.add(x)\nl.mostrar()` },
  { category: "Estruturas de Dados", label: "Árvore binária (DFS)", code: `class No:\n    def __init__(self, v): self.v = v; self.esq = None; self.dir = None\n\nraiz = No(1)\nraiz.esq = No(2); raiz.dir = No(3)\nraiz.esq.esq = No(4); raiz.esq.dir = No(5)\n\ndef em_ordem(no):\n    if not no: return\n    em_ordem(no.esq); print(no.v, end=" "); em_ordem(no.dir)\n\nem_ordem(raiz)` },
  { category: "Estruturas de Dados", label: "Grafo (BFS)", code: `grafo = {"A": ["B", "C"], "B": ["D"], "C": ["D", "E"], "D": [], "E": []}\n\ndef bfs(inicio):\n    from collections import deque\n    visto, fila, ordem = {inicio}, deque([inicio]), []\n    while fila:\n        n = fila.popleft(); ordem.append(n)\n        for viz in grafo[n]:\n            if viz not in visto:\n                visto.add(viz); fila.append(viz)\n    return ordem\n\nprint("BFS:", bfs("A"))` },
  { category: "Estruturas de Dados", label: "Heap (prioridade)", code: `import heapq\ntarefas = [(3, "média"), (1, "urgente"), (5, "baixa"), (2, "alta")]\nheapq.heapify(tarefas)\nwhile tarefas:\n    prio, nome = heapq.heappop(tarefas)\n    print(f"[{prio}] {nome}")` },

  // ─────────────── Matemática Avançada ───────────────
  { category: "Matemática Avançada", label: "Crivo de Eratóstenes", code: `def primos_ate(n):\n    crivo = [True] * (n + 1)\n    crivo[0] = crivo[1] = False\n    for i in range(2, int(n**0.5) + 1):\n        if crivo[i]:\n            for j in range(i*i, n+1, i):\n                crivo[j] = False\n    return [i for i, p in enumerate(crivo) if p]\n\nprint(primos_ate(50))` },
  { category: "Matemática Avançada", label: "MDC e MMC", code: `from math import gcd\ndef mmc(a, b): return a * b // gcd(a, b)\nprint("MDC(48, 36) =", gcd(48, 36))\nprint("MMC(4, 6) =", mmc(4, 6))` },
  { category: "Matemática Avançada", label: "Conjectura de Collatz", code: `def collatz(n):\n    passos = 0\n    while n != 1:\n        n = n // 2 if n % 2 == 0 else 3*n + 1\n        passos += 1\n    return passos\n\nfor n in [6, 11, 27]:\n    print(f"{n}: {collatz(n)} passos")` },
  { category: "Matemática Avançada", label: "Número de Euler (e)", code: `from math import factorial\ne = sum(1 / factorial(k) for k in range(20))\nprint(f"e aprox {e:.10f}")` },
  { category: "Matemática Avançada", label: "Pi por Monte Carlo", code: `import random\ndentro = 0\nN = 100000\nfor _ in range(N):\n    x, y = random.random(), random.random()\n    if x*x + y*y <= 1:\n        dentro += 1\nprint(f"pi aprox {4 * dentro / N:.5f}")` },
  { category: "Matemática Avançada", label: "Estatística", code: `import statistics as st\ndados = [4, 8, 15, 16, 23, 42]\nprint("média:", st.mean(dados))\nprint("mediana:", st.median(dados))\nprint("desvio padrão:", round(st.pstdev(dados), 2))` },

  // ─────────────── Web & APIs (simulado) ───────────────
  { category: "Web & APIs", label: "Parsear JSON de API", code: `import json\nresposta = '{"usuario": "ana", "repos": 12, "linguagens": ["Python", "JS"]}'\ndados = json.loads(resposta)\nprint("Usuário:", dados["usuario"])\nprint("Repos:", dados["repos"])\nfor lang in dados["linguagens"]:\n    print(" -", lang)` },
  { category: "Web & APIs", label: "Montar query string", code: `from urllib.parse import urlencode\nparams = {"q": "python", "page": 2, "sort": "stars"}\nprint("?" + urlencode(params))` },
  { category: "Web & APIs", label: "Roteador HTTP simples", code: `rotas = {}\ndef rota(caminho):\n    def deco(fn):\n        rotas[caminho] = fn; return fn\n    return deco\n\n@rota("/")\ndef home(): return "Bem-vindo!"\n@rota("/sobre")\ndef sobre(): return "Página sobre"\n\nfor c in ["/", "/sobre", "/x"]:\n    print(c, "->", rotas.get(c, lambda: "404")())` },

  // ─────────────── Criptografia ───────────────
  { category: "Criptografia", label: "Cifra de César", code: `def cesar(texto, n):\n    out = []\n    for c in texto:\n        if c.isalpha():\n            base = ord("A") if c.isupper() else ord("a")\n            out.append(chr((ord(c) - base + n) % 26 + base))\n        else:\n            out.append(c)\n    return "".join(out)\n\ncifra = cesar("Python", 3)\nprint("cifrado:", cifra)\nprint("decifrado:", cesar(cifra, -3))` },
  { category: "Criptografia", label: "Hash SHA-256", code: `import hashlib\nsenha = "minha_senha_secreta"\nh = hashlib.sha256(senha.encode()).hexdigest()\nprint("SHA-256:", h)\nprint("Tamanho:", len(h), "hex chars")` },
  { category: "Criptografia", label: "Token seguro", code: `import secrets\nprint("token hex:", secrets.token_hex(16))\nprint("token url:", secrets.token_urlsafe(16))` },
  { category: "Criptografia", label: "XOR de bytes", code: `def xor(dados, chave):\n    return bytes(b ^ chave for b in dados)\n\nmsg = "segredo".encode()\ncifrado = xor(msg, 42)\nprint("cifrado:", cifrado.hex())\nprint("decifrado:", xor(cifrado, 42).decode())` },

  // ─────────────── NumPy avançado ───────────────
  { category: "NumPy", label: "Operações vetoriais", code: `import numpy as np\na = np.array([1, 2, 3, 4, 5])\nprint("ao quadrado:", a ** 2)\nprint("maiores que 2:", a[a > 2])\nprint("normalizado:", (a - a.mean()) / a.std())` },
  { category: "NumPy", label: "Álgebra linear", code: `import numpy as np\nA = np.array([[2, 1], [1, 3]])\nb = np.array([5, 10])\nx = np.linalg.solve(A, b)\nprint("solução:", x)\nprint("determinante:", round(float(np.linalg.det(A)), 2))` },
  { category: "NumPy", label: "Broadcasting", code: `import numpy as np\nmatriz = np.arange(12).reshape(3, 4)\nlinha = np.array([10, 20, 30, 40])\nprint("soma com broadcasting:\\n", matriz + linha)` },

  // ─────────────── Pandas avançado ───────────────
  { category: "Pandas", label: "DataFrame básico", code: `import pandas as pd\ndf = pd.DataFrame({\n    "produto": ["A", "B", "C", "D"],\n    "preco": [10, 25, 7, 40],\n    "qtd": [100, 30, 200, 15],\n})\ndf["total"] = df["preco"] * df["qtd"]\nprint(df)\nprint("\\nReceita total:", df["total"].sum())` },
  { category: "Pandas", label: "Groupby e agregação", code: `import pandas as pd\ndf = pd.DataFrame({\n    "setor": ["TI", "RH", "TI", "RH", "TI"],\n    "salario": [8000, 5000, 9000, 5500, 7000],\n})\nresumo = df.groupby("setor")["salario"].agg(["mean", "max", "count"])\nprint(resumo)` },
  { category: "Pandas", label: "Filtrar e ordenar", code: `import pandas as pd\ndf = pd.DataFrame({\n    "nome": ["Ana", "Bia", "Caio", "Dudu"],\n    "nota": [9.5, 6.0, 8.2, 4.5],\n})\naprovados = df[df["nota"] >= 7].sort_values("nota", ascending=False)\nprint(aprovados)` },

  // ─────────────── CLI & Texto ───────────────
  { category: "CLI & Texto", label: "Tabela ASCII", code: `dados = [("Nome", "Idade"), ("Ana", "28"), ("Carlos", "35")]\nlarg = [max(len(linha[i]) for linha in dados) for i in range(2)]\nfor linha in dados:\n    print(" | ".join(c.ljust(larg[i]) for i, c in enumerate(linha)))` },
  { category: "CLI & Texto", label: "Barra de progresso", code: `for i in range(0, 21):\n    feito = "#" * i\n    falta = "." * (20 - i)\n    pct = int(i / 20 * 100)\n    print(f"[{feito}{falta}] {pct}%")\nprint("Concluído! ✓")` },
  { category: "CLI & Texto", label: "Cores ANSI", code: `cores = {"vermelho": 31, "verde": 32, "amarelo": 33, "azul": 34, "magenta": 35}\nfor nome, cod in cores.items():\n    print(f"\\033[{cod}m{nome}\\033[0m")` },
  { category: "CLI & Texto", label: "Wrap de texto", code: `import textwrap\ntexto = "Python é uma linguagem poderosa, versátil e fácil de aprender, ideal para iniciantes e profissionais."\nfor linha in textwrap.wrap(texto, width=40):\n    print(linha)` },

  // ─────────────── Funcional avançado ───────────────
  { category: "Funcional", label: "Reduce", code: `from functools import reduce\nnums = [1, 2, 3, 4, 5]\nproduto = reduce(lambda a, b: a * b, nums)\nprint("produto:", produto)\nprint("máximo:", reduce(lambda a, b: a if a > b else b, nums))` },
  { category: "Funcional", label: "Partial", code: `from functools import partial\ndef potencia(base, expo):\n    return base ** expo\n\nquadrado = partial(potencia, expo=2)\ncubo = partial(potencia, expo=3)\nprint("5² =", quadrado(5))\nprint("3³ =", cubo(3))` },
  { category: "Funcional", label: "Compor funções", code: `def compor(*fns):\n    def interna(x):\n        for fn in reversed(fns):\n            x = fn(x)\n        return x\n    return interna\n\ndobrar = lambda x: x * 2\nincr = lambda x: x + 1\npipeline = compor(dobrar, incr)\nprint(pipeline(5))` },
  { category: "Funcional", label: "Memoização (lru_cache)", code: `from functools import lru_cache\n\n@lru_cache(maxsize=None)\ndef fib(n):\n    return n if n < 2 else fib(n-1) + fib(n-2)\n\nprint([fib(i) for i in range(15)])\nprint("cache:", fib.cache_info())` },

  // ─────────────── Mini-projetos extra ───────────────
  { category: "Mini-projetos", label: "Conversor de moedas", code: `taxas = {"USD": 5.20, "EUR": 5.65, "GBP": 6.50}\ndef converter(valor, moeda):\n    return valor * taxas.get(moeda, 1)\n\nfor m in taxas:\n    print(f"100 {m} = R$ {converter(100, m):.2f}")` },
  { category: "Mini-projetos", label: "Gerador de senha", code: `import secrets, string\ndef gerar(tam=16):\n    alfabeto = string.ascii_letters + string.digits + "!@#$%&*"\n    return "".join(secrets.choice(alfabeto) for _ in range(tam))\n\nfor _ in range(3):\n    print(gerar())` },
  { category: "Mini-projetos", label: "Calculadora de IMC", code: `def imc(peso, altura):\n    valor = peso / altura**2\n    if valor < 18.5: faixa = "abaixo do peso"\n    elif valor < 25: faixa = "peso normal"\n    elif valor < 30: faixa = "sobrepeso"\n    else: faixa = "obesidade"\n    return valor, faixa\n\nv, f = imc(70, 1.75)\nprint(f"IMC: {v:.1f} ({f})")` },
  { category: "Mini-projetos", label: "Lista de tarefas (CRUD)", code: `tarefas = []\ndef add(t): tarefas.append({"t": t, "ok": False})\ndef concluir(i): tarefas[i]["ok"] = True\ndef listar():\n    for i, x in enumerate(tarefas):\n        print(f"[{'x' if x['ok'] else ' '}] {i}: {x['t']}")\n\nadd("Estudar Python"); add("Fazer exercícios"); add("Revisar")\nconcluir(0)\nlistar()` },
  { category: "Mini-projetos", label: "Análise de frequência", code: `texto = "o rato roeu a roupa do rei de roma"\nfrom collections import Counter\nfreq = Counter(texto.split())\nfor palavra, n in freq.most_common(3):\n    print(f"{palavra}: {n}x")` },
  { category: "Mini-projetos", label: "Validador de CPF", code: `def valida_cpf(cpf):\n    cpf = "".join(filter(str.isdigit, cpf))\n    if len(cpf) != 11 or cpf == cpf[0] * 11:\n        return False\n    for i in (9, 10):\n        soma = sum(int(cpf[n]) * ((i + 1) - n) for n in range(i))\n        dig = (soma * 10 % 11) % 10\n        if dig != int(cpf[i]):\n            return False\n    return True\n\nfor c in ["529.982.247-25", "111.111.111-11"]:\n    print(c, "->", valida_cpf(c))` },
  { category: "Mini-projetos", label: "Relógio digital", code: `from datetime import datetime\nagora = datetime.now()\nprint("Data:", agora.strftime("%d/%m/%Y"))\nprint("Hora:", agora.strftime("%H:%M:%S"))` },

  // ─────────────── Concorrência extra ───────────────
  { category: "Concorrência", label: "async/await", code: `import asyncio\n\nasync def tarefa(nome, segundos):\n    await asyncio.sleep(segundos)\n    return f"{nome} terminou em {segundos}s"\n\nasync def main():\n    resultados = await asyncio.gather(\n        tarefa("A", 0.1), tarefa("B", 0.05), tarefa("C", 0.15),\n    )\n    for r in resultados:\n        print(r)\n\nawait main()` },

  // ─────────────── Type Hints extra ───────────────
  { category: "Type Hints", label: "Dataclass", code: `from dataclasses import dataclass, field\n\n@dataclass\nclass Produto:\n    nome: str\n    preco: float\n    tags: list = field(default_factory=list)\n\np = Produto("Notebook", 3500.0, ["eletrônico"])\nprint(p)\nprint("preço com desconto:", p.preco * 0.9)` },
  { category: "Type Hints", label: "Enum", code: `from enum import Enum\n\nclass Status(Enum):\n    PENDENTE = "pendente"\n    ATIVO = "ativo"\n    CANCELADO = "cancelado"\n\nfor s in Status:\n    print(f"{s.name} = {s.value}")\nprint("É ativo?", Status.ATIVO == Status("ativo"))` },

  // ─────────────── Recursão ───────────────
  { category: "Recursão", label: "Torre de Hanói", code: `def hanoi(n, origem, destino, aux):\n    if n == 1:\n        print(f"Mover disco 1: {origem} -> {destino}"); return\n    hanoi(n-1, origem, aux, destino)\n    print(f"Mover disco {n}: {origem} -> {destino}")\n    hanoi(n-1, aux, destino, origem)\n\nhanoi(3, "A", "C", "B")` },
  { category: "Recursão", label: "Soma de dígitos", code: `def soma_digitos(n):\n    return n if n < 10 else n % 10 + soma_digitos(n // 10)\n\nfor n in [123, 9999, 5]:\n    print(n, "->", soma_digitos(n))` },
  { category: "Recursão", label: "Potência rápida", code: `def potencia(base, exp):\n    if exp == 0: return 1\n    metade = potencia(base, exp // 2)\n    return metade * metade * (base if exp % 2 else 1)\n\nprint("2^10 =", potencia(2, 10))\nprint("3^5 =", potencia(3, 5))` },
  { category: "Recursão", label: "Permutações", code: `def permutar(s):\n    if len(s) <= 1: return [s]\n    out = []\n    for i, c in enumerate(s):\n        for resto in permutar(s[:i] + s[i+1:]):\n            out.append(c + resto)\n    return out\n\nprint(permutar("abc"))` },

  // ─────────────── Bitwise ───────────────
  { category: "Bitwise", label: "Operadores de bits", code: `a, b = 0b1100, 0b1010\nprint("AND:", bin(a & b))\nprint("OR :", bin(a | b))\nprint("XOR:", bin(a ^ b))\nprint("shift:", bin(a << 1))` },
  { category: "Bitwise", label: "Contar bits 1", code: `for n in [7, 255, 1024]:\n    print(f"{n} ({bin(n)}) tem {bin(n).count('1')} bits 1")` },
  { category: "Bitwise", label: "Par/ímpar com bit", code: `for n in range(6):\n    print(n, "->", "par" if n & 1 == 0 else "ímpar")` },

  // ─────────────── Regex extra ───────────────
  { category: "Regex", label: "Extrair e-mails", code: `import re\ntexto = "Contatos: ana@x.com, bruno@empresa.com.br e nao-email"\nemails = re.findall(r"[\\\\w.+-]+@[\\\\w-]+\\\\.[\\\\w.-]+", texto)\nprint(emails)` },
  { category: "Regex", label: "Substituir com grupos", code: `import re\ndata = "2026-06-21"\nbr = re.sub(r"(\\\\d{4})-(\\\\d{2})-(\\\\d{2})", r"\\\\3/\\\\2/\\\\1", data)\nprint(br)` },
  { category: "Regex", label: "Validar telefone BR", code: `import re\npadrao = re.compile(r"^\\\\(?\\\\d{2}\\\\)?\\\\s?9?\\\\d{4}-?\\\\d{4}$")\nfor t in ["(48) 99999-8888", "11988887777", "123"]:\n    print(t, "->", bool(padrao.match(t)))` },

  // ─────────────── Datas extra ───────────────
  { category: "Datas", label: "Diferença entre datas", code: `from datetime import date\nnascimento = date(1998, 3, 15)\nhoje = date(2026, 6, 21)\ndias = (hoje - nascimento).days\nprint(f"{dias} dias vividos (~{dias // 365} anos)")` },
  { category: "Datas", label: "Adicionar dias", code: `from datetime import date, timedelta\nhoje = date(2026, 6, 21)\nprint("daqui 30 dias:", hoje + timedelta(days=30))\nprint("7 dias atrás:", hoje - timedelta(days=7))` },
  { category: "Datas", label: "Dia da semana", code: `from datetime import date\ndias = ["segunda", "terça", "quarta", "quinta", "sexta", "sábado", "domingo"]\nd = date(2026, 6, 21)\nprint(d, "->", dias[d.weekday()])` },

  // ─────────────── Itertools extra ───────────────
  { category: "Itertools", label: "Combinações e permutações", code: `from itertools import combinations, permutations\nitens = ["A", "B", "C"]\nprint("combinações 2:", list(combinations(itens, 2)))\nprint("permutações 2:", list(permutations(itens, 2)))` },
  { category: "Itertools", label: "Groupby", code: `from itertools import groupby\ndados = "aaabbbcccd"\nfor letra, grupo in groupby(dados):\n    print(letra, "x", len(list(grupo)))` },
  { category: "Itertools", label: "Produto cartesiano", code: `from itertools import product\ncores = ["preto", "branco"]\ntamanhos = ["P", "M", "G"]\nfor combo in product(cores, tamanhos):\n    print(combo)` },

  // ─────────────── Geradores extra ───────────────
  { category: "Geradores", label: "Generator infinito", code: `def naturais():\n    n = 1\n    while True:\n        yield n; n += 1\n\ngen = naturais()\nprint([next(gen) for _ in range(10)])` },
  { category: "Geradores", label: "Pipeline de geradores", code: `def numeros(n):\n    yield from range(n)\ndef pares(it):\n    yield from (x for x in it if x % 2 == 0)\ndef ao_quadrado(it):\n    yield from (x*x for x in it)\n\nprint(list(ao_quadrado(pares(numeros(10)))))` },
];

export const IDE_EXAMPLE_CATEGORIES = Array.from(new Set(IDE_EXAMPLES.map((e) => e.category)));
