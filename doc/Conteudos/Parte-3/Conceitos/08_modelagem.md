# Modelagem: Do Domínio ao Schema Profissional

Modelagem de dados é transformar regras de negócio em estruturas persistentes. Um bom modelo é claro, consistente, evolutivo e adequado aos casos de uso.

Modelar bem exige entender domínio, cardinalidade, identidade, ciclo de vida, integridade, consultas críticas, volume, concorrência e mudanças futuras.

---

## Níveis de Modelagem

### Modelo Conceitual

Foca no negócio:

- Cliente faz Pedido.
- Pedido possui Itens.
- Produto pertence a Categoria.

Não depende de SGBD.

### Modelo Lógico

Define entidades, atributos, chaves e relacionamentos.

### Modelo Físico

Define tabelas, tipos, índices, constraints, particionamento, nomes e detalhes do SGBD.

---

## Entidades e Atributos

Entidade é algo relevante para o domínio:

- cliente;
- pedido;
- produto;
- pagamento;
- nota fiscal;
- usuário;
- assinatura.

Atributo é característica da entidade:

```text
Cliente
- id
- nome
- email
- documento
- criado_em
```

Pergunta profissional: esse atributo pertence mesmo a essa entidade ou representa outra entidade?

---

## Identidade

Chave natural:

```sql
CREATE TABLE paises (
    codigo_iso CHAR(2) PRIMARY KEY,
    nome VARCHAR(80) NOT NULL
);
```

Chave substituta:

```sql
CREATE TABLE clientes (
    id BIGSERIAL PRIMARY KEY,
    documento VARCHAR(30) UNIQUE,
    nome VARCHAR(120) NOT NULL
);
```

Chaves substitutas são comuns porque são estáveis e simples. Chaves naturais são úteis quando o identificador do domínio é confiável e imutável.

---

## Relacionamentos

### 1:1

```sql
CREATE TABLE usuarios (
    id BIGINT PRIMARY KEY,
    email VARCHAR(160) NOT NULL UNIQUE
);

CREATE TABLE perfis_usuario (
    usuario_id BIGINT PRIMARY KEY REFERENCES usuarios(id),
    bio TEXT,
    avatar_url TEXT
);
```

### 1:N

```sql
CREATE TABLE pedidos (
    id BIGINT PRIMARY KEY,
    cliente_id BIGINT NOT NULL REFERENCES clientes(id)
);
```

### N:N

```sql
CREATE TABLE usuarios_grupos (
    usuario_id BIGINT NOT NULL REFERENCES usuarios(id),
    grupo_id BIGINT NOT NULL REFERENCES grupos(id),
    criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (usuario_id, grupo_id)
);
```

Se a relação tem atributos próprios, a tabela associativa é uma entidade relevante.

---

## Cardinalidade e Opcionalidade

Pergunte:

- Um pedido sempre tem cliente?
- Um cliente pode existir sem pedido?
- Um pagamento pertence a exatamente um pedido?
- Um pedido pode ter vários pagamentos?
- Um produto pode existir sem categoria?

Exemplo:

```sql
cliente_id BIGINT NOT NULL REFERENCES clientes(id)
```

`NOT NULL` significa que o pedido obrigatoriamente tem cliente.

---

## Constraints

Constraints são regras de integridade.

```sql
CREATE TABLE produtos (
    id BIGSERIAL PRIMARY KEY,
    nome VARCHAR(120) NOT NULL,
    sku VARCHAR(40) NOT NULL UNIQUE,
    preco NUMERIC(12, 2) NOT NULL CHECK (preco >= 0),
    ativo BOOLEAN NOT NULL DEFAULT TRUE
);
```

Tipos comuns:

- `PRIMARY KEY`;
- `FOREIGN KEY`;
- `UNIQUE`;
- `NOT NULL`;
- `CHECK`;
- `DEFAULT`;
- `EXCLUDE` em PostgreSQL para casos avançados.

---

## Estados e Ciclo de Vida

Status precisa ser controlado.

```sql
CREATE TABLE pedidos (
    id BIGSERIAL PRIMARY KEY,
    status VARCHAR(30) NOT NULL CHECK (
        status IN ('aberto', 'fechado', 'pago', 'cancelado')
    )
);
```

Para regras complexas, crie tabela de transições ou valide na aplicação/procedure.

```sql
CREATE TABLE transicoes_status_pedido (
    status_origem VARCHAR(30) NOT NULL,
    status_destino VARCHAR(30) NOT NULL,
    PRIMARY KEY (status_origem, status_destino)
);
```

---

## Temporalidade

Muitos dados mudam com o tempo.

Campos básicos:

```sql
criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
atualizado_em TIMESTAMP,
excluido_em TIMESTAMP
```

Histórico:

```sql
CREATE TABLE historico_precos_produto (
    id BIGSERIAL PRIMARY KEY,
    produto_id BIGINT NOT NULL REFERENCES produtos(id),
    preco NUMERIC(12, 2) NOT NULL,
    valido_de TIMESTAMP NOT NULL,
    valido_ate TIMESTAMP
);
```

---

## Multi-tenant

Em sistemas com várias empresas ou clientes no mesmo banco:

```sql
CREATE TABLE empresas (
    id BIGSERIAL PRIMARY KEY,
    nome VARCHAR(120) NOT NULL
);

CREATE TABLE pedidos (
    id BIGSERIAL PRIMARY KEY,
    empresa_id BIGINT NOT NULL REFERENCES empresas(id),
    cliente_id BIGINT NOT NULL,
    total NUMERIC(12, 2) NOT NULL
);

CREATE INDEX idx_pedidos_empresa_cliente
ON pedidos (empresa_id, cliente_id);
```

Quase todas as consultas precisam filtrar por `empresa_id`.

---

## Nomes

Boas práticas:

- escolha um idioma e mantenha;
- use nomes claros;
- evite abreviações obscuras;
- seja consistente no singular/plural;
- padronize `criado_em`, `atualizado_em`, `excluido_em`;
- nomeie constraints e índices em projetos grandes.

Exemplo:

```sql
CONSTRAINT fk_pedidos_clientes
FOREIGN KEY (cliente_id) REFERENCES clientes(id)
```

---

## Modelo Completo de E-commerce

```sql
CREATE TABLE clientes (
    id BIGSERIAL PRIMARY KEY,
    nome VARCHAR(120) NOT NULL,
    email VARCHAR(160) NOT NULL UNIQUE,
    documento VARCHAR(30) UNIQUE,
    criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE categorias (
    id BIGSERIAL PRIMARY KEY,
    nome VARCHAR(120) NOT NULL UNIQUE
);

CREATE TABLE produtos (
    id BIGSERIAL PRIMARY KEY,
    categoria_id BIGINT REFERENCES categorias(id),
    nome VARCHAR(120) NOT NULL,
    sku VARCHAR(40) NOT NULL UNIQUE,
    preco_atual NUMERIC(12, 2) NOT NULL CHECK (preco_atual >= 0),
    ativo BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE pedidos (
    id BIGSERIAL PRIMARY KEY,
    cliente_id BIGINT NOT NULL REFERENCES clientes(id),
    status VARCHAR(30) NOT NULL CHECK (
        status IN ('aberto', 'fechado', 'pago', 'cancelado')
    ),
    total NUMERIC(12, 2) NOT NULL DEFAULT 0 CHECK (total >= 0),
    criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP
);

CREATE TABLE itens_pedido (
    id BIGSERIAL PRIMARY KEY,
    pedido_id BIGINT NOT NULL REFERENCES pedidos(id),
    produto_id BIGINT NOT NULL REFERENCES produtos(id),
    quantidade INTEGER NOT NULL CHECK (quantidade > 0),
    preco_unitario NUMERIC(12, 2) NOT NULL CHECK (preco_unitario >= 0),
    UNIQUE (pedido_id, produto_id)
);

CREATE TABLE pagamentos (
    id BIGSERIAL PRIMARY KEY,
    pedido_id BIGINT NOT NULL REFERENCES pedidos(id),
    valor NUMERIC(12, 2) NOT NULL CHECK (valor > 0),
    metodo VARCHAR(30) NOT NULL,
    status VARCHAR(30) NOT NULL CHECK (
        status IN ('pendente', 'confirmado', 'recusado', 'estornado')
    ),
    criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_pedidos_cliente_criado
ON pedidos (cliente_id, criado_em DESC);

CREATE INDEX idx_itens_pedido_pedido
ON itens_pedido (pedido_id);

CREATE INDEX idx_pagamentos_pedido
ON pagamentos (pedido_id);
```

---

## Perguntas de Revisão de Modelo

- Quais são as entidades reais do domínio?
- Quais atributos são obrigatórios?
- Quais regras devem estar no banco?
- Existem dados históricos?
- Há dados sensíveis?
- Quais consultas serão mais frequentes?
- Quais tabelas crescerão mais?
- Existem relacionamentos N:N?
- O modelo suporta exclusão lógica?
- Como auditar alterações críticas?
- Há necessidade de multi-tenant?
- O modelo permite migração sem parar o sistema?

---

## Checklist de Modelagem Profissional

- entidades têm responsabilidade clara;
- chaves primárias são estáveis;
- foreign keys representam relações reais;
- constraints protegem invariantes;
- tipos de dados são adequados;
- nomes são consistentes;
- índices refletem consultas críticas;
- campos históricos preservam fatos importantes;
- modelo evita redundância acidental;
- desnormalizações são justificadas;
- segurança e privacidade foram consideradas;
- migrações são versionadas;
- o schema foi revisado contra casos reais de uso.

