'use strict';

app.directive('loginForm', function(AUTH_EVENTS, $location, AuthService, ResponseService, UserService, SessionService) {
    return {
        restrict: 'E',
        replace: true,
        templateUrl: 'components/login-form/login-form.html',
        link: function(scope) {
            scope.progress = 0;

            scope.login = function(provider) {
                scope.progress = 100;
                scope.error = '';
                scope.success = '';

                AuthService.login(provider, scope.user).then(function(authUser) {


                    UserService.findByUID(authUser.uid).then(function(user) {
                        if (user) {

                            // Create session
                            SessionService.create(authUser);
                            SessionService.extend(user);

                            // Redirect to users profile page
                            $location.path('/' + user.username);

                        } else {

                            // Redirect to complete user profile
                            $location.path('/build');
                        }
                    });

                }, function(error) {
                    scope.progress = 0;
                    scope.error = ResponseService.getErrorMessage(error);
                });
            };
        }
    };
});