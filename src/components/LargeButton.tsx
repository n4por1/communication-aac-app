import React from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  ViewStyle,
} from "react-native";

type Variant = "primary" | "secondary" | "danger";

type Props = {
  title: string;
  onPress: () => void;
  variant?: Variant;
  disabled?: boolean;
  style?: ViewStyle;
};

const VARIANT: Record<Variant, { bg: string; text: string }> = {
  primary: { bg: "#2563EB", text: "#FFFFFF" },
  secondary: { bg: "#F1F5F9", text: "#475569" },
  danger: { bg: "#FEE2E2", text: "#DC2626" },
};

const LargeButton: React.FC<Props> = ({
  title,
  onPress,
  variant = "primary",
  disabled = false,
  style,
}) => {
  const colors = VARIANT[variant];
  return (
    <TouchableOpacity
      style={[
        styles.button,
        { backgroundColor: colors.bg },
        disabled && styles.disabled,
        style,
      ]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.75}
      accessibilityRole="button"
    >
      <Text style={[styles.text, { color: colors.text }]}>{title}</Text>
    </TouchableOpacity>
  );
};

export default LargeButton;

const styles = StyleSheet.create({
  button: {
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 32,
    alignItems: "center",
    justifyContent: "center",
    minWidth: 200,
  },
  text: {
    fontSize: 20,
    fontWeight: "600",
    letterSpacing: 0.3,
  },
  disabled: {
    opacity: 0.4,
  },
});
