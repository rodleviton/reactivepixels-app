app.factory('RouteHandlerService', ['$rootScope', '$q', '$stateParams', 'AUTH_EVENTS', 'AuthService', 'UserService', function($rootScope, $q, $stateParams, AUTH_EVENTS, AuthService, UserService){

  var routeHandler = {};

  routeHandler.isAuthorized = function(username) {
    console.log('help');

    var deferred = $q.defer();

    // Get authenticated user
    AuthService.getCurrentUser().then(function(auth) {
      console.log(auth);
      if(auth === null) {
        console.log('You must be logged in to view this page');
        deferred.reject();
      } else {
        UserService.findByUID(auth.uid).then(function(user) {
          console.log(username);
          // Check if current logged in user matches username in url
          if(user.username !== username) {

            console.log('You are not authorised to access this page');

            // Broadcast AUTH_EVENT
            $rootScope.$broadcast(AUTH_EVENTS.notAuthorized);

            deferred.resolve(false);
          } else {
            deferred.resolve(true);
          }
        });
      }
    });

    return deferred.promise;
  };

  return routeHandler;

}]);