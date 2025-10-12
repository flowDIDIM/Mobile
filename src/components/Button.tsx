import React from "react";
import { Pressable, Text, type PressableProps } from "react-native";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "flex-row items-center justify-center h-[41px] px-2.5 rounded-lg gap-2.5",
  {
    variants: {
      variant: {
        standard: "bg-secondary",
        disabled: "bg-white/[0.04] border border-white/[0.08]",
        error: "bg-error",
      },
    },
    defaultVariants: {
      variant: "standard",
    },
  },
);

interface ButtonProps
  extends Omit<PressableProps, "disabled">,
    VariantProps<typeof buttonVariants> {
  children: string;
  disabled?: boolean;
  className?: string;
}

export function Button({
  variant = "standard",
  children,
  disabled = false,
  className,
  ...props
}: ButtonProps) {
  const actualVariant = disabled ? "disabled" : variant;

  return (
    <Pressable
      className={cn(buttonVariants({ variant: actualVariant }), className)}
      disabled={disabled}
      {...props}
    >
      <Text className="text-main text-title-3 text-center">{children}</Text>
    </Pressable>
  );
}
