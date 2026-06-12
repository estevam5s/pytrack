# Fórmulas e Funções: Do Básico ao Avançado

Fórmulas são o motor do Excel. Elas transformam dados em informação, validam regras, cruzam tabelas, calculam indicadores e automatizam análises.

Excel proficiente exige mais que conhecer muitas funções. É preciso escrever fórmulas legíveis, robustas, auditáveis e adequadas ao tamanho da base.

---

## Operadores

Operadores comuns:

```excel
=A1+B1
=A1-B1
=A1*B1
=A1/B1
=A1^2
=A1&B1
=A1>B1
=A1=B1
```

Concatenação:

```excel
=A2&" - "&B2
```

---

## Funções Básicas

```excel
=SOMA(B2:B100)
=MÉDIA(B2:B100)
=MÍNIMO(B2:B100)
=MÁXIMO(B2:B100)
=CONT.NÚM(B2:B100)
=CONT.VALORES(A2:A100)
```

Em bases estruturadas:

```excel
=SOMA(TabelaVendas[Valor])
```

Referências estruturadas são mais robustas.

---

## Funções Condicionais

```excel
=SOMASE(A:A;"TI";B:B)
=SOMASES(Vendas[Valor];Vendas[Região];"Sul";Vendas[Ano];2026)
=CONT.SE(Clientes[Status];"Ativo")
=CONT.SES(Vendas[Vendedor];"Ana";Vendas[Mês];"Janeiro")
=MÉDIASES(Vendas[Valor];Vendas[Produto];"Notebook")
```

Use `SOMASES`, `CONT.SES` e `MÉDIASES` para múltiplos critérios.

---

## Funções Lógicas

```excel
=SE(A2>=1000;"Aprovado";"Reprovado")
=E(A2>=1000;B2="Ativo")
=OU(A2>=1000;C2="VIP")
=NÃO(A2="Cancelado")
```

Evite `SE` muito aninhado quando a lógica fica ilegível.

Exemplo difícil de manter:

```excel
=SE(A2>90;"A";SE(A2>80;"B";SE(A2>70;"C";"D")))
```

Quando possível, use tabela de regras + busca.

---

## Tratamento de Erros

```excel
=SEERRO(PROCV(A2;Tabela;2;FALSO);"Não encontrado")
```

Use `SEERRO` com cuidado. Ele pode esconder erros reais.

Melhor quando possível:

```excel
=SE(ÉERROS(fórmula);"mensagem";fórmula)
```

Ou investigue a causa: chave ausente, tipo diferente, espaço extra, fórmula errada.

---

## Busca: PROCV e XLOOKUP

`PROCV`:

```excel
=PROCV(A2;Produtos!A:D;3;FALSO)
```

Limitações:

- busca apenas à direita;
- índice de coluna frágil;
- pode quebrar ao inserir coluna;
- exige cuidado com correspondência exata.

`XLOOKUP`/`PROCX`:

```excel
=PROCX(A2;Produtos[SKU];Produtos[Preço];"Não encontrado")
```

Vantagens:

- busca à esquerda ou direita;
- mais legível;
- valor padrão se não encontrar;
- menos frágil.

---

## ÍNDICE + CORRESP

Alternativa robusta:

```excel
=ÍNDICE(Produtos[Preço];CORRESP(A2;Produtos[SKU];0))
```

Boa quando `PROCX` não está disponível.

---

## Funções de Texto

```excel
=ESQUERDA(A2;3)
=DIREITA(A2;4)
=EXT.TEXTO(A2;2;5)
=ARRUMAR(A2)
=MAIÚSCULA(A2)
=MINÚSCULA(A2)
=SUBSTITUIR(A2;"-";"")
=TEXTO(B2;"00000")
```

Limpeza comum:

```excel
=ARRUMAR(MINÚSCULA(A2))
```

Use para padronizar chaves antes de cruzar bases.

---

## Datas

```excel
=HOJE()
=AGORA()
=ANO(A2)
=MÊS(A2)
=DIA(A2)
=DATA(2026;5;16)
=FIMMÊS(A2;0)
=DIATRABALHOTOTAL(A2;B2)
```

Datas são números com formatação. Problemas comuns surgem quando texto parece data.

---

## Matrizes Dinâmicas

Excel moderno suporta funções que "derramam" resultado:

```excel
=ÚNICO(TabelaVendas[Cliente])
=CLASSIFICAR(TabelaVendas[Valor])
=FILTRAR(TabelaVendas;TabelaVendas[Região]="Sul")
```

Essas funções reduzem fórmulas copiadas manualmente.

---

## LET

`LET` dá nome a partes da fórmula.

```excel
=LET(
    valor; A2;
    desconto; B2;
    valor_final; valor * (1 - desconto);
    valor_final
)
```

Benefícios:

- melhora legibilidade;
- evita repetir cálculo;
- facilita manutenção.

---

## LAMBDA

`LAMBDA` permite criar funções customizadas no Excel.

Exemplo conceitual:

```excel
=LAMBDA(valor; taxa; valor*(1+taxa))
```

É útil para padronizar regras em planilhas avançadas, mas deve ser documentado.

---

## Fórmulas Voláteis

Funções voláteis recalculam com frequência:

- `AGORA`;
- `HOJE`;
- `ALEATÓRIO`;
- `DESLOC`;
- `INDIRETO`.

Em arquivos grandes, podem deixar planilha lenta.

---

## Boas Práticas

- use tabelas e referências estruturadas;
- prefira fórmulas legíveis a fórmulas “inteligentes” demais;
- evite intervalos de coluna inteira em arquivos grandes;
- documente regras complexas;
- use `LET` para clareza;
- evite esconder erro com `SEERRO` indiscriminadamente;
- padronize chaves antes de buscas;
- teste fórmulas com casos de borda.

---

## Erros Comuns

- `PROCV` com correspondência aproximada sem querer;
- número armazenado como texto;
- datas em formato de texto;
- espaços invisíveis;
- fórmulas copiadas com referência errada;
- `SE` aninhado ilegível;
- `SEERRO` escondendo problema;
- fórmulas em bases gigantes sem necessidade;
- misturar idiomas de função em ambientes diferentes.

---

## Checklist

- Fórmulas usam referências estruturadas?
- Buscas usam correspondência exata?
- Erros são tratados sem esconder causa?
- Datas são datas reais?
- Chaves foram padronizadas?
- Fórmulas complexas usam `LET` ou tabelas auxiliares?
- Funções voláteis foram evitadas quando possível?
- Há testes com exemplos conhecidos?

Dominar fórmulas é dominar lógica aplicada a dados. O próximo nível é organizar esses dados para análise confiável.

