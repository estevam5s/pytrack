# Genômica, Anotação e Análise de Variantes

Genômica estuda genomas completos. Em bioinformática, isso inclui montagem, comparação, anotação, mapeamento, chamada de variantes, filtragem e interpretação.

---

## Genoma de Referência

Referência é uma representação do genoma usada como base.

Cuidados:

- versão;
- organismo;
- build;
- contigs;
- cromossomos;
- nomes `chr1` versus `1`;
- regiões alternativas;
- anotação compatível.

Resultados dependem fortemente da referência.

---

## Anotação Genômica

Anotação descreve elementos:

- genes;
- transcritos;
- éxons;
- íntrons;
- CDS;
- UTR;
- promotores;
- RNAs não codificantes;
- elementos repetitivos.

Formatos comuns: GFF3 e GTF.

---

## Chamada de Variantes

Fluxo simplificado:

```text
FASTQ -> QC -> alinhamento -> BAM ordenado -> marcação de duplicatas -> chamada de variantes -> VCF -> filtragem -> anotação
```

Ferramentas:

- samtools/bcftools;
- GATK;
- FreeBayes;
- DeepVariant;
- VarScan.

---

## Lendo VCF

```python
def ler_vcf_simples(caminho):
    with open(caminho, encoding="utf-8") as arquivo:
        for linha in arquivo:
            if linha.startswith("#"):
                continue
            campos = linha.rstrip().split("\t")
            chrom, pos, _id, ref, alt, qual, filtro, info = campos[:8]
            yield {
                "chrom": chrom,
                "pos": int(pos),
                "ref": ref,
                "alt": alt,
                "qual": qual,
                "filter": filtro,
                "info": info,
            }
```

Para VCF grande, use ferramentas especializadas.

---

## Filtros de Variantes

Critérios comuns:

- QUAL;
- depth;
- allele balance;
- mapping quality;
- strand bias;
- genotype quality;
- frequência populacional;
- região de baixa complexidade.

Filtros devem ser adequados ao organismo, tecnologia e pergunta.

---

## Anotação de Variantes

Anotação pode incluir:

- gene afetado;
- efeito na proteína;
- consequência funcional;
- frequência em população;
- conservação;
- predição de impacto;
- associação clínica;
- bancos conhecidos.

Ferramentas:

- VEP;
- SnpEff;
- ANNOVAR;
- bcftools csq.

---

## Cobertura

Cobertura é quantas leituras suportam uma posição.

Baixa cobertura reduz confiança. Cobertura excessiva pode indicar duplicação, repetição ou artefato.

---

## Cuidados Éticos

Dados genômicos podem identificar pessoas e famílias. Proteja:

- consentimento;
- privacidade;
- armazenamento;
- acesso;
- compartilhamento;
- interpretação clínica.

---

## Exercícios

1. Descreva um pipeline de chamada de variantes.
2. Leia um VCF simples e conte variantes PASS.
3. Explique diferença entre SNV e indel.
4. Liste filtros de qualidade de variantes.
5. Explique por que versão da referência importa.
