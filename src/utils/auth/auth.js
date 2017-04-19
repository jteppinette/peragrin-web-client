/*global angular*/

(function () {
    "use strict";

    angular
        .module("utils.auth", [])
        .factory("AuthService", AuthService)
        .factory("AuthInterceptor", AuthInterceptor);

    function AuthService($http, $state) {
        return {
            login: login,
            register: register,
            logout: logout
        };

        function login(credentials) {
            return $http.post("/login", credentials)
                .then(function(http) {
                    set(http.data.token);
                    $state.go("app.dashboard");
                });
        };

        function register(data) {
            return $http.post("/register", data)
                .then(function(http) {
                    set(http.data.token);
                    $state.go("app.dashboard");
                });
        };

        function logout() {
            sessionStorage.clear()
            $state.go("app.landing.login");
        }

        function set(token) {
            var decoded = jwt_decode(token);
            sessionStorage.token = token;
            sessionStorage.userID = decoded.id
            sessionStorage.username = decoded.username
            sessionStorage.organizationID = decoded.organizationID
        }
    }

    function AuthInterceptor() {
        return {
            request: function(config) {
                config.headers["Authorization"] = `Bearer ${sessionStorage.token}`;
                return config;
            }
        };
    }

}());
