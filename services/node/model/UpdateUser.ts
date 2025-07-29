export class UpdateUser {
    constructor(
        public readonly firstName: string,
        public readonly lastName: string,
        public readonly email: string,
        public readonly phoneNumber: string,
        public readonly companyName: string | null,
        public readonly street: string,
        public readonly houseNumber: string,
        public readonly city: string,
        public readonly zip: number,
    ) {}
}