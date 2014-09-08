'use strict';

app.controller('BuildController', function($scope, UserService, DataProviderService, isAuthorised, $location) {
    $scope.user = {};
    $scope.authUser = isAuthorised;

    // Gravatar
    $scope.user.avatar = DataProviderService.getUserAvatar($scope.authUser);

    // Prefill firstname
    $scope.user.firstname = DataProviderService.getUserFirstname($scope.authUser);

    // Prefill lastname
    $scope.user.lastname = DataProviderService.getUserLastname($scope.authUser);

    // Submit extended user profile details
    $scope.extendProfile = function() {

        // Merge object data
        var user = $.extend($scope.authUser, $scope.user);

        // Create extended profile info
        UserService.create(user).then(function(response) {

            // Redirect user to their profile page
            $location.path('/' + $scope.user.username);

        });
    }
});