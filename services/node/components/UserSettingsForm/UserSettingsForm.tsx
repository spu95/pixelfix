'use client';

import { useState, useEffect } from 'react';
import { 
    TextInput, 
    Button, 
    Stack, 
    Card, 
    Group, 
    Text, 
    Alert, 
    Loader, 
    Center,
    Grid 
} from '@mantine/core';
import { IconUser, IconMail, IconPhone, IconBuilding, IconMapPin } from '@tabler/icons-react';
import { User } from '@/types/types';
import { UserService } from '@/service/UserService';
import { PixelFixClient } from '@/service/PixelFixClient';
import { UpdateUser } from '@/model/UpdateUser';
import { useAuthData } from '@/hooks/useAuthData';

const userService = new UserService(new PixelFixClient());

export function UserSettingsForm() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const { authData } = useAuthData();

    // Form state
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        companyName: '',
        street: '',
        houseNumber: '',
        city: '',
        zip: 0
    });

    useEffect(() => {
        const fetchUserProfile = async () => {
            if (!authData) {
                setLoading(false);
                return;
            }

            try {
                setError(null);
                const userProfile = await userService.getUserProfile(authData);
                setUser(userProfile);
                setFormData({
                    firstName: userProfile.firstName,
                    lastName: userProfile.lastName,
                    email: userProfile.email,
                    phoneNumber: userProfile.phoneNumber,
                    companyName: userProfile.companyName || '',
                    street: userProfile.street,
                    houseNumber: userProfile.houseNumber,
                    city: userProfile.city,
                    zip: userProfile.zip
                });
            } catch (err) {
                setError('Failed to load user profile. Please try again.');
                console.error('Error fetching user profile:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchUserProfile();
    }, [authData]);

    const handleInputChange = (field: string, value: string | number) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
        // Clear success message when user starts editing
        if (success) setSuccess(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!authData) return;

        setSaving(true);
        setError(null);
        setSuccess(null);

        try {
            const updateUser = new UpdateUser(
                formData.firstName,
                formData.lastName,
                formData.email,
                formData.phoneNumber,
                formData.companyName || null,
                formData.street,
                formData.houseNumber,
                formData.city,
                formData.zip
            );

            const updatedUser = await userService.updateUserProfile(updateUser, authData);
            setUser(updatedUser);
            setSuccess('Profile updated successfully!');
        } catch (err: any) {
            setError(err.message || 'Failed to update profile. Please try again.');
            console.error('Error updating user profile:', err);
        } finally {
            setSaving(false);
        }
    };

    if (!authData) {
        return (
            <Alert color="blue">
                Please log in to access your settings.
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

    return (
        <Card withBorder p="xl">
            <Stack gap="lg">
                <div>
                    <Text size="lg" fw={500} mb="xs">Profile Settings</Text>
                    <Text c="dimmed" size="sm">
                        Update your personal information and address details.
                    </Text>
                </div>

                {error && (
                    <Alert color="red" mb="md">
                        {error}
                    </Alert>
                )}

                {success && (
                    <Alert color="green" mb="md">
                        {success}
                    </Alert>
                )}

                <form onSubmit={handleSubmit}>
                    <Stack gap="md">
                        <Text fw={500} size="sm" c="dimmed">Personal Information</Text>
                        
                        <Grid>
                            <Grid.Col span={6}>
                                <TextInput
                                    label="First Name"
                                    placeholder="Enter your first name"
                                    leftSection={<IconUser size={16} />}
                                    value={formData.firstName}
                                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                                    required
                                />
                            </Grid.Col>
                            <Grid.Col span={6}>
                                <TextInput
                                    label="Last Name"
                                    placeholder="Enter your last name"
                                    leftSection={<IconUser size={16} />}
                                    value={formData.lastName}
                                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                                    required
                                />
                            </Grid.Col>
                        </Grid>

                        <TextInput
                            label="Email Address"
                            placeholder="Enter your email address"
                            leftSection={<IconMail size={16} />}
                            value={formData.email}
                            onChange={(e) => handleInputChange('email', e.target.value)}
                            type="email"
                            required
                        />

                        <Grid>
                            <Grid.Col span={6}>
                                <TextInput
                                    label="Phone Number"
                                    placeholder="Enter your phone number"
                                    leftSection={<IconPhone size={16} />}
                                    value={formData.phoneNumber}
                                    onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                                    required
                                />
                            </Grid.Col>
                            <Grid.Col span={6}>
                                <TextInput
                                    label="Company Name"
                                    placeholder="Enter your company name (optional)"
                                    leftSection={<IconBuilding size={16} />}
                                    value={formData.companyName}
                                    onChange={(e) => handleInputChange('companyName', e.target.value)}
                                />
                            </Grid.Col>
                        </Grid>

                        <Text fw={500} size="sm" c="dimmed" mt="md">Address Information</Text>

                        <Grid>
                            <Grid.Col span={8}>
                                <TextInput
                                    label="Street"
                                    placeholder="Enter your street name"
                                    leftSection={<IconMapPin size={16} />}
                                    value={formData.street}
                                    onChange={(e) => handleInputChange('street', e.target.value)}
                                    required
                                />
                            </Grid.Col>
                            <Grid.Col span={4}>
                                <TextInput
                                    label="House Number"
                                    placeholder="No."
                                    value={formData.houseNumber}
                                    onChange={(e) => handleInputChange('houseNumber', e.target.value)}
                                    required
                                />
                            </Grid.Col>
                        </Grid>

                        <Grid>
                            <Grid.Col span={8}>
                                <TextInput
                                    label="City"
                                    placeholder="Enter your city"
                                    value={formData.city}
                                    onChange={(e) => handleInputChange('city', e.target.value)}
                                    required
                                />
                            </Grid.Col>
                            <Grid.Col span={4}>
                                <TextInput
                                    label="ZIP Code"
                                    placeholder="12345"
                                    value={formData.zip.toString()}
                                    onChange={(e) => handleInputChange('zip', parseInt(e.target.value) || 0)}
                                    type="number"
                                    required
                                />
                            </Grid.Col>
                        </Grid>

                        <Group justify="flex-end" mt="xl">
                            <Button
                                type="submit"
                                loading={saving}
                                disabled={saving}
                            >
                                Save Changes
                            </Button>
                        </Group>
                    </Stack>
                </form>
            </Stack>
        </Card>
    );
}