'use strict';

app.controller('ProfileController', function($scope, $state, $location, $timeout, SessionService, userExists, isAuthenticated) {

    $scope.isAuthenticated = isAuthenticated;
    $scope.user = userExists;

});