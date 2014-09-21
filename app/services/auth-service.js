'use strict';

app.factory('AuthService',
    function($q, $firebaseSimpleLogin, FIREBASE_URL) {
        var authService = {};


        var ref = new Firebase(FIREBASE_URL);
        var auth = $firebaseSimpleLogin(ref);

        authService.register = function(user) {
            return auth.$createUser(user.email, user.password);
        };

        authService.login = function(provider, user) {

            if(provider === 'facebook') {
                return auth.$login(provider, {
                    scope: 'email'
                });
            } else {
                return auth.$login(provider, user);
            }

        };

        authService.logout = function() {
            return auth.$logout();
        };

        authService.getCurrentUser = function() {
          return auth.$getCurrentUser();
        };

        /*
         * Checks if user is authenticated
         * Adds authenticated user to Session if not already
         */
        authService.isAuthenticated = function() {
            var deferred = $q.defer();

            // Check if user is authenticated
            auth.$getCurrentUser().then(function(authUser) {

                if (authUser) {

                    // return authenticated users information
                    deferred.resolve(authUser);

                } else {

                    // User not authenticated
                    deferred.resolve(false);
                }

            });


            return deferred.promise;
        };

        return authService;
    });