import { PixelFixApiException } from "@/exception/PixelFixApiException";
import { AuthData } from "@/model/AuthData";

export class PixelFixClient {
    private readonly PIXEL_FIX_API_URL = 'http://127.0.0.1:8000/api';

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
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: this.composeHeaders(headers, authData),
                body: JSON.stringify(data),
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

    private getEndpoint(path: string): string {
        return `${this.PIXEL_FIX_API_URL}/${path}`;
    }

    private composeHeaders(headers: Record<string, string> | null, authData: AuthData | null): Record<string, string> {
        const composedHeaders: Record<string, string> = {
            'Content-Type': 'application/json',
        };

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
