/*
 * Profile Routes
 */
angular.module('app.profile', ['ui.router'])
    .config(function($stateProvider) {
        $stateProvider
            .state('profile', {
                url: '/:username',
                templateUrl: 'sections/profile/profile.html',
                controller: 'ProfileController',
                resolve: {
                    isAuthenticated: function($q, AuthService) {

                        var deferred = $q.defer();

                        AuthService.isAuthenticated().then(function(authUser) {
                            deferred.resolve(authUser);
                        });

                        return deferred.promise;

                    },
                    userExists: function($rootScope, $q, $stateParams, $location, UserService, AUTH_EVENTS, RouteHandlerService) {

                        var deferred = $q.defer();

                        // Check if user exists
                        UserService.findByUsername($stateParams.username).then(function(user) {

                            if(user.email) {

                                deferred.resolve(user);

                            } else {

                                if (RouteHandlerService.getRouteParams() === undefined) {

                                    // Take use to login page
                                    $location.path('/');

                                } else {

                                    deferred.reject();

                                }

                                // Broadcast AUTH_EVENT
                                $rootScope.$broadcast(AUTH_EVENTS.notValidUser);
                            }
                        });

                        return deferred.promise;
                    }
                }
            })
            .state('profile.portfolio', {
                url: '/portfolio',
                templateUrl: 'sections/profile/profile-portfolio/profile-portfolio.html',
                controller: 'ProfileController'
            })
            .state('profile.private', {
                url: '/private',
                templateUrl: 'sections/profile/profile-private/profile-private.html',
                controller: 'PrivateController',
                resolve: {
                    isAuthUserRoute: function($rootScope, $stateParams, $q, $state, $location, UserService, isAuthenticated, AUTH_EVENTS, RouteHandlerService) {

                        var deferred = $q.defer();

                        UserService.findByUID(isAuthenticated.uid).then(function(user) {

                            if(user.username === $stateParams.username) {

                                deferred.resolve();

                            } else {

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