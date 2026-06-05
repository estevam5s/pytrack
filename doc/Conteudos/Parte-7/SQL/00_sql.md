# Python com MySQL, Excel e Docker: Do Básico ao Avançado 🗄️📊🐳

Guia completo integrando Python, MySQL, Excel e Docker para manipulação de dados em nível profissional.

**Exemplos práticos de SQL, Python, Excel, Docker e comandos de terminal integrados!**

## Índice

1. [Fundamentos SQL](#fundamentos-sql)
2. [Configurando MySQL com Docker](#configurando-mysql-com-docker)
3. [Conectando Python ao MySQL](#conectando-python-ao-mysql)
4. [Operações CRUD Completas](#operações-crud-completas)
5. [Manipulação de Excel em Python](#manipulação-de-excel-em-python)
6. [Integração: Python + MySQL + Excel](#integração-python--mysql--excel)
7. [Arquitetura Profissional](#arquitetura-profissional)
8. [Projetos Práticos Completos](#projetos-práticos-completos)

---

## Fundamentos SQL

### Criar Banco de Dados e Tabelas

```sql
-- Criar banco de dados
CREATE DATABASE IF NOT EXISTS empresa;
USE empresa;

-- Criar tabela de funcionários
CREATE TABLE funcionarios (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    departamento VARCHAR(50),
    salario DECIMAL(10, 2),
    data_contratacao DATE,
    ativo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_departamento (departamento),
    INDEX idx_email (email)
);

-- Exemplo: Visualizar estrutura
DESCRIBE funcionarios;

-- Exemplo: Adicionar coluna
ALTER TABLE funcionarios ADD COLUMN telefone VARCHAR(15);

-- Exemplo: Remover coluna
ALTER TABLE funcionarios DROP COLUMN telefone;

-- Exemplo: Modificar coluna
ALTER TABLE funcionarios MODIFY COLUMN nome VARCHAR(150);

-- Criar tabela de vendas
CREATE TABLE vendas (
    id INT PRIMARY KEY AUTO_INCREMENT,
    funcionario_id INT NOT NULL,
    data_venda DATE,
    valor DECIMAL(10, 2),
    quantidade INT,
    produto VARCHAR(100),
    comissao DECIMAL(10, 2),
    FOREIGN KEY (funcionario_id) REFERENCES funcionarios(id),
    INDEX idx_data_venda (data_venda),
    INDEX idx_funcionario_id (funcionario_id)
);

-- Criar tabela de departamentos
CREATE TABLE departamentos (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(100) UNIQUE NOT NULL,
    gerente_id INT,
    orcamento DECIMAL(12, 2),
    FOREIGN KEY (gerente_id) REFERENCES funcionarios(id)
);
```

### Operações SQL Básicas

```sql
-- INSERT
INSERT INTO funcionarios (nome, email, departamento, salario, data_contratacao)
VALUES ('João Silva', 'joao@email.com', 'TI', 5000.00, '2023-01-15');

-- INSERT múltiplo
INSERT INTO funcionarios (nome, email, departamento, salario, data_contratacao)
VALUES 
    ('Maria Santos', 'maria@email.com', 'RH', 4500.00, '2023-02-01'),
    ('Carlos Oliveira', 'carlos@email.com', 'Vendas', 4000.00, '2023-03-10'),
    ('Ana Costa', 'ana@email.com', 'TI', 5500.00, '2023-04-05');

-- SELECT básico
SELECT * FROM funcionarios;
SELECT nome, email, salario FROM funcionarios WHERE departamento = 'TI';

-- SELECT com múltiplas condições
SELECT * FROM funcionarios 
WHERE departamento = 'TI' AND salario > 5000;

SELECT * FROM funcionarios 
WHERE nome LIKE '%a%';  -- Contém 'a'

SELECT * FROM funcionarios 
WHERE data_contratacao BETWEEN '2023-01-01' AND '2023-06-30';

-- UPDATE
UPDATE funcionarios 
SET salario = salario * 1.1 
WHERE departamento = 'TI';

-- UPDATE condicional
UPDATE funcionarios 
SET ativo = FALSE 
WHERE data_contratacao < '2020-01-01';

-- DELETE
DELETE FROM funcionarios 
WHERE ativo = FALSE;

-- DELETE com condição
DELETE FROM funcionarios 
WHERE email = 'joao@email.com';

-- Ordenação e limite
SELECT * FROM funcionarios 
ORDER BY salario DESC 
LIMIT 5;

-- DISTINCT
SELECT DISTINCT departamento FROM funcionarios;

-- COUNT
SELECT COUNT(*) as total_funcionarios FROM funcionarios;
SELECT COUNT(*) FROM funcionarios WHERE departamento = 'TI';
```

### Queries Avançadas

```sql
-- GROUP BY e agregação
SELECT 
    departamento,
    COUNT(*) as total_funcionarios,
    AVG(salario) as salario_medio,
    MAX(salario) as maior_salario,
    MIN(salario) as menor_salario
FROM funcionarios
GROUP BY departamento
HAVING COUNT(*) > 0;

-- JOIN
SELECT 
    f.nome,
    f.departamento,
    v.data_venda,
    v.valor,
    v.comissao
FROM funcionarios f
INNER JOIN vendas v ON f.id = v.funcionario_id
WHERE f.departamento = 'Vendas'
ORDER BY v.data_venda DESC;

-- LEFT JOIN (inclui nulos)
SELECT 
    f.nome,
    COUNT(v.id) as total_vendas,
    COALESCE(SUM(v.valor), 0) as valor_total
FROM funcionarios f
LEFT JOIN vendas v ON f.id = v.funcionario_id
GROUP BY f.id, f.nome;

-- SUBQUERY
SELECT nome, salario
FROM funcionarios
WHERE salario > (SELECT AVG(salario) FROM funcionarios);

-- CASE WHEN
SELECT 
    nome,
    salario,
    CASE 
        WHEN salario > 5000 THEN 'Senior'
        WHEN salario > 4000 THEN 'Pleno'
        ELSE 'Junior'
    END as nivel
FROM funcionarios;

-- Índices (já estão criados, mas assim se cria novos)
CREATE INDEX idx_salario ON funcionarios(salario);
```

---

## Configurando MySQL com Docker

### docker-compose.yml

```yaml
version: '3.8'

services:
  mysql:
    image: mysql:8.0
    container_name: mysql_empresa
    restart: unless-stopped
    environment:
      MYSQL_ROOT_PASSWORD: root123
      MYSQL_DATABASE: empresa
      MYSQL_USER: usuario
      MYSQL_PASSWORD: senha123
    ports:
      - "3306:3306"
    volumes:
      - mysql_data:/var/lib/mysql
      - ./init.sql:/docker-entrypoint-initdb.d/init.sql
    networks:
      - app_network
    healthcheck:
      test: ["CMD", "mysqladmin", "ping", "-h", "localhost"]
      timeout: 20s
      retries: 10

  phpmyadmin:
    image: phpmyadmin:latest
    container_name: phpmyadmin_empresa
    restart: unless-stopped
    environment:
      PMA_HOST: mysql
      PMA_USER: usuario
      PMA_PASSWORD: senha123
    ports:
      - "8080:80"
    depends_on:
      - mysql
    networks:
      - app_network

volumes:
  mysql_data:

networks:
  app_network:
    driver: bridge
```

### init.sql (Script de inicialização)

```sql
-- init.sql
CREATE DATABASE IF NOT EXISTS empresa;
USE empresa;

CREATE TABLE funcionarios (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    departamento VARCHAR(50),
    salario DECIMAL(10, 2),
    data_contratacao DATE,
    ativo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_departamento (departamento)
);

CREATE TABLE vendas (
    id INT PRIMARY KEY AUTO_INCREMENT,
    funcionario_id INT NOT NULL,
    data_venda DATE,
    valor DECIMAL(10, 2),
    quantidade INT,
    produto VARCHAR(100),
    FOREIGN KEY (funcionario_id) REFERENCES funcionarios(id)
);

-- Dados de teste
INSERT INTO funcionarios (nome, email, departamento, salario, data_contratacao)
VALUES 
    ('João Silva', 'joao@email.com', 'TI', 5000.00, '2023-01-15'),
    ('Maria Santos', 'maria@email.com', 'RH', 4500.00, '2023-02-01'),
    ('Carlos Oliveira', 'carlos@email.com', 'Vendas', 4000.00, '2023-03-10');
```

### Comandos Docker

```bash
# Iniciar containers em background
docker-compose up -d

# Ver logs do MySQL
docker-compose logs -f mysql

# Ver logs da aplicação
docker-compose logs -f python_app

# Parar um serviço específico
docker-compose stop mysql

# Reiniciar um serviço
docker-compose restart mysql

# Parar todos os containers
docker-compose down

# Parar e remover volumes (delete dados!)
docker-compose down -v

# Verificar status dos containers
docker-compose ps

# Entrar no container MySQL
docker exec -it mysql_empresa mysql -u usuario -p

# Entrar no container Python
docker exec -it python_app bash

# Ver uso de recursos
docker stats

# Build customizado
docker-compose build --no-cache

# Executar comando no container
docker exec mysql_empresa mysqldump -u usuario -p empresa > backup.sql

# Ver redes
docker network ls

# Ver volumes
docker volume ls

# Inspecionar volume
docker volume inspect python_mysql_excel_mysql_data

# Limpar tudo (cuidado!)
docker system prune -a
```

**Exemplo: Entrar no MySQL e executar query**
```bash
$ docker exec -it mysql_empresa mysql -u usuario -p
password: senha123

mysql> USE empresa;
mysql> SELECT * FROM funcionarios;
mysql> EXIT;
```

### Dockerfile para Python com MySQL

```dockerfile
FROM python:3.11-slim

WORKDIR /app

# Instalar dependências do sistema
RUN apt-get update && apt-get install -y \
    default-libmysqlclient-dev \
    gcc \
    pkg-config \
    && rm -rf /var/lib/apt/lists/*

# Copiar requirements
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copiar código
COPY . .

# Expor porta
EXPOSE 8000

# Comando padrão
CMD ["python", "app.py"]
```

### requirements.txt

```
mysql-connector-python==8.0.33
pandas==2.0.0
openpyxl==3.10.0
sqlalchemy==2.0.0
pymysql==1.1.0
python-dotenv==1.0.0
flask==2.3.0
pytest==7.4.0
```

---

## Conectando Python ao MySQL

### Usando mysql-connector-python

```python
# conexao_basica.py
import mysql.connector
from mysql.connector import Error

def conectar_mysql():
    """Conecta ao banco de dados MySQL"""
    try:
        conexao = mysql.connector.connect(
            host='localhost',
            user='usuario',
            password='senha123',
            database='empresa'
        )
        
        if conexao.is_connected():
            db_info = conexao.get_server_info()
            print(f"Conectado ao MySQL versão {db_info}")
            return conexao
    
    except Error as e:
        print(f"Erro ao conectar: {e}")
        return None

def executar_query(conexao, query):
    """Executa uma query e retorna os resultados"""
    try:
        cursor = conexao.cursor()
        cursor.execute(query)
        
        # Se é SELECT, retorna os resultados
        if query.strip().upper().startswith('SELECT'):
            resultados = cursor.fetchall()
            colunas = [desc[0] for desc in cursor.description]
            cursor.close()
            return colunas, resultados
        else:
            conexao.commit()
            cursor.close()
            return None, None
    
    except Error as e:
        print(f"Erro ao executar query: {e}")
        return None, None

# Uso prático
if __name__ == "__main__":
    conexao = conectar_mysql()
    
    if conexao:
        # Exemplo 1: SELECT
        query = "SELECT * FROM funcionarios"
        colunas, resultados = executar_query(conexao, query)
        
        if resultados:
            print("\n=== FUNCIONÁRIOS ===")
            print(colunas)
            for resultado in resultados:
                print(resultado)
        
        # Exemplo 2: INSERT
        query_insert = """
            INSERT INTO funcionarios 
            (nome, email, departamento, salario, data_contratacao)
            VALUES (%s, %s, %s, %s, %s)
        """
        cursor = conexao.cursor()
        cursor.execute(query_insert, 
                      ('Pedro Silva', 'pedro@email.com', 'Vendas', 4800, '2024-01-01'))
        conexao.commit()
        print(f"Inserido com ID: {cursor.lastrowid}")
        cursor.close()
        
        # Exemplo 3: UPDATE
        query_update = "UPDATE funcionarios SET salario = 5200 WHERE id = 1"
        executar_query(conexao, query_update)
        print("Atualizado com sucesso!")
        
        # Exemplo 4: DELETE
        query_delete = "DELETE FROM funcionarios WHERE id = 2"
        executar_query(conexao, query_delete)
        print("Deletado com sucesso!")
        
        conexao.close()
        print("Conexão fechada")
```

**Exemplo: Usando parametrização segura (evita SQL injection)**
```python
# ❌ ERRADO - Vulnerável a SQL Injection
query_errado = f"SELECT * FROM funcionarios WHERE id = {id}"

# ✅ CORRETO - Seguro
query_correto = "SELECT * FROM funcionarios WHERE id = %s"
cursor.execute(query_correto, (id,))
```

### Usando SQLAlchemy (Mais Moderno)

```python
# conexao_sqlalchemy.py
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column, Integer, String, Float, Date, Boolean, DateTime
import datetime

# Criar engine
DATABASE_URL = "mysql+pymysql://usuario:senha123@localhost:3306/empresa"
engine = create_engine(DATABASE_URL, echo=False)

# Base para models
Base = declarative_base()

# Definir models
class Funcionario(Base):
    __tablename__ = "funcionarios"
    
    id = Column(Integer, primary_key=True)
    nome = Column(String(100), nullable=False)
    email = Column(String(100), unique=True, nullable=False)
    departamento = Column(String(50))
    salario = Column(Float)
    data_contratacao = Column(Date)
    ativo = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class Venda(Base):
    __tablename__ = "vendas"
    
    id = Column(Integer, primary_key=True)
    funcionario_id = Column(Integer)
    data_venda = Column(Date)
    valor = Column(Float)
    quantidade = Column(Integer)
    produto = Column(String(100))

# Criar session
Session = sessionmaker(bind=engine)

def obter_todos_funcionarios():
    """Retorna todos os funcionários"""
    session = Session()
    funcionarios = session.query(Funcionario).all()
    session.close()
    return funcionarios

def obter_funcionario_por_id(id):
    """Retorna um funcionário por ID"""
    session = Session()
    funcionario = session.query(Funcionario).filter(Funcionario.id == id).first()
    session.close()
    return funcionario

# Uso
if __name__ == "__main__":
    # Criar tabelas
    Base.metadata.create_all(engine)
    
    # Buscar
    funcionarios = obter_todos_funcionarios()
    for f in funcionarios:
        print(f.nome, f.email, f.salario)
```

### Context Manager para Conexão

```python
# gerenciador_conexao.py
from contextlib import contextmanager
import mysql.connector
import os
from dotenv import load_dotenv

load_dotenv()

class GerenciadorConexao:
    """Gerencia conexões com MySQL"""
    
    def __init__(self):
        self.config = {
            'host': os.getenv('DB_HOST', 'localhost'),
            'user': os.getenv('DB_USER', 'usuario'),
            'password': os.getenv('DB_PASSWORD', 'senha123'),
            'database': os.getenv('DB_NAME', 'empresa')
        }
    
    @contextmanager
    def obter_conexao(self):
        """Context manager para conexão"""
        conexao = mysql.connector.connect(**self.config)
        try:
            yield conexao
        finally:
            conexao.close()
    
    def executar_query(self, query, parametros=None):
        """Executa query com tratamento automático"""
        with self.obter_conexao() as conexao:
            cursor = conexao.cursor(dictionary=True)
            
            try:
                if parametros:
                    cursor.execute(query, parametros)
                else:
                    cursor.execute(query)
                
                if query.strip().upper().startswith('SELECT'):
                    return cursor.fetchall()
                else:
                    conexao.commit()
                    return cursor.rowcount
            
            finally:
                cursor.close()

# Uso
gerenciador = GerenciadorConexao()

# SELECT
resultado = gerenciador.executar_query("SELECT * FROM funcionarios")
print(resultado)

# INSERT
query_insert = """
    INSERT INTO funcionarios (nome, email, departamento, salario, data_contratacao)
    VALUES (%s, %s, %s, %s, %s)
"""
linhas_afetadas = gerenciador.executar_query(
    query_insert,
    ('Pedro', 'pedro@email.com', 'TI', 5500, '2024-01-01')
)
print(f"Linhas inseridas: {linhas_afetadas}")
```

---

## Operações CRUD Completas

### Classe CRUD Profissional

```python
# crud.py
import pandas as pd
from datetime import datetime
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class CRUDFuncionario:
    """Gerencia operações CRUD para funcionários"""
    
    def __init__(self, gerenciador):
        self.gerenciador = gerenciador
    
    def criar(self, nome, email, departamento, salario, data_contratacao):
        """CREATE: Insere novo funcionário"""
        try:
            query = """
                INSERT INTO funcionarios 
                (nome, email, departamento, salario, data_contratacao)
                VALUES (%s, %s, %s, %s, %s)
            """
            
            parametros = (nome, email, departamento, salario, data_contratacao)
            resultado = self.gerenciador.executar_query(query, parametros)
            
            logger.info(f"Funcionário criado: {nome}")
            return resultado > 0
        
        except Exception as e:
            logger.error(f"Erro ao criar funcionário: {e}")
            return False
    
    def ler(self, id=None):
        """READ: Lê dados de funcionários"""
        try:
            if id:
                query = "SELECT * FROM funcionarios WHERE id = %s"
                resultado = self.gerenciador.executar_query(query, (id,))
                return resultado[0] if resultado else None
            else:
                query = "SELECT * FROM funcionarios"
                return self.gerenciador.executar_query(query)
        
        except Exception as e:
            logger.error(f"Erro ao ler funcionário: {e}")
            return None
    
    def atualizar(self, id, **kwargs):
        """UPDATE: Atualiza dados de funcionário"""
        try:
            if not kwargs:
                return False
            
            # Construir query dinamicamente
            campos = ', '.join([f"{chave} = %s" for chave in kwargs.keys()])
            valores = list(kwargs.values()) + [id]
            
            query = f"UPDATE funcionarios SET {campos} WHERE id = %s"
            resultado = self.gerenciador.executar_query(query, valores)
            
            logger.info(f"Funcionário {id} atualizado")
            return resultado > 0
        
        except Exception as e:
            logger.error(f"Erro ao atualizar funcionário: {e}")
            return False
    
    def deletar(self, id):
        """DELETE: Deleta funcionário"""
        try:
            query = "DELETE FROM funcionarios WHERE id = %s"
            resultado = self.gerenciador.executar_query(query, (id,))
            
            logger.info(f"Funcionário {id} deletado")
            return resultado > 0
        
        except Exception as e:
            logger.error(f"Erro ao deletar funcionário: {e}")
            return False
    
    def listar_por_departamento(self, departamento):
        """Query específica"""
        query = "SELECT * FROM funcionarios WHERE departamento = %s"
        return self.gerenciador.executar_query(query, (departamento,))
    
    def obter_estatisticas(self):
        """Análise por departamento"""
        query = """
            SELECT 
                departamento,
                COUNT(*) as total,
                AVG(salario) as salario_medio,
                MAX(salario) as maior_salario,
                MIN(salario) as menor_salario
            FROM funcionarios
            GROUP BY departamento
        """
        return self.gerenciador.executar_query(query)
    
    def para_dataframe(self):
        """Converte para Pandas DataFrame"""
        dados = self.ler()
        if dados:
            colunas = [desc[0] if isinstance(desc, tuple) else desc 
                      for desc in dados[0].keys()] if isinstance(dados[0], dict) else None
            return pd.DataFrame(dados)
        return pd.DataFrame()

# Uso
gerenciador = GerenciadorConexao()
crud = CRUDFuncionario(gerenciador)

# CREATE
crud.criar('João', 'joao@email.com', 'TI', 5000, '2024-01-01')

# READ
funcionario = crud.ler(1)
print(funcionario)

# UPDATE
crud.atualizar(1, salario=5500, departamento='TI')

# DELETE
crud.deletar(1)

# Análise
estatisticas = crud.obter_estatisticas()
print(estatisticas)
```

---

## Manipulação de Excel em Python

### Leitura de Excel

```python
# excel_read.py
import pandas as pd
from openpyxl import load_workbook

# ===== LEITURA COM PANDAS (MAIS SIMPLES) =====

# Ler arquivo Excel simples
df = pd.read_excel('dados.xlsx', sheet_name='Sheet1')
print(df.head())
print(df.shape)  # (linhas, colunas)

# Ler especificando colunas
df = pd.read_excel('dados.xlsx', usecols=['Nome', 'Salário'])

# Ler com tipos específicos
df = pd.read_excel('dados.xlsx', dtype={'id': int, 'nome': str})

# Ler múltiplas abas
excel_file = pd.ExcelFile('dados.xlsx')
print(excel_file.sheet_names)  # ['Sheet1', 'Sheet2', 'Sheet3']

dfs = {}
for sheet in excel_file.sheet_names:
    dfs[sheet] = pd.read_excel('dados.xlsx', sheet_name=sheet)

# ===== LEITURA COM OPENPYXL (MAIS CONTROLE) =====

wb = load_workbook('dados.xlsx')
ws = wb.active

# Iterar sobre linhas
for row in ws.iter_rows(values_only=True):
    print(row)  # (1, 'João', 5000.0)

# Acessar célula específica
print(ws['A1'].value)  # Primeiro valor
print(ws['A2'].value)

# Acessar por índice
print(ws.cell(row=1, column=1).value)

# Contar linhas
print(ws.max_row)

# Contar colunas
print(ws.max_column)
```

**Exemplo: Importar dados do Excel para DataFrame e processar**
```python
# Ler arquivo
df = pd.read_excel('vendas.xlsx')

# Filtrar
df_ti = df[df['departamento'] == 'TI']

# Agregar
totais = df.groupby('departamento')['salario'].sum()

# Visualizar
print(df.describe())
```

### Escrita de Excel

```python
# excel_write.py
import pandas as pd
from openpyxl import Workbook
from openpyxl.styles import Font, PatternFill, Alignment
from datetime import datetime

# Com Pandas (mais simples)
df = pd.DataFrame({
    'Nome': ['João', 'Maria', 'Carlos'],
    'Salário': [5000, 4500, 4000],
    'Departamento': ['TI', 'RH', 'Vendas']
})

# Escrever em um arquivo
df.to_excel('funcionarios.xlsx', index=False, sheet_name='Funcionários')

# Com múltiplas abas
with pd.ExcelWriter('relatorio.xlsx') as writer:
    df.to_excel(writer, sheet_name='Dados', index=False)
    df.describe().to_excel(writer, sheet_name='Estatísticas')

# Com openpyxl (mais controle sobre formatação)
wb = Workbook()
ws = wb.active
ws.title = "Funcionários"

# Header
headers = ['Nome', 'Salário', 'Departamento']
ws.append(headers)

# Formatação do header
fill = PatternFill(start_color="4472C4", end_color="4472C4", fill_type="solid")
font = Font(color="FFFFFF", bold=True)

for cell in ws[1]:
    cell.fill = fill
    cell.font = font
    cell.alignment = Alignment(horizontal='center')

# Dados
dados = [
    ['João', 5000, 'TI'],
    ['Maria', 4500, 'RH'],
    ['Carlos', 4000, 'Vendas']
]

for row in dados:
    ws.append(row)

# Auto-ajustar largura
for column in ws.columns:
    max_length = 0
    column_letter = column[0].column_letter
    
    for cell in column:
        try:
            if len(str(cell.value)) > max_length:
                max_length = len(str(cell.value))
        except:
            pass
    
    ws.column_dimensions[column_letter].width = max_length + 2

wb.save('funcionarios_formatado.xlsx')
```

### Excel Avançado

```python
# excel_avancado.py
import pandas as pd
from openpyxl import load_workbook
from openpyxl.chart import BarChart, Reference
from openpyxl.utils import get_column_letter

def criar_relatorio_vendas(dados_dict):
    """Cria relatório profissional com gráficos"""
    
    # Criar Excel
    with pd.ExcelWriter('relatorio_vendas.xlsx', engine='openpyxl') as writer:
        # Aba 1: Dados brutos
        dados_dict['vendas'].to_excel(writer, sheet_name='Vendas', index=False)
        
        # Aba 2: Resumo por vendedor
        resumo = dados_dict['vendas'].groupby('vendedor').agg({
            'valor': 'sum',
            'quantidade': 'sum'
        }).reset_index()
        resumo.columns = ['Vendedor', 'Valor Total', 'Quantidade']
        resumo.to_excel(writer, sheet_name='Resumo', index=False)
        
        # Aba 3: Análise mensal
        dados_dict['vendas']['data'] = pd.to_datetime(dados_dict['vendas']['data'])
        mensal = dados_dict['vendas'].groupby(
            dados_dict['vendas']['data'].dt.to_period('M')
        )['valor'].sum()
        mensal.to_excel(writer, sheet_name='Mensal')
    
    # Adicionar gráficos
    wb = load_workbook('relatorio_vendas.xlsx')
    ws_resumo = wb['Resumo']
    
    # Criar gráfico de barras
    chart = BarChart()
    chart.title = "Vendas por Vendedor"
    chart.y_axis.title = "Valor Total (R$)"
    chart.x_axis.title = "Vendedor"
    
    # Definir dados
    data = Reference(ws_resumo, min_col=2, min_row=1, max_row=len(resumo)+1)
    categories = Reference(ws_resumo, min_col=1, min_row=2, max_row=len(resumo)+1)
    
    chart.add_data(data, titles_from_data=True)
    chart.set_categories(categories)
    
    ws_resumo.add_chart(chart, "D2")
    
    wb.save('relatorio_vendas.xlsx')
    print("Relatório criado com sucesso!")

# Uso
dados = {
    'vendas': pd.DataFrame({
        'vendedor': ['João', 'Maria', 'João', 'Carlos', 'Maria'],
        'data': ['2024-01-01', '2024-01-02', '2024-01-03', '2024-01-04', '2024-01-05'],
        'valor': [1000, 1500, 800, 1200, 2000],
        'quantidade': [10, 15, 8, 12, 20]
    })
}

criar_relatorio_vendas(dados)
```

---

## Integração: Python + MySQL + Excel

### Sincronizar MySQL para Excel

```python
# mysql_to_excel.py
import pandas as pd
from gerenciador_conexao import GerenciadorConexao

class SincronizadorDados:
    """Sincroniza dados entre MySQL e Excel"""
    
    def __init__(self, gerenciador):
        self.gerenciador = gerenciador
    
    def mysql_para_excel(self, query, arquivo_saida):
        """Exporta dados do MySQL para Excel"""
        try:
            # Buscar dados
            dados = self.gerenciador.executar_query(query)
            
            # Converter para DataFrame
            if dados:
                df = pd.DataFrame(dados)
                
                # Salvar em Excel
                df.to_excel(arquivo_saida, index=False)
                print(f"Exportado para {arquivo_saida}")
                
                return True
        
        except Exception as e:
            print(f"Erro na exportação: {e}")
            return False
    
    def excel_para_mysql(self, arquivo, tabela, se_existe='append'):
        """Importa dados do Excel para MySQL"""
        try:
            # Ler Excel
            df = pd.read_excel(arquivo)
            
            # Conectar
            engine = self._criar_engine()
            
            # Escrever no banco
            df.to_sql(tabela, con=engine, if_exists=se_existe, index=False)
            print(f"Importado para tabela {tabela}")
            
            return True
        
        except Exception as e:
            print(f"Erro na importação: {e}")
            return False
    
    def _criar_engine(self):
        """Criar engine SQLAlchemy"""
        from sqlalchemy import create_engine
        DATABASE_URL = "mysql+pymysql://usuario:senha123@localhost:3306/empresa"
        return create_engine(DATABASE_URL)
    
    def gerar_relatorio_completo(self, arquivo_saida):
        """Gera relatório com múltiplas abas"""
        
        with pd.ExcelWriter(arquivo_saida, engine='openpyxl') as writer:
            # Aba 1: Funcionários
            dados_func = self.gerenciador.executar_query(
                "SELECT * FROM funcionarios"
            )
            df_func = pd.DataFrame(dados_func)
            df_func.to_excel(writer, sheet_name='Funcionários', index=False)
            
            # Aba 2: Vendas
            dados_vendas = self.gerenciador.executar_query(
                "SELECT * FROM vendas"
            )
            df_vendas = pd.DataFrame(dados_vendas)
            df_vendas.to_excel(writer, sheet_name='Vendas', index=False)
            
            # Aba 3: Análise
            analise = self.gerenciador.executar_query("""
                SELECT 
                    departamento,
                    COUNT(*) as total,
                    AVG(salario) as salario_medio
                FROM funcionarios
                GROUP BY departamento
            """)
            df_analise = pd.DataFrame(analise)
            df_analise.to_excel(writer, sheet_name='Análise', index=False)
        
        print(f"Relatório completo: {arquivo_saida}")

# Uso
gerenciador = GerenciadorConexao()
sincronizador = SincronizadorDados(gerenciador)

# Exportar
query = "SELECT * FROM funcionarios"
sincronizador.mysql_para_excel(query, 'funcionarios.xlsx')

# Importar
# sincronizador.excel_para_mysql('novos_dados.xlsx', 'funcionarios')

# Relatório completo
sincronizador.gerar_relatorio_completo('relatorio_empresa.xlsx')
```

### Aplicação Web com Flask

```python
# app.py
from flask import Flask, render_template, request, jsonify, send_file
from gerenciador_conexao import GerenciadorConexao
from crud import CRUDFuncionario
from mysql_to_excel import SincronizadorDados
import io

app = Flask(__name__)
gerenciador = GerenciadorConexao()
crud = CRUDFuncionario(gerenciador)
sincronizador = SincronizadorDados(gerenciador)

@app.route('/api/funcionarios', methods=['GET'])
def listar_funcionarios():
    """API: Listar funcionários"""
    funcionarios = crud.ler()
    return jsonify(funcionarios)

@app.route('/api/funcionarios/<int:id>', methods=['GET'])
def obter_funcionario(id):
    """API: Obter funcionário por ID"""
    funcionario = crud.ler(id)
    if funcionario:
        return jsonify(funcionario)
    return jsonify({'erro': 'Não encontrado'}), 404

@app.route('/api/funcionarios', methods=['POST'])
def criar_funcionario():
    """API: Criar funcionário"""
    dados = request.json
    sucesso = crud.criar(
        dados['nome'],
        dados['email'],
        dados['departamento'],
        dados['salario'],
        dados['data_contratacao']
    )
    return jsonify({'sucesso': sucesso})

@app.route('/api/funcionarios/<int:id>', methods=['PUT'])
def atualizar_funcionario(id):
    """API: Atualizar funcionário"""
    dados = request.json
    sucesso = crud.atualizar(id, **dados)
    return jsonify({'sucesso': sucesso})

@app.route('/api/funcionarios/<int:id>', methods=['DELETE'])
def deletar_funcionario(id):
    """API: Deletar funcionário"""
    sucesso = crud.deletar(id)
    return jsonify({'sucesso': sucesso})

@app.route('/api/relatorio/download', methods=['GET'])
def download_relatorio():
    """Download de relatório em Excel"""
    output = io.BytesIO()
    
    # Gerar relatório
    with pd.ExcelWriter(output, engine='openpyxl') as writer:
        dados = crud.ler()
        df = pd.DataFrame(dados)
        df.to_excel(writer, sheet_name='Funcionários', index=False)
    
    output.seek(0)
    return send_file(
        output,
        mimetype='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        as_attachment=True,
        download_name='funcionarios.xlsx'
    )

@app.route('/api/estatisticas', methods=['GET'])
def obter_estatisticas():
    """Estatísticas por departamento"""
    stats = crud.obter_estatisticas()
    return jsonify(stats)

if __name__ == '__main__':
    app.run(debug=True, port=5000)
```

### Dockerfile para Aplicação

```dockerfile
FROM python:3.11-slim

WORKDIR /app

# Instalar dependências
RUN apt-get update && apt-get install -y \
    default-libmysqlclient-dev \
    gcc \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 5000

CMD ["python", "app.py"]
```

### docker-compose.yml Completo

```yaml
version: '3.8'

services:
  mysql:
    image: mysql:8.0
    container_name: mysql_empresa
    environment:
      MYSQL_ROOT_PASSWORD: root123
      MYSQL_DATABASE: empresa
      MYSQL_USER: usuario
      MYSQL_PASSWORD: senha123
    ports:
      - "3306:3306"
    volumes:
      - mysql_data:/var/lib/mysql
      - ./init.sql:/docker-entrypoint-initdb.d/init.sql
    networks:
      - app_network
    healthcheck:
      test: ["CMD", "mysqladmin", "ping", "-h", "localhost"]
      timeout: 20s
      retries: 10

  python_app:
    build: .
    container_name: python_app
    ports:
      - "5000:5000"
    depends_on:
      mysql:
        condition: service_healthy
    environment:
      DB_HOST: mysql
      DB_USER: usuario
      DB_PASSWORD: senha123
      DB_NAME: empresa
    volumes:
      - ./:/app
    networks:
      - app_network

  phpmyadmin:
    image: phpmyadmin:latest
    ports:
      - "8080:80"
    environment:
      PMA_HOST: mysql
      PMA_USER: usuario
      PMA_PASSWORD: senha123
    depends_on:
      - mysql
    networks:
      - app_network

volumes:
  mysql_data:

networks:
  app_network:
    driver: bridge
```

---

## Arquitetura Profissional

### Estrutura de Projeto

```
projeto/
├── docker-compose.yml
├── Dockerfile
├── requirements.txt
├── .env
├── .env.example
├── init.sql
├── app.py
├── config.py
├── models/
│   ├── __init__.py
│   ├── funcionario.py
│   └── venda.py
├── database/
│   ├── __init__.py
│   ├── conexao.py
│   ├── gerenciador.py
│   └── crud.py
├── utils/
│   ├── __init__.py
│   ├── excel_handler.py
│   └── exportador.py
├── tests/
│   ├── __init__.py
│   ├── test_crud.py
│   └── test_excel.py
└── README.md
```

### config.py

```python
# config.py
import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    """Configurações gerais"""
    DEBUG = os.getenv('DEBUG', False)
    TESTING = False

class DevelopmentConfig(Config):
    """Configurações de desenvolvimento"""
    DEBUG = True
    DB_HOST = os.getenv('DB_HOST', 'localhost')
    DB_USER = os.getenv('DB_USER', 'usuario')
    DB_PASSWORD = os.getenv('DB_PASSWORD', 'senha123')
    DB_NAME = os.getenv('DB_NAME', 'empresa')
    DATABASE_URL = f"mysql+pymysql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:3306/{DB_NAME}"

class ProductionConfig(Config):
    """Configurações de produção"""
    DEBUG = False
    DB_HOST = os.getenv('DB_HOST')
    DB_USER = os.getenv('DB_USER')
    DB_PASSWORD = os.getenv('DB_PASSWORD')
    DB_NAME = os.getenv('DB_NAME')
    DATABASE_URL = f"mysql+pymysql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:3306/{DB_NAME}"

class TestingConfig(Config):
    """Configurações de testes"""
    TESTING = True
    DATABASE_URL = "sqlite:///test.db"

config = {
    'development': DevelopmentConfig,
    'production': ProductionConfig,
    'testing': TestingConfig
}
```

### .env.example

```
DB_HOST=localhost
DB_USER=usuario
DB_PASSWORD=senha123
DB_NAME=empresa
DEBUG=True
FLASK_ENV=development
```

---

## Projetos Práticos Completos

### Projeto 1: Sistema Completo de Folha de Pagamento

```python
# folha_pagamento.py
import pandas as pd
from datetime import datetime, timedelta
from gerenciador_conexao import GerenciadorConexao

class FolhaPagamento:
    """Sistema de folha de pagamento"""
    
    def __init__(self, gerenciador, mes, ano):
        self.gerenciador = gerenciador
        self.mes = mes
        self.ano = ano
        self.funcionarios = []
        self.folha = pd.DataFrame()
    
    def carregar_funcionarios(self):
        """Carrega funcionários ativos"""
        query = "SELECT * FROM funcionarios WHERE ativo = TRUE"
        self.funcionarios = self.gerenciador.executar_query(query)
        return self.funcionarios
    
    def calcular_folha(self):
        """Calcula valores de folha"""
        dados = []
        
        for func in self.funcionarios:
            # Calcular dias úteis
            dias_uteis = self._calcular_dias_uteis()
            
            # Salário base
            salario_base = func['salario']
            
            # Descontos
            inss = salario_base * 0.08
            irrf = salario_base * 0.07
            
            # Bônus/Comissões
            comissoes = self._obter_comissoes(func['id'])
            
            # Totais
            desconto_total = inss + irrf
            liquido = salario_base + comissoes - desconto_total
            
            dados.append({
                'id': func['id'],
                'nome': func['nome'],
                'departamento': func['departamento'],
                'salario_base': salario_base,
                'dias_uteis': dias_uteis,
                'comissoes': comissoes,
                'inss': inss,
                'irrf': irrf,
                'desconto_total': desconto_total,
                'salario_liquido': liquido,
                'mes': self.mes,
                'ano': self.ano
            })
        
        self.folha = pd.DataFrame(dados)
        return self.folha
    
    def _calcular_dias_uteis(self):
        """Calcula dias úteis do mês"""
        primeiro_dia = datetime(self.ano, self.mes, 1)
        
        if self.mes == 12:
            ultimo_dia = datetime(self.ano + 1, 1, 1) - timedelta(days=1)
        else:
            ultimo_dia = datetime(self.ano, self.mes + 1, 1) - timedelta(days=1)
        
        dias_uteis = 0
        data_atual = primeiro_dia
        
        while data_atual <= ultimo_dia:
            if data_atual.weekday() < 5:  # Segunda a sexta
                dias_uteis += 1
            data_atual += timedelta(days=1)
        
        return dias_uteis
    
    def _obter_comissoes(self, funcionario_id):
        """Obtém comissões do mês"""
        query = f"""
            SELECT COALESCE(SUM(comissao), 0) as total
            FROM vendas
            WHERE funcionario_id = {funcionario_id}
            AND MONTH(data_venda) = {self.mes}
            AND YEAR(data_venda) = {self.ano}
        """
        resultado = self.gerenciador.executar_query(query)
        return resultado[0]['total'] if resultado else 0
    
    def gerar_excel(self, arquivo_saida):
        """Gera Excel com folha de pagamento"""
        
        with pd.ExcelWriter(arquivo_saida, engine='openpyxl') as writer:
            # Aba 1: Folha detalhada
            self.folha.to_excel(writer, sheet_name='Folha', index=False)
            
            # Aba 2: Resumo
            resumo = pd.DataFrame({
                'Descrição': [
                    'Total de Funcionários',
                    'Total Salários',
                    'Total Comissões',
                    'Total INSS',
                    'Total IRRF',
                    'Total Descontos',
                    'Total Líquido'
                ],
                'Valor': [
                    len(self.folha),
                    self.folha['salario_base'].sum(),
                    self.folha['comissoes'].sum(),
                    self.folha['inss'].sum(),
                    self.folha['irrf'].sum(),
                    self.folha['desconto_total'].sum(),
                    self.folha['salario_liquido'].sum()
                ]
            })
            
            resumo.to_excel(writer, sheet_name='Resumo', index=False)
        
        print(f"Folha gerada: {arquivo_saida}")

# Uso
gerenciador = GerenciadorConexao()
folha = FolhaPagamento(gerenciador, mes=1, ano=2024)
folha.carregar_funcionarios()
folha.calcular_folha()
folha.gerar_excel('folha_pagamento_janeiro_2024.xlsx')
```

### Projeto 2: Dashboard de Vendas

```python
# dashboard_vendas.py
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
from gerenciador_conexao import GerenciadorConexao

class DashboardVendas:
    """Dashboard de análise de vendas"""
    
    def __init__(self, gerenciador):
        self.gerenciador = gerenciador
        self.dados_vendas = None
        self.dados_funcionarios = None
    
    def carregar_dados(self):
        """Carrega dados de vendas e funcionários"""
        query_vendas = """
            SELECT v.*, f.nome as vendedor, f.departamento
            FROM vendas v
            JOIN funcionarios f ON v.funcionario_id = f.id
        """
        
        self.dados_vendas = pd.DataFrame(
            self.gerenciador.executar_query(query_vendas)
        )
        
        query_func = "SELECT * FROM funcionarios"
        self.dados_funcionarios = pd.DataFrame(
            self.gerenciador.executar_query(query_func)
        )
    
    def top_vendedores(self, top=5):
        """Top vendedores por valor"""
        top = self.dados_vendas.groupby('vendedor')['valor'].sum().sort_values(ascending=False).head(top)
        
        plt.figure(figsize=(10, 6))
        top.plot(kind='barh')
        plt.title('Top Vendedores')
        plt.xlabel('Valor Total (R$)')
        plt.tight_layout()
        plt.savefig('top_vendedores.png', dpi=300, bbox_inches='tight')
        plt.show()
    
    def evolucao_mensal(self):
        """Evolução de vendas por mês"""
        self.dados_vendas['mes'] = pd.to_datetime(self.dados_vendas['data_venda']).dt.to_period('M')
        
        mensal = self.dados_vendas.groupby('mes')['valor'].sum()
        
        plt.figure(figsize=(12, 6))
        mensal.plot(kind='line', marker='o')
        plt.title('Evolução de Vendas Mensais')
        plt.xlabel('Mês')
        plt.ylabel('Valor (R$)')
        plt.grid(True, alpha=0.3)
        plt.tight_layout()
        plt.savefig('evolucao_mensal.png', dpi=300, bbox_inches='tight')
        plt.show()
    
    def distribuicao_por_produto(self):
        """Distribuição de vendas por produto"""
        produto = self.dados_vendas.groupby('produto')['valor'].sum().sort_values(ascending=False)
        
        plt.figure(figsize=(10, 6))
        plt.pie(produto, labels=produto.index, autopct='%1.1f%%', startangle=90)
        plt.title('Distribuição de Vendas por Produto')
        plt.tight_layout()
        plt.savefig('distribuicao_produto.png', dpi=300, bbox_inches='tight')
        plt.show()
    
    def relatorio_completo_excel(self, arquivo_saida):
        """Gera relatório completo em Excel"""
        
        with pd.ExcelWriter(arquivo_saida, engine='openpyxl') as writer:
            # Dados brutos
            self.dados_vendas.to_excel(writer, sheet_name='Vendas', index=False)
            
            # Top vendedores
            top_vend = self.dados_vendas.groupby('vendedor')['valor'].sum().sort_values(ascending=False).head(5)
            top_vend.to_excel(writer, sheet_name='Top Vendedores')
            
            # Por período
            self.dados_vendas['mes'] = pd.to_datetime(self.dados_vendas['data_venda']).dt.to_period('M')
            mensal = self.dados_vendas.groupby('mes')['valor'].sum()
            mensal.to_excel(writer, sheet_name='Vendas Mensais')
            
            # Por produto
            produto = self.dados_vendas.groupby('produto')['valor'].sum()
            produto.to_excel(writer, sheet_name='Por Produto')
        
        print(f"Relatório gerado: {arquivo_saida}")

# Uso
gerenciador = GerenciadorConexao()
dashboard = DashboardVendas(gerenciador)
dashboard.carregar_dados()
dashboard.top_vendedores()
dashboard.evolucao_mensal()
dashboard.distribuicao_por_produto()
dashboard.relatorio_completo_excel('dashboard_vendas.xlsx')
```

---

## Checklist: Dominar Python + MySQL + Excel + Docker

### Fundamentos SQL
- [ ] CREATE, INSERT, UPDATE, DELETE
- [ ] SELECT com WHERE, ORDER BY, LIMIT
- [ ] JOIN (INNER, LEFT, RIGHT)
- [ ] GROUP BY e agregações
- [ ] Subqueries
- [ ] Índices

### MySQL com Docker
- [ ] docker-compose.yml
- [ ] Variáveis de ambiente
- [ ] Volumes e persistência
- [ ] Health checks
- [ ] Dockerfile para Python

### Python + MySQL
- [ ] mysql-connector-python
- [ ] SQLAlchemy ORM
- [ ] Context managers
- [ ] CRUD operations
- [ ] Tratamento de erros
- [ ] Transações

### Excel em Python
- [ ] Ler com pandas
- [ ] Escrever com pandas
- [ ] Formatação com openpyxl
- [ ] Múltiplas abas
- [ ] Gráficos
- [ ] Validação de dados

### Integração
- [ ] MySQL → Excel
- [ ] Excel → MySQL
- [ ] Sincronização
- [ ] Relatórios automáticos
- [ ] Flask API

### Docker
- [ ] docker-compose
- [ ] Multi-service setup
- [ ] Networking
- [ ] Volumes
- [ ] Build customizado

---

## Boas Práticas

### ✅ Faça
- Use context managers
- Valide dados antes de salvar
- Use prepared statements
- Trate exceções
- Mantenha código modular
- Use variáveis de ambiente
- Faça backup de dados
- Use índices em colunas frequentes

### ❌ Evite
- Concatenar strings em queries (SQL injection)
- Deixar conexões abertas
- Ignorar erros
- Salvar senhas no código
- Usar SELECT * em tabelas grandes
- N+1 queries
- Modificar estrutura sem backup

---

## Conclusão

Dominar Python + MySQL + Excel + Docker abre muitas possibilidades para:
- Automação de processos
- Análise de dados
- Relatórios automáticos
- Sistemas robustos e escaláveis
- DevOps e infraestrutura

**Comece agora com um projeto simples e evolua!** 🚀

