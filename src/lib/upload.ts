import fs from 'fs'
import path from 'path'
import { v4 as uuidv4 } from 'uuid'

/**
 * Saves a base64 encoded image to the public/uploads directory.
 * @param base64String The base64 image string (e.g., "data:image/png;base64,iVBORw0KGgo...")
 * @returns The public URL path to the saved image (e.g., "/uploads/1234.png")
 */
export async function saveBase64Image(base64String: string): Promise<string | null> {
  if (!base64String || !base64String.startsWith('data:image/')) {
    return null
  }

  try {
    // Extract the image type and base64 data
    const matches = base64String.match(/^data:image\/([A-Za-z-+\/]+);base64,(.+)$/)
    if (!matches || matches.length !== 3) {
      return null
    }

    const imageType = matches[1]
    const imageData = matches[2]
    
    // Ensure the uploads directory exists
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads')
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true })
    }

    // Generate a unique filename
    const filename = `${uuidv4()}.${imageType}`
    const filepath = path.join(uploadsDir, filename)

    // Save the file
    const buffer = Buffer.from(imageData, 'base64')
    fs.writeFileSync(filepath, buffer)

    return `/uploads/${filename}`
  } catch (error) {
    console.error("Error saving image:", error)
    return null
  }
}
