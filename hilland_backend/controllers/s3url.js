const s3urlRouter = require('express').Router()
const generateUploadURL = require('../s3.js').generateUploadURL
const s3 = require('../s3.js')

s3urlRouter.get('/', async (req, res) => {
  const url = await s3.generateUploadURL()
  await res.send({ url })
})

module.exports = s3urlRouter
