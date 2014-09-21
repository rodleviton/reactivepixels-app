'use strict';

app.controller('UploadController', function($scope, authUser, TokenGeneratorService, ImageUploadService, ActivityService) {

    $scope.authUser = authUser;
    $scope.token = TokenGeneratorService.generateToken();
    $scope.image;

    /*
     * Waits for image to be processed and then adds the upload to the activity stream
     */
    ImageUploadService.getProcessedImage($scope.authUser.username, $scope.token).then(function(response) {

        // Add to users activity
        ActivityService.addActivity($scope.authUser.username, 'added_image', null, $scope.token).then(function(activity) {
            ActivityService.addActivityToFollowers(activity, $scope.authUser.followed_by)
        });

    });

});