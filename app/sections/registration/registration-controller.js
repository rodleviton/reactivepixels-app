'use strict';

app.controller('RegistrationController', function($scope, $location, $timeout, AuthService, ResponseService, UserService) {
    $scope.register = function() {
        $scope.progress = 100;

        // Register the user
        AuthService.register($scope.user).then(function(user) {
            $scope.progress = 0;

            // Log user in
            AuthService.login('password', $scope.user).then(function(user) {

                // Let's start building their profile
                $location.path('/build');

            });

            // Create extended profile info
            // UserService.create(user).then(function() {



                    // $location.path('/build');

                    // Get username by user uid
                    // UserService.findByUID(user.uid).then(function(user) {

                    //     // Redirect user to their profile page
                    //     $location.path('/' + user.username);
                    // });

                //

            // });

        }, function(error) {
            $scope.progress = 0;
            $scope.error = ResponseService.getErrorMessage(error);
        });
    };
});