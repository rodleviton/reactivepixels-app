app.directive('login', function (AUTH_EVENTS) {
  return {
    restrict: 'A',
    template: '<div ng-if="visible">Login Dialog</div>',
    link: function (scope) {
      var showDialog = function () {
        scope.visible = true;
        console.log('showing login dialog');
      };

      scope.visible = false;
      scope.$on(AUTH_EVENTS.notAuthenticated, showDialog);
      scope.$on(AUTH_EVENTS.sessionTimeout, showDialog);
    }
  };
})