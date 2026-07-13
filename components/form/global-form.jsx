"use client";
import { FormProvider, useForm } from "react-hook-form";
import {
  FieldAiButton,
  FormCheckbox,
  FormDate,
  FormEditor,
  FormImageUpload,
  FormImageUploadAWS,
  FormInputNew,
  FormInputTagField,
  FormMultiInput,
  FormRadio,
  FormSelect,
  FormStepForm,
  FormSwitch,
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
    shouldUnregister: false,
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

  // based on the dependent field we have to change the current field value with logic
  const dependentFields = (fields) => {
    let deps = [];
    fields.forEach((section) => {
      section.fields.forEach((field) => {
        if (field.dependentOn && field.generateValue) {
          deps.push(field);
        }
      });
    });
    return deps;
  };

  // dependentFields.forEach((field) => {
  //   const dependentValue = watchField[field.dependentOn];
  //   if (dependentValue !== undefined) {
  //     if (field.generateValue) {
  //       const newValue = field.generateValue(dependentValue);
  //       if (watchField[field.name] !== newValue) {
  //         method.setValue(field.name, newValue);
  //       }
  //     }
  //   }
  // });

  return (
    <FormProvider {...method}>
      <form onSubmit={method.handleSubmit(onSubmit)} className="space-y-6">
        {groupedFields.map((section, index) => {
          const visible = filterVisibleFields(section.fields);
          const rows = groupIntoRows(visible);
          const deps = dependentFields([section]);
          deps.forEach((field) => {
            const dependentValue = watchField[field.dependentOn];
            if (dependentValue !== undefined) {
              if (field.generateValue) {
                const newValue = field.generateValue(dependentValue);
                if (watchField[field.name] !== newValue) {
                  if (typeof newValue !== "undefined")
                    method.setValue(field.name, newValue);
                }
              }
            }
          });
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
                      {field.type === "select" && <FormSelect field={field} />}
                      {field.type === "checkbox" && (
                        <FormCheckbox field={field} />
                      )}
                      {field.type === "textarea" && (
                        <FormTextarea field={field} />
                      )}
                      {field.type === "date" && <FormDate field={field} />}
                      {field.type === "image" && (
                        <FormImageUploadAWS field={field} />
                      )}
                      {field.type === "tag" && (
                        <FormInputTagField field={field} />
                      )}
                      {field.type === "richtext" && (
                        <FormEditor field={field} />
                      )}
                      {field.type === "switch" && <FormSwitch field={field} />}
                      {field.type === "multiple" && (
                        <>
                          <FormMultiInput field={field} />
                          {/* Field Ai for generating the AI Headline */}
                          {field.ai && <FieldAiButton field={field} />}
                        </>
                      )}
                      {field.type === "custom" && field.component && (
                        <field.component {...field.props} />
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
