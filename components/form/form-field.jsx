"use client";
import {
  useFormContext,
  Controller,
  useFieldArray,
  useWatch,
} from "react-hook-form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Check, EyeIcon, EyeOffIcon, Minus, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import { Textarea } from "../ui/textarea";
import { SelectDate } from "./form-date";
import FormLabel from "./form-label";
import { useDropzone } from "react-dropzone";
import Image from "next/image";
import { useUploaderNew } from "@/hooks/useUploaderNew";
import { RichTextEditorDemo } from "../editor/tiptap/rich-text-editor";

export const FormInputNew = ({ field, ...props }) => {
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <div className="space-y-2">
      <FormLabel name={field.name} labelText={field.labelText} />
      <div className="relative">
        <Input
          id={field.name}
          className={`h-11 ring-inset focus-visible:ring-1 focus-visible:ring-indigo-600 focus:ring-indigo-600 focus:ring-1 outline-none appearance-none font-medium font-grotesk ${
            errors[field.name] && "border-red-500"
          }`}
          type={
            field?.type === "password"
              ? showPassword
                ? "text"
                : "password"
              : field?.type
          }
          // value check for readOnly fields
          readOnly={field.readOnly || false}
          placeholder={field.placeholder}
          {...register(field.name, {
            ...field.validationOptions,
            // valueAsNumber: field.type === "number",
          })}
          {...props}
        />
        {field?.type === "password" && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? "Hide password" : "Show password"}
            className="absolute right-3 top-1/2 -translate-y-1/2
                    text-zinc-400 hover:text-indigo-600 
                    dark:text-zinc-500 dark:hover:text-zinc-100
                    transition-colors"
          >
            {showPassword ? (
              <EyeIcon className="w-4 h-4" />
            ) : (
              <EyeOffIcon className="w-4 h-4" />
            )}
          </button>
        )}
      </div>
      {field.helperText && (
        <p className="text-xs text-muted-foreground">{field.helperText}</p>
      )}
      {errors[field.name] && <ErrorText field={field} errors={errors} />}
    </div>
  );
};

export const URLInput = ({ field, ...props }) => {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <div className="space-y-2">
      <FormLabel name={field.name} labelText={field.labelText} />
      <div className="flex rounded-lg">
        <span className="inline-flex items-center rounded-s-md border border-input border-r-0 bg-background px-3 text-sm text-muted-foreground font-grotesk font-medium">
          https://
        </span>
        <Input
          id={field.name}
          // className="h-11 ring-inset focus-visible:ring-1 focus-visible:ring-indigo-600 focus:ring-indigo-600 focus:ring-1 outline-none appearance-none"
          className="h-10 ring-inset focus-visible:ring-1 focus-visible:ring-indigo-600 focus:ring-indigo-600 focus:ring-1 outline-none appearance-none rounded-s-none font-grotesk font-medium text-sm"
          type="text"
          placeholder={field.placeholder}
          {...register(field.name, {
            ...field.validationOptions,
            // valueAsNumber: field.type === "number",
          })}
          {...props}
        />
      </div>

      {field.helperText && (
        <p className="text-xs text-muted-foreground">{field.helperText}</p>
      )}
      {errors[field.name] && <ErrorText errors={errors} field={field} />}
    </div>
  );
};

export const FormRadio = ({ field }) => {
  const {
    control,
    formState: { errors },
  } = useFormContext();
  return (
    <div className="space-y-2">
      <FormLabel name={field.name} labelText={field.labelText} />
      <Controller
        name={field.name}
        control={control}
        rules={field.validationOptions}
        render={({ field: { onChange, value } }) => (
          <div className="border mt-1 rounded-md p-2.5 shadow-sm">
            <RadioGroup
              onValueChange={onChange}
              value={value}
              className="flex space-x-4"
            >
              {field.options.map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <RadioGroupItem
                    value={option.value}
                    id={`${field.name}-${option.value}`}
                    // className="border-indigo-600"
                    className={` ${
                      value === option.value ? "border-indigo-600" : ""
                    }`}
                    fill={"fill-indigo-600 text-indigo-600"}
                  />
                  <FormLabel
                    className="text-neutral-700"
                    htmlFor={`${field.name}-${option.value}`}
                  >
                    {option.label}
                  </FormLabel>
                </div>
              ))}
            </RadioGroup>
          </div>
        )}
      />
      {errors[field.name] && <ErrorText errors={errors} field={field} />}
    </div>
  );
};

export const FormSelect = ({ field }) => {
  const {
    control,
    formState: { errors },
  } = useFormContext();
  return (
    <div className="space-y-2">
      <FormLabel name={field.name} labelText={field.labelText} />
      <Controller
        name={field.name}
        control={control}
        rules={field.validationOptions}
        render={({ field: { onChange, value } }) => (
          <Select onValueChange={onChange} value={value || ""}>
            <SelectTrigger
              className={`h-11 w-full font-medium font-grotesk ${
                errors[field.name] ? "border-red-500" : ""
              }`}
            >
              <SelectValue placeholder={field.placeholder} />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      />
      {field.helperText && (
        <p className="text-xs text-muted-foreground">{field.helperText}</p>
      )}
      {errors[field.name] && <ErrorText errors={errors} field={field} />}
    </div>
  );
};

export const FormCheckbox = ({ field }) => {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  return (
    <div className="space-y-2 mt-0.5">
      <div className="flex items-center space-x-2">
        <Controller
          name={field.name}
          control={control}
          rules={field.validationOptions}
          render={({ field: { onChange, value } }) => (
            <Checkbox
              id={field.name}
              checked={!!value}
              // onCheckedChange={onChange}
              onCheckedChange={(checked) => onChange(!!checked)}
              className="
              w-4 h-4 
              border border-indigo-600 
              rounded 
              data-[state=checked]:bg-indigo-600 
              data-[state=checked]:border-indigo-600
              focus:ring-1 focus:ring-indigo-400
            "
            />
          )}
        />

        <FormLabel
          htmlFor={field.name}
          className="text-sm leading-snug tracking-tight font-grotesk text-slate-700"
        >
          {field.labelText}
        </FormLabel>
      </div>
      {errors[field.name] && <ErrorText errors={errors} field={field} />}
    </div>
  );
};

export const FormDate = ({ field }) => {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  return (
    <div className="space-y-2">
      <FormLabel name={field?.name} labelText={field?.labelText} />
      <Controller
        name={field.name}
        control={control}
        rules={field.validationOptions}
        render={({ field: { onChange, value } }) => {
          <SelectDate
            field={field}
            value={value}
            onChange={onChange}
            label={false}
          />;
        }}
      />
      {errors[field.name] && <ErrorText errors={errors} field={field} />}
    </div>
  );
};

export const FormDateRange = ({ field }) => {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  return (
    <div className="space-y-2">
      <FormLabel name={field?.name} labelText={field?.labelText} />
      <Controller
        name={field.name}
        control={control}
        rules={field.validationOptions}
        render={({ field: { onChange, value } }) => {
          <SelectDateRange
            field={field}
            value={value}
            onChange={onChange}
            label={false}
          />;
        }}
      />
      {errors[field.name] && <ErrorText errors={errors} field={field} />}
    </div>
  );
};

export const FormTextarea = ({ field, ...props }) => {
  const {
    control,
    formState: { errors },
  } = useFormContext();
  return (
    <div className="space-y-2">
      <FormLabel name={field.name} labelText={field.labelText} />
      <Controller
        name={field.name}
        control={control}
        rules={field.validationOptions}
        render={({ field: { onChange, value } }) => (
          <Textarea
            id={field.name}
            value={value}
            onChange={onChange}
            field={field}
            props={props}
            placeholder={field.placeholder}
            className={`h-32 ring-inset focus-visible:ring-1 focus-visible:ring-indigo-600 focus:ring-indigo-600 focus:ring-1 outline-none appearance-none font-medium font-grotesk ${
              errors[field.name] && "border-red-500"
            }`}
          />
        )}
      />
      {field.helperText && (
        <p className="text-sm text-muted-foreground">{field.helperText}</p>
      )}
      {errors[field.name] && <ErrorText errors={errors} field={field} />}
    </div>
  );
};

export const FormMultiInputOld = ({ field }) => {
  const {
    control,
    formState: { errors },
    getValues,
    trigger,
  } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name: field.name,
  });

  React.useEffect(() => {
    if (fields.length === 0) {
      append(""); // Initialize with one empty field if none exist
    }
  }, [fields, append]);

  const validateUniqueEmail = (email, index) => {
    const emails = getValues(field?.name);
    const isUnique = emails.every((e, i) => i === index || e !== email);
    return (
      isUnique ||
      ` ${
        field?.name.charAt(0).toUpperCase() + field?.name.slice(1)
      } must be unique`
    );
  };

  return (
    <div className="space-y-4">
      {fields.map((item, index) => (
        <div key={item?.id} className="flex items-center space-x-2">
          <div className="flex-grow">
            <Controller
              name={`${field?.name}.${index}`}
              control={control}
              rules={{
                ...field?.validationOptions,
                validate: (value) => validateUniqueEmail(value, index),
              }}
              render={({ field: { onChange, value, name } }) => (
                <div className="space-y-1">
                  {/* <Label
                    className="text-sm font-medium text-neutral-500"
                    htmlFor={field?.name}
                  >
                    {field?.labelText}
                  </Label> */}
                  <FormLabel name={field.name} labelText={field.labelText} />
                  <Input
                    type={field.inputType}
                    placeholder={field?.placeholder}
                    value={value}
                    onChange={(e) => {
                      onChange(e.target.value);
                      trigger(field?.name);
                    }}
                    name={name}
                    id={field?.name}
                  />
                </div>
              )}
            />
            {errors[field?.name]?.[index] && (
              <p className="text-sm text-destructive mt-1">
                {errors[field?.name][index]?.message}
              </p>
            )}
          </div>
          {fields.length > 1 && (
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => remove(index)}
            >
              <Minus className="h-4 w-4" />
            </Button>
          )}
        </div>
      ))}
      {field?.helperText && (
        <p className="text-sm text-muted-foreground">{field?.helperText}</p>
      )}
      {errors[field?.name] && (
        <p className="text-sm text-destructive">
          {errors[field?.name]?.message}
        </p>
      )}
      {fields.length < field?.max && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => append("")}
        >
          <Plus className="h-4 w-4" />
          Add {field?.labelText}
        </Button>
      )}
      {errors[field?.name] &&
        typeof errors[field?.name].message === "string" && (
          <p className="text-sm text-destructive">
            {errors[field?.name].message}
          </p>
        )}
    </div>
  );
};
export const ErrorText = ({ errors, field }) => {
  return (
    <p className="text-sm text-destructive font-grotesk tracking-tight font-medium test-sm">
      {errors[field.name]?.message}
    </p>
  );
};
export const FormImageUpload = ({ field }) => {
  const {
    control,
    setValue, // ✅ Use `setValue` to update form
    formState: { errors },
  } = useFormContext();

  const [uploadedFiles, setUploadedFiles] = React.useState([]);

  // 🔹 Sync with React Hook Form safely (only when uploadedFiles changes)
  React.useEffect(() => {
    setValue(
      field.name,
      field.maxFiles === 1 ? uploadedFiles[0] || null : uploadedFiles
    );
  }, [uploadedFiles, setValue, field.name]);

  // 🔹 Cleanup Object URLs when the component unmounts
  React.useEffect(() => {
    return () =>
      uploadedFiles.forEach((file) => URL.revokeObjectURL(file.preview));
  }, [uploadedFiles]);

  const onDrop = (acceptedFiles) => {
    if (acceptedFiles.length === 0) return;

    const newFiles = acceptedFiles
      .filter(
        (file) =>
          !uploadedFiles.some((existingFile) => existingFile.name === file.name)
      )
      .map((file) =>
        Object.assign(file, { preview: URL.createObjectURL(file) })
      );

    setUploadedFiles((prev) => {
      const updatedFiles =
        field.maxFiles === 1 ? [newFiles[0]] : [...prev, ...newFiles];
      return updatedFiles;
    });
  };

  const handleRemove = (event, index) => {
    event.stopPropagation(); // Prevent Dropzone from opening file manager

    setUploadedFiles((prev) => {
      URL.revokeObjectURL(prev[index].preview);
      return prev.filter((_, i) => i !== index);
    });
  };

  const renderPreview = (file) => {
    const fileType = file.type;

    if (fileType.startsWith("image/")) {
      // Image file preview
      return (
        <Image
          src={file.preview}
          alt={file.name}
          height={80}
          width={80}
          className="rounded-md border border-gray-200 size-28 object-fill"
        />
      );
    }

    if (fileType.startsWith("video/")) {
      // Video file preview
      return (
        <video controls className="rounded-md border border-gray-200 size-28">
          <source src={file.preview} type={fileType} />
          Your browser does not support the video tag.
        </video>
      );
    }

    if (fileType === "application/pdf") {
      // PDF file preview
      return (
        <embed
          src={file.preview}
          type="application/pdf"
          className="rounded-md border border-gray-200 size-28"
        />
      );
    }

    if (fileType.startsWith("text/")) {
      // Text file preview
      return (
        <iframe
          src={file.preview}
          title={file.name}
          className="rounded-md border border-gray-200 size-28"
        />
      );
    }

    // Fallback for other file types
    return (
      <div className="size-28 flex items-center justify-center bg-gray-200">
        {file.name}
      </div>
    );
  };

  return (
    <div className="space-y-2">
      <FormLabel name={field.name} labelText={field.labelText} />
      <Controller
        name={field?.name}
        control={control}
        rules={field?.validationOptions}
        render={() => (
          <Dropzone
            onDrop={onDrop}
            accept={field?.acceptedFileTypes}
            maxSize={field?.maxFileSize}
            maxFiles={field?.maxFiles}
          >
            {({ fileRejections, isDragActive }) => (
              <>
                <div
                  className={`border  border-dashed rounded-md p-4 cursor-pointer h-40 flex ${
                    isDragActive
                      ? "border-indigo-500 bg-indigo-100 animate-pulse"
                      : errors[field?.name]
                      ? "border-destructive"
                      : "border-gray-300 bg-white"
                  }`}
                >
                  {uploadedFiles.length > 0 ? (
                    <div className="flex flex-wrap gap-4 items-start justify-start">
                      {uploadedFiles.map((file, index) => (
                        <div key={index} className="relative group">
                          {renderPreview(file)}
                          {/* <img
                            src={file.preview}
                            alt="Uploaded"
                            className="h-20 w-20 border border-indigo-500 rounded-lg"
                          /> */}
                          <Button
                            type="button"
                            className="absolute size-5 rounded-full bg-rose-600 hover:bg-rose-700 -right-1 -top-1"
                            size="icon"
                            onClick={(event) => handleRemove(event, index)}
                          >
                            <X />
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex justify-center items-center w-full p-12">
                      {isDragActive ? (
                        "Drop the file here"
                      ) : (
                        <div className="text-center">
                          <svg
                            className={`w-16 ${
                              errors[field?.name]
                                ? "text-destructive"
                                : "text-stone-400"
                            } mx-auto`}
                            width="70"
                            height="46"
                            viewBox="0 0 70 46"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M6.05172 9.36853L17.2131 7.5083V41.3608L12.3018 42.3947C9.01306 43.0871 5.79705 40.9434 5.17081 37.6414L1.14319 16.4049C0.515988 13.0978 2.73148 9.92191 6.05172 9.36853Z"
                              fill="currentColor"
                              stroke="currentColor"
                              strokeWidth="2"
                              className={`${
                                errors[field?.name]
                                  ? "text-destructive"
                                  : "stroke-neutral-500"
                              } fill-white`}
                            ></path>
                            <path
                              d="M63.9483 9.36853L52.7869 7.5083V41.3608L57.6982 42.3947C60.9869 43.0871 64.203 40.9434 64.8292 37.6414L68.8568 16.4049C69.484 13.0978 67.2685 9.92191 63.9483 9.36853Z"
                              fill="currentColor"
                              stroke="currentColor"
                              strokeWidth="2"
                              className={`${
                                errors[field?.name]
                                  ? "text-destructive"
                                  : "stroke-neutral-500"
                              } fill-white`}
                            ></path>
                            <rect
                              x="17.0656"
                              y="1.62305"
                              width="35.8689"
                              height="42.7541"
                              rx="5"
                              fill="currentColor"
                              stroke="currentColor"
                              strokeWidth="2"
                              className={`${
                                errors[field?.name]
                                  ? "text-destructive"
                                  : "stroke-neutral-500"
                              } fill-white`}
                            ></rect>
                            <path
                              d="M47.9344 44.3772H22.0655C19.3041 44.3772 17.0656 42.1386 17.0656 39.3772L17.0656 35.9161L29.4724 22.7682L38.9825 33.7121C39.7832 34.6335 41.2154 34.629 42.0102 33.7025L47.2456 27.5996L52.9344 33.7209V39.3772C52.9344 42.1386 50.6958 44.3772 47.9344 44.3772Z"
                              stroke="currentColor"
                              strokeWidth="2"
                              className={`${
                                errors[field?.name]
                                  ? "text-destructive"
                                  : "stroke-neutral-500"
                              }`}
                            ></path>
                            <circle
                              cx="39.5902"
                              cy="14.9672"
                              r="4.16393"
                              stroke="currentColor"
                              strokeWidth="2"
                              className={`${
                                errors[field?.name]
                                  ? "text-destructive"
                                  : "stroke-neutral-500"
                              }`}
                            ></circle>
                          </svg>
                          <div
                            className={`${
                              errors[field?.name]
                                ? "text-destructive"
                                : "text-stone-600"
                            } leading-6 text-sm justify-center flex-wrap flex mt-4`}
                          >
                            <span>
                              Drop your{" "}
                              {field.maxFiles > 1 ? "files" : "a file"} here or
                              click to{" "}
                              <span
                                className={`decoration-2 ${
                                  errors[field?.name]
                                    ? "text-destructive"
                                    : "text-indigo-600"
                                } font-semibold text-pretty`}
                              >
                                Upload
                              </span>
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                  {console.log(fileRejections)}
                </div>
                <div className="mt-1">
                  {fileRejections.length > 0 && (
                    <div className="text-red-500 flex items-start text-sm text-pretty">
                      {fileRejections[0].errors[0].code === "too-many-files"
                        ? `You have allow only ${field.maxFiles} files and trying to upload ${fileRejections.length} files`
                        : fileRejections[0].errors[0].message}
                      {/* {fileRejections.map((rejection, index) => (
                        <p key={index}>{rejection.errors[0].message}</p>
                      ))} */}
                    </div>
                  )}
                </div>
              </>
            )}
          </Dropzone>
        )}
      />
      {errors[field?.name] && (
        <p className="text-sm font-medium text-destructive">
          {errors[field?.name]?.message}
        </p>
      )}
    </div>
  );
};
const Dropzone = ({
  children,
  accept = { "image/*": [] },
  maxSize,
  maxFiles,
  onDrop,
  minDimensions, // { width: number, height: number }
}) => {
  const dimensionsValidator = (file) => {
    return new Promise((resolve) => {
      if (!minDimensions) {
        resolve(true); // No dimension constraints
        return;
      }

      const img = new Image();
      img.src = URL.createObjectURL(file);
      img.onload = () => {
        const isValid =
          img.width >= minDimensions.width &&
          img.height >= minDimensions.height;
        resolve(
          isValid
            ? true
            : {
                code: "dimension-too-small",
                message: `Image dimensions should be at least ${minDimensions.width}x${minDimensions.height}px`,
              }
        );
      };
      img.onerror = () => {
        resolve(true); // If image fails to load, skip dimension check
      };
    });
  };

  const { getRootProps, getInputProps, isDragActive, fileRejections } =
    useDropzone({
      accept,
      maxSize,
      maxFiles,
      onDrop,
      // validate: dimensionsValidator,
    });

  return (
    <div {...getRootProps()} className="">
      <input {...getInputProps()} />
      {children({ isDragActive, fileRejections })}
    </div>
  );
};

export const FormImageUploadAWSOLD = ({ field }) => {
  const {
    control,
    setValue,
    formState: { errors },
  } = useFormContext();
  const { uploadMultipleFiles } = useUploaderNew();

  const storageKey = `upload-cache-${field.name}`;
  // 🔹 Main state: Array of { file, preview, url, status: 'pending' | 'success' }
  const [files, setFiles] = React.useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(storageKey);
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });

  // 1. Load from LocalStorage on mount
  React.useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      const parsed = JSON.parse(saved);
      setFiles(parsed);
      // Update React Hook Form
      const urls = parsed.map((f) => ({ url: f.url, fileName: f.fileName }));
      setValue(field.name, field.maxFiles === 1 ? urls[0] || null : urls);
    }
  }, [field.name, storageKey, setValue]);

  // 2. Sync State with Form & LocalStorage whenever 'files' changes
  React.useEffect(() => {
    const uploadedOnly = files.filter((f) => f.status === "success");
    const urls = uploadedOnly.map((f) => ({
      url: f.url,
      mediaId: f.mediaId,
      fileName: f.fileName,
    }));

    setValue(field.name, field.maxFiles === 1 ? urls[0] || null : urls);

    // Save to local storage (only the successful ones)
    localStorage.setItem(storageKey, JSON.stringify(uploadedOnly));
  }, [files, field.name, setValue, storageKey]);

  const onDrop = async (acceptedFiles) => {
    if (acceptedFiles.length === 0) return;

    const minWidth = field?.minWidth || 0;
    const minHeight = field?.minHeight || 0;

    const validatedFiles = [];
    const dimensionErrors = [];

    const checkDimensions = (file) => {
      return new Promise((resolve) => {
        if (minWidth === 0 && minHeight === 0) {
          resolve(true); // No dimension constraints
          return;
        }

        const img = new Image();
        img.src = URL.createObjectURL(file);
        img.onload = () => {
          URL.revokeObjectURL(img.src); // Clean up
          const isValid = img.width >= minWidth && img.height >= minHeight;
          if (isValid) {
            resolve(true);
          } else {
            dimensionErrors.push(
              `Image ${file.name} dimensions should be at least ${minWidth}x${minHeight}px`
            );
            resolve(false);
          }
        };
        img.onerror = () => {
          resolve(true); // If image fails to load, skip dimension check
        };
      });
    };

    for (const file of acceptedFiles) {
      const isValid = await checkDimensions(file);
      if (isValid) validatedFiles.push(file);
    }

    if (validatedFiles.length === 0) {
      if (dimensionErrors.length > 0) alert(dimensionErrors.join("\n"));
      return;
    }

    // Create temporary preview objects
    const newPendingFiles = acceptedFiles.map((file) => ({
      fileName: file.name,
      preview: URL.createObjectURL(file),
      status: "pending",
      rawFile: file, // kept for the upload function
    }));

    // Update UI immediately to show previews
    setFiles((prev) =>
      field.maxFiles === 1
        ? [newPendingFiles[0]]
        : [...prev, ...newPendingFiles]
    );

    // Start Upload
    const results = await uploadMultipleFiles(
      acceptedFiles,
      field?.uploadPath || "uploads",
      field?.access || "private"
    );

    // Tomorrow Task or Toady Task:
    // Add the media Id in the files object
    // Add the mediaId in the setValue form object

    // Merge results back into state
    setFiles((prev) => {
      return prev.map((existingFile) => {
        const match = results.find(
          (res) => res.success && res.key.includes(existingFile.fileName)
        );
        if (match) {
          return {
            ...existingFile,
            url: match.url, // Permanent S3 URL
            status: "success",
            preview: match.url, // Switch from blob to S3 URL
            fileType: existingFile.rawFile.type,
            mediaId: match.mediaId,
          };
        }
        return existingFile;
      });
    });
  };

  const handleRemove = (index) => {
    // we have to remove the file from the state and localstorage
    setFiles((prev) => {
      const updatedFiles = prev.filter((_, i) => i !== index);
      return updatedFiles;
    });
  };
  const renderPreview = (file) => {
    const getFileType = () => {
      if (file.rawFile?.type) return file.rawFile.type;
      if (file.fileType) return file.fileType;

      // Guessing extension if rawFile is missing (after refresh)
      const ext = file.fileName?.split(".").pop().toLowerCase();
      const imageExts = ["jpg", "jpeg", "png", "gif", "webp", "svg"];
      const videoExts = ["mp4", "webm", "ogg"];

      if (imageExts.includes(ext)) return "image/generic";
      if (videoExts.includes(ext)) return "video/generic";
      if (ext === "pdf") return "application/pdf";
      return null;
    };

    const fileType = getFileType();
    if (fileType?.startsWith("image/")) {
      return (
        <img
          src={file.url || file.preview} // Use URL if available (S3), otherwise Blob preview
          alt={file.fileName}
          height={112}
          width={112}
          className="rounded-md border border-gray-200 size-28 object-cover"
        />
      );
    }

    if (fileType?.startsWith("video/")) {
      return (
        <video
          controls
          className="rounded-md border border-gray-200 size-28 object-cover"
        >
          <source src={file.url || file.preview} type={file.fileType} />
        </video>
      );
    }

    if (fileType === "application/pdf") {
      // PDF file preview
      return (
        <embed
          src={file.url || file.preview}
          type="application/pdf"
          className="rounded-md border border-gray-200 size-28"
        />
      );
    }

    if (fileType?.startsWith("text/")) {
      // Text file preview
      return (
        <iframe
          src={file.url || file.preview}
          title={file.name}
          className="rounded-md border border-gray-200 size-28"
        />
      );
    }

    // Fallback for other file types
    return (
      <div className="size-28 flex items-center justify-center bg-gray-100 p-2 rounded-md border border-gray-200 overflow-hidden">
        <span className="text-[10px] leading-tight text-center break-all line-clamp-4 text-gray-700">
          {file.fileName}
        </span>
      </div>
    );
  };

  return (
    <div className="space-y-2">
      <FormLabel name={field.name} labelText={field.labelText} />
      <Controller
        name={field?.name}
        control={control}
        rules={field?.validationOptions}
        render={() => (
          <Dropzone
            onDrop={onDrop}
            accept={field?.acceptedFileTypes}
            maxSize={field?.maxFileSize}
            maxFiles={field?.maxFiles}
          >
            {({ fileRejections, isDragActive }) => (
              <>
                <div
                  className={`border border-dashed rounded-md p-4 cursor-pointer h-40 flex ${
                    isDragActive
                      ? "border-indigo-500 bg-indigo-100 animate-pulse"
                      : errors[field?.name]
                      ? "border-destructive"
                      : "border-gray-300 bg-white"
                  }`}
                >
                  {files.length > 0 ? (
                    <div className="flex flex-wrap gap-4 items-start justify-start">
                      {files.map((file, index) => (
                        <div key={index} className="relative group">
                          {renderPreview(file)}
                          {/* <img
                            src={file.preview}
                            alt="Uploaded"
                            className="h-20 w-20 border border-indigo-500 rounded-lg"
                          /> */}
                          <Button
                            type="button"
                            className="absolute size-5 rounded-full bg-rose-600 hover:bg-rose-700 -right-1 -top-1 cursor-pointer"
                            size="icon"
                            // onClick={(event) => handleRemove(event, index)}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemove(index);
                            }}
                          >
                            <X />
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex justify-center items-center w-full p-12">
                      {isDragActive ? (
                        "Drop the file here"
                      ) : (
                        <div className="text-center">
                          <svg
                            className={`w-16 ${
                              errors[field?.name]
                                ? "text-destructive"
                                : "text-stone-400"
                            } mx-auto`}
                            width="70"
                            height="46"
                            viewBox="0 0 70 46"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M6.05172 9.36853L17.2131 7.5083V41.3608L12.3018 42.3947C9.01306 43.0871 5.79705 40.9434 5.17081 37.6414L1.14319 16.4049C0.515988 13.0978 2.73148 9.92191 6.05172 9.36853Z"
                              fill="currentColor"
                              stroke="currentColor"
                              strokeWidth="2"
                              className={`${
                                errors[field?.name]
                                  ? "text-destructive"
                                  : "stroke-neutral-500"
                              } fill-white`}
                            ></path>
                            <path
                              d="M63.9483 9.36853L52.7869 7.5083V41.3608L57.6982 42.3947C60.9869 43.0871 64.203 40.9434 64.8292 37.6414L68.8568 16.4049C69.484 13.0978 67.2685 9.92191 63.9483 9.36853Z"
                              fill="currentColor"
                              stroke="currentColor"
                              strokeWidth="2"
                              className={`${
                                errors[field?.name]
                                  ? "text-destructive"
                                  : "stroke-neutral-500"
                              } fill-white`}
                            ></path>
                            <rect
                              x="17.0656"
                              y="1.62305"
                              width="35.8689"
                              height="42.7541"
                              rx="5"
                              fill="currentColor"
                              stroke="currentColor"
                              strokeWidth="2"
                              className={`${
                                errors[field?.name]
                                  ? "text-destructive"
                                  : "stroke-neutral-500"
                              } fill-white`}
                            ></rect>
                            <path
                              d="M47.9344 44.3772H22.0655C19.3041 44.3772 17.0656 42.1386 17.0656 39.3772L17.0656 35.9161L29.4724 22.7682L38.9825 33.7121C39.7832 34.6335 41.2154 34.629 42.0102 33.7025L47.2456 27.5996L52.9344 33.7209V39.3772C52.9344 42.1386 50.6958 44.3772 47.9344 44.3772Z"
                              stroke="currentColor"
                              strokeWidth="2"
                              className={`${
                                errors[field?.name]
                                  ? "text-destructive"
                                  : "stroke-neutral-500"
                              }`}
                            ></path>
                            <circle
                              cx="39.5902"
                              cy="14.9672"
                              r="4.16393"
                              stroke="currentColor"
                              strokeWidth="2"
                              className={`${
                                errors[field?.name]
                                  ? "text-destructive"
                                  : "stroke-neutral-500"
                              }`}
                            ></circle>
                          </svg>
                          <div
                            className={`${
                              errors[field?.name]
                                ? "text-destructive"
                                : "text-stone-600"
                            } leading-6 text-sm justify-center flex-wrap flex mt-4`}
                          >
                            <span>
                              Drop your{" "}
                              {field.maxFiles > 1 ? "files" : "a file"} here or
                              click to{" "}
                              <span
                                className={`decoration-2 ${
                                  errors[field?.name]
                                    ? "text-destructive"
                                    : "text-indigo-600"
                                } font-semibold text-pretty`}
                              >
                                Upload
                              </span>
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                  {/* {console.log(fileRejections)} */}
                </div>
                <div className="mt-1">
                  {fileRejections.length > 0 && (
                    <div className="text-red-500 flex items-start text-sm text-pretty">
                      {fileRejections[0].errors[0].code === "too-many-files"
                        ? `You have allow only ${field.maxFiles} files and trying to upload ${fileRejections.length} files`
                        : fileRejections[0].errors[0].message}
                      {/* {fileRejections.map((rejection, index) => (
                        <p key={index}>{rejection.errors[0].message}</p>
                      ))} */}
                    </div>
                  )}
                </div>
              </>
            )}
          </Dropzone>
        )}
      />
      {field.helperText && (
        <p className="text-sm text-muted-foreground">{field.helperText}</p>
      )}
      {errors[field?.name] && (
        <p className="text-sm font-medium text-destructive">
          {errors[field?.name]?.message}
        </p>
      )}
    </div>
  );
};
export const FormImageUploadAWS = ({ field }) => {
  const {
    control,
    setValue,
    watch,
    setError,
    clearErrors,
    formState: { errors },
  } = useFormContext();
  const { uploadMultipleFiles, progressMap } = useUploaderNew();

  const storageKey = `upload-cache-${field.name}`;
  // 🔹 Main state: Array of { file, preview, url, status: 'pending' | 'success' }
  const [files, setFiles] = React.useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(storageKey);
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });

  React.useEffect(() => {
    const currentValue = watch(field.name);

    if (!currentValue) return;

    const valuesArray = Array.isArray(currentValue)
      ? currentValue
      : [currentValue];

    const mapped = valuesArray.filter(Boolean).map((item) => ({
      fileName: item.fileName,
      url: item.url,
      preview: item.url,
      status: "success",
      mediaId: item.mediaId,
    }));

    setFiles(mapped);

    // run only once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onDrop = async (acceptedFiles, fileRejections) => {
    // 1. Handle rejections (wrong file type or too large)
    if (fileRejections.length > 0) {
      // Dropzone handles these via the fileRejections array automatically
      return;
    }

    clearErrors(field.name);

    // 2. Check Max Files Limit
    if (field.maxFiles === 1 && files.length === 1) {
      setError(field.name, {
        type: "manual",
        message: `Only ${field.maxFiles} file allowed. Remove the current file first.`,
      });
      return;
    }

    // 3. Dimension Validation
    const validatedFiles = [];
    const minWidth = field?.minWidth || 0;
    const minHeight = field?.minHeight || 0;

    const checkDimensions = (file) => {
      return new Promise((resolve) => {
        if (minWidth === 0 && minHeight === 0) return resolve(true);
        const img = new Image();
        img.src = URL.createObjectURL(file);
        img.onload = () => {
          URL.revokeObjectURL(img.src);
          resolve(img.width >= minWidth && img.height >= minHeight);
        };
        img.onerror = () => resolve(true);
      });
    };

    for (const file of acceptedFiles) {
      const isValid = await checkDimensions(file);
      if (isValid) validatedFiles.push(file);
    }

    if (validatedFiles.length === 0) return;

    // 4. Create local previews
    const newPendingFiles = validatedFiles.map((file) => ({
      fileName: file.name,
      preview: URL.createObjectURL(file), // Temporary blob
      status: "pending",
      rawFile: file,
    }));

    setFiles((prev) =>
      field.maxFiles === 1
        ? [newPendingFiles[0]]
        : [...prev, ...newPendingFiles]
    );

    const pendingFiles = acceptedFiles.map((file) => ({
      fileName: file.name,
      preview: URL.createObjectURL(file),
      status: "uploading",
      // We add a temp ID to match the progress later
      tempId: `${file.name}-${Date.now()}`,
    }));

    setFiles((prev) =>
      field.maxFiles === 1 ? [pendingFiles[0]] : [...prev, ...pendingFiles]
    );

    // 5. Execute Upload
    try {
      const results = await uploadMultipleFiles(
        validatedFiles,
        field?.uploadPath || "uploads",
        field?.access || "private"
      );

      // Filter only successful uploads for Form State
      const successfulUploads = results.filter((res) => res.success);

      const formValue =
        field.maxFiles === 1
          ? {
              url: successfulUploads[0].url,
              mediaId: successfulUploads[0].mediaId,
              fileName: successfulUploads[0].fileName,
              key: successfulUploads[0].key,
              fileType: successfulUploads[0].fileType,
            }
          : successfulUploads.map((res) => ({
              url: res.url,
              mediaId: res.mediaId,
              fileName: res.fileName,
              key: res.key,
              fileType: res.fileType,
            }));

      setValue(field.name, formValue, { shouldValidate: true });

      // 6. Update Local State & Cleanup Blobs
      setFiles((prev) => {
        return prev.map((item) => {
          const match = successfulUploads.find((res) =>
            res.key.includes(item.fileName)
          );
          if (match) {
            // Revoke the temporary blob URL now that we have the S3 URL
            if (item.preview.startsWith("blob:")) {
              URL.revokeObjectURL(item.preview);
            }
            return {
              ...item,
              url: match.url,
              status: "success",
              preview: match.url,
              mediaId: match.mediaId,
            };
          }
          return item;
        });
      });
    } catch (error) {
      setError(field.name, { type: "manual", message: "Upload failed." });
    }
  };

  const handleRemove = (index) => {
    // 1. Calculate the new state first
    const updatedFiles = files.filter((_, i) => i !== index);

    // 2. Cleanup the blob URL if necessary
    if (files[index].preview?.startsWith("blob:")) {
      URL.revokeObjectURL(files[index].preview);
    }

    // 3. Update the local state
    setFiles(updatedFiles);

    // 4. Update the Form state OUTSIDE of the setFiles call
    const newValue =
      field.maxFiles === 1
        ? null
        : updatedFiles.map((f) => ({
            url: f.url,
            mediaId: f.mediaId,
            fileName: f.fileName,
          }));

    // This is now safe because it's a standard event handler execution
    setValue(field.name, newValue, { shouldValidate: true });
  };
  const renderPreview = (file) => {
    const getFileType = () => {
      if (file.rawFile?.type) return file.rawFile.type;
      if (file.fileType) return file.fileType;

      // Guessing extension if rawFile is missing (after refresh)
      const ext = file.fileName?.split(".").pop().toLowerCase();
      const imageExts = ["jpg", "jpeg", "png", "gif", "webp", "svg"];
      const videoExts = ["mp4", "webm", "ogg"];

      if (imageExts.includes(ext)) return "image/generic";
      if (videoExts.includes(ext)) return "video/generic";
      if (ext === "pdf") return "application/pdf";
      return null;
    };
    console.log("Rendering preview for file:", file);

    const fileType = getFileType();
    if (fileType?.startsWith("image/")) {
      return (
        <img
          src={file.url || file.preview} // Use URL if available (S3), otherwise Blob preview
          alt={file.fileName}
          height={112}
          width={112}
          className="rounded-md border border-gray-200 size-28 object-cover"
        />
      );
    }

    if (fileType?.startsWith("video/")) {
      return (
        <video
          controls
          className="rounded-md border border-gray-200 size-28 object-cover"
        >
          <source src={file.url || file.preview} type={file.fileType} />
        </video>
      );
    }

    if (fileType === "application/pdf") {
      // PDF file preview
      return (
        <embed
          src={file.url || file.preview}
          type="application/pdf"
          className="rounded-md border border-gray-200 size-28"
        />
      );
    }

    if (fileType?.startsWith("text/")) {
      // Text file preview
      return (
        <iframe
          src={file.url || file.preview}
          title={file.name}
          className="rounded-md border border-gray-200 size-28"
        />
      );
    }

    // Fallback for other file types
    return (
      <div className="size-28 flex items-center justify-center bg-gray-100 p-2 rounded-md border border-gray-200 overflow-hidden">
        <span className="text-[10px] leading-tight text-center break-all line-clamp-4 text-gray-700">
          {file.fileName}
        </span>
      </div>
    );
  };

  return (
    <div className="space-y-2">
      <FormLabel name={field.name} labelText={field.labelText} />
      <Controller
        name={field?.name}
        control={control}
        rules={field?.validationOptions}
        render={() => (
          <Dropzone
            onDrop={onDrop}
            accept={field?.acceptedFileTypes}
            maxSize={field?.maxFileSize}
            maxFiles={field?.maxFiles}
          >
            {({ fileRejections, isDragActive }) => (
              <>
                <div
                  className={`border border-dashed rounded-md p-4 cursor-pointer h-40 flex ${
                    isDragActive
                      ? "border-indigo-500 bg-indigo-100 animate-pulse"
                      : errors[field?.name]
                      ? "border-destructive"
                      : "border-gray-300 bg-white"
                  }`}
                >
                  {files.length > 0 ? (
                    <div className="flex flex-wrap gap-4 items-start justify-start">
                      {files.map((file, index) => {
                        // Lookup progress for this specific file
                        const progressKey = Object.keys(progressMap).find(
                          (key) => key.includes(file.fileName)
                        );
                        const progress = progressMap[progressKey] || 0;

                        return (
                          <div key={index} className="relative group size-28">
                            {/* 1. The Image/File Preview */}
                            {renderPreview(file)}

                            {/* 2. The Progress Bar (Shows only during upload) */}
                            {progress > 0 && progress < 100 && (
                              <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-gray-100 rounded-b-md overflow-hidden">
                                <div
                                  className="bg-indigo-600 h-full transition-all duration-300"
                                  style={{ width: `${progress}%` }}
                                />
                              </div>
                            )}

                            {/* 3. THE REMOVE BUTTON (Top Right) */}
                            <Button
                              type="button"
                              className="absolute -right-2 -top-2 size-6 rounded-full bg-rose-600 hover:bg-rose-700 p-0 shadow-sm z-10"
                              onClick={(e) => {
                                e.stopPropagation(); // Prevents triggering the dropzone click
                                handleRemove(index);
                              }}
                            >
                              <X className="size-3 text-white" />
                            </Button>

                            {/* Optional: Success Overlay */}
                            {progress === 100 && (
                              <div className="absolute top-1 left-1 bg-green-500 rounded-full p-0.5 shadow-sm">
                                <Check className="size-3 text-white" />
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="flex justify-center items-center w-full p-12">
                      {isDragActive ? (
                        "Drop the file here"
                      ) : (
                        <div className="text-center">
                          <svg
                            className={`w-16 ${
                              errors[field?.name]
                                ? "text-destructive"
                                : "text-stone-400"
                            } mx-auto`}
                            width="70"
                            height="46"
                            viewBox="0 0 70 46"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M6.05172 9.36853L17.2131 7.5083V41.3608L12.3018 42.3947C9.01306 43.0871 5.79705 40.9434 5.17081 37.6414L1.14319 16.4049C0.515988 13.0978 2.73148 9.92191 6.05172 9.36853Z"
                              fill="currentColor"
                              stroke="currentColor"
                              strokeWidth="2"
                              className={`${
                                errors[field?.name]
                                  ? "text-destructive"
                                  : "stroke-neutral-500"
                              } fill-white`}
                            ></path>
                            <path
                              d="M63.9483 9.36853L52.7869 7.5083V41.3608L57.6982 42.3947C60.9869 43.0871 64.203 40.9434 64.8292 37.6414L68.8568 16.4049C69.484 13.0978 67.2685 9.92191 63.9483 9.36853Z"
                              fill="currentColor"
                              stroke="currentColor"
                              strokeWidth="2"
                              className={`${
                                errors[field?.name]
                                  ? "text-destructive"
                                  : "stroke-neutral-500"
                              } fill-white`}
                            ></path>
                            <rect
                              x="17.0656"
                              y="1.62305"
                              width="35.8689"
                              height="42.7541"
                              rx="5"
                              fill="currentColor"
                              stroke="currentColor"
                              strokeWidth="2"
                              className={`${
                                errors[field?.name]
                                  ? "text-destructive"
                                  : "stroke-neutral-500"
                              } fill-white`}
                            ></rect>
                            <path
                              d="M47.9344 44.3772H22.0655C19.3041 44.3772 17.0656 42.1386 17.0656 39.3772L17.0656 35.9161L29.4724 22.7682L38.9825 33.7121C39.7832 34.6335 41.2154 34.629 42.0102 33.7025L47.2456 27.5996L52.9344 33.7209V39.3772C52.9344 42.1386 50.6958 44.3772 47.9344 44.3772Z"
                              stroke="currentColor"
                              strokeWidth="2"
                              className={`${
                                errors[field?.name]
                                  ? "text-destructive"
                                  : "stroke-neutral-500"
                              }`}
                            ></path>
                            <circle
                              cx="39.5902"
                              cy="14.9672"
                              r="4.16393"
                              stroke="currentColor"
                              strokeWidth="2"
                              className={`${
                                errors[field?.name]
                                  ? "text-destructive"
                                  : "stroke-neutral-500"
                              }`}
                            ></circle>
                          </svg>
                          <div
                            className={`${
                              errors[field?.name]
                                ? "text-destructive"
                                : "text-stone-600"
                            } leading-6 text-sm justify-center flex-wrap flex mt-4`}
                          >
                            <span>
                              Drop your{" "}
                              {field.maxFiles > 1 ? "files" : "a file"} here or
                              click to{" "}
                              <span
                                className={`decoration-2 ${
                                  errors[field?.name]
                                    ? "text-destructive"
                                    : "text-indigo-600"
                                } font-semibold text-pretty`}
                              >
                                Upload
                              </span>
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                  {/* {console.log(fileRejections)} */}
                </div>
                <div className="mt-1">
                  {fileRejections.length > 0 && (
                    <div className="text-red-500 flex items-start text-sm text-pretty">
                      {fileRejections[0].errors[0].code === "too-many-files"
                        ? `You have allow only ${field.maxFiles} files and trying to upload ${fileRejections.length} files`
                        : fileRejections[0].errors[0].message}
                      {/* {fileRejections.map((rejection, index) => (
                        <p key={index}>{rejection.errors[0].message}</p>
                      ))} */}
                    </div>
                  )}
                </div>
              </>
            )}
          </Dropzone>
        )}
      />
      {field.helperText && (
        <p className="text-sm text-muted-foreground">{field.helperText}</p>
      )}
      {errors[field?.name] && (
        <p className="text-sm font-medium text-destructive">
          {errors[field?.name]?.message}
        </p>
      )}
    </div>
  );
};

// export const FormImageUploadAWS = ({ field }) => {
//   const {
//     setValue,
//     watch,
//     formState: { errors },
//   } = useFormContext();
//   const { uploadMultipleFiles } = useUploaderNew();

//   // ✅ Watch RHF value (this makes edit mode work)
//   const watchedValue = watch(field.name);

//   // Internal UI state
//   const [files, setFiles] = React.useState([]);

//   // ✅ Sync RHF → local UI state (important for edit mode)
//   React.useEffect(() => {
//     const currentValue = watch(field.name);

//     if (!currentValue) return;

//     const valuesArray = Array.isArray(currentValue)
//       ? currentValue
//       : [currentValue];

//     const mapped = valuesArray.filter(Boolean).map((item) => ({
//       fileName: item.fileName,
//       url: item.url,
//       preview: item.url,
//       status: "success",
//       mediaId: item.mediaId,
//     }));

//     setFiles(mapped);

//     // run only once on mount
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   // ✅ Dimension validator (single source)
//   const dimensionValidator = (file) => {
//     return new Promise((resolve) => {
//       const minWidth = field?.minWidth || 0;
//       const minHeight = field?.minHeight || 0;

//       if (!minWidth && !minHeight) {
//         resolve(null);
//         return;
//       }

//       const img = new Image();
//       img.src = URL.createObjectURL(file);

//       img.onload = () => {
//         URL.revokeObjectURL(img.src);

//         if (img.width >= minWidth && img.height >= minHeight) {
//           resolve(null);
//         } else {
//           resolve({
//             code: "dimension-too-small",
//             message: `Image must be at least ${minWidth}x${minHeight}px`,
//           });
//         }
//       };

//       img.onerror = () => resolve(null);
//     });
//   };

//   const onDrop = async (acceptedFiles) => {
//     if (!acceptedFiles.length) return;

//     // 1️⃣ Create pending previews
//     const pendingFiles = acceptedFiles.map((file) => ({
//       fileName: file.name,
//       preview: URL.createObjectURL(file),
//       status: "pending",
//       rawFile: file,
//     }));

//     // 2️⃣ Update UI immediately (optimistic UI)
//     let updatedFiles;

//     if (field.maxFiles === 1) {
//       updatedFiles = [pendingFiles[0]];
//     } else {
//       updatedFiles = [...files, ...pendingFiles];
//     }

//     setFiles(updatedFiles);

//     console.log("Files ready for upload:", acceptedFiles);

//     // 3️⃣ Upload files
//     const results = await uploadMultipleFiles(
//       acceptedFiles,
//       field?.uploadPath || "uploads",
//       field?.access || "public"
//     );

//     const successfulUploads = results.filter((r) => r.success);

//     if (!successfulUploads.length) return;

//     // 4️⃣ Merge uploaded results into state
//     const mergedFiles = updatedFiles.map((file) => {
//       const match = successfulUploads.find((r) =>
//         r.key.includes(file.fileName)
//       );

//       if (match) {
//         return {
//           ...file,
//           url: match.url,
//           preview: match.url,
//           status: "success",
//           mediaId: match.mediaId,
//         };
//       }

//       return file;
//     });

//     // 5️⃣ Update UI
//     setFiles(mergedFiles);

//     // 6️⃣ Update React Hook Form (AFTER state update)
//     const formatted = mergedFiles
//       .filter((f) => f.status === "success")
//       .map((f) => ({
//         url: f.url,
//         mediaId: f.mediaId,
//         fileName: f.fileName,
//       }));

//     setValue(
//       field.name,
//       field.maxFiles === 1 ? formatted[0] || null : formatted,
//       { shouldValidate: true }
//     );
//   };

//   const handleRemove = (index) => {
//     const updated = files.filter((_, i) => i !== index);

//     setFiles(updated);

//     const formatted = updated
//       .filter((f) => f.status === "success")
//       .map((f) => ({
//         url: f.url,
//         mediaId: f.mediaId,
//         fileName: f.fileName,
//       }));

//     setValue(
//       field.name,
//       field.maxFiles === 1 ? formatted[0] || null : formatted,
//       { shouldValidate: true }
//     );
//   };

//   const { getRootProps, getInputProps, isDragActive, fileRejections } =
//     useDropzone({
//       onDrop,
//       accept: field?.acceptedFileTypes,
//       maxSize: field?.maxFileSize,
//       maxFiles: field?.maxFiles,
//       validator: dimensionValidator,
//     });

//   const renderPreview = (file) => {
//     if (file.preview?.includes(".mp4")) {
//       return (
//         <video
//           src={file.preview}
//           className="size-28 object-cover rounded-md border"
//           controls
//         />
//       );
//     }

//     return (
//       <img
//         src={file.preview}
//         alt={file.fileName}
//         className="size-28 object-cover rounded-md border"
//       />
//     );
//   };

//   return (
//     <div className="space-y-2">
//       <div
//         {...getRootProps()}
//         className="border border-dashed rounded-md p-4 cursor-pointer min-h-40"
//       >
//         <input {...getInputProps()} />

//         {files.length ? (
//           <div className="flex gap-4 flex-wrap">
//             {files.map((file, index) => (
//               <div key={index} className="relative group">
//                 {renderPreview(file)}

//                 <Button
//                   type="button"
//                   size="icon"
//                   className="absolute -top-2 -right-2 size-6 rounded-full bg-red-600"
//                   onClick={(e) => {
//                     e.stopPropagation();
//                     handleRemove(index);
//                   }}
//                 >
//                   <X size={14} />
//                 </Button>
//               </div>
//             ))}
//           </div>
//         ) : (
//           <div className="text-center text-sm text-gray-500 py-10">
//             {isDragActive
//               ? "Drop files here"
//               : `Click or drag ${
//                   field.maxFiles > 1 ? "files" : "a file"
//                 } to upload`}
//           </div>
//         )}
//       </div>

//       {errors[field?.name] && (
//         <p className="text-sm font-medium text-destructive">
//           {errors[field?.name]?.message}
//         </p>
//       )}

//       {fileRejections.length > 0 && (
//         <p className="text-sm text-red-500">
//           {fileRejections[0].errors[0].message}
//         </p>
//       )}
//     </div>
//   );
// };

// add the form tags[] here and export the form field components
export const FormInputTagField = ({ field, ...props }) => {
  const {
    control,
    formState: { errors },
  } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name: field.name,
  });

  return (
    <div className="space-y-2">
      <FormLabel name={field.name} labelText={field.labelText} />
      <div className="flex flex-wrap gap-2">
        {fields.map((item, index) => (
          <div key={item.id} className="flex items-center space-x-2">
            <Input
              type="text"
              placeholder={field.placeholder}
              {...control.register(`${field.name}.${index}`)}
            />
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => remove(index)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => append("")}
      >
        <Plus className="h-4 w-4" />
        Add Tag
      </Button>
      {errors[field.name] && (
        <p className="text-sm text-destructive">
          {errors[field.name]?.message}
        </p>
      )}
    </div>
  );
};
// add the switch field here
export const FormSwitch = ({ field }) => {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  return (
    <div className="space-y-2 mt-0.5">
      <div className="flex items-center space-x-2">
        <Controller
          name={field.name}
          control={control}
          rules={field.validationOptions}
          render={({ field: { onChange, value } }) => (
            <Switch
              id={field.name}
              checked={!!value}
              onCheckedChange={(checked) => onChange(!!checked)}
              className="
              data-[state=checked]:bg-indigo-600 
              data-[state=unchecked]:bg-gray-200
              focus:ring-1 focus:ring-indigo-400
            "
            />
          )}
        />

        <FormLabel name={field.name} labelText={field.labelText} />
      </div>
      {errors[field.name] && <ErrorText errors={errors} field={field} />}
    </div>
  );
};

export const FormMultiInput = ({ field }) => {
  const {
    control,
    formState: { errors },
    getValues,
    trigger,
  } = useFormContext();

  const { fields, append, remove } = useFieldArray({
    control,
    name: field.name,
  });

  // ✅ Only initialize once
  const initializedRef = React.useRef(false);

  React.useEffect(() => {
    if (!initializedRef.current) {
      if (fields.length === 0) {
        append("");
      }
      initializedRef.current = true;
    }
  }, [fields.length, append]);

  const validateUniqueEmail = (email, index) => {
    const emails = getValues(field?.name);
    const isUnique = emails.every((e, i) => i === index || e !== email);
    return isUnique || `${field?.labelText || field?.name} must be unique`;
  };

  return (
    <div className="space-y-4">
      {fields.map((item, index) => (
        <div key={item.id} className="flex items-center space-x-2">
          <div className="grow">
            <Controller
              name={`${field?.name}.${index}`}
              control={control}
              rules={{
                ...field?.validationOptions,
                validate: (value) => validateUniqueEmail(value, index),
              }}
              render={({ field: { onChange, value, name } }) => (
                <div className="space-y-1">
                  <FormLabel name={field.name} labelText={field.labelText} />
                  <Input
                    placeholder={field?.placeholder}
                    value={value || ""}
                    onChange={(e) => {
                      onChange(e.target.value);
                      trigger(field?.name);
                    }}
                    name={name}
                  />
                </div>
              )}
            />

            {errors[field?.name]?.[index] && (
              <p className="text-sm text-destructive mt-1">
                {errors[field?.name][index]?.message}
              </p>
            )}
          </div>

          {fields.length > 1 && (
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => remove(index)} // ✅ now safe
            >
              <Minus className="h-4 w-4" />
            </Button>
          )}
        </div>
      ))}

      {field?.helperText && (
        <p className="text-sm text-muted-foreground">{field?.helperText}</p>
      )}

      {fields.length < field?.max && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => append("")}
        >
          <Plus className="h-4 w-4" />
          Add {field?.labelText}
        </Button>
      )}
    </div>
  );
};

export const FormEditor = ({ field }) => {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  return (
    <div className="space-y-2">
      <FormLabel name={field?.name} labelText={field?.labelText} />
      <Controller
        name={field.name}
        control={control}
        rules={field.validationOptions}
        defaultValue={""}
        render={({ field: { onChange, value } }) => {
          return <RichTextEditorDemo value={value || ""} onUpdate={onChange} />;
        }}
      />
      {errors[field.name] && <ErrorText errors={errors} field={field} />}
    </div>
  );
};

export function FieldAiButton({ field }) {
  const { watch, setValue } = useFormContext();

  const handleGenerate = async () => {
    if (!field.ai) return;

    // Collect dependent field values
    const payload = {};
    field.ai.dependsOn?.forEach((dep) => {
      payload[dep] = watch(dep);
    });

    // Call AI function
    const result = await field.ai.fn(payload);

    // MULTIPLE FIELD (array)
    if (field.type === "multiple") {
      const values = Array.isArray(result) ? result : result?.values;
      if (values) {
        setValue(field.name, values.slice(0, field.ai.limit || field.max || 5));
      }
    }

    // SINGLE FIELD (textarea, input, etc.)
    else {
      const value = result?.value || result;
      if (value) {
        setValue(field.name, value);
      }
    }
  };

  return (
    <Button
      type="button"
      variant="secondary"
      size="sm"
      className="mt-2"
      onClick={handleGenerate}
    >
      ✨ {field.ai.label || "Generate with AI"}
    </Button>
  );
}

// making the step form field component
export const FormStepForm = ({ field }) => {
  const {
    control,
    formState: { errors },
  } = useFormContext();
  const [currentStep, setCurrentStep] = React.useState(0);

  const totalSteps = field.steps.length;

  const goToNextStep = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const goToPreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="space-y-4">
      <FormLabel
        name={field.name}
        labelText={`${field.labelText} (Step ${
          currentStep + 1
        } of ${totalSteps})`}
      />
      <Controller
        name={field.name}
        control={control}
        rules={field.validationOptions}
        render={() => (
          <div>
            {field.steps[currentStep]}
            <div className="flex justify-between mt-4">
              <Button
                type="button"
                variant="outline"
                onClick={goToPreviousStep}
                disabled={currentStep === 0}
              >
                Previous
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={goToNextStep}
                disabled={currentStep === totalSteps - 1}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      />
      {errors[field.name] && <ErrorText errors={errors} field={field} />}
    </div>
  );
};
