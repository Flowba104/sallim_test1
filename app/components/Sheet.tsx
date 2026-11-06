import { ReactNode, useEffect, useState } from "react";
import { Modal, Pressable, View } from "react-native";
import Animated, { Easing, FadeIn, FadeOut, SlideInDown, SlideOutDown } from "react-native-reanimated";
import { motion, radius, sizes, space, useColors } from "../theme";

// 바텀시트. 바깥 탭·뒤로가기·닫기 버튼으로 닫힌다. 닫힐 때 exit 애니메이션이 끝날 때까지 Modal 유지.
export default function Sheet({ visible, onClose, children }: { visible: boolean; onClose: () => void; children: ReactNode }) {
  const c = useColors();
  const [mounted, setMounted] = useState(visible);
  useEffect(() => {
    if (visible) { setMounted(true); return; }
    const id = setTimeout(() => setMounted(false), motion.sheetExitMs);
    return () => clearTimeout(id);
  }, [visible]);
  return (
    <Modal visible={mounted} transparent animationType="none" onRequestClose={onClose} statusBarTranslucent>
      <View style={{ flex: 1, justifyContent: "flex-end" }}>
        {visible && (
          <>
            <Animated.View entering={FadeIn.duration(motion.screenMs)} exiting={FadeOut.duration(motion.sheetExitMs)}
              style={{ position: "absolute", top: 0, bottom: 0, left: 0, right: 0, backgroundColor: c.overlay }}>
              <Pressable accessibilityRole="button" accessibilityLabel="닫기" style={{ flex: 1 }} onPress={onClose} />
            </Animated.View>
            <Animated.View entering={SlideInDown.duration(motion.sheetEnterMs).easing(Easing.bezier(...motion.easing.enter))}
              exiting={SlideOutDown.duration(motion.sheetExitMs).easing(Easing.bezier(...motion.easing.exit))}
              style={{ padding: space.page, paddingBottom: space.xl, gap: space.md, maxHeight: "85%", borderTopLeftRadius: radius.lg, borderTopRightRadius: radius.lg, backgroundColor: c.surfaceRaised }}>
              <View style={{ alignSelf: "center", width: sizes.sheetHandleWidth, height: sizes.sheetHandleHeight, borderRadius: radius.pill, backgroundColor: c.border }} />
              {children}
            </Animated.View>
          </>
        )}
      </View>
    </Modal>
  );
}
