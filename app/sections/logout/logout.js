angular.module('app.logout', ['ui.router'])
    .config(function ($stateProvider) {
      $stateProvider
        .state('logout', {
            url: '/logout',
            templateUrl: 'sections/logout/logout.html',
            controller: 'LogoutController'
        });
    });