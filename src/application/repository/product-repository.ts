export default interface ProductRepository {
    create(input: CreateProductInput): Promise<void>;
    update(input: UpdateProductInput): Promise<void>;
    delete(input: DeleteProductInput): Promise<void>;
}

export type CreateProductInput = {
description: string;
price: number;
category: string;
};

export type UpdateProductInput = {
id: number;
description?: string;
price?: number;
category?: string;
};

export type DeleteProductInput = { id: number };