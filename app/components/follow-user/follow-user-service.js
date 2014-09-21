'use strict';

app.factory('FollowUserService',
    function($q, $firebase, FIREBASE_URL, ActivityService) {

        var followUserService = {};
        var ref = new Firebase(FIREBASE_URL);

        followUserService.addFollower = function(authUser, user) {
            ref.child("/users/" + authUser.username + "/following/" + user.username).setWithPriority(true, user.$priority, function() {

                // Add to users activity
                ActivityService.addActivity(authUser.username, 'followed_user', null, user.username).then(function(activity) {
                    ActivityService.addActivityToFollowers(activity, authUser.followed_by)
                });

            });

            ref.child("/users/" + user.username + "/followed_by/" + authUser.username).setWithPriority(true, authUser.uid);
        }

        followUserService.removeFollower = function(authUser, user) {
            ref.child("/users/" + authUser.username + "/following/" + user.username).remove();
            ref.child("/users/" + user.username + "/followed_by/" + authUser.username).remove();
        }

        return followUserService;

    });