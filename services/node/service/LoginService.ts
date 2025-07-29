import { AuthData } from "@/model/AuthData";
import { PixelFixClient } from "./PixelFixClient";

export class LoginService {
    public constructor(private pixelFixClient: PixelFixClient) { }

    public async login(username: string, password: string): Promise<AuthData> {
        const responseData = await this.pixelFixClient.postData(
            'login',
            { username, password },
        );

        return new AuthData(responseData.token);
    }
}