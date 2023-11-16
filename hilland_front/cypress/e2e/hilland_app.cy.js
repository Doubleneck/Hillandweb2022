
const userUser = () => ({
  username: 'user@user.com',
  password: 'User@user1',
})

const adminUser = () => ({
  username: 'admin@admin.com',
  password: 'Admin@admin1',
})

describe('Hilland app', function () {
  beforeEach(function () {
    cy.visit('')
  })

  it('front page contains staff-login', function () {
    cy.contains('Staff login')
    cy.get('[data-cy="staff-login"]').click()
    cy.get('[data-cy="login"]').should('exist')
  })
})

describe('When login form is open', function () {
  beforeEach(function () {
    cy.request('POST', 'http://localhost:3001/api/testing/reset')
    cy.visit('/login')
  })

  it('Login page contains Login', function () {
    cy.contains('Login')

  })
  it('login succeeds with correct credentials for USER', function () {

    cy.contains('Login')
    cy.get('[data-cy="username"]').type(`${userUser().username}`)
    cy.get('[data-cy="password"]').type(`${userUser().password}`)
    cy.get('[data-cy="login"]').click()
    cy.contains(`${userUser().username} logged in`)
    cy.visit('/news')
    cy.get('[data-cy="logout"]').should('exist')
  })

  it('login succeeds with correct credentials for ADMIN', function () {

    cy.contains('Login')
    cy.get('[data-cy="username"]').type(`${adminUser().username}`)
    cy.get('[data-cy="password"]').type(`${adminUser().password}`)
    cy.get('[data-cy="login"]').click()
    cy.contains(`${adminUser().username} logged in`)
    cy.visit('/news')
    cy.get('[data-cy="logout"]').should('exist')
  })

  it('login fails with wrong password', function () {

    cy.contains('Login')
    cy.get('[data-cy="username"]').type(`${userUser().username}`)
    cy.get('[data-cy="password"]').type(`${userUser().password}extra`)
    cy.get('[data-cy="login"]').click()
    cy.get('[data-cy="login"]').should('exist')
    cy.contains('Wrong credentials')
    cy.get('[data-cy="logout"]').should('not.exist')
  })

  it('stays logged in after page refresh', function () {
    cy.get('[data-cy="username"]').type(userUser().username)
    cy.get('[data-cy="password"]').type(userUser().password)
    cy.get('[data-cy="login"]').click()
    cy.contains(`${userUser().username} logged in`)
    cy.visit('/news')
    cy.get('[data-cy="logout"]').should('exist')
    cy.reload()
    cy.get('[data-cy="logout"]').should('exist')
  })
})
describe('when not logged in', function () {

  it('non logged user can see homepage', function () {
    cy.visit('')
    cy.contains('Hilland Mondays - American Heritage')
  })


  it('non logged user can see newspage', function () {
    cy.visit('/news')
    cy.contains('News')
  })

  it('non logged user can see videos page', function () {
    cy.visit('/videos')
    cy.contains('Hilland Playboys Videos: Live at Finnvox Studios (2018) :')
  })

  it('non logged user can see Trucker caps page', function () {
    cy.visit('/truckercaps')
    cy.contains('Legendary Hilland Trucker Caps:')
  })

  it('non logged user can see Archive page', function () {
    cy.visit('/archives')
    cy.contains('Hilland Mondays Archive')
  })

  it('non logged user can see Releases page', function () {
    cy.visit('/releases')
    cy.contains('Hilland Records Releases')
  })

  it('non logged user can not see songrequests page ', function () {
    cy.visit('/songrequests')
    cy.contains('Song requests').should('not.exist')
  })

  it('non logged user can not see users page ', function () {
    cy.visit('/users')
    cy.contains('Users').should('not.exist')
  })

  it('non logged user can send songrequest on homepage', function () {
    cy.visit('')
    cy.contains('Send us a song request...maybe we’ll play it next Monday!')
    cy.get('[data-cy="songrequest-form"]').should('exist')
    cy.get('[data-cy="artist"]').type('Willie Nelson')
    cy.get('[data-cy="song"]').type('Crazy')
    cy.get('[data-cy="send-songrequest"]').click()
    cy.contains('Thank you!!')
    cy.get('[data-cy="send-songrequest"]').should('not.exist')
    cy.contains('Send us a song request...maybe we’ll play it next Monday!').should('not.exist')
  })

  it('non logged user songrequest send fails on homepage if song missing', function () {
    cy.visit('')
    cy.contains('Send us a song request...maybe we’ll play it next Monday!')
    cy.get('[data-cy="songrequest-form"]').should('exist')
    cy.get('[data-cy="artist"]').type('Willie Nelson')
    cy.get('[data-cy="send-songrequest"]').click()
    cy.contains('We couldn´t take your request, try again later..')
  })
})

describe('when logged in as USER', function () {
  beforeEach(function () {
    cy.request('POST', 'http://localhost:3001/api/testing/reset')
    cy.login({ username: userUser().username, password: userUser().password })
    cy.postSongrequest({ artist: 'Johnny Cash', song: 'Folsom Prison Blues' })
  })

  it('user can log out from newspage', function () {
    cy.visit('/news')
    cy.get('[data-cy="logout"]').click()
    cy.contains('Staff login')
    cy.get('[data-cy="logout"]').should('not.exist')
  })


  it('user can log out from songrequests page ', function () {
    cy.visit('/songrequests')
    cy.get('[data-cy="logout"]').click()
    cy.get('[data-cy="logout"]').should('not.exist')
  })

  it('user can see songrequests page ', function () {
    cy.visit('/songrequests')
    cy.contains('Song requests')
    cy.contains('Folsom Prison Blues').should('exist')

  })
  it('user can see homepage', function () {
    cy.visit('')
    cy.contains('Hilland Mondays - American Heritage')
  })

  it('user can see newspage', function () {
    cy.visit('/news')
    cy.contains('News')
  })

  it('user can see videos page', function () {
    cy.visit('/videos')
    cy.contains('Hilland Playboys Videos: Live at Finnvox Studios (2018) :')
  })

  it('user can see Trucker caps page', function () {
    cy.visit('/truckercaps')
    cy.contains('Legendary Hilland Trucker Caps:')
  })

  it('user can see Releases page', function () {
    cy.visit('/releases')
    cy.contains('Hilland Records Releases')
  })

  it('user can see songrequests page ', function () {
    cy.visit('/songrequests')
    cy.contains('Song requests')
    cy.contains('[data-cy="songrequest"]', 'Folsom Prison Blues').should('exist')
  })

  it('user can not delete songrequests on songrequests page ', function () {
    cy.visit('/songrequests')
    cy.get('[data-cy="delete-songrequest-button"]').should('not.exist')
  })

  it(' user can not see users page ', function () {
    cy.visit('/users')
    cy.contains('Users').should('not.exist')
  })
})

describe('when logged in as ADMIN', function () {
  beforeEach(function () {
    cy.request('POST', 'http://localhost:3001/api/testing/reset')
    cy.login({ username: adminUser().username, password: adminUser().password })
    cy.postSongrequest({ artist: 'Johnny Cash', song: 'Folsom Prison Blues' })
    cy.fixture('sample-image.jpg').then((imageContent) => {
      cy.postNews({
        title: 'Great News',
        content: 'This is great news',
        url: 'https://www.google.com',
        imageFile: imageContent,
      })
    })
    cy.fixture('sample-image.jpg').then((imageContent) => {
      cy.postArchiveItem({
        title: 'Arhive item #1',
        content: 'This is great archive item',
        year: 2022,
        imageFile: imageContent,
      })
    })

    cy.fixture('sample-image.jpg').then((imageContent) => {
      cy.postRelease({
        title: 'Release #1',
        content: 'This is great release',
        year: 2022,
        buyLink: 'https://www.google.com',
        listenLink: 'https://www.google.com',
        imageFile: imageContent,
      })
    })
  })
  it('admin can add songrequest', function () {
    cy.visit('')
    cy.contains('Send us a song request...maybe we’ll play it next Monday!')
    cy.get('[data-cy="songrequest-form"]').should('exist')
    cy.get('[data-cy="artist"]').type('Willie Nelson')
    cy.get('[data-cy="song"]').type('Crazy')
    cy.get('[data-cy="send-songrequest"]').click()
    cy.contains('Thank you!!')
    cy.get('[data-cy="send-songrequest"]').should('not.exist')
    cy.contains('Send us a song request...maybe we’ll play it next Monday!').should('not.exist')
  })
  it('admin can log out from newspage', function () {
    cy.visit('/news')
    cy.get('[data-cy="logout"]').click()
    cy.contains('Staff login')
    cy.get('[data-cy="logout"]').should('not.exist')
  })

  it('admin can log out from songrequests page ', function () {
    cy.visit('/songrequests')
    cy.get('[data-cy="logout"]').click()
    cy.get('[data-cy="logout"]').should('not.exist')
  })

  it('admin can see songrequests page ', function () {
    cy.visit('/songrequests')
    cy.contains('Song requests')
    cy.reload()
    cy.contains('[data-cy="songrequest"]', 'Folsom Prison Blues').should('exist')
  })
  it('admin can see homepage', function () {
    cy.visit('')
    cy.contains('Hilland Mondays - American Heritage')
  })

  it('admin can see newspage', function () {
    cy.visit('/news')
    cy.contains('News')
  })

  it('admin can see videos page', function () {
    cy.visit('/videos')
    cy.contains('Hilland Playboys Videos: Live at Finnvox Studios (2018) :')
  })

  it('admin can see Trucker caps page', function () {
    cy.visit('/truckercaps')
    cy.contains('Legendary Hilland Trucker Caps:')
  })

  it('admin can see songrequests page ', function () {
    cy.visit('/songrequests')
    cy.contains('Song requests')
  })

  it('admin can see relases  page ', function () {
    cy.visit('/releases')
    cy.contains('Hilland Records Releases')
  })

  it('admin can delete a song request', () => {

    cy.visit('/songrequests')
    cy.contains('Folsom Prison Blues')
    cy.get('ul').children().should('have.length', 1)
    cy.contains('Folsom Prison Blues')
    cy.get('ul li:first-child [data-cy=delete-button]').click()
    cy.contains('Removed successfully')
    cy.get('ul').children().should('not.exist')
  })


  it('admin can see users page ', function () {
    cy.visit('/users')
    cy.contains('Users')
  })

  it('admin can add users', function () {
    cy.visit('/users')
    cy.contains('Users')
    cy.contains('user@user.com')
    cy.contains('Add User').click()
    cy.contains('Username').type('user@user2.com')
    cy.contains('Name').type('someuser')
    cy.contains('Password').type(`${userUser().password}`)
    cy.contains('Confirm Password').type(`${userUser().password}`)
    cy.contains('Register').click()
    cy.contains('Thank you!!')
    cy.contains('user@user2.com')
  })


  it('admin can delete user', () => {
    cy.visit('/users')
    cy.contains('Users')
    cy.get('ul').children().should('have.length', 2)
    cy.contains('admin@admin.com')
    cy.get('ul li:last-child [data-cy=delete-button]').click()
    cy.get('ul').children().should('have.length', 1)
    cy.contains('Removed successfully').should('exist')
  })

  it('admin can add news', function () {
    cy.visit('/news')
    cy.contains('News')
    cy.contains('Add News').click()
    cy.get('[data-cy="title"]').type('Great news')
    cy.get('[data-cy="content"]').type('This is great news')
    cy.get('[data-cy="url"]').type('https://www.google.com')
    cy.get('[data-cy="imageFile"]').attachFile('sample-image.jpg')
    cy.get('[data-cy="create-button"]').click()
    cy.contains('Great news')
  })

  it('admin add news failing if title missing', function () {
    cy.visit('/news')
    cy.contains('News')
    cy.contains('Add News').click()
    cy.get('[data-cy="content"]').type('This is great news')
    cy.get('[data-cy="url"]').type('https://www.google.com')
    cy.get('[data-cy="imageFile"]').attachFile('sample-image.jpg')
    cy.get('[data-cy="create-button"]').click()
    cy.contains('content or title missing')
    cy.contains('Great news').should('not.exist')
  })

  it('admin add news failing if content missing', function () {
    cy.visit('/news')
    cy.contains('News')
    cy.contains('Add News').click()
    cy.get('[data-cy="title"]').type('No content here')
    cy.get('[data-cy="url"]').type('https://www.google.com')
    cy.get('[data-cy="imageFile"]').attachFile('sample-image.jpg')
    cy.get('[data-cy="create-button"]').click()
    cy.contains('content or title missing')
    cy.contains('No content here').should('not.exist')
  })

  it('admin add news failing if image missing', function () {
    cy.visit('/news')
    cy.contains('News')
    cy.contains('Add News').click()
    cy.get('[data-cy="title"]').type('No image in this news')
    cy.get('[data-cy="content"]').type('This is great news without image')
    cy.get('[data-cy="url"]').type('https://www.google.com')
    cy.get('[data-cy="create-button"]').click()
    cy.contains('image missing')
    cy.contains('No image in this news').should('not.exist')
  })

  it('admin can delete news', () => {
    cy.visit('/news')
    cy.contains('News')
    cy.contains('Great News')
    cy.get('ul li:last-child [data-cy=delete-button]').click()
    cy.contains('Removed Great News from News').should('exist')
    cy.get('ul').children().should('have.length', 0)
  })

  it('admin can update news', () => {
    cy.visit('/news')
    cy.contains('News')
    cy.contains('Great News')
    cy.contains('Update News').click()
    cy.get('[data-cy="title"]').type(' again')
    cy.get('[data-cy="content"]').type(' again')
    cy.get('[data-cy="update-button"]').click()
    cy.contains('Updated Great News again')
    cy.contains('Great News again').should('exist')
  })

  it('admin can add release', function () {
    cy.visit('/releases')
    cy.contains('Hilland Records Releases')
    cy.contains('Add New Release').click()
    cy.get('[data-cy="title"]').type('Great New Release')
    cy.get('[data-cy="content"]').type('This is a great release')
    cy.get('[data-cy="buylink"]').type('www.google.com')
    cy.get('[data-cy="listenlink"]').type('www.google.com')
    cy.get('[data-cy="year"]').type('2022')
    cy.get('[data-cy="imageFile"]').attachFile('sample-image.jpg')
    cy.get('[data-cy="create-button"]').click()
    cy.contains('Great New Release')
  })

  it('admin add release failing if title missing', function () {
    cy.visit('/releases')
    cy.contains('Hilland Records Releases')
    cy.contains('Add New Release').click()
    cy.get('[data-cy="content"]').type('This is a great release')
    cy.get('[data-cy="buylink"]').type('www.google.com')
    cy.get('[data-cy="listenlink"]').type('www.google.com')
    cy.get('[data-cy="year"]').type('2022')
    cy.get('[data-cy="imageFile"]').attachFile('sample-image.jpg')
    cy.get('[data-cy="create-button"]').click()
    cy.contains('year or title missing')
    cy.contains('This is a great new archive item').should('not.exist')
  })

  it('admin add release failing if year missing', function () {
    cy.visit('/releases')
    cy.contains('Hilland Records Releases')
    cy.contains('Add New Release').click()
    cy.get('[data-cy="title"]').type('Great New Release')
    cy.get('[data-cy="content"]').type('This is a great release')
    cy.get('[data-cy="buylink"]').type('www.google.com')
    cy.get('[data-cy="listenlink"]').type('www.google.com')
    cy.get('[data-cy="imageFile"]').attachFile('sample-image.jpg')
    cy.get('[data-cy="create-button"]').click()
    cy.contains('year or title missing')
    cy.contains('This is a great new archive item').should('not.exist')
  })
  it('admin add release failing if year out of range', function () {
    cy.visit('/releases')
    cy.contains('Hilland Records Releases')
    cy.contains('Add New Release').click()
    cy.get('[data-cy="title"]').type('Great New Release')
    cy.get('[data-cy="content"]').type('This is a great release')
    cy.get('[data-cy="year"]').type('2000')
    cy.get('[data-cy="buylink"]').type('www.google.com')
    cy.get('[data-cy="listenlink"]').type('www.google.com')
    cy.get('[data-cy="imageFile"]').attachFile('sample-image.jpg')
    cy.get('[data-cy="create-button"]').click()
    cy.contains('year must be a number between 2005 and present year')
    cy.contains('This is a great new archive item').should('not.exist')
  })

  it('admin add release failing if image missing', function () {
    cy.visit('/releases')
    cy.contains('Hilland Records Releases')
    cy.contains('Add New Release').click()
    cy.get('[data-cy="title"]').type('Great New Release')
    cy.get('[data-cy="content"]').type('This is a great release')
    cy.get('[data-cy="year"]').type('2006')
    cy.get('[data-cy="buylink"]').type('www.google.com')
    cy.get('[data-cy="listenlink"]').type('www.google.com')
    cy.get('[data-cy="create-button"]').click()
    cy.contains('image missing')
    cy.contains('This is a great new archive item').should('not.exist')
  })

  it('admin can delete release', () => {
    cy.visit('/releases')
    cy.contains('Hilland Records Releases')
    cy.contains('Release #1')
    cy.get('ul li:last-child [data-cy=delete-button]').click()
    cy.contains('Removed Release #1 from releases').should('exist')
  })

  it('admin can update a release', () => {
    cy.visit('/releases')
    cy.contains('Hilland Records Releases')
    cy.contains('Update Release').click()
    cy.get('[data-cy="title"]').type(' again')
    cy.get('[data-cy="content"]').type(' again')
    cy.get('[data-cy="update-button"]').click()
    cy.contains('Updated Release #1 again')
    cy.contains('Release #1 again').should('exist')
  })


  it('admin can add archive item', function () {
    cy.visit('/archives')
    cy.contains('Hilland Mondays Archive')
    cy.contains('Add New One To Archives').click()
    cy.get('[data-cy="title"]').type('Great New Archive Item')
    cy.get('[data-cy="content"]').type('This is a great archive item')
    cy.get('[data-cy="year"]').type('2022')
    cy.get('[data-cy="imageFile"]').attachFile('sample-image.jpg')
    cy.get('[data-cy="create-button"]').click()
    cy.contains('Great New Archive Item')
  })

  it('admin add archive item failing if title missing', function () {
    cy.visit('/archives')
    cy.contains('Hilland Mondays Archive')
    cy.contains('Add New One To Archives').click()
    cy.get('[data-cy="content"]').type('This is a great new archive item')
    cy.get('[data-cy="year"]').type('2022')
    cy.get('[data-cy="imageFile"]').attachFile('sample-image.jpg')
    cy.get('[data-cy="create-button"]').click()
    cy.contains('year or title missing')
    cy.contains('This is a great new archive item').should('not.exist')
  })

  it('admin add archive item failing if year missing', function () {
    cy.visit('/archives')
    cy.contains('Hilland Mondays Archive')
    cy.contains('Add New One To Archives').click()
    cy.get('[data-cy="title"]').type('Great New Archive Item')
    cy.get('[data-cy="content"]').type('This is a great new archive item')
    cy.get('[data-cy="imageFile"]').attachFile('sample-image.jpg')
    cy.get('[data-cy="create-button"]').click()
    cy.contains('year must be a number between 2014 and present year')
    cy.contains('This is a great new archive item').should('not.exist')
  })
  it('admin add archive item failing if year out of range', function () {
    cy.visit('/archives')
    cy.contains('Hilland Mondays Archive')
    cy.contains('Add New One To Archives').click()
    cy.get('[data-cy="year"]').type('2012')
    cy.get('[data-cy="title"]').type('Great New Archive Item')
    cy.get('[data-cy="content"]').type('This is a great new archive item')
    cy.get('[data-cy="imageFile"]').attachFile('sample-image.jpg')
    cy.get('[data-cy="create-button"]').click()
    cy.contains('year must be a number between 2014 and present year')
    cy.contains('This is a great new archive item').should('not.exist')
  })

  it('admin add archive item failing if image missing', function () {
    cy.visit('/archives')
    cy.contains('Hilland Mondays Archive')
    cy.contains('Add New One To Archives').click()
    cy.get('[data-cy="year"]').type('2018')
    cy.get('[data-cy="title"]').type('Great New Archive Item')
    cy.get('[data-cy="content"]').type('This is a great new archive item')
    cy.get('[data-cy="create-button"]').click()
    cy.contains('image missing')
    cy.contains('This is a great new archive item').should('not.exist')
  })

  it('admin can delete archive item', () => {
    cy.visit('/archives')
    cy.contains('Hilland Mondays Archive')
    cy.contains('Arhive item #1')
    cy.get('ul li:last-child [data-cy=delete-button]').click()
    cy.contains('Removed Arhive item #1 from Archives').should('exist')

  })

  it('admin can update archive item', () => {
    cy.visit('/archives')
    cy.contains('Hilland Mondays Archive')
    cy.contains('Update Archive Item').click()
    cy.get('[data-cy="title"]').type(' again')
    cy.get('[data-cy="content"]').type(' again')
    cy.get('[data-cy="update-button"]').click()
    cy.contains('Updated Arhive item #1')
    cy.contains('Arhive item #1 again').should('exist')
  })



})

