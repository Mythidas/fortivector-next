'use client';

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormDescription,
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
      name: "",
      description: "",
      system_id: system.id,
    }
  });

  return (
    <Form {...form}>
      <form className="space-y-6" onSubmit={form.handleSubmit((data) => {
        setPending(true);
        const formData = new FormData();
        formData.append('name', data.name);
        formData.append('description', data.description);
        formData.append('system_id', data.system_id);

        startTransition(() => {
          formAction(formData);
        })
      })}>

        <FormField
          control={form.control}
          name="name"
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