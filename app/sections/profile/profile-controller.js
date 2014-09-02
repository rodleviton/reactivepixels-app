'use strict';

app.controller('ProfileController', function($scope, SessionService, userExists, isAuthenticated) {

    $scope.isAuthenticated = isAuthenticated;

    $scope.user = userExists;

    // if(SessionService.user.username) {
    //     $scope.user = SessionService.user;
    // } else {
    //     $scope.user = userExists;
    // }

});