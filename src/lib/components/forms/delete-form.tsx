'use client';

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
} from "@/lib/components/ui/form";
import { deleteFormSchema, DeleteFormValues } from "@/lib/schema/forms";
import { ReactNode, startTransition, useActionState, useEffect, useState } from "react";
import { FormState } from "@/lib/types";
import FormAlert from "@/lib/components/ux/form-alert";

type Props = {
  id: string;
  url?: string;
  children: ReactNode;
  action: (
    _prevState: any,
    params: FormData
  ) => Promise<FormState<DeleteFormValues>>;
};

export default function DeleteForm({ id, url, children, action }: Props) {
  const [state, formAction] = useActionState<FormState<DeleteFormValues>, FormData>(action, { success: true, values: {} });
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
      <form id={id} className="flex flex-col size-full" onSubmit={form.handleSubmit((data) => {
        if (pending || !window.confirm("Are you sure you want to delete this item?")) {
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
        {children}
      </form>
    </Form>
  );
}