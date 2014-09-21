'use strict';

app.controller('ProfileController', function($scope, $firebase, routeObj) {
    $scope.user = routeObj.user;
    $scope.authUser = routeObj.authUser;
    $scope.isAuthUserRoute = routeObj.isAuthUserRoute;

    var ref = new Firebase("https://reactivepixels.firebaseio.com/images/" + $scope.user.username);
    var sync = $firebase(ref);
    var syncObject = sync.$asObject();
    syncObject.$bindTo($scope, "images");

});