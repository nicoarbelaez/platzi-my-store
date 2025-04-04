import { Category, CategorySchema } from './category.model.js';
import { Customer, CustomerSchema } from './customer.model.js';
import { OrderProduct, OrderProductSchema } from './order-producto.model.js';
import { Order, OrderSchema } from './order.model.js';
import { Product, ProductSchema } from './product.model.js';
import { User, UserSchema } from './user.model.js';
import { ProductImage, ProductImageSchema } from './product-image.model.js';

export const setupModels = (sequelize) => {
  User.init(UserSchema, User.config(sequelize));
  Product.init(ProductSchema, Product.config(sequelize));
  Customer.init(CustomerSchema, Customer.config(sequelize));
  Category.init(CategorySchema, Category.config(sequelize));
  Order.init(OrderSchema, Order.config(sequelize));
  OrderProduct.init(OrderProductSchema, OrderProduct.config(sequelize));
  ProductImage.init(ProductImageSchema, ProductImage.config(sequelize));

  User.associate(sequelize.models);
  Customer.associate(sequelize.models);
  Product.associate(sequelize.models);
  Category.associate(sequelize.models);
  Order.associate(sequelize.models);
  ProductImage.associate(sequelize.models);
};
