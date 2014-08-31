'use strict';

app.controller('RegistrationController', function($scope, $location, $timeout, AuthService, ResponseService, UserService, debug) {
    $scope.register = function() {
        $scope.progress = 100;

        // Register the user
        console.log($scope.user);
        AuthService.register($scope.user).then(function(user) {
            $scope.progress = 0;

            // Create extended profile info
            UserService.create(user, $scope.user.firstname, $scope.user.lastname, $scope.user.username).then(function() {

                // Debug
                if(debug) {
                  console.log('- controllers/registration-controller.js');
                  console.log('Created users extended details');
                  console.log('---------------------------------')
                }

                // Log user in
                AuthService.login('password', $scope.user).then(function(user) {

                    // Debug
                    if(debug) {
                      console.log('- controllers/registration-controller.js');
                      console.log('You are now logged in');
                      console.log('---------------------------------')
                    }

                    // Get username by user uid
                    UserService.findByUID(user.uid).then(function(user) {

                        // Redirect user to their profile page
                        $location.path('/' + user.username);
                    });

                });

            });

        }, function(error) {
            $scope.progress = 0;
            $scope.error = ResponseService.getErrorMessage(error);
        });
    };
});