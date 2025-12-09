import type { LucideIcon } from "lucide-react";

interface CreateSLideHeaderProps {
  label: string;
  title1: string;
  title2: string;
  description: string;
  icon: LucideIcon;
}

const CreateSLideHeader = ({
  label,
  title1,
  title2,
  description,
  icon: Icon,
}: CreateSLideHeaderProps) => {
  return (
    <div className="text-center space-y-3">
      <div className="flex items-center justify-center gap-2 mb-2">
        <Icon className="h-6 w-6 text-primary" />
        <span className="text-sm font-semibold text-primary uppercase tracking-wide">
          {label}
        </span>
      </div>
      <h1 className="text-3xl sm:text-4xl font-bold text-foreground">
        {title1}{" "}
        <span className="bg-linear-to-r from-primary to-primary/70 bg-clip-text text-transparent">
          {title2}
        </span>
      </h1>
      <p className="text-base text-muted-foreground max-w-md mx-auto">
        {description}
      </p>
    </div>
  );
};

export default CreateSLideHeader;
