import { cn } from "@/lib/utils";
import Image from "next/image";
import Markdown, { type Components } from "react-markdown";

type DiaryProseProps = {
  markdown: string;
  /** Arabic-script stories have no italics and need a looser line-height. */
  rtl: boolean;
};

type HastNode = { type: string; tagName?: string; value?: string };

/** True for a paragraph that holds nothing but photos (Markdown wraps images in <p>). */
function isPhotoParagraph(children: HastNode[] = []) {
  return (
    children.some((child) => child.tagName === "img") &&
    children.every((child) => child.tagName === "img" || (child.type === "text" && !child.value?.trim()))
  );
}

/**
 * Renders a guest travelogue. Raw HTML is dropped (`skipHtml`) because stories
 * come from guests. Inline photos (`![alt](/photo.jpg "caption")`) render as
 * captioned figures through next/image; the loader guarantees they are local files.
 */
export function DiaryProse({ markdown, rtl }: DiaryProseProps) {
  const components: Components = {
    h2: ({ children }) => <h2 className="mt-14 mb-4 font-display text-3xl leading-tight">{children}</h2>,
    h3: ({ children }) => <h3 className="mt-10 mb-3 font-display text-2xl leading-tight">{children}</h3>,
    p: ({ node, children }) =>
      isPhotoParagraph(node?.children as HastNode[]) ? <>{children}</> : <p className="mb-6">{children}</p>,
    img: ({ src, alt, title }) =>
      typeof src === "string" ? (
        <figure className="my-10">
          <span className="relative block aspect-[3/2] overflow-hidden rounded-card bg-gradient-sky">
            <Image src={src} alt={alt ?? ""} fill sizes="(min-width: 1024px) 42rem, 100vw" className="object-cover" />
          </span>
          {title ? <figcaption className="mt-3 text-sm text-muted-foreground">{title}</figcaption> : null}
        </figure>
      ) : null,
    ul: ({ children }) => <ul className="mb-6 grid list-disc gap-2 ps-6 marker:text-primary">{children}</ul>,
    ol: ({ children }) => <ol className="mb-6 grid list-decimal gap-2 ps-6 marker:text-primary">{children}</ol>,
    blockquote: ({ children }) => (
      <blockquote className="my-10 border-s-4 border-highlight ps-6 font-display text-2xl leading-snug [&_p]:mb-0">
        {children}
      </blockquote>
    ),
    a: ({ href, children }) => (
      <a href={href} rel="nofollow ugc noopener noreferrer" className="font-semibold text-primary underline underline-offset-4">
        {children}
      </a>
    ),
    strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
    em: ({ children }) => <em className={cn(rtl ? "not-italic text-primary" : "italic")}>{children}</em>,
    hr: () => <hr className="my-12 border-border" />,
  };

  return (
    <div className={cn("text-lg", rtl ? "leading-[1.9]" : "leading-[1.75]")}>
      <Markdown skipHtml components={components}>
        {markdown}
      </Markdown>
    </div>
  );
}
