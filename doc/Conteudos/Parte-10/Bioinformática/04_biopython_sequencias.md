# Biopython e Manipulação de Sequências

Biopython é uma das bibliotecas mais importantes para bioinformática em Python. Ela simplifica manipulação de sequências, leitura de formatos, tradução, busca em bancos e integração com análises biológicas.

---

## Seq

```python
from Bio.Seq import Seq

dna = Seq("ATGGCCATTGTAATGGGCCGCTGAAAGGGTGCCCGATAG")
print(dna)
print(dna.complement())
print(dna.reverse_complement())
print(dna.transcribe())
print(dna.translate())
```

---

## SeqRecord

`SeqRecord` guarda sequência e metadados.

```python
from Bio.Seq import Seq
from Bio.SeqRecord import SeqRecord

record = SeqRecord(
    Seq("ATGCGT"),
    id="gene1",
    name="Gene exemplo",
    description="Sequência didática",
)

print(record.id, record.description, record.seq)
```

---

## Leitura e Escrita FASTA

```python
from Bio import SeqIO

records = list(SeqIO.parse("entrada.fasta", "fasta"))
SeqIO.write(records, "saida.fasta", "fasta")
```

Filtrar por tamanho:

```python
filtrados = [r for r in records if len(r.seq) >= 1000]
SeqIO.write(filtrados, "filtrados.fasta", "fasta")
```

---

## GC Content

```python
def gc_content(seq):
    seq = str(seq).upper()
    gc = seq.count("G") + seq.count("C")
    return gc / len(seq) if seq else 0

print(gc_content("ATGCGC"))
```

GC content é usado em análise de genomas, primers, regiões regulatórias e controle de qualidade.

---

## ORFs

ORF, ou open reading frame, é uma região potencialmente codificante.

```python
from Bio.Seq import Seq

def traduzir_frames(seq):
    seq = Seq(seq)
    for frame in range(3):
        trecho = seq[frame:]
        tamanho = len(trecho) - len(trecho) % 3
        print(frame, trecho[:tamanho].translate())

traduzir_frames("ATGGCCATTGTAATGGGCCGCTGA")
```

---

## Motivos Simples

```python
import re

seq = "ATGAAATTTATGCCCTGA"
for match in re.finditer("ATG", seq):
    print(match.start())
```

Para motivos biológicos mais complexos, use bibliotecas e bancos apropriados.

---

## Entrez NCBI

```python
from Bio import Entrez

Entrez.email = "seu_email@example.com"

handle = Entrez.esearch(db="nucleotide", term="BRCA1[Gene] AND human[Organism]", retmax=5)
resultado = Entrez.read(handle)
print(resultado["IdList"])
```

Respeite limites de uso e informe email.

---

## Boas Práticas

- Preserve IDs originais.
- Não perca descrições importantes.
- Documente filtros.
- Valide caracteres inesperados.
- Diferencie DNA, RNA e proteína.
- Cuidado com orientação da sequência.
- Registre versão de bancos consultados.

---

## Exercícios

1. Leia um FASTA e calcule GC content por sequência.
2. Gere reverse complement.
3. Transcreva e traduza uma sequência.
4. Filtre sequências por tamanho.
5. Busque IDs no NCBI com Entrez.
