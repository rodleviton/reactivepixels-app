'use strict';

app.factory('UserService', function($q, $firebase, $firebaseSimpleLogin, FIREBASE_URL) {
    var ref = new Firebase(FIREBASE_URL + 'users');
    var User = {}

    User.create = function(user) {

        var deferred = $q.defer();
        var email;


        if(user.provider === 'password') {

            email = user.email;

        } else {

            // Third Party Providers (Google, Facebook)
            email = user.thirdPartyUserData.email;
        }

        var userRef = {
            username: user.username,
            displayName: user.firstname + ' ' + user.lastname,
            firstname: user.firstname,
            lastname: user.lastname,
            avatar: user.avatar,
            email: email
        }

        ref.child(username).setWithPriority(userRef, user.uid, function(result) {
            if (result === null) {
                deferred.resolve();
            }
        });

        return deferred.promise;
    };

    // Returns User object by username
    User.findByUsername = function(username) {
        return $firebase(ref.child(username)).$asObject().$loaded();
    };

    // Returns User object by uid
    User.findByUID = function(uid) {
        var deferred = $q.defer();

        ref.startAt(uid).endAt(uid).once('value', function(snapshot) {
            var user = snapshot.val();

            // Extended profile has been create
            if(user) {
                deferred.resolve(user[Object.keys(snapshot.val())]);
            } else {
                // Extended profile not created
                deferred.resolve(false);
            }

        });

        return deferred.promise;
    };

    return User;
});