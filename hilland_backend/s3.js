const dotenv = require('dotenv')
require('util').promisify
dotenv.config()
const crypto = require('crypto')
const randomBytes = crypto.randomBytes
const s3Bucket = process.env.AWS_S3_BUCKET
const s3Region = process.env.AWS_REGION
const accessKeyId = process.env.AWS_ACCESS_KEY_ID
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY
const currentDate = new Date()
// Add 60 minutes (60 minutes * 60 seconds * 1000 milliseconds) to the current date
const futureDate = new Date(currentDate.getTime() + 60 * 60 * 1000)
const {
  getSignedUrl
} = require('@aws-sdk/s3-request-presigner')
const {
  S3Client,
  PutObjectCommand,
  S3,
} = require('@aws-sdk/client-s3')
const s3Client = new S3Client({ region: s3Region })



const s3 = new S3({
  s3Region,
  accessKeyId,
  secretAccessKey,
  signatureVersion: 'v4',
})

//this function is currently not used
async function generateS3UploadURL() {
  const rawBytes = await randomBytes(16)
  const imageName = rawBytes.toString('hex')

  const params = {
    Bucket: s3Bucket ,
    Key: imageName,
    expiresIn: futureDate
  }

  const uploadURL = await getSignedUrl(s3, new PutObjectCommand(params))
  return uploadURL
}


async function uploadImageToS3(imageFileBuffer) {
  const rawBytes = randomBytes(16)
  const imageName = rawBytes.toString('hex')
  const s3ObjectKey = imageName 

  
  const params = {
    Bucket: s3Bucket,
    Key: s3ObjectKey,
    Body: imageFileBuffer,
    ContentType: 'application/octet-stream'
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

async function deleteImageFromS3(id) {
  console.log('deletoitavan id S3ssa:', id)
  const params = {
    Bucket: s3Bucket,
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

module.exports.generateUploadURL = generateS3UploadURL
module.exports.deleteImageFromS3 = deleteImageFromS3
module.exports.uploadImageToS3 = uploadImageToS3