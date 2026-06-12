"use client";

import { useEffect, useState } from "react";
import { geoNaturalEarth1, geoPath } from "d3-geo";
import { feature } from "topojson-client";
import { alpha2ToNumeric } from "@/lib/iso-numeric";

interface Props { data: { code: string; count: number; name: string; flag: string }[] }

const W = 880;
const H = 440;

export function WorldMap({ data }: Props) {
  const [paths, setPaths] = useState<{ id: string; d: string }[]>([]);
  const [hover, setHover] = useState<{ id: string; x: number; y: number } | null>(null);

  // count por id numérico
  const max = Math.max(1, ...data.map((d) => d.count));
  const byNumeric = new Map<string, { count: number; name: string; flag: string }>();
  for (const d of data) {
    const num = alpha2ToNumeric(d.code);
    if (num) byNumeric.set(num, { count: d.count, name: d.name, flag: d.flag });
  }

  useEffect(() => {
    let alive = true;
    fetch("/world-110m.json")
      .then((r) => r.json())
      .then((topo) => {
        if (!alive) return;
        const geo = feature(topo, topo.objects.countries) as unknown as { features: { id: string }[] };
        const projection = geoNaturalEarth1().fitSize([W, H], geo as never);
        const pathGen = geoPath(projection);
        const out = geo.features.map((f) => ({ id: String(f.id), d: pathGen(f as never) ?? "" }));
        setPaths(out);
      })
      .catch(() => {});
    return () => { alive = false; };
  }, []);

  function color(id: string): string {
    const v = byNumeric.get(id);
    if (!v) return "rgb(38,38,46)"; // sem dados
    const t = v.count / max;
    // gradiente roxo: claro→forte conforme volume
    const l = 30 + t * 35;
    return `hsl(265 70% ${l}%)`;
  }

  const hoverData = hover ? byNumeric.get(hover.id) : null;

  return (
    <div className="relative w-full overflow-hidden rounded-xl border border-border bg-[#0c0c12]">
      {paths.length === 0 ? (
        <div className="flex h-[300px] items-center justify-center text-sm text-text-secondary">Carregando mapa…</div>
      ) : (
        <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full">
          {paths.map((p) => (
            <path
              key={p.id}
              d={p.d}
              fill={color(p.id)}
              stroke="#0c0c12"
              strokeWidth={0.4}
              className="transition-opacity hover:opacity-80"
              onMouseEnter={(e) => byNumeric.has(p.id) && setHover({ id: p.id, x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY })}
              onMouseLeave={() => setHover(null)}
            />
          ))}
        </svg>
      )}
      {hoverData && hover && (
        <div className="pointer-events-none absolute z-10 rounded-lg border border-border bg-card px-2.5 py-1.5 text-xs shadow-xl" style={{ left: `${(hover.x / W) * 100}%`, top: `${(hover.y / H) * 100}%`, transform: "translate(-50%,-130%)" }}>
          <span className="font-semibold">{hoverData.flag} {hoverData.name}</span> · {hoverData.count} visitas
        </div>
      )}
      {/* legenda */}
      <div className="absolute bottom-2 right-3 flex items-center gap-1.5 text-[10px] text-text-secondary">
        <span>menos</span>
        <span className="h-2 w-16 rounded-full" style={{ background: "linear-gradient(90deg, hsl(265 70% 30%), hsl(265 70% 65%))" }} />
        <span>mais</span>
      </div>
    </div>
  );
}
