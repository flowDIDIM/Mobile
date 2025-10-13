import React from "react";
import { View, type ViewProps } from "react-native";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Desc2 } from "./Typography";

const toastVariants = cva(
  "bg-white/[0.04] border border-white/[0.08] rounded px-3 py-3 flex-row items-center gap-1",
  {
    variants: {
      variant: {
        info: "",
        success: "",
        error: "",
      },
    },
    defaultVariants: {
      variant: "info",
    },
  },
);

interface ToastProps extends ViewProps, VariantProps<typeof toastVariants> {
  message: string;
  className?: string;
}

export function Toast({
  variant = "info",
  message,
  className,
  ...props
}: ToastProps) {
  return (
    <View className={cn(toastVariants({ variant }), className)} {...props}>
      {/* Info Icon - 6x6 placeholder */}
      <View className="w-1.5 h-1.5" />
      <Desc2>{message}</Desc2>
    </View>
  );
}
