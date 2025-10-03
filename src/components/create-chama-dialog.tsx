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
import { chamas } from "@/lib/mock-data";
import { PlusCircle } from "lucide-react";
import { CommandItem } from "@/components/ui/command";

const formSchema = z.object({
  name: z.string().min(3, "Chama name must be at least 3 characters long."),
});

export function CreateChamaDialog() {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    // This is where you would typically call an API to create the chama.
    // For now, we'll just add it to our mock data.
    const newChama = {
      id: `chama-${chamas.length + 1}`,
      name: values.name,
      createdAt: new Date().toISOString().split("T")[0],
    };

    chamas.push(newChama);

    toast({
      title: "Chama Created!",
      description: `"${values.name}" has been successfully created.`,
    });

    setOpen(false);
    form.reset();
    // Refresh the page to show the new chama in the list
    router.refresh();
  }
  
  const isCommandItem = !!(
    typeof window !== "undefined" &&
    window.document.querySelector('[role="combobox"]')
  );


  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
       {isCommandItem ? (
          <CommandItem
            onSelect={() => setOpen(true)}
            className="text-sm"
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Create Chama
          </CommandItem>
        ) : (
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Create Chama
        </Button>
        )}
      </DialogTrigger>
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
              <Button type="submit">Save Chama</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
