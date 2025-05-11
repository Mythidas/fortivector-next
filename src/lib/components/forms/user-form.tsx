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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/lib/components/ui/select";
import { Checkbox } from "@/lib/components/ui/checkbox";
import { Separator } from "@/lib/components/ui/separator";
import { userFormSchema, UserFormValues } from "@/lib/schema/forms";
import { startTransition, useActionState, useEffect, useState } from "react";
import { FormFooterProps, FormState } from "@/lib/types";
import FormAlert from "@/lib/components/ux/form-alert";
import FormFooter from "@/lib/components/ux/form-footer";
import { useUser } from "@/lib/context/user-context";
import { Users } from "@/lib/schema/database/users";
import { Roles } from "@/lib/schema/database/roles";

type Props = {
  user: Users;
  roles: Roles[];
  footer: FormFooterProps;
  action: (
    _prevState: any,
    params: FormData
  ) => Promise<FormState<UserFormValues>>;
};

export default function UserForm({ user, roles, footer, action }: Props) {
  const [state, formAction] = useActionState(action, { success: true, values: {} });
  const [pending, setPending] = useState(false);
  const context = useUser();

  useEffect(() => {
    setPending(false);
  }, [state])

  const form = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      ...user,
      ...state.values
    }
  });

  return (
    <Form {...form}>
      <form className="space-y-6" onSubmit={form.handleSubmit((data) => {
        setPending(true);
        const formData = new FormData();
        formData.append('id', user.id);
        formData.append('email', data.email);
        formData.append('first_name', data.first_name);
        formData.append('last_name', data.last_name);
        formData.append('role_id', data.role_id);
        formData.append('tenant_id', data.tenant_id);
        formData.append('send_email', String(data.send_email));

        startTransition(() => {
          formAction(formData);
        })
      })}>
        <FormAlert errors={state.errors} />
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="first_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <Input placeholder="John" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="last_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last Name</FormLabel>
                <FormControl>
                  <Input placeholder="Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="john@example.com" {...field} disabled={context?.id === user.id} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Separator />

        <FormField
          control={form.control}
          name="role_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Role</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value} {...field} disabled={context?.id === user.id}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {roles.map((role) => (
                    <SelectItem key={role.id} value={role.id}>
                      {role.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>
                Assign a role to set user permissions
              </FormDescription>
              <FormMessage />
              <input hidden id="role_id" name="role_id" defaultValue={field.value} />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="send_email"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4" hidden={context?.id === user.id}>
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Send Welcome Email</FormLabel>
                <FormDescription>
                  Send welcome email with login instructions
                </FormDescription>
              </div>
              <input hidden id="send_email" name="send_email" type="checkbox" defaultChecked={field.value} />
            </FormItem>
          )}
        />
        <FormFooter
          pending={pending}
          {...footer}
        />
      </form>
    </Form>
  );
}