# Gerando e lendo PDFs

Crie e extraia conteúdo de PDFs.

> **Tema:** Documentos · **Nível:** intermediario · **Trilha:** Automação de E-mail e PDF

## Conceitos-chave

Nesta lição você vai entender:

- **reportlab para gerar PDFs**
- **pypdf/pdfplumber para ler**
- **Mesclar e dividir páginas**
- **Extrair tabelas**

## Exemplo prático

```python
from pypdf import PdfReader
r = PdfReader('doc.pdf')
print(r.pages[0].extract_text())
```

Leia o exemplo linha a linha e rode-o no seu ambiente. Em seguida, altere os valores e observe o que muda — entender *por que* o código se comporta assim vale mais do que decorar a sintaxe.

## Boas práticas

- Valide PDFs de fontes não confiáveis
- Cuide da formatação

## Pratique

Para fixar, escreva um pequeno script que combine **reportlab para gerar pdfs** e **pypdf/pdfplumber para ler** em um caso do seu dia a dia. Depois refatore aplicando "Valide PDFs de fontes não confiáveis".

Desafio extra: explique, em uma frase, quando **não** usar esta abordagem — saber os limites de uma ferramenta é tão importante quanto saber usá-la.

## Checklist de domínio

Você domina esta lição quando consegue:

- [ ] Explicar e aplicar: reportlab para gerar PDFs
- [ ] Explicar e aplicar: pypdf/pdfplumber para ler
- [ ] Explicar e aplicar: Mesclar e dividir páginas
- [ ] Explicar e aplicar: Extrair tabelas

## Saiba mais

- [Documentação oficial](https://pypdf.readthedocs.io/)
