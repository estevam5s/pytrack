#!/usr/bin/env python3
"""
Projeto de Faculdade — Sistema de Gestão de Curso de Python
============================================================
Consome a API da plataforma PyTrack para acompanhar o progresso dos alunos
de uma turma de Python: XP, nível, módulos concluídos e geração de relatório.

Disciplina: Programação em Python / Integração de Sistemas
Uso da API PyTrack (plano Suprema): https://www.pytrack.com.br/docs/api

Como rodar:
    export PYTRACK_API_KEY="pytk_live_..."   # chave gerada em Configurações -> API
    python gestao_curso.py

Requisitos: Python 3.9+ (usa apenas a biblioteca padrão — urllib).
"""

from __future__ import annotations

import json
import os
import urllib.request
import urllib.error
from dataclasses import dataclass, field
from datetime import datetime

BASE_URL = "https://www.pytrack.com.br/api/v1"


# ----------------------------------------------------------------------------
# Cliente da API PyTrack
# ----------------------------------------------------------------------------
class PyTrackAPIError(Exception):
    """Erro retornado pela API da PyTrack."""


class PyTrackClient:
    """Cliente simples para a API REST da PyTrack."""

    def __init__(self, api_key: str, base_url: str = BASE_URL) -> None:
        if not api_key or not api_key.startswith("pytk_live_"):
            raise ValueError("Informe uma chave de API válida (pytk_live_...).")
        self.api_key = api_key
        self.base_url = base_url.rstrip("/")

    def _get(self, path: str) -> dict:
        req = urllib.request.Request(
            f"{self.base_url}{path}",
            headers={"Authorization": f"Bearer {self.api_key}"},
        )
        try:
            with urllib.request.urlopen(req, timeout=15) as resp:
                return json.loads(resp.read().decode())
        except urllib.error.HTTPError as e:
            body = e.read().decode()
            try:
                msg = json.loads(body).get("error", body)
            except json.JSONDecodeError:
                msg = body
            raise PyTrackAPIError(f"HTTP {e.code}: {msg}") from e
        except urllib.error.URLError as e:
            raise PyTrackAPIError(f"Falha de conexão: {e.reason}") from e

    def get_profile(self) -> dict:
        """GET /me — perfil de aprendizado do dono da chave."""
        return self._get("/me").get("data", {})

    def get_progress(self) -> dict:
        """GET /progress — progresso (XP, nível, módulos concluídos)."""
        return self._get("/progress").get("data", {})


# ----------------------------------------------------------------------------
# Modelo de domínio: Curso e Alunos
# ----------------------------------------------------------------------------
@dataclass
class Aluno:
    nome: str
    api_key: str
    xp: int = 0
    nivel: str = "basico"
    modulos_concluidos: int = 0
    atualizado_em: str = field(default_factory=lambda: datetime.now().isoformat())

    @property
    def aprovado(self) -> bool:
        # critério do curso: concluir ao menos 10 módulos
        return self.modulos_concluidos >= 10

    @property
    def situacao(self) -> str:
        if self.aprovado:
            return "APROVADO"
        if self.modulos_concluidos >= 5:
            return "EM ANDAMENTO"
        return "INICIANTE"


class CursoPython:
    """Gerencia uma turma do curso de Python e sincroniza com a PyTrack."""

    META_MODULOS = 10  # módulos necessários para aprovação

    def __init__(self, nome_curso: str) -> None:
        self.nome_curso = nome_curso
        self.alunos: list[Aluno] = []

    def matricular(self, nome: str, api_key: str) -> Aluno:
        aluno = Aluno(nome=nome, api_key=api_key)
        self.alunos.append(aluno)
        return aluno

    def sincronizar(self) -> None:
        """Atualiza o progresso de cada aluno a partir da API da PyTrack."""
        print(f"\nSincronizando '{self.nome_curso}' com a PyTrack...\n")
        for aluno in self.alunos:
            try:
                client = PyTrackClient(aluno.api_key)
                prog = client.get_progress()
                aluno.xp = int(prog.get("xp", 0))
                aluno.nivel = prog.get("level", "basico")
                aluno.modulos_concluidos = int(prog.get("modulesCompleted", 0))
                aluno.nome = prog.get("student") or aluno.nome
                aluno.atualizado_em = datetime.now().isoformat()
                print(f"  [ok] {aluno.nome}: {aluno.modulos_concluidos} módulos, {aluno.xp} XP")
            except PyTrackAPIError as e:
                print(f"  [erro] {aluno.nome}: {e}")

    def relatorio(self) -> None:
        """Imprime um relatório da turma."""
        print("\n" + "=" * 60)
        print(f"  RELATÓRIO — {self.nome_curso}")
        print("=" * 60)
        print(f"  {'Aluno':<20}{'Nível':<14}{'Módulos':>8}{'XP':>8}  Situação")
        print("-" * 60)
        for a in sorted(self.alunos, key=lambda x: x.modulos_concluidos, reverse=True):
            print(f"  {a.nome[:18]:<20}{a.nivel:<14}{a.modulos_concluidos:>8}{a.xp:>8}  {a.situacao}")
        print("-" * 60)
        aprovados = sum(1 for a in self.alunos if a.aprovado)
        total = len(self.alunos) or 1
        media_xp = sum(a.xp for a in self.alunos) / total
        print(f"  Aprovados: {aprovados}/{len(self.alunos)} "
              f"({aprovados / total * 100:.0f}%)  |  XP médio: {media_xp:.0f}")
        print("=" * 60)

    def exportar_json(self, caminho: str = "relatorio_turma.json") -> None:
        dados = {
            "curso": self.nome_curso,
            "gerado_em": datetime.now().isoformat(),
            "alunos": [
                {
                    "nome": a.nome,
                    "nivel": a.nivel,
                    "xp": a.xp,
                    "modulos_concluidos": a.modulos_concluidos,
                    "situacao": a.situacao,
                }
                for a in self.alunos
            ],
        }
        with open(caminho, "w", encoding="utf-8") as f:
            json.dump(dados, f, indent=2, ensure_ascii=False)
        print(f"\nRelatório exportado para: {caminho}")


# ----------------------------------------------------------------------------
# Execução
# ----------------------------------------------------------------------------
def main() -> None:
    api_key = os.environ.get("PYTRACK_API_KEY", "").strip()
    if not api_key:
        print("Defina a variável PYTRACK_API_KEY com sua chave (pytk_live_...).")
        print('Ex.: export PYTRACK_API_KEY="pytk_live_..."')
        return

    curso = CursoPython("Introdução a Python — Turma 2026.1")

    # Matrícula dos alunos (cada um usa a própria chave de API da PyTrack).
    # Para a demonstração da faculdade, usamos a mesma chave do professor.
    curso.matricular("Professor (demo)", api_key)
    # curso.matricular("Aluno 2", "pytk_live_...")
    # curso.matricular("Aluno 3", "pytk_live_...")

    curso.sincronizar()
    curso.relatorio()
    curso.exportar_json()


if __name__ == "__main__":
    main()
