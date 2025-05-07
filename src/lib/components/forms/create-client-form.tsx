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
import { clientFormSchema, ClientFormValues } from "@/lib/schema/forms";
import { ZodIssue } from "zod";
import RouteButton from "@/lib/components/ui/protected/route-button";
import { SubmitButton } from "@/lib/components/submit-button";
import { startTransition, useActionState, useState } from "react";
import { FormState } from "@/lib/types";
import FormAlert from "../ui/form-alert";

type Props = {
  tenantId: string;
  action: (
    _prevState: any,
    params: FormData
  ) => Promise<FormState<ClientFormValues>>;
};

export default function CreateClientForm({ tenantId, action }: Props) {
  const [state, formAction] = useActionState(action, { success: true, values: {} });
  const [pending, setPending] = useState(false);

  const form = useForm<ClientFormValues>({
    resolver: zodResolver(clientFormSchema),
    defaultValues: {
      name: "",
      tenant_id: tenantId,
    }
  });

  return (
    <Form {...form}>
      <form className="space-y-6" onSubmit={form.handleSubmit((data) => {
        setPending(true);
        const formData = new FormData();
        formData.append('name', data.name);
        formData.append('tenant_id', data.tenant_id);

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
                <Input placeholder="Client name..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end gap-3">
          <RouteButton variant="outline" route="/clients">
            Cancel
          </RouteButton>
          <SubmitButton variant="default" pendingText="Creating client..." pending={pending}>
            Create Client
          </SubmitButton>
        </div>
      </form>
    </Form>
  );
}