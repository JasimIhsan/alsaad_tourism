import { Building2, MessageCircle, ShieldCheck, UserRound } from "lucide-react";

const icons = [ShieldCheck, Building2, MessageCircle, UserRound];

type TrustStripProps = {
  label: string;
  items: { title: string; description: string }[];
};

// TODO(epic-5): add the live Google rating badge here.
export function TrustStrip({ label, items }: TrustStripProps) {
  return (
    <section aria-label={label} className="pb-8">
      <div className="mx-auto w-full max-w-6xl px-6">
        <ul className="grid gap-px overflow-hidden rounded-card border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item, index) => {
            const Icon = icons[index % icons.length];
            return (
              <li key={item.title} className="flex gap-4 bg-background p-6">
                <Icon aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-primary" />
                <div>
                  <p className="font-semibold">{item.title}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{item.description}</p>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
