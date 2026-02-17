import { useState } from "react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/contexts/auth-contexts";
import { forgotPasswordSchema } from "../utils/forgotPasswordValidation";
import type { ForgotPasswordFormType } from "../utils/forgotPasswordValidation";

export const useForgotPasswordForm = () => {
  const { resetPassword } = useAuth();
  const [submitted, setSubmitted] = useState(false);

  const form = useForm<ForgotPasswordFormType>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const mutation = useMutation({
    mutationFn: async (data: ForgotPasswordFormType) => {
      await resetPassword(data.email);
    },
    onSuccess: () => {
      setSubmitted(true);
      toast.success(
        "If an account with that email exists, a password reset link has been sent. Please check your email.",
      );
    },
    onError: (err: Error) => {
      toast.error(
        err.message ||
          "If an account with that email exists, a password reset link has been sent. Please check your email.",
      );
      //    toast.success(
      //     "If an account with that email exists, a password reset link has been sent. Please check your email.",
      //   );
    },
  });

  return {
    form,
    mutation,
    isLoading: mutation.isPending,
    submitted,
    setSubmitted,
  };
};
