import { Controller, type Control } from "react-hook-form";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";
import { Field, FieldDescription, FieldError, FieldLabel } from "../ui/field";
import { BaseInput } from "./base-input";

interface FormInputProps {
  error?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<any>;
  name: string;
  label?: string;
  tip?: string; // Specific to your design
  append?: ReactNode;
  prepend?: ReactNode;
  description?: string;
  inputClassName?: string;
  containerClassName?: string;
  formLabelClassName?: string;
}

const FormInput: React.FC<
  FormInputProps & React.InputHTMLAttributes<HTMLInputElement>
> = ({
  name,
  label,
  control,
  tip,
  inputClassName,
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
            <BaseInput
              {...field}
              id={field.name}
              tip={tip}
              containerClassName={containerClassName}
              aria-invalid={fieldState.invalid}
              className={cn(`focus-visible:ring-0 shadow-none`, inputClassName)}
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

export default FormInput;
