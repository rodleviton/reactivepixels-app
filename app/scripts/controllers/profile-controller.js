'use strict';

app.controller('ProfileController', function($scope, SessionService, user) {

    if(SessionService.user.username !== undefined) {
        if(SessionService.user.username === user.username) {
            $scope.user = SessionService.user;
            $scope.authUser = true;
        } else {
            $scope.user = user;
        }
    } else {
        $scope.user = user;
    }

});