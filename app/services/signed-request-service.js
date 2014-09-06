'use strict';

app.factory('SignedRequestService', function($q, $firebase, FIREBASE_URL) {
    var ref = new Firebase(FIREBASE_URL + 'worker-queue/signed-requests');

    var SignedRequest = {}

    SignedRequest.get = function(fileType, username, token) {

        // Signed Request Url
        var signedRequestsRef = new Firebase("https://reactivepixels.firebaseio.com/users/" + username + '/signed-requests/' );

        var deferred = $q.defer();

        // New signed request
        ref.child(token).set({
            fileType: fileType,
            username: username,
            token: token
        });

        // Wait for signed request to be returned to user
        signedRequestsRef.on('child_added', function(childSnapshot) {

            // Only grab the signed request we are after
            if (childSnapshot.val().id == token) {

                deferred.resolve( childSnapshot.val() );

                // Clean up the database
                signedRequestsRef.child( childSnapshot.val().id ).remove();

            }

        });

        return deferred.promise;

    };

    return SignedRequest;
});