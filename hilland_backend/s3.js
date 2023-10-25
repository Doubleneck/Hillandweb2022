const aws_sdk = require('aws-sdk')
const dotenv = require('dotenv')
const crypto = require('crypto')
const randomBytes = crypto.randomBytes
require('util').promisify
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

async function deleteImage(id) {
  console.log('deletoitavan id S3ssa:', id)
  const params = {
    Bucket: bucketName,
    Key: id, //if any sub folder-> path/of/the/folder.ext
  }
  try {
    await s3.headObject(params).promise()
    console.log('File Found in S3')
    try {
      await s3.deleteObject(params).promise()
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
