import { useCallback, useEffect, useRef, useState } from "react";
import { Image, Linking, Pressable, ScrollView, Text, View } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import * as Haptics from "expo-haptics";
import { useFocusEffect, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import Animated, { Easing, FadeInDown, useAnimatedStyle, useSharedValue, withRepeat, withTiming } from "react-native-reanimated";
import Button from "../../components/Button";
import ResultCard from "../../components/ResultCard";
import Skeleton from "../../components/Skeleton";
import { ApiError, ask } from "../../lib/api";
import type { AskResponse } from "../../lib/api-types";
import { t } from "../../lib/copy";
import { pickFromLibrary, toBase64 } from "../../lib/image";
import { addRecent } from "../../lib/recent";
import { useRegion } from "../../lib/useRegion";
import { motion, radius, sizes, space, typography, useColors } from "../../theme";

type Photo = { uri: string; width: number; height: number };

function ScanLine() {
  const c = useColors();
  const y = useSharedValue(0);
  useEffect(() => {
    y.value = withRepeat(withTiming(sizes.cameraFrameHeight - 2, { duration: motion.scanMs, easing: Easing.linear }), -1, true);
  }, [y]);
  const style = useAnimatedStyle(() => ({ transform: [{ translateY: y.value }] }));
  return <Animated.View style={[{ position: "absolute", left: 0, right: 0, height: 2, backgroundColor: c.onCamera }, style]} />;
}

export default function Capture() {
  const c = useColors();
  const router = useRouter();
  const regionId = useRegion();
  const [perm, requestPerm] = useCameraPermissions();
  const cam = useRef<CameraView>(null);
  const [ready, setReady] = useState(false);
  const [photo, setPhoto] = useState<Photo | null>(null);
  const [b64, setB64] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [slow, setSlow] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [result, setResult] = useState<AskResponse | null>(null);
  const [n, setN] = useState(0);
  const job = useRef(0); // 취소·재시도 후 늦게 온 응답 무시용
  const [focused, setFocused] = useState(true);

  useFocusEffect(useCallback(() => { setFocused(true); return () => { setFocused(false); job.current++; }; }, []));
  useEffect(() => {
    if (!busy) { setSlow(false); return; }
    const id = setTimeout(() => setSlow(true), 3000);
    return () => clearTimeout(id);
  }, [busy]);

  const reset = () => { job.current++; setPhoto(null); setB64(null); setResult(null); setErr(null); setBusy(false); };

  async function send(img: string) {
    if (!regionId) return;
    const mine = ++job.current;
    setErr(null); setResult(null); setBusy(true);
    try {
      const r = await ask({ region_id: regionId, image_base64: img });
      if (mine !== job.current) return;
      setResult(r); setN((x) => x + 1);
      if (r.item_key && r.item_name) addRecent({ item_key: r.item_key, item_name: r.item_name, category: r.category, region_id: regionId });
    } catch (e) {
      if (mine !== job.current) return;
      setErr(e instanceof ApiError ? e.message : t("capture.fail"));
    } finally {
      if (mine === job.current) setBusy(false);
    }
  }

  async function accept(p: Photo | null) {
    if (!p) return;
    setPhoto(p); setErr(null); setResult(null); setBusy(true);
    try {
      const img = await toBase64(p.uri, p.width, p.height);
      setB64(img);
      await send(img);
    } catch {
      setBusy(false);
      setErr(t("capture.photoFail"));
    }
  }

  async function shoot() {
    if (busy || !ready || !cam.current) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
    try {
      const p = await cam.current.takePictureAsync({ quality: 1 });
      await accept(p);
    } catch { setErr(t("capture.photoFail")); }
  }

  const album = async () => { if (!busy) { try { await accept(await pickFromLibrary()); } catch { setErr(t("capture.photoFail")); } } };

  const Close = (
    <Pressable accessibilityRole="button" accessibilityLabel="촬영 닫기" onPress={() => (router.canGoBack() ? router.back() : router.replace("/"))}
      style={{ width: sizes.touchMin, height: sizes.touchMin, justifyContent: "center", alignItems: "center" }}>
      <Text style={{ ...typography.section, color: c.onCamera }}>✕</Text>
    </Pressable>
  );
  const Header = (
    <View style={{ minHeight: 64, flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: space.page }}>
      {Close}
      <Text accessibilityRole="header" style={{ ...typography.section, color: c.onCamera }}>{t("capture.header")}</Text>
      <View style={{ width: sizes.touchMin }} />
    </View>
  );

  // 동네 없음: 지역 의존 요청 막기
  if (regionId === null) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: c.bg, padding: space.page, gap: space.md, justifyContent: "center" }}>
        <Text style={{ ...typography.resultTitle, color: c.text }}>{t("home.noRegion")}</Text>
        <Button label={t("home.pickRegion")} onPress={() => router.push("/region")} />
      </SafeAreaView>
    );
  }

  // 결과 단계: 사진 + 결과 카드(U5가 카드 내용을 완성)
  if (result && regionId) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: c.bg }}>
        <ScrollView contentContainerStyle={{ padding: space.page, gap: space.md }}>
          {photo && <Image source={{ uri: photo.uri }} accessibilityIgnoresInvertColors style={{ height: 160, borderRadius: radius.md }} resizeMode="cover" />}
          <Animated.View entering={FadeInDown.duration(motion.cardEnterMs)}>
            <ResultCard key={n} result={result} regionId={regionId} onChange={setResult} onRetake={reset} />
          </Animated.View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // 권한 전: 카메라 허용 안내 (앨범은 권한 없이 가능)
  if (!photo && !perm?.granted) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: c.bg }}>
        <View style={{ minHeight: 64, justifyContent: "center", paddingHorizontal: space.page }}>{Close}</View>
        <View style={{ flex: 1, justifyContent: "center", padding: space.page, gap: space.md }}>
          <Text accessibilityRole="header" style={{ ...typography.resultTitle, color: c.text }}>{t("capture.permission.title")}</Text>
          <Text style={{ ...typography.body, color: c.subtext }}>{t("capture.permission.body")}</Text>
          {perm && !perm.canAskAgain
            ? <Button label={t("capture.permission.settings")} onPress={() => Linking.openSettings()} />
            : <Button label={t("capture.permission.allow")} disabled={!perm} onPress={() => requestPerm()} />}
          <Button variant="secondary" label={t("capture.button.album")} onPress={album} />
          <Button variant="secondary" label={t("capture.button.askText")} haptic={false} onPress={() => router.replace("/ask")} />
          {err && <Text accessibilityRole="alert" style={{ ...typography.body, color: c.error }}>{err}</Text>}
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: c.cameraBg }}>
      {Header}
      <View style={{ flex: 1, alignItems: "center" }}>
        {photo
          ? <Image source={{ uri: photo.uri }} accessibilityIgnoresInvertColors resizeMode="cover" style={{ position: "absolute", top: 0, bottom: 0, left: 0, right: 0 }} />
          : focused && <CameraView ref={cam} facing="back" onCameraReady={() => setReady(true)} style={{ position: "absolute", top: 0, bottom: 0, left: 0, right: 0 }} />}
        {!photo && !ready && <Text style={{ ...typography.body, color: c.onCamera, marginTop: space.xl }}>{t("capture.preparing")}</Text>}
        <View accessibilityElementsHidden importantForAccessibility="no"
          style={{ marginTop: space.xl, width: sizes.cameraFrameWidth, height: sizes.cameraFrameHeight, borderWidth: 2, borderColor: c.onCamera, borderRadius: radius.md, overflow: "hidden" }}>
          {busy && <ScanLine />}
        </View>
        <View style={{ marginTop: space.smPlus, paddingHorizontal: space.md, paddingVertical: space.xs, borderRadius: radius.sm, backgroundColor: c.cameraBg }}>
          <Text accessibilityLiveRegion="polite" style={{ ...typography.caption, color: c.onCamera }}>
            {busy ? (slow ? t("capture.slow") : t("capture.scanning.title")) : t("capture.guide")}
          </Text>
        </View>
      </View>

      <View style={{ backgroundColor: c.cameraBg, padding: space.page, paddingBottom: space.lg, gap: space.smPlus }}>
        {busy ? (
          <>
            <View style={{ gap: space.sm, padding: space.md, borderRadius: radius.md, backgroundColor: c.surface }}>
              <Skeleton width={120} height={20} /><Skeleton height={24} /><Skeleton width="70%" height={16} />
            </View>
            <Button variant="secondary" label={t("capture.scanning.cancel")} haptic={false} onPress={reset} />
          </>
        ) : err ? (
          <View accessibilityRole="alert" style={{ gap: space.smPlus, padding: space.md, borderRadius: radius.md, backgroundColor: c.errorBg }}>
            <Text style={{ ...typography.bodyStrong, color: c.error }}>{t("capture.fail")}</Text>
            <Text style={{ ...typography.body, color: c.error }}>{err}</Text>
            {b64 && <Button label={t("capture.retry")} onPress={() => send(b64)} />}
            <Button variant="secondary" label={t("result.lowConfidence.retryPhoto")} haptic={false} onPress={reset} />
            <Button variant="secondary" label={t("capture.button.askText")} haptic={false} onPress={() => router.replace("/ask")} />
          </View>
        ) : (
          <>
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
              <Pressable accessibilityRole="button" accessibilityLabel="앨범에서 사진 선택" onPress={album}
                style={({ pressed }) => ({ flex: 1, alignItems: "flex-start", opacity: pressed ? 0.6 : 1 })}>
                <View style={{ width: sizes.albumButton, minHeight: sizes.albumButton, alignItems: "center", justifyContent: "center" }}>
                  <Text style={{ ...typography.caption, color: c.onCamera }}>{t("capture.button.album")}</Text>
                </View>
              </Pressable>
              <Pressable accessibilityRole="button" accessibilityLabel="사진 촬영" disabled={!ready || busy} onPress={shoot}
                style={({ pressed }) => ({ width: sizes.shutter, height: sizes.shutter, borderRadius: radius.pill, borderWidth: 3, borderColor: c.onCamera,
                  alignItems: "center", justifyContent: "center", opacity: ready ? 1 : 0.4, transform: [{ scale: pressed ? 0.98 : 1 }] })}>
                <View style={{ width: 64, height: 64, borderRadius: radius.pill, backgroundColor: c.onCamera }} />
              </Pressable>
              <Text style={{ ...typography.caption, color: c.onCamera, flex: 1, textAlign: "right" }}>{t("capture.one")}</Text>
            </View>
            <Text style={{ ...typography.caption, color: c.onCamera, textAlign: "center" }}>{t("capture.privacy")}</Text>
          </>
        )}
      </View>
    </SafeAreaView>
  );
}
