/*global angular, FastClick, document*/

(function () {
    "use strict";

    angular
        .module("app", [
            "ui.router",
            "ui.bootstrap",
            "ui.gravatar",
            "ui-leaflet",
            "templates",
            "angularMoment",
            "utils.auth",
            "app.dashboard",
            "app.landing"
        ])
        .config(Config)
        .run(Run);

    function Config($stateProvider, $urlRouterProvider, $httpProvider, gravatarServiceProvider) {
        gravatarServiceProvider.defaults = {default: "mm", size: 100};

        $urlRouterProvider.otherwise("/");

        $httpProvider.interceptors.push("AuthInterceptor");

        $stateProvider
            .state("app", {
                abstract: true,
                templateUrl: "app.html"
            })
                .state("app.landing", {
                    abstract: true,
                    templateUrl: "landing/landing.html"
                })
                    .state("app.landing.login", {
                        url: "/",
                        templateUrl: "landing/login/login.html",
                        controller: "LoginController"
                    })
                    .state("app.landing.register", {
                        url: "/register",
                        templateUrl: "landing/register/register.html",
                        controller: "RegisterController"
                    })
                .state("app.dashboard", {
                    url: "/dashboard",
                    templateUrl: "dashboard/dashboard.html",
                    controller: "DashboardController"
                });
    }

    function Run($rootScope, $state) {
        FastClick.attach(document.body);
    }

}());
