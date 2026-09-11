import { SplashScreen, Stack, usePathname, useRouter, useSegments } from "expo-router";
import "@/global.css";
import { useFonts } from "expo-font";
import { useEffect, useRef } from "react";
import { ActivityIndicator, View } from "react-native";
import { ClerkProvider, useAuth, useUser } from "@clerk/expo";
import { tokenCache } from "@clerk/expo/token-cache";
import { PostHogProvider } from "posthog-react-native";
import { posthog } from "@/lib/posthog";

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

    const app = (
        <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
            <AnalyticsIdentity />
            <AuthGate />
        </ClerkProvider>
    );

    if (!posthog) return app;

    return (
        <PostHogProvider
            client={posthog}
            autocapture={{ captureScreens: false, captureTouches: true }}
        >
            <ScreenTracker />
            {app}
        </PostHogProvider>
    );
}

function ScreenTracker() {
    const pathname = usePathname();
    const previousPathname = useRef<string | undefined>(undefined);

    useEffect(() => {
        if (!posthog || previousPathname.current === pathname) return;
        posthog.screen(pathname, { previous_screen: previousPathname.current ?? null });
        previousPathname.current = pathname;
    }, [pathname]);

    return null;
}

function AnalyticsIdentity() {
    const { isLoaded, user } = useUser();

    useEffect(() => {
        if (!isLoaded || !user || !posthog) return;

        const personProperties: Record<string, string> = {};
        if (user.primaryEmailAddress?.emailAddress) personProperties.email = user.primaryEmailAddress.emailAddress;
        if (user.fullName) personProperties.name = user.fullName;
        posthog.identify(user.id, personProperties);
    }, [isLoaded, user]);

    return null;
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
