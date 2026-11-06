import { Text, View } from "react-native";
import CategoryIcon from "./CategoryIcon";
import { radius, sizes, space, typography, useCategoryColors } from "../theme";

export default function CategoryBadge({ category }: { category: string }) {
  const c = useCategoryColors(category);
  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: space.chipGap, alignSelf: "flex-start", paddingHorizontal: space.chipX,
      paddingVertical: space.chipY, borderRadius: radius.pill, backgroundColor: c.bg }}>
      <CategoryIcon category={category} size={sizes.iconSmall} color={c.text} />
      <Text style={{ ...typography.label, color: c.text }}>{category}</Text>
    </View>
  );
}
