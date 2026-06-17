"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InMemoryProductsRepository = void 0;
class InMemoryProductsRepository {
    products = [];
    nextId = 1;
    findAll() {
        return this.products;
    }
    findById(id) {
        return this.products.find((p) => p.id === id);
    }
    create(input) {
        const product = {
            id: this.nextId++,
            name: input.name,
            price: input.price,
        };
        this.products.push(product);
        return product;
    }
    update(id, input) {
        const product = this.findById(id);
        if (!product)
            return undefined;
        if (input.name !== undefined)
            product.name = input.name;
        if (input.price !== undefined)
            product.price = input.price;
        return product;
    }
    remove(id) {
        const product = this.findById(id);
        if (!product)
            return undefined;
        this.products = this.products.filter((p) => p.id !== id);
        return product;
    }
}
exports.InMemoryProductsRepository = InMemoryProductsRepository;
//# sourceMappingURL=in-memory-products.repository.js.map