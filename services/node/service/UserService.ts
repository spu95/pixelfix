import { User } from "@/types/types";
import { PixelFixClient } from "./PixelFixClient";
import { AuthData } from "@/model/AuthData";
import { UpdateUser } from "@/model/UpdateUser";

export class UserService {
    constructor(private readonly pixelFixClient: PixelFixClient) { }

    async getUserProfile(authData: AuthData): Promise<User> {
        return this.pixelFixClient.fetchData('user', authData);
    }

    async updateUserProfile(updateUser: UpdateUser, authData: AuthData): Promise<User> {
        return this.pixelFixClient.putData('user', updateUser, null, authData);
    }
}