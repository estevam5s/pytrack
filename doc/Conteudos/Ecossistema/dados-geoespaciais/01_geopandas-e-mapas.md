# GeoPandas e mapas

Trabalhe com dados geográficos e geometrias.

## Pontos-chave

- GeoDataFrame e geometrias
- Sistemas de coordenadas (CRS)
- Joins espaciais
- Visualização de mapas

## Exemplo

```python
import geopandas as gpd
gdf = gpd.read_file('regioes.geojson')
gdf = gdf.to_crs(4326)
gdf.plot(column='populacao', legend=True)
```

## Boas práticas

- Cuide do CRS ao combinar dados
- Simplifique geometrias pesadas

## Saiba mais

- [Documentação oficial](https://geopandas.org/)
