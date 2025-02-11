"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createInnovationRequest } from "@/lib/server/appwrite";
import { AlertCircle } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const formSchema = z.object({
  title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
  company: z.string().min(2, {
    message: "Company must be at least 2 characters.",
  }),
  briefDescription: z.string().max(500, {
    message: "Brief description must be maximum 500 characters.",
  }),
  detailedDescription: z.string().max(1500, {
    message: "Detailed description must be maximum 1500 characters.",
  }),
  expectedExpertise: z.string().max(1500, {
    message: "Expected expertise must be maximum 1500 characters.",
  }),
  expectedTimeline: z.string().max(1500, {
    message: "Expected timeline must be maximum 1500 characters.",
  }),
  budget: z.number().min(500, {
    message: "Budget must be at least 500€",
  }),
  concept: z.string(),
  field: z.string(),
  marketingConsent: z.boolean(),
  ecologyConsent: z.boolean().refine((val) => val === true, {
    message: "You must confirm that your innovation has no harmful effects on ecology and humans",
  }),
});

export default function InnovationPage() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      company: "",
      briefDescription: "",
      detailedDescription: "",
      expectedExpertise: "",
      expectedTimeline: "",
      budget: 0,
      concept: "",
      field: "",
      marketingConsent: false,
      ecologyConsent: false,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      await createInnovationRequest(values);
      // Handle success
    } catch (error) {
      console.error(error);
      // Handle error
    }
  }

  return (
    <div className="mx-auto py-8">
      <Card className="mx-auto">
        <CardHeader>
          <CardTitle>Innovation Request</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center gap-2">
                      <FormLabel className={form.formState.errors.title ? "text-destructive" : ""}>
                        Title
                      </FormLabel>
                      {form.formState.errors.title && (
                        <TooltipProvider delayDuration={0}>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <AlertCircle className="h-4 w-4 text-destructive cursor-pointer" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>{form.formState.errors.title.message}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}
                    </div>
                    <FormControl>
                      <Input placeholder="Title" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="company"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center gap-2">
                      <FormLabel className={form.formState.errors.company ? "text-destructive" : ""}>
                        Company
                      </FormLabel>
                      {form.formState.errors.company && (
                        <TooltipProvider delayDuration={0}>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <AlertCircle className="h-4 w-4 text-destructive cursor-pointer" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>{form.formState.errors.company.message}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}
                    </div>
                    <FormControl>
                      <Input placeholder="Company" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="briefDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Brief Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Description of the Innovation requested here, maximum 500 words"
                        {...field} 
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="detailedDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Detailed Innovation Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Description of the features of innovation, technical requirements, supporting data, and diagrams"
                        {...field} 
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="expectedExpertise"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Expected Expertise</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Description of expertise, with related or similar cases and skills"
                        {...field} 
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="expectedTimeline"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Expected Timeline</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Innovation timeline description"
                        {...field} 
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="budget"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center gap-2">
                      <FormLabel className={form.formState.errors.budget ? "text-destructive" : ""}>
                        Budget
                      </FormLabel>
                      {form.formState.errors.budget && (
                        <TooltipProvider delayDuration={0}>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <AlertCircle className="h-4 w-4 text-destructive cursor-pointer" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>{form.formState.errors.budget.message}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}
                    </div>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="Estimated budget in €" 
                        {...field} 
                        onChange={e => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="concept"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Concept</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select one..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="concept1">Concept 1</SelectItem>
                        <SelectItem value="concept2">Concept 2</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="field"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Field</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select one..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="field1">Field 1</SelectItem>
                        <SelectItem value="field2">Field 2</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="marketingConsent"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>
                        I want to stay in the loop on the latest and receive marketing communications.
                      </FormLabel>
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="ecologyConsent"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="flex items-center gap-2">
                      <FormLabel className={form.formState.errors.ecologyConsent ? "text-destructive" : ""}>
                        I accept my innovation does not have a harmful effect on ecology and humans.
                      </FormLabel>
                      {form.formState.errors.ecologyConsent && (
                        <TooltipProvider delayDuration={0}>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <AlertCircle className="h-4 w-4 text-destructive cursor-pointer" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>{form.formState.errors.ecologyConsent.message}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}
                    </div>
                  </FormItem>
                )}
              />

              <div className="flex justify-end pt-4">
                <Button type="submit">Submit</Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}