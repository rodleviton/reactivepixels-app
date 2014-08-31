'use strict';

app.controller('LoginController', function($scope, $rootScope, AUTH_EVENTS, $location, AuthService, ResponseService, UserService, SessionService) {
    $scope.progress = 0;

    $scope.login = function(provider) {
        $scope.progress = 100;
        $scope.error = '';
        $scope.success = '';

        AuthService.login(provider, $scope.user).then(function(auth) {
            SessionService.create(auth.id, auth.uid, auth.firebaseAuthToken);

            if(auth.provider === 'password') {
                UserService.findByUID(auth.uid).then(function(user) {
                    $location.path('/' + user.username);
                });
            } else {
                console.log(auth);
            }


            $rootScope.$broadcast(AUTH_EVENTS.loginSuccess);

        }, function(error) {
            $scope.progress = 0;
            $scope.error = ResponseService.getErrorMessage(error);

            $rootScope.$broadcast(AUTH_EVENTS.loginFailed);

        });
    };

});