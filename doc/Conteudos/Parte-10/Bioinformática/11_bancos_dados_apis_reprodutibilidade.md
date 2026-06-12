# Bancos de Dados Biológicos, APIs e Reprodutibilidade

Bioinformática depende de bancos públicos e privados. Saber consultar, versionar, citar e reproduzir resultados é parte essencial do trabalho.

---

## Bancos Biológicos

Principais:

- NCBI;
- Ensembl;
- UniProt;
- PDB;
- EMBL-EBI;
- GEO;
- SRA;
- ENA;
- DDBJ;
- Pfam;
- InterPro;
- ClinVar;
- dbSNP;
- gnomAD;
- KEGG;
- Reactome.

Cada banco tem escopo, versão, política de atualização e formato.

---

## NCBI Entrez

```python
from Bio import Entrez

Entrez.email = "seu_email@example.com"

handle = Entrez.esearch(db="pubmed", term="bioinformatics python", retmax=5)
resultado = Entrez.read(handle)
print(resultado["IdList"])
```

Boas práticas:

- informe email;
- respeite rate limits;
- cacheie resultados;
- salve data de consulta;
- registre query usada.

---

## UniProt API

```python
import requests

url = "https://rest.uniprot.org/uniprotkb/search"
params = {
    "query": "gene:BRCA1 AND organism_id:9606",
    "format": "json",
    "size": 1,
}

response = requests.get(url, params=params, timeout=20)
response.raise_for_status()
dados = response.json()
print(dados["results"][0]["primaryAccession"])
```

---

## Identificadores

Identificadores importam:

- gene symbol;
- Ensembl ID;
- RefSeq;
- UniProt accession;
- rsID;
- transcript ID;
- protein ID.

Gene symbol pode mudar e pode ser ambíguo. IDs estáveis são melhores para pipelines.

---

## Versionamento de Referências

Sempre registre:

- build do genoma;
- versão da anotação;
- data de download;
- URL;
- checksum;
- comando usado;
- ferramenta usada para indexar.

Exemplo:

```text
GRCh38.p14
GENCODE v44
download: 2026-05-17
```

---

## Cache Local

```python
import json
from pathlib import Path

def salvar_cache(caminho, dados):
    Path(caminho).write_text(json.dumps(dados, indent=2), encoding="utf-8")

def carregar_cache(caminho):
    return json.loads(Path(caminho).read_text(encoding="utf-8"))
```

Cache evita chamadas repetidas e melhora reprodutibilidade.

---

## Reprodutibilidade

Documente:

- versões;
- parâmetros;
- amostras;
- referências;
- filtros;
- bancos;
- data de consulta;
- ambiente;
- scripts;
- logs;
- checksums.

---

## Ética e Privacidade

Dados biológicos podem ser sensíveis.

Cuidados:

- consentimento;
- anonimização;
- controle de acesso;
- criptografia;
- descarte seguro;
- governança;
- restrições de compartilhamento.

---

## Exercícios

1. Consulte um gene no NCBI.
2. Consulte uma proteína no UniProt.
3. Monte tabela de identificadores para um gene.
4. Crie registro de versão de referência.
5. Implemente cache local para uma consulta.
