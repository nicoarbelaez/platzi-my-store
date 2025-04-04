import { Op } from 'sequelize';
import boom from '@hapi/boom';
import { models } from '../lib/sequelize.js';
import { uploadImageToImgur } from '../utils/uploadToImgur.js';

export const deleteImagesForProduct = async (productId, imagesToRemove) => {
  const images = await models.ProductImage.findAll({
    where: {
      id: { [Op.in]: imagesToRemove },
      productId,
    },
  });

  if (images.length !== imagesToRemove.length) {
    throw boom.badRequest('Algunas imágenes no pertenecen a este producto.');
  }

  const deletedCount = await models.ProductImage.destroy({
    where: {
      id: { [Op.in]: imagesToRemove },
      productId,
    },
  });

  if (deletedCount !== imagesToRemove.length) {
    throw boom.badRequest(
      'No se pudieron eliminar todas las imágenes especificadas.',
    );
  }

  return deletedCount;
};

export const createImagesForProduct = async (productId, newProductImages) => {
  try {
    const imgurResponses = await Promise.all(
      newProductImages.map((file) => uploadImageToImgur(file.buffer)),
    );

    const consolidatedImages = imgurResponses.map((imgurData, index) => {
      const fileData = newProductImages[index];
      return {
        imgurId: imgurData.id,
        deletehash: imgurData.deletehash,
        mimetype: imgurData.type,
        width: imgurData.width,
        height: imgurData.height,
        size: imgurData.size,
        link: imgurData.link,
        datetime: imgurData.datetime,
        originalname: fileData.originalname,
        productId,
      };
    });

    const createdImages =
      await models.ProductImage.bulkCreate(consolidatedImages);
    return createdImages;
  } catch (error) {
    throw boom.badRequest('There was a problem uploading the images');
  }
};
