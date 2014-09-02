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
        'app.profile',
        'firebase',
        'ngAnimate',
        'ngCookies',
        'ngResource',
        'ui.router',
        'ngSanitize',
        'ngTouch'
    ])
    .constant('FIREBASE_URL', 'https://reactivepixels.firebaseio.com/')
    .constant('AUTH_EVENTS', {
        loginSuccess: 'auth-login-success',
        loginFailed: 'auth-login-failed',
        logoutSuccess: 'auth-logout-success',
        sessionTimeout: 'auth-session-timeout',
        notAuthenticated: 'auth-not-authenticated',
        notAuthorised: 'You are not authorised to view this page.',
        notValidUser: 'User does not exist.'
    })
    .config(function($urlRouterProvider) {
        $urlRouterProvider.otherwise('/');
    });