"use client";

import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { FileUp } from "lucide-react";
import { useId, type ReactNode } from "react";

type FormFieldProps = {
  label: string;
  optionalLabel?: string;
  hint?: string;
  error?: string;
  render: (id: string, describedBy: string | undefined) => ReactNode;
};

/** Label, control, hint and error, wired together with ids for assistive tech. */
export function FormField({ label, optionalLabel, hint, error, render }: FormFieldProps) {
  const id = useId();
  const hintId = `${id}-hint`;
  const errorId = `${id}-error`;
  const describedBy = [hint ? hintId : null, error ? errorId : null].filter(Boolean).join(" ") || undefined;
  return (
    <div className="grid min-w-0 gap-1.5">
      <Label htmlFor={id} className="text-sm font-semibold">
        {label}
        {optionalLabel ? <span className="font-normal text-muted-foreground">({optionalLabel})</span> : null}
      </Label>
      {render(id, describedBy)}
      {hint ? (
        <p id={hintId} className="text-sm text-muted-foreground">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={errorId} className="text-sm text-destructive">
          {error}
        </p>
      ) : null}
    </div>
  );
}

type FileDropProps = {
  id: string;
  name: string;
  accept: readonly string[];
  multiple?: boolean;
  /** Text shown in the drop zone: a prompt, or the chosen file name / count. */
  text: string;
  describedBy?: string;
  invalid?: boolean;
  icon?: ReactNode;
  onFiles: (files: File[]) => void;
};

/** A large, keyboard-reachable file picker (the native input is visually hidden inside the label). */
export function FileDrop({ id, name, accept, multiple, text, describedBy, invalid, icon, onFiles }: FileDropProps) {
  return (
    <label
      className={cn(
        "flex min-h-24 cursor-pointer items-center gap-4 rounded-xl border border-dashed border-input px-5 py-4 transition-colors focus-within:border-ring hover:bg-accent",
        invalid && "border-destructive",
      )}
    >
      {icon ?? <FileUp aria-hidden="true" className="size-6 shrink-0 text-primary" />}
      <span className="min-w-0 truncate text-sm text-muted-foreground">{text}</span>
      <input
        id={id}
        name={name}
        type="file"
        multiple={multiple}
        accept={accept.join(",")}
        aria-describedby={describedBy}
        aria-invalid={invalid || undefined}
        onChange={(event) => onFiles(Array.from(event.target.files ?? []))}
        className="sr-only"
      />
    </label>
  );
}
