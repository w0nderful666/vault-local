import { useState, useEffect, useRef } from "react";
import { Copy, Check } from "lucide-react";
import { Button } from "./Button";
import { copyTextToClipboard } from "@/lib/clipboardUtils";

type CopyButtonProps = {
  copiedLabel: string;
  label: string;
  onCopied?: () => void;
  onError?: () => void;
  text: string;
};

export function CopyButton({ copiedLabel, label, onCopied, onError, text }: CopyButtonProps) {
  const [state, setState] = useState<"idle" | "success" | "error">("idle");
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current !== null) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  const onClick = async () => {
    try {
      await copyTextToClipboard(text);
      setState("success");
      onCopied?.();
      if (timerRef.current !== null) {
        clearTimeout(timerRef.current);
      }
      timerRef.current = setTimeout(() => setState("idle"), 1600);
    } catch {
      setState("error");
      onError?.();
      if (timerRef.current !== null) {
        clearTimeout(timerRef.current);
      }
      timerRef.current = setTimeout(() => setState("idle"), 2000);
    }
  };

  return (
    <Button
      data-copy-state={state}
      data-testid="copy-button"
      icon={state === "success" ? <Check size={17} /> : <Copy size={17} />}
      onClick={onClick}
      variant={state === "success" ? "primary" : "secondary"}
    >
      {state === "success" ? copiedLabel : label}
    </Button>
  );
}
