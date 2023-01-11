const aws_sdk = require('aws-sdk')
const dotenv = require('dotenv')
const crypto = require('crypto')
const randomBytes = crypto.randomBytes
const promisify = require('util').promisify
dotenv.config()

const region = 'eu-central-1'
const bucketName = 'hillandwebimgs'
const accessKeyId = process.env.AWS_ACCESS_KEY_ID
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY

const s3 = new aws_sdk.S3({
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
    Expires: 60,
  }

  const uploadURL = await s3.getSignedUrlPromise('putObject', params)
  console.log('uploadUrl', uploadURL)
  return uploadURL
}
module.exports.generateUploadURL = generateUploadURL
