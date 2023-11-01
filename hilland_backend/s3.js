const {
  getSignedUrl
} = require('@aws-sdk/s3-request-presigner')

const {
  PutObjectCommand,
  S3,
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


// const { getSignedUrl } = require('@aws-sdk/s3-request-presigner')
// const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3')
// const { LocalStorage } = require('node-localstorage')

// const dotenv = require('dotenv')
// const crypto = require('crypto')
// const randomBytes = crypto.randomBytes
// require('util').promisify

// dotenv.config()

// const region = 'us-east-1' // You can use any region you like with LocalStack.
// const bucketName = 'hillandwebimgs'
// const accessKeyId = ''
// const secretAccessKey = ''

// // Configure the S3 client with LocalStack endpoint and local storage
// const s3 = new S3Client({
//   region,
//   endpoint: 'http://localhost:4566', // Point to LocalStack's endpoint
//   credentials: { accessKeyId, secretAccessKey },
//   forcePathStyle: true, // Necessary for LocalStack
//   signatureVersion: 'v4',
// })
// function transformLocalStackS3URL(originalURL) {
//   // Split the URL to extract the path and query parameters
//   const urlParts = originalURL.split('?')
//   if (urlParts.length !== 2) {
//     // Invalid URL, return the original URL as is
//     return originalURL
//   }

//   const [path, queryParams] = urlParts

//   // Split the path to get the part after the last slash
//   const pathParts = path.split('/')
//   const objectKey = pathParts[pathParts.length - 1]

//   // Construct the new URL
//   const newURL = `http://localhost:4566/${objectKey}`

//   return newURL
// }


// // Set up local storage for local development
// const localStorage = new LocalStorage('./scratch')

// async function generateUploadURL() {
//   const rawBytes = await randomBytes(16)
//   const imageName = rawBytes.toString('hex')

//   const params = {
//     Bucket: bucketName,
//     Key: imageName,
//   }

//   const uploadURL = await getSignedUrl(s3, new PutObjectCommand(params))
//   console.log('uploadURL:', uploadURL)
//   const returnURL = transformLocalStackS3URL(uploadURL)
//   console.log('returnURL:', returnURL)
//   return returnURL
// }

// // async function deleteImage(id) {
// //   console.log('Deleting S3 object with ID:', id)
// //   const params = {
// //     Bucket: bucketName,
// //     Key: id,
// //   }
// //   try {
// //     await s3.send(new HeadObjectCommand(params))
// //     console.log('File Found in S3')
// //     try {
// //       await s3.send(new DeleteObjectCommand(params))
// //       console.log('File deleted Successfully')
// //     } catch (err) {
// //       console.error('Error in file Deleting:', err)
// //     }
// //   } catch (err) {
// //     console.error('File not Found Error:', err)
// //   }
// // }

// module.exports.generateUploadURL = generateUploadURL
// //module.exports.deleteImage = deleteImage

