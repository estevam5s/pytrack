# 🔬 Load testing — PyTrack

Mede o limite do sistema e os gargalos (Vercel, Supabase, imagens, páginas) sob carga.

## k6 (incluído)

Instale o k6 (https://k6.io/docs/get-started/installation/) e rode:

```bash
# teste padrão (30 VUs por 1 min)
k6 run load-test/k6.js

# carga maior
k6 run -e VUS=100 -e DURATION=3m load-test/k6.js

# contra produção ou staging
k6 run -e BASE_URL=https://www.pytrack.com.br load-test/k6.js
```

**Métricas avaliadas:** `http_req_duration p(95) < 1.5s` e taxa de erro `< 2%`.

## O que observar
- **Vercel:** funções serverless escalam bem; cuidado com cold starts em rotas dinâmicas.
- **Supabase:** o gargalo costuma ser o número de conexões/queries. Monitore em *Database → Reports*. Rotas autenticadas (dashboard) fazem mais queries (gating + perfil).
- **Imagens:** servidas otimizadas pelo `next/image` (AVIF/WebP).
- **Páginas públicas** (site/blog/aprender) são as que mais escalam — priorize cache.

## Alternativas
- **Artillery:** `artillery quick --count 50 -n 20 https://www.pytrack.com.br/`
- **Locust:** script Python equivalente, útil para fluxos com login.

> ⚠️ Faça load test em **staging** ou com responsabilidade em produção (fora de pico) para não impactar usuários reais nem estourar limites/custos.
