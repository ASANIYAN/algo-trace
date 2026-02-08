import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { problemSchema, type ProblemFormValues } from "../utils/validations";

interface UseProblemFormProps {
  onSubmit: (problem: string) => void;
}

export const useProblemForm = ({ onSubmit }: UseProblemFormProps) => {
  const form = useForm<ProblemFormValues>({
    resolver: zodResolver(problemSchema),
    defaultValues: {
      problem: "",
    },
  });

  const { handleSubmit } = form;

  const handleFormSubmit = handleSubmit((data) => {
    onSubmit(data.problem);
  });

  return {
    form,
    handleFormSubmit,
  };
};
