/*global angular*/

(function () {
    "use strict";

    function Auth($http, $rootScope, $q, $modal, authService) {
        var self = this;
        self.assignAuth = function (auth) {
            return angular.extend($rootScope.auth, auth);
        };
        self.authenticate = function (credentials) {
            return $http.post("/login/", credentials)
                .then(function (data) {
                    return self.assignAuth({user: data.data, status: true});
                });
        };
        self.login = function () {
            var instance = $modal.open({
                templateUrl: "utils/auth/login.html",
                controller: "LoginController"
            });
            return instance.result
                .then(function (auth) {
                    authService.loginConfirmed(auth);
                    return auth;
                });
        };
        self.logout = function () {
            return $http.get("/logout/")
                .then(function () {
                    return self.assignAuth({user: undefined, status: false});
                });
        };
        self.getAuth = function (opts) {
            opts = opts || {required: true};
            return $http.get("/user/", {ignoreAuthModule: !opts.required})
                .then(function (data) {
                    return self.assignAuth({user: data.data, status: true});
                })
                .catch(function () {
                    var auth = self.assignAuth({status: false});
                    return opts.required ? $q.reject(auth) : $q.when(auth);
                });
        };
    }

    function LoginController($scope, $modalInstance, Auth) {
        $scope.submit = function (username, password) {
            return Auth.authenticate({username: username, password: password})
                .then($modalInstance.close)
                .catch(function (data) {
                    $scope.message = data.data.detail;
                    $scope.status = "has-error";
                });
        };
        $scope.cancel = $modalInstance.dismiss;
    }

    angular
        .module("utils.auth", ["ui.bootstrap", "http-auth-interceptor"])
        .service("Auth", Auth)
        .controller("LoginController", LoginController);

}());
