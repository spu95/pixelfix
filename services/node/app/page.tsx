import { Container, Title, Text, Stack } from '@mantine/core';
import { OrderTable } from '@/components/OrderTable';

export default function HomePage() {
  return (
    <Container size="lg" my={40}>
      <Stack gap="xl">
        <div>
          <Title>Dashboard</Title>
          <Text c="dimmed" size="sm" mt={5}>
            Welcome to PixelFix - manage your image processing orders here.
          </Text>
        </div>
        
        <OrderTable />
      </Stack>
    </Container>
  );
}
