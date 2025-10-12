import React from "react";
import { View, Text, Pressable, type PressableProps } from "react-native";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

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
  description: string;
  points: number;
  currentTesters: number;
  maxTesters: number;
  imageUrl?: string;
  onActionPress?: () => void;
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
            <Text className="text-main text-title-4">{appName}</Text>
            <Text className="text-main text-desc-2">{description}</Text>
          </View>
          <Text className="text-sub text-desc-3">
            획득 포인트 {points}P · 테스터 정원 {currentTesters}/{maxTesters}
          </Text>
        </View>
      </View>

      {/* Action Button */}
      <Pressable onPress={onActionPress}>
        <Text className={actionTextVariants({ variant })}>참여하기</Text>
      </Pressable>
    </Pressable>
  );
}
