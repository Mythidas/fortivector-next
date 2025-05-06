'use client';

import { zodResolver } from "@hookform/resolvers/zod";
import { UseFormReturn } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/lib/components/ui/form";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/lib/components/ui/select";
import { ScrollArea } from "@/lib/components/ui/scroll-area";
import { Button } from "@/lib/components/ui/button";
import { ChevronsUpDown, Plus, Trash2, X } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/lib/components/ui/collapsible";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/lib/components/ui/tabs";
import { CreateControlFormValues } from "@/lib/schema/forms";
import { Input } from "@/lib/components/ui/input";

type Props = {
  form: UseFormReturn<CreateControlFormValues>
}

export default function ControlEvidenceTab({ form }: Props) {
  return (
    <TabsContent value="evidence" className="flex flex-col gap-2 size-full">
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
      <ScrollArea className="h-[600px] w-full overflow-clip">
        <FormField
          control={form.control}
          name="evidence_requirements"
          render={({ field }) => (
            <FormItem className="flex flex-col gap-2 w-full">
              <FormMessage />
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
            </FormItem>
          )}
        />
      </ScrollArea>
    </TabsContent>
  );
}