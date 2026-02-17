import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useAuth } from "@/contexts/auth-contexts";
import { resetPasswordSchema } from "../utils/resetPasswordValidation";
import type { ResetPasswordFormType } from "../utils/resetPasswordValidation";
import { supabase } from "@/lib/supabase";

export type PageState = "loading" | "valid" | "invalid" | "success";

export const useResetPasswordForm = () => {
  const { updatePassword } = useAuth();
  const [pageState, setPageState] = useState<PageState>("loading");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const form = useForm<ResetPasswordFormType>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  // Verify the reset token from the URL when the page loads
  useEffect(() => {
    const verifyToken = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session) {
        setPageState("valid");
      } else {
        setTimeout(async () => {
          const {
            data: { session: retrySession },
          } = await supabase.auth.getSession();
          setPageState(retrySession ? "valid" : "invalid");
        }, 1000);
      }
    };
    verifyToken();
  }, []);

  const mutation = useMutation({
    mutationFn: async (data: ResetPasswordFormType) => {
      await updatePassword(data.password);
    },
    onSuccess: () => {
      setPageState("success");
      toast.success("Password updated successfully!");
    },
    onError: (err: Error) => {
      toast.error(
        err.message || "Failed to update password. Please request a new link.",
      );
    },
  });

  return {
    form,
    mutation,
    isLoading: mutation.isPending,
    pageState,
    setPageState,
    showPassword,
    setShowPassword,
    showConfirm,
    setShowConfirm,
  };
};
