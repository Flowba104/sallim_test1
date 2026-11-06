import { Text, View } from "react-native";
import CategoryIcon from "./CategoryIcon";
import { radius, sizes, space, typography, useColors } from "../theme";

export default function CategoryBadge({ category }: { category: string }) {
  const c = useColors();
  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: space.chipGap, alignSelf: "flex-start", paddingHorizontal: space.chipX,
      paddingVertical: space.chipY, borderRadius: radius.pill, backgroundColor: c.tint }}>
      <CategoryIcon category={category} size={sizes.iconSmall} color={c.primary} />
      <Text style={{ ...typography.label, color: c.primary }}>{category}</Text>
    </View>
  );
}
