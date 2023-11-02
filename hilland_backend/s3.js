const dotenv = require('dotenv')
require('util').promisify
dotenv.config()
const crypto = require('crypto')
const randomBytes = crypto.randomBytes
const region = 'eu-central-1'
const bucketName = 'hillandwebimgs'
const accessKeyId = process.env.AWS_ACCESS_KEY_ID
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY
const {
  getSignedUrl
} = require('@aws-sdk/s3-request-presigner')

const {
  S3Client,
  PutObjectCommand,
  S3,
} = require('@aws-sdk/client-s3')

const currentDate = new Date()

// Add 60 minutes (60 minutes * 60 seconds * 1000 milliseconds) to the current date
const futureDate = new Date(currentDate.getTime() + 60 * 60 * 1000)

const s3 = new S3({
  region,
  accessKeyId,
  secretAccessKey,
  signatureVersion: 'v4',
})

async function generateUploadURL() {
  const rawBytes = await randomBytes(16)
  const imageName = rawBytes.toString('hex')

  const params = {
    Bucket: bucketName,
    Key: imageName,
    expiresIn: futureDate
  }

  const uploadURL = await getSignedUrl(s3, new PutObjectCommand(params))
  return uploadURL
}
const s3Bucket = 'hillandwebimgs' 
const s3Region = 'eu-central-1' 
const s3Client = new S3Client({ region: s3Region })

async function uploadImageToS3(imageFileBuffer) {
  const rawBytes = randomBytes(16)
  const imageName = rawBytes.toString('hex')
  const s3ObjectKey = imageName 

  const params = {
    Bucket: s3Bucket,
    Key: s3ObjectKey,
    Body: imageFileBuffer,
  }

  try {
    const uploadResponse = await s3Client.send(new PutObjectCommand(params))
    console.log('Image uploaded to S3 successfully:', uploadResponse)

    const s3Url = `https://${s3Bucket}.s3.${s3Region}.amazonaws.com/${s3ObjectKey}`
    return s3Url
  } catch (error) {
    console.error('Error uploading image to S3:', error)
    throw error 
  }
}

async function deleteImage(id) {
  console.log('deletoitavan id S3ssa:', id)
  const params = {
    Bucket: bucketName,
    Key: id, //if any sub folder-> path/of/the/folder.ext
  }
  try {
    await s3.headObject(params)
    console.log('File Found in S3')
    try {
      await s3.deleteObject(params)
      console.log('file deleted Successfully')
    } catch (err) {
      console.log('ERROR in file Deleting : ' + JSON.stringify(err))
    }
  } catch (err) {
    console.log('File not Found ERROR : ' + err.code)
  }
}

module.exports.generateUploadURL = generateUploadURL
module.exports.deleteImage = deleteImage
module.exports.uploadImageToS3 = uploadImageToS3


