import React from "react";
import { View, Pressable, type PressableProps } from "react-native";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Title4, Desc3, ButtonText } from "./Typography";

const cardVariants = cva(
  "bg-white/[0.04] border border-white/[0.08] rounded-xl px-3 flex-row items-center justify-between h-20",
  {
    variants: {
      variant: {
        standard: "",
        disabled: "",
        error: "",
      },
    },
    defaultVariants: {
      variant: "standard",
    },
  },
);

const actionTextVariants = cva("text-button text-right", {
  variants: {
    variant: {
      standard: "text-primary",
      disabled: "text-sub",
      error: "text-error",
    },
  },
  defaultVariants: {
    variant: "standard",
  },
});

interface CardProps extends PressableProps, VariantProps<typeof cardVariants> {
  appName: string;
  description?: string;
  points?: number;
  currentTesters: number;
  maxTesters: number;
  imageUrl?: string;
  onActionPress?: () => void;
  actionText?: string;
  className?: string;
}

export function Card({
  variant = "standard",
  appName,
  description,
  points,
  currentTesters,
  maxTesters,
  imageUrl,
  onActionPress,
  actionText = "참여하기",
  className,
  ...props
}: CardProps) {
  return (
    <Pressable className={cn(cardVariants({ variant }), className)} {...props}>
      <View className="flex-row items-center gap-3 flex-1">
        {/* App Icon */}
        <View className="w-14 h-14 bg-main rounded-lg" />

        {/* App Info */}
        <View className="h-12 justify-between flex-1">
          <View className="gap-0.5">
            <Title4>{appName}</Title4>
            {description && <Desc3>{description}</Desc3>}
          </View>
          <Desc3>
            {points !== undefined && `획득 포인트 ${points}P · `}테스터 수{" "}
            {currentTesters}/{maxTesters}
          </Desc3>
        </View>
      </View>

      {/* Action Button */}
      <Pressable onPress={onActionPress}>
        <ButtonText className={actionTextVariants({ variant })}>
          {actionText}
        </ButtonText>
      </Pressable>
    </Pressable>
  );
}
