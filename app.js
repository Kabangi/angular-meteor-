if (Meteor.isClient) {
 
  // This code only runs on the client
  angular.module('users-manager',['angular-meteor','ui.router']).config(function ($urlRouterProvider, $stateProvider, 
    $locationProvider) {
    $locationProvider.html5Mode(true);
      $stateProvider
      .state('home', {
        url: '/',
        template: '<create-user></create-user>'
      })
      .state('users', {
        url: '/user-list',
        template: '<users-list></users-list>'
      })
      .state('useradded', {
        url: '/user_added',
        template: '<user-added></user-added>'
      });

    $urlRouterProvider.otherwise("/");
  });

  angular.module('users-manager').directive('createUser',['$state',function () {
    return {
      restrict: 'E',
      templateUrl: 'home.html',
      controllerAs: 'createUserCtrl',
      controller: function ($scope,$state) {
        $scope.user = {};
        $scope.addUser = function(){
          console.log($scope.user);
          //validate input
          let valid = true;
          let introLength = $scope.user.intro.length;
          if(introLength < 30 || introLength > 60){
            valid = false;
            if(introLength <30){
              $scope.error = "Introduction should contain more than 30 characters";
            }else{
              $scope.error = "Introduction should be less than 60 characters";
            }
          }else{
            $scope.error = "";
          }
          //no need to validate email let html5 take care of that
          if(valid)
            Meteor.call('addUser', $scope.user, function(error, result){
              if (error) {
                $scope.error = error.reason;
              } else {
                $state.go('useradded');
                console.log('user added');
              }
            });
        }
      }
    }
  }]);

  angular.module('users-manager').directive('usersList', function () {
    return {
      restrict: 'E',
      templateUrl: 'users.html',
      controllerAs: 'UsersListCtrl',
      controller: function ($scope,$reactive) {
        $reactive(this).attach($scope);
        this.subscribe('users');
        
        this.helpers({
          users: function(){
            var users = Meteor.users.find({});
            return users;
          }
        });
      }
    }
  });
  angular.module('users-manager').directive('userAdded', function () {
    return {
      restrict: 'E',
      templateUrl: 'user-added.html',
      controller: function ($scope) {
      }
    }
  });

}

if (Meteor.isServer) {
  Meteor.methods({
    addUser : function(data){
      check(data,Object);
      check(data,Match.ObjectIncluding({
        email : String,
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
}