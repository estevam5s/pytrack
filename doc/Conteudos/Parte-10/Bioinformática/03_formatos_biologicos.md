# Formatos Biológicos: FASTA, FASTQ, SAM/BAM, VCF, GFF/GTF e BED

Bioinformática depende de formatos padronizados. Entender esses formatos é essencial para depurar pipelines, validar resultados e evitar interpretações erradas.

---

## FASTA

Formato para sequências.

```text
>seq1 descricao
ATGCGTACGTAG
>seq2
GGGTTTAAA
```

Leitura com Biopython:

```python
from Bio import SeqIO

for record in SeqIO.parse("sequencias.fasta", "fasta"):
    print(record.id, len(record.seq))
```

Usos:

- genomas;
- transcritos;
- proteínas;
- contigs;
- referências.

---

## FASTQ

Formato de leituras com qualidade.

```text
@read1
ATGCGT
+
IIIIII
```

Cada base tem score de qualidade Phred.

```python
from Bio import SeqIO

for record in SeqIO.parse("leituras.fastq", "fastq"):
    print(record.id, record.seq, record.letter_annotations["phred_quality"])
```

---

## Qualidade Phred

```text
Q = -10 log10(P_erro)
```

Q30 significa probabilidade de erro aproximada de 1 em 1000.

```python
def prob_erro(q):
    return 10 ** (-q / 10)

print(prob_erro(30))
```

---

## SAM e BAM

SAM é texto. BAM é binário compactado. Ambos representam alinhamentos contra referência.

Campos importantes:

- QNAME;
- FLAG;
- RNAME;
- POS;
- MAPQ;
- CIGAR;
- SEQ;
- QUAL.

Com `pysam`:

```python
import pysam

with pysam.AlignmentFile("alinhamentos.bam", "rb") as bam:
    for read in bam.fetch():
        print(read.query_name, read.reference_name, read.reference_start)
```

---

## VCF

VCF descreve variantes.

```text
#CHROM POS ID REF ALT QUAL FILTER INFO
chr1   100 .  A   G   60   PASS   DP=30
```

Campos:

- cromossomo;
- posição;
- referência;
- alternativo;
- qualidade;
- filtro;
- informações;
- genótipos.

---

## GFF/GTF

Descrevem anotações genômicas.

Exemplos:

- genes;
- transcritos;
- éxons;
- CDS;
- UTRs.

GTF é muito usado em RNA-seq.

---

## BED

Formato simples de intervalos genômicos.

```text
chr1  100  200  regiao1
```

Importante: BED usa coordenadas 0-based e intervalo semiaberto.

Isso causa muitos erros quando misturado com formatos 1-based.

---

## Compressão e Indexação

Arquivos grandes geralmente usam:

- `.gz`;
- `.bgz`;
- `.bai`;
- `.tbi`;
- `.fai`.

Indexação permite acesso rápido por região.

---

## Checklist de Formatos

- O formato está correto?
- As coordenadas são 0-based ou 1-based?
- O arquivo está compactado?
- Existe índice?
- A referência usada é a mesma?
- Os cromossomos usam `chr1` ou `1`?
- Qual versão da anotação?

---

## Exercícios

1. Leia um FASTA e conte sequências.
2. Leia um FASTQ e calcule qualidade média.
3. Explique diferença entre SAM e BAM.
4. Identifique campos principais de um VCF.
5. Explique o risco de coordenadas BED.
