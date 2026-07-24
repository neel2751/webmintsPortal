"use client";
import { Controller, useFormContext } from "react-hook-form";
import { Check, Globe } from "lucide-react";
import FormLabel from "@/components/form/form-label";

// Multi-select website picker: one post can be published to several
// websites, and the public API serves it to each selected site.
export function WebsiteField({ websites = [] }) {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  return (
    <div className="space-y-2">
      <FormLabel name="websiteIds" labelText="Websites" />
      <Controller
        name="websiteIds"
        control={control}
        rules={{
          validate: (value) =>
            (Array.isArray(value) && value.length > 0) ||
            "Select at least one website",
        }}
        render={({ field: { onChange, value } }) => {
          const selected = Array.isArray(value) ? value.map(String) : [];
          const toggle = (id) => {
            onChange(
              selected.includes(id)
                ? selected.filter((s) => s !== id)
                : [...selected, id]
            );
          };
          return (
            <div className="flex flex-wrap gap-2 border rounded-md p-3 shadow-sm bg-white">
              {websites.map((site) => {
                const isSelected = selected.includes(String(site._id));
                return (
                  <button
                    key={site._id}
                    type="button"
                    onClick={() => toggle(String(site._id))}
                    className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium transition border ${
                      isSelected
                        ? "bg-indigo-600 text-white border-indigo-600"
                        : "bg-white text-gray-700 border-gray-200 hover:border-indigo-300 hover:bg-indigo-50"
                    }`}
                  >
                    {isSelected ? (
                      <Check className="h-3.5 w-3.5" />
                    ) : (
                      <Globe className="h-3.5 w-3.5 opacity-50" />
                    )}
                    {site.name}
                    <span
                      className={`text-xs ${
                        isSelected ? "text-indigo-200" : "text-gray-400"
                      }`}
                    >
                      {site.domain}
                    </span>
                  </button>
                );
              })}
              {websites.length === 0 && (
                <span className="text-sm text-neutral-400">
                  No websites yet — ask an admin to add one in the admin panel.
                </span>
              )}
            </div>
          );
        }}
      />
      <p className="text-xs text-muted-foreground">
        The post is published to every selected website
      </p>
      {errors.websiteIds && (
        <p className="text-sm text-destructive font-grotesk tracking-tight font-medium">
          {errors.websiteIds.message}
        </p>
      )}
    </div>
  );
}
