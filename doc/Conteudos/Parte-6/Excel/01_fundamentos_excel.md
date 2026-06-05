# Fundamentos de Excel: Pastas, Planilhas, Células, Formatos e Boas Práticas

Excel é uma ferramenta de planilhas, análise, modelagem, relatório e automação. Ele pode ser usado sozinho, com fórmulas e recursos nativos, ou integrado com Python para gerar, validar, transformar e distribuir arquivos automaticamente.

Excel profissional exige organização. Uma planilha que funciona hoje, mas ninguém entende amanhã, é um risco operacional.

---

## Conceitos Essenciais

- **Pasta de trabalho**: arquivo `.xlsx`, `.xlsm`, `.csv` etc.
- **Planilha**: aba dentro da pasta.
- **Célula**: interseção entre linha e coluna.
- **Intervalo**: grupo de células, como `A1:D20`.
- **Tabela**: intervalo estruturado com nome, filtros e referências.
- **Fórmula**: expressão que calcula valor.
- **Função**: operação pronta, como `SOMA`, `PROCV`, `XLOOKUP`.
- **Referência**: endereço de célula usado em fórmulas.

---

## Tipos de Arquivos

| Extensão | Uso |
|---|---|
| `.xlsx` | pasta de trabalho moderna sem macros |
| `.xlsm` | pasta com macros VBA |
| `.csv` | texto separado por vírgula/ponto e vírgula |
| `.xlsb` | formato binário, pode ser menor/mais rápido |
| `.ods` | formato LibreOffice/OpenDocument |

Para integração com Python, `.xlsx` e `.csv` são os formatos mais comuns.

---

## Tipos de Dados

Excel trabalha com:

- texto;
- número;
- data;
- hora;
- porcentagem;
- moeda;
- booleano;
- erro;
- vazio.

Datas no Excel são números com formatação. Isso explica muitos problemas ao importar/exportar com Python.

---

## Referências

Referência relativa:

```excel
=A1+B1
```

Ao copiar para baixo, vira:

```excel
=A2+B2
```

Referência absoluta:

```excel
=$A$1+B1
```

Referência mista:

```excel
=A$1+$B2
```

Dominar `$` evita fórmulas quebradas ao copiar.

---

## Organização Profissional

Estrutura recomendada:

```text
README
Parametros
Base_Dados
Tratamento
Calculos
Dashboard
```

Função de cada aba:

- `README`: objetivo, autor, atualização, instruções;
- `Parametros`: taxas, datas, filtros, metas;
- `Base_Dados`: dados brutos importados;
- `Tratamento`: limpeza e padronização;
- `Calculos`: métricas auxiliares;
- `Dashboard`: apresentação final.

---

## Separação de Responsabilidades

Evite misturar:

- entrada manual;
- dados importados;
- fórmulas;
- gráficos;
- parâmetros;
- anotações livres.

Mistura dificulta auditoria e automação.

Boa prática:

```text
Base_Dados: somente dados
Parametros: somente entradas controladas
Calculos: somente fórmulas
Dashboard: somente visualização
```

---

## Nomeação

Use nomes claros:

```text
Base_Vendas
Dim_Produtos
Resumo_Mensal
Dashboard_Comercial
Parametros
```

Evite:

```text
Plan1
teste
nova2
final_final_agora_vai
```

Nomes ruins aumentam risco de erro.

---

## Tabelas do Excel

Transforme base em tabela com `Ctrl + T`.

Vantagens:

- filtros automáticos;
- referência estruturada;
- expansão automática;
- estilo consistente;
- integração melhor com fórmulas e Power Query.

Exemplo de referência estruturada:

```excel
=SOMA(TabelaVendas[Valor])
```

É mais legível que:

```excel
=SOMA(D2:D50000)
```

---

## Formatação

Formatação deve comunicar significado, não decorar.

Boas práticas:

- cabeçalhos consistentes;
- números com casas decimais adequadas;
- datas padronizadas;
- moeda onde for valor financeiro;
- porcentagem onde for taxa;
- cores com função clara;
- destaque apenas para exceções/KPIs.

Evite excesso de cores, bordas e células mescladas.

---

## Células Mescladas

Células mescladas costumam atrapalhar:

- filtros;
- ordenação;
- tabelas dinâmicas;
- importação com Python;
- Power Query;
- cópia e colagem.

Prefira `Centralizar seleção` quando precisar de aparência similar.

---

## Validação de Dados

Use validação para reduzir erro manual.

Exemplos:

- lista de departamentos;
- data mínima/máxima;
- número positivo;
- status permitido;
- percentual entre 0% e 100%.

Validação é essencial em planilhas usadas por outras pessoas.

---

## Proteção

Proteção não é segurança forte, mas evita acidentes.

Práticas:

- desbloquear células de entrada;
- bloquear fórmulas;
- proteger planilha;
- ocultar abas auxiliares quando fizer sentido;
- manter backup/versionamento.

Não confie em proteção do Excel para dados altamente sensíveis.

---

## Erros Comuns

- usar planilha como banco sem padronização;
- misturar dados e dashboard;
- células mescladas em bases;
- fórmulas com intervalos manuais quebráveis;
- ausência de aba README;
- sem data de atualização;
- sem validação de entrada;
- cores sem significado;
- fórmulas sobrescritas manualmente;
- arquivo único enorme sem separação.

---

## Checklist

- A planilha tem objetivo claro?
- Existe aba README?
- Dados, cálculos e dashboard estão separados?
- Bases usam tabelas?
- Campos manuais têm validação?
- Fórmulas importantes estão protegidas?
- Datas e moedas têm formato consistente?
- Não há células mescladas em bases?
- O arquivo pode ser entendido por outra pessoa?

Excel profissional começa pela estrutura. Fórmulas avançadas não salvam uma planilha mal organizada.

