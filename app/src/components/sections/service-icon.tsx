import type { ServiceIcon as ServiceIconName } from "@/content/data/site";
import { Globe, Plane, Repeat, Stamp, Users, type LucideProps } from "lucide-react";

const icons = {
  plane: Plane,
  stamp: Stamp,
  route: Repeat,
  globe: Globe,
  family: Users,
} satisfies Record<ServiceIconName, React.ComponentType<LucideProps>>;

export function ServiceIcon({ name, ...props }: { name: ServiceIconName } & LucideProps) {
  const Icon = icons[name];
  return <Icon aria-hidden="true" {...props} />;
}
