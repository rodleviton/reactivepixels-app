app.controller('ApplicationController', function ($rootScope, $scope, RouteHandlerService) {

    $rootScope.$on('$stateChangeStart',
    function(event, toState, toParams, fromState, fromParams){
        RouteHandlerService.setRouteParams(event, toState, toParams, fromState, fromParams);
    })
})