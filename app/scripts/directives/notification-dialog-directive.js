app.directive('notificationDialog', function (AUTH_EVENTS) {
  return {
    restrict: 'A',
    templateUrl: '/views/partials/notification-dialog.html',

    link: function (scope, element, attrs) {

      var showDialog = function (notification) {
        $(element).modal('show');
        scope.notification = notification;
      };

      scope.closeDialog = function() {
        $(element).modal('hide');
        scope.notification = '';
      };

      scope.$on(AUTH_EVENTS.notAuthorised, function() {
        showDialog('You are not authorised to access this area.');
      });
    }
  };
})