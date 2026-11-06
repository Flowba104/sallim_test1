import { Text, View } from "react-native";
import Button from "./Button";
import { space, typography, useColors } from "../theme";

export default function EmptyState({ title, body, actionLabel, onAction }: {
  title: string; body?: string; actionLabel?: string; onAction?: () => void;
}) {
  const c = useColors();
  return (
    <View style={{ alignItems: "center", gap: space.smPlus, padding: space.xl }}>
      <Text accessibilityRole="header" style={{ ...typography.section, color: c.text, textAlign: "center" }}>{title}</Text>
      {body && <Text style={{ ...typography.body, color: c.subtext, textAlign: "center" }}>{body}</Text>}
      {actionLabel && onAction && <Button label={actionLabel} onPress={onAction} />}
    </View>
  );
}
