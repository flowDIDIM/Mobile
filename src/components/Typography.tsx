import { Text as RNText, type TextProps as RNTextProps } from "react-native";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

// Base text variants with typography styles
const typographyVariants = cva("", {
  variants: {
    variant: {
      "title-1": "text-title-1 font-semibold text-main",
      "title-2": "text-title-2 font-semibold text-main",
      "title-3": "text-title-3 font-semibold text-main",
      "title-4": "text-title-4 font-semibold text-main",
      "desc-1": "text-desc-1 font-sans text-sub",
      "desc-2": "text-desc-2 font-sans text-sub",
      "desc-3": "text-desc-3 font-sans text-sub",
      "body-3": "text-body-3 font-sans text-main",
      "headline-1": "text-headline-1 font-semibold text-main",
      "headline-2": "text-headline-2 font-semibold text-main",
      button: "text-button font-semibold text-main",
    },
  },
  defaultVariants: {
    variant: "body-3",
  },
});

interface TypographyProps
  extends RNTextProps,
    VariantProps<typeof typographyVariants> {
  className?: string;
}

// Base Typography component
export function Typography({ variant, className, ...props }: TypographyProps) {
  return (
    <RNText
      className={cn(typographyVariants({ variant }), className)}
      {...props}
    />
  );
}

// Specialized components for each typography style
export function Title1({
  className,
  ...props
}: Omit<TypographyProps, "variant">) {
  return <Typography variant="title-1" className={className} {...props} />;
}

export function Title2({
  className,
  ...props
}: Omit<TypographyProps, "variant">) {
  return <Typography variant="title-2" className={className} {...props} />;
}

export function Title3({
  className,
  ...props
}: Omit<TypographyProps, "variant">) {
  return <Typography variant="title-3" className={className} {...props} />;
}

export function Title4({
  className,
  ...props
}: Omit<TypographyProps, "variant">) {
  return <Typography variant="title-4" className={className} {...props} />;
}

export function Desc1({
  className,
  ...props
}: Omit<TypographyProps, "variant">) {
  return <Typography variant="desc-1" className={className} {...props} />;
}

export function Desc2({
  className,
  ...props
}: Omit<TypographyProps, "variant">) {
  return <Typography variant="desc-2" className={className} {...props} />;
}

export function Desc3({
  className,
  ...props
}: Omit<TypographyProps, "variant">) {
  return <Typography variant="desc-3" className={className} {...props} />;
}

export function Body3({
  className,
  ...props
}: Omit<TypographyProps, "variant">) {
  return <Typography variant="body-3" className={className} {...props} />;
}

export function Headline1({
  className,
  ...props
}: Omit<TypographyProps, "variant">) {
  return <Typography variant="headline-1" className={className} {...props} />;
}

export function Headline2({
  className,
  ...props
}: Omit<TypographyProps, "variant">) {
  return <Typography variant="headline-2" className={className} {...props} />;
}

export function ButtonText({
  className,
  ...props
}: Omit<TypographyProps, "variant">) {
  return <Typography variant="button" className={className} {...props} />;
}
