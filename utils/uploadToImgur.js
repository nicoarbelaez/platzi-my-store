import { config } from '../config/config.js';
import { URL_IMGUR_API } from './consts.js';

export async function uploadImageToImgur(buffer, mimeType) {
  const base64Image = buffer.toString('base64');

  const formData = new FormData();
  formData.append('image', base64Image);
  formData.append('type', 'base64');

  let response;
  try {
    response = await fetch(`${URL_IMGUR_API}/image`, {
      method: 'POST',
      headers: {
        Authorization: `Client-ID ${config.imgur.clientId}`,
      },
      body: formData,
    });
  } catch (error) {
    throw new Error(`Failed to fetch from Imgur API: ${error.message}`);
  }

  let data;
  try {
    data = await response.json();
  } catch (error) {
    throw new Error(`Failed to parse JSON response: ${error.message}`);
  }
  return data.data;
}
