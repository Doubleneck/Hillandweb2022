// eslint-disable-next-line no-unused-vars
//import { userUser, adminUser } from '../../../hilland_backend/test/test_helper'

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
  describe('when logged in as user', function () {
    beforeEach(function () {
      cy.login({ username: 'user@user.com', password: 'User@user1' })
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
  })
})

