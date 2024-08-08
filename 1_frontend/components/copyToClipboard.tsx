import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Clipboard, ClipboardCheckIcon } from "lucide-react";

export default function CopyToClipboard({
  value,
  label = "Copy Invoice",
}: {
  value: string;
  label?: string;
}) {
  const [copied, setCopied] = useState(false);
  const copyToClipboard = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  return (
    <Button
      className="p-2 px-4 w-[175px] bg-purple-500 text-white rounded-lg text-[16px]"
      onClick={() => copyToClipboard()}
    >
      {copied ? (
        <ClipboardCheckIcon className="mr-2 h-4 w-4" />
      ) : (
        <Clipboard className="mr-2 h-4 w-4" />
      )}
      {label}
    </Button>
  );
}
