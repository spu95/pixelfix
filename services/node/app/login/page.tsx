'use client';

import { useAuthData } from "@/hooks/useAuthData";
import { LoginService } from "@/service/LoginService";
import { PixelFixClient } from "@/service/PixelFixClient";
import {
    Button,
    Container,
    TextInput,
    PasswordInput,
    Title,
    Text,
    Stack,
    Alert,
    LoadingOverlay,
    Box,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconAlertCircle, IconLogin } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { saveAuthData } = useAuthData();
    const loginService = new LoginService(new PixelFixClient());
    const router = useRouter();

    const form = useForm({
        initialValues: {
            userName: '',
            password: '',
        },
        validate: {
            userName: (value: string) =>
                value.length < 3 ? 'Benutzername muss mindestens 3 Zeichen lang sein' : null,
            password: (value: string) =>
                value.length < 6 ? 'Passwort muss mindestens 6 Zeichen lang sein' : null,
        },
    });

    const handleLogin = async (values: typeof form.values) => {
        setLoading(true);
        setError(null);

        try {
            const authData = await loginService.login(values.userName, values.password);
            saveAuthData(authData);
            router.push('/');
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : 'Login fehlgeschlagen. Bitte überprüfen Sie Ihre Anmeldedaten.'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container size={420} my={40}>
            <Title>
                Willkommen zurück!
            </Title>

            <Text color="dimmed" size="sm" mt={5} mb={5}>
                Melden Sie sich mit Ihrem Konto an
            </Text>

            <Box>
                <LoadingOverlay visible={loading} overlayProps={{ blur: 2 }} />

                <form onSubmit={form.onSubmit(handleLogin)}>
                    <Stack>
                        {error && (
                            <Alert
                                icon={<IconAlertCircle size="1rem" />}
                                title="Login fehlgeschlagen"
                                color="red"
                                variant="filled"
                            >
                                {error}
                            </Alert>
                        )}

                        <TextInput
                            label="Benutzername"
                            placeholder="Ihr Benutzername"
                            required
                            {...form.getInputProps('userName')}
                        />

                        <PasswordInput
                            label="Passwort"
                            placeholder="Ihr Passwort"
                            required
                            {...form.getInputProps('password')}
                        />

                        <Button
                            fullWidth
                            type="submit"
                            loading={loading}
                            leftSection={<IconLogin size="1rem" />}
                        >
                            Anmelden
                        </Button>
                    </Stack>
                </form>
            </Box>
        </Container>
    );
}