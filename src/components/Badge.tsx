import React from "react";
import { View, type ViewProps } from "react-native";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { ButtonText } from "./Typography";

const badgeVariants = cva(
  "flex-row items-center justify-center px-1.5 py-0.5 rounded-full gap-2.5",
  {
    variants: {
      variant: {
        done: "bg-[#BFD9FF]",
        pending: "bg-[#FFE4E4]",
      },
    },
    defaultVariants: {
      variant: "done",
    },
  },
);

const badgeTextVariants = cva("text-center", {
  variants: {
    variant: {
      done: "text-primary",
      pending: "text-error",
    },
  },
  defaultVariants: {
    variant: "done",
  },
});

interface BadgeProps extends ViewProps, VariantProps<typeof badgeVariants> {
  label: string;
  className?: string;
}

export function Badge({
  variant = "done",
  label,
  className,
  ...props
}: BadgeProps) {
  return (
    <View className={cn(badgeVariants({ variant }), className)} {...props}>
      <ButtonText className={badgeTextVariants({ variant })}>
        {label}
      </ButtonText>
    </View>
  );
}
