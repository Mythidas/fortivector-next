'use client';

import { useForm, UseFormReturn } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/lib/components/ui/form";
import { Badge } from "@/lib/components/ui/badge";
import { Checkbox } from "@/lib/components/ui/checkbox";
import { Input } from "@/lib/components/ui/input";
import { ScrollArea } from "@/lib/components/ui/scroll-area";
import { Button } from "@/lib/components/ui/button";
import { ChevronsUpDown, X } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/lib/components/ui/collapsible";
import { TabsContent } from "@/lib/components/ui/tabs";
import { ControlFormValues } from "@/lib/schema/forms";
import { useState } from "react";
import { NSTSubcategories } from "@/lib/schema/database";

type Props = {
  form: UseFormReturn<ControlFormValues>;
  nst_subcategories: NSTSubcategories[];
};

export default function ControlNistTab({ form, nst_subcategories }: Props) {
  const [search, setSearch] = useState("");

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
    <TabsContent value="nist" className="flex flex-col size-full gap-2">
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
                          className={`flex items-center justify-between p-2 rounded-md ${field.value?.includes(subcategory.id) ? 'bg-primary/10' : 'hover:bg-accent/10'
                            }`}
                        >
                          <div className="flex-1 flex items-center gap-2">
                            <Badge variant="outline" className="font-mono text-xs">
                              {subcategory.code}
                            </Badge>
                            <span className="text-sm">{subcategory.description}</span>
                          </div>
                          <Checkbox
                            checked={field.value?.includes(subcategory.id)}
                            onCheckedChange={(checked) => {
                              const currentValue = field.value || [];
                              if (checked && !currentValue.includes(subcategory.id)) {
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
              {(field.value || []).map((id) => {
                const sub = nst_subcategories.find((x) => x.id === id);
                return (
                  <Badge key={id} variant="secondary" className="flex items-center gap-1">
                    {sub?.code}
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-4 w-4 p-0 ml-1 hover:bg-destructive/20 rounded-full"
                      onClick={() => field.onChange((field.value || []).filter(x => x !== id))}
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
    </TabsContent>
  );
}
