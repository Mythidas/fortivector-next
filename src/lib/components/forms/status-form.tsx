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
import { statusFormSchema, StatusFormValues } from "@/lib/schema/forms";
import { startTransition, useActionState, useEffect, useState } from "react";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/lib/components/ui/select";
import { FormState, Option } from "@/lib/types";
import FormAlert from "../ux/form-alert";
import { hasAccess, useUser } from "@/lib/context/user-context";
import { useRouter } from "next/navigation";

type StatusOption = {
  disabled?: boolean;
} & Option;

type Props = {
  id: string;
  status: string;
  options: StatusOption[];
  label?: boolean;
  action: (
    _prevState: any,
    params: FormData
  ) => Promise<FormState<StatusFormValues>>;
};

export default function StatusUpdateForm({ id, status, options, label, action }: Props) {
  const [state, formAction] = useActionState(action, { success: true, values: {} });
  const [pending, setPending] = useState(false);
  const context = useUser();
  const router = useRouter();

  useEffect(() => {
    setPending(false);
  }, [state]);


  const form = useForm<StatusFormValues>({
    resolver: zodResolver(statusFormSchema),
    defaultValues: {
      id: id,
      status: status
    }
  });

  if (!hasAccess(context, "evidence", "edit")) {
    return <div></div>
  }

  return (
    <Form {...form}>
      <form className="flex flex-col">
        <FormAlert errors={state.errors} message={state.message} onClose={() => state.success && router.refresh()} />
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem className="w-fit text-nowrap">
              {label && <FormLabel>Change Status</FormLabel>}
              <FormControl>
                <Select
                  {...field}
                  onValueChange={(e) => {
                    field.onChange(e); // update form state
                    form.handleSubmit((data) => {
                      if (pending) return;

                      setPending(true);
                      const formData = new FormData();
                      formData.append('id', id);
                      formData.append('status', e);

                      startTransition(() => {
                        formAction(formData);
                      });
                    })();
                  }}
                >
                  <SelectTrigger className="w-full" defaultValue={status}>
                    <SelectValue placeholder="Select Status..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {options.map((opt, i) => {
                        return (
                          <SelectItem value={opt.id} disabled={opt.disabled}>{opt.label}</SelectItem>
                        )
                      })}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

      </form>
    </Form>
  );
}