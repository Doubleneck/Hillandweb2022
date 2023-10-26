
const {
  getSignedUrl
} = require('@aws-sdk/s3-request-presigner')

const {
  PutObjectCommand,
  S3
} = require('@aws-sdk/client-s3')

//require('aws-sdk')
const dotenv = require('dotenv')
const crypto = require('crypto')
const randomBytes = crypto.randomBytes
require('util').promisify
dotenv.config()

const region = 'eu-central-1'
const bucketName = 'hillandwebimgs'
const accessKeyId = process.env.AWS_ACCESS_KEY_ID
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY

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
