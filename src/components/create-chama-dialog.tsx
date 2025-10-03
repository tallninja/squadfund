
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { createChama } from "@/lib/api";
import { PlusCircle } from "lucide-react";
import { CommandItem } from "@/components/ui/command";
import { useChama } from "@/context/chama-context";

const formSchema = z.object({
  name: z.string().min(3, "Chama name must be at least 3 characters long."),
});

export function CreateChamaDialog({ fromCommand }: { fromCommand?: boolean }) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const { refreshChamas } = useChama();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
        await createChama(values.name);

        toast({
            title: "Chama Created!",
            description: `"${values.name}" has been successfully created.`,
        });

        // Refresh the chamas list in the context
        refreshChamas();
        setOpen(false);
        form.reset();
        // router.refresh() is not needed if context handles the state
    } catch (error) {
        console.error("Failed to create chama:", error);
        toast({
            variant: "destructive",
            title: "Error",
            description: "Failed to create the chama. Please try again.",
        });
    }
  }

  const TriggerComponent = fromCommand ? (
     <CommandItem
        onSelect={() => setOpen(true)}
        className="text-sm"
      >
        <PlusCircle className="mr-2 h-4 w-4" />
        Create Chama
      </CommandItem>
  ) : (
    <DialogTrigger asChild>
      <Button>
        <PlusCircle className="mr-2 h-4 w-4" />
        Create Chama
      </Button>
    </DialogTrigger>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {TriggerComponent}
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create a New Chama</DialogTitle>
          <DialogDescription>
            Enter a name for your new savings group. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Chama Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Uhuru Savings" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? 'Saving...' : 'Save Chama'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
