'use strict';

app.factory('ResponseService',
    function() {
        var Response =  {
            getErrorMessage: function(error) {
                var message;

                if (error.code === 'INVALID_PASSWORD') {
                    message = 'The credentials supplied are invalid (password)';
                } else if (error.code === 'INVALID_USER') {
                    message = 'The credentials supplied are invalid (email)';
                } else if (error.code === 'USER_DENIED') {
                    message = 'This user is not valid. Please try again.';
                } else if(error.code === 'EMAIL_TAKEN') {
                    message = 'This email is already registered';
                } else {
                    message = 'Something went wrong ' + error.code;
                }

                return message;
            }
        };

        return Response;
    });