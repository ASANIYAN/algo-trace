import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { problemSchema, type ProblemFormValues } from "../utils/validations";

interface UseProblemFormProps {
  onSubmit: (problem: string) => void;
}

export const useProblemForm = ({ onSubmit }: UseProblemFormProps) => {
  const { control, handleSubmit, reset } = useForm<ProblemFormValues>({
    resolver: zodResolver(problemSchema),
    defaultValues: {
      problem: "",
    },
  });

  const handleFormSubmit = handleSubmit((data) => {
    onSubmit(data.problem);
  });

  return {
    control,
    handleFormSubmit,
    reset,
  };
};
