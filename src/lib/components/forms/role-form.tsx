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
import { roleFormSchema, RoleFormValues } from "@/lib/schema/forms";
import { useActionState, useEffect, useState } from "react";
import { startTransition } from 'react';
import { Textarea } from "@/lib/components/ui/textarea";
import { Separator } from "@/lib/components/ui/separator";
import { Card, CardContent } from "@/lib/components/ui/card";
import { InfoIcon, HelpCircle } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/lib/components/ui/tooltip";
import { AccessModule, FormFooterProps, FormState } from "@/lib/types";
import FormFooter from "@/lib/components/ux/form-footer";
import FormAlert from "@/lib/components/ux/form-alert";
import { accessLevels, accessModules, type AccessLevel } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Roles } from "@/lib/schema/database/roles";

type Props = {
  role: Roles;
  footer: FormFooterProps;
  action: (
    _prevState: any,
    params: FormData
  ) => Promise<FormState<RoleFormValues>>;
};

export default function RoleForm({ role, footer, action }: Props) {
  const [state, formAction] = useActionState(action, { success: true, values: {} });
  const [pending, setPending] = useState(false);

  useEffect(() => {
    setPending(false);
  }, [state])

  const form = useForm<RoleFormValues>({
    resolver: zodResolver(roleFormSchema),
    defaultValues: {
      id: role.id,
      tenant_id: role.tenant_id,
      name: state.values.name || role.name,
      description: state.values.description || role.description,
      access_rights: state.values.access_rights ? JSON.parse(String(state.values.access_rights)) : role.access_rights
    }
  });

  // Helper function to get descriptions for access levels
  function getAccessLevelDescription(level: AccessLevel): string {
    const descriptions: Record<AccessLevel, string> = {
      none: "No access",
      read: "View only",
      edit: "Modify content",
      full: "Full control"
    };
    return descriptions[level];
  }

  // Helper function to get module descriptions
  function getModuleDescription(module: AccessModule): string {
    const descriptions: Record<AccessModule, string> = {
      users: "Manage user accounts and permissions",
      roles: "Configure role definitions and assignments",
      dashboard: "Access analytics and reporting dashboards",
      systems: "Manage system configurations and settings",
      controls: "Configure security controls and compliance mappings",
      clients: "Manage client organizations",
      sites: "Manage physical and virtual locations"
    };
    return descriptions[module];
  }

  return (
    <Form {...form}>
      <form className="space-y-6" onSubmit={form.handleSubmit((data) => {
        setPending(true);
        const formData = new FormData();
        formData.append('id', role.id);
        formData.append('tenant_id', role.tenant_id)
        formData.append('name', data.name);
        formData.append('description', data.description);
        formData.append('access_rights', JSON.stringify(data.access_rights));

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


        <FormField
          control={form.control}
          name="access_rights"
          render={({ field }) => (
            <FormItem>
              <Card>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr>
                          <th className="text-left pb-4 px-2 text-sm font-medium text-muted-foreground w-[200px]">
                            Module
                          </th>
                          {accessLevels.map((level) => (
                            <th key={level} className="pb-4 px-2 text-center">
                              <span className="font-medium text-sm block capitalize">{level}</span>
                              <span className="text-xs text-muted-foreground">
                                {getAccessLevelDescription(level)}
                              </span>
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {accessModules.map((module) => (
                          <tr key={module} className="border-t border-border/30">
                            <td className="py-3 px-2">
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-sm capitalize">{module}</span>
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <button type="button" className="text-muted-foreground hover:text-foreground">
                                        <HelpCircle className="h-3.5 w-3.5" />
                                      </button>
                                    </TooltipTrigger>
                                    <TooltipContent side="right">
                                      <p className="max-w-xs">{getModuleDescription(module)}</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              </div>
                            </td>
                            {accessLevels.map((level) => (
                              <td key={`${module}-${level}`} className="py-3 px-2 text-center">
                                <div
                                  className="flex justify-center"
                                  onClick={() => {
                                    const newAccessRights = { ...field.value };
                                    newAccessRights[module] = level;
                                    field.onChange(newAccessRights);
                                  }}
                                >
                                  <div
                                    className={cn(
                                      "w-5 h-5 rounded-full border border-border cursor-pointer",
                                      field.value?.[module] === level
                                        ? "bg-primary border-primary"
                                        : "bg-background hover:bg-accent/50"
                                    )}
                                  />
                                </div>
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormFooter {...footer} pending={pending} />
      </form>
    </Form>
  );
}