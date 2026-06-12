import Image from "next/image";
import { GradientText } from "./gradient-text";
import { Reveal } from "./reveal";

export function PageHero({
  badge,
  title,
  highlight,
  description,
}: {
  badge: string;
  title: string;
  highlight?: string;
  description: string;
}) {
  return (
    <section className="relative overflow-hidden border-b border-border">
      <div className="absolute inset-0 bg-grid radial-fade" />
      <div className="pointer-events-none absolute left-1/2 top-0 h-64 w-[640px] -translate-x-1/2 rounded-full bg-primary/20 blur-[120px]" />
      <div className="container relative py-16 text-center sm:py-20">
        <Reveal>
          <Image
            src="/new-logo.png"
            alt="PyTrack"
            width={64}
            height={64}
            priority
            className="mx-auto mb-5 h-14 w-14 rounded-xl object-contain"
          />
          <span className="inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary-light">
            {badge}
          </span>
          <h1 className="mx-auto mt-5 max-w-3xl text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
            {title} {highlight && <GradientText>{highlight}</GradientText>}
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base text-text-secondary sm:text-lg">
            {description}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
