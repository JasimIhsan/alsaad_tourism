"use client";

import { Button } from "@/components/motion/button/base";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select";
import { Textarea } from "@/components/ui/textarea";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import { useLocale } from "@/lib/i18n/locale-provider";
import { submitInquiry, type InquiryField, type InquiryState } from "@/lib/inquiry";
import { cn } from "@/lib/utils";
import { CircleCheck } from "lucide-react";
import { usePathname } from "next/navigation";
import { useActionState, useId, useState, type ReactNode } from "react";

export type Option = { value: string; label: string };

type InquiryFormProps = {
  dict: Dictionary["form"];
  services: Option[];
  branches?: Option[];
  defaultService?: string;
  /** Hidden subject, e.g. a package title. Hides the service picker. */
  subject?: string;
  /** "compact" is the single-row pill used in the home hero. */
  variant?: "full" | "compact";
  submitLabel?: string;
  className?: string;
};

const initialState: InquiryState = { status: "idle" };

export function InquiryForm(props: InquiryFormProps) {
  // Remounting via key resets useActionState for "send another".
  const [formKey, setFormKey] = useState(0);
  return (
    <InquiryFormInner
      key={formKey}
      {...props}
      onReset={() => setFormKey((k) => k + 1)}
    />
  );
}

function InquiryFormInner({
  dict,
  services,
  branches,
  defaultService,
  subject,
  variant = "full",
  submitLabel,
  className,
  onReset,
}: InquiryFormProps & { onReset: () => void }) {
  const [state, formAction, pending] = useActionState(submitInquiry, initialState);
  const { locale } = useLocale();
  const pathname = usePathname();
  const compact = variant === "compact";

  if (state.status === "success") {
    return (
      <div
        role="status"
        className={cn(
          "flex flex-col items-start gap-3 rounded-card border border-border bg-card p-6",
          className,
        )}
      >
        <CircleCheck aria-hidden="true" className="size-7 text-success" />
        <p className="font-display text-xl">{dict.successTitle}</p>
        <p className="text-muted-foreground">{dict.successDescription}</p>
        <button
          type="button"
          onClick={onReset}
          className="min-h-11 font-semibold text-primary underline-offset-4 hover:underline"
        >
          {dict.sendAnother}
        </button>
      </div>
    );
  }

  const errors = state.status === "error" ? state.fieldErrors : {};
  const errorText = (name: InquiryField) =>
    errors[name] ? dict.errors[errors[name]] : undefined;

  const serviceField = subject ? null : (
    <Field
      key="service"
      label={dict.fields.service.label}
      compact={compact}
      render={(id) => (
        <NativeSelect
          id={id}
          name="service"
          defaultValue={defaultService ?? ""}
          className={cn("w-full", compact ? fieldReset : selectBox)}
        >
          <NativeSelectOption value="">{dict.generalInquiry}</NativeSelectOption>
          {services.map((s) => (
            <NativeSelectOption key={s.value} value={s.value}>
              {s.label}
            </NativeSelectOption>
          ))}
        </NativeSelect>
      )}
    />
  );

  const nameField = (
    <Field
      key="name"
      label={dict.fields.name.label}
      error={errorText("name")}
      compact={compact}
      render={(id, describedBy) => (
        <Input
          id={id}
          name="name"
          autoComplete="name"
          placeholder={dict.fields.name.placeholder}
          aria-invalid={Boolean(errors.name) || undefined}
          aria-describedby={describedBy}
          className={cn(compact ? fieldReset : fieldBox)}
        />
      )}
    />
  );

  const phoneField = (
    <Field
      key="phone"
      label={dict.fields.phone.label}
      error={errorText("phone")}
      compact={compact}
      render={(id, describedBy) => (
        <Input
          id={id}
          name="phone"
          type="tel"
          dir="ltr"
          autoComplete="tel"
          inputMode="tel"
          placeholder={dict.fields.phone.placeholder}
          aria-invalid={Boolean(errors.phone) || undefined}
          aria-describedby={describedBy}
          className={cn(compact ? fieldReset : fieldBox, "rtl:text-end")}
        />
      )}
    />
  );

  const travelDateField = (
    <Field
      key="travelDate"
      label={dict.fields.travelDate.label}
      compact={compact}
      className={compact ? "md:border-e-0" : undefined}
      render={(id) => (
        <Input
          id={id}
          name="travelDate"
          placeholder={dict.fields.travelDate.placeholder}
          className={cn(compact ? fieldReset : fieldBox)}
        />
      )}
    />
  );

  const hidden = (
    <>
      <input type="hidden" name="locale" value={locale} />
      <input type="hidden" name="source" value={pathname} />
      {subject ? <input type="hidden" name="subject" value={subject} /> : null}
      {/* Honeypot, hidden from people and assistive tech. */}
      <div aria-hidden="true" className="absolute -start-[9999px] size-px overflow-hidden">
        <input type="text" name="company" tabIndex={-1} autoComplete="off" />
      </div>
    </>
  );

  const submit = (
    <Button
      type="submit"
      variant="primary"
      size="md"
      disabled={pending}
      aria-disabled={pending}
      className={cn(compact ? "w-full md:w-auto" : "w-full")}
    >
      {pending ? dict.submitting : (submitLabel ?? dict.submit)}
    </Button>
  );

  if (compact) {
    return (
      <form
        action={formAction}
        noValidate
        className={cn(
          "relative grid grid-cols-1 gap-4 rounded-card border border-border bg-card p-5 shadow-search sm:grid-cols-2 md:grid-cols-[1.2fr_1fr_1fr_1fr_auto] md:items-center md:gap-0 md:rounded-full md:py-2 md:ps-7 md:pe-2",
          className,
        )}
      >
        {[serviceField, nameField, phoneField, travelDateField]}
        <div className="sm:col-span-2 md:col-span-1 md:ps-3">{submit}</div>
        {hidden}
        <FormStatus failed={state.status === "failed"} message={dict.errorGeneric} />
      </form>
    );
  }

  return (
    <form action={formAction} noValidate className={cn("relative grid gap-4", className)}>
      {nameField}
      {phoneField}
      <Field
        label={dict.fields.email.label}
        optionalLabel={dict.optional}
        error={errorText("email")}
        render={(id, describedBy) => (
          <Input
            id={id}
            name="email"
            type="email"
            dir="ltr"
            autoComplete="email"
            placeholder={dict.fields.email.placeholder}
            aria-invalid={Boolean(errors.email) || undefined}
            aria-describedby={describedBy}
            className={cn(fieldBox, "rtl:text-end")}
          />
        )}
      />
      {serviceField}
      <div className="grid gap-4 sm:grid-cols-2">
        {travelDateField}
        <Field
          label={dict.fields.travellers.label}
          optionalLabel={dict.optional}
          render={(id) => (
            <Input
              id={id}
              name="travellers"
              placeholder={dict.fields.travellers.placeholder}
              className={fieldBox}
            />
          )}
        />
      </div>
      {branches ? (
        <Field
          label={dict.fields.branch.label}
          render={(id) => (
            <NativeSelect id={id} name="branch" defaultValue="" className={cn("w-full", selectBox)}>
              <NativeSelectOption value="">{dict.fields.branch.placeholder}</NativeSelectOption>
              {branches.map((b) => (
                <NativeSelectOption key={b.value} value={b.value}>
                  {b.label}
                </NativeSelectOption>
              ))}
            </NativeSelect>
          )}
        />
      ) : null}
      <Field
        label={dict.fields.message.label}
        optionalLabel={dict.optional}
        render={(id) => (
          <Textarea
            id={id}
            name="message"
            rows={4}
            placeholder={dict.fields.message.placeholder}
            className="min-h-28 rounded-xl px-3.5 py-3 text-base"
          />
        )}
      />
      {hidden}
      <FormStatus failed={state.status === "failed"} message={dict.errorGeneric} />
      {submit}
    </form>
  );
}

const fieldBox = "h-12 rounded-xl px-3.5 text-base";
const selectBox = "[&_select]:h-12 [&_select]:rounded-xl [&_select]:ps-3.5 [&_select]:text-base";
const fieldReset =
  "h-8 rounded-none border-0 bg-transparent px-0 text-base shadow-none focus-visible:ring-0 [&_select]:h-8 [&_select]:border-0 [&_select]:ps-0 [&_select]:focus-visible:ring-0";

function Field({
  label,
  optionalLabel,
  error,
  compact,
  className,
  render,
}: {
  label: string;
  optionalLabel?: string;
  error?: string;
  compact?: boolean;
  className?: string;
  render: (id: string, describedBy: string | undefined) => ReactNode;
}) {
  const id = useId();
  const errorId = `${id}-error`;
  return (
    <div
      className={cn(
        "grid min-w-0 gap-1.5",
        compact && "md:gap-0.5 md:border-e md:border-border md:px-4 md:first:ps-0",
        className,
      )}
    >
      <Label
        htmlFor={id}
        className={cn(compact ? "eyebrow text-muted-foreground" : "text-sm font-semibold")}
      >
        {label}
        {optionalLabel ? (
          <span className="font-normal text-muted-foreground">({optionalLabel})</span>
        ) : null}
      </Label>
      {render(id, error ? errorId : undefined)}
      {error ? (
        <p id={errorId} className="text-sm text-destructive">
          {error}
        </p>
      ) : null}
    </div>
  );
}

function FormStatus({ failed, message }: { failed: boolean; message: string }) {
  return (
    <p role="alert" className={cn("text-sm text-destructive", !failed && "sr-only")}>
      {failed ? message : ""}
    </p>
  );
}
