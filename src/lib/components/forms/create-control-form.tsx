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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/lib/components/ui/alert-dialog"
import { Input } from "@/lib/components/ui/input";
import { createControlFormSchema, CreateControlFormValues } from "@/lib/schema/forms";
import RouteButton from "@/lib/components/protected/route-button";
import { SubmitButton } from "@/lib/components/submit-button";
import { startTransition, useActionState, useEffect, useState } from "react";
import { Systems } from "@/lib/schema/database";
import { Separator } from "@/lib/components/ui/separator";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "../ui/select";
import { ScrollArea } from "../ui/scroll-area";
import { Button } from "../ui/button";
import { ChevronsUpDown, Plus, Trash2 } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../ui/collapsible";
import { Textarea } from "../ui/textarea";
import { FormState } from "@/lib/types";

type Props = {
  system: Systems;
  action: (
    _prevState: any,
    params: FormData
  ) => Promise<FormState<CreateControlFormValues>>;
};

export default function CreateControlForm({ system, action }: Props) {
  const [state, formAction] = useActionState<FormState<CreateControlFormValues>, FormData>(action, { success: true, errors: {}, values: {} });
  const [pending, setPending] = useState(false);
  const [alert, setAlert] = useState(false);

  useEffect(() => {
    if (pending) {
      setPending(false);
      setAlert(true);
    }
  }, [state]);


  const form = useForm<CreateControlFormValues>({
    resolver: zodResolver(createControlFormSchema),
    defaultValues: {
      title: state.values.title || "",
      description: state.values.description || "",
      system_id: system.id,
      tenant_id: system.tenant_id,
      control_code: state.values.control_code || "",
      status: state.values.status || "draft",
      revision: state.values.revision || "",
      enforcement_method: state.values.enforcement_method || "manual",
      enforcement_location: state.values.enforcement_location || "",
      playbook_id: undefined,
      evidence_requirements: JSON.parse(String(state.values.evidence_requirements || "[]")) || []
    }
  });

  return (
    <Form {...form}>
      <form className="flex flex-col w-full space-y-6" onSubmit={form.handleSubmit((data) => {
        setPending(true);
        const formData = new FormData();
        formData.append('title', data.title);
        formData.append('description', data.description);
        formData.append('system_id', data.system_id);
        formData.append('tenant_id', data.tenant_id);
        formData.append('control_code', data.control_code);
        formData.append('status', data.status);
        formData.append('revision', data.revision);
        formData.append('enforcement_method', data.enforcement_method);
        formData.append('enforcement_location', data.enforcement_location || "");
        formData.append('playbook_id', data.playbook_id || "");
        formData.append('evidence_requirements', JSON.stringify(data.evidence_requirements));

        startTransition(() => {
          formAction(formData);
        })
      })}>

        <AlertDialog open={alert}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Errors</AlertDialogTitle>
              <AlertDialogDescription>
                {Object.entries(state.errors).map(([field, error]) => (
                  <div key={field}>{`${field}: ${error}`}</div>
                ))}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogAction onClick={() => setAlert(false)}>Acknowledge</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        <div className="flex gap-4 w-full">
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
        </div>
        <div className="flex flex-col gap-4">
          <div className="flex gap-4">
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
              name="enforcement_location"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Enforcement Location <span className="text-accent">(Optional)</span></FormLabel>
                  <FormControl>
                    <Input placeholder="Microsoft Entra Admin Center > Properties" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Ensures Microsoft Entra Security Defaults are enabled to protect the tenant with baseline identity protections. It includes enforcement of multi-factor authentication (MFA) for all users and blocking legacy authentication."
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Separator />
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">Evidence Requirements</h3>
          <div className="text-xs text-muted-foreground flex items-center">
            <Button
              type="button"
              size="sm"
              onClick={() => {
                const currentRequirements = form.getValues('evidence_requirements');
                form.setValue('evidence_requirements', [
                  ...currentRequirements,
                  { type: 'screenshot', description: '', location_hint: '' }
                ]);
              }}
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Evidence Item
            </Button>
          </div>
        </div>
        <ScrollArea className="h-96 w-full overflow-hidden">
          <FormField
            control={form.control}
            name="evidence_requirements"
            render={({ field }) => (
              <div className="flex flex-col gap-2 w-full">
                {field.value.map((requirement, index) => (
                  <Collapsible key={index} className="flex flex-col gap-4 p-4 border rounded-md" defaultOpen>
                    <div className="flex items-center justify-between">
                      <div className="flex gap-2 jusify-start items-center">
                        <CollapsibleTrigger asChild>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                          >
                            <ChevronsUpDown className="h-4 w-4" />
                          </Button>
                        </CollapsibleTrigger>
                        <h4 className="font-medium">Evidence Item #{index + 1}</h4>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          const newValue = [...field.value];
                          newValue.splice(index, 1);
                          field.onChange(newValue);
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    <CollapsibleContent className="flex flex-col gap-2">
                      <div className="flex gap-4">
                        <div className="space-y-2">
                          <FormLabel className="text-sm">Type</FormLabel>
                          <Select
                            value={requirement.type}
                            onValueChange={(value) => {
                              const newValue = [...field.value];
                              newValue[index].type = value;
                              field.onChange(newValue);
                            }}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select evidence type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="screenshot">Screenshot</SelectItem>
                              <SelectItem value="log">Log</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="w-full space-y-2">
                          <FormLabel className="text-sm">Location Hint <span className="text-accent">(Optional)</span></FormLabel>
                          <Input
                            value={requirement.location_hint || ''}
                            onChange={(e) => {
                              const newValue = [...field.value];
                              newValue[index].location_hint = e.target.value;
                              field.onChange(newValue);
                            }}
                            placeholder="Where to find this (e.g. Admin Panel > Settings > Security)"
                          />
                        </div>
                      </div>

                      <div className="w-full space-y-2">
                        <FormLabel className="text-sm">Description</FormLabel>
                        <Input
                          value={requirement.description}
                          onChange={(e) => {
                            const newValue = [...field.value];
                            newValue[index].description = e.target.value;
                            field.onChange(newValue);
                          }}
                          placeholder="Describe what needs to be shown"
                        />
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                ))}
              </div>
            )}
          />
        </ScrollArea>
        <Separator />
        <div className="flex justify-end gap-3">
          <RouteButton variant="outline" route={`/systems/${system.id}?tab=controls`}>
            Cancel
          </RouteButton>
          <SubmitButton variant="default" pendingText="Creating Control..." pending={pending}>
            Create Control
          </SubmitButton>
        </div>
      </form>
    </Form>
  );
}