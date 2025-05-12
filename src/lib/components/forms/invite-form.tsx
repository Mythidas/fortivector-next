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
import { inviteFormShema, InviteFormValues } from "@/lib/schema/forms";
import { ZodIssue } from "zod";
import { useActionState, useEffect, useState } from "react";
import { startTransition } from 'react';
import FormFooter from "@/lib/components/ux/form-footer";
import { FormFooterProps, FormState } from "@/lib/types";
import FormAlert from "@/lib/components/ux/form-alert";

type Props = {
  inviteId: string;
  footer: FormFooterProps;
  action: (
    _prevState: any,
    params: FormData
  ) => Promise<FormState<InviteFormValues>>;
};

export default function InviteForm({ inviteId, footer, action }: Props) {
  const [state, formAction] = useActionState(action, { success: true, values: {} });
  const [pending, setPending] = useState(false);

  useEffect(() => {
    setPending(false);
  }, [state])

  const form = useForm<InviteFormValues>({
    resolver: zodResolver(inviteFormShema),
    defaultValues: {
      password: "",
      invite_id: inviteId
    }
  });

  return (
    <Form {...form}>
      <form className="space-y-6" onSubmit={form.handleSubmit((data) => {
        setPending(true);
        const formData = new FormData();
        formData.append('password', data.password);
        formData.append('invite_id', inviteId);

        startTransition(() => {
          formAction(formData);
        })
      })}>
        <FormAlert errors={state.errors} />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input placeholder="*********" type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormFooter
          {...footer}
          pending={pending}
        />
      </form>
    </Form>
  );
}