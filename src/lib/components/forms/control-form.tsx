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
import { controlFormSchema, ControlFormValues } from "@/lib/schema/forms";
import RouteButton from "@/lib/components/ux/route-button";
import { SubmitButton } from "@/lib/components/ux/submit-button";
import { startTransition, useActionState, useEffect, useState } from "react";
import { Separator } from "@/lib/components/ui/separator";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/lib/components/ui/select";
import { Textarea } from "@/lib/components/ui/textarea";
import { FormFooterProps, FormState } from "@/lib/types";
import FormAlert from "../ux/form-alert";
import { Controls } from "@/lib/schema/database/controls";
import FormFooter from "@/lib/components/ux/form-footer";

type Props = {
  control: Controls;
  footer: FormFooterProps;
  action: (
    _prevState: any,
    params: FormData
  ) => Promise<FormState<ControlFormValues>>;
};

export default function ControlForm({ control, footer, action }: Props) {
  const [state, formAction] = useActionState<FormState<ControlFormValues>, FormData>(action, { success: true, values: {} });
  const [pending, setPending] = useState(false);

  useEffect(() => {
    setPending(false);
  }, [state]);


  const form = useForm<ControlFormValues>({
    resolver: zodResolver(controlFormSchema),
    defaultValues: {
      ...control,
      ...state.values
    }
  });

  return (
    <Form {...form}>
      <form className="flex flex-col size-full gap-4" onSubmit={form.handleSubmit((data) => {
        setPending(true);
        const formData = new FormData();
        formData.append('id', control.id);
        formData.append('title', data.title);
        formData.append('description', data.description);
        formData.append('system_id', data.system_id);
        formData.append('tenant_id', data.tenant_id);
        formData.append('control_code', data.control_code);
        formData.append('status', data.status);
        formData.append('revision', data.revision);
        formData.append('enforcement_method', data.enforcement_method);
        formData.append('enforcement_location', data.enforcement_location || "");
        formData.append('review_frequency', data.review_frequency.toString());

        startTransition(() => {
          formAction(formData);
        })
      })}>

        <FormAlert errors={state.errors} />
        <div className="flex gap-4 size-full">
          <div className="flex flex-col gap-4 w-full h-fit">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Security Defaults Enabled in O365" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex gap-4 h-full w-full">
              <FormField
                control={form.control}
                name="control_code"
                render={({ field }) => (
                  <FormItem className="w-fit">
                    <FormLabel>Code</FormLabel>
                    <FormControl>
                      <Input placeholder="CL-O365-001" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="revision"
                render={({ field }) => (
                  <FormItem className="w-fit">
                    <FormLabel>Revision</FormLabel>
                    <FormControl>
                      <Input placeholder="2025.1" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="review_frequency"
                render={({ field }) => (
                  <FormItem className="w-fit">
                    <FormLabel>Review Frequency (Days)</FormLabel>
                    <FormControl>
                      <Input placeholder="30 days" type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="enforcement_method"
                render={({ field }) => (
                  <FormItem className="w-fit text-nowrap">
                    <FormLabel>Enforcement Method</FormLabel>
                    <FormControl>
                      <Select {...field}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select Method..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Methods</SelectLabel>
                            <SelectItem value="manual">Manual</SelectItem>
                            <SelectItem value="scripted" disabled>Scripted</SelectItem>
                            <SelectItem value="auto-scanned" disabled>Auto Scanned</SelectItem>
                            <SelectItem value="vendor-managed" disabled>Vendor Managed</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem className="w-fit text-nowrap">
                    <FormLabel>Status</FormLabel>
                    <FormControl>
                      <Select {...field} onValueChange={field.onChange}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select Status..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Statuses</SelectLabel>
                            <SelectItem value="draft">Draft</SelectItem>
                            <SelectItem value="approved">Approved</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex flex-col gap-4">
              <FormField
                control={form.control}
                name="enforcement_location"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Enforcement Location <span className="text-accent">(Optional)</span></FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Microsoft Entra Admin Center > Properties"
                        className="h-20 resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Ensures Microsoft Entra Security Defaults are enabled to protect the tenant with baseline identity protections. It includes enforcement of multi-factor authentication (MFA) for all users and blocking legacy authentication."
                        className="h-72 resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </div>
        <FormFooter
          {...footer}
          pending={pending}
        />
      </form>
    </Form>
  );
}