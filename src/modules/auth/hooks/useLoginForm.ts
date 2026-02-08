import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import type { UseMutationResult } from "@tanstack/react-query";
import { toast } from "sonner";
import { useAuth } from "@/contexts/auth-contexts";
import { useNavigate } from "react-router-dom";
import type { LoginFormType } from "../utils/validation";
import { loginSchema } from "../utils/validation";

type UseLoginFormReturn = {
  form: ReturnType<typeof useForm<LoginFormType>>;
  mutation: UseMutationResult<void, Error, LoginFormType, unknown>;
  isLoading: boolean;
};

export const useLoginForm = (): UseLoginFormReturn => {
  const navigate = useNavigate();
  const { signIn } = useAuth();

  const form = useForm<LoginFormType>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: LoginFormType) => {
      await signIn(data.email, data.password);
    },
    onSuccess: () => {
      toast.success("Successfully signed in!");
      navigate("/");
    },
    onError: (error: Error) => {
      console.error("Login error:", error);
      toast.error(error.message || "Failed to sign in. Please try again.");
    },
  });

  return {
    form,
    mutation,
    isLoading: mutation.isPending,
  };
};
