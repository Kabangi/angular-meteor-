Meteor.methods({
  addUser : function(data){
    check(data,Object);
    check(data,Match.ObjectIncluding({
      email : Match.Where(function (x) {
        check(x, String);
        let isValid = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(x);
        return isValid;
      }),
      intro : Match.Where(function (x) {
        check(x, String);
        return x.length > 30 && x.length < 60;
      })
    }));

    Accounts.createUser({
      email: data.email,
      password: data.email,
      profile: {
          intro: data.intro,
      }
    });
  }
});

Meteor.publish("users", function () {
  return Meteor.users.find({});
});


// Accounts.onCreateUser(function(options, user) { 
//   console.log(options);
//   if (options.profile)
//       user.profile = options.profile;
//   return user
// });
