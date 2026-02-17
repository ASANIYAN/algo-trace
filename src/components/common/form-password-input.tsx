import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Controller, type Control } from "react-hook-form";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";
import { Field, FieldDescription, FieldError, FieldLabel } from "../ui/field";
import { BaseInput } from "./base-input";

interface FormPasswordInputProps {
  error?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<any>;
  name: string;
  label?: string;
  tip?: string;
  append?: ReactNode;
  prepend?: ReactNode;
  description?: string;
  inputClassName?: string;
  containerClassName?: string;
  formLabelClassName?: string;
}

const FormPasswordInput: React.FC<
  FormPasswordInputProps &
    Omit<React.InputHTMLAttributes<HTMLInputElement>, "type">
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
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);

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
                  `text-graphite text-sm sm:text-base text-white`,
                  formLabelClassName,
                )}
              >
                {label}
              </FieldLabel>
            )}
            <div className={cn("relative", containerClassName)}>
              <BaseInput
                {...field}
                id={field.name}
                tip={tip}
                type={showPassword ? "text" : "password"}
                aria-invalid={fieldState.invalid}
                className={cn(
                  `focus-visible:ring-0 shadow-none text-white! pr-10`,
                  inputClassName,
                )}
                {...rest}
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:opacity-80 focus:outline-none"
                tabIndex={-1}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
          {description && <FieldDescription>{description}</FieldDescription>}
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  );
};

export default FormPasswordInput;
