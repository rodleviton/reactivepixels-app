'use strict';

/**
 * @ngdoc overview
 * @name authApp
 * @description
 * # authApp
 *
 * Main module of the application.
 */
angular.module('app.config', [])
    .constant('FIREBASE_URL', 'https://reactivepixels.firebaseio.com/')
    .constant('AUTH_EVENTS', {
        loginSuccess: 'auth-login-success',
        loginFailed: 'auth-login-failed',
        logoutSuccess: 'auth-logout-success',
        sessionTimeout: 'auth-session-timeout',
        notAuthenticated: 'auth-not-authenticated',
        notAuthorised: 'auth-not-authorised'
    });

var app;
app = angular
    .module('app', [
        'firebase',
        'ngAnimate',
        'ngCookies',
        'ngResource',
        'ui.router',
        'ngSanitize',
        'ngTouch',
        'app.config'
    ])

.config(function($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise('/');

    $stateProvider
        .state('login', {
            url: '/',
            templateUrl: 'views/login.html',
            controller: 'LoginController',
            resolve: {
                isAuthUser: function($q, $location, RouteHandlerService) {

                    var deferred = $q.defer();

                    /*
                     * If user is already authenticated redirect them to their profile
                     */
                    RouteHandlerService.isAuthUser().then(function(user) {

                        if ((user) && (user.authToken)) {
                            // Redirect to users profile page
                            $location.path('/' + user.username);

                        } else {
                            // Login
                            deferred.resolve();
                        }

                    });

                    return deferred.promise;
                }
            }
        })
        .state('register', {
            url: '/register',
            templateUrl: 'views/register.html',
            controller: 'RegistrationController',
            resolve: {
                isAuthUser: function($q, $location, RouteHandlerService) {

                    var deferred = $q.defer();

                    /*
                     * If user is already authenticated redirect them to their profile
                     */
                    RouteHandlerService.isAuthUser().then(function(user) {

                        if ((user) && (user.authToken)) {

                            // Redirect to users profile page
                            $location.path('/' + user.username);

                        } else {

                            // Register
                            deferred.resolve();
                        }

                    });

                    return deferred.promise;
                }
            }
        })
        .state('logout', {
            url: '/logout',
            templateUrl: 'views/logout.html',
            controller: 'LogoutController'
        })
        .state('profile', {
            url: '/:username',
            templateUrl: 'views/profile.html',
            controller: 'ProfileController',
            resolve: {
                isAuthUser: function($q, RouteHandlerService) {

                    var deferred = $q.defer();

                    RouteHandlerService.isAuthUser().then(function() {
                        deferred.resolve();
                    });

                    return deferred.promise;

                },
                user: function($q, $stateParams, UserService) {

                    var deferred = $q.defer();

                    // Get user based on current url
                    UserService.findByUsername($stateParams.username).then(function(user) {
                        if (user.username) {
                            deferred.resolve(user);
                        } else {
                            deferred.reject();
                        }
                    });

                    return deferred.promise;
                }
            }
        })
        .state('profile.portfolio', {
            url: '/portfolio',
            templateUrl: 'views/profile.portfolio.html',
            controller: 'ProfileController'
        })
        .state('profile.private', {
            url: '/private',
            templateUrl: 'views/profile.private.html',
            controller: 'PrivateController',
            resolve: {
                isAuthorized: function($rootScope, $q, $stateParams, $location, AUTH_EVENTS, RouteHandlerService) {
                    var deferred = $q.defer();

                    // Confirm user trying to access page is the authorised user
                    RouteHandlerService.isAuthorized($stateParams.username).then(function(response) {
                        if (response) {
                            deferred.resolve();
                        } else {
                            // Broadcast AUTH_EVENT
                            $rootScope.$broadcast(AUTH_EVENTS.notAuthorised);

                            // Check if previous route exists
                            if(!$.isEmptyObject(RouteHandlerService.getRouteParams().fromParams)) {
                              deferred.reject();
                            } else {

                              // Return to login if no previous route exists
                              $location.path('/');
                            }
                        }
                    });

                    return deferred.promise;
                }
            }
        });
});