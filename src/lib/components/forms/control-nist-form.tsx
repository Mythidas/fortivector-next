'use client';

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormField,
  FormItem,
  FormMessage,
} from "@/lib/components/ui/form";
import { Input } from "@/lib/components/ui/input";
import { controlNstFormSchema, ControlNstFormValues } from "@/lib/schema/forms";
import RouteButton from "@/lib/components/ux/route-button";
import { SubmitButton } from "@/lib/components/ux/submit-button";
import { startTransition, useActionState, useState } from "react";
import { Controls, ControlsToNSTSubcategories, NSTSubcategories } from "@/lib/schema/database";
import { FormFooterProps, FormState } from "@/lib/types";
import FormAlert from "../ux/form-alert";
import { ScrollArea } from "@/lib/components/ui/scroll-area";
import { Button } from "@/lib/components/ui/button";
import { ChevronsUpDown, X } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/lib/components/ui/collapsible";
import { Badge } from "../ui/badge";
import { Checkbox } from "../ui/checkbox";

type Props = {
  control: Controls;
  control_subcats: ControlsToNSTSubcategories[];
  nst_subcategories: NSTSubcategories[];
  action: (
    _prevState: any,
    params: FormData
  ) => Promise<FormState<ControlNstFormValues>>;
} & FormFooterProps;

export default function ControlNISTForm({ control, nst_subcategories, control_subcats, cancel_route, submit_text, pending_text, action }: Props) {
  const [state, formAction] = useActionState(action, { success: true, values: {} });
  const [pending, setPending] = useState(false);
  const [search, setSearch] = useState("");

  const form = useForm<ControlNstFormValues>({
    resolver: zodResolver(controlNstFormSchema),
    defaultValues: {
      control_id: control.id,
      system_id: control.system_id,
      tenant_id: control.tenant_id,
      nst_subcategories: state.values.nst_subcategories ? JSON.parse(String(state.values.nst_subcategories)) : control_subcats.map((row) => row.subcategory_id)
    }
  });

  const filteredSubcategories = nst_subcategories.filter((nst) => {
    const q = search.toLowerCase();
    return nst.code.toLowerCase().includes(q) || nst.description.toLowerCase().includes(q);
  });

  function getFunction(categoryId: string): string {
    return {
      GV: "Govern",
      ID: "Identify",
      PR: "Protect",
      DE: "Detect",
      RS: "Respond",
      RC: "Recover"
    }[categoryId] || categoryId;
  }

  const grouped = filteredSubcategories.reduce((acc, sub) => {
    const cat = sub.code.split('.')[0];
    if (!acc[cat]) acc[cat] = { name: getFunction(cat), items: [] };
    acc[cat].items.push(sub);
    return acc;
  }, {} as Record<string, { name: string; items: NSTSubcategories[] }>);

  return (
    <Form {...form}>
      <form className="space-y-6" onSubmit={form.handleSubmit((data) => {
        setPending(true);
        const formData = new FormData();
        formData.append('tenant_id', control.tenant_id);
        formData.append('control_id', control.id);
        formData.append('system_id', control.system_id);
        formData.append('nst_subcategories', JSON.stringify(data.nst_subcategories));

        startTransition(() => {
          formAction(formData);
        })
      })}>
        <FormAlert errors={state.errors} />
        <div className="flex flex-col w-full h-fit gap-2">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">NIST CSF Categories</h3>
            <div className="text-xs text-muted-foreground">
              Select subcategories this control satisfies
            </div>
          </div>
          <Input
            placeholder="Search subcategories..."
            type="search"
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <ScrollArea className="h-[500px] w-full pr-4 overflow-clip">
          <FormField
            control={form.control}
            name="nst_subcategories"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormMessage />

                {Object.entries(grouped).map(([categoryId, category]) => (
                  <Collapsible key={categoryId} className="border rounded-md">
                    <CollapsibleTrigger className="flex items-center justify-between w-full p-3 hover:bg-accent/10 rounded-t-md">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="font-mono">{categoryId}</Badge>
                        <span className="font-medium">{category.name}</span>
                      </div>
                      <ChevronsUpDown className="h-4 w-4 text-muted-foreground" />
                    </CollapsibleTrigger>
                    <CollapsibleContent className="p-3 pt-0">
                      <div className="border-t mt-1 pt-2 space-y-1">
                        {category.items.map((subcategory) => (
                          <div
                            key={subcategory.id}
                            className={`flex items-center justify-between p-2 rounded-md ${field.value?.find((row) => subcategory.id === row) ? 'bg-primary/10' : 'hover:bg-accent/10'
                              }`}
                          >
                            <div className="flex-1 flex items-center gap-2">
                              <Badge variant="outline" className="font-mono text-xs">
                                {subcategory.code}
                              </Badge>
                              <span className="text-sm">{subcategory.description}</span>
                            </div>
                            <Checkbox
                              checked={field.value?.find((row) => subcategory.id === row) !== undefined}
                              onCheckedChange={(checked) => {
                                const currentValue = field.value || [];
                                if (checked && !currentValue.find((row) => subcategory.id === row)) {
                                  field.onChange([...currentValue, subcategory.id]);
                                } else if (!checked) {
                                  field.onChange(currentValue.filter(id => id !== subcategory.id));
                                }
                              }}
                            />
                          </div>
                        ))}
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                ))}
              </FormItem>
            )}
          />
        </ScrollArea>

        <FormField
          control={form.control}
          name="nst_subcategories"
          render={({ field }) => (
            <div className="mt-2">
              <div className="text-sm font-medium mb-1">
                Selected: {(field.value || []).length}
              </div>
              <div className="flex flex-wrap gap-1">
                {(field.value || []).map((row) => {
                  const sub = nst_subcategories.find((x) => x.id === row);
                  return (
                    <Badge key={sub?.id} variant="secondary" className="flex items-center gap-1">
                      {sub?.code}
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-4 w-4 p-0 ml-1 hover:bg-destructive/20 rounded-full"
                        onClick={() => field.onChange((field.value || []).filter(x => x !== row))}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  );
                })}
                {(field.value || []).length === 0 && (
                  <span className="text-xs text-muted-foreground">
                    No subcategories selected
                  </span>
                )}
              </div>
            </div>
          )}
        />
        <div className="flex justify-end gap-3">
          {cancel_route &&
            <RouteButton variant="outline" route={cancel_route}>
              Cancel
            </RouteButton>
          }
          <SubmitButton variant="default" pendingText={pending_text} pending={pending}>
            {submit_text}
          </SubmitButton>
        </div>
      </form>
    </Form >
  );
}