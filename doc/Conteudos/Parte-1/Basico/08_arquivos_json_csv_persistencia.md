# Arquivos, Caminhos, JSON, CSV e Persistência

Programas reais precisam ler configurações, salvar resultados, importar planilhas, gerar relatórios e preservar dados entre execuções. Este guia cobre arquivos de texto, caminhos com `pathlib`, JSON, CSV e cuidados de persistência.

---

## Objetivo

Ao final, você deve saber:

- abrir e fechar arquivos com segurança;
- usar `pathlib`;
- ler e escrever texto;
- trabalhar com JSON;
- ler e gravar CSV;
- lidar com encoding;
- organizar diretórios de entrada e saída;
- evitar sobrescrever dados importantes sem controle.

---

## Pathlib

Prefira `pathlib.Path` para caminhos.

```python
from pathlib import Path

caminho = Path("dados") / "entrada.txt"
print(caminho)
```

Verificações:

```python
if caminho.exists():
    print("Arquivo existe")

if caminho.is_file():
    print("É arquivo")

if caminho.parent.exists():
    print("Diretório existe")
```

Criar diretório:

```python
saida = Path("reports")
saida.mkdir(parents=True, exist_ok=True)
```

---

## Lendo Arquivo de Texto

```python
from pathlib import Path

caminho = Path("dados.txt")
conteudo = caminho.read_text(encoding="utf-8")
print(conteudo)
```

Linha por linha:

```python
with caminho.open(encoding="utf-8") as arquivo:
    for linha in arquivo:
        print(linha.strip())
```

Use `with` quando precisar controlar leitura incremental.

---

## Escrevendo Arquivo de Texto

```python
from pathlib import Path

caminho = Path("saida.txt")
caminho.write_text("Resultado final\n", encoding="utf-8")
```

Adicionar conteúdo:

```python
with caminho.open("a", encoding="utf-8") as arquivo:
    arquivo.write("Nova linha\n")
```

Modos comuns:

- `"r"`: leitura;
- `"w"`: escrita, sobrescreve;
- `"a"`: adiciona ao final;
- `"x"`: cria, falha se já existir.

---

## Encoding

Sempre declare encoding.

```python
conteudo = Path("arquivo.txt").read_text(encoding="utf-8")
```

Problemas de encoding aparecem quando arquivos vêm de sistemas diferentes. Em projetos profissionais, documente o formato esperado.

---

## JSON

JSON é comum para configurações, APIs e dados estruturados simples.

```python
import json
from pathlib import Path

usuario = {
    "id": 1,
    "nome": "Ana",
    "ativo": True,
}

caminho = Path("usuario.json")
caminho.write_text(json.dumps(usuario, indent=2, ensure_ascii=False), encoding="utf-8")
```

Ler:

```python
dados = json.loads(caminho.read_text(encoding="utf-8"))
print(dados["nome"])
```

Com `open`:

```python
with caminho.open("w", encoding="utf-8") as arquivo:
    json.dump(usuario, arquivo, indent=2, ensure_ascii=False)
```

---

## CSV

CSV é comum para planilhas e exportações.

```python
import csv
from pathlib import Path

linhas = [
    {"nome": "Ana", "idade": 30},
    {"nome": "Bia", "idade": 25},
]

caminho = Path("usuarios.csv")

with caminho.open("w", encoding="utf-8", newline="") as arquivo:
    campos = ["nome", "idade"]
    writer = csv.DictWriter(arquivo, fieldnames=campos)
    writer.writeheader()
    writer.writerows(linhas)
```

Ler:

```python
with caminho.open(encoding="utf-8", newline="") as arquivo:
    reader = csv.DictReader(arquivo)
    for linha in reader:
        print(linha["nome"], int(linha["idade"]))
```

Use `newline=""` com CSV para evitar linhas extras em alguns sistemas.

---

## Validação de Arquivos

```python
from pathlib import Path

def carregar_texto(caminho: Path) -> str:
    if not caminho.exists():
        raise FileNotFoundError(f"Arquivo não encontrado: {caminho}")
    if not caminho.is_file():
        raise ValueError(f"Caminho não é arquivo: {caminho}")
    return caminho.read_text(encoding="utf-8")
```

Mensagens de erro devem ajudar a corrigir o problema.

---

## Estrutura de Dados em Projetos

```text
projeto/
├── data/
│   ├── raw/
│   ├── processed/
│   └── output/
├── reports/
└── src/
```

Regras:

- `raw`: dados originais;
- `processed`: dados tratados;
- `output`: resultados gerados;
- `reports`: relatórios finais.

Não sobrescreva dados brutos.

---

## Boas Práticas

- Use `pathlib`.
- Declare `encoding`.
- Use `with` para arquivos abertos.
- Valide existência antes de ler quando a mensagem de erro precisar ser melhor.
- Não use caminhos absolutos fixos sem necessidade.
- Não misture dados brutos e resultados.
- Salve JSON com indentação quando for lido por humanos.
- Para dados tabulares grandes, considere `pandas` depois de dominar `csv`.

---

## Checklist de Proficiência

Você domina este tópico quando consegue:

- ler e escrever texto com encoding;
- criar diretórios com `Path.mkdir`;
- usar JSON para configurações simples;
- ler e gravar CSV com cabeçalho;
- tratar arquivo inexistente;
- organizar entrada, processamento e saída;
- explicar quando usar texto, JSON ou CSV.

---

## Exercícios

1. Leia um arquivo de texto e conte quantas linhas ele possui.
2. Crie um JSON com configurações de um programa.
3. Leia esse JSON e valide se há uma chave obrigatória.
4. Grave uma lista de produtos em CSV.
5. Leia o CSV e calcule o total de estoque.

---

## Aprofundamento Complementar

### Persistência não é só salvar arquivo

Persistir dados envolve formato, localização, versão, validação, backup e recuperação. Mesmo com JSON simples, defina o que acontece quando:

- o arquivo não existe;
- o arquivo está vazio;
- o JSON está inválido;
- uma chave obrigatória está ausente;
- a versão do formato mudou.

### Escrita segura

Para reduzir risco de corromper arquivo, grave primeiro em arquivo temporário e depois substitua.

```python
from pathlib import Path

def salvar_seguro(caminho: Path, conteudo: str) -> None:
    temporario = caminho.with_suffix(caminho.suffix + ".tmp")
    temporario.write_text(conteudo, encoding="utf-8")
    temporario.replace(caminho)
```

### Versão de formato

```json
{
  "versao": 1,
  "tarefas": []
}
```

Incluir versão facilita migrações futuras.

### CSV exige contrato

CSV parece simples, mas precisa de contrato:

- separador;
- encoding;
- cabeçalho;
- tipos esperados;
- formato de data;
- separador decimal;
- tratamento de valores vazios.

### Exercícios extras

1. Crie um JSON com campo `versao`.
2. Valide se um CSV possui todas as colunas obrigatórias.
3. Implemente escrita segura com arquivo temporário.
4. Trate `json.JSONDecodeError`.
5. Crie uma função que migra dados da versão 1 para versão 2.
