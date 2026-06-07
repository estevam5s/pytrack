import {
  LayoutDashboard,
  TrendingUp,
  Layers,
  GraduationCap,
  FileText,
  Library,
  Briefcase,
  Code2,
  FolderGit2,
  Settings,
  User,
  HelpCircle,
  Bot,
  Youtube,
  Award,
  SquareTerminal,
  Users,
  Route,
  Smartphone,
  LifeBuoy,
  ShieldCheck,
  Inbox,
  LineChart,
  type LucideIcon,
} from "lucide-react";

export type NavGroup = "Estudar" | "Recursos" | "Carreira" | "Conta" | "Admin";

export interface NavItem {
  title: string;
  href: string;
  icon: LucideIcon;
  group: NavGroup;
  adminOnly?: boolean;
}

export const NAV_ITEMS: NavItem[] = [
  { title: "Início", href: "/inicio", icon: LayoutDashboard, group: "Estudar" },
  { title: "Trilhas", href: "/minhas-trilhas", icon: Route, group: "Estudar" },
  { title: "Comunidade", href: "/comunidade", icon: Users, group: "Estudar" },
  { title: "Evolução", href: "/evolucao", icon: TrendingUp, group: "Estudar" },
  { title: "Stack", href: "/stack", icon: Layers, group: "Estudar" },
  {
    title: "Exercícios",
    href: "/exercicios",
    icon: Code2,
    group: "Estudar",
  },
  {
    title: "IDE Python",
    href: "/ide",
    icon: SquareTerminal,
    group: "Estudar",
  },
  {
    title: "Projetos",
    href: "/meus-projetos",
    icon: FolderGit2,
    group: "Estudar",
  },
  {
    title: "Aulas Udemy",
    href: "/aulas-udemy",
    icon: GraduationCap,
    group: "Recursos",
  },
  {
    title: "Aulas YouTube",
    href: "/aulas-youtube",
    icon: Youtube,
    group: "Recursos",
  },
  { title: "Material", href: "/material", icon: FileText, group: "Recursos" },
  { title: "Livros", href: "/livros", icon: Library, group: "Recursos" },
  { title: "Aplicativo", href: "/aplicativo", icon: Smartphone, group: "Recursos" },
  {
    title: "Carreira",
    href: "/minha-carreira",
    icon: Briefcase,
    group: "Carreira",
  },
  {
    title: "Especializações",
    href: "/especializacoes",
    icon: Award,
    group: "Carreira",
  },
  {
    title: "Consultor IA",
    href: "/consultor-ia",
    icon: Bot,
    group: "Carreira",
  },
  { title: "Vagas", href: "/vagas", icon: Briefcase, group: "Carreira" },
  {
    title: "Perguntas de Carreira",
    href: "/perguntas-carreira-python",
    icon: HelpCircle,
    group: "Carreira",
  },
  { title: "Perfil", href: "/perfil", icon: User, group: "Conta" },
  { title: "Suporte", href: "/suporte", icon: LifeBuoy, group: "Conta" },
  {
    title: "Configurações",
    href: "/configuracoes",
    icon: Settings,
    group: "Conta",
  },
  // ── Admin (somente administradores) ──
  { title: "Admin", href: "/admin", icon: ShieldCheck, group: "Admin", adminOnly: true },
  { title: "Clientes & receita", href: "/admin/clientes", icon: LineChart, group: "Admin", adminOnly: true },
  { title: "Mensagens", href: "/admin/mensagens", icon: Inbox, group: "Admin", adminOnly: true },
];

export const NAV_GROUPS = ["Estudar", "Recursos", "Carreira", "Conta", "Admin"] as const;
