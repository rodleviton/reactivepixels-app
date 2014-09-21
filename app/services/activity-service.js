'use strict';

app.factory('ActivityService', function($q, FIREBASE_URL) {
    var ref = new Firebase(FIREBASE_URL).child('activity_feeds');
    var activityQueueRef = new Firebase(FIREBASE_URL).child('queues').child('activity');
    var Activity = {}

    Activity.addActivity = function(actor, type, target, object) {

        var deferred = $q.defer();

        // Get a timestamp of when the activity occured
        var timestamp = new Date().getTime();

        // Create activity object
        var activity = {
            timestamp: timestamp,
            actor_id: actor,
            type: type,
            target_id: target,
            object_id: object
        }

        // Add to actors activity feed
        ref.child(actor).push(activity, function(error) {

            if(!error) {

                // return the activity object for further use
                deferred.resolve(activity);

            } else {

                deferred.reject(error);

            }

        });

        return deferred.promise;

        // Get actors followers
        // Add to actors followers timeline
        // Add to targets timeline

        //addActivityToFollowers(activity, actor.followed_by)
    }

    Activity.addActivityToFollowers = function(activity, followers) {

        if(followers !== undefined) {

            activityQueueRef.push({
                timestamp: activity.timestamp,
                actor_id: activity.actor_id,
                type: activity.type,
                target_id: activity.target_id,
                object_id: activity.object_id,
                followers: followers
            });

        }

    }


    return Activity;
});

// Geg started following peter
// ------------------------------
// Add to gregs timeline
// add to peters timeline
// Tell gregs followers
// tell peters followers

// Greg posted and image


