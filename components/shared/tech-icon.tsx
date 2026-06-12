import {
  Code, Database, Zap, Radio, Container, Workflow, CheckCheck, Flame,
  BarChart3, LineChart, Sigma, GitBranch, Table, Cpu, Box, type LucideIcon,
} from "lucide-react";

const ICONS: Record<string, LucideIcon> = {
  code: Code, database: Database, zap: Zap, radio: Radio, container: Container,
  workflow: Workflow, "check-check": CheckCheck, flame: Flame, "bar-chart-3": BarChart3,
  "line-chart": LineChart, sigma: Sigma, "git-branch": GitBranch, table: Table, cpu: Cpu,
};

export function TechIcon({ name, className = "h-3.5 w-3.5" }: { name: string; className?: string }) {
  const Icon = ICONS[name] ?? Box;
  return <Icon className={className} />;
}
