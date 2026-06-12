# Dados e Tabelas: Bases Limpas, Filtros, Validação e Tabelas Dinâmicas

Excel é forte para análise quando os dados estão bem estruturados. A maior parte dos problemas de planilhas vem de bases ruins: colunas misturadas, totais no meio, células mescladas, tipos inconsistentes e ausência de chaves.

Uma base boa é aquela que pode ser filtrada, ordenada, importada, exportada, cruzada e atualizada sem quebrar.

---

## Formato Tabular Correto

Regra:

```text
uma linha = um registro
uma coluna = um atributo
uma célula = um valor
```

Exemplo de vendas:

```text
data | pedido_id | cliente | produto | quantidade | valor | vendedor | região
```

Evite:

- títulos no meio da base;
- linhas em branco;
- subtotais misturados;
- células mescladas;
- múltiplos valores na mesma célula;
- colunas repetidas por mês sem necessidade.

---

## Tabelas do Excel

Use `Ctrl + T`.

Benefícios:

- filtros automáticos;
- expansão automática;
- referências estruturadas;
- integração com tabelas dinâmicas;
- melhor leitura por Python/Power Query;
- estilos consistentes.

Nomeie tabelas:

```text
TabelaVendas
TabelaClientes
TabelaProdutos
TabelaMetas
```

---

## Chaves

Chave identifica registros.

Exemplos:

- `pedido_id`;
- `cliente_id`;
- `sku`;
- `codigo_funcionario`;
- `data + loja + produto`.

Chaves devem ser:

- únicas quando representam entidade;
- consistentes;
- sem espaços extras;
- com tipo estável;
- sem variação de maiúsculas/minúsculas quando usadas para busca.

---

## Normalização Básica

Em vez de repetir dados do cliente em cada venda:

```text
Vendas
├── pedido_id
├── cliente_id
├── produto_id
└── valor

Clientes
├── cliente_id
├── nome
└── cidade

Produtos
├── produto_id
├── nome
└── categoria
```

Isso reduz inconsistência e facilita atualização.

Para usuários de Excel, normalização deve ser aplicada com equilíbrio. Arquivos simples podem manter base única, mas projetos grandes se beneficiam de tabelas separadas.

---

## Filtros e Classificação

Filtros ajudam investigação rápida:

- status;
- período;
- região;
- vendedor;
- produto;
- faixa de valor.

Classificação:

- maior valor;
- data mais recente;
- nome;
- prioridade.

Evite ordenar apenas parte da tabela. Isso desalinha linhas e corrompe dados.

---

## Validação de Dados

Use validação para campos manuais:

- listas de status;
- datas válidas;
- valores positivos;
- porcentagens;
- códigos existentes.

Exemplo de lista:

```text
Aberto
Em análise
Aprovado
Cancelado
```

Validação reduz erro antes que ele vire fórmula quebrada.

---

## Remover Duplicatas

Antes de remover duplicatas, defina critério:

```text
duplicado por pedido_id?
duplicado por cliente + data?
duplicado por todas as colunas?
```

Remover duplicata sem critério pode apagar dado válido.

Boa prática:

1. copiar base;
2. contar duplicatas;
3. revisar amostra;
4. remover;
5. registrar regra.

---

## Qualidade de Dados

Validações comuns:

- campos obrigatórios vazios;
- datas fora do período;
- valores negativos indevidos;
- status desconhecido;
- chaves duplicadas;
- chaves sem correspondência;
- texto com espaços extras;
- números como texto.

Crie aba `Qualidade` com contagens:

```text
linhas_total
emails_vazios
pedidos_duplicados
valores_negativos
datas_invalidas
```

---

## Tabelas Dinâmicas

Tabelas dinâmicas resumem dados sem alterar a base.

Usos:

- vendas por mês;
- receita por região;
- clientes por status;
- top produtos;
- médias por categoria;
- contagens por responsável.

Boas práticas:

- base em formato tabular;
- usar tabela como origem;
- atualizar ao mudar dados;
- formatar números;
- evitar cálculos manuais ao lado sem cuidado.

---

## Campos Calculados

Prefira criar colunas auxiliares na base quando a regra será usada em vários relatórios.

Exemplo:

```text
Ano
Mês
Trimestre
Margem
Faixa de valor
Status normalizado
```

Isso torna a tabela dinâmica mais simples.

---

## Segmentações e Linha do Tempo

Segmentações permitem filtros visuais:

- região;
- vendedor;
- produto;
- status.

Linha do tempo é útil para datas.

Esses recursos são excelentes para dashboards no Excel.

---

## Auditoria de Base

Inclua controles:

- quantidade de linhas;
- data de atualização;
- fonte;
- responsável;
- período mínimo/máximo;
- total financeiro de conferência.

Exemplo:

```excel
=CONT.VALORES(TabelaVendas[Pedido_ID])
=MÍNIMO(TabelaVendas[Data])
=MÁXIMO(TabelaVendas[Data])
=SOMA(TabelaVendas[Valor])
```

Compare com sistema origem quando possível.

---

## Erros Comuns

- usar subtotais dentro da base;
- células mescladas;
- múltiplas tabelas na mesma aba sem separação clara;
- base com cabeçalho em várias linhas;
- tipos inconsistentes;
- chaves sem padronização;
- remover duplicatas sem critério;
- tabela dinâmica baseada em intervalo fixo;
- copiar e colar sobre fórmulas.

---

## Checklist

- A base segue uma linha por registro?
- Cada coluna tem apenas um significado?
- A base está em tabela do Excel?
- Existem chaves estáveis?
- Campos manuais têm validação?
- Há checagem de duplicidades?
- Há controle de qualidade?
- Tabelas dinâmicas usam origem estruturada?
- Totais conferem com a fonte?

Dados limpos tornam fórmulas, dashboards e automações muito mais simples. A qualidade da análise nunca supera a qualidade da base.

