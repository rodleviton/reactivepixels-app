'use strict';

app.factory('UserService', function($q, $firebase, $timeout, $firebaseSimpleLogin, FIREBASE_URL, debug) {
    var ref = new Firebase(FIREBASE_URL + 'users');
    var currentUser;

    var User = {
        create: function(user, firstname, lastname, username) {

            var deferred = $q.defer();

            var userRef = {
              md5_hash: user.md5_hash,
              firstname: firstname,
              lastname: lastname,
              displayName: firstname + ' ' + lastname,
              role: 'registered',
              username: username
            }

            ref.child(username).setWithPriority(userRef, user.uid, function(result) {
              // Debug
              // if(debug) {
              //   console.log('- services/user-service.js');
              //   console.log('Extended profile details have been written');
              //   console.log('---------------------------------');
              // }
              // if(result === null) {
              //   deferred.resolve();
              // }
            });

            return deferred.promise;
        },

        // Returns User object by username
        findByUsername: function(username) {
          return $firebase( ref.child(username) ).$asObject().$loaded();
        },

        // Returns User object by uid
        findByUID: function(uid) {
          var deferred = $q.defer();

          ref.startAt(uid).endAt(uid).once('value', function(snapshot) {
            var user = snapshot.val();
            deferred.resolve(user[Object.keys(snapshot.val())]);

            // Debug
            // if(debug) {
            //   console.log('services/user-service.js');
            //   console.log( user[Object.keys(snapshot.val())] );
            //   console.log('---------------------------------')
            // }
          });

          return deferred.promise;
        }
    };

    return User;
});