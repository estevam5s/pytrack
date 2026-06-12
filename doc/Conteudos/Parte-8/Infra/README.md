# Infraestrutura para Python

Trilha completa para dominar infraestrutura de aplicações Python: autenticação, middlewares, CORS, rate limiting, serialização, upload, background tasks, cache, logs, Linux, Nginx, Apache, Gunicorn, Uvicorn e CI/CD.

O foco é transformar uma aplicação Python que funciona localmente em um serviço operável: seguro, observável, testável, versionado, automatizado e pronto para deploy.

---

## Estrutura

### Conceitos

1. [Autenticação JWT e OAuth2](./Conceitos/01_autenticacao_jwt_oauth2.md)
2. [Middlewares, CORS e Rate Limiting](./Conceitos/02_middlewares_cors_rate_limiting.md)
3. [Serialização, Uploads e Background Tasks](./Conceitos/03_serializacao_upload_background_tasks.md)
4. [Cache e Logs em Aplicações Python](./Conceitos/04_cache_logs_observabilidade.md)

### Infraestrutura

5. [Linux para Deploy de Aplicações Python](./Servidores/01_linux_python_deploy.md)
6. [Nginx e Apache como Reverse Proxy](./Servidores/02_nginx_apache_reverse_proxy.md)
7. [Gunicorn e Uvicorn: Servidores Python em Produção](./Servidores/03_gunicorn_uvicorn.md)

### CI/CD

8. [CI/CD com GitHub Actions](./Actions/01_github_actions.md)
9. [GitLab CI, Jenkins e Pipelines Profissionais](./Actions/02_gitlab_jenkins_pipelines.md)
10. [Deploy Automatizado, Versionamento, Build e Release](./Actions/03_deploy_versionamento_release.md)

---

## Competências Esperadas

Ao concluir esta trilha, você deve saber:

- implementar autenticação JWT e fluxos OAuth2;
- criar middlewares para logs, request id, segurança e métricas;
- configurar CORS corretamente;
- aplicar rate limiting com Redis ou gateway;
- serializar dados com Pydantic, JSON e formatos de API;
- receber uploads com validação e segurança;
- executar tarefas em background com filas ou workers;
- usar cache com estratégia de invalidação;
- estruturar logs para produção;
- operar aplicações Python em Linux;
- configurar Nginx/Apache como reverse proxy;
- usar Gunicorn e Uvicorn com workers adequados;
- criar pipelines com GitHub Actions, GitLab CI e Jenkins;
- automatizar testes, build, release e deploy.

---

## Aplicação de Referência

Os exemplos assumem uma API Python, normalmente FastAPI ou Flask, executando atrás de um servidor de aplicação e um reverse proxy:

```text
Cliente -> Nginx/Apache -> Gunicorn/Uvicorn -> Aplicação Python -> Banco/Redis/Fila
```

