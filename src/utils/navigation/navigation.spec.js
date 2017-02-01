/*global describe, beforeEach, it, module, inject, spyOn, expect*/

describe("utils.navigation", function () {
    "use strict";

    beforeEach(module("utils.navigation"));
    beforeEach(module("ui.router"));

    describe("NavigationController", function () {
        var $scope, $q, $state, Auth;

        beforeEach(inject(function ($injector) {
            $scope = $injector.get("$rootScope").$new();
            $q = $injector.get("$q");
            Auth = {};
            $state = {
                go: function () {
                    return undefined;
                }
            };
            $injector.get("$controller")("NavigationController", {
                $scope: $scope,
                $q: $q,
                $state: $state,
                Auth: Auth
            });
        }));

        describe("login", function () {

            it("Redirects to app.dashboard on successful login", function () {
                Auth.login = function () {
                    return $q.when();
                };
                spyOn($state, "go");
                $scope.login().then(function () {
                    expect($state.go).toHaveBeenCalledWith("app.dashboard");
                });
                $scope.$digest();
            });

            it("Redirects to landing on failed login", function () {
                Auth.login = function () {
                    return $q.reject();
                };
                spyOn($state, "go");
                $scope.login().then(function () {
                    expect($state.go).toHaveBeenCalledWith("landing");
                });
                $scope.$digest();
            });

        });

        describe("logout", function () {

            it("Redirects to landing on successful logout", function () {
                Auth.logout = function () {
                    return $q.when();
                };
                spyOn($state, "go");
                $scope.logout().then(function () {
                    expect($state.go).toHaveBeenCalledWith("landing");
                });
                $scope.$digest();
            });

        });

    });

});
