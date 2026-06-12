# Ambiente Python, Bibliotecas e Organização de Projetos

Bioinformática trabalha com arquivos grandes, ferramentas externas, bancos públicos, metadados e análises que precisam ser reproduzidas. Um ambiente organizado é parte do resultado científico.

---

## Ambiente Virtual

```bash
python -m venv .venv
source .venv/bin/activate
python -m pip install --upgrade pip
```

Instalação base:

```bash
pip install biopython pandas numpy scipy matplotlib seaborn jupyter pytest
```

Para ferramentas bioinformáticas externas, Conda/Mamba é muito usado porque empacota binários.

---

## Biopython

Biopython fornece:

- objetos de sequência;
- parsing FASTA/FASTQ/GenBank;
- tradução/transcrição;
- acesso a Entrez/NCBI;
- wrappers para algumas ferramentas;
- alinhamentos;
- motivos;
- estruturas.

```python
from Bio.Seq import Seq

seq = Seq("ATGGCC")
print(seq.reverse_complement())
print(seq.translate())
```

---

## Pandas e NumPy

Pandas é útil para tabelas:

- metadados de amostras;
- contagens de genes;
- anotações;
- variantes tabulares;
- métricas de qualidade.

```python
import pandas as pd

amostras = pd.DataFrame(
    {
        "sample_id": ["S1", "S2"],
        "grupo": ["controle", "tratado"],
    }
)
print(amostras)
```

---

## Ferramentas Externas

Muitas tarefas não são feitas em Python puro:

- alinhamento: BWA, Bowtie2, STAR, HISAT2;
- QC: FastQC, MultiQC;
- variantes: samtools, bcftools, GATK;
- intervalos genômicos: bedtools;
- filogenia: MAFFT, IQ-TREE;
- workflows: Snakemake, Nextflow.

Python frequentemente orquestra, valida, resume e visualiza resultados.

---

## Organização de Dados

```text
data/
├── raw/
├── reference/
├── processed/
└── results/
```

Regra: nunca sobrescreva dados brutos.

Guarde:

- checksums;
- origem;
- data de download;
- versão da referência;
- parâmetros usados;
- logs.

---

## Metadados

Arquivo de metadados:

```csv
sample_id,grupo,organismo,arquivo_fastq
S1,controle,human,S1.fastq.gz
S2,tratado,human,S2.fastq.gz
```

Metadados ruins inviabilizam análise.

Valide:

- IDs únicos;
- arquivos existentes;
- grupos corretos;
- ausência de campos obrigatórios;
- consistência de nomes.

---

## Reprodutibilidade

Inclua:

- `README.md`;
- ambiente (`requirements.txt`, `environment.yml` ou `pyproject.toml`);
- versões de ferramentas;
- workflow;
- parâmetros;
- logs;
- dados de referência;
- scripts versionados.

---

## Exemplo de Validação

```python
from pathlib import Path
import pandas as pd

def validar_metadados(caminho_csv: str, pasta_dados: str) -> pd.DataFrame:
    df = pd.read_csv(caminho_csv)
    obrigatorias = {"sample_id", "grupo", "arquivo_fastq"}
    faltando = obrigatorias - set(df.columns)
    if faltando:
        raise ValueError(f"Colunas obrigatórias ausentes: {faltando}")

    if df["sample_id"].duplicated().any():
        raise ValueError("sample_id duplicado")

    base = Path(pasta_dados)
    for arquivo in df["arquivo_fastq"]:
        if not (base / arquivo).exists():
            raise FileNotFoundError(base / arquivo)

    return df
```

---

## Exercícios

1. Crie uma estrutura de projeto bioinformático.
2. Instale Biopython e traduza uma sequência.
3. Monte um CSV de metadados.
4. Valide IDs duplicados.
5. Liste versões de ferramentas usadas em uma análise.
