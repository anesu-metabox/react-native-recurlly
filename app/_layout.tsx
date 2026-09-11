import { SplashScreen, Stack, useRouter, useSegments } from "expo-router";
import "@/global.css";
import { useFonts } from "expo-font";
import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import { ClerkProvider, useAuth } from "@clerk/expo";
import { tokenCache } from "@clerk/expo/token-cache";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
    const [fontsLoaded, error] = useFonts({
        'sans-regular': require('../assets/fonts/PlusJakartaSans-Regular.ttf'),
        'sans-bold': require('../assets/fonts/PlusJakartaSans-Bold.ttf'),
        'sans-medium': require('../assets/fonts/PlusJakartaSans-Medium.ttf'),
        'sans-semibold': require('../assets/fonts/PlusJakartaSans-SemiBold.ttf'),
        'sans-extrabold': require('../assets/fonts/PlusJakartaSans-ExtraBold.ttf'),
        'sans-light': require('../assets/fonts/PlusJakartaSans-Light.ttf'),
    });

    useEffect(() => {
        if (error) throw error;
        if (fontsLoaded) {
            SplashScreen.hideAsync();
        }
    }, [fontsLoaded, error]);

if (!fontsLoaded) return null;

    const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;
    if (!publishableKey) throw new Error("Add EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY to .env");

    return (
        <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
            <AuthGate />
        </ClerkProvider>
    );
}

function AuthGate() {
    const { isLoaded, isSignedIn } = useAuth({ treatPendingAsSignedOut: false });
    const segments = useSegments();
    const router = useRouter();
    const inAuth = segments[0] === "(auth)";
    const inTabs = segments[0] === "(tabs)";

    useEffect(() => {
        if (!isLoaded) return;
        if (isSignedIn && !inTabs) router.replace("/(tabs)");
        if (!isSignedIn && !inAuth) router.replace("/(auth)/sign-in");
    }, [inAuth, inTabs, isLoaded, isSignedIn, router]);

    if (!isLoaded || (!isSignedIn && !inAuth) || (isSignedIn && !inTabs)) {
        return (
            <View className="flex-1 items-center justify-center bg-background">
                <ActivityIndicator color="#ea7a53" size="large" />
            </View>
        );
    }

    return <Stack screenOptions={{ headerShown: false }} />;
}
