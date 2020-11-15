// ==UserScript==
// @name         Bypass taobao overseas block(绕过淘宝屏蔽海外用户)
// @description  当访问禁止出口的淘宝商品时，取消自动跳转
// @icon         https://img.alicdn.com/favicon.ico
// @version      0.1.0
// @author       foomango
// @match        *item.taobao.com/*
// @match        *detail.tmall.com/*
// @grant        none
// @namespace    https://greasyfork.org/users/705411-foomango
// @run-at       document-end
// ==/UserScript==

(function() {
    'use strict';
    console.log('Loading bypass-taobao-overseas-block.js')

    /*eslint-disable */
    // hook https://g.alicdn.com/tb/item-detail/8.0.9/??index-min.js
    KISSY.add("item-detail/resource/sib", ["../config/", "log", "base", "io"], function(e, t) {
    var n = t("../config/"),
        i = t("log").getLogger("sib"),
        o = t("base"),
        a = t("io"),
        r = "timeout";
    return o.extend({
        initializer: function() {
            function e() {
                var a = n.getGlobalConfig("sibRequest");
                a ? a.data ? t.success(a.data) : t.request() : +new Date - o > i ? (t.set("status", r), t.request()) : setTimeout(e, 100)
            }
            var t = this,
                i = t.get("timeout");
            if (n.isSibRequested) {
                var o = +new Date;
                setTimeout(e, 30)
            } else t.request()
        },
        request: function() {
            var e = this,
                t = n.getSibUrl();
            if (t) {
                var i = document.referrer,
                    o = "&ref=" + encodeURIComponent(i.replace(/userid=%s/gi, ""));
                t.length + o.length < 2e3 && (t += o), new a({
                    type: "get",
                    dataType: "jsonp",
                    url: t,
                    success: function(t) {
                        t && t.data ? e.success(t.data) : e.error()
                    },
                    error: function() {
                        e.error()
                    },
                    timeout: 600
                })
            }
        },
        success: function(e) {
            var t = this;
            // remove redirect logic here
            //t.sibData = e, e.redirectUrl && (location.href = e.redirectUrl), n.setSibData(e), i.info("Request success"), t.set("success", !0), t.set("complete", !0), t.execHandlers()
            t.sibData = e, n.setSibData(e), i.info("Request success"), t.set("success", !0), t.set("complete", !0), t.execHandlers()
        },
        error: function() {
            var e = this,
                t = e.get("status");
            i.error("Request %s", t === r ? "timeout" : "failed"), e.set("error", !0), e.set("complete", !0), e.execHandlers()
        },
        execHandlers: function() {
            var t = this,
                o = t.get("success"),
                a = (t.get("error"), o ? "successHandlers" : "errorHandlers"),
                r = t.get(a),
                s = {
                    sib: t.sibData,
                    promotion: n.getPromoMap()
                };
            e.each(r, function(e) {
                try {
                    e(s)
                } catch (t) {
                    i.warn("Exec failed: %s", t.message)
                }
            }), t.set(a, [])
        }
    }, {
        ATTRS: {
            status: {},
            timeout: {
                value: 6e3
            },
            success: {
                value: !1
            },
            error: {
                value: !1
            },
            complete: {
                value: !1
            },
            successHandlers: {
                value: []
            },
            errorHandlers: {
                value: []
            }
        }
    })
})
    /*eslint-enable */
    console.log('Finish loading bypass-taobao-overseas-block.js')
})();