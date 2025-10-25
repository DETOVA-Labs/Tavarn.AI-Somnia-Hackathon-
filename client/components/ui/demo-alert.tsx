import { ShieldAlert } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export function DemoAlert() {
  return (
    <Alert className="mb-8 glass-effect neon-border border-yellow-500/30">
      <ShieldAlert className="h-4 w-4 text-yellow-500" />
      <AlertTitle className="text-yellow-500">Demonstration Mode</AlertTitle>
      <AlertDescription>
        The data on this page is for presentation purposes only and does not represent live data.
      </AlertDescription>
    </Alert>
  );
}
