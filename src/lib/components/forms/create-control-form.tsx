'use client';

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/lib/components/ui/form";
import { Input } from "@/lib/components/ui/input";
import { createControlFormSchema, CreateControlFormValues } from "@/lib/schema/forms";
import { ZodIssue } from "zod";
import RouteButton from "@/lib/components/protected/route-button";
import { SubmitButton } from "@/lib/components/submit-button";
import { startTransition, useActionState, useState } from "react";
import { Systems } from "@/lib/schema/database";
import { Separator } from "@/lib/components/ui/separator";

type Props = {
  system: Systems;
  action: (
    _prevState: any,
    params: FormData
  ) => Promise<{ errors: ZodIssue[] }>;
};

export default function CreateControlForm({ system, action }: Props) {
  const [state, formAction] = useActionState(action, { errors: [] });
  const [pending, setPending] = useState(false);

  const form = useForm<CreateControlFormValues>({
    resolver: zodResolver(createControlFormSchema),
    defaultValues: {
      title: "",
      description: "",
      system_id: system.id,
      tenant_id: system.tenant_id,
      control_code: "",
      status: "draft",
      revision: "",
      enforcement_method: "manual",
      enforcement_location: "",
      playbook_id: "",
      evidence_requirements: []
    }
  });

  return (
    <Form {...form}>
      <form className="space-y-6" onSubmit={form.handleSubmit((data) => {
        setPending(true);
        const formData = new FormData();
        formData.append('title', data.title);
        formData.append('description', data.description);
        formData.append('system_id', data.system_id);
        formData.append('tenant_id', data.tenant_id);
        formData.append('control_code', data.control_code);
        formData.append('status', data.status);
        formData.append('revision', data.revision);
        formData.append('enforcement_method', data.enforcement_method);
        formData.append('enforcement_location', data.enforcement_location || "");
        formData.append('playbook_id', data.playbook_id || "");
        formData.append('evidence_requirements', JSON.stringify(data.evidence_requirements));

        startTransition(() => {
          formAction(formData);
        })
      })}>

        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Enforce MFA" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input placeholder="Enforces MFA for authentication on Users & Admins" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Separator />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <div className="flex flex-col gap-2 w-full h-full">
            </div>
          )}
        />

        <div className="flex justify-end gap-3">
          <RouteButton variant="outline" route={`/systems/${system.id}?tab=controls`}>
            Cancel
          </RouteButton>
          <SubmitButton variant="default" pendingText="Creating Control..." pending={pending}>
            Create Control
          </SubmitButton>
        </div>
      </form>
    </Form>
  );
}