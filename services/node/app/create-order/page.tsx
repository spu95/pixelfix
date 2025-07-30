'use client';

import { useState } from 'react';
import { Container, Title, Text, Stepper, Button, Group, FileButton, Stack, Card, Badge, Checkbox, Alert } from "@mantine/core";
import { IconUpload, IconPhoto, IconCheck } from '@tabler/icons-react';
import { OrderService } from '@/service/OrderService';
import { PixelFixClient } from '@/service/PixelFixClient';
import { CreateOrder } from '@/model/CreateOrder';
import { ProcessingOption, Image } from '@/types/types';
import { useAuthData } from '@/hooks/useAuthData';

const orderService = new OrderService(new PixelFixClient());

export default function CreateOrderPage() {
    const [activeStep, setActiveStep] = useState(0);
    const [uploadedImages, setUploadedImages] = useState<Image[]>([]);
    const [selectedOptions, setSelectedOptions] = useState<ProcessingOption[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { authData } = useAuthData();

    const handleImageUpload = async (files: File[]) => {
        if (!authData) { return; }

        setLoading(true);
        setError(null);

        try {
            const uploadPromises = files.map(file => orderService.uploadImage(file, authData));
            const images = await Promise.all(uploadPromises);
            setUploadedImages(prev => [...prev, ...images]);
        } catch (err) {
            setError('Failed to upload images. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateOrder = async () => {
        if (!authData || uploadedImages.length === 0) { return; }

        setLoading(true);
        setError(null);

        try {
            const createOrderData = new CreateOrder(
                selectedOptions,
                uploadedImages.map(img => img.id.toString())
            );

            await orderService.createOrder(createOrderData, authData);

            // Reset form or redirect
            setActiveStep(0);
            setUploadedImages([]);
            setSelectedOptions([]);
        } catch (err) {
            setError('Failed to create order. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const nextStep = () => setActiveStep(current => current < 1 ? current + 1 : current);
    const prevStep = () => setActiveStep(current => current > 0 ? current - 1 : current);

    return (
        <Container size={600} my={40}>
            <Title order={1} mb="lg">Create Order</Title>

            <Stepper active={activeStep}>
                <Stepper.Step
                    label="Upload Images"
                    description="Select your images"
                    icon={<IconUpload size={18} />}
                >
                    <Stack mt="xl">
                        <Text>Upload the images you want to process</Text>

                        {error && (
                            <Alert color="red" mb="md">
                                {error}
                            </Alert>
                        )}

                        <FileButton
                            onChange={(files) => files && handleImageUpload(Array.from(files))}
                            accept="image/png,image/jpeg,image/webp"
                            multiple
                        >
                            {(props) => (
                                <Button
                                    {...props}
                                    leftSection={<IconPhoto size={16} />}
                                    loading={loading}
                                    variant="light"
                                    size="lg"
                                >
                                    Choose Images
                                </Button>
                            )}
                        </FileButton>

                        {uploadedImages.length > 0 && (
                            <Stack gap="xs">
                                <Text size="sm" fw={500}>Uploaded Images ({uploadedImages.length})</Text>
                                {uploadedImages.map((image) => (
                                    <Card key={image.id} withBorder p="sm">
                                        <Group justify="space-between">
                                            <Text size="sm">{image.fileName}</Text>
                                            <Badge color="green" variant="light">
                                                <IconCheck size={12} />
                                            </Badge>
                                        </Group>
                                    </Card>
                                ))}
                            </Stack>
                        )}

                        <Group justify="flex-end" mt="xl">
                            <Button
                                onClick={nextStep}
                                disabled={uploadedImages.length === 0}
                            >
                                Next Step
                            </Button>
                        </Group>
                    </Stack>
                </Stepper.Step>

                <Stepper.Step
                    label="Processing Options"
                    description="Configure your order"
                    icon={<IconCheck size={18} />}
                >
                    <Stack mt="xl">
                        <Text>Select processing options for your images</Text>

                        <Card withBorder p="md">
                            <Stack gap="sm">
                                <Text fw={500}>Available Processing Options</Text>
                                <Checkbox
                                    label="Select Free Form"
                                    description="Extract objects from images using AI selection"
                                    checked={selectedOptions.includes(ProcessingOption.SELECT_FREE_FORM)}
                                    onChange={(event) => {
                                        if (event.currentTarget.checked) {
                                            setSelectedOptions(prev => [...prev, ProcessingOption.SELECT_FREE_FORM]);
                                        } else {
                                            setSelectedOptions(prev => prev.filter(opt => opt !== ProcessingOption.SELECT_FREE_FORM));
                                        }
                                    }}
                                />
                            </Stack>
                        </Card>

                        <Group justify="space-between" mt="xl">
                            <Button variant="default" onClick={prevStep}>
                                Back
                            </Button>
                            <Button
                                onClick={handleCreateOrder}
                                loading={loading}
                                disabled={selectedOptions.length === 0}
                            >
                                Create Order
                            </Button>
                        </Group>
                    </Stack>
                </Stepper.Step>
            </Stepper>
        </Container>
    );
}