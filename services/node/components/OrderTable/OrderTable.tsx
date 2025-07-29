'use client';

import { useState, useEffect } from 'react';
import { Table, Text, Badge, Card, Stack, Alert, Loader, Center, Button } from '@mantine/core';
import { IconPlus, IconEye } from '@tabler/icons-react';
import { Order, ProcessingOption } from '@/types/types';
import { OrderService } from '@/service/OrderService';
import { PixelFixClient } from '@/service/PixelFixClient';
import { useAuthData } from '@/hooks/useAuthData';
import { useRouter } from 'next/navigation';

const orderService = new OrderService(new PixelFixClient());

export function OrderTable() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { authData } = useAuthData();
    const router = useRouter();

    useEffect(() => {
        const fetchOrders = async () => {
            if (!authData) {
                setLoading(false);
                return;
            }

            try {
                setError(null);
                const orderList = await orderService.getOrderList(authData);
                setOrders(orderList);
            } catch (err) {
                setError('Failed to load orders. Please try again.');
                console.error('Error fetching orders:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [authData]);

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'completed':
                return 'green';
            case 'processing':
                return 'blue';
            case 'pending':
                return 'yellow';
            case 'failed':
                return 'red';
            default:
                return 'gray';
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('de-DE', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatProcessingOptions = (options: ProcessingOption[]) => {
        return options.map(option => {
            switch (option) {
                case ProcessingOption.SELECT_FREE_FORM:
                    return 'Select Free Form';
                default:
                    return option;
            }
        }).join(', ');
    };

    if (!authData) {
        return (
            <Alert color="blue">
                Please log in to view your orders.
            </Alert>
        );
    }

    if (loading) {
        return (
            <Center h={200}>
                <Loader size="md" />
            </Center>
        );
    }

    if (error) {
        return (
            <Alert color="red">
                {error}
            </Alert>
        );
    }

    if (orders.length === 0) {
        return (
            <Card withBorder p="xl">
                <Stack align="center" gap="md">
                    <Text size="lg" fw={500}>No orders found</Text>
                    <Text color="dimmed">Create your first order to get started.</Text>
                    <Button 
                        leftSection={<IconPlus size={16} />}
                        onClick={() => router.push('/create-order')}
                    >
                        Create Order
                    </Button>
                </Stack>
            </Card>
        );
    }

    return (
        <Card withBorder>
            <Stack gap="md">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text size="lg" fw={500}>Your Orders</Text>
                    <Button 
                        size="sm"
                        leftSection={<IconPlus size={16} />}
                        onClick={() => router.push('/create-order')}
                    >
                        New Order
                    </Button>
                </div>
                
                <div style={{ overflowX: 'auto' }}>
                    <Table striped highlightOnHover>
                        <Table.Thead>
                            <Table.Tr>
                                <Table.Th>Order ID</Table.Th>
                                <Table.Th>Created</Table.Th>
                                <Table.Th>Status</Table.Th>
                                <Table.Th>Processing Options</Table.Th>
                                <Table.Th>Processed</Table.Th>
                                <Table.Th>Actions</Table.Th>
                            </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>
                            {orders.map((order) => (
                                <Table.Tr key={order.id}>
                                    <Table.Td>
                                        <Text fw={500}>#{order.id}</Text>
                                    </Table.Td>
                                    <Table.Td>
                                        <Text size="sm">{formatDate(order.createdAt)}</Text>
                                    </Table.Td>
                                    <Table.Td>
                                        <Badge color={getStatusColor(order.status)} variant="light">
                                            {order.status}
                                        </Badge>
                                    </Table.Td>
                                    <Table.Td>
                                        <Text size="sm">
                                            {formatProcessingOptions(order.processingOptions)}
                                        </Text>
                                    </Table.Td>
                                    <Table.Td>
                                        <Text size="sm">
                                            {order.processedAt ? formatDate(order.processedAt) : '-'}
                                        </Text>
                                    </Table.Td>
                                    <Table.Td>
                                        <Button 
                                            size="xs" 
                                            variant="light"
                                            leftSection={<IconEye size={14} />}
                                        >
                                            View
                                        </Button>
                                    </Table.Td>
                                </Table.Tr>
                            ))}
                        </Table.Tbody>
                    </Table>
                </div>
            </Stack>
        </Card>
    );
}