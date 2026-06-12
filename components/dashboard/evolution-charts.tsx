"use client";

import { Target } from "lucide-react";
import {
  Bar,
  BarChart,
  Cell,
  Legend,
  Pie,
  PieChart,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  RadialBar,
  RadialBarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const PURPLE = "#8257E5";
const TOOLTIP_BACKGROUND = "#18181B";
const TOOLTIP_BORDER = "#27272A";
const TOOLTIP_TEXT = "#F4F4F5";
const MUTED_TEXT = "#A1A1AA";

const COLORS = [PURPLE, "#04D361", "#F59E0B", "#22C55E", "#a78bfa", "#38bdf8"];
const TOOLTIP_STYLE = {
  background: TOOLTIP_BACKGROUND,
  border: `1px solid ${TOOLTIP_BORDER}`,
  borderRadius: 8,
  color: TOOLTIP_TEXT,
};
const TOOLTIP_LABEL_STYLE = { color: TOOLTIP_TEXT };
const TOOLTIP_ITEM_STYLE = { color: PURPLE };

export function OverallRadial({ value }: { value: number }) {
  const data = [{ name: "Progresso", value, fill: PURPLE }];
  return (
    <ResponsiveContainer width="100%" height={200}>
      <RadialBarChart
        innerRadius="70%"
        outerRadius="100%"
        data={data}
        startAngle={90}
        endAngle={-270}
      >
        <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
        <RadialBar dataKey="value" cornerRadius={20} background={{ fill: "#27272A" }} />
        <text
          x="50%"
          y="50%"
          textAnchor="middle"
          dominantBaseline="middle"
          className="fill-foreground text-3xl font-bold"
        >
          {value}%
        </text>
      </RadialBarChart>
    </ResponsiveContainer>
  );
}

export function SkillRadar({
  data,
}: {
  data: { area: string; percentage: number }[];
}) {
  // estado vazio: sem nenhuma proficiência o radar vira um ponto no centro e
  // parece quebrado — mostramos uma orientação no lugar.
  if (!data.length || data.every((d) => d.percentage === 0)) {
    return (
      <div className="flex h-[300px] flex-col items-center justify-center gap-2 text-center">
        <Target className="h-9 w-9 text-primary/60" />
        <p className="text-sm font-medium text-foreground">
          Seu mapa de proficiência aparece aqui
        </p>
        <p className="max-w-xs text-xs text-text-secondary">
          Comece a estudar e concluir conteúdos para ver seu domínio crescer por
          área do ecossistema Python.
        </p>
      </div>
    );
  }
  return (
    <ResponsiveContainer width="100%" height={300}>
      <RadarChart data={data} outerRadius="72%">
        <PolarGrid stroke="#27272A" />
        <PolarAngleAxis
          dataKey="area"
          tick={{ fill: "#A1A1AA", fontSize: 11 }}
        />
        <PolarRadiusAxis
          domain={[0, 100]}
          tick={{ fill: "#52525b", fontSize: 9 }}
          stroke="#27272A"
        />
        <Radar
          name="Proficiência"
          dataKey="percentage"
          stroke={PURPLE}
          fill={PURPLE}
          fillOpacity={0.35}
        />
        <Tooltip
          contentStyle={TOOLTIP_STYLE}
          labelStyle={TOOLTIP_LABEL_STYLE}
          itemStyle={TOOLTIP_ITEM_STYLE}
          formatter={(v: number) => [`${v}%`, "Domínio"]}
        />
      </RadarChart>
    </ResponsiveContainer>
  );
}

export function StatusDonut({
  completed,
  inProgress,
  notStarted,
}: {
  completed: number;
  inProgress: number;
  notStarted: number;
}) {
  const data = [
    { name: "Concluídos", value: completed, fill: "#04D361" },
    { name: "Em andamento", value: inProgress, fill: "#F59E0B" },
    { name: "Não iniciado", value: notStarted, fill: PURPLE },
  ].filter((d) => d.value > 0);

  return (
    <ResponsiveContainer width="100%" height={220}>
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          innerRadius="58%"
          outerRadius="85%"
          paddingAngle={3}
          stroke="none"
        >
          {data.map((d, i) => (
            <Cell key={i} fill={d.fill} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={TOOLTIP_STYLE}
          labelStyle={TOOLTIP_LABEL_STYLE}
          itemStyle={TOOLTIP_ITEM_STYLE}
        />
        <Legend
          iconType="circle"
          formatter={(v) => (
            <span style={{ color: v === "Não iniciado" ? PURPLE : MUTED_TEXT }}>
              {v}
            </span>
          )}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}

export function AreaProgressChart({
  data,
}: {
  data: { area: string; percentage: number }[];
}) {
  return (
    <ResponsiveContainer width="100%" height={Math.max(220, data.length * 44)}>
      <BarChart
        data={data}
        layout="vertical"
        margin={{ left: 10, right: 24, top: 4, bottom: 4 }}
      >
        <XAxis type="number" domain={[0, 100]} hide />
        <YAxis
          type="category"
          dataKey="area"
          width={130}
          tickLine={false}
          axisLine={false}
          tick={{ fill: "#A1A1AA", fontSize: 12 }}
        />
        <Tooltip
          cursor={{ fill: "rgba(130,87,229,0.08)" }}
          contentStyle={TOOLTIP_STYLE}
          labelStyle={TOOLTIP_LABEL_STYLE}
          itemStyle={TOOLTIP_ITEM_STYLE}
          formatter={(v: number) => [`${v}%`, "Conclusão"]}
        />
        <Bar dataKey="percentage" radius={[0, 6, 6, 0]} barSize={18}>
          {data.map((_, i) => (
            <Cell key={i} fill={COLORS[i % COLORS.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
