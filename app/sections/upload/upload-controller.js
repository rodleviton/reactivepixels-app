'use strict';

app.controller('UploadController', function($scope, authUser, TokenGeneratorService, ImageUploadService) {

    $scope.authUser = authUser;
    $scope.token = TokenGeneratorService.generateToken();
    $scope.image;

    ImageUploadService.getProcessedImage($scope.authUser.username, $scope.token).then(function(response) {
        console.log(response);
    });

});