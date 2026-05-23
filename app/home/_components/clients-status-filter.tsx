"use client";

import { Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import {
  CLIENT_STATUS_OPTIONS,
  type ClientStatus,
} from "../_utils/client-statuses";

type ClientsStatusFilterProps = {
  value: ClientStatus[];
  onChange: (value: ClientStatus[]) => void;
};

export function ClientsStatusFilter({
  value,
  onChange,
}: ClientsStatusFilterProps) {
  function toggleStatus(status: ClientStatus) {
    onChange(
      value.includes(status)
        ? value.filter((item) => item !== status)
        : [...value, status],
    );
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className={cn(
            "relative size-9 shrink-0",
            value.length > 0 && "border-primary text-primary",
          )}
          aria-label="Filtrar por status"
        >
          <Filter className="size-4" />
          {value.length > 0 && (
            <span className="absolute -top-1 -right-1 flex size-4 items-center justify-center rounded-full bg-primary text-[10px] font-semibold text-primary-foreground">
              {value.length}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-56">
        <PopoverHeader>
          <PopoverTitle>Filtrar por status</PopoverTitle>
        </PopoverHeader>
        <div className="flex flex-col gap-3 pt-1">
          {CLIENT_STATUS_OPTIONS.map(({ value: status, label }) => (
            <label
              key={status}
              htmlFor={`status-filter-${status}`}
              className="flex cursor-pointer items-center gap-2"
            >
              <Checkbox
                id={`status-filter-${status}`}
                checked={value.includes(status)}
                onCheckedChange={() => toggleStatus(status)}
              />
              <Label
                htmlFor={`status-filter-${status}`}
                className="cursor-pointer font-normal"
              >
                {label}
              </Label>
            </label>
          ))}
          {value.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="h-8 justify-start px-0 text-muted-foreground"
              onClick={() => onChange([])}
            >
              Limpar filtros
            </Button>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
