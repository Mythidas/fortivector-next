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
import { systemFormSchema, SystemFormValues } from "@/lib/schema/forms";
import { ZodIssue } from "zod";
import RouteButton from "@/lib/components/ui/protected/route-button";
import { SubmitButton } from "@/lib/components/submit-button";
import { startTransition, useActionState, useState } from "react";
import { Systems } from "@/lib/schema/database";
import { FormFooterProps, FormState } from "@/lib/types";
import FormAlert from "../ui/form-alert";

type Props = {
  system: Systems;
  action: (
    _prevState: any,
    params: FormData
  ) => Promise<FormState<SystemFormValues>>;
} & FormFooterProps;

export default function SystemForm({ system, cancel_route, submit_text, pending_text, action }: Props) {
  const [state, formAction] = useActionState(action, { success: true, values: {} });
  const [pending, setPending] = useState(false);

  const form = useForm<SystemFormValues>({
    resolver: zodResolver(systemFormSchema),
    defaultValues: {
      id: system.id,
      name: state.values.name || system.name,
      description: state.values.description || system.description,
      tenant_id: system.tenant_id,
    }
  });

  return (
    <Form {...form}>
      <form className="space-y-6" onSubmit={form.handleSubmit((data) => {
        setPending(true);
        const formData = new FormData();
        formData.append('id', system.id)
        formData.append('name', data.name);
        formData.append('description', data.description);
        formData.append('tenant_id', system.tenant_id);

        startTransition(() => {
          formAction(formData);
        })
      })}>
        <FormAlert errors={state.errors} />
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
          {cancel_route &&
            <RouteButton variant="outline" route={cancel_route}>
              Cancel
            </RouteButton>
          }
          <SubmitButton variant="default" pendingText={pending_text} pending={pending}>
            {submit_text}
          </SubmitButton>
        </div>
      </form>
    </Form>
  );
}