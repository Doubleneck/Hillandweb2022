
/* eslint-disable no-undef */
db.createUser({
  user: 'the_username',
  pwd: 'the_password',
  roles: [
    {
      role: 'dbOwner',
      db: 'the_database',
    },
  ],
})



db.createCollection('users')
db.createCollection('songrequests')
db.createCollection('news')
db.createCollection('archives')

/* eslint-disable no-undef */




 