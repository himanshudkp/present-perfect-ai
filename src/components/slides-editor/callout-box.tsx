import { memo } from "react";

type CalloutType = "success" | "warning" | "info" | "question" | "caution";

interface CalloutBoxProps {
  type: CalloutType;
  children: React.ReactNode;
  className?: string;
}

const ICONS = {
  success: "CheckCircle",
  warning: "AlertTriangle",
  info: "Info",
  question: "HelpCircle",
  caution: "AlertCircle",
} as const;

const COLOR_MAP: Record<
  CalloutType,
  { bg: string; border: string; text: string }
> = {
  success: {
    bg: "bg-green-100",
    border: "border-green-500",
    text: "text-green-700",
  },
  warning: {
    bg: "bg-yellow-100",
    border: "border-yellow-500",
    text: "text-yellow-700",
  },
  info: { bg: "bg-blue-100", border: "border-blue-500", text: "text-blue-700" },
  question: {
    bg: "bg-purple-100",
    border: "border-purple-500",
    text: "text-purple-700",
  },
  caution: { bg: "bg-red-100", border: "border-red-500", text: "text-red-700" },
};

export const CalloutBox = memo(
  ({ children, type, className }: CalloutBoxProps) => {
    const colors = COLOR_MAP[type];
    const IconName = ICONS[type];

    return (
      <div
        className={`p-4 rounded-lg border-l-4 flex gap-3 items-start transition-all ${colors.bg} ${colors.border} ${colors.text} ${className}`}
        role="note"
      >
        <span className="mt-0.5 shrink-0">{IconName}</span>
        <div className="flex-1">{children}</div>
      </div>
    );
  }
);
