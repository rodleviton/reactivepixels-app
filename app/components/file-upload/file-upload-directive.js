'use strict';

app.directive('fileUpload', function($upload, SignedRequestService) {
    return {
        restrict: 'E',
        replace: true,
        templateUrl: 'components/file-upload/file-upload.html',
        link: function(scope, element, attrs) {

            scope.onFileSelect = function($file) {

                // make sure a file has been selected
                if($file[0]) {

                    // Get a signed request
                    // Parent scope must provide 'Token' and 'Authenticated Users Username'
                    SignedRequestService.get(file[0].type, scope.authUser.username, scope.token).then(function(error) {
                        if(error) {
                            console.log('An error occured while getting a signed request');
                        } else {
                            console.log('Request successful');
                        }
                    });

                }
            }

        }
    };
});