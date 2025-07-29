import { ProcessingOption } from "@/types/types";

export class CreateOrder {
    public constructor(
        public readonly processingOptions: ProcessingOption[],
        public readonly imageIds: string[],
    ) {
    }
}