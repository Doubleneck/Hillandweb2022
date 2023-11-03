const dotenv = require('dotenv')
require('util').promisify
dotenv.config()
const crypto = require('crypto')
const randomBytes = crypto.randomBytes
const s3Bucket = process.env.AWS_S3_BUCKET
const s3Region = process.env.AWS_REGION


const {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} = require('@aws-sdk/client-s3')


const s3Endpoint = 'http://localhost:4566' // Use the LocalStack endpoint with port 4566
const s3Client = new S3Client({ region: s3Region, endpoint: s3Endpoint, forcePathStyle: true }) // Configure the S3 client

async function uploadImageToS3(imageFileBuffer) {
  const rawBytes = randomBytes(16)
  const imageName = rawBytes.toString('hex')
  const s3ObjectKey = imageName 

  const params = {
    Bucket: s3Bucket,
    Key: s3ObjectKey,
    Body:imageFileBuffer,
    ContentType: 'application/octet-stream',
  }

  try {
    await s3Client.send(new PutObjectCommand(params))
    console.log('Image uploaded to S3 successfully:')

    const s3Url = `${s3Endpoint}/${s3Bucket}/${s3ObjectKey}`
    return s3Url
  } catch (error) {
    console.error('Error uploading image to S3:', error)
    throw error
  }
}

async function deleteImageFromS3(s3ObjectKey) {
  const params = {
    Bucket: s3Bucket,
    Key: s3ObjectKey,
  }
  
  try {
    await s3Client.send(new DeleteObjectCommand(params))
    console.log(`Image ${s3ObjectKey} deleted from S3 successfully.`)
  } catch (error) {
    console.error(`Error deleting image ${s3ObjectKey} from S3:`, error)
    throw error
  }
}

module.exports.uploadImageToS3 = uploadImageToS3
module.exports.deleteImageFromS3 = deleteImageFromS3