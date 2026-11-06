import { ReactNode } from "react";
import { Modal, Pressable, View } from "react-native";
import Animated, { SlideInDown, FadeIn } from "react-native-reanimated";
import { motion, radius, space, useColors } from "../theme";

// 바텀시트. 바깥을 누르거나 뒤로가기로 닫힌다.
export default function Sheet({ visible, onClose, children }: { visible: boolean; onClose: () => void; children: ReactNode }) {
  const c = useColors();
  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onClose} statusBarTranslucent>
      <View style={{ flex: 1, justifyContent: "flex-end" }}>
        <Animated.View entering={FadeIn.duration(motion.screenMs)} style={{ position: "absolute", top: 0, bottom: 0, left: 0, right: 0, backgroundColor: c.overlay }}>
          <Pressable accessibilityLabel="닫기" style={{ flex: 1 }} onPress={onClose} />
        </Animated.View>
        <Animated.View entering={SlideInDown.duration(motion.screenMs * 1.5)}
          style={{ padding: space.page, paddingBottom: space.xl, gap: space.md, borderTopLeftRadius: radius.lg, borderTopRightRadius: radius.lg, backgroundColor: c.surfaceRaised }}>
          <View style={{ alignSelf: "center", width: 40, height: 4, borderRadius: radius.pill, backgroundColor: c.border }} />
          {children}
        </Animated.View>
      </View>
    </Modal>
  );
}
