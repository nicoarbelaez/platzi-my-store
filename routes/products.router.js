import express from 'express';
import ProductService from '../services/product.service.js';
import { validatorHandler } from '../middlewares/validator.handler.js';
import {
  createProductSchema,
  getProductSchema,
  querySchema,
  updateProductSchema,
} from '../schemas/product.schemas.js';
import { upload } from '../lib/multer.js';
import { multerProductImageSchema } from '../schemas/product-image.schemas.js';
import { MAX_IMAGE_PER_PRODUCT } from '../utils/consts.js';

const router = express.Router();
const service = new ProductService();

router.get('/', validatorHandler(querySchema, 'query'), async (req, res) => {
  res.json(await service.find(req.query));
});

router.get(
  '/:id',
  validatorHandler(getProductSchema, 'params'),
  async (req, res, next) => {
    try {
      const productId = parseInt(req.params.id);
      const product = await service.findOne(productId);

      res.json(product);
    } catch (error) {
      next(error);
    }
  },
);

router.post(
  '/',
  upload.array('images', MAX_IMAGE_PER_PRODUCT),
  validatorHandler(multerProductImageSchema, 'files'),
  validatorHandler(createProductSchema, 'body'),
  async (req, res, next) => {
    try {
      const newProduct = await service.create(req.body, req.files);
      res.status(201).json({
        status: 201,
        message: 'Product created successfully',
        product: newProduct,
      });
    } catch (error) {
      next(error);
    }
  },
);

router.put(
  '/:id',
  upload.array('imagesToAdd', MAX_IMAGE_PER_PRODUCT),
  validatorHandler(multerProductImageSchema, 'files'),
  validatorHandler(getProductSchema, 'params'),
  validatorHandler(updateProductSchema, 'body'),
  async (req, res, next) => {
    try {
      const productId = parseInt(req.params.id);
      const product = await service.update(productId, req.body, req.files);

      res.status(200).json({
        status: 200,
        message: 'Product update successfully',
        product: product,
      });
    } catch (error) {
      next(error);
    }
  },
);

router.patch(
  '/:id',
  upload.array('imagesToAdd', MAX_IMAGE_PER_PRODUCT),
  validatorHandler(multerProductImageSchema, 'files'),
  validatorHandler(getProductSchema, 'params'),
  validatorHandler(updateProductSchema, 'body'),
  async (req, res, next) => {
    try {
      const productId = parseInt(req.params.id);
      const product = await service.updatePartial(
        productId,
        req.body,
        req.files,
      );

      res.status(200).json({
        status: 200,
        message: 'Product update successfully',
        product: product,
      });
    } catch (error) {
      next(error);
    }
  },
);

router.delete(
  '/:id',
  validatorHandler(getProductSchema, 'params'),
  async (req, res, next) => {
    try {
      const productId = parseInt(req.params.id, 10);
      const { id } = await service.delete(productId);

      res.status(200).json({
        status: 200,
        message: 'Product delete successfully',
        id,
      });
    } catch (error) {
      next(error);
    }
  },
);

export default router;
