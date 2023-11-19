const { pipeline } = require("node:stream");
const util = require("node:util");
const pump = util.promisify(pipeline);
const fs = require("node:fs");
const { pdf } = require("pdf-to-img");

export const pdfToImage = async (pdfPath: string) => {
  const pages = await pdf(pdfPath);
  let counter = 0;
  let base64Images: string[] = [];

  for await (const image of pages) {
    const path = `./assets/${counter})-${pdfPath}.png`;
    await fs.promises.writeFile(path, image);
    const base64Image = imageToBase64(path);
    base64Images.push(base64Image);
    await deleteFile(path);
    counter++;
  }
  return base64Images;
};

export async function deleteFile(filePath: string) {
  try {
    await fs.promises.unlink(filePath);
    console.log(`File ${filePath} deleted successfully`);
  } catch (error: any) {
    console.error(`Error deleting file ${filePath}:`, error.message);
  }
}

function imageToBase64(imagePath: string) {
  // Read the image file as a buffer
  const imageBuffer = fs.readFileSync(imagePath);

  // Convert the buffer to a Base64-encoded string
  const base64String = imageBuffer.toString("base64");

  return base64String;
}
