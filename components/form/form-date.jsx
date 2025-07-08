"use client";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format, getMonth, getYear, setMonth, setYear } from "date-fns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CalendarIcon, ChevronDownIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import FormLabel from "./form-label";
import React from "react";
import { Label } from "../ui/label";

function SelectDate({ field, value, onChange, label }) {
  const startYear = getYear(new Date()) - 100;
  const endYear = getYear(new Date()) + 100;

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const years = Array.from(
    { length: endYear - startYear + 1 },
    (_, k) => startYear + k
  );

  const handleMonth = (month) => {
    const newDate = setMonth(value, months.indexOf(month));
    onChange(newDate);
  };
  const handleYear = (year) => {
    if (!value) {
      value = new Date();
    }
    const newDate = setYear(value, parseInt(year));
    onChange(newDate);
  };
  const disabledDateLogic = field?.disabled || (() => false);
  return (
    <div className="space-y-2">
      {label && <FormLabel name={field?.name} labelText={field?.labelText} />}
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            className={cn(
              "w-full justify-start text-left font-normal",
              !value && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {value ? format(value, "PPP") : <span>{field?.placeholder}</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-2 space-y-2">
          <div className="flex gap-2 justify-center">
            <Select
              onValueChange={handleMonth}
              value={months[getMonth(value)] || months[getMonth(new Date())]}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Month" />
              </SelectTrigger>
              <SelectContent>
                {months.map((month) => (
                  <SelectItem value={month} key={month}>
                    {month}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              onValueChange={handleYear}
              value={
                getYear(value).toString() ?? getYear(new Date().toString())
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Year" />
              </SelectTrigger>
              <SelectContent>
                {years.map((year) => (
                  <SelectItem value={year.toString()} key={year}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Calendar
            mode="single"
            selected={value || field?.value}
            onSelect={onChange}
            month={value}
            onMonthChange={onChange}
            initialFocus
            disabled={disabledDateLogic}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}

function SelectDateRange({ field, value, onChange, label }) {
  const disabledDateLogic = field.disabled || (() => false);
  return (
    <div className="space-y-2">
      {label && <FormLabel name={field?.name} labelText={field?.labelText} />}
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            className={cn(
              "w-full justify-start text-left font-normal",
              !value && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {value?.from ? (
              value?.to ? (
                <>
                  {format(value?.from, "LLL dd, y")} -{" "}
                  {format(value?.to, "LLL dd, y")}
                </>
              ) : (
                format(value?.from, "LLL dd, y")
              )
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-2 space-y-2">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={value?.from}
            selected={value || field.value}
            onSelect={onChange}
            numberOfMonths={2}
            disabled={disabledDateLogic}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}

function Calendar22() {
  const [open, setOpen] = React.useState(false);
  const [date, setDate] = React.useState(undefined);

  return (
    <div className="flex flex-col gap-3">
      <Label htmlFor="date" className="px-1">
        Date of birth
      </Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            id="date"
            className="w-48 justify-between font-normal"
          >
            {date ? date.toLocaleDateString() : "Select date"}
            <ChevronDownIcon />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto overflow-hidden p-0" align="start">
          <Calendar
            mode="single"
            selected={date}
            onSelect={(date) => {
              setDate(date);
              setOpen(false);
            }}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}

export { SelectDate, Calendar22 };
