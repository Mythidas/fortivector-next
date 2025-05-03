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
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Roles } from "@/lib/schema/database";
import { inviteFormShema, InviteFormValues } from "@/lib/schema/forms";
import { ZodIssue } from "zod";
import { SubmitButton } from "./submit-button";
import { useActionState } from "react";
import { startTransition } from 'react';

type Props = {
  inviteId: string;
  action: (
    _prevState: any,
    params: FormData
  ) => Promise<{ errors: ZodIssue[] }>;
};

export default function InviteForm({ inviteId, action }: Props) {
  const [state, formAction] = useActionState(action, { errors: [] });

  const form = useForm<InviteFormValues>({
    resolver: zodResolver(inviteFormShema)
  });

  return (
    <Form {...form}>
      <form className="space-y-6" onSubmit={form.handleSubmit((data) => {
        const formData = new FormData();
        formData.append('password', data.password);
        formData.append('invite_id', inviteId);

        startTransition(() => {
          formAction(formData);
        })
      })}>
        <FormField
          control={form.control}
          name="invite_id"
          defaultValue={inviteId}
          render={({ field }) => (
            <input hidden id="invite_id" {...field} />
          )}
        />

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
        <div className="flex justify-end gap-3">
          <SubmitButton variant="default" pendingText="Registering...">
            Register
          </SubmitButton>
        </div>
      </form>
    </Form>
  );
}