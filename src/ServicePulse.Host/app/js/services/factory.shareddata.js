﻿;
(function(window, angular, undefined) {
    "use strict";

    function factory(
        $localStorage,
        serviceControlService,
        notifyService) {

        var notifier = notifyService();
        var stats = {
            active_endpoints: 0,
            failing_endpoints: 0,
            number_of_failed_messages: 0,
            number_of_failed_checks: 0
        };
        

        serviceControlService.getHeartbeatStats().then(function (stat) {
            notifier.notify('HeartbeatsUpdated', {
                failing: stat.failing || 0,
                active: stat.active || 0
            });

            stats.failing_endpoints = stat.failing || 0;
            stats.active_endpoints = stat.active || 0;
        });

        serviceControlService.getTotalFailedMessages().then(function (response) {
            notifier.notify('MessageFailuresUpdated', response);
            stats.number_of_failed_messages = response || 0;
        });

        serviceControlService.getTotalFailingCustomChecks().then(function (response) {
            notifier.notify('CustomChecksUpdated', response || 0);
            stats.number_of_failed_checks = response || 0;
        });

        var storage = $localStorage.$default({});

        function set(data) {
            storage.data = data;
        }

        function get() {
            return storage.data;
        }

        function getstats() {
            return stats;
        }

        return {
            set: set,
            get: get,
            getstats: getstats,
            submittedForRetry: storage.submittedForRetry
        };

    }

    factory.$inject = [
        "$localStorage",
        "serviceControlService",
        "notifyService"
    ];

    angular.module("sc")
        .service("sharedDataService", factory);

}(window, window.angular));