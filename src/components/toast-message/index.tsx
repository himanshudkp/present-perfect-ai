import { CheckCircle2, XCircle } from "lucide-react";
import { toast } from "sonner";

export const showSuccess = (message: string, description?: string) => {
  toast.success(message, {
    description,
    duration: 3000,
    icon: <CheckCircle2 className="h-5 w-5" />,
    className:
      "group-[.toaster]:bg-green-50 group-[.toaster]:text-green-900 group-[.toaster]:border-green-200",
    descriptionClassName: "group-[.toast]:text-green-700",
  });
};

export const showError = (message: string, description?: string) => {
  toast.error(message, {
    description,
    duration: 3000,
    icon: <XCircle className="h-5 w-5" />,
    className:
      "group-[.toaster]:bg-red-50 group-[.toaster]:text-red-900 group-[.toaster]:border-red-200",
    descriptionClassName: "group-[.toast]:text-red-700",
  });
};
