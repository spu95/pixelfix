import { Image, Order } from "@/types/types";
import { PixelFixClient } from "./PixelFixClient";
import { AuthData } from "@/model/AuthData";
import { CreateOrder } from "@/model/CreateOrder";

export class OrderService {
    constructor(private readonly pixelFixClient: PixelFixClient) { }

    async getOrderList(authData: AuthData): Promise<Order[]> {
        return this.pixelFixClient.fetchData('/orders', authData);
    }

    async uploadImage(file: File, authData: AuthData): Promise<Image> {
        const formData = new FormData();
        formData.append('file', file);

        return this.pixelFixClient.postData('/orders/upload-image', formData, null, authData);
    }

    async createOrder(createOrder: CreateOrder, authData: AuthData): Promise<Order> {
        return this.pixelFixClient.postData('/order/create', createOrder, null, authData);
    }
}