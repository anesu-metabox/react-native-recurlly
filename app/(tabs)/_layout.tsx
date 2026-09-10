import { Tabs } from "expo-router";
import { clsx } from "clsx";
import { Image, type ImageSourcePropType, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import activity from "@/assets/icons/activity.png";
import home from "@/assets/icons/home.png";
import setting from "@/assets/icons/setting.png";
import wallet from "@/assets/icons/wallet.png";
import { colors, components } from "@/constants/theme";

const tabBar = components.tabBar;

const tabs = [
    { name: "index", title: "Home", icon: home },
    { name: "subscriptions", title: "Subscriptions", icon: wallet },
    { name: "insights", title: "Insights", icon: activity },
    { name: "settings", title: "Settings", icon: setting },
] as const;

type TabIconProps = {
    focused: boolean;
    icon: ImageSourcePropType;
};

const TabIcon = ({ focused, icon }: TabIconProps) => (
    <View className="tabs-icon">
        <View className={clsx("tabs-pill", focused && "tabs-active")}>
            <Image source={icon} resizeMode="contain" className="tabs-glyph" />
        </View>
    </View>
);

const TabLayout = () => {
    const insets = useSafeAreaInsets();

    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarShowLabel: false,
                tabBarStyle: {
                    position: "absolute",
                    bottom: Math.max(insets.bottom, tabBar.horizontalInset),
                    height: tabBar.height,
                    marginHorizontal: tabBar.horizontalInset,
                    borderRadius: tabBar.radius,
                    backgroundColor: colors.primary,
                    borderTopWidth: 0,
                    elevation: 0,
                },
                tabBarItemStyle: {
                    paddingVertical: tabBar.itemPaddingVertical,
                },
                tabBarIconStyle: {
                    width: tabBar.iconFrame,
                    height: tabBar.iconFrame,
                    alignItems: "center",
                },
            }}
        >
            {tabs.map((tab) => (
                <Tabs.Screen
                    key={tab.name}
                    name={tab.name}
                    options={{
                        title: tab.title,
                        tabBarIcon: ({ focused }) => (
                            <TabIcon focused={focused} icon={tab.icon} />
                        ),
                    }}
                />
            ))}
        </Tabs>
    );
};

export default TabLayout;
