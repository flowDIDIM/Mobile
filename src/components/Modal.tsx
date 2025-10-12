import React from "react";
import { View, Text, Modal as RNModal, type ModalProps } from "react-native";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Button } from "./Button";

const modalVariants = cva("bg-gray-800 rounded-t-lg overflow-hidden", {
  variants: {
    size: {
      small: "h-64",
      medium: "h-96",
      large: "h-[32rem]",
    },
  },
  defaultVariants: {
    size: "medium",
  },
});

interface CustomModalProps
  extends Omit<ModalProps, "children">,
    VariantProps<typeof modalVariants> {
  title: string;
  buttonText?: string;
  onButtonPress?: () => void;
  children?: React.ReactNode;
  className?: string;
}

export function Modal({
  title,
  buttonText = "확인",
  onButtonPress,
  children,
  size = "medium",
  className,
  visible = false,
  ...props
}: CustomModalProps) {
  return (
    <RNModal
      visible={visible}
      transparent
      animationType="slide"
      statusBarTranslucent
      {...props}
    >
      <View className="flex-1 justify-end bg-black/50">
        <View className={cn(modalVariants({ size }), className)}>
          {/* Handle Bar */}
          <View className="items-center pt-2">
            <View className="w-8 h-1.5 bg-gray-200 rounded-full" />
          </View>

          {/* Title */}
          <Text className="text-main text-title-1 text-center mt-16">
            {title}
          </Text>

          {/* Content */}
          <View className="flex-1 items-center justify-center px-5">
            {children}
          </View>

          {/* Button */}
          <View className="px-5 pb-5">
            <Button variant="standard" onPress={onButtonPress}>
              {buttonText}
            </Button>
          </View>
        </View>
      </View>
    </RNModal>
  );
}
