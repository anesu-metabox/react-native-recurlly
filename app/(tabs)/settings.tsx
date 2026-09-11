import { Pressable, Text, View } from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";
import { styled } from "nativewind";
import { useClerk, useUser } from "@clerk/expo";

const SafeAreaView = styled(RNSafeAreaView);

const Settings = () => {
    const { signOut } = useClerk();
    const { user } = useUser();
    return (
        <SafeAreaView className="flex-1 bg-background p-5">
            <Text className="text-2xl font-sans-bold text-primary">Settings</Text>
            <View className="mt-8 rounded-3xl border border-border bg-card p-5">
                <Text className="text-lg font-sans-bold text-primary">{user?.firstName || user?.emailAddresses[0]?.emailAddress || "Your account"}</Text>
                <Text className="mt-1 text-sm font-sans-medium text-muted-foreground">Manage your Recurrly account</Text>
                <Pressable onPress={() => signOut()} className="auth-button mt-6">
                    <Text className="auth-button-text">Sign out</Text>
                </Pressable>
            </View>
        </SafeAreaView>
    );
};

export default Settings;
