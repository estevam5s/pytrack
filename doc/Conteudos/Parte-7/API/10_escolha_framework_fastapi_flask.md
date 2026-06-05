# Escolha de Framework: FastAPI, Flask, ASGI, WSGI, Tipagem e OpenAPI

Escolher framework é uma decisão de produto, equipe e arquitetura. Flask e FastAPI são ótimos, mas resolvem problemas com filosofias diferentes.

---

## Flask

Flask é um microframework simples, maduro e flexível.

Características:

- minimalista;
- sincrônico por padrão;
- baseado em WSGI;
- curva de entrada baixa;
- ecossistema grande;
- deixa muitas decisões para o time;
- excelente para APIs simples, MVPs, aplicações internas e projetos com padrões definidos pela equipe.

Vantagens:

- simplicidade;
- controle arquitetural;
- muita documentação e exemplos;
- fácil de iniciar;
- bom para projetos pequenos e médios.

Cuidados:

- validação não vem integrada;
- documentação OpenAPI não vem automática;
- estrutura profissional depende da equipe;
- async não é o foco principal;
- projetos grandes precisam de disciplina.

---

## FastAPI

FastAPI é um framework moderno para APIs com tipagem, validação e documentação automática.

Características:

- alta performance;
- baseado em ASGI;
- usa type hints;
- usa Pydantic para validação;
- gera OpenAPI automaticamente;
- documentação interativa em `/docs`;
- suporta `async def`;
- bom para APIs modernas, contratos fortes, microserviços e times que querem validação integrada.

Vantagens:

- validação automática;
- serialização clara;
- documentação automática;
- melhor ergonomia com schemas;
- suporte natural a async;
- integração forte com OpenAPI.

Cuidados:

- exige melhor entendimento de type hints;
- async mal usado pode bloquear event loop;
- Pydantic precisa ser entendido;
- decisões de arquitetura ainda são necessárias.

---

## WSGI e ASGI

WSGI é a interface tradicional entre servidores Python e aplicações web síncronas.

Exemplos:

- Flask tradicional;
- Django tradicional;
- Gunicorn com workers sync.

ASGI é uma interface mais moderna para aplicações assíncronas e conexões longas.

Exemplos:

- FastAPI;
- Starlette;
- Django ASGI;
- WebSockets.

ASGI suporta melhor:

- async I/O;
- WebSockets;
- long polling;
- streaming;
- alta concorrência I/O-bound.

---

## Sync e Async

Código síncrono executa uma operação por vez dentro daquele fluxo.

Código assíncrono permite alternar entre operações de I/O sem bloquear o event loop.

Use async quando:

- chama APIs externas com cliente async;
- usa banco com driver async;
- precisa de WebSockets;
- há muito I/O concorrente.

Use sync quando:

- bibliotecas usadas são bloqueantes;
- lógica é simples;
- banco/ORM é síncrono;
- equipe ainda não domina async;
- gargalo não é concorrência I/O.

Não use `async` como decoração estética. Código bloqueante dentro de `async def` prejudica performance.

---

## OpenAPI

OpenAPI é uma especificação de contrato HTTP.

Ela descreve:

- endpoints;
- métodos;
- parâmetros;
- schemas de entrada;
- schemas de saída;
- autenticação;
- status codes;
- exemplos.

FastAPI gera OpenAPI automaticamente a partir de type hints, Pydantic e decorators. Flask pode gerar OpenAPI com extensões, mas não é nativo no núcleo.

---

## Comparação Prática

| Critério | Flask | FastAPI |
|---|---|---|
| Filosofia | Microframework minimalista | Framework moderno orientado a APIs |
| Execução | Síncrona por padrão | ASGI, sync e async |
| Validação | Manual/extensões | Integrada com Pydantic |
| OpenAPI | Extensões | Automático |
| Curva inicial | Muito baixa | Baixa/média |
| Tipagem | Opcional | Central |
| Performance I/O | Boa com arquitetura correta | Excelente para async I/O |
| Flexibilidade | Muito alta | Alta, com padrões fortes |
| Melhor uso | Simplicidade e controle | APIs tipadas e contrato forte |

---

## Quando Escolher Flask

Escolha Flask quando:

- o projeto é pequeno;
- a API é simples;
- a equipe quer máximo controle;
- você quer aprender HTTP sem muita automação;
- o sistema é majoritariamente síncrono;
- já existe ecossistema Flask na empresa;
- documentação automática não é prioridade inicial.

---

## Quando Escolher FastAPI

Escolha FastAPI quando:

- contratos de API importam muito;
- validação forte é necessária;
- documentação OpenAPI deve nascer junto;
- há uso de type hints;
- há endpoints async ou I/O concorrente;
- você quer produtividade com schemas;
- o projeto é API-first.

---

## Decisão Profissional

Perguntas:

- Quem vai consumir a API?
- A documentação precisa ser automática?
- A equipe domina tipagem?
- O projeto precisa de async?
- O banco/ORM será sync ou async?
- O domínio exige validação forte?
- O projeto é MVP ou serviço crítico?
- Há padrões internos na empresa?

Framework bom não salva API mal desenhada. Antes de escolher, defina recursos, contratos, erros, autenticação, testes e operação.

---

## Exercícios

1. Escolha Flask ou FastAPI para uma API interna simples e justifique.
2. Escolha Flask ou FastAPI para uma API pública com OpenAPI e justifique.
3. Explique WSGI e ASGI com suas palavras.
4. Liste riscos de usar `async` incorretamente.
5. Crie uma tabela de decisão para seu próximo backend.
