import React from "react";
import { View, Text, Pressable, type PressableProps } from "react-native";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const tabVariants = cva("px-2 py-2 flex-col items-start gap-3", {
  variants: {
    isActive: {
      true: "border-b-2 border-main",
      false: "",
    },
  },
  defaultVariants: {
    isActive: false,
  },
});

const tabTextVariants = cva("text-title-3", {
  variants: {
    isActive: {
      true: "text-main",
      false: "text-sub",
    },
  },
  defaultVariants: {
    isActive: false,
  },
});

interface TabProps extends Omit<PressableProps, "children"> {
  label: string;
  isActive?: boolean;
  className?: string;
}

function Tab({ label, isActive = false, className, ...props }: TabProps) {
  return (
    <Pressable className={cn(tabVariants({ isActive }), className)} {...props}>
      <Text className={tabTextVariants({ isActive })}>{label}</Text>
    </Pressable>
  );
}

interface TopNavProps {
  tabs: { label: string; onPress: () => void }[];
  activeIndex?: number;
  className?: string;
}

export function TopNav({ tabs, activeIndex = 0, className }: TopNavProps) {
  return (
    <View className={cn("flex-row items-center", className)}>
      {tabs.map((tab, index) => (
        <Tab
          key={tab.label}
          label={tab.label}
          isActive={index === activeIndex}
          onPress={tab.onPress}
        />
      ))}
    </View>
  );
}
