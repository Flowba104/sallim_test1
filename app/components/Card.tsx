import { View, ViewProps } from "react-native";
import { radius, shadow, space, useColors } from "../theme";

export default function Card({ style, ...rest }: ViewProps) {
  const c = useColors();
  return <View {...rest} style={[{ padding: space.page, gap: space.md, borderRadius: radius.md, borderWidth: 1,
    borderColor: c.divider, backgroundColor: c.surface, ...shadow.card }, style]} />;
}
