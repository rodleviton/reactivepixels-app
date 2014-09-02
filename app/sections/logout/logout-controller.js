'use strict';

app.controller('LogoutController', function(AuthService, $location, SessionService) {

    AuthService.isAuthenticated().then(function(authUser) {

        if (authUser) {
            SessionService.destroy();
            AuthService.logout();
        }

        $location.path('/');
    });


});