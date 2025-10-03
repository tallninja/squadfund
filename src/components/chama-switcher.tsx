"use client";

import * as React from "react";
import { Check, ChevronsUpDown, Landmark, PlusCircle } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useChama } from "@/context/chama-context";
import { CreateChamaDialog } from "./create-chama-dialog";

export function ChamaSwitcher() {
  const [open, setOpen] = React.useState(false);
  const { activeChama, setActiveChama, availableChamas } = useChama();

  const handleSelectChama = (chamaId: string) => {
    if (chamaId === "all-chamas") {
      setActiveChama(null);
    } else {
      const selectedChama =
        availableChamas.find((chama) => chama.id === chamaId) ?? null;
      setActiveChama(selectedChama);
    }
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[250px] justify-between"
        >
          <Landmark className="mr-2 h-4 w-4" />
          {activeChama
            ? activeChama.name
            : "All Chamas"}
          <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[250px] p-0">
        <Command>
          <CommandList>
            <CommandInput placeholder="Search chama..." />
            <CommandEmpty>No chama found.</CommandEmpty>
            <CommandGroup>
              <CommandItem
                onSelect={() => handleSelectChama("all-chamas")}
                className="text-sm"
              >
                <Landmark className="mr-2 h-4 w-4" />
                All Chamas
                <Check
                  className={cn(
                    "ml-auto h-4 w-4",
                    !activeChama ? "opacity-100" : "opacity-0"
                  )}
                />
              </CommandItem>
              {availableChamas.map((chama) => (
                <CommandItem
                  key={chama.id}
                  onSelect={() => handleSelectChama(chama.id)}
                  className="text-sm"
                >
                  <Landmark className="mr-2 h-4 w-4" />
                  {chama.name}
                  <Check
                    className={cn(
                      "ml-auto h-4 w-4",
                      activeChama?.id === chama.id
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
          <CommandSeparator />
          <CommandList>
            <CommandGroup>
                <CreateChamaDialog fromCommand />
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
