import Image from "next/image";
import { Code, Database, Zap, Container, Workflow, Sigma, Table, Cpu, Radio, Flame, type LucideIcon } from "lucide-react";

const INNER: LucideIcon[] = [Code, Database, Zap, Container, Workflow];
const OUTER: LucideIcon[] = [Sigma, Table, Cpu, Radio, Flame, Code, Database];

function Ring({ icons, radius, duration, reverse, size }: { icons: LucideIcon[]; radius: number; duration: number; reverse?: boolean; size: number }) {
  return (
    <div className={reverse ? "orbit-ring-rev absolute inset-0" : "orbit-ring absolute inset-0"} style={{ animationDuration: `${duration}s` }}>
      {icons.map((Icon, i) => {
        const angle = (360 / icons.length) * i;
        return (
          <div key={i} className="absolute left-1/2 top-1/2" style={{ transform: `rotate(${angle}deg) translateY(-${radius}px)` }}>
            <div
              className="flex items-center justify-center rounded-xl border border-border bg-surface/90 text-primary-light shadow-lg backdrop-blur"
              style={{ width: size, height: size, marginLeft: -size / 2, marginTop: -size / 2, animation: `${reverse ? "orbit-spin" : "orbit-spin-rev"} linear infinite`, animationDuration: `${duration}s` }}
            >
              <Icon style={{ width: size * 0.5, height: size * 0.5 }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

// Ícones do ecossistema Python orbitando o logo (estilo "TechOrbit").
export function OrbitingTech() {
  return (
    <div className="relative mx-auto h-[340px] w-[340px]">
      {/* anéis decorativos */}
      <div className="absolute left-1/2 top-1/2 h-[200px] w-[200px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-border/50" />
      <div className="absolute left-1/2 top-1/2 h-[320px] w-[320px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-border/30" />
      {/* centro */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="glow-primary flex h-16 w-16 items-center justify-center rounded-2xl bg-surface">
          <Image src="/new-logo.png" alt="PyTrack" width={44} height={44} className="h-11 w-11 rounded-lg object-contain" />
        </div>
      </div>
      <Ring icons={INNER} radius={100} duration={26} size={40} />
      <Ring icons={OUTER} radius={160} duration={40} reverse size={36} />
    </div>
  );
}
