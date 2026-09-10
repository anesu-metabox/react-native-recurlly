import "@/global.css";
import { Link } from "expo-router";
import { styled } from "nativewind";
import { Text } from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";

const SafeAreaView = styled(RNSafeAreaView);

const Subscriptions = () => {
    return (
        <SafeAreaView className="flex-1 bg-background p-5">
            <Text className="text-2xl font-bold text-primary">Subscriptions</Text>

            <Link
                href={{
                    pathname: "/subscriptions/[id]",
                    params: { id: "spotify" },
                }}
            >
                Spotify Subscription
            </Link>
        </SafeAreaView>
    );
};

export default Subscriptions;
