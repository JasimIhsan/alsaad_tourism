import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import type { FaqItem } from "@/content/data/types";

export function FaqList({ items }: { items: FaqItem[] }) {
  return (
    <Accordion className="border-t border-border">
      {items.map((item) => (
        <AccordionItem key={item.id} value={item.id} className="border-b border-border">
          <AccordionTrigger className="min-h-14 items-center gap-4 rounded-none py-5 text-start text-lg font-medium hover:no-underline hover:text-primary **:data-[slot=accordion-trigger-icon]:size-5">
            {item.question}
          </AccordionTrigger>
          <AccordionContent className="max-w-3xl pb-6 text-base text-muted-foreground">
            <p>{item.answer}</p>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
