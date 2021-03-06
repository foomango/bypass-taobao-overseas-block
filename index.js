// ==UserScript==
// @name         Bypass taobao overseas block(绕过淘宝屏蔽海外用户)
// @description  当访问禁止出口的淘宝商品时，取消自动跳转
// @icon         https://img.alicdn.com/favicon.ico
// @version      0.2.1
// @author       foomango
// @match        *item.taobao.com/*
// @match        *detail.tmall.com/*
// @grant        none
// @namespace    https://greasyfork.org/users/705411-foomango
// @run-at       document-start
// ==/UserScript==

(function() {
    'use strict';
    console.log('Loading bypass-taobao-overseas-block.js')
    const beforeUnloadListener = (event) => {
        event.preventDefault()

        // Only prevent page redirection fired by Taotao
        removeEventListener('beforeunload', beforeUnloadListener, {capture: true})
        /*eslint-disable */
        return event.returnValue = 'Are you sure you want to exit?'
        /*eslint-enable */
    }
    alert('点击确定（OK）按钮后，请在屏幕上快速移动并随机连续点击几次。')
    addEventListener('beforeunload', beforeUnloadListener, {capture: true});

    console.log('Finish loading bypass-taobao-overseas-block.js')
})();
