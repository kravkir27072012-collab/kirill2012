import { ShieldCheck, ShieldAlert, ShieldQuestion } from "lucide-react";

import type { AuthenticityAssessment } from "@/types/marketplace";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

const LEVEL_CONFIG = {
  likely_original: { variant: "success" as const, icon: ShieldCheck },
  uncertain: { variant: "warning" as const, icon: ShieldQuestion },
  high_risk: { variant: "destructive" as const, icon: ShieldAlert },
};

interface AuthenticityBadgeProps {
  assessment: AuthenticityAssessment;
  className?: string;
}

export function AuthenticityBadge({ assessment, className }: AuthenticityBadgeProps) {
  const { variant, icon: Icon } = LEVEL_CONFIG[assessment.level];

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Badge variant={variant} className={cn("cursor-help", className)}>
          <Icon />
          {assessment.label}
        </Badge>
      </TooltipTrigger>
      <TooltipContent>
        <p className="font-medium mb-1">Почему так оценили:</p>
        <ul className="list-disc pl-3.5 space-y-0.5">
          {assessment.reasons.map((reason) => (
            <li key={reason}>{reason}</li>
          ))}
        </ul>
        <p className="mt-1.5 text-muted-foreground">
          Это автоматическая оценка, а не гарантия подлинности.
        </p>
      </TooltipContent>
    </Tooltip>
  );
}
