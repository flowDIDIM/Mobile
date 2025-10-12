import React from "react";
import { TextInput, View, type TextInputProps } from "react-native";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const boxFieldVariants = cva(
  "bg-white/[0.04] border border-white/[0.08] rounded h-11 px-3 text-desc-1 text-sub",
  {
    variants: {
      variant: {
        default: "",
        error: "border-error",
        success: "border-primary",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

interface BoxFieldProps
  extends TextInputProps,
    VariantProps<typeof boxFieldVariants> {
  className?: string;
}

export function BoxField({
  variant = "default",
  className,
  placeholderTextColor = "#919DA1",
  ...props
}: BoxFieldProps) {
  return (
    <View className="relative">
      <TextInput
        className={cn(boxFieldVariants({ variant }), className)}
        placeholderTextColor={placeholderTextColor}
        {...props}
      />
    </View>
  );
}
