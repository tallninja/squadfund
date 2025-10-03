
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
import { useSquad } from "@/context/squad-context";
import { CreateSquadDialog } from "./create-squad-dialog";

export function SquadSwitcher() {
  const [open, setOpen] = React.useState(false);
  const { activeSquad, setActiveSquad, availableSquads } = useSquad();

  const handleSelectSquad = (squadId: string) => {
    if (squadId === "all-squads") {
      setActiveSquad(null);
    } else {
      const selectedSquad =
        availableSquads.find((squad) => squad.id === squadId) ?? null;
      setActiveSquad(selectedSquad);
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
          {activeSquad
            ? activeSquad.name
            : "All Squads"}
          <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[250px] p-0">
        <Command>
          <CommandList>
            <CommandInput placeholder="Search squad..." />
            <CommandEmpty>No squad found.</CommandEmpty>
            <CommandGroup>
              <CommandItem
                onSelect={() => handleSelectSquad("all-squads")}
                className="text-sm"
              >
                <Landmark className="mr-2 h-4 w-4" />
                All Squads
                <Check
                  className={cn(
                    "ml-auto h-4 w-4",
                    !activeSquad ? "opacity-100" : "opacity-0"
                  )}
                />
              </CommandItem>
              {availableSquads.map((squad) => (
                <CommandItem
                  key={squad.id}
                  onSelect={() => handleSelectSquad(squad.id)}
                  className="text-sm"
                >
                  <Landmark className="mr-2 h-4 w-4" />
                  {squad.name}
                  <Check
                    className={cn(
                      "ml-auto h-4 w-4",
                      activeSquad?.id === squad.id
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
                <CreateSquadDialog fromCommand />
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
