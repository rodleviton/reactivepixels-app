angular.module('app.login', ['ui.router'])
    .config(function($stateProvider) {
        $stateProvider
            .state('login', {
                url: '/',
                templateUrl: 'sections/login/login.html',
                controller: 'LoginController',
                resolve: {
                    redirectIfAuthenticated: function($q, $state, $location, AuthService, UserService, SessionService) {
                        var deferred = $q.defer();

                        AuthService.isAuthenticated().then(function(authUser) {

                            if (authUser) {

                                // find user by id
                                UserService.findByUID(authUser.uid).then(function(user) {

                                    if (user) {

                                        // Create session
                                        SessionService.create(authUser);
                                        SessionService.extend(user);

                                        // Redirect to users profile page
                                        $location.path('/' + user.username);

                                    } else {

                                        // Redirect to complete user profile
                                        $location.path('/build');
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