import { useSignIn } from "@clerk/expo";
import { Link, useRouter, type Href } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, View } from "react-native";
import AuthField from "@/components/AuthField";
import { getClerkErrorMessage, normalizeEmail, validateEmail, validatePassword, type AuthErrors } from "@/lib/auth";

export default function SignIn() {
  const router = useRouter();
  const { signIn, fetchStatus } = useSignIn();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<AuthErrors>({});
  const [submitting, setSubmitting] = useState(false);

  const submit = async () => {
    const nextErrors: AuthErrors = {};
    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);
    if (emailError) nextErrors.email = emailError;
    if (passwordError) nextErrors.password = passwordError;
    if (Object.keys(nextErrors).length) { setErrors(nextErrors); return; }
    setErrors({}); setSubmitting(true);
    try {
      const result = await signIn.password({ identifier: normalizeEmail(email), password });
      if (result.error) { setErrors({ form: getClerkErrorMessage(result.error, "We couldn't sign you in. Check your details and try again.") }); return; }
      if (signIn.status === "complete") {
        const finalized = await signIn.finalize();
        if (finalized.error) setErrors({ form: getClerkErrorMessage(finalized.error, "We couldn't finish signing you in.") });
        else router.replace("/(tabs)");
      } else setErrors({ form: "Your account needs one more verification step. Please complete it before continuing." });
    } catch (error) { setErrors({ form: getClerkErrorMessage(error, "We couldn't sign you in. Please try again.") }); }
    finally { setSubmitting(false); }
  };

  const loading = submitting || fetchStatus === "fetching";
  return <KeyboardAvoidingView className="auth-safe-area" behavior={Platform.OS === "ios" ? "padding" : undefined}><ScrollView className="auth-scroll" contentContainerClassName="auth-content" keyboardShouldPersistTaps="handled"><View className="auth-brand-block"><View className="auth-logo-wrap"><View className="auth-logo-mark"><Text className="auth-logo-mark-text">R</Text></View><View><Text className="auth-wordmark">Recurrly</Text><Text className="auth-wordmark-sub">Smart billing</Text></View></View><Text className="auth-title">Welcome back</Text><Text className="auth-subtitle">Sign in to continue managing your subscriptions</Text></View><View className="auth-card"><View className="auth-form"><AuthField label="Email" value={email} onChangeText={setEmail} autoCapitalize="none" autoCorrect={false} keyboardType="email-address" textContentType="emailAddress" placeholder="Enter your email" error={errors.email} /><AuthField label="Password" value={password} onChangeText={setPassword} secure secureTextEntry={!showPassword} onToggleSecure={() => setShowPassword((value) => !value)} textContentType="password" placeholder="Enter your password" error={errors.password} /><Link href={"/(auth)/forgot-password" as Href} className="self-end auth-link">Forgot password?</Link>{errors.form ? <Text className="auth-error">{errors.form}</Text> : null}<Pressable disabled={loading} onPress={submit} className={`auth-button ${loading ? "auth-button-disabled" : ""}`}>{loading ? <ActivityIndicator color="#081126" /> : <Text className="auth-button-text">Sign in</Text>}</Pressable></View><View className="auth-link-row"><Text className="auth-link-copy">New to Recurrly?</Text><Link href="/(auth)/sign-up" className="auth-link">Create an account</Link></View></View></ScrollView></KeyboardAvoidingView>;
}
