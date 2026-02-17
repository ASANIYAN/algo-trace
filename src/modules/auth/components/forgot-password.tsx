import { MailCheck, ArrowLeft } from "lucide-react";
import FormInput from "@/components/common/form-input";
import { useNavigate } from "react-router-dom";
import { useForgotPasswordForm } from "../hooks/useForgotPasswordForm";
import { BaseButton } from "@/components/common/base-button";

const ForgotPasswordForm = () => {
  const navigate = useNavigate();
  const { form, mutation, isLoading, submitted, setSubmitted } =
    useForgotPasswordForm();
  const { control, handleSubmit } = form;

  const onSubmit = (data: { email: string }) => {
    mutation.mutate(data);
  };

  if (submitted) {
    return (
      <div className="space-y-2.5">
        <div className="flex justify-center">
          <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center">
            <MailCheck color="#fff" className="w-7 h-7 text-primary" />
          </div>
        </div>

        <div className="space-y-1 text-sm text-muted-foreground text-center">
          <p>Click the link in the email to reset your password.</p>
          <p>Didn't receive an email? Check your spam folder or .</p>
          <BaseButton
            onClick={() => setSubmitted(false)}
            className="text-white font-light mt-2.5 text-sm"
          >
            Try a different email
          </BaseButton>
        </div>

        <BaseButton
          variant="ghost"
          className="w-full h-12"
          leftIcon={<ArrowLeft className="size-5" />}
          onClick={() => navigate("/login")}
        >
          Back to Login
        </BaseButton>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <FormInput
            control={control}
            name="email"
            type="email"
            label="Email"
            placeholder="you@example.com"
            autoComplete="email"
            autoFocus
            required
          />
        </div>

        <BaseButton
          type="submit"
          className="w-full"
          loading={isLoading}
          disabled={isLoading}
        >
          {isLoading ? " Sending link..." : "Send Reset Link"}
        </BaseButton>
      </form>

      <BaseButton
        variant="ghost"
        className="w-full h-12"
        leftIcon={<ArrowLeft className="size-5" />}
        onClick={() => navigate("/login")}
      >
        Back to Login
      </BaseButton>
    </div>
  );
};

export default ForgotPasswordForm;
