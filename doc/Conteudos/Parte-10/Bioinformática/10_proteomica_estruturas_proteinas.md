# Proteômica, Estruturas, Motivos e Análise de Proteínas

Proteômica estuda proteínas em larga escala. Análise de proteínas inclui sequência, domínios, motivos, propriedades físico-químicas, estrutura, função e interação.

---

## Sequências Proteicas

Proteínas são representadas por códigos de aminoácidos.

```python
from Bio.SeqUtils.ProtParam import ProteinAnalysis

seq = "MKWVTFISLLFLFSSAYSRGVFRRDTHKSEIAHRFKDLGE"
analise = ProteinAnalysis(seq)

print(analise.molecular_weight())
print(analise.gravy())
print(analise.isoelectric_point())
```

---

## Propriedades

- peso molecular;
- ponto isoelétrico;
- hidrofobicidade;
- composição de aminoácidos;
- carga;
- estabilidade;
- regiões transmembrana;
- sinal peptídico.

---

## Motivos e Domínios

Motivo é padrão curto associado a função ou estrutura.

Domínio é unidade estrutural/funcional.

Bancos:

- Pfam;
- InterPro;
- PROSITE;
- SMART;
- CDD.

---

## BLASTp

BLASTp compara proteínas contra banco proteico.

Use para:

- inferir função;
- encontrar homólogos;
- checar conservação;
- comparar proteínas.

Interprete:

- e-value;
- identidade;
- cobertura;
- bitscore;
- anotação do hit.

---

## Estruturas

Formatos comuns:

- PDB;
- mmCIF.

Fontes:

- PDB;
- AlphaFold DB;
- ModelArchive.

Biopython possui módulos para estrutura:

```python
from Bio.PDB import PDBParser

parser = PDBParser(QUIET=True)
structure = parser.get_structure("proteina", "estrutura.pdb")

for model in structure:
    for chain in model:
        print(chain.id)
```

---

## Proteômica por Espectrometria de Massas

Fluxo simplificado:

```text
amostra -> digestão -> LC-MS/MS -> identificação -> quantificação -> estatística -> interpretação
```

Conceitos:

- peptídeo;
- espectro;
- PSM;
- FDR;
- label-free;
- TMT/iTRAQ;
- intensidades;
- proteínas inferidas.

---

## Cuidados

- anotação automática pode estar errada;
- similaridade não garante função idêntica;
- proteínas multidomínio exigem análise por região;
- estrutura prevista não é validação experimental;
- proteômica requer controle de FDR;
- isoformas e modificações pós-traducionais importam.

---

## Exercícios

1. Calcule propriedades de uma proteína com Biopython.
2. Explique diferença entre motivo e domínio.
3. Interprete resultado BLASTp.
4. Leia uma estrutura PDB.
5. Liste etapas de proteômica por massas.
