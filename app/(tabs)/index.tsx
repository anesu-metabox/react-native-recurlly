import "@/global.css";
import { FlatList, Image, Pressable, Text, View } from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";
import { styled } from "nativewind";
import images from "@/constants/images";
import { HOME_BALANCE, HOME_SUBSCRIPTIONS, HOME_USER, UPCOMING_SUBSCRIPTIONS } from "@/constants/data";
import { icons } from "@/constants/icons";
import { formatCurrency } from "@/lib/utils";
import dayjs from "dayjs";
import ListHeading from "@/components/ListHeading";
import UpcomingSubscriptionCard from "@/components/UpcomingSubscriptionCard";
import SubscriptionCard from "@/components/SubscriptionCard";
import CreateSubscriptionModal from "@/components/CreateSubscriptionModal";
import { useState } from "react";
import { posthog } from "@/lib/posthog";

const SafeAreaView = styled(RNSafeAreaView);

interface HomeListHeaderProps {
    onAddPress: () => void;
}

function HomeListHeader({ onAddPress }: HomeListHeaderProps) {
    return (
        <>
            <View className="home-header">
                <View className="home-user">
                    <Image source={images.avatar} className="home-avatar" />
                    <Text className="home-user-name">{HOME_USER.name}</Text>
                </View>

                <Pressable onPress={onAddPress} hitSlop={8}>
                    <Image source={icons.add} className="home-add-icon" />
                </Pressable>
            </View>

            <View className="home-balance-card">
                <Text className="home-balance-label">Balance</Text>
                <View className="home-balance-row">
                    <Text className="home-balance-amount">{formatCurrency(HOME_BALANCE.amount)}</Text>
                    <Text className="home-balance-date">{dayjs(HOME_BALANCE.nextRenewalDate).format('MM/DD')}</Text>
                </View>
            </View>

            <View className="mb-5">
                <ListHeading title="Upcoming" />
                <FlatList
                    data={UPCOMING_SUBSCRIPTIONS}
                    renderItem={({ item }) => <UpcomingSubscriptionCard {...item} />}
                    keyExtractor={(item) => item.id}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    ListEmptyComponent={<Text className="home-empty-state">No upcoming renewals yet.</Text>}
                />
            </View>

            <ListHeading title="All Subscriptions" />
        </>
    );
}

export default function Home() {
    const [subscriptions, setSubscriptions] = useState<Subscription[]>(() => HOME_SUBSCRIPTIONS);
    const [expandedSubscriptionId, setExpandedSubscriptionId] = useState<string | null>(null);
    const [isCreateModalVisible, setCreateModalVisible] = useState(false);

    const handleCreateSubscription = (subscription: Subscription) => {
        setSubscriptions((currentSubscriptions) => [subscription, ...currentSubscriptions]);
    };

    const handleSubscriptionPress = (item: Subscription) => {
        const isExpanding = expandedSubscriptionId !== item.id;
        setExpandedSubscriptionId(isExpanding ? item.id : null);
        if (isExpanding) posthog?.capture("subscription_expanded", { subscription_id: item.id });
    };

    return (
        <SafeAreaView className="flex-1 bg-background p-5">
            <FlatList
                ListHeaderComponent={<HomeListHeader onAddPress={() => setCreateModalVisible(true)} />}
                data={subscriptions}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <SubscriptionCard
                        {...item}
                        expanded={expandedSubscriptionId === item.id}
                        onPress={() => handleSubscriptionPress(item)}
                    />
                )}
                extraData={expandedSubscriptionId}
                ItemSeparatorComponent={() => <View className="h-4" />}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={<Text className="home-empty-state">No subscriptions yet.</Text>}
                contentContainerClassName="pb-30"
            />
            <CreateSubscriptionModal
                visible={isCreateModalVisible}
                onClose={() => setCreateModalVisible(false)}
                onCreate={handleCreateSubscription}
            />
        </SafeAreaView>
    );
}
