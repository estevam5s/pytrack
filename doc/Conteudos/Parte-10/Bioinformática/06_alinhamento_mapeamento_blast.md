# Alinhamento, Mapeamento e Busca de Similaridade

Alinhamento compara sequências para identificar similaridade, homologia, variantes, regiões conservadas e origem provável. Mapeamento posiciona leituras contra uma referência.

---

## Alinhamento Global e Local

Global: alinha sequências inteiras. Útil quando sequências têm tamanho e origem semelhantes.

Local: encontra regiões similares. Útil quando há domínios, fragmentos ou sequências parciais.

Algoritmos clássicos:

- Needleman-Wunsch: global;
- Smith-Waterman: local.

---

## Pontuação

Um alinhamento depende de:

- match;
- mismatch;
- abertura de gap;
- extensão de gap;
- matriz de substituição;
- penalidades.

Para proteínas, matrizes como BLOSUM e PAM são comuns.

---

## Pairwise com Biopython

```python
from Bio import pairwise2

seq1 = "ATGCGT"
seq2 = "ATGCT"

alinhamentos = pairwise2.align.globalxx(seq1, seq2)
for aln in alinhamentos[:1]:
    print(pairwise2.format_alignment(*aln))
```

---

## BLAST

BLAST busca similaridade em bancos de sequências.

Usos:

- identificar sequência desconhecida;
- encontrar homólogos;
- verificar contaminação;
- comparar genes/proteínas;
- anotação preliminar.

Conceitos:

- query;
- subject;
- identity;
- coverage;
- e-value;
- bitscore.

E-value baixo sugere alinhamento menos provável por acaso.

---

## Mapeamento Contra Referência

Ferramentas:

- BWA: DNA;
- Bowtie2: DNA;
- STAR: RNA-seq;
- HISAT2: RNA-seq;
- minimap2: long reads.

Fluxo:

```text
FASTQ -> alinhador -> SAM/BAM -> sort -> index -> métricas
```

Exemplo conceitual:

```bash
bwa mem referencia.fa reads_R1.fastq.gz reads_R2.fastq.gz > aln.sam
samtools sort aln.sam -o aln.bam
samtools index aln.bam
```

---

## Métricas de Mapeamento

- taxa de mapeamento;
- reads pareadas corretamente;
- cobertura;
- duplicação;
- MAPQ;
- insert size;
- regiões sem cobertura;
- reads multimapeadas.

---

## CIGAR

CIGAR descreve como a leitura alinha:

- `M`: match/mismatch;
- `I`: inserção;
- `D`: deleção;
- `S`: soft clip;
- `H`: hard clip;
- `N`: salto, comum em RNA-seq.

---

## Cuidados

- referência correta;
- versão do genoma;
- cromossomos com nomes compatíveis;
- reads single-end ou paired-end;
- qualidade baixa;
- duplicatas;
- multi-mapping;
- parâmetros do alinhador.

---

## Exercícios

1. Faça alinhamento global de duas sequências curtas.
2. Explique diferença entre BLAST e mapeamento.
3. Interprete identity, coverage e e-value.
4. Liste etapas FASTQ para BAM indexado.
5. Explique o que é MAPQ.
