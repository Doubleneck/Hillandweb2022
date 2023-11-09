
const userUser = () => ({
  username: 'user@user.com',
  password: 'User@user1',
})

const adminUser = () => ({
  username: 'admin@admin.com',
  password: 'Admin@admin1',
})

describe('Anturi app', function () {
  beforeEach(function () {
    cy.visit('')
  })

  it('front page contains staff-login', function () {
    cy.contains('Staff login')
    cy.get('[data-cy="staff-login"]').click()
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
    cy.login({ username: userUser().username, password: userUser().password })
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

  it('user can see songrequests page ', function () {
    cy.visit('/songrequests')
    cy.contains('Song requests')
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
    cy.login({ username: adminUser().username, password: adminUser().password })
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

  it('admin can see users page ', function () {
    cy.visit('/users')
    cy.contains('Users')
  })

  // it.only('admin can add users', function () {
  //   cy.visit('/users')
  //   cy.contains('Users')
  //   cy.contains('Add User').click()
  //   // cy.get('Add User').click().should('have.class', 'active')
  //   cy.contains('Username').type('user@user2.com')
  //   cy.contains('Name').type('someuser')
  //   cy.contains('Password').type(`${userUser().password}`)
  //   cy.contains('Confirm Password').type(`${userUser().password}`)
  //   cy.contains('Register').click()
  //   cy.contains('Thank you!!')




})

