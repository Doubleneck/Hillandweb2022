/* eslint-disable no-undef */
db.createUser({
  user: 'the_username',
  pwd: 'the_password',
  roles: [
    {
      role: 'dbOwner',
      db: 'the_test_database',
    },
  ],
})
  
  
  
db.createCollection('users')
db.createCollection('songrequests')
db.createCollection('news')
/* eslint-disable no-undef */