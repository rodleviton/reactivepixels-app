'use strict';

app.controller('LogoutController', function(AuthService, $location, SessionService) {
    SessionService.destroy();
    AuthService.logout();
    $location.path('/');
});