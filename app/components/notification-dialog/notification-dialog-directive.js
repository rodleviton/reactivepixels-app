app.directive('notificationDialog', function (AUTH_EVENTS) {
  return {
    restrict: 'A',
    templateUrl: 'components/notification-dialog/notification-dialog.html',

    link: function (scope, element, attrs) {

      var showDialog = function (notification) {
        $(element).modal('show');
        scope.notification = notification;
      };

      scope.closeDialog = function() {
        $(element).modal('hide');
        scope.notification = '';
      };

      // Auth Event Listeners
      scope.$on(AUTH_EVENTS.notAuthorised, function() {
        showDialog(AUTH_EVENTS.notAuthorised);
      });

      scope.$on(AUTH_EVENTS.notValidUser, function() {
        showDialog(AUTH_EVENTS.notValidUser);
      });

      scope.$on(AUTH_EVENTS.notAuthenticated, function() {
        showDialog(AUTH_EVENTS.notAuthenticated);
      });

    }

  };
})