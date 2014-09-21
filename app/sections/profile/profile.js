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
                    routeObj: function($rootScope, $q, $stateParams, $location, UserService, AuthService, AUTH_EVENTS, RouteHandlerService) {

                        var deferred = $q.defer();
                        var routeObj = {};

                        /*
                         *  Determines if user exists
                         */
                        UserService.findByUsername($stateParams.username).then(function(user) {
                            if(user.email) {
                                routeObj.user = user;
                            } else {

                                if ((RouteHandlerService.getRouteParams().fromState.name === undefined) || (RouteHandlerService.getRouteParams().fromState.name === '')) {

                                    // Take use to login page
                                    $location.path('/');

                                } else {

                                    deferred.reject();

                                }

                                // Broadcast AUTH_EVENT
                                $rootScope.$broadcast(AUTH_EVENTS.notValidUser);
                            }
                        })
                        /*
                         * Determines if user is authenticated
                         * returns authenticated user
                         */
                        .then(function() {
                            AuthService.isAuthenticated().then(function(authUser) {
                                if(authUser) {

                                    if((routeObj.user !== undefined) && (routeObj.user.$priority === authUser.uid)) {

                                        // Logged in users profile
                                        routeObj.isAuthUserRoute = true;


                                    } else {

                                        // Not the logged in users profile
                                        routeObj.isAuthUserRoute = false;

                                    }

                                    // Load basic user profile
                                    UserService.findByUID(authUser.uid).then(function(user) {

                                        // Extend the authUser object
                                        routeObj.authUser = $.extend(authUser, user);

                                        // return the routeObject
                                        deferred.resolve(routeObj);

                                    });

                                } else {
                                    routeObj.authUser = authUser;
                                    deferred.resolve(routeObj);
                                }

                            });
                        });

                        return deferred.promise;
                    }
                }
            })
            .state('profile.home', {
                url: '/home',
                templateUrl: 'sections/profile/profile-home/profile-home.html',
                controller: 'ProfileHomeController'
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
                    /*
                     * Determines if current route belongs to authenticated user
                     */
                    isAuthUserRoute: function($rootScope, $q, $stateParams, $location, AUTH_EVENTS, RouteHandlerService, routeObj) {

                        var deferred = $q.defer();

                        if(routeObj.authUser.username === $stateParams.username) {

                            deferred.resolve();

                        } else {

                            // If no previous route history exists redirect to login page
                            if ((RouteHandlerService.getRouteParams().fromState.name === undefined) || (RouteHandlerService.getRouteParams().fromState.name === '')) {

                                // Take use to login page
                                $location.path('/');

                            } else {

                                deferred.reject();

                            }

                            // Broadcast AUTH_EVENT
                            $rootScope.$broadcast(AUTH_EVENTS.notAuthorised);

                        }

                        return deferred.promise;

                    }
                }
            });
        });