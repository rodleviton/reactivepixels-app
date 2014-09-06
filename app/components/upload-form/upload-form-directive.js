'use strict';

app.directive('uploadForm', function() {
    return {
        restrict: 'E',
        transclude: true,
        templateUrl: 'components/upload-form/upload-form.html',
        controller: function($scope, $element, $attrs) {

        }
    };
});