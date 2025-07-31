"use client";

import { CopyToClipboard } from "react-copy-to-clipboard";
import { ReactNode } from "react";
import { toast } from "sonner";

export default function ({
  text,
  children,
}: {
  text: string;
  children: ReactNode;
}) {
  const handleCopy = () => {
    try {
      toast.success("Copied");
    } catch (error) {
      console.warn("Copy to clipboard is not supported in this browser");
      toast.error("Copy not supported in this browser");
    }
  };

  return (
    <CopyToClipboard text={text} onCopy={handleCopy}>
      <div className="cursor-pointer">{children}</div>
    </CopyToClipboard>
  );
}
