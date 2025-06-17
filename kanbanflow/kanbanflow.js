// ==UserScript==
// @name         Kanbanflow Task Monitor
// @description  Monitor kanbanflow.com task status and update favicon
// @icon         https://kanbanflow.com/favicon.ico
// @version      0.0.1
// @author       foomango
// @match        https://kanbanflow.com/board/*
// @grant        none
// @namespace    https://greasyfork.org/users/705411-foomango2
// @run-at       document-end
// ==/UserScript==

(function() {
    'use strict';

    const interval = setInterval(() => {
        const stopBtns = $$('.collapsedTimer-stop')
        const takebreakBtns = $$('.timerHome-takeBreak .timerHome-timerButton')
        const totalBtns = stopBtns.length + takebreakBtns.length
        
    }, 5000)

    function notifyMe(message) {
        // Let's check if the browser supports notifications
        if (!("Notification" in window)) {
            alert("This browser does not support desktop notification");
        }

        // Let's check whether notification permissions have already been granted
        else if (Notification.permission === "granted") {
            // If it's okay let's create a notification
            var notification = new Notification(message);
        }

        // Otherwise, we need to ask the user for permission
        else if (Notification.permission !== "denied") {
            Notification.requestPermission().then(function (permission) {
                // If the user accepts, let's create a notification
                if (permission === "granted") {
                    var notification = new Notification(message);
                }
            });
        }
    }

    function playSound() {
        open('https://file-examples.com/wp-content/uploads/2017/11/file_example_MP3_700KB.mp3')
    }

    const findDate = (testBtn, dateReg) => {
        const promise = new Promise((resolve, reject) => {
            testBtn.click()
            setTimeout(() => {
                const availableDays = $('.activeday')
                if (availableDays.length && dateReg.test(availableDays.attr('day'))) {
                    setInterval(() => notifyMe(`DMV Available: ${availableDays.attr('day')}`), 3000);
                    playSound()
                    resolve()
                } else {
                    // go back to up level
                    testBtn.click()
                    reject()
                }
            }, 5000)
        })

        return promise
    }

    const dateReg = /2021\-0[7]-[01].*/
    findDate($('div[data-qa="appointment-16554636-select"]'), dateReg)
        .catch(() => findDate($('div[data-qa="appointment-16554603-select"]'), dateReg))
        .catch(() => location.reload())


})();
