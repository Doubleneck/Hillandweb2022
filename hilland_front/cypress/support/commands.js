import 'cypress-file-upload'

Cypress.Commands.add('login', ({ username, password }) => {
  cy.request('POST', 'http://localhost:3001/api/login', {
    username, password
  }).then(({ body }) => {
    localStorage.setItem('loggedUser', JSON.stringify(body))
    cy.visit('')
  })
})

Cypress.Commands.add('postSongrequest', ({ artist, song }) => {
  cy.request('POST', 'http://localhost:3001/api/songrequests', {
    artist, song
  })
})

Cypress.Commands.add('postNews', ({ title, content, url, imageFile }) => {
  // Convert imageFile to a Blob
  const blob = Cypress.Blob.base64StringToBlob(imageFile, 'image/jpeg')

  // Create FormData and append fields
  const formData = new FormData()
  formData.append('title', title)
  formData.append('content', content)
  formData.append('url', url)
  formData.append('date', new Date().toISOString())
  formData.append('imageFile', blob, 'sample-image.jpg')

  // Make the request
  cy.request({
    method: 'POST',
    url: 'http://localhost:3001/api/news',
    headers: {
      Authorization: `Bearer ${JSON.parse(localStorage.getItem('loggedUser')).token}`,
    },
    body: formData,
  })
})

Cypress.Commands.add('postArchiveItem', ({ title, content, year, imageFile }) => {
  // Convert imageFile to a Blob
  const blob = Cypress.Blob.base64StringToBlob(imageFile, 'image/jpeg')

  // Create FormData and append fields
  const formData = new FormData()
  formData.append('title', title)
  formData.append('content', content)
  formData.append('year', year)
  formData.append('imageFile', blob, 'sample-image.jpg')

  // Make the request
  cy.request({
    method: 'POST',
    url: 'http://localhost:3001/api/archives',
    headers: {
      Authorization: `Bearer ${JSON.parse(localStorage.getItem('loggedUser')).token}`,
    },
    body: formData,
  })
})

Cypress.Commands.add('postRelease', ({ title, content, year, buyLink, listenLink, imageFile }) => {
  // Convert imageFile to a Blob
  const blob = Cypress.Blob.base64StringToBlob(imageFile, 'image/jpeg')

  // Create FormData and append fields
  const formData = new FormData()
  formData.append('title', title)
  formData.append('content', content)
  formData.append('year', year)
  formData.append('buyLink', buyLink)
  formData.append('listenLink', listenLink)
  formData.append('imageFile', blob, 'sample-image.jpg')

  // Make the request
  cy.request({
    method: 'POST',
    url: 'http://localhost:3001/api/releases',
    headers: {
      Authorization: `Bearer ${JSON.parse(localStorage.getItem('loggedUser')).token}`,
    },
    body: formData,
  })
})