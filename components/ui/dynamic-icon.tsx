import {
  BarChart3,
  CheckCheck,
  Cloud,
  Code,
  Container,
  Cpu,
  Database,
  Feather,
  Flame,
  GitBranch,
  Github,
  Layers,
  LayoutGrid,
  LineChart,
  Notebook,
  Radio,
  Sigma,
  Table,
  Workflow,
  Zap,
  type LucideIcon,
} from "lucide-react";

const MAP: Record<string, LucideIcon> = {
  code: Code,
  zap: Zap,
  layout: LayoutGrid,
  feather: Feather,
  table: Table,
  sigma: Sigma,
  "bar-chart-3": BarChart3,
  "line-chart": LineChart,
  notebook: Notebook,
  database: Database,
  cloud: Cloud,
  container: Container,
  "git-branch": GitBranch,
  github: Github,
  radio: Radio,
  cpu: Cpu,
  workflow: Workflow,
  flame: Flame,
  "check-check": CheckCheck,
};

export function DynamicIcon({
  name,
  className,
}: {
  name?: string | null;
  className?: string;
}) {
  const Icon = (name && MAP[name]) || Layers;
  return <Icon className={className} />;
}
