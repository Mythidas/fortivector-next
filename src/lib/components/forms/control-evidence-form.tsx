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
import { controlEvidenceFormSchema, ControlEvidenceFormValues } from "@/lib/schema/forms";
import { startTransition, useActionState, useEffect, useRef, useState } from "react";
import { FormFooterProps, FormState } from "@/lib/types";
import FormAlert from "../ux/form-alert";
import FormFooter from "@/lib/components/ux/form-footer";
import { ControlEvidence, ControlEvidenceRequirements } from "@/lib/schema/database/controls";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/lib/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/lib/components/ui/select";
import { Label } from "@/lib/components/ui/label";
import { FileImage } from "lucide-react";
import { Button } from "@/lib/components/ui/button";
import { Separator } from "@/lib/components/ui/separator";
import { useUser } from "@/lib/context/user-context";

type Props = {
  evidence: ControlEvidence;
  requirements: ControlEvidenceRequirements[];
  footer: FormFooterProps;
  action: (
    _prevState: any,
    params: FormData
  ) => Promise<FormState<ControlEvidenceFormValues>>;
};

export default function ControlEvidenceForm({ evidence, requirements, footer, action }: Props) {
  const [state, formAction] = useActionState(action, { success: true, values: {} });
  const [pending, setPending] = useState(false);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const context = useUser();

  useEffect(() => {
    setPending(false);
  }, [state])

  const form = useForm<ControlEvidenceFormValues>({
    resolver: zodResolver(controlEvidenceFormSchema),
    defaultValues: {
      ...evidence,
      ...state.values,
    }
  });

  function pascalCase(str: string) {
    return str[0].toUpperCase() + str.substring(1);
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Create a preview for images
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = () => {
          setFilePreview(reader.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        setFilePreview(null);
      }
    }
  };

  const fileInputRef = useRef<HTMLInputElement>(null);

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <Form {...form}>
      <form className="space-y-6" onSubmit={form.handleSubmit((data) => {
        setPending(true);
        const formData = new FormData();

        formData.append('id', evidence.id);
        formData.append('tenant_id', data.tenant_id);
        formData.append('site_control_id', data.site_control_id);
        formData.append('evidence_requirement_id', data.evidence_requirement_id || "");
        formData.append('name', data.name);
        formData.append('description', data.description);
        formData.append('uploaded_by', context?.id || "");

        if (fileInputRef.current?.files?.length) {
          formData.append('evidence_obj', fileInputRef.current.files[0]);
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
              Choose a requirement and upload supporting evidence
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col gap-4 w-full">
              <FormField
                control={form.control}
                name="evidence_requirement_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Select Requirement</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Choose a requirement..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="adhoc">AdHoc</SelectItem>
                        {requirements.map((req) => (
                          <SelectItem key={req.id} value={req.id}>
                            {req.description}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Show selected requirement details */}
              {form.watch("evidence_requirement_id") &&
                !(form.getValues("evidence_requirement_id") === "adhoc") && (
                  <div className="flex gap-2 w-full">
                    <div className="flex flex-col gap-2">
                      <Label>Type</Label>
                      <Input disabled defaultValue={pascalCase(requirements.find(r => r.id === form.watch("evidence_requirement_id"))?.requirement_type || "")} />
                    </div>
                    <div className="flex flex-col gap-2 w-full">
                      <Label>Location Hint</Label>
                      <Input disabled defaultValue={requirements.find(r => r.id === form.watch("evidence_requirement_id"))?.location_hint} />
                    </div>
                  </div>
                )}
            </div>

            <Separator className="my-6" />

            {/* Evidence Name and Description */}
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Evidence Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Password Policy Screenshot" {...field} />
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
                      <Textarea
                        placeholder="Describe this evidence and its relevance..."
                        {...field}
                        value={field.value || ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Separator className="my-6" />

            {/* Upload Section */}
            <div className="space-y-4">
              <div>
                <FormLabel className="text-base">Upload Evidence</FormLabel>
                <FormDescription>
                  Select the type of evidence you want to upload
                </FormDescription>
              </div>

              {/* File Upload Area */}
              <div className="mt-4">
                <div className="flex flex-col items-center justify-center w-full">
                  <input
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    accept="image/*,.pdf,.doc,.docx"
                    onChange={handleFileChange}
                  />

                  <div
                    onClick={triggerFileInput}
                    className={`flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-muted/50 hover:bg-muted/70 ${filePreview ? 'border-primary' : 'border-border'
                      }`}
                  >
                    {filePreview ? (
                      <div className="w-full h-full p-4 flex flex-col items-center justify-center">
                        <img src={filePreview} alt="Preview" className="max-h-40 max-w-full object-contain mb-2" />
                        <div className="text-sm font-medium mt-2">File selected</div>
                        <Button
                          variant="outline"
                          size="sm"
                          className="mt-2"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (fileInputRef.current) {
                              fileInputRef.current.value = '';
                            }
                            setFilePreview(null);
                          }}
                        >
                          Change file
                        </Button>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <FileImage className="w-12 h-12 text-muted-foreground mb-4" />
                        <p className="mb-2 text-sm text-center">
                          <span className="font-semibold">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs text-muted-foreground text-center">
                          Images, PDF, or document files (max. 10MB)
                        </p>
                      </div>
                    )}
                  </div>
                </div>
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