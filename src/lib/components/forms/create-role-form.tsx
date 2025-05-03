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
  FormDescription,
} from "@/lib/components/ui/form";
import { Input } from "@/lib/components/ui/input";
import { createRoleFormSchema, CreateRoleFormValues } from "@/lib/schema/forms";
import { ZodIssue } from "zod";
import { SubmitButton } from "@/lib/components/submit-button";
import { useActionState, useState } from "react";
import { startTransition } from 'react';
import { Textarea } from "@/lib/components/ui/textarea";
import { Separator } from "@/lib/components/ui/separator";
import { Card, CardContent } from "@/lib/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/lib/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/lib/components/ui/accordion";
import { InfoIcon, ShieldIcon, LayoutDashboardIcon, UsersIcon, HelpCircle } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/lib/components/ui/tooltip";
import { accessLevels, permissionCategories } from "@/lib/defines";

type Props = {
  tenantId: string;
  action: (
    _prevState: any,
    params: FormData
  ) => Promise<{ errors: ZodIssue[] }>;
};

export default function CreateRoleForm({ tenantId, action }: Props) {
  const [state, formAction] = useActionState(action, { errors: [] });
  const [pending, setPending] = useState(false);

  const form = useForm<CreateRoleFormValues>({
    resolver: zodResolver(createRoleFormSchema),
    defaultValues: {
      name: "",
      description: "",
      user_access: "none",
      role_access: "none",
      dashboard_access: "none",
      tenant_id: tenantId
    }
  });

  return (
    <Form {...form}>
      <form className="space-y-6" onSubmit={form.handleSubmit((data) => {
        setPending(true);
        const formData = new FormData();
        formData.append('name', data.name);
        formData.append('description', data.description);
        formData.append('user_access', data.user_access);
        formData.append('role_access', data.role_access);
        formData.append('dashboard_access', data.dashboard_access);
        formData.append('tenant_id', data.tenant_id);

        startTransition(() => {
          formAction(formData);
        })
      })}>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Technician" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Description..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Separator className="my-6" />

        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">Permissions</h3>
          <div className="text-xs text-muted-foreground flex items-center">
            <InfoIcon className="h-3 w-3 mr-1" />
            Hover over permissions for details
          </div>
        </div>

        <Card>
          <CardContent>
            <div className="max-h-[400px] overflow-y-auto pr-2">
              {permissionCategories.map((category) => (
                <div key={category.id} className="space-y-2 pt-2">
                  {category.permissions.map((permission) => (
                    <div key={permission.id} className="flex items-center justify-between py-2 border-b border-border/20">
                      <div className="flex items-center">
                        <span className="text-sm font-medium">{permission.name}</span>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <button type="button" className="ml-1.5 text-muted-foreground hover:text-foreground">
                                <HelpCircle className="h-3.5 w-3.5" />
                              </button>
                            </TooltipTrigger>
                            <TooltipContent side="right">
                              <p className="max-w-xs">{permission.description}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                      <FormField
                        control={form.control}
                        name={permission.id as keyof CreateRoleFormValues}
                        render={({ field }) => (
                          <FormItem>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger className="w-[120px]">
                                  <SelectValue placeholder="Access" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {accessLevels.map((level) => (
                                  <SelectItem key={level.value} value={level.value}>
                                    {level.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </FormItem>
                        )}
                      />
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Separator />

        <div className="flex justify-end gap-3">
          <SubmitButton variant="default" pendingText="Creating..." pending={pending}>
            Create
          </SubmitButton>
        </div>
      </form>
    </Form>
  );
}