import { Controller, type Control } from "react-hook-form";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";
import { Field, FieldDescription, FieldError, FieldLabel } from "../ui/field";
import { BaseTextarea } from "./base-textarea";

interface FormTextareaProps {
  error?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<any>;
  name: string;
  label?: string;
  tip?: string;
  append?: ReactNode;
  prepend?: ReactNode;
  textareaClassName?: string;
  containerClassName?: string;
  formLabelClassName?: string;
  description?: string;
}

const FormTextarea: React.FC<
  FormTextareaProps & React.TextareaHTMLAttributes<HTMLTextAreaElement>
> = ({
  name,
  label,
  control,
  tip,
  textareaClassName,
  containerClassName,
  formLabelClassName,
  description,
  ...rest
}) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <div className="space-y-2.5">
            {label && (
              <FieldLabel
                htmlFor={field.name}
                className={cn(
                  `text-graphite text-sm sm:text-base`,
                  formLabelClassName,
                )}
              >
                {label}
              </FieldLabel>
            )}
            <BaseTextarea
              {...field}
              id={field.name}
              tip={tip}
              containerClassName={containerClassName}
              aria-invalid={fieldState.invalid}
              className={cn(
                `focus-visible:ring-0 shadow-none`,
                textareaClassName,
              )}
              {...rest}
            />
          </div>
          {description && <FieldDescription>{description}</FieldDescription>}
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  );
};

export default FormTextarea;
