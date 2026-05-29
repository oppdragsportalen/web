"use client";

import type { CSSProperties } from "react";

import { cn } from "@/lib/utils";

type RichTextViewProps = {
  content: string;
  className?: string;
  tone?: "default" | "inverse";
};

const inverseToneStyles = {
  color: "inherit",
  ["--color-bg-secondary"]: "rgba(255, 255, 255, 0.14)",
  ["--color-text-secondary-foreground"]: "rgba(255, 255, 255, 0.92)",
  ["--color-border"]: "rgba(255, 255, 255, 0.25)",
  ["--color-text-muted-foreground"]: "rgba(255, 255, 255, 0.8)",
  ["--color-bg-accent"]: "rgba(255, 255, 255, 0.18)",
  ["--color-text-accent-foreground"]: "rgba(255, 255, 255, 1)",
} as CSSProperties;

export function RichTextView({
  content,
  className,
  tone = "default",
}: RichTextViewProps) {
  if (!content || content.trim() === "") {
    return null;
  }

  return (
    <div
      className={cn("tiptap wrap-break-word", className)}
      style={tone === "inverse" ? inverseToneStyles : undefined}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}
