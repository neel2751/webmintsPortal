"use client";
import { FormProvider, useForm } from "react-hook-form";
import {
  FormCheckbox,
  FormDate,
  FormImageUpload,
  FormInputNew,
  FormMultiInput,
  FormRadio,
  FormTextarea,
  URLInput,
} from "@/components/form/form-field";
import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";

export function GlobalForm({
  groupedFields, // <-- Now we expect groupedFields directly!
  initialValues,
  onSubmit,
  isLoading,
  btnName,
}) {
  const method = useForm({
    defaultValues: initialValues || {},
    shouldUnregister: true,
  });
  const watchField = method.watch();

  const filterVisibleFields = (fields) =>
    fields.filter((field) => {
      if (field.showIf) {
        const { field: dependentField, value } = field.showIf;
        if (watchField[dependentField] !== value) return false;
      }
      if (field.hideIf) {
        const { field: dependentField, value } = field.hideIf;
        if (watchField[dependentField] === value) return false;
      }
      return true;
    });

  const groupIntoRows = (fields) => {
    const grouped = [];
    for (let i = 0; i < fields.length; ) {
      const current = fields[i];
      if (current.size) {
        grouped.push([current]);
        i++;
      } else {
        const next = fields[i + 1];
        if (next && !next.size) {
          grouped.push([current, next]);
          i += 2;
        } else {
          grouped.push([current]);
          i++;
        }
      }
    }
    return grouped;
  };

  return (
    <FormProvider {...method}>
      <form onSubmit={method.handleSubmit(onSubmit)} className="space-y-6">
        {groupedFields.map((section, index) => {
          const visible = filterVisibleFields(section.fields);
          const rows = groupIntoRows(visible);

          return (
            <div key={index} className="space-y-3">
              <h3 className="text-xl font-medium pb-2 font-grotesk tracking-tight">
                {section.title}
              </h3>

              {rows.map((row, rowIndex) => (
                <div
                  key={rowIndex}
                  className={
                    row.length === 1
                      ? "grid grid-cols-1"
                      : "grid grid-cols-6 gap-4"
                  }
                >
                  {row.map((field, index) => (
                    <div
                      key={index}
                      className={`col-span-6 ${
                        field.size || row.length === 1
                          ? "sm:col-span-6"
                          : "sm:col-span-3"
                      }`}
                    >
                      {field.type === "text" ||
                      field.type === "email" ||
                      field.type === "password" ||
                      field.type === "tel" ||
                      field.type === "number" ? (
                        <FormInputNew field={field} />
                      ) : null}
                      {field.type === "url" && (
                        <URLInput key={field.name} field={field} />
                      )}
                      {field.type === "radio" && <FormRadio field={field} />}
                      {field.type === "checkbox" && (
                        <FormCheckbox field={field} />
                      )}
                      {field.type === "textarea" && (
                        <FormTextarea field={field} />
                      )}
                      {field.type === "date" && <FormDate field={field} />}
                      {field.type === "image" && (
                        <FormImageUpload field={field} />
                      )}
                      {field.type === "multiple" && (
                        <FormMultiInput field={field} />
                      )}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          );
        })}

        <div className="mt-8">
          <Button
            disabled={isLoading}
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-700 w-full"
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin mr-2" />
                <span>Please wait...</span>
              </>
            ) : (
              <span>{btnName ? btnName : "Submit"}</span>
            )}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}
