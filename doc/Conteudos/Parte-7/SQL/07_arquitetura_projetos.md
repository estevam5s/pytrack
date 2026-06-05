# Arquitetura Profissional: Camadas, Configuração e Projetos Práticos

Quando um projeto cresce, não basta ter queries corretas. É necessário organizar configuração, conexão, repositories, serviços, interface, testes, migrations, logs e scripts. Arquitetura profissional reduz acoplamento e torna mudanças mais seguras.

---

## Estrutura Recomendada

```text
projeto-sql-python/
├── app/
│   ├── __init__.py
│   ├── config.py
│   ├── database.py
│   ├── models.py
│   ├── repositories/
│   │   ├── __init__.py
│   │   ├── funcionarios.py
│   │   └── vendas.py
│   ├── services/
│   │   ├── __init__.py
│   │   ├── folha_pagamento.py
│   │   └── relatorios.py
│   └── web/
│       ├── __init__.py
│       └── routes.py
├── migrations/
├── scripts/
│   ├── importar_excel.py
│   └── exportar_relatorio.py
├── tests/
├── docker-compose.yml
├── requirements.txt
├── .env.example
└── README.md
```

Cada pasta tem responsabilidade clara.

---

## Configuração

```python
from dataclasses import dataclass
import os


@dataclass(frozen=True)
class Settings:
    app_env: str
    database_url: str
    log_level: str


def get_settings() -> Settings:
    return Settings(
        app_env=os.getenv("APP_ENV", "development"),
        database_url=os.environ["DATABASE_URL"],
        log_level=os.getenv("LOG_LEVEL", "INFO"),
    )
```

`.env.example`:

```bash
APP_ENV=development
DATABASE_URL=mysql+pymysql://usuario:senha123@localhost:3306/empresa
LOG_LEVEL=INFO
```

O `.env.example` documenta variáveis sem expor segredos reais.

---

## Database Module

```python
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.config import get_settings


settings = get_settings()

engine = create_engine(
    settings.database_url,
    pool_pre_ping=True,
    pool_size=5,
    max_overflow=10,
)

SessionLocal = sessionmaker(
    bind=engine,
    autoflush=False,
    expire_on_commit=False,
)
```

Centralizar engine/session evita configuração duplicada.

---

## Camadas

```text
Interface
  Flask/FastAPI/CLI/scripts

Services
  Regras de aplicação, fluxos, validação de caso de uso

Repositories
  SQL, persistência, consultas

Database
  Engine, session, transações
```

Evite colocar SQL diretamente em rotas HTTP. Evite colocar regra de negócio dentro do repository.

---

## Service de Folha de Pagamento

```python
from dataclasses import dataclass
from decimal import Decimal


@dataclass(frozen=True)
class ResumoFolha:
    total_funcionarios: int
    folha_bruta: Decimal
    encargos: Decimal
    custo_total: Decimal


class FolhaPagamentoService:
    def __init__(self, funcionarios_repo):
        self.funcionarios_repo = funcionarios_repo

    def calcular_resumo(self) -> ResumoFolha:
        funcionarios = self.funcionarios_repo.listar_ativos()
        folha_bruta = sum((f["salario"] for f in funcionarios), Decimal("0"))
        encargos = folha_bruta * Decimal("0.28")

        return ResumoFolha(
            total_funcionarios=len(funcionarios),
            folha_bruta=folha_bruta,
            encargos=encargos,
            custo_total=folha_bruta + encargos,
        )
```

Regra de cálculo fica no service, não no controller.

---

## Repository de Relatórios

```python
from sqlalchemy import text


class RelatorioRepository:
    def __init__(self, engine):
        self.engine = engine

    def vendas_por_departamento(self) -> list[dict]:
        query = text("""
            SELECT
                d.nome AS departamento,
                COUNT(v.id) AS total_vendas,
                COALESCE(SUM(v.valor), 0) AS valor_total,
                COALESCE(AVG(v.valor), 0) AS ticket_medio
            FROM departamentos d
            LEFT JOIN funcionarios f ON f.departamento_id = d.id
            LEFT JOIN vendas v ON v.funcionario_id = f.id
            GROUP BY d.id, d.nome
            ORDER BY valor_total DESC
        """)

        with self.engine.connect() as conn:
            return list(conn.execute(query).mappings())
```

Relatórios complexos podem ser SQL puro, desde que estejam isolados e testados.

---

## API com FastAPI

```python
from fastapi import Depends, FastAPI, HTTPException

from app.database import engine
from app.repositories.funcionarios import FuncionarioRepository

app = FastAPI()


def get_funcionarios_repo() -> FuncionarioRepository:
    return FuncionarioRepository(engine)


@app.get("/funcionarios/{funcionario_id}")
def obter_funcionario(
    funcionario_id: int,
    repo: FuncionarioRepository = Depends(get_funcionarios_repo),
) -> dict:
    funcionario = repo.obter_por_id(funcionario_id)
    if funcionario is None:
        raise HTTPException(status_code=404, detail="Funcionario nao encontrado")
    return dict(funcionario)
```

A rota coordena HTTP. O repository cuida do banco.

---

## CLI/Scripts

```python
import argparse

from app.database import engine
from app.services.relatorios import exportar_relatorio_funcionarios


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--output", default="relatorio.xlsx")
    args = parser.parse_args()

    exportar_relatorio_funcionarios(engine, args.output)


if __name__ == "__main__":
    main()
```

Scripts devem reutilizar services e repositories, não duplicar SQL.

---

## Migrations

Use ferramenta de migration, como Alembic, quando usar SQLAlchemy.

Objetivos:

- versionar schema;
- aplicar mudanças em ambientes diferentes;
- permitir rollback quando possível;
- revisar alterações;
- evitar SQL manual esquecido.

Mudança segura:

```text
1. adicionar coluna nullable
2. publicar app que escreve nova coluna
3. backfill
4. tornar coluna obrigatoria
5. remover campo antigo em outro deploy
```

---

## Projeto 1: Folha de Pagamento

Funcionalidades:

- cadastrar departamentos;
- cadastrar funcionários;
- calcular folha bruta;
- calcular encargos;
- gerar relatório por departamento;
- exportar Excel;
- auditar alterações salariais.

Tabelas adicionais:

```sql
CREATE TABLE historico_salarios (
    id INT PRIMARY KEY AUTO_INCREMENT,
    funcionario_id INT NOT NULL,
    salario_anterior DECIMAL(10, 2) NOT NULL,
    salario_novo DECIMAL(10, 2) NOT NULL,
    motivo VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (funcionario_id) REFERENCES funcionarios(id)
);
```

Serviço:

```python
class ReajusteSalarialService:
    def __init__(self, funcionarios_repo):
        self.funcionarios_repo = funcionarios_repo

    def aplicar_reajuste_departamento(self, departamento_id: int, percentual: Decimal) -> int:
        if percentual <= 0 or percentual > Decimal("0.50"):
            raise ValueError("Percentual invalido")

        return self.funcionarios_repo.reajustar_departamento(
            departamento_id=departamento_id,
            fator=Decimal("1") + percentual,
        )
```

---

## Projeto 2: Dashboard de Vendas

Funcionalidades:

- vendas por período;
- ranking de vendedores;
- ticket médio;
- vendas por produto;
- comissão por vendedor;
- exportação Excel;
- API para gráficos.

Query de ranking:

```sql
SELECT
    f.nome,
    COUNT(v.id) AS total_vendas,
    SUM(v.valor) AS valor_total,
    RANK() OVER (ORDER BY SUM(v.valor) DESC) AS ranking
FROM funcionarios f
JOIN vendas v ON v.funcionario_id = f.id
WHERE v.data_venda >= :inicio
  AND v.data_venda < :fim
GROUP BY f.id, f.nome
ORDER BY valor_total DESC;
```

---

## Projeto 3: Sincronizador Excel/MySQL

Funcionalidades:

- importar planilhas;
- validar colunas;
- registrar rejeições;
- aplicar upsert;
- gerar relatório de importação;
- auditar usuário e arquivo.

Tabela de auditoria:

```sql
CREATE TABLE importacoes (
    id INT PRIMARY KEY AUTO_INCREMENT,
    arquivo VARCHAR(255) NOT NULL,
    total_linhas INT NOT NULL,
    linhas_importadas INT NOT NULL,
    linhas_rejeitadas INT NOT NULL,
    status VARCHAR(30) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## Testes

Tipos:

- teste de unidade para services;
- teste de integração para repositories;
- teste de contrato para API;
- teste de importação/exportação;
- teste de migration em banco temporário.

Exemplo:

```python
def test_folha_pagamento_calcula_encargos(fake_funcionarios_repo):
    service = FolhaPagamentoService(fake_funcionarios_repo)

    resumo = service.calcular_resumo()

    assert resumo.total_funcionarios == 2
    assert resumo.encargos > 0
```

Services devem ser fáceis de testar sem banco quando regra não depende de SQL.

---

## Observabilidade

Registre:

- query lenta;
- falha de conexão;
- erro de constraint;
- quantidade importada;
- tempo de relatório;
- usuário que executou ação crítica;
- versão da aplicação.

Não registre:

- senha;
- string de conexão completa;
- dados pessoais desnecessários;
- planilha inteira em log.

---

## Boas Práticas Profissionais

- use migrations;
- mantenha SQL em repositories;
- valide entrada antes do banco;
- use transações;
- separe scripts de código de domínio;
- escreva testes de integração;
- configure logs;
- documente variáveis;
- use Docker para ambiente local;
- revise índices com base em queries reais.

---

## Erros Comuns

- arquivo único com conexão, SQL, Excel, API e regra;
- credenciais hardcoded;
- rotas HTTP com SQL direto;
- ausência de migrations;
- planilhas importadas sem validação;
- testes dependendo de dados manuais;
- queries lentas sem índice;
- logs com dados sensíveis;
- falta de rollback em erro.

---

## Checklist Avançado

- Projeto tem camadas claras?
- Configuração vem de ambiente?
- Repositories isolam SQL?
- Services concentram regras?
- Migrations versionam schema?
- Testes cobrem repositories e services?
- Scripts reutilizam código da aplicação?
- Logs ajudam a investigar sem vazar dados?
- Projetos práticos têm README e comandos de execução?

Arquitetura profissional não é excesso de pastas. É a separação necessária para que SQL, Python, Excel e interface evoluam sem virar um único bloco frágil.

