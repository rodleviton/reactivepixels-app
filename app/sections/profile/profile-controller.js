'use strict';

app.controller('ProfileController', function($scope, $firebase, userExists, isAuthenticated) {

    $scope.isAuthenticated = isAuthenticated;
    $scope.user = userExists;

    var ref = new Firebase("https://reactivepixels.firebaseio.com/users/" + $scope.user.username + "/images/");
    var sync = $firebase(ref);

    var syncObject = sync.$asObject();
    syncObject.$bindTo($scope, "images");

});