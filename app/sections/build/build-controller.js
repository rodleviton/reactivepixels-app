'use strict';

app.controller('BuildController', function($scope, UserService, isAuthorised, $location) {
    $scope.user = {};
    $scope.authUser = isAuthorised;

    console.log($scope.authUser);

    // Prefill profile image
    if(($scope.authUser.thirdPartyUserData !== undefined) && ($scope.authUser.thirdPartyUserData.picture !== undefined)) {

        if(($scope.authUser.thirdPartyUserData.picture.data !== undefined) && ($scope.authUser.thirdPartyUserData.picture.data.url !== undefined)) {

            // Facebook
            $scope.user.avatar = $scope.authUser.thirdPartyUserData.picture.data.url;

        } else {

            // Google
            $scope.user.avatar = $scope.authUser.thirdPartyUserData.picture;
        }
    }

    if($scope.authUser.md5_hash !== undefined) {
        // Gravatar
        $scope.user.avatar = 'http://www.gravatar.com/avatar/' + $scope.authUser.md5_hash;
    }

    // Prefill firstname (Google)
    if(($scope.authUser.thirdPartyUserData !== undefined) && ($scope.authUser.thirdPartyUserData.given_name !== undefined)) {
        $scope.user.firstname = $scope.authUser.thirdPartyUserData.given_name;
    }

    // Prefill firstname (Facebook)
    if(($scope.authUser.thirdPartyUserData !== undefined) && ($scope.authUser.thirdPartyUserData.first_name !== undefined)) {
        $scope.user.firstname = $scope.authUser.thirdPartyUserData.first_name;
    }

    // Prefill lastname (Google)
    if(($scope.authUser.thirdPartyUserData !== undefined) && ($scope.authUser.thirdPartyUserData.family_name !== undefined)) {
        $scope.user.lastname = $scope.authUser.thirdPartyUserData.family_name;
    }

    // Prefill lastname (Facebook)
    if(($scope.authUser.thirdPartyUserData !== undefined) && ($scope.authUser.thirdPartyUserData.last_name !== undefined)) {
        $scope.user.lastname = $scope.authUser.thirdPartyUserData.last_name;
    }

    $scope.build = function() {

        // Create extended profile info
        UserService.create($scope.authUser, $scope.user.username, $scope.user.firstname, $scope.user.lastname, $scope.user.avatar).then(function(response) {

            // Redirect user to their profile page
            $location.path('/' + $scope.user.username);

        });
    }
});