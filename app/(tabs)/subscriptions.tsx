import { FlatList, KeyboardAvoidingView, Platform, Pressable, Text, TextInput, View } from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";
import { styled } from "nativewind";
import { useMemo, useState } from "react";
import { HOME_SUBSCRIPTIONS } from "@/constants/data";
import SubscriptionCard from "@/components/SubscriptionCard";
import { colors } from "@/constants/theme";

const SafeAreaView = styled(RNSafeAreaView);

const Subscriptions = () => {
    const [query, setQuery] = useState("");
    const [expandedSubscriptionId, setExpandedSubscriptionId] = useState<string | null>(null);

    const filteredSubscriptions = useMemo(() => {
        const normalizedQuery = query.trim().toLowerCase();
        if (!normalizedQuery) return HOME_SUBSCRIPTIONS;

        return HOME_SUBSCRIPTIONS.filter((subscription) => {
            const searchableFields = [
                subscription.name,
                subscription.plan,
                subscription.category,
                subscription.billing,
                subscription.status,
            ];

            return searchableFields.some((field) => field?.toLowerCase().includes(normalizedQuery));
        });
    }, [query]);

    return (
        <KeyboardAvoidingView
            className="flex-1"
            behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
        <SafeAreaView className="flex-1 bg-background p-5">
            <FlatList
                data={filteredSubscriptions}
                keyboardDismissMode={Platform.OS === "ios" ? "interactive" : "on-drag"}
                keyboardShouldPersistTaps="handled"
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <SubscriptionCard
                        {...item}
                        expanded={expandedSubscriptionId === item.id}
                        onPress={() => setExpandedSubscriptionId((currentId) => currentId === item.id ? null : item.id)}
                    />
                )}
                ItemSeparatorComponent={() => <View className="h-4" />}
                showsVerticalScrollIndicator={false}
                contentContainerClassName="pb-30"
                ListHeaderComponent={
                    <View className="pb-4">
                        <Text className="text-2xl font-sans-bold" style={{ color: colors.primary }}>Subscriptions</Text>
                        <View className="subscription-search-wrap">
                            <TextInput
                                value={query}
                                onChangeText={setQuery}
                                placeholder="Search subscriptions"
                                placeholderTextColor="rgba(0, 0, 0, 0.42)"
                                autoCapitalize="none"
                                autoCorrect={false}
                                returnKeyType="search"
                                className="subscription-search-input"
                                style={{ color: colors.primary }}
                            />
                            {query.length > 0 ? (
                                <Pressable onPress={() => setQuery("")} hitSlop={8} className="subscription-search-clear">
                                    <Text className="subscription-search-clear-text">×</Text>
                                </Pressable>
                            ) : null}
                        </View>
                    </View>
                }
                ListEmptyComponent={
                    <View className="subscription-empty-state">
                        <Text className="subscription-empty-title">No matches found</Text>
                        <Text className="home-empty-state">Try a different subscription name, category, or status.</Text>
                    </View>
                }
            />
        </SafeAreaView>
        </KeyboardAvoidingView>
    );
};

export default Subscriptions;
