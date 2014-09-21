'use strict';

/*
 * Normalizes data user login/registration from providers
 */
app.factory('DataProviderService',
    function() {
        var dataProviderService = {};

        /*
         * Get users avatar
         */
        dataProviderService.getUserAvatar = function(authUser) {
            var avatar;

            // Prefill profile image
            if((authUser.thirdPartyUserData !== undefined) && (authUser.thirdPartyUserData.picture !== undefined)) {

                if((authUser.thirdPartyUserData.picture.data !== undefined) && (authUser.thirdPartyUserData.picture.data.url !== undefined)) {

                    // Facebook
                    avatar = authUser.thirdPartyUserData.picture.data.url;

                } else {

                    // Google
                    avatar = authUser.thirdPartyUserData.picture;
                }

            // If no third party provider try gravatar
            } else if(authUser.md5_hash !== undefined) {

                // Gravatar
                avatar = 'http://www.gravatar.com/avatar/' + authUser.md5_hash;

            }

            return avatar;
        };

        /*
         * Get users firstname
         */
        dataProviderService.getUserFirstname = function(authUser) {
            var firstname = '';

            // Prefill firstname (Google)
            if((authUser.thirdPartyUserData !== undefined) && (authUser.thirdPartyUserData.given_name !== undefined)) {
                firstname = authUser.thirdPartyUserData.given_name;
            }
            // Prefill firstname (Facebook)
            else if((authUser.thirdPartyUserData !== undefined) && (authUser.thirdPartyUserData.first_name !== undefined)) {
                firstname = authUser.thirdPartyUserData.first_name;
            }

            return firstname;
        }

        /*
         * Get users lastname
         */
        dataProviderService.getUserLastname = function(authUser) {
            var lastname = '';

            // Prefill lastname (Google)
            if((authUser.thirdPartyUserData !== undefined) && (authUser.thirdPartyUserData.family_name !== undefined)) {
                lastname = authUser.thirdPartyUserData.family_name;
            }

            // Prefill lastname (Facebook)
            else if((authUser.thirdPartyUserData !== undefined) && (authUser.thirdPartyUserData.last_name !== undefined)) {
                lastname = authUser.thirdPartyUserData.last_name;
            }

            return lastname;
        }


        return dataProviderService;
    });