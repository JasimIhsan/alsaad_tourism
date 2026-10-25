import {
  Button as MotionButton,
  ButtonLink,
} from "@/components/motion/button/base";
import { Button } from "@/components/ui/button";
import { Sparkles, Compass, MapPin, ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-6 text-foreground selection:bg-primary selection:text-primary-foreground sm:p-12">
      <main className="flex w-full max-w-3xl flex-col items-center space-y-10 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-3.5 py-1.5 text-xs font-medium text-muted-foreground shadow-xs backdrop-blur">
          <Sparkles className="h-3.5 w-3.5 text-primary" />
          <span>Shadcn UI & @beui/button-base Ready</span>
        </div>

        {/* Hero Content */}
        <div className="space-y-4">
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
            Al Saadh Tourism
          </h1>
          <p className="mx-auto max-w-xl text-base text-muted-foreground sm:text-lg">
            Experience journeys crafted with elegance. Next.js 16 with Tailwind
            CSS v4, Shadcn UI, and physics-based BeUI motion buttons are
            configured.
          </p>
        </div>

        {/* BeUI Motion Buttons Showcase */}
        <div className="w-full space-y-6 rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
          <div className="flex flex-col justify-between gap-2 border-b border-border pb-4 sm:flex-row sm:items-center">
            <div className="text-left">
              <h2 className="text-lg font-semibold tracking-tight">
                @beui/button-base Components
              </h2>
              <p className="text-xs text-muted-foreground">
                Physics-based spring press, hover lift, and click ripple effects
              </p>
            </div>
            <span className="self-start rounded-md bg-muted px-2.5 py-1 font-mono text-xs text-muted-foreground sm:self-auto">
              motion/react
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <MotionButton variant="primary" size="md" ripple>
              <Compass className="mr-1.5 h-4 w-4" />
              Primary with Ripple
            </MotionButton>

            <MotionButton variant="secondary" size="md" ripple>
              <MapPin className="mr-1.5 h-4 w-4" />
              Secondary
            </MotionButton>

            <MotionButton variant="outline" size="md">
              Outline
            </MotionButton>

            <MotionButton variant="ghost" size="md">
              Ghost
            </MotionButton>

            <ButtonLink
              href="#explore"
              variant="primary"
              size="md"
              className="inline-flex items-center"
            >
              <span>Explore Trips</span>
              <ArrowRight className="ml-1.5 h-4 w-4" />
            </ButtonLink>
          </div>
        </div>

        {/* Standard Shadcn UI Buttons Showcase */}
        <div className="w-full space-y-6 rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
          <div className="flex flex-col justify-between gap-2 border-b border-border pb-4 sm:flex-row sm:items-center">
            <div className="text-left">
              <h2 className="text-lg font-semibold tracking-tight">
                Standard Shadcn UI Buttons
              </h2>
              <p className="text-xs text-muted-foreground">
                Base UI primitive integration with CVA styling
              </p>
            </div>
            <span className="self-start rounded-md bg-muted px-2.5 py-1 font-mono text-xs text-muted-foreground sm:self-auto">
              @base-ui/react
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <Button variant="default">Default</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="destructive">Destructive</Button>
          </div>
        </div>
      </main>
    </div>
  );
}
