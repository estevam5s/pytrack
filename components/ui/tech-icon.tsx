import { techIconUrl } from "@/lib/tech-icons";
import { DynamicIcon } from "./dynamic-icon";
import { cn } from "@/lib/utils";

export function TechIcon({
  name,
  icon,
  className,
}: {
  name?: string | null;
  icon?: string | null;
  className?: string;
}) {
  const url = techIconUrl(name);
  if (url) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={url}
        alt={name ?? "tecnologia"}
        loading="lazy"
        className={cn("object-contain", className)}
      />
    );
  }
  return <DynamicIcon name={icon} className={className} />;
}
