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
import { siteSystemLinkFormSchema, SiteSystemLinkFormValues } from "@/lib/schema/forms";
import RouteButton from "@/lib/components/ux/route-button";
import { SubmitButton } from "@/lib/components/ux/submit-button";
import { startTransition, useActionState, useEffect, useState } from "react";
import { FormState } from "@/lib/types";
import { Popover, PopoverContent, PopoverTrigger } from "@/lib/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/lib/components/ui/command";
import { Checkbox } from "@/lib/components/ui/checkbox";
import { Badge } from "@/lib/components/ui/badge";
import { ChevronsUpDown, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import FormAlert from "../ux/form-alert";
import { Sites } from "@/lib/schema/database/clients";
import { Systems } from "@/lib/schema/database/systems";

type Props = {
  site: Sites;
  systems: Systems[];
  action: (
    _prevState: any,
    params: FormData
  ) => Promise<FormState<SiteSystemLinkFormValues>>;
};

export default function SystemLinkForm({ site, systems, action }: Props) {
  const [state, formAction] = useActionState(action, { success: true, values: {} });
  const [pending, setPending] = useState(false);

  useEffect(() => {
    setPending(false);
  }, [state])

  const form = useForm<SiteSystemLinkFormValues>({
    resolver: zodResolver(siteSystemLinkFormSchema),
    defaultValues: {
      tenant_id: site.tenant_id,
      site_id: site.id,
      system_id: [],
    }
  });

  return (
    <Form {...form}>
      <form className="space-y-6" onSubmit={form.handleSubmit((data) => {
        setPending(true);
        const formData = new FormData();
        formData.append('tenant_id', site.tenant_id)
        formData.append('site_id', site.id);
        formData.append('system_id', JSON.stringify(data.system_id));

        startTransition(() => {
          formAction(formData);
        })
      })}>
        <FormAlert errors={state.errors} />
        <FormField
          control={form.control}
          name="system_id"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Select Systems</FormLabel>
              <FormDescription>Choose systems to link to this site</FormDescription>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      className={cn(
                        "w-full justify-between",
                        !field.value.length && "text-muted-foreground"
                      )}
                    >
                      {field.value.length > 0
                        ? `${field.value.length} system${field.value.length > 1 ? "s" : ""} selected`
                        : "Select systems"}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0" align="start">
                  <Command className="w-full">
                    <CommandInput placeholder="Search systems..." />
                    <CommandEmpty>No systems found.</CommandEmpty>
                    <CommandList>
                      <CommandGroup className="max-h-[300px] overflow-auto">
                        {systems.map((system) => (
                          <CommandItem
                            key={system.id}
                            onSelect={() => {
                              const updatedValue = field.value.includes(system.id)
                                ? field.value.filter(id => id !== system.id)
                                : [...field.value, system.id];
                              field.onChange(updatedValue);
                            }}
                          >
                            <div className="flex items-center gap-2 w-full">
                              <Checkbox
                                checked={field.value.includes(system.id)}
                                className="mr-2"
                                id={`system-${system.id}`}
                              />
                              <div className="flex flex-col">
                                <span>{system.name}</span>
                                {system.description && (
                                  <span className="text-xs text-muted-foreground">{system.description}</span>
                                )}
                              </div>
                            </div>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                    {field.value.length > 0 && (
                      <div className="flex items-center justify-between p-2 border-t">
                        <span className="text-sm text-muted-foreground">
                          {field.value.length} selected
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => field.onChange([])}
                        >
                          Clear all
                        </Button>
                      </div>
                    )}
                  </Command>
                </PopoverContent>
              </Popover>
              <div className="flex flex-wrap gap-1 mt-2">
                {field.value.map((systemId) => {
                  const system = systems.find(s => s.id === systemId);
                  return system ? (
                    <Badge
                      key={system.id}
                      variant="secondary"
                      className="flex items-center gap-1"
                    >
                      {system.name}
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-4 w-4 p-0 hover:bg-transparent"
                        onClick={() => {
                          field.onChange(field.value.filter(id => id !== system.id));
                        }}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ) : null;
                })}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end gap-3">
          <RouteButton variant="outline" type="button" route={`/clients/site/${site.id}?tab=systems`}>
            Cancel
          </RouteButton>
          <SubmitButton variant="default" pendingText="Linking systems..." pending={pending}>
            Link Systems
          </SubmitButton>
        </div>
      </form>
    </Form>
  );
}