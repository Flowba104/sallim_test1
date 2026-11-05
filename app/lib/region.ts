import AsyncStorage from "@react-native-async-storage/async-storage";

const KEY = "region_id";

export const getRegionId = () => AsyncStorage.getItem(KEY);
export const setRegionId = (id: string) => AsyncStorage.setItem(KEY, id);
