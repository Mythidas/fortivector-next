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
import { createSystemFormSchema, CreateSystemFormValues } from "@/lib/schema/forms";
import { ZodIssue } from "zod";
import RouteButton from "@/lib/components/ui/protected/route-button";
import { SubmitButton } from "@/lib/components/submit-button";
import { startTransition, useActionState, useState } from "react";

type Props = {
  tenantId: string;
  action: (
    _prevState: any,
    params: FormData
  ) => Promise<{ errors: ZodIssue[] }>;
};

export default function CreateSystemForm({ tenantId, action }: Props) {
  const [state, formAction] = useActionState(action, { errors: [] });
  const [pending, setPending] = useState(false);

  const form = useForm<CreateSystemFormValues>({
    resolver: zodResolver(createSystemFormSchema),
    defaultValues: {
      name: "",
      description: "",
      tenant_id: tenantId,
    }
  });

  return (
    <Form {...form}>
      <form className="space-y-6" onSubmit={form.handleSubmit((data) => {
        setPending(true);
        const formData = new FormData();
        formData.append('name', data.name);
        formData.append('description', data.description);
        formData.append('tenant_id', data.tenant_id);

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
                <Input placeholder="Microsoft 365" {...field} />
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
                <Input placeholder="Email & SaaS Platform" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end gap-3">
          <RouteButton variant="outline" route="/systems">
            Cancel
          </RouteButton>
          <SubmitButton variant="default" pendingText="Creating System..." pending={pending}>
            Create System
          </SubmitButton>
        </div>
      </form>
    </Form>
  );
}