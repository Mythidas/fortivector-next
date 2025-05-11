'use client';

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
} from "@/lib/components/ui/form";
import { deleteFormSchema, DeleteFormValues } from "@/lib/schema/forms";
import { startTransition, useActionState, useEffect, useState } from "react";
import { FormFooterProps, FormState } from "@/lib/types";
import FormAlert from "../ux/form-alert";
import FormFooter from "@/lib/components/ux/form-footer";

type Props = {
  id: string;
  url?: string;
  footer: FormFooterProps;
  action: (
    _prevState: any,
    params: FormData
  ) => Promise<FormState<DeleteFormValues>>;
};

export default function DeleteForm({ id, url, footer, action }: Props) {
  const [state, formAction] = useActionState(action, { success: true, values: {} });
  const [pending, setPending] = useState(false);

  useEffect(() => {
    setPending(false);
  }, [state])

  const form = useForm<DeleteFormValues>({
    resolver: zodResolver(deleteFormSchema),
    defaultValues: {
      id: id,
      url: url
    }
  });

  return (
    <Form {...form}>
      <form className="space-y-6" onSubmit={form.handleSubmit((data) => {
        if (!window.confirm("Are you sure you want to delete this item?")) {
          return;
        }

        setPending(true);
        const formData = new FormData();
        formData.append('id', id);
        formData.append("url", url || "");

        startTransition(() => {
          formAction(formData);
        })
      })}>
        <FormAlert errors={state.errors} />
        <FormFooter
          {...footer}
          pending={pending}
        />
      </form>
    </Form>
  );
}