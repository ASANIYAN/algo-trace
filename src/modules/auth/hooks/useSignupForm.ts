import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import type { UseMutationResult } from "@tanstack/react-query";
import { toast } from "sonner";
import { useAuth } from "@/contexts/auth-contexts";
import { useState } from "react";
import type { SignupFormType } from "../utils/validation";
import { signupSchema } from "../utils/validation";

type UseSignupFormReturn = {
  form: ReturnType<typeof useForm<SignupFormType>>;
  mutation: UseMutationResult<void, Error, SignupFormType, unknown>;
  isLoading: boolean;
  success: boolean;
  email: string;
};

export const useSignupForm = (): UseSignupFormReturn => {
  const { signUp } = useAuth();
  const [success, setSuccess] = useState(false);
  const [email, setEmail] = useState("");

  const form = useForm<SignupFormType>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: SignupFormType) => {
      await signUp(data.email, data.password);
      setEmail(data.email);
    },
    onSuccess: () => {
      toast.success(
        "Account created successfully! Check your email for confirmation.",
      );
      setSuccess(true);
    },
    onError: (error: Error) => {
      console.error("Signup error:", error);
      toast.error(
        error.message || "Failed to create account. Please try again.",
      );
    },
  });

  return {
    form,
    mutation,
    isLoading: mutation.isPending,
    success,
    email,
  };
};
