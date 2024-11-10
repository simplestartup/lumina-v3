import { type ToastActionElement } from "@/components/ui/toast";
import { useToast as useToastHook } from "@/hooks/use-toast";

export type ToastProps = {
  action?: ToastActionElement;
  description?: React.ReactNode;
  title?: React.ReactNode;
};

export { useToastHook as useToast };
