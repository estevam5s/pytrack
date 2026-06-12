# Automação de Relatórios: Templates, Agendamentos, E-mails e Qualidade

Automatizar relatórios Excel significa transformar um processo manual repetitivo em uma rotina reproduzível. O resultado pode continuar sendo uma planilha, mas a geração deve ter validação, logs, tratamento de erros e rastreabilidade.

Automação ruim apenas faz erros acontecerem mais rápido. Automação profissional verifica entrada, aplica regras, gera saída e registra o que ocorreu.

---

## Fluxo Profissional

```text
1. carregar dados
2. validar estrutura
3. limpar e transformar
4. calcular indicadores
5. gerar Excel
6. formatar
7. validar saída
8. salvar com nome versionado
9. enviar/publicar
10. registrar log
```

Cada etapa deve falhar com mensagem clara.

---

## Estrutura de Projeto

```text
relatorios-excel/
├── app/
│   ├── config.py
│   ├── extract.py
│   ├── transform.py
│   ├── validate.py
│   ├── report.py
│   └── emailer.py
├── templates/
│   └── relatorio_template.xlsx
├── output/
├── logs/
├── tests/
├── requirements.txt
└── README.md
```

Evite script único gigante.

---

## Configuração

```python
from dataclasses import dataclass
from pathlib import Path
import os


@dataclass(frozen=True)
class Settings:
    input_dir: Path
    output_dir: Path
    smtp_host: str | None
    recipients: list[str]


def get_settings() -> Settings:
    return Settings(
        input_dir=Path(os.getenv("INPUT_DIR", "input")),
        output_dir=Path(os.getenv("OUTPUT_DIR", "output")),
        smtp_host=os.getenv("SMTP_HOST"),
        recipients=os.getenv("RECIPIENTS", "").split(","),
    )
```

Configuração fora do código permite usar o mesmo projeto em ambientes diferentes.

---

## Nome de Arquivo Versionado

```python
from datetime import datetime
from pathlib import Path


def report_filename(base: str, output_dir: Path) -> Path:
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    return output_dir / f"{base}_{timestamp}.xlsx"
```

Evite sobrescrever relatório anterior sem necessidade.

---

## Template Excel

Use template quando:

- layout é fixo;
- identidade visual importa;
- há fórmulas já aprovadas;
- usuários esperam formato específico.

Com openpyxl:

```python
from openpyxl import load_workbook


def preencher_template(template_path: str, output_path: str, resumo: dict) -> None:
    wb = load_workbook(template_path)
    ws = wb["Dashboard"]

    ws["B2"] = resumo["receita_total"]
    ws["B3"] = resumo["pedidos"]
    ws["B4"] = resumo["ticket_medio"]

    wb.save(output_path)
```

Documente quais células são preenchidas por automação.

---

## Relatório com pandas + XlsxWriter

```python
import pandas as pd


def gerar_relatorio(vendas: pd.DataFrame, arquivo: str) -> None:
    resumo = (
        vendas.groupby("regiao", as_index=False)
        .agg(receita=("valor", "sum"), pedidos=("pedido_id", "count"))
        .sort_values("receita", ascending=False)
    )

    with pd.ExcelWriter(arquivo, engine="xlsxwriter") as writer:
        vendas.to_excel(writer, sheet_name="Base", index=False)
        resumo.to_excel(writer, sheet_name="Resumo", index=False)

        workbook = writer.book
        money = workbook.add_format({"num_format": "R$ #,##0.00"})
        header = workbook.add_format({"bold": True, "bg_color": "#1F4E78", "font_color": "white"})

        for sheet_name in ["Base", "Resumo"]:
            ws = writer.sheets[sheet_name]
            ws.freeze_panes(1, 0)
            ws.autofilter(0, 0, 0, len(writer.sheets[sheet_name].table) if False else 0)

        resumo_ws = writer.sheets["Resumo"]
        resumo_ws.set_column("B:B", 16, money)
```

Em código real, isole formatação em funções.

---

## Validação de Saída

Após gerar:

```python
from pathlib import Path


def validar_saida(arquivo: Path) -> None:
    if not arquivo.exists():
        raise RuntimeError("relatorio nao foi criado")

    if arquivo.stat().st_size == 0:
        raise RuntimeError("relatorio vazio")
```

Também valide:

- quantidade de abas;
- colunas esperadas;
- total financeiro;
- período;
- ausência de erros críticos.

---

## Logs

```python
import logging

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s %(levelname)s %(message)s",
)

logger = logging.getLogger(__name__)

logger.info("relatorio_iniciado")
logger.info("linhas_carregadas", extra={"rows": len(df)})
logger.info("relatorio_gerado", extra={"arquivo": str(output_path)})
```

Logs ajudam quando a automação roda sozinha.

---

## Envio por E-mail

Exemplo simplificado:

```python
from email.message import EmailMessage
import smtplib


def enviar_email(smtp_host: str, destinatarios: list[str], anexo: str) -> None:
    msg = EmailMessage()
    msg["Subject"] = "Relatório automático"
    msg["From"] = "relatorios@example.com"
    msg["To"] = ", ".join(destinatarios)
    msg.set_content("Segue relatório em anexo.")

    with open(anexo, "rb") as file:
        msg.add_attachment(
            file.read(),
            maintype="application",
            subtype="vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            filename=anexo,
        )

    with smtplib.SMTP(smtp_host) as smtp:
        smtp.send_message(msg)
```

Em produção, use autenticação, TLS e secrets seguros.

---

## Agendamento

Opções:

- cron;
- Windows Task Scheduler;
- GitHub Actions;
- Airflow;
- Prefect;
- Dagster;
- servidor interno;
- cloud functions.

Cron:

```cron
0 8 * * 1-5 /opt/relatorios/.venv/bin/python /opt/relatorios/main.py
```

Agendamento exige logs e alertas em falha.

---

## Controle de Qualidade

Antes de enviar:

- dados do período correto;
- total confere com fonte;
- não há colunas ausentes;
- não há valores negativos indevidos;
- arquivo abre corretamente;
- abas obrigatórias existem;
- data de atualização foi preenchida.

Automação deve bloquear envio quando validação falha.

---

## Segurança

Cuidados:

- não enviar dados sensíveis para destinatários errados;
- proteger arquivos gerados;
- usar senha/criptografia quando necessário;
- evitar credenciais no código;
- registrar destinatários;
- controlar retenção;
- não anexar base completa quando resumo basta.

Excel circula facilmente por e-mail. Trate como dado sensível.

---

## Erros Comuns

- script sem validação;
- sobrescrever relatório anterior;
- ausência de logs;
- enviar arquivo mesmo com erro;
- caminho absoluto local;
- credenciais hardcoded;
- planilha gerada sem data de atualização;
- falta de teste com arquivo vazio;
- automação depende de Excel aberto;
- ninguém recebe alerta quando falha.

---

## Checklist

- Processo é reexecutável?
- Entradas são validadas?
- Saída tem nome versionado?
- Relatório tem data de atualização?
- Logs são gravados?
- Falhas bloqueiam envio?
- Destinatários são configuráveis?
- Secrets ficam fora do código?
- Há agendamento e alerta?
- Existe README com modo de execução?

Automação de relatórios é engenharia de processo. O arquivo final é só a entrega; a confiabilidade está no pipeline que o gera.

