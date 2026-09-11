import { Pressable, Text, TextInput, View } from "react-native";

type AuthFieldProps = React.ComponentProps<typeof TextInput> & {
  label: string;
  error?: string;
  secure?: boolean;
  onToggleSecure?: () => void;
};

export default function AuthField({ label, error, secure, onToggleSecure, ...props }: AuthFieldProps) {
  return (
    <View className="auth-field">
      <View className="flex-row items-center justify-between">
        <Text className="auth-label">{label}</Text>
        {secure && onToggleSecure ? (
          <Pressable onPress={onToggleSecure} hitSlop={8}>
            <Text className="auth-link">{props.secureTextEntry ? "Show" : "Hide"}</Text>
          </Pressable>
        ) : null}
      </View>
      <TextInput
        {...props}
        secureTextEntry={props.secureTextEntry}
        className={`auth-input ${error ? "auth-input-error" : ""}`}
        placeholderTextColor="rgba(0, 0, 0, 0.42)"
      />
      {error ? <Text className="auth-error">{error}</Text> : null}
    </View>
  );
}
