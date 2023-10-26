const s3urlRouter = require('express').Router()
require('../s3.js').generateUploadURL
const s3 = require('../s3.js')
const { adminCredentialsValidator, userLoggedInValidator } = require('../utils/middleware')

s3urlRouter.get('/',  userLoggedInValidator, adminCredentialsValidator, async (req, res) => {

  const url = await s3.generateUploadURL()
  await res.send({ url })
})

module.exports = s3urlRouter
