# Normalização: Integridade, Redundância e Formas Normais

Normalização é o processo de organizar dados para reduzir redundância, evitar anomalias e preservar integridade. Ela ajuda a criar modelos consistentes e fáceis de evoluir.

Normalizar não significa criar tabelas infinitas. Significa representar fatos no lugar correto, com chaves e dependências bem definidas.

---

## Problema: Tabela Desnormalizada

```sql
CREATE TABLE pedidos_planilha (
    pedido_id BIGINT,
    cliente_nome VARCHAR(120),
    cliente_email VARCHAR(160),
    produto_1_nome VARCHAR(120),
    produto_1_preco NUMERIC(12, 2),
    produto_2_nome VARCHAR(120),
    produto_2_preco NUMERIC(12, 2),
    total NUMERIC(12, 2)
);
```

Problemas:

- limite artificial de produtos por pedido;
- dados do cliente repetidos;
- alteração de e-mail exige atualizar várias linhas;
- consultas ficam difíceis;
- inconsistências aparecem facilmente.

---

## Modelo Normalizado

```sql
CREATE TABLE clientes (
    id BIGINT PRIMARY KEY,
    nome VARCHAR(120) NOT NULL,
    email VARCHAR(160) NOT NULL UNIQUE
);

CREATE TABLE produtos (
    id BIGINT PRIMARY KEY,
    nome VARCHAR(120) NOT NULL,
    preco_atual NUMERIC(12, 2) NOT NULL
);

CREATE TABLE pedidos (
    id BIGINT PRIMARY KEY,
    cliente_id BIGINT NOT NULL REFERENCES clientes(id),
    criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE itens_pedido (
    pedido_id BIGINT NOT NULL REFERENCES pedidos(id),
    produto_id BIGINT NOT NULL REFERENCES produtos(id),
    quantidade INTEGER NOT NULL CHECK (quantidade > 0),
    preco_unitario NUMERIC(12, 2) NOT NULL,
    PRIMARY KEY (pedido_id, produto_id)
);
```

---

## Anomalias

### Anomalia de Inserção

Não conseguir cadastrar um produto sem pedido porque os dados estão na mesma tabela.

### Anomalia de Atualização

Cliente muda e-mail e você precisa atualizar dezenas de linhas.

### Anomalia de Exclusão

Excluir o último pedido de um cliente remove também o único registro do cliente.

Normalização reduz essas anomalias.

---

## Primeira Forma Normal 1FN

Regras práticas:

- cada coluna contém valor atômico;
- não há listas dentro de uma coluna;
- não há grupos repetidos como `telefone1`, `telefone2`, `telefone3`;
- cada linha é identificável.

Errado:

```sql
CREATE TABLE clientes (
    id BIGINT PRIMARY KEY,
    nome VARCHAR(120),
    telefones TEXT
);
```

Melhor:

```sql
CREATE TABLE telefones_cliente (
    id BIGINT PRIMARY KEY,
    cliente_id BIGINT NOT NULL REFERENCES clientes(id),
    telefone VARCHAR(30) NOT NULL,
    tipo VARCHAR(30)
);
```

---

## Segunda Forma Normal 2FN

Exige 1FN e que atributos não chave dependam da chave inteira, especialmente em tabelas com chave composta.

Problema:

```sql
CREATE TABLE itens_pedido (
    pedido_id BIGINT,
    produto_id BIGINT,
    produto_nome VARCHAR(120),
    quantidade INTEGER,
    PRIMARY KEY (pedido_id, produto_id)
);
```

`produto_nome` depende só de `produto_id`, não da chave completa.

Melhor:

```sql
CREATE TABLE produtos (
    id BIGINT PRIMARY KEY,
    nome VARCHAR(120) NOT NULL
);

CREATE TABLE itens_pedido (
    pedido_id BIGINT,
    produto_id BIGINT REFERENCES produtos(id),
    quantidade INTEGER,
    PRIMARY KEY (pedido_id, produto_id)
);
```

---

## Terceira Forma Normal 3FN

Exige 2FN e remove dependências transitivas.

Problema:

```sql
CREATE TABLE clientes (
    id BIGINT PRIMARY KEY,
    nome VARCHAR(120),
    cep VARCHAR(20),
    cidade VARCHAR(80),
    estado VARCHAR(2)
);
```

Se cidade e estado dependem do CEP, há dependência transitiva.

Alternativa:

```sql
CREATE TABLE ceps (
    cep VARCHAR(20) PRIMARY KEY,
    cidade VARCHAR(80) NOT NULL,
    estado VARCHAR(2) NOT NULL
);

CREATE TABLE clientes (
    id BIGINT PRIMARY KEY,
    nome VARCHAR(120) NOT NULL,
    cep VARCHAR(20) REFERENCES ceps(cep)
);
```

Na prática, endereços têm exceções e regras reais. Modele com cuidado.

---

## BCNF

Boyce-Codd Normal Form é uma versão mais forte da 3FN. A ideia central: todo determinante deve ser uma chave candidata.

É importante em modelos com múltiplas chaves candidatas e dependências complexas.

Para muitos sistemas transacionais, 3FN bem aplicada já resolve a maior parte dos problemas.

---

## Dados Históricos

Nem toda repetição é erro. Em pedido, salvar `preco_unitario` no item é correto porque representa o preço no momento da compra.

```sql
CREATE TABLE itens_pedido (
    pedido_id BIGINT NOT NULL,
    produto_id BIGINT NOT NULL,
    quantidade INTEGER NOT NULL,
    preco_unitario NUMERIC(12, 2) NOT NULL
);
```

Se o preço atual do produto mudar, pedidos antigos permanecem corretos.

---

## Desnormalização

Desnormalizar é duplicar ou pré-calcular dados conscientemente para melhorar leitura, performance ou simplicidade.

Exemplos:

- salvar `total` em `pedidos`;
- manter contador de comentários em posts;
- criar tabela agregada diária;
- materialized view para dashboard.

Riscos:

- inconsistência;
- atualização duplicada;
- bugs em concorrência;
- necessidade de jobs de reconciliação.

---

## Normalização vs Performance

Modelo normalizado:

- melhor integridade;
- menor redundância;
- escrita mais clara;
- consultas podem exigir joins.

Modelo desnormalizado:

- leitura pode ser mais rápida;
- relatórios podem ficar simples;
- exige sincronização;
- aumenta risco de divergência.

A decisão profissional vem de medição, não de preferência.

---

## Checklist de Normalização

- Cada tabela representa uma entidade ou relação clara?
- Cada coluna depende da chave correta?
- Há grupos repetidos?
- Existem listas dentro de colunas?
- Dados de entidades diferentes estão misturados?
- Há dependência transitiva problemática?
- Repetições representam histórico legítimo?
- Desnormalizações têm motivo e mecanismo de consistência?
- Constraints preservam regras essenciais?
- O modelo suporta evolução sem duplicação excessiva?

