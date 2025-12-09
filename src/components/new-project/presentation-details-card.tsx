import { motion } from "framer-motion";
import { FileText, CheckCircle } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Input } from "../ui/input";

interface PresentationDetailsCardProps {
  title: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  placeholder?: string;
  description?: string;
}

export const PresentationDetailsCard = ({
  title,
  onChange,
  disabled = false,
  placeholder = "E.g., Digital Marketing Strategy 2025",
  description = "Set your presentation title",
}: PresentationDetailsCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary" />
          Presentation Details
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-foreground">
            Presentation Title *
          </label>
          <Input
            value={title}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="text-base"
            disabled={disabled}
          />
        </div>

        {title.trim() && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400"
          >
            <CheckCircle className="h-4 w-4" />
            <span>Title set</span>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
};
