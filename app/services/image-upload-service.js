app.service('ImageUploadService', function ($q, $firebase, FIREBASE_URL) {

    imageUpload = {};

    imageUpload.addTempImage = function(username, token, data) {

        // Temp Upload Url
        var tempImageRef = new Firebase(FIREBASE_URL + '/queues/' + username + '/temp_uploads/' );

        // Add temp image for user
        tempImageRef.child(token).set({
            id: token,
            filename: data.filename,
            url: data.url
        });

    };

    imageUpload.getTempImage = function(username, token) {

        // Temp Upload Url
        var tempImageRef = new Firebase(FIREBASE_URL + '/queues/' + username + '/temp_uploads/' );

        var deferred = $q.defer();

        // Wait for signed request to be returned to user
        tempImageRef.on('child_added', function(childSnapshot) {

            // Only grab the signed request we are after
            if (childSnapshot.val().id == token) {

                deferred.resolve( childSnapshot.val() );

                // Clean up the database
                tempImageRef.child( childSnapshot.val().id ).remove();

            }

        });

        return deferred.promise;
    }

    imageUpload.processImage = function(token, username, data, coords) {

        // Image Process Request Queue
        var imageProcessRef = new Firebase(FIREBASE_URL + 'queues/image_processing');

        // Utilities
        var getFileExtension = function(filename) {
            var a = filename.split(".");
            if( a.length === 1 || ( a[0] === "" && a.length === 2 ) ) {
                return "";
            }
            return a.pop().toLowerCase();
        }

        // Add temp image for user
        imageProcessRef.child(token).set({
            id: token,
            username: username,
            filename: data.filename,
            extension: getFileExtension(data.filename),
            url: data.url,
            x: coords.x,
            y: coords.y,
            w: coords.w,
            h: coords.h
        });

    }

    imageUpload.getProcessedImage = function(username, token) {

        var deferred = $q.defer();

        // Processed Image Url
        var processedImageRef = new Firebase(FIREBASE_URL + '/images/' + username);

        // Wait for signed request to be returned to user
        processedImageRef.on('child_added', function(childSnapshot) {

            // Only grab the signed request we are after
            if (childSnapshot.val().id == token) {

                deferred.resolve( childSnapshot.val() );

            }

        });

        return deferred.promise;
    }

    return imageUpload;
})