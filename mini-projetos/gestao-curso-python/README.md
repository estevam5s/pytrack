# 🎓 Sistema de Gestão de Curso de Python

Projeto de faculdade que **gerencia uma turma de um curso de Python** consumindo a
**API da plataforma PyTrack** (plano Suprema). Acompanha o progresso dos alunos
(XP, nível, módulos concluídos), calcula a situação (aprovado/em andamento) e
gera um relatório da turma.

> Demonstra integração de sistemas via API REST usando apenas a biblioteca padrão do Python.

## 📋 O que ele faz

- Conecta-se à API REST da PyTrack (`GET /api/v1/me` e `GET /api/v1/progress`).
- Matricula alunos (cada um com a própria chave de API).
- Sincroniza o progresso real de cada aluno.
- Calcula a **situação acadêmica** (critério: ≥ 10 módulos = aprovado).
- Imprime um **relatório da turma** no terminal.
- Exporta o relatório em **JSON**.

## 🔑 Pré-requisitos

1. Plano **Suprema** na PyTrack.
2. Gerar uma **chave de API** em *Configurações → API* (formato `pytk_live_...`).
3. Python 3.9+ (sem dependências externas — usa `urllib`).

## ▶️ Como rodar

```bash
export PYTRACK_API_KEY="pytk_live_..."   # sua chave da PyTrack
python gestao_curso.py
```

Saída esperada:

```
Sincronizando 'Introdução a Python — Turma 2026.1' com a PyTrack...
  [ok] Estevam: 18 módulos, 1240 XP

============================================================
  RELATÓRIO — Introdução a Python — Turma 2026.1
============================================================
  Aluno               Nível        Módulos      XP  Situação
------------------------------------------------------------
  Estevam             intermediario     18    1240  APROVADO
------------------------------------------------------------
  Aprovados: 1/1 (100%)  |  XP médio: 1240
============================================================

Relatório exportado para: relatorio_turma.json
```

## 🧩 Estrutura do código

- `PyTrackClient` — cliente HTTP da API (autenticação Bearer, tratamento de erros).
- `Aluno` — dataclass com regras de aprovação/situação.
- `CursoPython` — gerencia a turma, sincroniza com a API e gera relatórios.

## 📚 Endpoints da API usados

| Método | Endpoint | Retorno |
|--------|----------|---------|
| GET | `/api/v1/me` | Perfil de aprendizado (nome, XP, nível, skills) |
| GET | `/api/v1/progress` | Progresso (XP, nível, módulos concluídos, recentes) |

Documentação completa: <https://www.pytrack.com.br/docs/api>

## 👤 Autor

Projeto acadêmico — integração com a plataforma **PyTrack** (www.pytrack.com.br).
