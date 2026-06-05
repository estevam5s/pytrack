# MySQL com Docker: Ambiente Reprodutível e Operação Local

Rodar MySQL com Docker permite criar ambientes consistentes para desenvolvimento, testes, aulas e integração com Python. Em vez de instalar MySQL diretamente na máquina, você define imagem, variáveis, volume, rede e scripts de inicialização.

Docker não substitui entendimento de banco. Ele apenas empacota e executa o serviço de forma reproduzível.

---

## Arquitetura Local

```text
Python app -> rede Docker -> MySQL
                       -> volume persistente
                       -> init.sql
```

Componentes:

- container MySQL;
- volume para dados;
- arquivo `init.sql`;
- rede Docker;
- opcionalmente phpMyAdmin;
- aplicação Python conectando pelo host/porta corretos.

---

## docker-compose.yml

```yaml
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
      - ./init.sql:/docker-entrypoint-initdb.d/init.sql:ro
    networks:
      - app_network
    healthcheck:
      test: ["CMD", "mysqladmin", "ping", "-h", "localhost"]
      interval: 10s
      timeout: 5s
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
      mysql:
        condition: service_healthy
    networks:
      - app_network

volumes:
  mysql_data:

networks:
  app_network:
    driver: bridge
```

`init.sql` só roda quando o volume de dados é criado pela primeira vez. Se o volume já existe, alterar `init.sql` não recria o banco automaticamente.

---

## init.sql

```sql
CREATE DATABASE IF NOT EXISTS empresa;
USE empresa;

CREATE TABLE departamentos (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(100) NOT NULL UNIQUE,
    orcamento DECIMAL(12, 2) NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE funcionarios (
    id INT PRIMARY KEY AUTO_INCREMENT,
    departamento_id INT,
    nome VARCHAR(150) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    cargo VARCHAR(80),
    salario DECIMAL(10, 2) NOT NULL,
    data_contratacao DATE NOT NULL,
    ativo BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_funcionarios_departamentos
        FOREIGN KEY (departamento_id) REFERENCES departamentos(id)
);

CREATE TABLE vendas (
    id INT PRIMARY KEY AUTO_INCREMENT,
    funcionario_id INT NOT NULL,
    produto VARCHAR(120) NOT NULL,
    quantidade INT NOT NULL,
    valor DECIMAL(10, 2) NOT NULL,
    data_venda DATE NOT NULL,
    CONSTRAINT fk_vendas_funcionarios
        FOREIGN KEY (funcionario_id) REFERENCES funcionarios(id)
);

INSERT INTO departamentos (nome, orcamento)
VALUES
    ('TI', 250000.00),
    ('RH', 120000.00),
    ('Vendas', 300000.00);

INSERT INTO funcionarios
    (departamento_id, nome, email, cargo, salario, data_contratacao)
VALUES
    (1, 'Joao Silva', 'joao@email.com', 'Desenvolvedor', 7000.00, '2023-01-15'),
    (2, 'Maria Santos', 'maria@email.com', 'Analista RH', 5200.00, '2023-02-01'),
    (3, 'Carlos Oliveira', 'carlos@email.com', 'Vendedor', 4500.00, '2023-03-10');
```

---

## Comandos Essenciais

Subir:

```bash
docker compose up -d
```

Ver containers:

```bash
docker compose ps
```

Logs:

```bash
docker compose logs -f mysql
```

Entrar no MySQL:

```bash
docker exec -it mysql_empresa mysql -u usuario -p empresa
```

Parar:

```bash
docker compose down
```

Parar removendo dados:

```bash
docker compose down -v
```

`down -v` apaga o volume. Use apenas quando quiser recriar o banco.

---

## Conectando de Fora e de Dentro do Docker

Aplicação rodando na máquina:

```text
host=localhost
port=3306
user=usuario
password=senha123
database=empresa
```

Aplicação rodando em outro container na mesma rede:

```text
host=mysql
port=3306
user=usuario
password=senha123
database=empresa
```

Essa diferença é uma das causas mais comuns de erro.

---

## Dockerfile para Aplicação Python

```dockerfile
FROM python:3.12-slim

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /app

RUN apt-get update && apt-get install -y \
    default-libmysqlclient-dev \
    gcc \
    pkg-config \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

CMD ["python", "app.py"]
```

`mysql-connector-python` normalmente não exige bibliotecas nativas. `mysqlclient` exige. Escolha o driver com consciência.

---

## requirements.txt

```txt
mysql-connector-python==8.4.0
pymysql==1.1.1
sqlalchemy==2.0.30
python-dotenv==1.0.1
pandas==2.2.2
openpyxl==3.1.5
pytest==8.2.0
```

Fixar versões aumenta reprodutibilidade.

---

## Backup

Gerar dump:

```bash
docker exec mysql_empresa mysqldump -u usuario -p empresa > backup.sql
```

Restaurar:

```bash
docker exec -i mysql_empresa mysql -u usuario -p empresa < backup.sql
```

Em produção, backup precisa de política, retenção, criptografia e teste de restore.

---

## Health Check

Health check permite que dependências aguardem MySQL ficar pronto:

```yaml
healthcheck:
  test: ["CMD", "mysqladmin", "ping", "-h", "localhost"]
  interval: 10s
  timeout: 5s
  retries: 10
```

`depends_on` não garante que banco aceitou conexões, a menos que use condição de saúde em Compose compatível.

---

## Segurança

Para desenvolvimento, senhas simples são aceitáveis. Para produção:

- não publique porta 3306 para internet;
- use secrets;
- use usuário com permissões mínimas;
- ative backup;
- use TLS quando necessário;
- monitore conexões e queries lentas;
- mantenha imagem atualizada;
- não use root pela aplicação.

---

## Erros Comuns

- alterar `init.sql` esperando recriar banco com volume existente;
- usar `localhost` dentro de container para acessar outro container;
- expor MySQL publicamente;
- usar usuário root na aplicação;
- não persistir volume;
- remover volume sem backup;
- não esperar MySQL ficar saudável;
- misturar dados de teste e produção.

---

## Checklist

- Compose sobe MySQL com volume?
- `init.sql` cria schema e dados iniciais?
- Aplicação sabe usar `localhost` ou `mysql` conforme ambiente?
- Health check está configurado?
- Backup e restore foram testados?
- Porta 3306 não fica pública em produção?
- Usuário da aplicação tem permissões mínimas?

Um ambiente MySQL em Docker bem definido torna desenvolvimento e testes mais previsíveis. A mesma disciplina prepara o caminho para CI, integração e deploy.

