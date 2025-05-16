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
import { Textarea } from "@/lib/components/ui/textarea";
import { controlWaiverFormSchema, ControlWaiverFormValues } from "@/lib/schema/forms";
import { startTransition, useActionState, useEffect, useRef, useState } from "react";
import { FormFooterProps, FormState } from "@/lib/types";
import FormAlert from "../ux/form-alert";
import FormFooter from "@/lib/components/ux/form-footer";
import { ControlWaivers } from "@/lib/schema/database/controls";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/lib/components/ui/card";
import { CalendarIcon, FileImage } from "lucide-react";
import { Button } from "@/lib/components/ui/button";
import { Separator } from "@/lib/components/ui/separator";
import { useUser } from "@/lib/context/user-context";
import { Popover, PopoverContent, PopoverTrigger } from "@/lib/components/ui/popover";
import { cn } from "@/lib/utils";
import { Calendar } from "@/lib/components/ui/calendar";
import { format } from "date-fns";
import FileInput from "@/lib/components/ux/file-input";

type Props = {
  waiver: ControlWaivers;
  footer: FormFooterProps;
  action: (
    _prevState: any,
    params: FormData
  ) => Promise<FormState<ControlWaiverFormValues>>;
};

export default function ControlWaiverForm({ waiver, footer, action }: Props) {
  const [state, formAction] = useActionState(action, { success: true, values: {} });
  const [pending, setPending] = useState(false);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const context = useUser();

  useEffect(() => {
    setPending(false);
  }, [state])

  const form = useForm<ControlWaiverFormValues>({
    resolver: zodResolver(controlWaiverFormSchema),
    defaultValues: {
      ...waiver,
      ...state.values,
      expiration: new Date()
    }
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <Form {...form}>
      <form className="space-y-6" onSubmit={form.handleSubmit((data) => {
        setPending(true);
        const formData = new FormData();

        formData.append('id', waiver.id);
        formData.append('site_id', waiver.site_id);
        formData.append('tenant_id', waiver.tenant_id);
        formData.append('site_control_id', waiver.site_control_id);
        formData.append('reason', data.reason);
        formData.append('expiration', data.expiration.toISOString());

        if (fileInputRef.current?.files?.length) {
          formData.append('waiver_obj', fileInputRef.current.files[0]);
        }

        startTransition(() => {
          formAction(formData);
        });
      })}>
        <FormAlert errors={state.errors} />

        <Card>
          <CardHeader>
            <CardTitle>Upload Evidence</CardTitle>
            <CardDescription>
              Choose a waiver file to upload
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex w-full gap-2">
              <FormField
                control={form.control}
                name="reason"
                render={({ field }) => (
                  <FormItem className="w-4/5">
                    <FormLabel>Reason</FormLabel>
                    <FormControl>
                      <Input placeholder="Reason..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="expiration"
                render={({ field }) => (
                  <FormItem className="flex flex-col w-1/5">
                    <FormLabel>Expiration Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "justify-start text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {field.value ?
                              format(field.value, "PPP") :
                              <span>Pick a date</span>
                            }
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          onSelect={field.onChange}
                          disabled={(date) => date < new Date()}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Separator className="my-6" />

            {/* Upload Section */}
            <div className="space-y-4">
              <div>
                <FormLabel className="text-base">Upload Waiver</FormLabel>
              </div>

              {/* File Upload Area */}
              <div className="mt-4">
                <FileInput
                  ref={fileInputRef}
                  accept=".pdf"
                />
              </div>
            </div>
            <FormFooter
              {...footer}
              pending={pending}
            />
          </CardContent>
        </Card>
      </form>
    </Form>
  );
}