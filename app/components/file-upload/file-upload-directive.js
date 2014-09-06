'use strict';

app.directive('fileUpload', function($upload, SignedRequestService, ImageUploadService) {
    return {
        restrict: 'E',
        templateUrl: 'components/file-upload/file-upload.html',
        require: '^uploadForm',
        link: function(scope, element, attrs) {

            scope.onFileSelect = function($file) {

                // make sure a file has been selected
                if($file[0]) {

                    scope.file = $file[0];

                    // Get a signed request
                    // Parent scope must provide 'Token' and 'Authenticated Users Username'
                    SignedRequestService.get(scope.file.type, scope.authUser.username, scope.token).then(function(response) {
                        uploadFile( response );
                    });

                }
            }

            /*
             * Upload the file
             */

             var uploadFile = function(s3Params) {

                // Start uploading the image
                scope.upload = $upload.upload({
                    url: 'https://' + s3Params.bucket + '.s3.amazonaws.com/',
                    method: 'POST',
                    data: {
                        'key': 'tmp/' + scope.token + '-' + scope.file.name,
                        'AWSAccessKeyId': s3Params.awsKey,
                        'acl': 'public-read',
                        'Content-Type' : scope.file.type,
                        'success_action_status': '201',
                        'Policy': s3Params.policy,
                        'Signature': s3Params.signature
                    },
                    file: scope.file
                });

                // Progress Events
                scope.upload.then(function(response) {

                    if (response.status === 201) {
                        scope.progress = parseInt(0);

                        var data = xml2json.parser(response.data);

                        var parsedData = {
                            filename: scope.file.name,
                            url: data.postresponse.location,
                            bucket: data.postresponse.bucket,
                            key: data.postresponse.key,
                            etag: data.postresponse.etag
                        };

                        // Add image to database
                        ImageUploadService.addTempImage(scope.authUser.username, scope.token, parsedData)

                    } else {
                        console.log('Upload failed');
                    }

                }, null, function(evt) {
                    scope.progress = parseInt(100.0 * evt.loaded / evt.total);
                });
            }

        }
    };
});