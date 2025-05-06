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
} from "@/lib/components/ui/alert-dialog";
import { Input } from "@/lib/components/ui/input";
import { createControlFormSchema, CreateControlFormValues } from "@/lib/schema/forms";
import RouteButton from "@/lib/components/ui/protected/route-button";
import { SubmitButton } from "@/lib/components/submit-button";
import { startTransition, useActionState, useEffect, useState } from "react";
import { NSTFunctions, NSTSubcategories, Systems } from "@/lib/schema/database";
import { Separator } from "@/lib/components/ui/separator";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "../ui/select";
import { Textarea } from "../ui/textarea";
import { FormState } from "@/lib/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import ControlEvidenceTab from "../tabs/control-evidence-tab";
import ControlNistTab from "../tabs/control-nist-tab";

type Props = {
  system: Systems;
  nst_subcategories: NSTSubcategories[];
  action: (
    _prevState: any,
    params: FormData
  ) => Promise<FormState<CreateControlFormValues>>;
};

export default function CreateControlForm({ system, nst_subcategories, action }: Props) {
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
      evidence_requirements: JSON.parse(String(state.values.evidence_requirements || "[]")) || [],
      nst_subcategories: JSON.parse(String(state.values.nst_subcategories || "[]")) || [],
    }
  });

  return (
    <Form {...form}>
      <form className="flex flex-col size-full gap-4" onSubmit={form.handleSubmit((data) => {
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
        formData.append('nst_subcategories', JSON.stringify(data.nst_subcategories));

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
        <div className="flex gap-4 size-full">
          <div className="flex flex-col gap-4 w-1/3 h-fit">
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
            </div>
            <div className="flex flex-col gap-4">
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
          <Separator orientation="vertical" />
          <Tabs defaultValue="evidence" className="flex size-full">
            <TabsList>
              <TabsTrigger value="evidence">Evidence Required</TabsTrigger>
              <TabsTrigger value="nist">NIST Categories</TabsTrigger>
            </TabsList>
            <ControlEvidenceTab form={form} />
            <ControlNistTab form={form} nst_subcategories={nst_subcategories} />
          </Tabs>
        </div>
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