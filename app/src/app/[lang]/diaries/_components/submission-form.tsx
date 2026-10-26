"use client";

import { Button } from "@/components/motion/button/base";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select";
import { Textarea } from "@/components/ui/textarea";
import { MAX_PHOTOS, PHOTO_MAX_MB, PHOTO_TYPES, STORY_MIN_LENGTH } from "@/lib/diary-rules";
import { submitDiary, type DiaryErrorCode, type DiaryField, type DiaryState } from "@/lib/diary-submission";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import { format } from "@/lib/i18n/format";
import { useLocale } from "@/lib/i18n/locale-provider";
import { cn } from "@/lib/utils";
import { CircleCheck, ImagePlus, Star } from "lucide-react";
import { useActionState, useId, useState, useTransition, type FormEvent, type ReactNode } from "react";

type SubmissionFormProps = {
  dict: Dictionary["diariesPage"]["submit"];
  optionalLabel: string;
  /** Story languages with names localised to the site locale. */
  languages: { value: string; label: string }[];
};

const initialState: DiaryState = { status: "idle" };
const limits = { min: STORY_MIN_LENGTH, max: MAX_PHOTOS, size: PHOTO_MAX_MB };

function photoError(files: File[]): DiaryErrorCode | undefined {
  if (files.length > MAX_PHOTOS) return "photoCount";
  if (files.some((file) => !(PHOTO_TYPES as readonly string[]).includes(file.type))) return "photoType";
  if (files.some((file) => file.size > PHOTO_MAX_MB * 1024 * 1024)) return "photoSize";
  return undefined;
}

/** Strips photos before calling the Server Action; they are checked here (see submitDiary). */
async function submitWithPhotos(prev: DiaryState, formData: FormData): Promise<DiaryState> {
  const photos = formData.getAll("photos").filter((f): f is File => f instanceof File && f.size > 0);
  const error = photoError(photos);
  if (error) return { status: "error", fieldErrors: { photos: error } };
  formData.delete("photos");
  formData.set("photoCount", String(photos.length));
  try {
    return await submitDiary(prev, formData);
  } catch {
    return { status: "failed" };
  }
}

export function SubmissionForm(props: SubmissionFormProps) {
  // Remounting via key resets useActionState for "share another".
  const [formKey, setFormKey] = useState(0);
  return <SubmissionFormInner key={formKey} {...props} onReset={() => setFormKey((k) => k + 1)} />;
}

function SubmissionFormInner({
  dict,
  optionalLabel,
  languages,
  onReset,
}: SubmissionFormProps & { onReset: () => void }) {
  const [state, formAction, pending] = useActionState(submitWithPhotos, initialState);
  const [, startTransition] = useTransition();
  const { locale } = useLocale();
  const [rating, setRating] = useState(0);
  const [photoCount, setPhotoCount] = useState(0);
  // undefined = not re-checked since the last submit; null = the current selection is valid.
  const [photoChangeError, setPhotoChangeError] = useState<DiaryErrorCode | null>();

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
  const errorText = (name: DiaryField) => {
    const code = name === "photos" && photoChangeError !== undefined ? photoChangeError : errors[name];
    return code ? format(dict.errors[code], limits) : undefined;
  };
  const f = dict.fields;

  return (
    <form onSubmit={onSubmit} noValidate className="relative grid gap-6">
      <div className="grid gap-6 sm:grid-cols-2">
        <Field
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
        <Field
          label={f.trip.label}
          error={errorText("trip")}
          render={(id, describedBy) => (
            <Input
              id={id}
              name="trip"
              placeholder={f.trip.placeholder}
              aria-invalid={Boolean(errors.trip) || undefined}
              aria-describedby={describedBy}
              className={fieldBox}
            />
          )}
        />
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <Field
          label={f.language.label}
          error={errorText("language")}
          render={(id, describedBy) => (
            <NativeSelect
              id={id}
              name="language"
              defaultValue={locale}
              aria-invalid={Boolean(errors.language) || undefined}
              aria-describedby={describedBy}
              className={cn("w-full", selectBox)}
            >
              <NativeSelectOption value="">{f.language.placeholder}</NativeSelectOption>
              {languages.map((language) => (
                <NativeSelectOption key={language.value} value={language.value}>
                  {language.label}
                </NativeSelectOption>
              ))}
            </NativeSelect>
          )}
        />
        <RatingField
          label={f.rating.label}
          starLabel={f.rating.star}
          value={rating}
          onChange={setRating}
          error={errorText("rating")}
        />
      </div>

      <Field
        label={f.story.label}
        hint={format(f.story.hint, limits)}
        error={errorText("story")}
        render={(id, describedBy) => (
          <Textarea
            id={id}
            name="story"
            rows={9}
            dir="auto"
            placeholder={f.story.placeholder}
            aria-invalid={Boolean(errors.story) || undefined}
            aria-describedby={describedBy}
            className="min-h-56 rounded-xl px-3.5 py-3 text-base"
          />
        )}
      />

      <Field
        label={f.photos.label}
        optionalLabel={optionalLabel}
        hint={format(f.photos.hint, limits)}
        error={errorText("photos")}
        render={(id, describedBy) => (
          <label
            className={cn(
              "flex min-h-24 cursor-pointer items-center gap-4 rounded-xl border border-dashed border-input px-5 py-4 transition-colors focus-within:border-ring hover:bg-accent",
              errorText("photos") && "border-destructive",
            )}
          >
            <ImagePlus aria-hidden="true" className="size-6 shrink-0 text-primary" />
            <span className="text-sm text-muted-foreground">
              {photoCount > 0 ? format(f.photos.selected, { count: photoCount }) : f.photos.choose}
            </span>
            <input
              id={id}
              name="photos"
              type="file"
              multiple
              accept={PHOTO_TYPES.join(",")}
              aria-describedby={describedBy}
              aria-invalid={Boolean(errorText("photos")) || undefined}
              onChange={(event) => {
                const files = Array.from(event.target.files ?? []);
                setPhotoCount(files.length);
                setPhotoChangeError(photoError(files) ?? null);
              }}
              className="sr-only"
            />
          </label>
        )}
      />

      <div className="grid gap-1.5">
        <label className="flex cursor-pointer items-start gap-3">
          <input
            type="checkbox"
            name="consent"
            aria-invalid={Boolean(errors.consent) || undefined}
            aria-describedby={errors.consent ? "diary-consent-error" : undefined}
            className="mt-1 size-5 shrink-0 accent-primary"
          />
          <span className="text-sm">{f.consent}</span>
        </label>
        {errors.consent ? (
          <p id="diary-consent-error" className="text-sm text-destructive">
            {errorText("consent")}
          </p>
        ) : null}
      </div>

      <input type="hidden" name="locale" value={locale} />
      {/* Honeypot, hidden from people and assistive tech. */}
      <div aria-hidden="true" className="absolute -start-[9999px] size-px overflow-hidden">
        <input type="text" name="company" tabIndex={-1} autoComplete="off" />
      </div>

      <p role="alert" className={cn("text-sm text-destructive", state.status !== "failed" && "sr-only")}>
        {state.status === "failed" ? dict.errorGeneric : ""}
      </p>

      <Button
        type="submit"
        variant="primary"
        size="lg"
        disabled={pending}
        aria-disabled={pending}
        className="w-full sm:w-auto sm:justify-self-start"
      >
        {pending ? dict.submitting : dict.submit}
      </Button>
    </form>
  );
}

const fieldBox = "h-12 rounded-xl px-3.5 text-base";
const selectBox = "[&_select]:h-12 [&_select]:rounded-xl [&_select]:ps-3.5 [&_select]:text-base";

function Field({
  label,
  optionalLabel,
  hint,
  error,
  render,
}: {
  label: string;
  optionalLabel?: string;
  hint?: string;
  error?: string;
  render: (id: string, describedBy: string | undefined) => ReactNode;
}) {
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

/** Five native radios styled as stars, so arrow keys and screen readers work as usual. */
function RatingField({
  label,
  starLabel,
  value,
  onChange,
  error,
}: {
  label: string;
  starLabel: string;
  value: number;
  onChange: (value: number) => void;
  error?: string;
}) {
  const id = useId();
  const [hovered, setHovered] = useState(0);
  const shown = hovered || value;
  return (
    <fieldset className="grid min-w-0 gap-1.5" aria-describedby={error ? `${id}-error` : undefined}>
      <legend className="mb-1.5 text-sm font-semibold">{label}</legend>
      <div className="flex h-12 items-center gap-1" onPointerLeave={() => setHovered(0)}>
        {[1, 2, 3, 4, 5].map((star) => (
          <label
            key={star}
            onPointerEnter={() => setHovered(star)}
            className="grid size-11 cursor-pointer place-items-center rounded-full has-focus-visible:outline-2 has-focus-visible:outline-ring"
          >
            <input
              type="radio"
              name="rating"
              value={star}
              checked={value === star}
              onChange={() => onChange(star)}
              aria-label={format(starLabel, { rating: star })}
              className="sr-only"
            />
            <Star
              aria-hidden="true"
              className={cn(
                "size-7 transition-colors duration-150",
                star <= shown ? "fill-current text-primary" : "text-border",
              )}
            />
          </label>
        ))}
      </div>
      {error ? (
        <p id={`${id}-error`} className="text-sm text-destructive">
          {error}
        </p>
      ) : null}
    </fieldset>
  );
}
