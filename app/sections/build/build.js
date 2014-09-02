angular.module('app.build', ['ui.router'])
    .config(function ($stateProvider) {
      $stateProvider
        .state('build', {
            url: '/build',
            templateUrl: 'sections/build/build.html',
            controller: 'BuildController',
            resolve: {
                isAuthorised: function($rootScope, $q, $state, $location, AuthService, UserService, RouteHandlerService, AUTH_EVENTS) {

                    var deferred = $q.defer();

                    AuthService.isAuthenticated().then(function(authUser) {
                        if (authUser) {

                            // find user by id
                            UserService.findByUID(authUser.uid).then(function(user) {

                                if (user) {

                                    // Extended profile already exists
                                    if (RouteHandlerService.getRouteParams() === undefined) {

                                        // Take use to login page
                                        $location.path('/');

                                    } else {
                                        deferred.reject();

                                    }

                                } else {

                                    deferred.resolve(authUser);

                                }

                            });

                        } else {

                            // Not autheticated
                            // Should not be here
                            if (RouteHandlerService.getRouteParams() === undefined) {

                                // Take use to login page
                                $location.path('/');

                            } else {

                                deferred.reject();

                            }

                            // Broadcast AUTH_EVENT
                            $rootScope.$broadcast(AUTH_EVENTS.notAuthorised);

                        }
                    });

                    return deferred.promise;

                }
            }
        });
    });