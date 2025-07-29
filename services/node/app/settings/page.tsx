import { Container, Text, Title, Stack } from "@mantine/core";
import { UserSettingsForm } from "@/components/UserSettingsForm";

export default function SettingsPage() {
    return (
        <Container size="lg" my={40}>
            <Stack gap="xl">
                <div>
                    <Title>Settings</Title>
                    <Text c="dimmed" size="sm" mt={5}>
                        Manage your account settings and personal information.
                    </Text>
                </div>
                
                <UserSettingsForm />
            </Stack>
        </Container>
    );
}