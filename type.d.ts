import type {ImageSourcePropType} from "react-native";

declare global {
    interface TabIconProps {
        focused:boolean;
        icons:ImageSourcePropType;
    }
}

export {};