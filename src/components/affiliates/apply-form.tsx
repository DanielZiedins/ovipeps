"use client";

import { useState } from "react";
import { useFieldArray, useForm, type UseFormRegisterReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Plus, Send, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";

const CANADIAN_PROVINCES = [
  ["AB", "Alberta"], ["BC", "British Columbia"], ["MB", "Manitoba"],
  ["NB", "New Brunswick"], ["NL", "Newfoundland and Labrador"],
  ["NS", "Nova Scotia"], ["NT", "Northwest Territories"],
  ["NU", "Nunavut"], ["ON", "Ontario"], ["PE", "Prince Edward Island"],
  ["QC", "Quebec"], ["SK", "Saskatchewan"], ["YT", "Yukon"],
] as const;

const PLATFORM_OPTIONS = [
  "Instagram", "TikTok", "YouTube", "Facebook", "X / Twitter", "LinkedIn",
  "Podcast", "Newsletter", "Blog / Website", "Other",
];

const socialProfileSchema = z.object({
  platform: z.string().min(1, "Select a platform"),
  handle: z.string().min(1, "Enter the handle or profile URL"),
  followers: z.number().int().min(0, "Enter a valid follower count"),
});

const applySchema = z.object({
  firstName: z.string().trim().min(1, "First name is required"),
  lastName: z.string().trim().min(1, "Last name is required"),
  email: z.string().trim().email("Enter a valid email address"),
  phone: z.string().trim().min(7, "Phone number is required"),
  address1: z.string().trim().min(1, "Street address is required"),
  address2: z.string().trim().optional(),
  city: z.string().trim().min(1, "City is required"),
  province: z.string().min(1, "Province or territory is required"),
  postalCode: z.string().trim().regex(/^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/, "Enter a valid Canadian postal code"),
  country: z.literal("Canada"),
  canadianResident: z.boolean().refine(Boolean, { message: "You must confirm that you reside in Canada" }),
  socialProfiles: z.array(socialProfileSchema).min(1, "Add at least one social profile"),
  website: z.string().url("Enter a valid URL").optional().or(z.literal("")),
  whyAffiliate: z.string().trim().min(20, "Please tell us why you want to become an affiliate"),
  affiliateStrengths: z.string().trim().min(20, "Please tell us why you would be a good affiliate"),
  promotionPlan: z.string().trim().min(20, "Please describe how you plan to promote OVIpeps"),
  monthlyMinimumAccepted: z.boolean().refine(Boolean, { message: "You must confirm the $300 CAD monthly sales commitment" }),
  complianceAccepted: z.boolean().refine(Boolean, { message: "You must acknowledge and agree to the affiliate restrictions" }),
  signedName: z.string().trim().min(2, "Type your full legal name as your signature"),
  signedDate: z.string().min(1, "Signature date is required"),
});

type ApplyFormData = z.infer<typeof applySchema>;

interface AffiliateApplyFormProps {
  defaultEmail?: string;
  defaultFirstName?: string;
  defaultLastName?: string;
}

function AgreementCheckbox({ id, label, error, registration }: { id: string; label: string; error?: string; registration: UseFormRegisterReturn }) {
  return (
    <div>
      <label htmlFor={id} className="flex cursor-pointer items-start gap-3 rounded-lg border border-border bg-white p-4 text-sm leading-relaxed">
        <input id={id} type="checkbox" className="mt-1 h-4 w-4 shrink-0 accent-navy" {...registration} />
        <span>{label}</span>
      </label>
      {error ? <p className="mt-1.5 text-xs text-error">{error}</p> : null}
    </div>
  );
}

export function AffiliateApplyForm({ defaultEmail = "", defaultFirstName = "", defaultLastName = "" }: AffiliateApplyFormProps) {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const today = new Date().toISOString().slice(0, 10);
  const { register, control, handleSubmit, reset, formState: { errors } } = useForm<ApplyFormData>({
    resolver: zodResolver(applySchema),
    defaultValues: {
      firstName: defaultFirstName, lastName: defaultLastName, email: defaultEmail,
      phone: "", address1: "", address2: "", city: "", province: "", postalCode: "", country: "Canada",
      canadianResident: false, socialProfiles: [{ platform: "", handle: "", followers: 0 }], website: "",
      whyAffiliate: "", affiliateStrengths: "", promotionPlan: "", monthlyMinimumAccepted: false,
      complianceAccepted: false, signedName: "", signedDate: today,
    },
  });
  const { fields, append, remove } = useFieldArray({ control, name: "socialProfiles" });

  async function onSubmit(data: ApplyFormData) {
    setStatus("loading"); setErrorMessage("");
    try {
      const response = await fetch("/api/affiliates/apply", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      const body = await response.json().catch(() => null);
      if (!response.ok) throw new Error(body?.error ?? "Unable to submit your application.");
      setStatus("success"); reset();
    } catch (error) {
      setStatus("error"); setErrorMessage(error instanceof Error ? error.message : "Something went wrong. Please try again.");
    }
  }

  if (status === "success") return (
    <div className="rounded-xl border border-success/20 bg-success/5 p-8 text-center">
      <h3 className="text-lg font-semibold text-navy-deep">Application received</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">Thank you for applying. OVIpeps will review your application and contact you by email. If accepted, your dashboard will ask you to choose your unique affiliate code.</p>
    </div>
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8" noValidate>
      <section className="space-y-5">
        <div><h3 className="font-semibold text-navy-deep">Contact information</h3><p className="text-sm text-muted-foreground">Your legal name and complete Canadian address.</p></div>
        <div className="grid gap-5 sm:grid-cols-2">
          <Input label="First name" autoComplete="given-name" error={errors.firstName?.message} {...register("firstName")} />
          <Input label="Last name" autoComplete="family-name" error={errors.lastName?.message} {...register("lastName")} />
          <Input label="Email" type="email" autoComplete="email" error={errors.email?.message} {...register("email")} />
          <Input label="Phone number" type="tel" autoComplete="tel" error={errors.phone?.message} {...register("phone")} />
        </div>
        <Input label="Street address" autoComplete="address-line1" error={errors.address1?.message} {...register("address1")} />
        <Input label="Apartment, suite, unit (optional)" autoComplete="address-line2" {...register("address2")} />
        <div className="grid gap-5 sm:grid-cols-3">
          <Input label="City" autoComplete="address-level2" error={errors.city?.message} {...register("city")} />
          <Select label="Province / territory" defaultValue="" error={errors.province?.message} {...register("province")}><option value="" disabled>Select one</option>{CANADIAN_PROVINCES.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</Select>
          <Input label="Postal code" autoComplete="postal-code" error={errors.postalCode?.message} {...register("postalCode")} />
        </div>
        <Input label="Country" value="Canada" readOnly {...register("country")} />
        <AgreementCheckbox id="canadian-resident" label="I confirm that I currently reside in Canada." error={errors.canadianResident?.message} registration={register("canadianResident")} />
      </section>

      <section className="space-y-5 border-t border-border pt-8">
        <div><h3 className="font-semibold text-navy-deep">Social media presence</h3><p className="text-sm text-muted-foreground">List every account you intend to use, including its current follower count.</p></div>
        {fields.map((field, index) => (
          <div key={field.id} className="grid gap-3 rounded-xl border border-border bg-muted/20 p-4 sm:grid-cols-[1fr_1.4fr_1fr_auto] sm:items-end">
            <Select label="Platform" defaultValue="" error={errors.socialProfiles?.[index]?.platform?.message} {...register(`socialProfiles.${index}.platform`)}><option value="" disabled>Select</option>{PLATFORM_OPTIONS.map((platform) => <option key={platform} value={platform}>{platform}</option>)}</Select>
            <Input label="Handle or profile URL" placeholder="@yourhandle" error={errors.socialProfiles?.[index]?.handle?.message} {...register(`socialProfiles.${index}.handle`)} />
            <Input label="Followers" type="number" min={0} error={errors.socialProfiles?.[index]?.followers?.message} {...register(`socialProfiles.${index}.followers`, { valueAsNumber: true })} />
            <Button type="button" variant="outline" size="sm" disabled={fields.length === 1} onClick={() => remove(index)} aria-label={`Remove social profile ${index + 1}`}><Trash2 className="h-4 w-4" /></Button>
          </div>
        ))}
        <Button type="button" variant="outline" size="sm" onClick={() => append({ platform: "", handle: "", followers: 0 })}><Plus className="h-4 w-4" /> Add another profile</Button>
        <Input label="Website (optional)" type="url" placeholder="https://..." error={errors.website?.message} {...register("website")} />
      </section>

      <section className="space-y-5 border-t border-border pt-8">
        <h3 className="font-semibold text-navy-deep">About your application</h3>
        <Textarea label="Why do you want to become an OVIpeps affiliate?" rows={4} error={errors.whyAffiliate?.message} {...register("whyAffiliate")} />
        <Textarea label="What makes you believe you would be a good affiliate?" rows={4} error={errors.affiliateStrengths?.message} {...register("affiliateStrengths")} />
        <Textarea label="How will you promote OVIpeps?" rows={4} error={errors.promotionPlan?.message} {...register("promotionPlan")} />
        <AgreementCheckbox id="monthly-minimum" label="Yes, I can commit to generating at least $300 CAD in qualifying sales each calendar month to maintain affiliate status." error={errors.monthlyMinimumAccepted?.message} registration={register("monthlyMinimumAccepted")} />
      </section>

      <section className="space-y-5 border-t border-border pt-8">
        <div className="rounded-xl border border-warning/30 bg-warning/5 p-5 text-sm leading-relaxed">
          <h3 className="font-semibold text-navy-deep">Affiliate acknowledgement and agreement</h3>
          <p className="mt-3">OVIpeps products are sold strictly for research use and are not for human consumption. I agree that I will not promote, present, or imply that any OVIpeps product is for human consumption, especially in public or online content. I will not make medical, therapeutic, performance, safety, efficacy, or other product claims.</p>
          <p className="mt-3">I may share my own experience or beliefs only when doing so does not violate these restrictions, does not make a product claim, and does not suggest human consumption. I understand that OVIpeps may suspend or terminate the affiliate arrangement at any time, without reason, and that commission is paid manually according to the Affiliate Program Terms.</p>
        </div>
        <AgreementCheckbox id="compliance-agreement" label="I have read, understand, acknowledge, and agree to the Affiliate Program Terms and the restrictions above." error={errors.complianceAccepted?.message} registration={register("complianceAccepted")} />
        <div className="grid gap-5 sm:grid-cols-2">
          <Input label="Electronic signature (full legal name)" hint="Typing your name serves as your signature and proof of agreement." error={errors.signedName?.message} {...register("signedName")} />
          <Input label="Date signed" type="date" max={today} error={errors.signedDate?.message} {...register("signedDate")} />
        </div>
      </section>

      {status === "error" && errorMessage ? <p className="rounded-md border border-error/20 bg-error/5 px-3 py-2 text-sm text-error">{errorMessage}</p> : null}
      <Button type="submit" size="lg" disabled={status === "loading"}>{status === "loading" ? <><Loader2 className="h-4 w-4 animate-spin" />Submitting...</> : <><Send className="h-4 w-4" />Sign and submit application</>}</Button>
    </form>
  );
}
