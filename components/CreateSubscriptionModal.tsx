import { useMemo, useState } from "react";
import {
    KeyboardAvoidingView,
    Modal,
    Platform,
    Pressable,
    ScrollView,
    Text,
    TextInput,
    View,
} from "react-native";
import clsx from "clsx";
import dayjs from "dayjs";
import { icons } from "@/constants/icons";

const CATEGORIES = [
    "Entertainment",
    "AI Tools",
    "Developer Tools",
    "Design",
    "Productivity",
    "Cloud",
    "Music",
    "Other",
] as const;

type Frequency = "Monthly" | "Yearly";
type Category = (typeof CATEGORIES)[number];

const CATEGORY_COLORS: Record<Category, string> = {
    Entertainment: "#f5c542",
    "AI Tools": "#b8d4e3",
    "Developer Tools": "#e8def8",
    Design: "#b8e8d0",
    Productivity: "#f6c1c7",
    Cloud: "#c6d8f0",
    Music: "#f3b7d2",
    Other: "#d8d3c4",
};

interface CreateSubscriptionModalProps {
    visible: boolean;
    onClose: () => void;
    onCreate: (subscription: Subscription) => void;
}

const getInitialForm = () => ({
    name: "",
    price: "",
    frequency: "Monthly" as Frequency,
    category: "Entertainment" as Category,
});

export default function CreateSubscriptionModal({
    visible,
    onClose,
    onCreate,
}: CreateSubscriptionModalProps) {
    const [form, setForm] = useState(getInitialForm);
    const [submitted, setSubmitted] = useState(false);

    const trimmedName = form.name.trim();
    const parsedPrice = Number(form.price.trim());
    const hasValidName = trimmedName.length > 0;
    const hasValidPrice = Number.isFinite(parsedPrice) && parsedPrice > 0;
    const canSubmit = hasValidName && hasValidPrice;

    const errors = useMemo(() => ({
        name: submitted && !hasValidName ? "Enter a subscription name." : undefined,
        price: submitted && !hasValidPrice ? "Enter a price greater than zero." : undefined,
    }), [hasValidName, hasValidPrice, submitted]);

    const resetAndClose = () => {
        setForm(getInitialForm());
        setSubmitted(false);
        onClose();
    };

    const handleSubmit = () => {
        setSubmitted(true);
        if (!canSubmit) return;

        const startDate = dayjs();
        const renewalDate = startDate
            .add(form.frequency === "Monthly" ? 1 : 1, form.frequency === "Monthly" ? "month" : "year")
            .toISOString();

        onCreate({
            id: `subscription-${Date.now()}`,
            name: trimmedName,
            price: parsedPrice,
            currency: "USD",
            frequency: form.frequency,
            category: form.category,
            status: "active",
            startDate: startDate.toISOString(),
            renewalDate,
            icon: icons.wallet,
            billing: form.frequency,
            color: CATEGORY_COLORS[form.category],
        });
        resetAndClose();
    };

    return (
        <Modal
            visible={visible}
            transparent
            animationType="slide"
            onRequestClose={resetAndClose}
        >
            <KeyboardAvoidingView
                className="modal-overlay"
                behavior={Platform.OS === "ios" ? "padding" : undefined}
            >
                <View className="modal-container">
                    <View className="modal-header">
                        <Text className="modal-title">New Subscription</Text>
                        <Pressable onPress={resetAndClose} className="modal-close" hitSlop={8}>
                            <Text className="modal-close-text">×</Text>
                        </Pressable>
                    </View>

                    <ScrollView
                        className="modal-body"
                        contentContainerClassName="gap-5"
                        keyboardShouldPersistTaps="handled"
                        showsVerticalScrollIndicator={false}
                    >
                        <View className="auth-field">
                            <Text className="auth-label">Name</Text>
                            <TextInput
                                value={form.name}
                                onChangeText={(name) => setForm((current) => ({ ...current, name }))}
                                className={clsx("auth-input", errors.name && "auth-input-error")}
                                placeholder="e.g. Netflix"
                                placeholderTextColor="rgba(0, 0, 0, 0.42)"
                                autoCapitalize="words"
                            />
                            {errors.name ? <Text className="auth-error">{errors.name}</Text> : null}
                        </View>

                        <View className="auth-field">
                            <Text className="auth-label">Price</Text>
                            <TextInput
                                value={form.price}
                                onChangeText={(price) => setForm((current) => ({ ...current, price }))}
                                className={clsx("auth-input", errors.price && "auth-input-error")}
                                placeholder="e.g. 14.99"
                                placeholderTextColor="rgba(0, 0, 0, 0.42)"
                                keyboardType="decimal-pad"
                                inputMode="decimal"
                            />
                            {errors.price ? <Text className="auth-error">{errors.price}</Text> : null}
                        </View>

                        <View className="auth-field">
                            <Text className="auth-label">Frequency</Text>
                            <View className="picker-row">
                                {(["Monthly", "Yearly"] as Frequency[]).map((frequency) => {
                                    const active = form.frequency === frequency;
                                    return (
                                        <Pressable
                                            key={frequency}
                                            onPress={() => setForm((current) => ({ ...current, frequency }))}
                                            className={clsx("picker-option", active && "picker-option-active")}
                                        >
                                            <Text className={clsx("picker-option-text", active && "picker-option-text-active")}>
                                                {frequency}
                                            </Text>
                                        </Pressable>
                                    );
                                })}
                            </View>
                        </View>

                        <View className="auth-field">
                            <Text className="auth-label">Category</Text>
                            <View className="category-scroll">
                                {CATEGORIES.map((category) => {
                                    const active = form.category === category;
                                    return (
                                        <Pressable
                                            key={category}
                                            onPress={() => setForm((current) => ({ ...current, category }))}
                                            className={clsx("category-chip", active && "category-chip-active")}
                                        >
                                            <Text className={clsx("category-chip-text", active && "category-chip-text-active")}>
                                                {category}
                                            </Text>
                                        </Pressable>
                                    );
                                })}
                            </View>
                        </View>

                        <Pressable
                            disabled={!canSubmit}
                            onPress={handleSubmit}
                            className={clsx("auth-button", !canSubmit && "auth-button-disabled")}
                        >
                            <Text className="auth-button-text">Create subscription</Text>
                        </Pressable>
                    </ScrollView>
                </View>
            </KeyboardAvoidingView>
        </Modal>
    );
}
