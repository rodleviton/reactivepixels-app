'use strict';

app.factory('AuthService',
    function($firebaseSimpleLogin, FIREBASE_URL, SessionService, debug, $timeout) {
        var authService = {};


        var ref = new Firebase(FIREBASE_URL);
        var auth = $firebaseSimpleLogin(ref);

        // Monitor users authenticated state
        // var authRef = new Firebase(FIREBASE_URL + ".info/authenticated");
        // authRef.on("value", function(snap) {
        //     console.log(snap);
        //   if (snap.val() === true) {

        //     // User authenticated
        //     console.log('User logged out');

        //   } else {
        //     console.log('User logged out');
        //     // Destroy any existing sessions
        //     SessionService.destroy();
        //   }
        // });

        authService.register = function(user) {
            return auth.$createUser(user.email, user.password);
        };

        authService.login = function(provider, user) {
            return auth.$login(provider, user);
        };

        authService.logout = function() {
            auth.$logout();
        };

        authService.getCurrentUser = function() {
          return auth.$getCurrentUser();
        };

        authService.isAuthenticated  = function() {
            return auth.user !== null;
        };

        authService.isAuthorized = function (authorizedRoles) {
            if (!app.isArray(authorizedRoles)) {
              authorizedRoles = [authorizedRoles];
            }
            return (authService.isAuthenticated() &&
              authorizedRoles.indexOf(Session.userRole) !== -1);
        };


        return authService;
    });