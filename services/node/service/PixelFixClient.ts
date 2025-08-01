import { PixelFixApiException } from "@/exception/PixelFixApiException";
import { AuthData } from "@/model/AuthData";

export class PixelFixClient {
    private readonly PIXEL_FIX_API_URL = 'http://localhost/api';

    public async fetchData(
        path: string,
        authData: AuthData | null = null,
        headers: Record<string, string> = {},
    ): Promise<any> {
        const endpoint = this.getEndpoint(path);

        try {
            const response = await fetch(endpoint, {
                method: 'GET',
                headers: this.composeHeaders(headers, authData),
            });

            if (!response.ok) {
                throw new PixelFixApiException(
                    response.status,
                    'GET_ERROR',
                    response,
                    `Failed to post data to ${endpoint}. Status: ${response.status}`
                );
            }

            return await response.json();
        } catch (error) {
            console.error('Fetch error:', error);
            throw error;
        }
    }

    public async postData(
        path: string,
        data: any,
        headers: Record<string, string> | null = null,
        authData: AuthData | null = null
    ): Promise<any> {
        const endpoint = this.getEndpoint(path);

        try {
            const isFormData = data instanceof FormData;
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: this.composeHeaders(headers, authData, isFormData),
                body: isFormData ? data : JSON.stringify(data),
            });

            if (!response.ok) {
                throw new PixelFixApiException(
                    response.status,
                    'POST_ERROR',
                    response,
                    `Failed to post data to ${endpoint}. Status: ${response.status}`
                );
            }

            return await response.json();
        } catch (error) {
            console.error('Post error:', error);
            throw error;
        }
    }

    public async putData(
        path: string,
        data: any,
        headers: Record<string, string> | null = null,
        authData: AuthData | null = null
    ): Promise<any> {
        const endpoint = this.getEndpoint(path);

        try {
            const isFormData = data instanceof FormData;
            const response = await fetch(endpoint, {
                method: 'PUT',
                headers: this.composeHeaders(headers, authData, isFormData),
                body: isFormData ? data : JSON.stringify(data),
            });

            if (!response.ok) {
                throw new PixelFixApiException(
                    response.status,
                    'PUT_ERROR',
                    response,
                    `Failed to put data to ${endpoint}. Status: ${response.status}`
                );
            }

            return await response.json();
        } catch (error) {
            console.error('Put error:', error);
            throw error;
        }
    }

    private getEndpoint(path: string): string {
        return `${this.PIXEL_FIX_API_URL}/${path}`;
    }

    private composeHeaders(headers: Record<string, string> | null, authData: AuthData | null, isFormData: boolean = false): Record<string, string> {
        const composedHeaders: Record<string, string> = {};

        // Only set Content-Type if it's not FormData (browser will set it automatically for FormData)
        if (!isFormData) {
            composedHeaders['Content-Type'] = 'application/json';
        }
        // For FormData, don't set Content-Type - let the browser set it with the correct boundary

        if (headers) {
            Object.assign(composedHeaders, headers);
        }

        if (authData) {
            // eslint-disable-next-line dot-notation
            composedHeaders['Authorization'] = `Bearer ${authData.token}`;
        }

        return composedHeaders;
    }
}
