"use client";

import { useMemo } from "react";
import { formatDateToLocal } from "@/lib/timezone";

export function LocalDateTimeText({ value, options }: any) {
  const formattedValue = useMemo(
    () => formatDateToLocal(value, options),
    [value, options],
  );

  return <span suppressHydrationWarning>{formattedValue}</span>;
}
