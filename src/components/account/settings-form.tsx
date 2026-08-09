"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { updateProfile } from "@/app/account/settings/actions";

const profileSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  phone: z.string().optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

interface SettingsFormProps {
  email: string;
  defaultValues: ProfileFormData;
}

export function SettingsForm({ email, defaultValues }: SettingsFormProps) {
  const router = useRouter();
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues,
  });

  async function onSubmit(data: ProfileFormData) {
    setStatus("idle");
    setErrorMessage("");

    try {
      await updateProfile(data);
      setStatus("success");
      router.refresh();
    } catch (error) {
      setStatus("error");
      setErrorMessage(
        error instanceof Error ? error.message : "Unable to update profile."
      );
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      <Input label="Email" value={email} disabled readOnly />

      <div className="grid gap-5 sm:grid-cols-2">
        <Input
          label="First name"
          autoComplete="given-name"
          error={errors.firstName?.message}
          {...register("firstName")}
        />
        <Input
          label="Last name"
          autoComplete="family-name"
          error={errors.lastName?.message}
          {...register("lastName")}
        />
      </div>

      <Input
        label="Phone"
        type="tel"
        autoComplete="tel"
        placeholder="Optional"
        hint="Used for shipping and order updates."
        error={errors.phone?.message}
        {...register("phone")}
      />

      {status === "success" ? (
        <p className="rounded-md border border-success/20 bg-success/5 px-3 py-2 text-sm text-success">
          Profile updated successfully.
        </p>
      ) : null}

      {status === "error" && errorMessage ? (
        <p className="rounded-md border border-error/20 bg-error/5 px-3 py-2 text-sm text-error">
          {errorMessage}
        </p>
      ) : null}

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Saving...
          </>
        ) : (
          <>
            <Save className="h-4 w-4" />
            Save changes
          </>
        )}
      </Button>
    </form>
  );
}
