/*
 * Upload Routes
 */
angular.module('app.upload', ['ui.router', 'angularFileUpload'])
    .config(function($stateProvider) {
        $stateProvider
            .state('upload', {
                url: '/upload',
                templateUrl: 'sections/upload/upload.html',
                controller: 'UploadController',
                resolve: {
                    authUser: function($rootScope, $q, $location, AUTH_EVENTS, AuthService, UserService) {

                        var deferred = $q.defer();

                        AuthService.isAuthenticated().then(function(authUser) {
                            if(authUser) {

                                UserService.findByUID(authUser.uid).then(function(user) {
                                    deferred.resolve(user);
                                });

                             } else {

                                // Take use to login page
                                $location.path('/');

                                // Broadcast AUTH_EVENT
                                $rootScope.$broadcast(AUTH_EVENTS.notAuthenticated);

                             }

                        });

                        return deferred.promise;

                    }
                }
            })
    });