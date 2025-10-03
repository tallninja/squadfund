
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
import { createSquad } from "@/lib/api";
import { PlusCircle } from "lucide-react";
import { CommandItem } from "@/components/ui/command";
import { useSquad } from "@/context/squad-context";

const formSchema = z.object({
  name: z.string().min(3, "Squad name must be at least 3 characters long."),
});

export function CreateSquadDialog({ fromCommand }: { fromCommand?: boolean }) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const { refreshSquads } = useSquad();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
        await createSquad(values.name);

        toast({
            title: "Squad Created!",
            description: `"${values.name}" has been successfully created.`,
        });

        // Refresh the squads list in the context
        refreshSquads();
        setOpen(false);
        form.reset();
        // router.refresh() is not needed if context handles the state
    } catch (error) {
        console.error("Failed to create squad:", error);
        toast({
            variant: "destructive",
            title: "Error",
            description: "Failed to create the squad. Please try again.",
        });
    }
  }

  const TriggerComponent = fromCommand ? (
     <CommandItem
        onSelect={() => {
            form.reset(); 
            setOpen(true)
        }}
        className="text-sm"
      >
        <PlusCircle className="mr-2 h-4 w-4" />
        Create Squad
      </CommandItem>
  ) : (
    <DialogTrigger asChild>
      <Button>
        <PlusCircle className="mr-2 h-4 w-4" />
        Create Squad
      </Button>
    </DialogTrigger>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {TriggerComponent}
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create a New Squad</DialogTitle>
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
                  <FormLabel>Squad Name</FormLabel>
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
                {form.formState.isSubmitting ? 'Saving...' : 'Save Squad'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
