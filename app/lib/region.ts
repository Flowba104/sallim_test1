import AsyncStorage from "@react-native-async-storage/async-storage";

const KEY = "region_id";
const ONBOARDED = "onboarded";

export const getRegionId = () => AsyncStorage.getItem(KEY);
export const setRegionId = (id: string) => AsyncStorage.setItem(KEY, id);
export const isOnboarded = async () => (await AsyncStorage.getItem(ONBOARDED)) === "1";
export const setOnboarded = () => AsyncStorage.setItem(ONBOARDED, "1");
