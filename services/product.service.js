import boom from '@hapi/boom';
import { models } from '../lib/sequelize.js';

export default class ProductService {
  constructor() {}

  async create(newProduct) {
    const existingCategory = await models.Category.findByPk(
      newProduct.categoryId,
    );
    if (!existingCategory) {
      throw boom.notFound(
        `Category not found with id: ${newProduct.categoryId}`,
      );
    }

    const newProductCreate = await models.Product.create(newProduct);
    newProductCreate.dataValues.category = existingCategory;
    return newProductCreate;
  }

  async find({
    category,
    minPrice,
    maxPrice,
    sortBy,
    sortOrder,
    limit,
    offset,
  }) {
    const data = await models.Product.findAll({
      include: ['category'],
    });
    return data;
  }

  async findOne(productId) {
    const product = await models.Product.findByPk(productId, {
      include: ['category'],
    });
    if (!product) {
      throw boom.notFound('Product not found');
    }
    return product;
  }

  async update(productId, newProduct) {
    const product = await models.Product.findByPk(productId);
    if (!product) {
      throw boom.notFound('Product not found');
    }

    const existingCategory = await models.Category.findByPk(
      newProduct.categoryId,
    );
    if (!existingCategory) {
      throw boom.notFound(
        `Category not found with id: ${newProduct.categoryId}`,
      );
    }

    const updateProduct = await models.Product.update(newProduct, {
      where: { id: productId },
      returning: true,
    });
    return updateProduct;
  }

  async updatePartial(productId, newProduct) {
    return this.update(productId, newProduct);
  }

  async delete(productId) {
    const product = await models.Product.findByPk(productId);
    if (!product) {
      throw boom.notFound('Product not found');
    }

    await product.destroy(product);
    return { id: productId };
  }
}
