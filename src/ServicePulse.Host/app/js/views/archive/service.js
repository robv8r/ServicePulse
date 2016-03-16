﻿; (function (window, angular, undefined) {
    'use strict';



    function service($http, $timeout, $q, scConfig, uri) {

        function postPromise(url, success, error) {

            var defer = $q.defer();

            success = success || 'success';
            error = error || 'error';

            $http.post(url)
                .success(function (response) {
                    defer.resolve(success + ':' + response);
                })
                .error(function (response) {
                    defer.reject(error + ':' + response);
                });

            return defer.promise;
        }

        return {

            returnArchive: function (id, success, error) {
                var url = uri.join(scConfig.service_control_url, 'recoverability', 'groups', id, 'errors', 'retry');
                return postPromise(url, success, error);
            },
            deleteArchive: function (id, success, error) {
                var url = uri.join(scConfig.service_control_url, 'recoverability', 'groups', id, 'errors', 'archive');
                return postPromise(url, success, error);
            }
        };
    }

    service.$inject = ['$http', '$timeout', '$q', 'scConfig', 'uri'];

    angular.module('sc')
        .service('archivedMessageService', service);

})(window, window.angular);