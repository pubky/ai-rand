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
    <button
      className={`p-3 w-[170px] text-white rounded-full transition-all bg-purple-500 hover:bg-[#E640A3] hover:text-[#E7E4E8] hover:shadow-yellow-200 hover:border-[#E640A3]`}
      onClick={() => copyToClipboard()}
    >
      {copied ? (
        <ClipboardCheckIcon className="inline mr-2 h-4 w-4" />
      ) : (
        <Clipboard className="inline mr-2 h-4 w-4" />
      )}
      {copied ? "Copied" : label}
    </button>
  );
}
