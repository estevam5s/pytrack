# Docker Compose com Python: Ambientes Locais, Serviços e Integração

Docker Compose permite declarar e executar múltiplos containers como um ambiente: API Python, banco PostgreSQL, Redis, workers, fila, ferramenta de administração e jobs. É excelente para desenvolvimento local, testes de integração, demos, laboratórios e ambientes internos simples.

Compose não é Kubernetes. Ele não é uma plataforma completa de orquestração de produção, mas é uma ferramenta muito eficiente para padronizar ambientes.

---

## Primeiro Compose

`compose.yml`:

```yaml
services:
  app:
    image: python:3.12-slim
    working_dir: /app
    volumes:
      - .:/app
    command: python app.py
```

Execução:

```bash
docker compose up
```

Executar e remover ao final:

```bash
docker compose up --abort-on-container-exit
docker compose down
```

---

## API Python com Build

```yaml
services:
  api:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "8000:8000"
    environment:
      APP_ENV: development
    command: uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

`--reload` é útil em desenvolvimento, mas não deve ser usado em produção.

---

## Compose com PostgreSQL

```yaml
services:
  api:
    build: .
    ports:
      - "8000:8000"
    environment:
      DATABASE_URL: postgresql://app:app@db:5432/app
    depends_on:
      - db

  db:
    image: postgres:16
    environment:
      POSTGRES_DB: app
      POSTGRES_USER: app
      POSTGRES_PASSWORD: app
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

Dentro da rede do Compose, a API acessa o banco pelo hostname `db`.

---

## `depends_on` não Espera o Banco Estar Pronto

`depends_on` controla ordem de inicialização, mas não garante que o PostgreSQL já aceite conexões.

Use healthcheck:

```yaml
services:
  db:
    image: postgres:16
    environment:
      POSTGRES_DB: app
      POSTGRES_USER: app
      POSTGRES_PASSWORD: app
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U app -d app"]
      interval: 5s
      timeout: 5s
      retries: 10

  api:
    build: .
    depends_on:
      db:
        condition: service_healthy
    environment:
      DATABASE_URL: postgresql://app:app@db:5432/app
```

Mesmo com healthcheck, sua aplicação deve ter retry na conexão inicial.

---

## API com Redis e Worker

```yaml
services:
  api:
    build: .
    ports:
      - "8000:8000"
    environment:
      REDIS_URL: redis://redis:6379/0
    depends_on:
      redis:
        condition: service_healthy
    command: uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload

  worker:
    build: .
    environment:
      REDIS_URL: redis://redis:6379/0
    depends_on:
      redis:
        condition: service_healthy
    command: python -m app.worker

  redis:
    image: redis:7
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 5s
      timeout: 3s
      retries: 10
```

Esse padrão permite uma mesma imagem Python rodar como API e worker, mudando apenas o comando.

---

## Exemplo de Worker Python

```python
import os
import time
import redis


redis_url = os.environ["REDIS_URL"]
client = redis.Redis.from_url(redis_url, decode_responses=True)


def processar(tarefa: str) -> None:
    print(f"Processando {tarefa}")
    time.sleep(1)


def main() -> None:
    while True:
        item = client.brpop("fila:tarefas", timeout=5)
        if item is None:
            continue
        _, tarefa = item
        processar(tarefa)


if __name__ == "__main__":
    main()
```

Adicionar tarefa:

```bash
docker compose exec redis redis-cli LPUSH fila:tarefas tarefa-1
```

---

## Variáveis com `.env`

`.env`:

```env
POSTGRES_DB=app
POSTGRES_USER=app
POSTGRES_PASSWORD=app
APP_ENV=development
```

`compose.yml`:

```yaml
services:
  db:
    image: postgres:16
    environment:
      POSTGRES_DB: ${POSTGRES_DB}
      POSTGRES_USER: ${POSTGRES_USER}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
```

Use `.env.example` versionado e mantenha `.env` fora do Git.

---

## env_file

```yaml
services:
  api:
    build: .
    env_file:
      - .env
```

`env_file` injeta variáveis no container. A interpolação do próprio Compose usa o `.env` do diretório do Compose.

---

## Volumes para Desenvolvimento

```yaml
services:
  api:
    build: .
    volumes:
      - .:/app
    command: uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

Vantagem: alterações locais refletem no container.

Risco: você pode mascarar arquivos instalados na imagem. Para dependências, rebuild ainda pode ser necessário.

---

## Volumes Nomeados vs Bind Mount

Bind mount:

```yaml
volumes:
  - .:/app
```

Bom para desenvolvimento.

Volume nomeado:

```yaml
volumes:
  - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

Bom para persistência gerenciada pelo Docker.

---

## Redes

Compose cria uma rede padrão. Serviços se resolvem pelo nome.

Rede explícita:

```yaml
services:
  api:
    networks:
      - backend

  db:
    networks:
      - backend

networks:
  backend:
```

Em ambientes maiores, separar redes reduz exposição desnecessária.

---

## Portas

```yaml
ports:
  - "8000:8000"
```

Formato:

```text
porta_host:porta_container
```

Se um serviço só precisa ser acessado por outros containers, não publique porta no host.

Exemplo: Redis usado apenas internamente não precisa de `ports`.

---

## Profiles

Profiles permitem ligar serviços opcionais.

```yaml
services:
  adminer:
    image: adminer
    ports:
      - "8080:8080"
    profiles:
      - tools
```

Executar:

```bash
docker compose --profile tools up
```

---

## Compose para Testes de Integração

```yaml
services:
  test:
    build:
      context: .
      dockerfile: Dockerfile.test
    environment:
      DATABASE_URL: postgresql://app:app@db:5432/app_test
    depends_on:
      db:
        condition: service_healthy
    command: pytest -q

  db:
    image: postgres:16
    environment:
      POSTGRES_DB: app_test
      POSTGRES_USER: app
      POSTGRES_PASSWORD: app
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U app -d app_test"]
      interval: 5s
      timeout: 5s
      retries: 10
```

Execução:

```bash
docker compose run --rm test
```

---

## Rodando Migrations

Serviço dedicado:

```yaml
services:
  migrate:
    build: .
    environment:
      DATABASE_URL: postgresql://app:app@db:5432/app
    depends_on:
      db:
        condition: service_healthy
    command: alembic upgrade head
    profiles:
      - jobs
```

Executar:

```bash
docker compose --profile jobs run --rm migrate
```

Evite rodar migrations automaticamente em múltiplas réplicas da API.

---

## Compose Completo Profissional

```yaml
name: app-python

services:
  api:
    build:
      context: .
      dockerfile: Dockerfile
    image: app-python-api:dev
    ports:
      - "8000:8000"
    environment:
      APP_ENV: development
      DATABASE_URL: postgresql://app:app@db:5432/app
      REDIS_URL: redis://redis:6379/0
    volumes:
      - .:/app
    depends_on:
      db:
        condition: service_healthy
      redis:
        condition: service_healthy
    command: uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
    healthcheck:
      test: ["CMD", "python", "-c", "import urllib.request; urllib.request.urlopen('http://localhost:8000/health', timeout=3)"]
      interval: 30s
      timeout: 5s
      retries: 3

  worker:
    image: app-python-api:dev
    environment:
      APP_ENV: development
      DATABASE_URL: postgresql://app:app@db:5432/app
      REDIS_URL: redis://redis:6379/0
    volumes:
      - .:/app
    depends_on:
      db:
        condition: service_healthy
      redis:
        condition: service_healthy
    command: python -m app.worker

  migrate:
    image: app-python-api:dev
    environment:
      DATABASE_URL: postgresql://app:app@db:5432/app
    depends_on:
      db:
        condition: service_healthy
    command: alembic upgrade head
    profiles:
      - jobs

  db:
    image: postgres:16
    environment:
      POSTGRES_DB: app
      POSTGRES_USER: app
      POSTGRES_PASSWORD: app
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U app -d app"]
      interval: 5s
      timeout: 5s
      retries: 10

  redis:
    image: redis:7
    command: redis-server --appendonly yes
    volumes:
      - redis_data:/data
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 5s
      timeout: 3s
      retries: 10

  adminer:
    image: adminer
    ports:
      - "8080:8080"
    depends_on:
      - db
    profiles:
      - tools

volumes:
  postgres_data:
  redis_data:
```

Fluxo:

```bash
docker compose build
docker compose --profile jobs run --rm migrate
docker compose up
docker compose --profile tools up adminer
```

---

## Comandos Essenciais

Subir:

```bash
docker compose up
```

Subir em background:

```bash
docker compose up -d
```

Logs:

```bash
docker compose logs -f api
```

Executar comando:

```bash
docker compose exec api python -m app.cli
```

Rodar container temporário:

```bash
docker compose run --rm api python -m pytest
```

Parar:

```bash
docker compose down
```

Remover volumes:

```bash
docker compose down -v
```

Use `down -v` com cuidado porque apaga dados persistidos em volumes do projeto.

---

## Escalando Serviços

```bash
docker compose up --scale worker=3
```

Se escalar API com porta fixa `8000:8000`, haverá conflito. Para múltiplas réplicas locais, normalmente use reverse proxy ou não publique porta diretamente em todas.

---

## Configuração por Ambiente

Arquivos:

```text
compose.yml
compose.override.yml
compose.prod.yml
```

Execução:

```bash
docker compose -f compose.yml -f compose.prod.yml up -d
```

Use override local para desenvolvimento e arquivo específico para produção simples.

---

## Limites de Recursos

```yaml
services:
  api:
    deploy:
      resources:
        limits:
          cpus: "1.0"
          memory: 512M
```

Algumas opções de `deploy` têm efeito completo em Swarm, mas Compose moderno suporta parte dos limites localmente conforme engine.

---

## Segurança no Compose

Práticas:

- não versione `.env` real;
- não publique portas internas sem necessidade;
- rode imagens com usuário não root;
- use senhas diferentes por ambiente;
- evite montar Docker socket;
- use redes separadas quando fizer sentido;
- não use banco local de desenvolvimento como produção;
- faça backup de volumes importantes.

---

## Problemas Comuns

### API não conecta no banco

Verifique:

- está usando hostname `db`, não `localhost`;
- banco está healthy;
- porta interna é `5432`;
- `DATABASE_URL` está correta;
- migrations foram aplicadas.

### Alterei requirements e nada mudou

Faça rebuild:

```bash
docker compose build api
docker compose up api
```

### Dados sumiram

Provavelmente usou `docker compose down -v` ou mudou nome do projeto/volume.

---

## Checklist de Docker Compose

- serviços têm nomes claros?
- API, worker e jobs usam a mesma imagem quando apropriado?
- bancos e caches têm healthcheck?
- `depends_on` usa condição de saúde quando necessário?
- variáveis estão em `.env.example`?
- volumes persistentes estão nomeados?
- portas públicas são apenas as necessárias?
- migrations têm comando separado?
- testes de integração rodam no Compose?
- logs são fáceis de consultar?
- ambiente local é reproduzível para outro dev?

