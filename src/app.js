/*global angular, FastClick, document*/

(function () {
    "use strict";

    function Config($stateProvider, $urlRouterProvider, $httpProvider) {
        $urlRouterProvider.otherwise("/");

        $httpProvider.defaults.xsrfHeaderName = "X-CSRFToken";
        $httpProvider.defaults.xsrfCookieName = "csrftoken";

        $stateProvider
            .state("landing", {
                url: "/",
                templateUrl: "landing/landing.html",
                resolve: {
                    auth: function (Auth, $state) {
                        return Auth.getAuth({required: false})
                            .then(function (auth) {
                                if (auth.status) {
                                    $state.go("app.dashboard");
                                }
                                return auth;
                            });
                    }
                }
            })

            .state("app", {
                abstract: true,
                templateUrl: "app/app.html",
                resolve: {
                    auth: function (Auth, $state) {
                        return Auth.getAuth({required: true})
                            .catch(function () {
                                $state.go("landing");
                            });
                    }
                }

            })

            .state("app.dashboard", {
                url: "/dashboard",
                templateUrl: "app/dashboard/dashboard.html",
                controller: "DashboardController"
            });
    }

    function Run($rootScope, $state, Auth) {
        $rootScope.auth = {user: undefined, status: false};
        FastClick.attach(document.body);
        $rootScope.$on("event:auth-loginRequired", function () {
            $rootScope.auth.status = false;
            Auth.login()
                .catch(function () {
                    $state.go("landing");
                });
        });
    }

    angular
        .module("peragrin", [
            "ui.router",
            "templates",
            "utils.auth",
            "utils.navigation",
            "app.dashboard"
        ])
        .config(Config)
        .run(Run);

}());
