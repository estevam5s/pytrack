# Fundamentos de Financas

Financas estudam como pessoas, empresas e instituicoes tomam decisoes sobre dinheiro ao longo do tempo, considerando retorno, risco, liquidez, impostos, inflacao e custo de oportunidade.

---

## Objetivos

- Entender valor do dinheiro no tempo.
- Separar fluxo de caixa, lucro, caixa e patrimonio.
- Diferenciar risco, incerteza, volatilidade e perda permanente.
- Interpretar retorno nominal, retorno real e retorno ajustado ao risco.
- Conectar financas pessoais, corporativas e investimentos.

---

## Conceitos Essenciais

### Valor do dinheiro no tempo

Um valor recebido hoje nao vale o mesmo que o mesmo valor recebido no futuro. Dinheiro hoje pode ser investido, usado para reduzir dividas ou proteger contra incertezas.

Principais variaveis:

- `PV`: valor presente.
- `FV`: valor futuro.
- `i`: taxa de juros por periodo.
- `n`: numero de periodos.
- `PMT`: pagamento periodico.

Formula base:

```text
FV = PV * (1 + i) ** n
PV = FV / (1 + i) ** n
```

### Fluxo de caixa

Fluxo de caixa e a sequencia de entradas e saidas de dinheiro ao longo do tempo.

Exemplo:

```text
Periodo:       0      1      2      3
Fluxo:     -1000    400    450    500
```

O periodo zero geralmente representa o investimento inicial. Valores negativos sao saidas; valores positivos sao entradas.

### Risco e retorno

Retorno e a variacao percentual de valor em um periodo:

```text
retorno = (preco_final - preco_inicial + proventos) / preco_inicial
```

Risco pode aparecer como:

- volatilidade dos retornos;
- chance de inadimplencia;
- perda de liquidez;
- erro de modelo;
- concentracao excessiva;
- perda permanente de capital.

Volatilidade nao e o unico risco. Um ativo pode oscilar pouco e ainda ter risco alto se houver fragilidade de credito, liquidez ou governanca.

---

## Retorno Nominal e Retorno Real

Retorno nominal e o retorno observado em moeda corrente. Retorno real desconta a inflacao.

```text
retorno_real = ((1 + retorno_nominal) / (1 + inflacao)) - 1
```

Exemplo:

```python
retorno_nominal = 0.12
inflacao = 0.05
retorno_real = (1 + retorno_nominal) / (1 + inflacao) - 1
print(round(retorno_real, 4))
```

---

## Liquidez

Liquidez e a capacidade de transformar um ativo em dinheiro sem perda relevante de valor.

Tipos praticos:

- liquidez diaria: resgate rapido;
- liquidez no vencimento: dinheiro preso ate uma data;
- liquidez de mercado: depende de compradores;
- liquidez operacional: depende de processo, corretora, horario e regra do produto.

Quanto menor a liquidez, maior deve ser a compensacao esperada ou a justificativa estrategica.

---

## Custo de Oportunidade

Custo de oportunidade e o retorno perdido ao escolher uma alternativa em vez de outra.

Se uma decisao rende 8% ao ano, mas uma alternativa comparavel e segura rende 12% ao ano, a decisao precisa justificar a diferenca por liquidez, risco, estrategia ou beneficio nao financeiro.

---

## Tipos de Decisao Financeira

### Financas pessoais

- orcamento;
- reserva de emergencia;
- controle de dividas;
- seguros;
- investimentos;
- aposentadoria;
- planejamento tributario.

### Financas corporativas

- avaliacao de projetos;
- estrutura de capital;
- capital de giro;
- precificacao;
- demonstrativos;
- valuation;
- distribuicao de dividendos.

### Mercado financeiro

- renda fixa;
- acoes;
- fundos;
- derivativos;
- moedas;
- commodities;
- criptoativos;
- indices.

---

## Exemplo em Python: Fluxo de Caixa Simples

```python
fluxos = [-1000, 400, 450, 500]
taxa = 0.10

vpl = sum(fluxo / (1 + taxa) ** periodo for periodo, fluxo in enumerate(fluxos))
print(round(vpl, 2))
```

Se o VPL for positivo, o projeto supera a taxa minima exigida. Se for negativo, o retorno nao compensa a taxa usada como referencia.

---

## Boas Praticas

- Sempre declare a unidade da taxa: ao mes, ao ano, ao dia.
- Nao misture taxa mensal com periodo anual.
- Separe retorno nominal de retorno real.
- Compare alternativas com risco e prazo semelhantes.
- Documente premissas antes de mostrar resultados.
- Valide dados antes de calcular indicadores.
- Trate impostos, custos, taxas e spreads quando forem relevantes.

---

## Erros Comuns

- Comparar rentabilidade bruta com rentabilidade liquida.
- Usar media simples quando o correto e retorno composto.
- Ignorar inflacao.
- Confundir lucro contabil com caixa disponivel.
- Projetar o passado como se fosse garantia do futuro.
- Calcular retorno sem considerar dividendos, custos ou impostos.

---

## Exercicios

1. Calcule o retorno real de um investimento que rendeu 14% com inflacao de 6%.
2. Monte um fluxo de caixa com investimento inicial e quatro entradas futuras.
3. Calcule o valor presente de R$ 10.000 recebidos em 3 anos com taxa de 11% ao ano.
4. Liste tres riscos que nao sao capturados apenas pela volatilidade.
5. Explique a diferenca entre liquidez diaria e liquidez de mercado.
