# GeoPandas e mapas

Trabalhe com dados geográficos e geometrias.

> **Tema:** Geo · **Nível:** avancado · **Trilha:** Dados Geoespaciais

## Conceitos-chave

Nesta lição você vai entender:

- **GeoDataFrame e geometrias**
- **Sistemas de coordenadas (CRS)**
- **Joins espaciais**
- **Visualização de mapas**

## Exemplo prático

```python
import geopandas as gpd
gdf = gpd.read_file('regioes.geojson')
gdf = gdf.to_crs(4326)
gdf.plot(column='populacao', legend=True)
```

Leia o exemplo linha a linha e rode-o no seu ambiente. Em seguida, altere os valores e observe o que muda — entender *por que* o código se comporta assim vale mais do que decorar a sintaxe.

## Boas práticas

- Cuide do CRS ao combinar dados
- Simplifique geometrias pesadas

## Pratique

Para fixar, escreva um pequeno script que combine **geodataframe e geometrias** e **sistemas de coordenadas (crs)** em um caso do seu dia a dia. Depois refatore aplicando "Cuide do CRS ao combinar dados".

Desafio extra: explique, em uma frase, quando **não** usar esta abordagem — saber os limites de uma ferramenta é tão importante quanto saber usá-la.

## Checklist de domínio

Você domina esta lição quando consegue:

- [ ] Explicar e aplicar: GeoDataFrame e geometrias
- [ ] Explicar e aplicar: Sistemas de coordenadas (CRS)
- [ ] Explicar e aplicar: Joins espaciais
- [ ] Explicar e aplicar: Visualização de mapas

## Saiba mais

- [Documentação oficial](https://geopandas.org/)
