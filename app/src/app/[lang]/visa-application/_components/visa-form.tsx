"use client";

import { Button } from "@/components/motion/button/base";
import { FormFailure } from "@/components/sections/form-failure";
import { FileDrop, FormField } from "@/components/sections/form-field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { UtmFields } from "@/lib/hooks/use-utm";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import { format } from "@/lib/i18n/format";
import { useLocale } from "@/lib/i18n/locale-provider";
import { uploadFiles } from "@/lib/upload-client";
import { checkFiles, uploadRules, type UploadKind } from "@/lib/upload-rules";
import { cn } from "@/lib/utils";
import { submitVisaApplication, type VisaState } from "@/lib/visa-application";
import { validateVisa, visaTypes, type VisaErrorCode, type VisaField } from "@/lib/visa-rules";
import { CircleCheck } from "lucide-react";
import { usePathname } from "next/navigation";
import { useActionState, useState, useTransition, type FormEvent } from "react";

type VisaFormProps = {
  dict: Dictionary["visaPage"]["form"];
  formDict: Dictionary["form"];
};

const initialState: VisaState = { status: "idle" };
const documents: { field: "passport" | "photo"; kind: UploadKind; idsField: string }[] = [
  { field: "passport", kind: "passport", idsField: "passportIds" },
  { field: "photo", kind: "visaPhoto", idsField: "photoIds" },
];

/** Validates in the browser, uploads both documents straight to Drive, then submits their IDs. */
async function submitWithDocuments(prev: VisaState, formData: FormData, onUploading: () => void): Promise<VisaState> {
  const fieldErrors = validateVisa(formData);
  const files: Record<string, File[]> = {};
  for (const doc of documents) {
    files[doc.field] = formData.getAll(doc.field).filter((f): f is File => f instanceof File && f.size > 0);
    formData.delete(doc.field);
    const error = files[doc.field].length === 0 ? "required" : checkFiles(doc.kind, files[doc.field]);
    if (error) fieldErrors[doc.field] = error;
  }
  if (Object.keys(fieldErrors).length > 0) return { status: "error", fieldErrors };

  onUploading();
  for (const doc of documents) {
    const upload = await uploadFiles(doc.kind, files[doc.field]);
    if (upload.status !== "ok") return { status: upload.status };
    formData.set(doc.idsField, JSON.stringify(upload.ids));
  }

  try {
    return await submitVisaApplication(prev, formData);
  } catch {
    return { status: "failed" };
  }
}

export function VisaForm(props: VisaFormProps) {
  // Remounting via key resets useActionState for "submit another".
  const [formKey, setFormKey] = useState(0);
  return <VisaFormInner key={formKey} {...props} onReset={() => setFormKey((k) => k + 1)} />;
}

function VisaFormInner({ dict, formDict, onReset }: VisaFormProps & { onReset: () => void }) {
  const [uploading, setUploading] = useState(false);
  const [state, formAction, pending] = useActionState(async (prev: VisaState, formData: FormData) => {
    const next = await submitWithDocuments(prev, formData, () => setUploading(true));
    setUploading(false);
    return next;
  }, initialState);
  const [, startTransition] = useTransition();
  const { locale } = useLocale();
  const pathname = usePathname();
  const [chosen, setChosen] = useState<Record<string, string>>({});
  // Re-checked on every pick, so a corrected file clears the previous error.
  const [fileErrors, setFileErrors] = useState<Record<string, VisaErrorCode | null>>({});

  // Submitting through a transition (not <form action>) keeps the fields filled when validation fails.
  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    startTransition(() => formAction(formData));
  };

  if (state.status === "success") {
    return (
      <div role="status" className="flex flex-col items-start gap-3 rounded-card border border-border bg-card p-8">
        <CircleCheck aria-hidden="true" className="size-8 text-success" />
        <p className="font-display text-2xl">{dict.successTitle}</p>
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
  const errorText = (name: VisaField) => {
    const code = name in fileErrors ? fileErrors[name] : errors[name];
    if (!code) return undefined;
    if (code === "fileCount" || code === "fileType" || code === "fileSize") {
      const kind = documents.find((doc) => doc.field === name)?.kind ?? "passport";
      return format(dict.errors[code], { size: uploadRules[kind].maxMb });
    }
    return formDict.errors[code];
  };
  const f = formDict.fields;

  return (
    <form onSubmit={onSubmit} noValidate className="relative grid gap-6">
      <div className="grid gap-6 sm:grid-cols-2">
        <FormField
          label={f.name.label}
          error={errorText("name")}
          render={(id, describedBy) => (
            <Input
              id={id}
              name="name"
              autoComplete="name"
              placeholder={f.name.placeholder}
              aria-invalid={Boolean(errors.name) || undefined}
              aria-describedby={describedBy}
              className={fieldBox}
            />
          )}
        />
        <FormField
          label={dict.nationality.label}
          error={errorText("nationality")}
          render={(id, describedBy) => (
            <Input
              id={id}
              name="nationality"
              autoComplete="country-name"
              placeholder={dict.nationality.placeholder}
              aria-invalid={Boolean(errors.nationality) || undefined}
              aria-describedby={describedBy}
              className={fieldBox}
            />
          )}
        />
        <FormField
          label={f.phone.label}
          error={errorText("phone")}
          render={(id, describedBy) => (
            <Input
              id={id}
              name="phone"
              type="tel"
              dir="ltr"
              autoComplete="tel"
              inputMode="tel"
              placeholder={f.phone.placeholder}
              aria-invalid={Boolean(errors.phone) || undefined}
              aria-describedby={describedBy}
              className={cn(fieldBox, "rtl:text-end")}
            />
          )}
        />
        <FormField
          label={f.email.label}
          optionalLabel={formDict.optional}
          error={errorText("email")}
          render={(id, describedBy) => (
            <Input
              id={id}
              name="email"
              type="email"
              dir="ltr"
              autoComplete="email"
              placeholder={f.email.placeholder}
              aria-invalid={Boolean(errors.email) || undefined}
              aria-describedby={describedBy}
              className={cn(fieldBox, "rtl:text-end")}
            />
          )}
        />
      </div>

      <fieldset className="grid gap-2" aria-describedby={errors.visaType ? "visa-type-error" : undefined}>
        <legend className="mb-1.5 text-sm font-semibold">{dict.visaType.label}</legend>
        <div className="grid gap-3 sm:grid-cols-2">
          {visaTypes.map((type) => (
            <label
              key={type}
              className="flex min-h-14 cursor-pointer items-center gap-3 rounded-xl border border-input px-4 transition-colors has-checked:border-primary has-checked:bg-accent has-focus-visible:outline-2 has-focus-visible:outline-ring"
            >
              <input type="radio" name="visaType" value={type} className="size-4 accent-primary" />
              <span className="font-semibold">{dict.visaType.options[type]}</span>
            </label>
          ))}
        </div>
        {errors.visaType ? (
          <p id="visa-type-error" className="text-sm text-destructive">
            {errorText("visaType")}
          </p>
        ) : null}
      </fieldset>

      <div className="grid gap-6 sm:grid-cols-2">
        {documents.map((doc) => {
          const copy = dict[doc.field];
          return (
            <FormField
              key={doc.field}
              label={copy.label}
              hint={format(copy.hint, { size: uploadRules[doc.kind].maxMb })}
              error={errorText(doc.field)}
              render={(id, describedBy) => (
                <FileDrop
                  id={id}
                  name={doc.field}
                  accept={uploadRules[doc.kind].types}
                  text={chosen[doc.field] ?? copy.choose}
                  describedBy={describedBy}
                  invalid={Boolean(errorText(doc.field))}
                  onFiles={(files) => {
                    setChosen((prev) => ({ ...prev, [doc.field]: files[0]?.name ?? copy.choose }));
                    setFileErrors((prev) => ({
                      ...prev,
                      [doc.field]: files.length === 0 ? null : (checkFiles(doc.kind, files) ?? null),
                    }));
                  }}
                />
              )}
            />
          );
        })}
      </div>

      <FormField
        label={f.travelDate.label}
        optionalLabel={formDict.optional}
        render={(id) => (
          <Input id={id} name="travelDate" placeholder={f.travelDate.placeholder} className={fieldBox} />
        )}
      />

      <FormField
        label={f.message.label}
        optionalLabel={formDict.optional}
        render={(id) => (
          <Textarea
            id={id}
            name="message"
            rows={4}
            placeholder={f.message.placeholder}
            className="min-h-28 rounded-xl px-3.5 py-3 text-base"
          />
        )}
      />

      <input type="hidden" name="locale" value={locale} />
      <input type="hidden" name="source" value={pathname} />
      <UtmFields />
      {/* Honeypot, hidden from people and assistive tech. */}
      <div aria-hidden="true" className="absolute -start-[9999px] size-px overflow-hidden">
        <input type="text" name="company" tabIndex={-1} autoComplete="off" />
      </div>

      <FormFailure
        status={state.status === "failed" || state.status === "limited" ? state.status : null}
        messages={{ failed: formDict.errorGeneric, limited: formDict.errorLimited, whatsapp: formDict.whatsappFallback }}
      />

      <Button
        type="submit"
        variant="primary"
        size="lg"
        disabled={pending}
        aria-disabled={pending}
        className="w-full sm:w-auto sm:justify-self-start"
      >
        {uploading ? dict.uploading : pending ? formDict.submitting : dict.submit}
      </Button>
    </form>
  );
}

const fieldBox = "h-12 rounded-xl px-3.5 text-base";
