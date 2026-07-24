"use client";
import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Check, Plus } from "lucide-react";
import FormLabel from "@/components/form/form-label";

// Category input with existing-category suggestions so authors reuse the
// shared taxonomy instead of creating near-duplicates ("Tech" vs "tech").
export function CategoryField({ categories = [] }) {
  const {
    register,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext();

  const value = (watch("category") || "").trim();
  const lowerValue = value.toLowerCase();

  const exactMatch = categories.find((c) => c.toLowerCase() === lowerValue);
  const suggestions = value
    ? categories.filter((c) => c.toLowerCase().includes(lowerValue))
    : categories;

  return (
    <div className="space-y-2">
      <FormLabel name="category" labelText="Category" />
      <Input
        id="category"
        placeholder="Pick an existing category or type a new one"
        className={`h-11 ring-inset focus-visible:ring-1 focus-visible:ring-indigo-600 focus:ring-indigo-600 focus:ring-1 outline-none appearance-none font-medium font-grotesk ${
          errors.category ? "border-red-500" : ""
        }`}
        {...register("category", {
          required: "Category is required",
          minLength: { value: 3, message: "Minimum 3 characters required" },
          maxLength: { value: 50, message: "Maximum 50 characters allowed" },
        })}
      />

      {categories.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          <span className="text-xs text-neutral-500 mr-1">
            Existing categories:
          </span>
          {suggestions.map((category) => {
            const isSelected = category.toLowerCase() === lowerValue;
            return (
              <button
                key={category}
                type="button"
                onClick={() =>
                  setValue("category", category, {
                    shouldValidate: true,
                    shouldDirty: true,
                  })
                }
                className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium transition ${
                  isSelected
                    ? "bg-indigo-600 text-white"
                    : "bg-indigo-50 text-indigo-700 hover:bg-indigo-100"
                }`}
              >
                {isSelected && <Check className="h-3 w-3" />}
                {category}
              </button>
            );
          })}
          {suggestions.length === 0 && (
            <span className="text-xs text-neutral-400">no match</span>
          )}
        </div>
      )}

      {value &&
        (exactMatch ? (
          <p className="text-xs text-green-600 flex items-center gap-1">
            <Check className="h-3 w-3" />
            Using existing category “{exactMatch}”
          </p>
        ) : (
          <p className="text-xs text-amber-600 flex items-center gap-1">
            <Plus className="h-3 w-3" />
            “{value}” will be created as a new category — check the list above
            first to avoid duplicates
          </p>
        ))}

      {errors.category && (
        <p className="text-sm text-destructive font-grotesk tracking-tight font-medium">
          {errors.category.message}
        </p>
      )}
    </div>
  );
}
