'use strict';

app.directive('registrationForm', function($location, $timeout, AuthService, ResponseService, UserService) {
    return {
        restrict: 'E',
        replace: true,
        templateUrl: 'components/registration-form/registration-form.html',
        link: function(scope) {
            scope.register = function() {
                scope.progress = 100;

                // Register the user
                AuthService.register(scope.user).then(function(user) {
                    scope.progress = 0;

                    // Log user in
                    AuthService.login('password', scope.user).then(function(user) {

                        // Let's start building their profile
                        $location.path('/build');

                    });

                }, function(error) {
                    scope.progress = 0;
                    scope.error = ResponseService.getErrorMessage(error);
                });
            };
        }
    };
});