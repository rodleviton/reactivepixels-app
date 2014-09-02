app.factory('RouteHandlerService', function($location) {

    var routeHandler = {};
    var routeParams;

    routeHandler.setRouteParams = function(event, toState, toParams, fromState, fromParams) {
        routeParams = {
            event: event,
            toState: toState,
            toParams: toParams,
            fromState: fromState,
            fromParams: fromParams
        };
    };

    routeHandler.getRouteParams = function() {
        return routeParams;
    };

    return routeHandler;
});