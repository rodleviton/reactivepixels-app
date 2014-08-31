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
  .constant('debug', true)
  .constant('FIREBASE_URL', 'https://reactivepixels.firebaseio.com/')
  .constant('AUTH_EVENTS', {
    loginSuccess: 'auth-login-success',
    loginFailed: 'auth-login-failed',
    logoutSuccess: 'auth-logout-success',
    sessionTimeout: 'auth-session-timeout',
    notAuthenticated: 'auth-not-authenticated',
    notAuthorized: 'auth-not-authorized'
  })
  .constant('USER_ROLES', {
    all: '*',
    admin: 'admin',
    registered: 'registered',
    guest: 'guest'
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

  .config(function ($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise('/');

    $stateProvider
      .state('login', {
        url: '/',
        templateUrl: 'views/login.html',
        controller: 'LoginController',
        resolve: {
          'currentUser': ['AuthService', 'UserService', 'SessionService', '$location', '$q', function(AuthService, UserService, SessionService, $location, $q) {

              var deferred = $q.defer();

              // Check if existing user session exists
              if(SessionService.user.authToken !== undefined) {

                // Use existing session details
                // Redirect to users
                console.log('Redirecting using existing session details');
                $location.path('/' + SessionService.user.username);

              } else {

                console.log('Create user session');

                // Check if user is already logged in
                AuthService.getCurrentUser().then(function(auth) {

                  if(auth === null) {

                    console.log('User not logged in');
                    // User not logged in
                    deferred.resolve();

                  } else {

                    console.log('User logged in');

                    // User logged in
                    // Add user to SessionService
                    SessionService.create(auth.id, auth.uid, auth.firebaseAuthToken);

                    // Get username by id
                    UserService.findByUID(auth.uid).then(function(user) {

                      // Extend users session details
                      SessionService.extend(user.username, user.firstname, user.lastname, user.displayName, user.role);

                      // Redirect to users
                      $location.path('/' + user.username);
                    });
                  }
                });
              }
              return deferred.promise;
          }]
        }
      })
      .state('register', {
        url: '/register',
        templateUrl: 'views/register.html',
        controller: 'RegistrationController'
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
          'authUser': ['$q', '$stateParams', 'AuthService', 'UserService', 'SessionService',
              function($q, $stateParams, AuthService, UserService, SessionService) {

                  var deferred = $q.defer();

                  // Check if existing user session exists
                  if (SessionService.user.authToken !== undefined) {
                      console.log('Session token exists');
                      deferred.resolve();

                  } else {

                      console.log('Session token does not exist');

                      // Check if user is already logged in
                      AuthService.getCurrentUser().then(function(auth) {

                          if (auth === null) {

                              console.log('User not authenticated');

                              // User not authenticated
                              deferred.resolve();

                          } else {

                              console.log('User authenticated');

                              // User logged in
                              // Add user to SessionService
                              SessionService.create(auth.id, auth.uid, auth.firebaseAuthToken);

                              // Get username by id
                              UserService.findByUID(auth.uid).then(function(user) {

                                  // Extend users session details
                                  SessionService.extend(user.username, user.firstname, user.lastname, user.displayName, user.role);

                                  // User not authenticated
                                  deferred.resolve();

                              });
                          }

                      });

                      return deferred.promise;
                  }
              }
          ],
          'user': ['$stateParams', '$timeout', 'UserService', 'AuthService', '$location', '$q', 'debug', function($stateParams, $timeout, UserService, AuthService, $location, $q, debug) {

              // TODO
              // Get authenticated user
              AuthService.getCurrentUser().then(function(val) {
                console.log(val);
              });

              //AuthService.logout();
              var deferred = $q.defer();

              UserService.findByUsername($stateParams.username).then(function(user) {
                if(user.username) {
                  deferred.resolve(user);
                } else {

                  deferred.reject();
                }
              });

              return deferred.promise;
          }]
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
          isAuthorized: function($q, $stateParams, RouteHandlerService) {
            var deferred = $q.defer();

            // Confirm user trying to access page is the authorised user
            RouteHandlerService.isAuthorized($stateParams.username).then(function(response) {

              if(response) {
                deferred.resolve();
              } else {
                deferred.reject();
              }

            });

            return deferred.promise;
          }
        }
      });
  });

  app.config(function ($httpProvider) {
    $httpProvider.interceptors.push([
      '$injector',
      function ($injector) {
        //return $injector.get('AuthInterceptor');

        return 'hello';
      }
    ]);
  })

/*
 * Checks access to page is from the authenticated user
 */
// var isAuthorized = function($rootScope, $q, $stateParams, AuthService, UserService) {
//     var deferred = $q.defer();

//     // Get authenticated user
//     AuthService.getCurrentUser().then(function(auth) {
//       if(auth === null) {
//         console.log('You must be logged in to view this page');
//         deferred.reject();
//       } else {
//         UserService.findByUID(auth.uid).then(function(user) {
//           // Check if current logged in user matches username in url
//           if(user.username !== $stateParams.username) {
//             console.log('You are not authorised to access this page');
//             // Broadcast AUTH_EVENT
//             //$rootScope.$broadcast(AUTH_EVENTS.notAuthorized);

//             deferred.reject('You are not authorised to access this page');
//           } else {
//             deferred.resolve('You are authorised to access this page');
//           }
//         });
//       }
//     });

//     return deferred.promise;
// }

// var redirectIfAuthenticated = function() {

// }
