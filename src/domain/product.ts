export default class Product {
    constructor(
      readonly id: number,
      readonly description: string,
      readonly price: number,
      readonly category: string
    ) {}
  }