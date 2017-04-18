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
                    sessionStorage.encoded = http.data.token;
                    sessionStorage.decoded = jwt_decode(http.data.token);
                    $state.go("app.dashboard");
                });
        };

        function register(credentials) {
            return $http.post("/register", credentials)
                .then(function(http) {
                    sessionStorage.encoded = http.data.token;
                    sessionStorage.decoded = jwt_decode(http.data.token);
                    $state.go("app.dashboard");
                });
        };

        function logout() {
            sessionStorage.clear()
            $state.go("app.landing.login");
        }
    }

    function AuthInterceptor() {
        return {
            request: function(config) {
                config.headers["Authorization"] = `Bearer ${sessionStorage.encoded}`;
                return config;
            }
        };
    }

}());
