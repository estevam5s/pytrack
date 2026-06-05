# Power Query e Modelagem: ETL, Limpeza, Transformações e Modelo de Dados

Power Query é a ferramenta de ETL do Excel: extrair, transformar e carregar dados. Ele permite limpar arquivos, combinar bases, padronizar colunas e automatizar etapas que antes eram feitas manualmente.

É uma ponte importante entre Excel solo e processos de dados mais profissionais.

---

## O que é ETL

ETL significa:

- **Extract**: extrair dados de arquivos, pastas, APIs, bancos etc.;
- **Transform**: limpar, filtrar, combinar e padronizar;
- **Load**: carregar resultado em tabela, modelo de dados ou conexão.

No Excel:

```text
Fonte -> Power Query -> Tabela/Modelo -> Dashboard
```

---

## Quando Usar Power Query

Use quando:

- recebe arquivos recorrentes;
- precisa limpar dados sempre do mesmo jeito;
- quer combinar várias planilhas;
- precisa transformar CSVs;
- quer reduzir copia/cola;
- base vem de pasta;
- dados precisam ser atualizados com um clique.

Evite depender só de fórmulas quando o problema é claramente limpeza e transformação.

---

## Fontes de Dados

Power Query pode importar:

- Excel;
- CSV/TXT;
- pasta com vários arquivos;
- banco de dados;
- web;
- SharePoint/OneDrive;
- OData;
- JSON;
- XML.

Conectar em pasta é útil para relatórios mensais:

```text
vendas_2026_01.xlsx
vendas_2026_02.xlsx
vendas_2026_03.xlsx
```

Power Query combina todos.

---

## Transformações Comuns

- remover linhas vazias;
- promover cabeçalhos;
- alterar tipo;
- remover colunas;
- renomear colunas;
- filtrar linhas;
- dividir coluna;
- substituir valores;
- remover duplicatas;
- agrupar;
- mesclar consultas;
- acrescentar consultas;
- criar coluna condicional.

Cada etapa fica registrada e reaplicável.

---

## Tipos de Dados

Defina tipos explicitamente:

- texto;
- número inteiro;
- número decimal;
- moeda;
- data;
- data/hora;
- verdadeiro/falso.

Erros de tipo são uma das causas mais comuns de falhas em atualização.

Exemplo: código de produto `00123` deve ser texto, não número.

---

## Mesclar vs Acrescentar

**Mesclar** é parecido com JOIN:

```text
Vendas + Produtos por SKU
```

**Acrescentar** empilha bases:

```text
Vendas Janeiro
Vendas Fevereiro
Vendas Março
```

Confundir esses conceitos gera tabelas erradas.

---

## Modelagem Estrela

Para análises maiores, use modelo estrela:

```text
Fato_Vendas
├── data_id
├── produto_id
├── cliente_id
├── quantidade
└── valor

Dim_Produto
Dim_Cliente
Dim_Data
Dim_Vendedor
```

Tabela fato contém eventos/medidas. Dimensões descrevem contexto.

Esse modelo melhora dashboards e evita duplicação.

---

## Modelo de Dados

O Modelo de Dados do Excel permite relacionamentos entre tabelas.

Vantagens:

- menos `PROCV`;
- tabelas dinâmicas com múltiplas fontes;
- modelo mais escalável;
- base mais próxima de BI.

Relações comuns:

```text
Fato_Vendas[produto_id] -> Dim_Produto[produto_id]
Fato_Vendas[cliente_id] -> Dim_Cliente[cliente_id]
Fato_Vendas[data] -> Dim_Data[data]
```

---

## Boas Práticas em Power Query

- renomeie consultas claramente;
- remova colunas desnecessárias cedo;
- defina tipos;
- evite etapas manuais frágeis;
- use parâmetros para caminhos;
- documente fonte;
- mantenha staging queries separadas;
- carregue apenas resultado final quando possível;
- valide contagens.

Estrutura:

```text
stg_vendas_raw
stg_produtos_raw
dim_produto
fato_vendas
relatorio_vendas
```

---

## Parâmetros

Use parâmetros para:

- caminho de pasta;
- período;
- ambiente;
- nome de arquivo;
- URL.

Isso reduz edição manual de consultas.

---

## Atualização

Cuidados:

- fonte disponível;
- caminho correto;
- credenciais;
- tipos compatíveis;
- nomes de colunas estáveis;
- arquivos novos com mesmo layout;
- tratamento de erros.

Crie aba de controle:

```text
última atualização
total de linhas carregadas
arquivos lidos
erros encontrados
```

---

## Power Query vs Python

Use Power Query quando:

- usuário final precisa manter;
- transformação é tabular comum;
- fonte é planilha/pasta;
- atualização manual com clique basta.

Use Python quando:

- há lógica complexa;
- volume maior;
- integração com APIs/bancos;
- agendamento;
- testes;
- logs;
- relatórios em massa;
- pipeline automatizada.

Muitas soluções combinam ambos.

---

## Erros Comuns

- transformar dado manualmente fora do Power Query;
- não definir tipos;
- depender de coluna por posição;
- misturar staging e relatório;
- carregar consultas intermediárias desnecessárias;
- não validar contagem de linhas;
- caminho hardcoded em máquina local;
- ignorar arquivos com layout diferente;
- não documentar origem.

---

## Checklist

- Fontes estão documentadas?
- Tipos são definidos explicitamente?
- Consultas têm nomes claros?
- Etapas são reproduzíveis?
- Há validação de linhas e totais?
- Caminhos usam parâmetros?
- Staging é separado do resultado?
- Modelo tem relações corretas?
- Atualização foi testada com arquivo novo?

Power Query tira o Excel do copia/cola e leva para um fluxo reproduzível. Para processos ainda mais controlados, Python entra como camada de automação e engenharia.

