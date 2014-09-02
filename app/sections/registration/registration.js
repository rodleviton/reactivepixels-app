angular.module('app.registration', ['ui.router'])
    .config(function($stateProvider) {
        $stateProvider
            .state('register', {
                url: '/register',
                templateUrl: 'sections/registration/registration.html',
                controller: 'RegistrationController',
                resolve: {
                    redirectIfAuthenticated: function($q, $state, $location, AuthService, UserService) {
                        var deferred = $q.defer();

                        AuthService.isAuthenticated().then(function(authUser) {

                            if (authUser) {

                                // find user by id
                                UserService.findByUID(authUser.uid).then(function(user) {

                                    if (user) {

                                        // Redirect to users profile page
                                        $location.path('/' + user.username);

                                    } else {

                                        // Redirect to complete user profile
                                        $state.transitionTo("build");
                                        console.log('build');
                                    }

                                });

                            } else {

                                deferred.resolve();

                            }

                        });

                        return deferred.promise;
                    }
                }
            });
    });