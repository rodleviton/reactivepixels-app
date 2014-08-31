'use strict';

app.controller('RegistrationController', function($scope, $location, $timeout, AuthService, ResponseService, UserService) {
    $scope.register = function() {
        $scope.progress = 100;

        // Register the user
        console.log($scope.user);
        AuthService.register($scope.user).then(function(user) {
            $scope.progress = 0;

            // Create extended profile info
            UserService.create(user, $scope.user.firstname, $scope.user.lastname, $scope.user.username).then(function() {

                // Log user in
                AuthService.login('password', $scope.user).then(function(user) {

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