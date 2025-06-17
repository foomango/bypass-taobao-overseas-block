// ==UserScript==
// @name         Bypass Okta trial has expired
// @description  Bypass Okta trial has expired in admin page
// @icon         https://ok12static.oktacdn.com/assets/img/icons/favicons/favicon-16x16.c55b69ae49b08edc7c000d12b8e5483f.png
// @version      0.1.0
// @author       foomango
// @match        https://*.okta.com/admin/*
// @grant        none
// @namespace    https://greasyfork.org/users/705411-foomango
// @run-at       document-end
// ==/UserScript==

(function() {
    'use strict';

    const sheet = document.styleSheets[10]
    sheet.insertRule('#simplemodal-overlay,#free-trial-expired-modal {display: none !important; z-index: -1 !important;}')
    sheet.insertRule('body {overflow: auto !important;}')

    // Create App doesn't work
    // https://microstrategy-fengwei2-admin.okta.com/admin/apps/add-app  var modal = new FreeTrial();
    // https://ok12static.oktacdn.com/assets/js/mvc/free-trial/main-free-trial.pack.65599e72c21e1eea5f8d5a0e69034a32.js:formatted
    // https://microstrategy-fengwei2-admin.okta.com/admin/apps/oauth2-wizard/create?applicationType=NATIVE
})();
