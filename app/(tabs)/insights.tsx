import "@/global.css";
import { styled } from "nativewind";
import { Text } from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";

const SafeAreaView = styled(RNSafeAreaView);

const Insights=()=> {
    return (
        <SafeAreaView className="flex-1 bg-background p-5">
            <Text className="text-2xl font-bold text-primary">Insights</Text>
        </SafeAreaView>
    );
}

export default Insights