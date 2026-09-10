import "@/global.css";
import { Link } from "expo-router";
import { Text } from "react-native";
import { styled } from "nativewind";
import {
    SafeAreaView as RNSafeAreaView,
} from "react-native-safe-area-context";

const SafeAreaView = styled(RNSafeAreaView);

export default function App() {
    return (
        <SafeAreaView className="flex-1 bg-background p-5">
            <Text className="text-5xl font-extrabold">Home</Text>

            <Link href="/onboading" className="mt-4 font-sans-bold rounded bg-primary p-4 text-white ">
                Go to Onboading
            </Link>

            <Link href="/(auth)/sign-in" className="mt-4 font-sans-bold rounded bg-primary p-4 text-white rounded bg-primary p-4 text-white">
                Go to Sign In
            </Link>

            <Link href="/(auth)/sign-up" className="mt-4 font-sans-bold rounded bg-primary p-4 text-white  rounded bg-primary p-4 text-white">
                Go to Sign Up
            </Link>

        </SafeAreaView>
    );
}
