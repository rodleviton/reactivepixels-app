'use strict';

app.factory('SignedRequestService', function($q, $firebase, FIREBASE_URL) {
    var ref = new Firebase(FIREBASE_URL + 'worker-queue/signed-requests');

    var SignedRequest = {}

    SignedRequest.get = function(fileType, username, token) {

        var deferred = $q.defer();

        // New signed request
        ref.child(token).set({
            fileType: fileType,
            username: username,
            token: token
        }, function(response) {

            // If Error
            deferred.resolve(response);

        });

        return deferred.promise;

    };

    return SignedRequest;
});