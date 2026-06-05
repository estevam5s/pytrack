# Automação de Tarefas e Scripts Profissionais

Automação de tarefas é o uso de código para executar rotinas repetitivas com consistência: renomear arquivos, consolidar relatórios, baixar anexos, gerar PDFs, consultar APIs, validar dados, enviar alertas, limpar pastas, processar lotes e integrar sistemas.

Um script profissional precisa ser previsível. Ele deve aceitar configuração, registrar logs, validar entradas, tratar erros, evitar duplicidade, preservar dados importantes e ser fácil de executar novamente.

---

## Quando Automatizar

Automatize quando:

- a tarefa é repetitiva e baseada em regras claras;
- existe volume suficiente para justificar o esforço;
- o erro humano custa caro;
- a tarefa precisa ocorrer em horários fixos;
- há integração entre sistemas sem integração nativa;
- o processo exige rastreabilidade.

Evite automatizar quando a regra muda diariamente, quando a entrada é ambígua demais ou quando o risco legal/operacional não foi avaliado.

---

## Tipos de Automação

- **Arquivos**: mover, renomear, compactar, validar, separar por data.
- **Dados**: limpar CSV, juntar Excel, gerar relatórios.
- **Web**: consumir APIs, baixar páginas, preencher formulários.
- **Desktop**: clicar em telas, digitar, abrir programas legados.
- **Comunicação**: enviar e-mails, mensagens e notificações.
- **Operação**: backups, limpeza, health checks e rotinas agendadas.

---

## Princípios de um Script Robusto

1. **Idempotência**: rodar duas vezes não deve duplicar resultado indevidamente.
2. **Configuração externa**: caminhos, chaves e URLs não ficam fixos no código.
3. **Logs claros**: cada execução precisa deixar rastros úteis.
4. **Falha explícita**: erro deve ser visível, não escondido.
5. **Validação**: entradas e pré-condições devem ser verificadas.
6. **Separação de responsabilidades**: coletar, processar e salvar são etapas distintas.
7. **Testabilidade**: lógica importante deve ser testável sem depender de tela ou internet.

---

## Script Pequeno: Organizar Arquivos por Extensão

```python
from pathlib import Path
import shutil


def organizar_por_extensao(pasta: Path) -> None:
    for arquivo in pasta.iterdir():
        if not arquivo.is_file():
            continue

        extensao = arquivo.suffix.lower().lstrip(".") or "sem_extensao"
        destino = pasta / extensao
        destino.mkdir(exist_ok=True)

        novo_caminho = destino / arquivo.name
        if novo_caminho.exists():
            print(f"Pulando arquivo existente: {novo_caminho}")
            continue

        shutil.move(str(arquivo), str(novo_caminho))
        print(f"Movido: {arquivo.name} -> {destino.name}/")


if __name__ == "__main__":
    organizar_por_extensao(Path.home() / "Downloads")
```

Pontos importantes:

- `pathlib` deixa o código portável.
- `mkdir(exist_ok=True)` evita erro se a pasta já existir.
- o script evita sobrescrever arquivo existente.

---

## Script com Argumentos de Linha de Comando

Use `argparse` para tornar a automação reutilizável.

```python
from pathlib import Path
import argparse
import shutil


def mover_por_extensao(origem: Path, destino: Path, extensao: str, dry_run: bool) -> int:
    destino.mkdir(parents=True, exist_ok=True)
    total = 0

    for arquivo in origem.glob(f"*.{extensao.lstrip('.')}"):
        alvo = destino / arquivo.name
        total += 1

        if dry_run:
            print(f"[DRY RUN] {arquivo} -> {alvo}")
        else:
            shutil.move(str(arquivo), str(alvo))
            print(f"Movido: {arquivo} -> {alvo}")

    return total


def main() -> None:
    parser = argparse.ArgumentParser(description="Move arquivos por extensão.")
    parser.add_argument("--origem", required=True, type=Path)
    parser.add_argument("--destino", required=True, type=Path)
    parser.add_argument("--extensao", required=True)
    parser.add_argument("--dry-run", action="store_true")
    args = parser.parse_args()

    total = mover_por_extensao(args.origem, args.destino, args.extensao, args.dry_run)
    print(f"Total encontrado: {total}")


if __name__ == "__main__":
    main()
```

Execução:

```bash
python mover.py --origem ~/Downloads --destino ~/Documentos/pdfs --extensao pdf --dry-run
python mover.py --origem ~/Downloads --destino ~/Documentos/pdfs --extensao pdf
```

---

## Configuração com `.env`

Nunca coloque senhas, tokens ou caminhos sensíveis diretamente no código.

`.env.example`:

```env
PASTA_ENTRADA=/caminho/entrada
PASTA_SAIDA=/caminho/saida
URL_API=https://api.exemplo.com
TOKEN_API=coloque_seu_token_aqui
```

Código:

```python
from pathlib import Path
from dotenv import load_dotenv
import os

load_dotenv()

PASTA_ENTRADA = Path(os.environ["PASTA_ENTRADA"])
PASTA_SAIDA = Path(os.environ["PASTA_SAIDA"])
TOKEN_API = os.environ["TOKEN_API"]
```

---

## Logs Profissionais

`print` serve para aprendizado. Em automação real, use `logging`.

```python
import logging
from pathlib import Path


def configurar_logs() -> None:
    Path("logs").mkdir(exist_ok=True)

    logging.basicConfig(
        level=logging.INFO,
        format="%(asctime)s | %(levelname)s | %(name)s | %(message)s",
        handlers=[
            logging.FileHandler("logs/execucao.log", encoding="utf-8"),
            logging.StreamHandler(),
        ],
    )


logger = logging.getLogger(__name__)


def processar_item(item: str) -> None:
    logger.info("Processando item", extra={"item": item})


if __name__ == "__main__":
    configurar_logs()
    logger.info("Iniciando automação")
    processar_item("pedido-123")
    logger.info("Finalizando automação")
```

---

## Retry com Backoff

Falhas temporárias são comuns: rede instável, API lenta, arquivo bloqueado, servidor indisponível.

```python
import requests
from tenacity import retry, stop_after_attempt, wait_exponential, retry_if_exception_type


@retry(
    stop=stop_after_attempt(5),
    wait=wait_exponential(multiplier=1, min=1, max=30),
    retry=retry_if_exception_type(requests.RequestException),
)
def baixar_json(url: str) -> dict:
    resposta = requests.get(url, timeout=15)
    resposta.raise_for_status()
    return resposta.json()
```

Retry não deve mascarar erro permanente. Configure limite de tentativas e logue a falha final.

---

## Exemplo Completo: Consolidar CSVs em um Relatório

```python
from pathlib import Path
import argparse
import logging
import pandas as pd


logger = logging.getLogger("consolidar_csv")


def configurar_logs() -> None:
    logging.basicConfig(
        level=logging.INFO,
        format="%(asctime)s | %(levelname)s | %(message)s",
    )


def ler_csvs(pasta: Path) -> pd.DataFrame:
    arquivos = sorted(pasta.glob("*.csv"))
    if not arquivos:
        raise FileNotFoundError(f"Nenhum CSV encontrado em {pasta}")

    frames = []
    for arquivo in arquivos:
        logger.info("Lendo %s", arquivo)
        df = pd.read_csv(arquivo)
        df["arquivo_origem"] = arquivo.name
        frames.append(df)

    return pd.concat(frames, ignore_index=True)


def validar_colunas(df: pd.DataFrame, obrigatorias: set[str]) -> None:
    faltantes = obrigatorias - set(df.columns)
    if faltantes:
        raise ValueError(f"Colunas obrigatórias ausentes: {sorted(faltantes)}")


def gerar_resumo(df: pd.DataFrame) -> pd.DataFrame:
    return (
        df.groupby("categoria", as_index=False)
        .agg(total=("valor", "sum"), quantidade=("valor", "size"))
        .sort_values("total", ascending=False)
    )


def salvar_relatorio(df: pd.DataFrame, resumo: pd.DataFrame, saida: Path) -> None:
    saida.parent.mkdir(parents=True, exist_ok=True)
    with pd.ExcelWriter(saida, engine="openpyxl") as writer:
        df.to_excel(writer, index=False, sheet_name="dados")
        resumo.to_excel(writer, index=False, sheet_name="resumo")


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--entrada", type=Path, required=True)
    parser.add_argument("--saida", type=Path, required=True)
    args = parser.parse_args()

    configurar_logs()
    logger.info("Iniciando consolidação")

    df = ler_csvs(args.entrada)
    validar_colunas(df, {"categoria", "valor"})
    resumo = gerar_resumo(df)
    salvar_relatorio(df, resumo, args.saida)

    logger.info("Relatório salvo em %s", args.saida)


if __name__ == "__main__":
    main()
```

---

## Checklist de Produção

- O script tem `README` com instalação e execução?
- As dependências estão fixadas?
- Há `.env.example` sem segredos reais?
- Existem logs em arquivo?
- Os erros retornam código diferente de zero?
- Há `--dry-run` para operações perigosas?
- Caminhos são configuráveis?
- Arquivos importantes não são sobrescritos sem confirmação?
- Existe teste da lógica principal?
- A execução pode ser repetida sem duplicar registros?

