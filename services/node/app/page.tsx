import { Container, Title, Text } from '@mantine/core';

export default function HomePage() {
  return (
    <Container size={420} my={40}>
      <Title>Dashboard</Title>
      <Text color="dimmed" size="sm" mt={5}>
        This page will allow you to manage your user settings.
      </Text>
      {/* Add form or other components for user settings */}
    </Container>
  );
}
