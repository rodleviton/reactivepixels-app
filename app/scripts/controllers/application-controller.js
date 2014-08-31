app.controller('ApplicationController',
    function ($rootScope, $scope, USER_ROLES, AuthService, AUTH_EVENTS, $timeout) {

  $scope.currentUser = null;
  $scope.userRoles = USER_ROLES;
  $scope.isAuthorized = AuthService.isAuthorized;

  $scope.setCurrentUser = function (user) {
    $scope.currentUser = user;
  };
})