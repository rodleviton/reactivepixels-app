'use strict';

app.directive('followUser', function(FollowUserService, SessionService) {
    return {
        restrict: 'E',
        templateUrl: 'components/follow-user/follow-user.html',
        link: function(scope, element, attrs) {


            // Check if authUser is already following user
            if( (scope.authUser.following !== undefined) && (scope.user.username in scope.authUser.following) ) {
                scope.following = true;
            } else {
                scope.following = false;
            }

            scope.follow = function() {
                if(scope.following) {
                    FollowUserService.removeFollower(scope.authUser, scope.user);
                    scope.following = false;
                } else {
                    FollowUserService.addFollower(scope.authUser, scope.user);
                    scope.following = true;
                }
            }
        }
    };
});