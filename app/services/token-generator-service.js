'use strict';

app.factory('TokenGeneratorService',
    function(uuid4) {
        var tokenGenerator = {};

        /*
         * Token Generator Helper
         */
        tokenGenerator.generateToken = function() {
            var token = uuid4.generate();

            return token;
        }

        return tokenGenerator;
    });