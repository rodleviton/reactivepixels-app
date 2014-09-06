'use strict';

/**
 * @ngdoc overview
 * @name authApp
 * @description
 * # authApp
 *
 * Main module of the application.
 */


var app;
app = angular
    .module('app', [
        'app.login',
        'app.logout',
        'app.build',
        'app.registration',
        'app.upload',
        'app.profile',
        'firebase',
        'ngAnimate',
        'ngCookies',
        'ngResource',
        'ui.router',
        'ngSanitize',
        'ngTouch',
        'uuid4'
    ])
    .run(function($rootScope, $location, $state, RouteHandlerService) {
        $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
            RouteHandlerService.setRouteParams(event, toState, toParams, fromState, fromParams);

            // Always redirect profile root to users home page
            if(toState.name === 'profile') {
                $location.path('/' + toParams.username + '/home');
            }
          });
    })
    .constant('FIREBASE_URL', 'https://reactivepixels.firebaseio.com/')
    .constant('AUTH_EVENTS', {
        loginSuccess: 'auth-login-success',
        loginFailed: 'auth-login-failed',
        logoutSuccess: 'auth-logout-success',
        sessionTimeout: 'auth-session-timeout',
        notAuthenticated: 'You are not logged in. Please login and try again.',
        notAuthorised: 'You are not authorised to view this page.',
        notValidUser: 'User does not exist.'
    })
    .config(function($urlRouterProvider, $locationProvider) {

        $urlRouterProvider.rule(function ($injector, $location) {
            var path = $location.url();

            // check to see if the path has a trailing slash
            if ('/' === path[path.length - 1]) {
                return path.replace(/\/$/, '');
            }

            if (path.indexOf('/?') > 0) {
                return path.replace('/?', '?');
            }

            return false;
        }).otherwise('/');
    });