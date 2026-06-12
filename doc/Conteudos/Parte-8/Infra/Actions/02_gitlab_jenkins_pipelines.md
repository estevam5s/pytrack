# GitLab CI, Jenkins e Pipelines Profissionais

Pipelines profissionais automatizam validação, build, empacotamento, publicação e deploy. GitLab CI e Jenkins são ferramentas muito usadas em empresas, cada uma com estilo próprio.

---

## Conceitos de Pipeline

Etapas comuns:

```text
checkout -> install -> lint -> test -> build -> scan -> publish -> deploy
```

Boas práticas:

- falhar cedo;
- separar validação de deploy;
- versionar pipeline junto ao código;
- usar artefatos;
- usar cache;
- proteger produção;
- manter segredos fora do repositório.

---

## GitLab CI Básico

`.gitlab-ci.yml`:

```yaml
stages:
  - test
  - build
  - deploy

variables:
  PIP_CACHE_DIR: "$CI_PROJECT_DIR/.cache/pip"

cache:
  paths:
    - .cache/pip

test:
  stage: test
  image: python:3.12-slim
  script:
    - python -m pip install --upgrade pip
    - pip install -r requirements.txt
    - pip install pytest ruff
    - ruff check .
    - pytest -q
```

---

## GitLab com PostgreSQL

```yaml
test:
  stage: test
  image: python:3.12-slim
  services:
    - name: postgres:16
      alias: postgres
  variables:
    POSTGRES_DB: app_test
    POSTGRES_USER: app
    POSTGRES_PASSWORD: app
    DATABASE_URL: postgresql://app:app@postgres:5432/app_test
  script:
    - pip install -r requirements.txt
    - pytest -q
```

---

## Build e Push Docker no GitLab

```yaml
build_image:
  stage: build
  image: docker:27
  services:
    - docker:27-dind
  variables:
    DOCKER_TLS_CERTDIR: "/certs"
  script:
    - docker login -u "$CI_REGISTRY_USER" -p "$CI_REGISTRY_PASSWORD" "$CI_REGISTRY"
    - docker build -t "$CI_REGISTRY_IMAGE:$CI_COMMIT_SHA" .
    - docker push "$CI_REGISTRY_IMAGE:$CI_COMMIT_SHA"
```

---

## Deploy Manual no GitLab

```yaml
deploy_prod:
  stage: deploy
  image: alpine:latest
  environment: production
  when: manual
  only:
    - main
  script:
    - echo "Deploy em produção"
```

Use aprovação manual para produção quando o risco exige controle.

---

## Jenkins Pipeline

`Jenkinsfile`:

```groovy
pipeline {
  agent any

  stages {
    stage('Install') {
      steps {
        sh 'python3 -m venv .venv'
        sh '. .venv/bin/activate && pip install -r requirements.txt'
      }
    }

    stage('Lint') {
      steps {
        sh '. .venv/bin/activate && ruff check .'
      }
    }

    stage('Test') {
      steps {
        sh '. .venv/bin/activate && pytest -q'
      }
    }
  }
}
```

---

## Jenkins com Docker Build

```groovy
pipeline {
  agent any

  environment {
    IMAGE = "registry.example.com/minha-api:${env.GIT_COMMIT}"
  }

  stages {
    stage('Test') {
      steps {
        sh 'pytest -q'
      }
    }

    stage('Build Image') {
      steps {
        sh 'docker build -t $IMAGE .'
      }
    }

    stage('Push Image') {
      steps {
        withCredentials([usernamePassword(credentialsId: 'registry', usernameVariable: 'USER', passwordVariable: 'PASS')]) {
          sh 'echo $PASS | docker login registry.example.com -u $USER --password-stdin'
          sh 'docker push $IMAGE'
        }
      }
    }
  }
}
```

---

## Artefatos

Artefatos preservam resultados entre jobs:

- pacote wheel;
- relatório de testes;
- coverage;
- imagem Docker publicada;
- manifest Kubernetes renderizado;
- SBOM.

GitLab:

```yaml
artifacts:
  paths:
    - dist/
  expire_in: 1 week
```

Jenkins:

```groovy
post {
  always {
    archiveArtifacts artifacts: 'dist/*', fingerprint: true
  }
}
```

---

## Checklist Pipelines

- etapas são claras?
- testes rodam antes de build/deploy?
- segredos estão no gerenciador da ferramenta?
- produção exige aprovação?
- artefatos são rastreáveis?
- imagem usa tag imutável?
- pipeline é reproduzível?
- falhas notificam responsáveis?
- deploy tem rollback?
- logs do pipeline são suficientes para diagnóstico?

