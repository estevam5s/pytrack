"use client";

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

const COLORS = ["#8257E5", "#04D361", "#F59E0B", "#22C55E", "#a78bfa", "#38bdf8"];

export function OverallRadial({ value }: { value: number }) {
  const data = [{ name: "Progresso", value, fill: "#8257E5" }];
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
          stroke="#8257E5"
          fill="#8257E5"
          fillOpacity={0.35}
        />
        <Tooltip
          contentStyle={{
            background: "#18181B",
            border: "1px solid #27272A",
            borderRadius: 8,
            color: "#F4F4F5",
          }}
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
    { name: "Não iniciados", value: notStarted, fill: "#3F3F46" },
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
          contentStyle={{
            background: "#18181B",
            border: "1px solid #27272A",
            borderRadius: 8,
            color: "#F4F4F5",
          }}
        />
        <Legend
          iconType="circle"
          formatter={(v) => <span style={{ color: "#A1A1AA" }}>{v}</span>}
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
          contentStyle={{
            background: "#18181B",
            border: "1px solid #27272A",
            borderRadius: 8,
            color: "#F4F4F5",
          }}
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
