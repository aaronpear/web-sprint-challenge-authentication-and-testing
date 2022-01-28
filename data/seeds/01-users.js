exports.seed = function(knex) {
    return knex('users').insert([
        { 
            "username": "jimmy",
            "password": "jimmy123",
        },
        { 
            "username": "brad",
            "password": "brad123",
        },
        { 
            "username": "jasmine",
            "password": "jasmine123",
        },
    ]);
  };
