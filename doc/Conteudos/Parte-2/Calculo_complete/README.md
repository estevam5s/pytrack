# Matemática, Cálculo Completo e Python Científico

Trilha completa e avançada de matemática para programação, ciência de dados, engenharia, finanças, simulação e computação científica com Python. O conteúdo parte de matemática básica e avança até cálculo multivariável, séries, equações diferenciais, álgebra linear, métodos numéricos e projetos aplicados.

O objetivo não é apenas decorar fórmulas. O objetivo é entender conceitos, visualizar comportamento, resolver problemas manualmente quando necessário e implementar soluções com Python usando `math`, `decimal`, `fractions`, `numpy`, `sympy`, `matplotlib` e `scipy`.

---

## Categorias

### 1. Matemática Básica

1. [Matemática Básica Completa: números, operações, frações, potências, radicais, proporção e notação](./01_matematica_basica_completa.md)

### 2. Álgebra e Funções

2. [Álgebra e Funções: expressões, equações, inequações, polinômios, exponenciais, logaritmos e modelagem](./02_algebra_funcoes.md)

### 3. Geometria e Trigonometria

3. [Geometria e Trigonometria: plano, espaço, vetores, ângulos, áreas, volumes e funções trigonométricas](./03_geometria_trigonometria.md)

### 4. Limites e Continuidade

4. [Limites e Continuidade: intuição, cálculo algébrico, assíntotas, infinitésimos e visualização](./04_limites_continuidade.md)

### 5. Cálculo 1: Derivadas

5. [Cálculo 1: Derivadas, regras, interpretação geométrica, otimização e aplicações](./05_derivadas_calculo_1.md)

### 6. Cálculo 1: Integrais

6. [Cálculo 1: Integrais, primitivas, áreas, técnicas básicas e Teorema Fundamental](./06_integrais_calculo_1.md)

### 7. Cálculo 2: Séries e Integrais Avançadas

7. [Cálculo 2: sequências, séries, Taylor, integrais impróprias, coordenadas polares e aplicações](./07_calculo_2_series_integrais.md)

### 8. Cálculo 3: Multivariável

8. [Cálculo 3: funções de várias variáveis, derivadas parciais, gradiente, integrais múltiplas e campos vetoriais](./08_calculo_3_multivariavel.md)

### 9. Álgebra Linear

9. [Álgebra Linear: vetores, matrizes, sistemas, determinantes, autovalores, autovetores e decomposições](./09_algebra_linear.md)

### 10. Equações Diferenciais

10. [Equações Diferenciais: EDOs, modelos dinâmicos, sistemas, estabilidade e solução numérica](./10_equacoes_diferenciais.md)

### 11. Matemática Avançada

11. [Matemática Avançada: métodos numéricos, probabilidade contínua, otimização, Fourier e análise aplicada](./11_matematica_avancada.md)

### 12. Python para Cálculo e Projetos

12. [Python para Cálculo: SymPy, NumPy, SciPy, visualização, notebooks e projetos práticos](./12_python_calculo_projetos.md)

---

## Bibliotecas Recomendadas

```bash
pip install numpy sympy matplotlib scipy pandas jupyter
```

Use:

- `math` para funções matemáticas escalares;
- `decimal` para precisão decimal controlada;
- `fractions` para frações exatas;
- `numpy` para arrays e cálculo numérico;
- `sympy` para matemática simbólica;
- `matplotlib` para gráficos;
- `scipy` para integração numérica, otimização, EDOs e métodos científicos.

---

## Sequência Recomendada

1. Reforce aritmética, frações, potência, radicais, porcentagem e notação.
2. Domine álgebra, equações, funções e gráficos.
3. Estude geometria e trigonometria porque elas aparecem em limites, derivadas e cálculo vetorial.
4. Entenda limites antes de derivadas.
5. Estude derivadas e aplicações.
6. Estude integrais e Teorema Fundamental do Cálculo.
7. Avance para séries, Taylor, integrais impróprias e coordenadas polares.
8. Estude cálculo multivariável.
9. Reforce álgebra linear em paralelo com cálculo 3.
10. Estude EDOs e modelos dinâmicos.
11. Aplique métodos numéricos e matemática avançada.
12. Construa projetos em Python para consolidar.

---

## Critério de Proficiência

Você deve conseguir:

- explicar conceitos com palavras próprias;
- resolver exemplos manualmente;
- conferir resultados com Python simbólico;
- aproximar resultados numericamente;
- visualizar funções e regiões;
- interpretar unidades, domínio e restrições;
- escolher método analítico ou numérico;
- reconhecer erro de arredondamento, instabilidade e aproximação ruim;
- documentar premissas do cálculo;
- transformar fórmulas em funções Python testáveis.

---

## Estrutura Recomendada de Projeto

```text
calculo-python/
├── README.md
├── pyproject.toml
├── notebooks/
├── src/
│   └── calculo_python/
│       ├── funcoes.py
│       ├── derivadas.py
│       ├── integrais.py
│       ├── algebra_linear.py
│       ├── edo.py
│       └── visualizacao.py
├── tests/
└── reports/
```

---

## Regra Principal

Matemática com Python não é substituir entendimento por biblioteca. Python deve ser usado para explorar, verificar, visualizar, simular e automatizar. O domínio vem de conectar definição, interpretação, cálculo e implementação.
