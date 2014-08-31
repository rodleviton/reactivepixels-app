app.service('SessionService', function () {

    this.user = {};

    this.create = function (sessionId, uid, authToken) {
        this.user.id = sessionId;
        this.user.uid = uid;
        this.user.authToken = authToken;
    };

    this.extend = function(username, firstname, lastname, displayName, role) {
        this.user.username = username;
        this.user.firstname = firstname;
        this.user.lastname = lastname;
        this.user.displayName = displayName;
        this.user.role = role; // Only ever used for unsecured routes
    };

    this.destroy = function () {
        this.user.id = null;
        this.user.uid = null;
        this.user.authToken = null;
        this.user.username = null;
        this.user.firstname = null;
        this.user.lastname = null;
        this.user.displayname = null;
        this.user.role = null;
    };

    return this;
})