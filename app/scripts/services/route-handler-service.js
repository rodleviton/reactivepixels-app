app.factory('RouteHandlerService', function($q, AUTH_EVENTS, AuthService, UserService, SessionService) {

    var routeHandler = {};

    /*
     * Authorise logged in user against the route
     */
    routeHandler.isAuthorized = function(username) {

        var deferred = $q.defer();

        // Get authenticated user
        AuthService.getCurrentUser().then(function(auth) {
            if (auth) {
                UserService.findByUID(auth.uid).then(function(user) {

                    // Check if current logged in user matches username in url
                    if (user.username === username) {

                        // Authorised
                        deferred.resolve(true);

                    } else {

                        // Not authorised
                        deferred.resolve(false);

                    }
                });

            } else {

                // Not authorised
                deferred.resolve(false);
            }
        });

        return deferred.promise;
    };

    /*
     * Checks if user is authenticated
     * Adds authenticated user to Session if not already
     */
    routeHandler.isAuthUser = function() {
        var deferred = $q.defer();

        // Check if existing user session exists
        if (SessionService.user.authToken !== undefined) {

            deferred.resolve(SessionService.user);

        } else {

            // Check if user is already logged in
            AuthService.getCurrentUser().then(function(auth) {

                if (auth) {

                    console.log('User authenticated');

                    // User logged in
                    // Add user to SessionService
                    SessionService.create(auth.id, auth.uid, auth.firebaseAuthToken);

                    // Get username by id
                    UserService.findByUID(auth.uid).then(function(user) {

                        // Extend users session details
                        SessionService.extend(user.username, user.firstname, user.lastname, user.displayName, user.role);

                        // User not authenticated
                        deferred.resolve(user);

                    });

                } else {

                    console.log('User not authenticated');

                    // User not authenticated
                    deferred.resolve(null);
                }
            });
        }

        return deferred.promise;
    };

    var routeParams;

    routeHandler.setRouteParams = function(event, toState, toParams, fromState, fromParams) {
        routeParams = {
            event: event,
            toState: toState,
            toParams: toParams,
            fromState: fromState,
            fromParams: fromParams
        };
    };

    routeHandler.getRouteParams = function() {
        return routeParams;
    }

    return routeHandler;
});