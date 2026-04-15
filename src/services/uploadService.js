
//src/services/uploadService.js
import axios from 'axios'

const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET

// Validate environment variables
if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_UPLOAD_PRESET) {
  console.error('Missing Cloudinary environment variables. Check your .env.local file.')
}

export const uploadFileToCloudinary = async (file) => {
  try {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET)

    const response = await axios.post(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/auto/upload`,
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
      }
    )

    return response.data.secure_url
  } catch (error) {
    console.error('Upload error:', error)
    throw new Error('Failed to upload document. Please try again.')
  }
}