app.service('SessionService', function () {

    this.user = {};

    this.create = function (user) {
        this.user.id = user.id;
        this.user.uid = user.uid;
        this.user.authToken = user.firebaseAuthToken;
    };

    this.extend = function(user) {
        this.user.username = user.username;
        this.user.firstname = user.firstname;
        this.user.lastname = user.lastname;
        this.user.displayName = user.displayName;
        this.user.displayName = user.email;
    };

    this.destroy = function () {

        // TODO
        // Run in loop

        for (var property in this.user) {
            if (this.user.hasOwnProperty(property)) {
                delete this.user[property];
            }
        }
    };

    return this;
})