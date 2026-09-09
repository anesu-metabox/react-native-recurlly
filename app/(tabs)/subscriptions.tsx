import {Link} from "expo-router";
import {Text, View} from "react-native";

export default function Subscriptions() {
    return (
        <View>
            <Text>Subscriptions</Text>
            <Link href={{pathname: "/subscriptions/[id]", params: {id: "spotify"}}}>
                Spotify Subscription
            </Link>
        </View>
    );
}
