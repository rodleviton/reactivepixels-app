'use strict';

app.controller('ProfileHomeController', function($scope, $timeout, $firebase, FIREBASE_URL) {

    $scope.following = [];
    $scope.activities = [];

    //console.log($scope.authUser);

    var usersRef = new Firebase(FIREBASE_URL).child('users');
    var imageRef = new Firebase(FIREBASE_URL).child('images');
    var activityRef = new Firebase(FIREBASE_URL).child('activity_feeds');

    /*
     * Iterate through each of the user followed users
     */
    // angular.forEach($scope.authUser.following, function(value, key) {
    //     usersRef.child(key).once('value', function(user) {
    //         var userData = user.val();

    //         imageRef.child(key).on('child_added', function(image) {
    //             var imageData = image.val();

    //             $timeout(function() {
    //                 $scope.activities.push({user: userData, image: imageData});
    //             });
    //         });
    //     });
    // });

    activityRef.child($scope.authUser.username).once('value', function(activitySnap) {

        angular.forEach(activitySnap.val(), function(value, key) {

            if(value.type === 'followed_user') {

                if(value.actor_id === $scope.authUser.username) {
                    usersRef.child(value.object_id).once('value', function(userSnap) {
                        console.log('You started following ' + userSnap.val().displayName);
                    });
                } else {
                    usersRef.child(value.actor_id).once('value', function(userSnap) {
                        console.log(userSnap.val().displayName + ' started following you');
                    });
                }

                    // extend function: https://gist.github.com/katowulf/6598238
                    // console.log( extend({}, userSnap.val(), mediaSnap.val()) );
            } else if(value.type === 'added_image') {
                imageRef.child(value.actor_id).child(value.object_id).once('value', function(imageSnap) {

                    if(value.actor_id === $scope.authUser.username) {
                        console.log('You uploaded a new image: ' + imageSnap.val().url);
                    } else {
                        usersRef.child(value.actor_id).once('value', function(userSnap) {
                            console.log(userSnap.val().displayName + ' uploaded a new image: ' + imageSnap.val().url);
                        });
                    }
                });
            }

        });
    });


});