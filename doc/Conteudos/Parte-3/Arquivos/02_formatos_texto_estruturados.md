# TXT, CSV, JSON, XML, YAML e Pickle

Este arquivo cobre formatos de texto e formatos estruturados usados em integrações, configuração, dados, APIs, ETL e persistência simples. Markdown, TOML e formatos colunares aparecem em `07_markdown_toml_colunares.md`.

---

## Sumário

1. [TXT](#txt)
2. [CSV](#csv)
3. [JSON](#json)
4. [XML](#xml)
5. [YAML](#yaml)
6. [Markdown e TOML](#markdown-e-toml)
7. [Pickle](#pickle)
8. [Conversão Entre Formatos](#conversão-entre-formatos)
9. [Validação](#validação)
10. [Boas Práticas](#boas-práticas)
11. [Exercícios](#exercícios)

---

## TXT

TXT é simples, mas exige padronização.

```python
from pathlib import Path

linhas = Path("nomes.txt").read_text(encoding="utf-8").splitlines()
```

Processamento:

```python
def carregar_nomes(caminho):
    with open(caminho, encoding="utf-8") as arquivo:
        return [
            linha.strip()
            for linha in arquivo
            if linha.strip()
        ]
```

Escrita:

```python
def salvar_linhas(caminho, linhas):
    with open(caminho, "w", encoding="utf-8") as arquivo:
        for linha in linhas:
            arquivo.write(f"{linha}\n")
```

---

## CSV

CSV é comum em dados tabulares.

Com biblioteca padrão:

```python
import csv

with open("clientes.csv", newline="", encoding="utf-8") as arquivo:
    leitor = csv.DictReader(arquivo)
    for linha in leitor:
        print(linha["nome"])
```

Escrita:

```python
import csv

clientes = [
    {"id": 1, "nome": "Ana"},
    {"id": 2, "nome": "Bia"},
]

with open("clientes.csv", "w", newline="", encoding="utf-8") as arquivo:
    campos = ["id", "nome"]
    escritor = csv.DictWriter(arquivo, fieldnames=campos)
    escritor.writeheader()
    escritor.writerows(clientes)
```

Com Pandas:

```python
import pandas as pd

df = pd.read_csv("clientes.csv")
df.to_csv("saida.csv", index=False)
```

CSV grande:

```python
for chunk in pd.read_csv("grande.csv", chunksize=100_000):
    processar(chunk)
```

Cuidados:

- delimitador;
- encoding;
- aspas;
- quebra de linha;
- decimal vírgula;
- tipos inferidos incorretamente.

---

## JSON

JSON é padrão em APIs.

```python
import json
from pathlib import Path

dados = {"nome": "Ana", "idade": 30}

Path("usuario.json").write_text(
    json.dumps(dados, ensure_ascii=False, indent=2),
    encoding="utf-8",
)
```

Leitura:

```python
dados = json.loads(Path("usuario.json").read_text(encoding="utf-8"))
```

Streaming JSON Lines:

```python
import json

with open("eventos.jsonl", encoding="utf-8") as arquivo:
    for linha in arquivo:
        evento = json.loads(linha)
        processar(evento)
```

Escrever JSONL:

```python
with open("eventos.jsonl", "w", encoding="utf-8") as arquivo:
    for evento in eventos:
        arquivo.write(json.dumps(evento, ensure_ascii=False) + "\n")
```

---

## XML

XML ainda aparece em integrações fiscais, legados e documentos.

Leitura:

```python
import xml.etree.ElementTree as ET

tree = ET.parse("dados.xml")
root = tree.getroot()

for item in root.findall(".//item"):
    print(item.get("id"), item.text)
```

Criar XML:

```python
import xml.etree.ElementTree as ET

root = ET.Element("clientes")
cliente = ET.SubElement(root, "cliente", id="1")
nome = ET.SubElement(cliente, "nome")
nome.text = "Ana"

tree = ET.ElementTree(root)
tree.write("clientes.xml", encoding="utf-8", xml_declaration=True)
```

Segurança: XML pode ter riscos como entity expansion. Para XML não confiável, prefira bibliotecas seguras como `defusedxml`.

---

## YAML

YAML é comum em configuração.

Instalação:

```bash
python -m pip install pyyaml
```

Leitura segura:

```python
import yaml

with open("config.yaml", encoding="utf-8") as arquivo:
    config = yaml.safe_load(arquivo)
```

Escrita:

```python
with open("config.yaml", "w", encoding="utf-8") as arquivo:
    yaml.safe_dump(config, arquivo, allow_unicode=True, sort_keys=False)
```

Nunca use `yaml.load` sem loader seguro em arquivo não confiável.

---

## Markdown e TOML

Markdown é comum em documentação, READMEs e relatórios simples. TOML é comum em configuração moderna de projetos Python, como `pyproject.toml`.

Exemplos completos de leitura, escrita e conversão estão em `07_markdown_toml_colunares.md`.

---

## Pickle

Pickle serializa objetos Python.

```python
import pickle

dados = {"modelo": "exemplo", "versao": 1}

with open("dados.pkl", "wb") as arquivo:
    pickle.dump(dados, arquivo)
```

Leitura:

```python
with open("dados.pkl", "rb") as arquivo:
    dados = pickle.load(arquivo)
```

Alerta: nunca carregue pickle de fonte não confiável. Pickle pode executar código.

Use Pickle para:

- cache local controlado;
- objetos internos;
- experimentos;
- modelos em ambiente confiável.

Evite para:

- troca pública de dados;
- upload de usuário;
- integração externa;
- armazenamento de longo prazo sem controle de versão.

---

## Conversão Entre Formatos

CSV para JSON:

```python
import pandas as pd

df = pd.read_csv("clientes.csv")
df.to_json("clientes.json", orient="records", force_ascii=False, indent=2)
```

JSON para CSV:

```python
df = pd.read_json("clientes.json")
df.to_csv("clientes.csv", index=False)
```

XML para lista:

```python
def xml_para_clientes(caminho):
    tree = ET.parse(caminho)
    root = tree.getroot()
    return [
        {"id": item.get("id"), "nome": item.findtext("nome")}
        for item in root.findall(".//cliente")
    ]
```

---

## Validação

Valide dados antes de usar.

```python
def validar_cliente(cliente):
    if "id" not in cliente:
        raise ValueError("id obrigatório")
    if not cliente.get("nome"):
        raise ValueError("nome obrigatório")
```

Com Pydantic:

```python
from pydantic import BaseModel, EmailStr

class Cliente(BaseModel):
    id: int
    nome: str
    email: EmailStr
```

---

## Boas Práticas

- Use CSV para tabular simples.
- Use JSON para APIs e estruturas hierárquicas.
- Use JSONL para streaming de eventos.
- Use YAML para configuração humana.
- Use TOML para configuração de projeto.
- Use Markdown para documentação e relatórios textuais.
- Use XML quando integração exigir.
- Evite Pickle com dados não confiáveis.
- Valide schema e campos obrigatórios.
- Documente encoding e delimitador.

---

## Exercícios

1. Leia TXT removendo linhas vazias.
2. Leia e escreva CSV com `csv.DictReader`.
3. Converta CSV para JSON.
4. Leia JSONL linha a linha.
5. Parseie XML simples.
6. Leia YAML com `safe_load`.
7. Leia TOML de configuração.
8. Gere relatório Markdown.
9. Salve e leia objeto com Pickle em ambiente controlado.
10. Crie validação para registros.
