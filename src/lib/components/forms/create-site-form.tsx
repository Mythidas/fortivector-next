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
import { clientFormSchema, ClientFormValues, siteFormSchema, SiteFormValues } from "@/lib/schema/forms";
import { ZodIssue } from "zod";
import RouteButton from "@/lib/components/ux/route-button";
import { SubmitButton } from "@/lib/components/ux/submit-button";
import { startTransition, useActionState, useState } from "react";
import { FormState } from "@/lib/types";
import { Clients } from "@/lib/schema/database";
import FormAlert from "../ux/form-alert";

type Props = {
  client: Clients;
  action: (
    _prevState: any,
    params: FormData
  ) => Promise<FormState<SiteFormValues>>;
};

export default function CreateSiteForm({ client, action }: Props) {
  const [state, formAction] = useActionState(action, { success: true, values: {} });
  const [pending, setPending] = useState(false);

  const form = useForm<SiteFormValues>({
    resolver: zodResolver(siteFormSchema),
    defaultValues: {
      name: "",
      tenant_id: client.tenant_id,
      client_id: client.id
    }
  });

  return (
    <Form {...form}>
      <form className="space-y-6" onSubmit={form.handleSubmit((data) => {
        setPending(true);
        const formData = new FormData();
        formData.append('name', data.name);
        formData.append('tenant_id', data.tenant_id);
        formData.append('client_id', data.client_id);

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
                <Input placeholder="Site name..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end gap-3">
          <RouteButton variant="outline" route={`/clients/${client.id}?tab=sites`}>
            Cancel
          </RouteButton>
          <SubmitButton variant="default" pendingText="Creating site..." pending={pending}>
            Create Site
          </SubmitButton>
        </div>
      </form>
    </Form>
  );
}