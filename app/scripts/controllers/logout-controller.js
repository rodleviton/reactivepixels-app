'use strict';

app.controller('LogoutController', function($scope, AuthService) {
    console.log('Logging user out');
    AuthService.logout();
});