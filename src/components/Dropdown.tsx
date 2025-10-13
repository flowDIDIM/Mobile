import React, { useState } from "react";
import {
  View,
  Text,
  Pressable,
  FlatList,
  Modal,
  type ViewProps,
} from "react-native";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react-native";

const dropdownVariants = cva(
  "bg-white/[0.04] border border-white/[0.08] rounded h-11 px-3 flex-row items-center justify-between",
  {
    variants: {
      variant: {
        default: "",
        error: "border-error",
        open: "border-primary",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface DropdownOption {
  label: string;
  value: string;
}

interface DropdownProps
  extends Omit<ViewProps, "children">,
    VariantProps<typeof dropdownVariants> {
  options: DropdownOption[];
  value?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export function Dropdown({
  options,
  value,
  onValueChange,
  placeholder = "선택해주세요",
  disabled = false,
  variant = "default",
  className,
  ...props
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);

  const selectedOption = options.find((opt) => opt.value === value);
  const displayText = selectedOption?.label || placeholder;

  const handleSelect = (selectedValue: string) => {
    onValueChange?.(selectedValue);
    setIsOpen(false);
  };

  const actualVariant = isOpen ? "open" : variant;

  return (
    <>
      <Pressable
        onPress={() => !disabled && setIsOpen(true)}
        disabled={disabled}
        {...props}
      >
        <View
          className={cn(
            dropdownVariants({ variant: actualVariant }),
            className,
          )}
        >
          <Text
            className={cn(
              "text-desc-1",
              selectedOption ? "text-main" : "text-gray-500",
            )}
          >
            {displayText}
          </Text>
          <ChevronDown
            size={20}
            color={selectedOption ? "#F1F3F3" : "#919DA1"}
          />
        </View>
      </Pressable>

      <Modal
        visible={isOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsOpen(false)}
      >
        <Pressable
          className="flex-1 bg-black/50"
          onPress={() => setIsOpen(false)}
        >
          <View className="flex-1 justify-center px-7">
            <Pressable onPress={(e) => e.stopPropagation()}>
              <FlatList
                data={options}
                keyExtractor={(item) => item.value}
                renderItem={({ item }) => (
                  <Pressable
                    onPress={() => handleSelect(item.value)}
                    className="px-4 py-3 border-b border-white/[0.08]"
                  >
                    <Text
                      className={cn(
                        "text-desc-1",
                        item.value === value ? "text-primary" : "text-main",
                      )}
                    >
                      {item.label}
                    </Text>
                  </Pressable>
                )}
                className="bg-gray-800 rounded-lg border border-white/[0.08] max-h-[300px]"
              />
            </Pressable>
          </View>
        </Pressable>
      </Modal>
    </>
  );
}
