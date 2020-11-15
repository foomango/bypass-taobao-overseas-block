// ==UserScript==
// @name         Bypass taobao overseas block(绕过淘宝屏蔽海外用户)
// @description  当访问禁止出口的淘宝商品时，取消自动跳转
// @icon         https://img.alicdn.com/favicon.ico
// @version      0.0.2
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
    KISSY.add("item-detail/track/index", ["node", "base", "json"], function(e, t, n, i) {
            var o = t("node"),
                a = t("base"),
                r = t("json"),
                s = o.all,
                c = s("body"),
                l = a.extend({
                    send: function(t) {
                        var n = this,
                            i = n.get("startTime"),
                            o = {
                                ua: navigator.userAgent,
                                msg: "",
                                nick: "",
                                file: "",
                                line: 0,
                                delay: +new Date - i,
                                screen: screen.width + "x" + screen.height,
                                scrolltop: document.documentElement && document.documentElement.scrollTop || document.body && document.body.scrollTop || 0,
                                url: "//item.taobao.com/track/",
                                category: "",
                                sampling: 1e3
                            };
                        if (t = e.merge(o, t),
                            7 === parseInt(Math.random() * t.sampling)) {
                            try {
                                var a = /_nk_=([^;]+)/.exec(document.cookie);
                                a && (t.nick = a[1])
                            } catch (s) {}
                            t.msg = ["[u" + t.url + "]", "[t" + t.delay + "]", "[c" + t.category + "]", "[r" + t.sampling + "]"].join("") + (e.isObject(t.msg) ? r.stringify(t.msg) : t.msg),
                                n.sendImage("//gm.mmstat.com/jstracker.2?" + ["type=9", "id=jstracker", "v=0.02", "ua=" + encodeURIComponent(t.ua), "msg=" + encodeURIComponent(t.msg), "nick=" + decodeURIComponent(t.nick), "file=" + encodeURIComponent(t.file), "line=" + t.line, "screen=" + t.screen, "scrolltop=" + t.scrolltop, "t=" + (new Date).valueOf()].join("&"))
                        }
                    },
                    sendImage: function(e) {
                        var t = "_img_" + +new Date,
                            n = window[t] = new Image;
                        n.onload = n.onerror = function() {
                                window[t] = null
                            },
                            n.src = e,
                            n = null
                    }
                }, {
                    ATTRS: {
                        startTime: {
                            value: window.g_config && window.g_config.startTime || +new Date
                        }
                    }
                }),
                d = new l;
            return c.on("track", function(e) {
                    var t = {
                        msg: e.msg,
                        category: e.category
                    };
                    e.url && (t.url = e.url),
                        e.delay && (t.delay = e.delay),
                        d.send(t)
                }),
                l
        }),
        KISSY.add("item-detail/hub/index", ["log"], function(e, t) {
            var n = t("log").getLogger("hub"),
                i = e.namespace("Hub", !0),
                o = window;
            e.mix(i, {
                mods: {},
                loadCSS: function(e, t, n) {
                    var i = window.document.createElement("link"),
                        o = t || window.document.getElementsByTagName("script")[0];
                    i.rel = "stylesheet",
                        i.href = e,
                        i.media = "async",
                        o.parentNode.insertBefore(i, o),
                        setTimeout(function() {
                            i.media = n || "all"
                        })
                },
                add: function(t) {
                    var a;
                    if (t.factory)
                        a = t.factory.call(t, o.Hub, o.KISSY, o.DT);
                    else {
                        if (!t.instance)
                            return void n.info("No factory or instance provided for mod [ %s ]", t.name);
                        a = t.instance
                    }
                    a.__modName = t.name,
                        i.mods[t.name] = a;
                    var r = this.listeners,
                        s = t.listen;
                    for (var c in s) {
                        var l = s[c];
                        if (l) {
                            var d = a[l];
                            if (e.isFunction(d))
                                if ("!" !== c.charAt(c.length - 1))
                                    c in r || (r[c] = []),
                                    r[c].push({
                                        fn: d,
                                        fnName: l,
                                        mod: a
                                    });
                                else if (c = c.substring(0, c.length - 1),
                                c in this.fired)
                                try {
                                    d()
                                } catch (u) {
                                    n.error("Event [ %s ] execute error: %s", c, u.message)
                                }
                            else {
                                var f = this;
                                e.ready(function() {
                                    if (c in f.fired)
                                        try {
                                            d()
                                        } catch (e) {
                                            n.error("Event [ %s ] execute error: %s", c, e.message)
                                        }
                                })
                            } else
                                n.info("[ %s ] is not a function", l)
                        } else
                            n.info("No method found for event [ %s ]", c)
                    }
                },
                fire: function(t, i, o) {
                    var a = this.fired;
                    t in a || (a[t] = !0),
                        n.info("Firing event [ %s ]", t);
                    var r = this.listeners[t];
                    if (!r)
                        return void n.info("No listeners for [ %s ]", t);
                    for (var s = 0, c = r.length; s < c; s++) {
                        var l = r[s],
                            d = l.fn,
                            u = l.mod;
                        d.call(u, i),
                            e.isFunction(o) && o()
                    }
                },
                listeners: {},
                fired: {}
            })
        }),
        KISSY.add("item-detail/config/index", ["log", "node", "dom", "cookie"], function(e, t) {
            function n(t) {
                var n = t.split(".");
                return e.reduce(n, function(e, t) {
                    return "undefined" == typeof e ? e : e[t]
                }, window)
            }

            function i() {
                try {
                    return g_config.sellerNick
                } catch (e) {
                    return ""
                }
            }

            function o() {
                try {
                    return g_config.sellerId
                } catch (e) {
                    return ""
                }
            }

            function a() {
                var e;
                if (n("g_config.idata.item.sellerNickGBK"))
                    e = g_config.idata.item.sellerNickGBK;
                else
                    try {
                        e = TB.Global.util.encodeGBK(i())
                    } catch (t) {
                        e = ""
                    }
                return e
            }

            function r(e, t) {
                return t ? e[t] : e
            }

            function s(t) {
                if (s.config)
                    return r(s.config, t);
                var n = Hub.config.get("sku") || {},
                    i = e.mix(n, {
                        skuId: null,
                        spanStock: de("#J_SpanStock")[0],
                        linkBuy: de("#J_LinkBuy")[0],
                        dlChoice: de("#J_DlChoice")[0],
                        iptAmount: de("#J_IptAmount")[0],
                        form: de("#J_FrmBid")[0],
                        valItemInfo: {},
                        linkAdd: de(".J_LinkAdd")[0],
                        apiAddCart: be,
                        valCartInfo: {},
                        valExpanded: !1,
                        valFastBuyUrl: be,
                        spanLimitProm: de("#J_SpanLimitProm")[0],
                        spanPromLimitCount: de("#J_SpanPromLimitCount")[0],
                        emLimitPromCountdown: de("#J_EmLimitPromCountdown")[0],
                        limit: 0,
                        apiBidCount: be,
                        isTripItem: !!Hub.config.get("trip"),
                        valLoginUrl: be,
                        valLoginIndicator: be,
                        valPostFee: {}
                    }, !1);
                return i.dlChoice ? (i.sku = !0,
                        i.elmProps = F()) : i.sku = !1,
                    i.cart = !(!i.linkAdd || !i.valCartInfo.itemId),
                    s.config = i,
                    r(i, t)
            }

            function c(e) {
                var t = g_config;
                return r(t, e)
            }

            function l(t) {
                var n = e.namespace("g_config.vdata.sys.toggle", !0);
                return r({
                    descPicRatio: n.p,
                    noThumb: n.thumb,
                    noWangpuPic: "false" === n.dcP,
                    msRefresh: n.autoRefresh
                }, t)
            }

            function d(t) {
                var n = e.namespace("g_config.vdata.viewer", !0);
                return r(n, t)
            }

            function u(t) {
                var n = e.namespace("g_config.idata.item", !0);
                return r(n, t)
            }

            function f(t) {
                var n = e.namespace("g_config.idata.shop", !0);
                return r(n, t)
            }

            function p(t) {
                var n = e.namespace("g_config.idata.seller", !0);
                return r(n, t)
            }

            function g(e) {
                var t = Hub.config.get("desc") || {};
                return r(t, e)
            }

            function m(t) {
                if (ge || ~location.href.indexOf("lucky"))
                    return !0;
                if (t) {
                    var n = e.namespace("g_config.idata.toggle", !0),
                        i = Number(n[t]);
                    if (10 === i)
                        return !0;
                    var o = unescape(pe.get("tracknick")).charCodeAt();
                    if (null !== o && null !== i)
                        return o % 10 < i
                }
            }

            function h() {
                var t = e.namespace("g_config.originalPrice.def", !0);
                return t.price
            }

            function v(e) {
                e = e || C();
                var t = N(e);
                if (!t) {
                    var n = R();
                    t = n && n[e]
                }
                return t ? t.price : h()
            }

            function b() {
                return u("title") || de(".tb-main-title", "#J_Title").attr("data-title")
            }

            function k() {
                var t = e.namespace("g_config.viewer", !0),
                    n = e.namespace("g_config.vdata.viewer", !0),
                    i = e.namespace("g_config.vdata.sys", !0),
                    o = de("#J_TokenField").val() || r(t, "tkn") || r(n, "tkn") || r(i, "tkn");
                return o || le.warn("Current token is null"),
                    o
            }

            function y() {
                return ke.deliveryId || Hub.config.get("defaultCityId")
            }

            function w() {
                return ke.lastValidator
            }

            function X() {
                return c("itemId")
            }

            function S() {
                var e = p(),
                    t = u("type");
                return "jiyoujia" === t ? t : (e.zhizaoSeller ? t = "zhizao" : e.starSeller ? t = "star" : e.globalBuyer || e.globalSeller ? t = "global" : e.agricultureSeller && (t = "agriculture"),
                    t)
            }

            function _() {
                return u("type")
            }

            function I() {
                return s("skuId")
            }

            function C() {
                return s("skuFlag")
            }

            function T() {
                return parseInt(s("iptAmount").value, 10)
            }

            function x() {
                return ve.buyer_from
            }

            function J() {
                return ve.root_refer
            }

            function P() {
                return document.referrer
            }

            function L() {
                return ve.frm
            }

            function B() {
                var e = s("form").elements;
                if (e && e.flushingPictureServiceId)
                    return e.flushingPictureServiceId.value
            }

            function D(t) {
                try {
                    return e.isEmptyObject(t) || e.isEmptyObject(t.def) && !E("notAvailable")
                } catch (n) {}
            }

            function A() {
                var e = E("promoData");
                return D(e) ? null : e
            }

            function M(e) {
                g_config.promotion.promoData = e
            }

            function E(t) {
                return e.namespace("g_config.promotion", !0)[t]
            }

            function N(e) {
                e = e || "def";
                var t = A(),
                    n = t && t[e];
                return n && n[0]
            }

            function K() {
                return g_config.amountRestriction
            }

            function j() {
                return s("skuInfo")
            }

            function F() {
                return fe.query(".J_TSaleProp", "#detail")
            }

            function R() {
                return s("valItemInfo").skuMap
            }

            function O() {
                return !!s("dlChoice")
            }

            function Y() {
                return !!s("skuSelected")
            }

            function H(t) {
                var n = e.namespace("g_config.dynStock", !0),
                    i = {},
                    o = 1,
                    a = !1;
                if (void 0 !== n.vogueStock && (n.stock = "" === n.vogueStock || "\u65e0\u8d27" === n.vogueStock ? 0 : ++o,
                        i[n.stock] = n.vogueStock,
                        a = !0),
                    n.sku)
                    for (var r in n.sku) {
                        var s = n.sku[r];
                        void 0 !== s.vogueStock && (s.stock = "" === s.vogueStock || "\u65e0\u8d27" === s.vogueStock ? 0 : ++o,
                            i[s.stock] = s.vogueStock,
                            a = !0)
                    }
                n.vogueMap = a ? i : void 0;
                var c = t ? n[t] : n;
                return c
            }

            function V() {
                return e.namespace("g_config.vdata.sys", !0).now
            }

            function $() {
                return window.Snapup_config
            }

            function U() {
                var e = $();
                return Number(e ? e.limit : NaN)
            }

            function z() {
                var t = e.trim(de(s("iptAmount")).attr("data-type"));
                return "ju" === t
            }

            function q() {
                return Number(ye)
            }

            function G(e) {
                ye = e
            }

            function W() {
                return "channel" === H("stockType")
            }

            function Z() {
                return s("wholeSibUrl")
            }

            function Q() {
                return d() && d("id") === p("id") && d("lgin")
            }

            function ee(t) {
                var n = e.namespace("g_config.activity", !0);
                return t ? n[t] : n
            }

            function te() {
                var t = e.namespace("g_config.idata.item", !0);
                return r(t, "enterprise")
            }

            function ne() {
                return g_config.recordsApi
            }

            function ie(e) {
                var t;
                switch (e) {
                    case "buy":
                        t = "2013.1.20140002.d1";
                        break;
                    case "cart":
                        t = "2013.1.20140002.d2";
                        break;
                    default:
                        t = "2013.1.1.1"
                }
                return t + "." + window.g_aplus_pv_id
            }

            function oe() {
                return de("#J_Banner")
            }

            function ae() {
                return g_config.setupService
            }

            function re(t) {
                e.mix(g_config, t, !0)
            }

            function se() {
                var e = u("dbst"),
                    t = V();
                return 0 !== e && (!t || !e || t > e)
            }

            function ce(t) {
                var n = e.unparam(location.search.replace(/\?/gi, ""));
                return n[t]
            }
            var le = t("log").getLogger("config"),
                de = t("node").all,
                ue = de("body"),
                fe = t("dom"),
                pe = t("cookie"),
                ge = !!~location.host.indexOf("daily"),
                me = !!~location.host.indexOf("itempre"),
                he = "createTouch" in document,
                ve = e.unparam(location.search.replace(/\?/gi, "")),
                be = "",
                ke = {};
            ue.on("config:set", function(e) {
                var t = e.key,
                    n = e.value;
                ke[t] = n
            });
            try {
                var ye = parseInt(s("spanStock").firstChild.nodeValue, 10)
            } catch (we) {
                var ye = 0
            }
            return {
                isTouch: he,
                isDaily: ge,
                isPre: me,
                isMS: u("tka"),
                isPM: u("auction"),
                isJU: z(),
                isSibRequested: c("sibFirst"),
                isOwner: Q(),
                isCustomShopHeader: u("customHeader"),
                isRetina: window.devicePixelRatio > 1,
                hasSku: O,
                hasSkuSelected: Y,
                hasStart: se,
                getGlobalConfig: c,
                getItemConfig: u,
                getShopConfig: f,
                getSellerConfig: p,
                getBuyerConfig: d,
                getToggleConfig: l,
                getSkuConfig: s,
                getDescConfig: g,
                getTaobaoHost: function() {
                    return ge ? "daily.taobao.net" : "taobao.com"
                },
                getCdnHost: function() {
                    return ge ? "//g-assets.daily.taobao.net" : "//g.alicdn.com"
                },
                getLucky: m,
                getSibUrl: Z,
                getItemId: X,
                getShopType: S,
                getSkuId: I,
                getSkuFlag: C,
                getSkuInfo: j,
                getSkuProps: F,
                setStock: G,
                getStock: q,
                getAmount: T,
                getToken: k,
                getPrice: v,
                getDefPrice: h,
                getTitle: b,
                getDeliveryId: y,
                getLastValidator: w,
                getSkuMap: R,
                getPromoMap: A,
                setPromoMap: M,
                getPromoInfo: E,
                getBuyerFrom: x,
                getRootRefer: J,
                getUrlRefer: P,
                getFrm: L,
                getFlushingPictureServiceId: B,
                getStockMap: H,
                getNow: V,
                getMSConfig: $,
                getMSLimit: U,
                getGBKSellerNick: a,
                getSellerNick: i,
                getSellerId: o,
                hasChannelStock: W,
                getActivityData: ee,
                getEnterprise: te,
                getRecordsApi: ne,
                getPvSpmId: ie,
                getItemType: _,
                getBannerEl: oe,
                getSetupServiceConfig: ae,
                setSibData: re,
                getBBQLimit: K,
                getQueryParam: ce
            }
        }),
        KISSY.add("item-detail/dt/index", ["event", "log", "../config/"], function(e, t) {
            var n = t("event"),
                i = n.Target,
                o = (t("log").getLogger("dt"),
                    t("../config/"));
            e.Config.timeout = 5,
                e.namespace("TB.Detail", !0),
                e.namespace("DT", !0),
                e.mix(DT, o, !0, ["getToken"]),
                e.mix(DT, {
                    Messenger: e.mix({}, i)
                })
        }),
        KISSY.add("item-detail/price/index", ["log", "node", "../config/"], function(e, t) {
            function n() {
                var e = p("#J_StrPriceModBox");
                if (e.length)
                    return e.addClass(h),
                        e.attr(m, 0),
                        e
            }

            function i() {
                var e = p("#J_PromoPrice");
                if (e.length)
                    return e
            }

            function o(e) {
                var t = y[e];
                return t && t.el
            }

            function a(e) {
                var t = y[e];
                return t && !t.lock
            }

            function r(e) {
                var t = y[e];
                t.lock = !0
            }

            function s(t, n) {
                e.isString(n) && (n = k[n]);
                var i = t.all("#J_StrPrice");
                i.length ? i.css(n) : t.all(".tb-property-cont").css(n)
            }

            function c(e, t) {
                return e.attr(m, t || 0)
            }

            function l(e) {
                var t = e.id,
                    n = e.el,
                    i = e.name,
                    o = e.price,
                    a = e.content,
                    r = e.style;
                if (!t)
                    return f.warn('Price type "id" is null');
                if (y[t])
                    return f.warn('Price type "%s" has existed', t);
                var l;
                if (n ? l = p(n) : (i && o || i && a) && (a = a || '<em class="tb-rmb">\xa5</em><em class="tb-rmb-num">' + o + "</em>",
                        l = p('<li class="tb-detail-price"><span class="tb-property-type">' + i + '</span><strong class="tb-property-cont">' + a + "</strong></li>")),
                    !l.length)
                    return f.warn('Price type "%s" el is null', t);
                l.addClass(h),
                    r && s(l, r);
                var d = Number(e.weight),
                    u = b.all(v),
                    g = u.length;
                if (d) {
                    c(l, d);
                    for (var k = 0; k < g; k++) {
                        var w = p(u[k]),
                            X = Number(w.attr(m));
                        if (d > X) {
                            w.before(l);
                            break
                        }
                        if (d === X || k + 1 === g) {
                            w.after(l);
                            break
                        }
                    }
                } else
                    c(l),
                    p(u[g - 1]).after(l);
                e.el = l,
                    y[t] = e
            }

            function d(e) {
                var t = e.id,
                    n = o(t);
                if (n && n.length) {
                    var i = e.hidden;
                    i === !0 ? n.hide() : i === !1 && n.show();
                    var c = e.name;
                    if (c) {
                        var l = n.all(".tb-property-type");
                        l.length && l.html(c)
                    }
                    var d = e.price;
                    if (d) {
                        var u = n.all(".tb-rmb-num");
                        u.length && u.html(d)
                    }
                    var f = e.content;
                    if (f) {
                        var p = n.all(".tb-property-cont");
                        p.length && p.html(f)
                    }
                    var g = e.style,
                        m = e.unlock;
                    g && (m || a(t)) && s(n, g);
                    var h = e.lock;
                    h && r(t)
                }
            }

            function u(e) {
                var t = e.link,
                    n = e.linkName || "\u89c4\u5219\u8be6\u60c5";
                if (t) {
                    var i = p('<a target="_blank" class="tb-price-rule" href="' + t + '">' + n + "</a>");
                    b.append(i)
                }
            }
            var f = t("log").getLogger("price"),
                p = t("node").all,
                g = p("body"),
                m = "data-price-wight",
                h = "J_PriceItem",
                v = "." + h,
                b = p(".tb-meta"),
                k = (t("../config/"), {
                    del: {
                        "font-size": "14px",
                        color: "#3c3c3c",
                        "font-weight": "400",
                        "text-decoration": "line-through"
                    },
                    small: {
                        "font-size": "14px",
                        color: "#3c3c3c",
                        "font-weight": "400",
                        "text-decoration": "none"
                    },
                    strong: {
                        "font-size": "24px",
                        color: "#3c3c3c",
                        "font-weight": "700",
                        "text-decoration": "none"
                    },
                    light: {
                        "font-size": "14px",
                        color: "#ff4400",
                        "font-weight": "700",
                        "text-decoration": "none"
                    },
                    bright: {
                        "font-size": "24px",
                        color: "#ff4400",
                        "font-weight": "700",
                        "text-decoration": "none"
                    }
                }),
                y = {
                    origin: {
                        type: "origin",
                        el: n()
                    },
                    promotion: {
                        type: "promotion",
                        el: i(),
                        lock: !0
                    }
                };
            g.on("price:create", function(e) {
                    l(e)
                }),
                g.on("price:update", function(e) {
                    d(e)
                }),
                g.on("price:rule", function(e) {
                    u(e)
                })
        }),
        KISSY.add("item-detail/domain/index", ["log", "../config/"], function(e, t) {
            function n() {
                try {
                    var e = document.domain.split(".");
                    document.domain = e.slice(e.length - 2).join(".")
                } catch (t) {
                    i.warn(t.message)
                }
            }
            var i = t("log").getLogger("domain"),
                o = t("../config/");
            return {
                init: function() {
                    o.getLucky("domainDegradeMod") && n()
                },
                degrade: n
            }
        }),
        KISSY.add("item-detail/base/layout", ["log", "node"], function(e, t) {
            var n = (t("log").getLogger("layout"),
                    t("node").all),
                i = n(window),
                o = n("body"),
                a = "w990",
                r = 1180;
            return {
                init: function() {
                    this.check(),
                        this.bind()
                },
                bind: function() {
                    i.on("resize", this.check)
                },
                check: function() {
                    var e = Number(o.width());
                    e < r ? o.addClass(a) : o.removeClass(a)
                }
            }
        }),
        KISSY.add("item-detail/base/miaosha", ["log", "node", "dom", "../config/"], function(e, t) {
            var n = (t("log").getLogger("base"),
                    t("node").all),
                i = n("body"),
                o = t("dom"),
                a = o.get,
                r = t("../config/");
            return {
                init: function() {
                    r.isMS || (this.showStart(),
                        this.setSecKills(),
                        n(".J_ItemStock").html(r.getStockMap("stock")))
                },
                showStart: function() {
                    r.hasStart() || i.fire("buy:button", {
                        content: "\u5373\u5c06\u5f00\u59cb",
                        disabled: !0
                    })
                },
                setSecKills: function() {
                    var e = a("#J_secKills");
                    if (e) {
                        var t = r.getGlobalConfig("vdata").sys,
                            n = r.getBuyerConfig();
                        (t.timk || n.timk) && (e.name = n.timkn || t.timkn,
                            e.value = n.timk || t.timk)
                    }
                }
            }
        }),
        KISSY.add("item-detail/gl/index", function(e) {
            var t = new Date;
            return function n(i, o) {
                function a(t) {
                    e.later(function() {
                        var n = t(),
                            i = n + e.now();
                        window[i] = new Image,
                            window[i].src = n,
                            window[i].onload = function() {
                                window[i] = void 0
                            }
                    }, 0)
                }

                function r() {
                    var a = i.split("?"),
                        r = "/" + o + "." + a[0],
                        s = [];
                    a[1] && s.push(a[1]);
                    var c = g_config.beacon;
                    e.isEmptyObject(c) || s.push(e.param(c)),
                        "4.0.0" !== i && "5.0.0" !== i && "12.408" !== i || s.push("clicktime=" + (new Date - t)),
                        "4.0.0" !== i && "5.0.0" !== i || (n.scrollShopBanner && s.push("b=1"),
                            n.scrollItemDetail && s.push("d=1")),
                        s.push("v=14"),
                        s = s.join("&");
                    var l = "H" + function(e) {
                        e = (e || "").split("#")[0].split("?")[0];
                        var t = e.length,
                            n = function(e) {
                                var t, n = e.length,
                                    i = 0;
                                for (t = 0; t < n; t++)
                                    i = 31 * i + e.charCodeAt(t);
                                return i
                            };
                        return t ? n(t + "#" + e.charCodeAt(t - 1)) : -1
                    }(r);
                    goldlog.record(r, null, s, l)
                }
                if (i) {
                    o = o || "tbdetail";
                    try {
                        r()
                    } catch (s) {}
                    Math.round(100 * Math.random()) < (g_config.m_ratio || 0) && {
                        "4.0.0": 1,
                        "5.0.0": 1,
                        "3.0.0": 1,
                        12.39: 1,
                        12.405: 1,
                        12.408: 1,
                        12.6: 1,
                        12.5: 1
                    } [i.split("?")[0]] && a(function() {
                        var t = "//poc." + (location.host.indexOf(".daily.") > 0 ? "daily.taobao.net" : "taobao.com") + "/1.gif",
                            n = {
                                key: o + "." + i,
                                t: e.now(),
                                v: 2014
                            };
                        return t + "?" + e.param(n)
                    })
                }
            }
        }),
        KISSY.add("item-detail/base/const", function(e, t) {
            var n = g_config.DyBase;
            return {
                CC: -9,
                NORMAL: 0,
                PASS: 1,
                DELETED: -1,
                INSTOCK: -2,
                DELETED_BY_XIAOER: -4,
                INSTOCK_BY_XIAOER: -3,
                INSTOCK_WHEN_PUBLISH: -5,
                close: n.purl + "/close_auction.htm?item_id=",
                edit: n.surl + "/auction/publish/edit.htm?item_num_id=",
                noitem: n.iurl + "/auction/noitem.htm",
                churl: "//chongzhi.taobao.com/goods/good_on_sale.do?",
                admUrl: "//mckinley.admin.taobao.org/mckinley/auction/commodity/listAuction.htm?auction_id=",
                bNoticUrl: "//www.taobao.com/go/act/315/xb_20100707.php?spm=2013.1.1000126.24",
                btip: "\u7b2c\u4e00\u6b21\u6dd8\u5b9d\u8d2d\u7269",
                suitUrl: n.suitUrl,
                cupr: n.murl + "/cu_pr.htm?item_num_id=",
                dcImg: '<img src="//gtms01.alicdn.com/tps/i8/T1J.8vXclxXXXXXXXX-16-16.png"/>\u88c5\u4fee\u6b64\u9875\u9762',
                report_pre: '          <div id="J_Report" class="tb-report">                  <p class="tb-report-hd">\u4e3e\u62a5</p>                  <ul class="tb-report-bd">                    <li><a id="J_isuit" href="',
                report_sufix: '" target="_blank">\u4e3e\u62a5\u6b64\u5546\u54c1</a></li>                    <li><a href="//bbs.taobao.com/catalog/thread/154504-977100.htm?spm=2013.1.1000373.2" target="_blank">\u5546\u54c1\u4e3e\u62a5\u6f14\u793a</a></li>                    <li><a href="//bbs.taobao.com/catalog/424023.htm?spm=2013.1.1000373.3" target="_blank">\u8d2d\u7269\u5b89\u5168\u9632\u9a97</a></li>                    <li><a href="//315.taobao.com?spm=2013.1.1000373.4" target="_blank">\u6d88\u8d39\u8d28\u91cf\u66dd\u5149</a></li>                  </ul>            </div>',
                prepay: '      <div id="J_PayGuide" class="tb-payguide">          <ul class="tb-tabs tb-clearfix">              <li id="J_Btips" class="tab-shopping">\u7b2c\u4e00\u6b21\u6dd8\u5b9d\u8d2d\u7269\uff1f</li>              <li class="J_Tab" data-index="0"><a href="#" hidefocus="true">\u6211\u6709\u94f6\u884c\u5361\uff0c\u5982\u4f55\u652f\u4ed8</a><i></i></li>              <li class="J_Tab" data-index="1"><a href="#" hidefocus="true">\u6ca1\u6709\u94f6\u884c\u5361\uff0c\u5982\u4f55\u652f\u4ed8</a><i></i></li>              <li class="tab-alipay J_Tab" data-index="2"><a href="#" hidefocus="true">\u652f\u4ed8\u4fdd\u969c\uff0c\u4ea4\u6613\u5b89\u5168</a><i></i></li>          </ul>          <div class="tb-panels">              <div class="panel-paymethod J_Panel" style="display: block">                  <p><img src="//gtms01.alicdn.com/tps/i4/T1nN9fXiBpXXXXXXXX-685-50.png" alt="\u7b2c\u4e00\u6b65\uff0c\u70b9\u51fb\u7acb\u523b\u8d2d\u4e70\uff1b\u7b2c\u4e8c\u6b65\uff0c\u9009\u62e9\u5feb\u5b57\u6807\u8bc6\u7684\u94f6\u884c\uff08\u65e0\u9700\u7f51\u94f6\uff09\uff1b\u7b2c\u4e09\u6b65\uff0c\u586b\u5199\u94f6\u884c\u5361\u57fa\u672c\u4fe1\u606f\uff0c\u5b8c\u6210\u4ed8\u6b3e" /></p>                  <a href="//www.taobao.com/go/chn/zhifu_newbie.php" target="_blank">\u66f4\u591a\u94f6\u884c\u5361\u652f\u4ed8\u529e\u6cd5</a>              </div>              <div class="panel-payway J_Panel" style="display: none">                  <p><img src="//gtms01.alicdn.com/tps/i1/T1oN9fXiBpXXXXXXXX-468-50.png" alt="\u652f\u4ed8\u65b9\u5f0f\uff1a\u8d27\u5230\u4ed8\u6b3e\uff1b\u7f51\u70b9\u4ed8\u6b3e\uff1b\u627e\u4ed6\u4eba\u652f\u4ed8\uff1b\u6d88\u8d39\u5361\u4ed8\u6b3e" /></p>                  <a href="//www.taobao.com/go/chn/zhifu_newbie.php" target="_blank">\u67e5\u770b\u8be6\u7ec6\u652f\u4ed8\u65b9\u5f0f\u4ecb\u7ecd</a>              </div>              <div class="panel-alipay J_Panel" style="display: none">                  <p>\u652f\u4ed8\u5b9d\u62c5\u4fdd\u4ea4\u6613\uff1a\u4f7f\u7528\u652f\u4ed8\u5b9d\u201c\u6536\u8d27\u6ee1\u610f\u540e\uff0c\u5356\u5bb6\u624d\u80fd\u62ff\u5230\u94b1\u201d\u4fdd\u969c\u60a8\u7684\u4ea4\u6613\u5b89\u5168\uff0c\u8ba9\u60a8\u8d2d\u7269\u6ca1\u6709\u540e\u987e\u4e4b\u5fe7\uff01</p>                  <p>\u652f\u4ed8\u5b9d\u63d0\u4f9b24\u5c0f\u65f6\u8d44\u91d1\u76d1\u63a7\uff0c\u98ce\u63a7\u4f53\u7cfb\u4fdd\u969c\u201c\u652f\u4ed8\u5b9d\u8d26\u6237\u201d360\u5ea6\u5b89\u5168\uff01</p>              </div>          </div>      </div>    ',
                validSts: [0, 1, -2, -5],
                bidCloseSts: [0, 1, -9],
                sValidSts: [0, 1, -2, -5, -3, -9]
            }
        }),
        KISSY.add("item-detail/base/viewer", ["../gl/", "log", "node", "dom", "./const", "../config/"], function(e, t) {
            var n, i, o, a, r, s = t("../gl/"),
                c = t("log").getLogger("base"),
                l = t("node").all,
                d = (l("body"),
                    t("dom")),
                u = t("./const"),
                f = t("../config/"),
                p = d.get,
                g = g_config.vdata,
                m = g_config.idata,
                h = g_config.DyBase,
                v = {
                    checkCC: function() {
                        if (!g_config.idata.item.xjcc) {
                            if (this.canBuyerView())
                                return !0;
                            if (this.canSellerView())
                                return !0
                        }
                        location.href.indexOf("debug") === -1 && (window.location = u.noitem + "?itemid=" + m.item.id + "&catid=" + m.item.cid)
                    },
                    setPreClose: function() {
                        if (this.isOwner() && !n.bnow && this.canBidClose() && p("#J_TEditItem")) {
                            var e = document.createElement("a");
                            e.href = u.close + n.id,
                                e.target = "_blank",
                                e.innerHTML = "\u63d0\u524d\u6210\u4ea4",
                                p("#J_TEditItem").appendChild(e)
                        }
                    },
                    setReport: function() {
                        if (!this.isOwner() && f.hasStart() && p("#J_TEditItem")) {
                            var e = u.report_pre + u.suitUrl + n.id + u.report_sufix;
                            d.html("#J_TEditItem", e)
                        }
                    },
                    showBtips: function() {
                        if (0 === r.buyerId || null !== r.bs && "0" === r.bs) {
                            p("#J_PPayGuide") && (p("#J_PPayGuide").innerHTML = u.prepay);
                            var e = u.bNoticUrl;
                            p("#J_Btips") && (p("#J_Btips").innerHTML = u.btip + '\uff1f <a target="_blank" href="' + e + '">\u8d2d\u7269\u987b\u77e5</a>')
                        }
                    },
                    setAdmin: function() {
                        if (r.admin && p("#J_TEditItem")) {
                            var e = u.admUrl + n.id;
                            d.html("#J_TEditItem", '<a href="' + e + '" target="_blank">\u5546\u54c1\u5904\u7406</a>')
                        }
                    },
                    setEdit: function() {
                        if (this.isOwner() && n.edit && p("#J_TEditItem")) {
                            var e = document.createElement("a"),
                                t = n.auto || !1,
                                i = u.edit + n.id + "&auto=" + t;
                            n.chong === !0 && (i = u.churl),
                                e.href = i,
                                e.target = "_blank",
                                e.innerHTML = "\u7f16\u8f91",
                                p("#J_TEditItem").appendChild(e),
                                d.addClass(p(".tb-report"), "tb-hidden")
                        }
                    },
                    setForm: function() {
                        var e = r.buyDomain;
                        if (e) {
                            var t = p("#J_FrmBid");
                            if (t) {
                                var n = t.getAttribute("action");
                                n && t.setAttribute("action", n.replace(/buy.daily.taobao.net|buy.taobao.com/g, e))
                            }
                        }
                    },
                    setDcEdit: function() {
                        this.isOwner() && n.edit && m.shop.xshop && p("#J_dcpg") && (d.html("#J_dcpg", '<a href="' + h.durl + "/design.htm?pageId=" + o.pid + "&siteId=" + o.sid + "&sid=" + o.instId + '&curr_tab=0" target="_blank" id="J_TBDecorateThisPage"  style="text-align: right; width: 60px;height:24px; line-height: 24px;">\u88c5\u4fee\u9875\u9762</a> <a href="//bda.sycm.taobao.com/items/therm/item_therm.htm#/pc/scanPage?itemId=' + g_config.itemId + '" target="_blank" class="thermometer" id="J_TBItemThermometer"  style="width: 72px; border-right: 1px solid #CCC; height: 24px; line-height: 24px;">\u5b9d\u8d1d\u6e29\u5ea6\u8ba1</a>'),
                            d.css("#J_dcpg", "display", "block"),
                            l("#J_TBDecorateThisPage").on("click", function() {
                                s("19.3", "sitem")
                            }),
                            l("#J_TBItemThermometer").on("click", function() {
                                s("19.4", "sitem")
                            }))
                    },
                    isOwner: function() {
                        return g.viewer && g.viewer.id === m.seller.id && g.viewer.lgin
                    },
                    canBuyerView: function() {
                        var e, t = u.validSts,
                            n = m.item.status;
                        if (m.seller.status === -9)
                            return !1;
                        for (var i = 0; i < t.length; i++)
                            if (n === t[i])
                                return !0;
                        return n === -3 ? e = 1 : n === -9 && (e = 2),
                            s("23425?type=" + e),
                            !1
                    },
                    canBidClose: function() {
                        for (var e = u.bidCloseSts, t = 0; t < e.length; t++)
                            if (m.item.status === e[t])
                                return !0;
                        return !1
                    },
                    canSellerView: function() {
                        if (!this.isOwner())
                            return !1;
                        for (var e = u.sValidSts, t = 0; t < e.length; t++)
                            if (m.item.status === e[t])
                                return !0;
                        return !1
                    },
                    getJuType: function() {
                        var e = m.item,
                            t = m.seller,
                            n = 6;
                        return e.ju && "1" === e.jmark && r.lgin && r.id === e.jbid && r.id !== t.id && (n = 4),
                            n
                    },
                    init: function() {
                        n = m.item,
                            i = m.seller,
                            o = m.shop,
                            a = g.sys,
                            r = g.viewer,
                            c.info("Init viewer info start");
                        try {
                            n.tka || (v.checkCC(),
                                    v.setReport(),
                                    v.setEdit(),
                                    v.setAdmin(),
                                    v.setDcEdit(),
                                    v.showBtips()),
                                v.setPreClose(),
                                v.setForm()
                        } catch (e) {
                            c.warn("Init viewer info failed: %s", e.message)
                        }
                        c.info("Init viewer info end")
                    }
                };
            return v
        }),
        KISSY.add("item-detail/base/disablehover", function(e) {
            function t() {
                return "createTouch" in document
            }

            function n() {
                if (t())
                    try {
                        for (var e = /:hover\x08/, n = 0; n < document.styleSheets.length; n++)
                            for (var i = document.styleSheets[n], o = i.cssRules.length - 1; o >= 0; o--) {
                                var a = i.cssRules[o];
                                a.type === CSSRule.STYLE_RULE && e.test(a.selectorText) && i.deleteRule(o)
                            }
                    } catch (r) {}
            }
            return {
                init: function() {
                    n()
                }
            }
        }),
        KISSY.add("item-detail/base/fastclick", function() {
            function e(t, i) {
                function o(e, t) {
                    return function() {
                        return e.apply(t, arguments)
                    }
                }
                var a;
                if (i = i || {},
                    this.trackingClick = !1,
                    this.trackingClickStart = 0,
                    this.targetElement = null,
                    this.touchStartX = 0,
                    this.touchStartY = 0,
                    this.lastTouchIdentifier = 0,
                    this.touchBoundary = i.touchBoundary || 10,
                    this.layer = t,
                    this.tapDelay = i.tapDelay || 200,
                    this.tapTimeout = i.tapTimeout || 700,
                    !e.notNeeded(t)) {
                    for (var r = ["onMouse", "onClick", "onTouchStart", "onTouchMove", "onTouchEnd", "onTouchCancel"], s = this, c = 0, l = r.length; c < l; c++)
                        s[r[c]] = o(s[r[c]], s);
                    n && (t.addEventListener("mouseover", this.onMouse, !0),
                            t.addEventListener("mousedown", this.onMouse, !0),
                            t.addEventListener("mouseup", this.onMouse, !0)),
                        t.addEventListener("click", this.onClick, !0),
                        t.addEventListener("touchstart", this.onTouchStart, !1),
                        t.addEventListener("touchmove", this.onTouchMove, !1),
                        t.addEventListener("touchend", this.onTouchEnd, !1),
                        t.addEventListener("touchcancel", this.onTouchCancel, !1),
                        Event.prototype.stopImmediatePropagation || (t.removeEventListener = function(e, n, i) {
                                var o = Node.prototype.removeEventListener;
                                "click" === e ? o.call(t, e, n.hijacked || n, i) : o.call(t, e, n, i)
                            },
                            t.addEventListener = function(e, n, i) {
                                var o = Node.prototype.addEventListener;
                                "click" === e ? o.call(t, e, n.hijacked || (n.hijacked = function(e) {
                                    e.propagationStopped || n(e)
                                }), i) : o.call(t, e, n, i)
                            }
                        ),
                        "function" == typeof t.onclick && (a = t.onclick,
                            t.addEventListener("click", function(e) {
                                a(e)
                            }, !1),
                            t.onclick = null)
                }
            }
            var t = navigator.userAgent.indexOf("Windows Phone") >= 0,
                n = navigator.userAgent.indexOf("Android") > 0 && !t,
                i = /iP(ad|hone|od)/.test(navigator.userAgent) && !t,
                o = i && /OS 4_\d(_\d)?/.test(navigator.userAgent),
                a = i && /OS ([6-9]|\d{2})_\d/.test(navigator.userAgent),
                r = navigator.userAgent.indexOf("BB10") > 0;
            return e.prototype.needsClick = function(e) {
                    switch (e.nodeName.toLowerCase()) {
                        case "button":
                        case "select":
                        case "textarea":
                            if (e.disabled)
                                return !0;
                            break;
                        case "input":
                            if (i && "file" === e.type || e.disabled)
                                return !0;
                            break;
                        case "label":
                        case "iframe":
                        case "video":
                            return !0
                    }
                    return /\bneedsclick\b/.test(e.className)
                },
                e.prototype.needsFocus = function(e) {
                    switch (e.nodeName.toLowerCase()) {
                        case "textarea":
                            return !0;
                        case "select":
                            return !n;
                        case "input":
                            switch (e.type) {
                                case "button":
                                case "checkbox":
                                case "file":
                                case "image":
                                case "radio":
                                case "submit":
                                    return !1
                            }
                            return !e.disabled && !e.readOnly;
                        default:
                            return /\bneedsfocus\b/.test(e.className)
                    }
                },
                e.prototype.sendClick = function(e, t) {
                    var n, i;
                    document.activeElement && document.activeElement !== e && document.activeElement.blur(),
                        i = t.changedTouches[0],
                        n = document.createEvent("MouseEvents"),
                        n.initMouseEvent(this.determineEventType(e), !0, !0, window, 1, i.screenX, i.screenY, i.clientX, i.clientY, !1, !1, !1, !1, 0, null),
                        n.forwardedTouchEvent = !0,
                        e.dispatchEvent(n)
                },
                e.prototype.determineEventType = function(e) {
                    return n && "select" === e.tagName.toLowerCase() ? "mousedown" : "click"
                },
                e.prototype.focus = function(e) {
                    var t;
                    i && e.setSelectionRange && 0 !== e.type.indexOf("date") && "time" !== e.type && "month" !== e.type ? (t = e.value.length,
                        e.setSelectionRange(t, t)) : e.focus()
                },
                e.prototype.updateScrollParent = function(e) {
                    var t, n;
                    if (t = e.fastClickScrollParent,
                        !t || !t.contains(e)) {
                        n = e;
                        do {
                            if (n.scrollHeight > n.offsetHeight) {
                                t = n,
                                    e.fastClickScrollParent = n;
                                break
                            }
                            n = n.parentElement
                        } while (n)
                    }
                    t && (t.fastClickLastScrollTop = t.scrollTop)
                },
                e.prototype.getTargetElementFromEventTarget = function(e) {
                    return e.nodeType === Node.TEXT_NODE ? e.parentNode : e
                },
                e.prototype.onTouchStart = function(e) {
                    var t, n, a;
                    if (e.targetTouches.length > 1)
                        return !0;
                    if (t = this.getTargetElementFromEventTarget(e.target),
                        n = e.targetTouches[0],
                        i) {
                        if (a = window.getSelection(),
                            a.rangeCount && !a.isCollapsed)
                            return !0;
                        if (!o) {
                            if (n.identifier && n.identifier === this.lastTouchIdentifier)
                                return e.preventDefault(),
                                    !1;
                            this.lastTouchIdentifier = n.identifier,
                                this.updateScrollParent(t)
                        }
                    }
                    return this.trackingClick = !0,
                        this.trackingClickStart = e.timeStamp,
                        this.targetElement = t,
                        this.touchStartX = n.pageX,
                        this.touchStartY = n.pageY,
                        e.timeStamp - this.lastClickTime < this.tapDelay && e.preventDefault(),
                        !0
                },
                e.prototype.touchHasMoved = function(e) {
                    var t = e.changedTouches[0],
                        n = this.touchBoundary;
                    return Math.abs(t.pageX - this.touchStartX) > n || Math.abs(t.pageY - this.touchStartY) > n
                },
                e.prototype.onTouchMove = function(e) {
                    return !this.trackingClick || ((this.targetElement !== this.getTargetElementFromEventTarget(e.target) || this.touchHasMoved(e)) && (this.trackingClick = !1,
                            this.targetElement = null),
                        !0)
                },
                e.prototype.findControl = function(e) {
                    return void 0 !== e.control ? e.control : e.htmlFor ? document.getElementById(e.htmlFor) : e.querySelector("button, input:not([type=hidden]), keygen, meter, output, progress, select, textarea")
                },
                e.prototype.onTouchEnd = function(e) {
                    var t, r, s, c, l, d = this.targetElement;
                    if (!this.trackingClick)
                        return !0;
                    if (e.timeStamp - this.lastClickTime < this.tapDelay)
                        return this.cancelNextClick = !0,
                            !0;
                    if (e.timeStamp - this.trackingClickStart > this.tapTimeout)
                        return !0;
                    if (this.cancelNextClick = !1,
                        this.lastClickTime = e.timeStamp,
                        r = this.trackingClickStart,
                        this.trackingClick = !1,
                        this.trackingClickStart = 0,
                        a && (l = e.changedTouches[0],
                            d = document.elementFromPoint(l.pageX - window.pageXOffset, l.pageY - window.pageYOffset) || d,
                            d.fastClickScrollParent = this.targetElement.fastClickScrollParent),
                        s = d.tagName.toLowerCase(),
                        "label" === s) {
                        if (t = this.findControl(d)) {
                            if (this.focus(d),
                                n)
                                return !1;
                            d = t
                        }
                    } else if (this.needsFocus(d))
                        return e.timeStamp - r > 100 || i && window.top !== window && "input" === s ? (this.targetElement = null,
                            !1) : (this.focus(d),
                            this.sendClick(d, e),
                            i && "select" === s || (this.targetElement = null,
                                e.preventDefault()),
                            !1);
                    return !(!i || o || (c = d.fastClickScrollParent,
                        !c || c.fastClickLastScrollTop === c.scrollTop)) || (this.needsClick(d) || (e.preventDefault(),
                            this.sendClick(d, e)),
                        !1)
                },
                e.prototype.onTouchCancel = function() {
                    this.trackingClick = !1,
                        this.targetElement = null
                },
                e.prototype.onMouse = function(e) {
                    return !this.targetElement || (!!e.forwardedTouchEvent || (!e.cancelable || (!(!this.needsClick(this.targetElement) || this.cancelNextClick) || (e.stopImmediatePropagation ? e.stopImmediatePropagation() : e.propagationStopped = !0,
                        e.stopPropagation(),
                        e.preventDefault(),
                        !1))))
                },
                e.prototype.onClick = function(e) {
                    var t;
                    return this.trackingClick ? (this.targetElement = null,
                        this.trackingClick = !1,
                        !0) : "submit" === e.target.type && 0 === e.detail || (t = this.onMouse(e),
                        t || (this.targetElement = null),
                        t)
                },
                e.prototype.destroy = function() {
                    var e = this.layer;
                    n && (e.removeEventListener("mouseover", this.onMouse, !0),
                            e.removeEventListener("mousedown", this.onMouse, !0),
                            e.removeEventListener("mouseup", this.onMouse, !0)),
                        e.removeEventListener("click", this.onClick, !0),
                        e.removeEventListener("touchstart", this.onTouchStart, !1),
                        e.removeEventListener("touchmove", this.onTouchMove, !1),
                        e.removeEventListener("touchend", this.onTouchEnd, !1),
                        e.removeEventListener("touchcancel", this.onTouchCancel, !1)
                },
                e.notNeeded = function(e) {
                    var t, i, o;
                    if ("undefined" == typeof window.ontouchstart)
                        return !0;
                    if (i = +(/Chrome\/([0-9]+)/.exec(navigator.userAgent) || [, 0])[1]) {
                        if (!n)
                            return !0;
                        if (t = document.querySelector("meta[name=viewport]")) {
                            if (t.content.indexOf("user-scalable=no") !== -1)
                                return !0;
                            if (i > 31 && document.documentElement.scrollWidth <= window.outerWidth)
                                return !0
                        }
                    }
                    if (r && (o = navigator.userAgent.match(/Version\/([0-9]*)\.([0-9]*)/),
                            o[1] >= 10 && o[2] >= 3 && (t = document.querySelector("meta[name=viewport]")))) {
                        if (t.content.indexOf("user-scalable=no") !== -1)
                            return !0;
                        if (document.documentElement.scrollWidth <= window.outerWidth)
                            return !0
                    }
                    return "none" === e.style.msTouchAction || "none" === e.style.touchAction
                },
                e.attach = function(t, n) {
                    return new e(t, n)
                }, {
                    init: function() {
                        "createTouch" in document && e.attach(document.body)
                    }
                }
        }),
        KISSY.add("item-detail/base/index", ["log", "node", "./layout", "./miaosha", "./viewer", "./disablehover", "./fastclick"], function(e, t) {
            var n = (t("log").getLogger("base"),
                    t("node").all),
                i = n("body"),
                o = t("./layout"),
                a = t("./miaosha"),
                r = t("./viewer"),
                s = t("./disablehover"),
                c = t("./fastclick");
            return {
                init: function() {
                    o.init(),
                        s.init(),
                        c.init(),
                        i.on("user:info:viewer", function() {
                            a.init(),
                                r.init()
                        })
                }
            }
        }),
        KISSY.add("item-detail/login/index", function(e, t) {
            return function(e) {
                var t;
                KISSY.use("tbc/mini-login/2.2.9/", function(n, i) {
                    t || (t = new i({
                            zindex: 2e8
                        })),
                        t.on("login", e),
                        t.show()
                })
            }
        }),
        KISSY.add("item-detail/querystring/index", function(e) {
            var t = {};
            return t.parse = function(t) {
                    return "string" != typeof t ? {} : (t = e.trim(t).replace(/^(\?|#)/, ""),
                        t ? e.reduce(e.trim(t).split("&"), function(t, n) {
                            var i = n.replace(/\+/g, " ").split("="),
                                o = i[0],
                                a = i[1];
                            return o = decodeURIComponent(o),
                                a = void 0 === a ? null : decodeURIComponent(a),
                                t.hasOwnProperty(o) ? e.isArray(t[o]) ? t[o].push(a) : t[o] = [t[o], a] : t[o] = a,
                                t
                        }, {}) : {})
                },
                t.stringify = function(t) {
                    return t ? e.map(e.keys(t), function(n) {
                        var i = t[n];
                        return e.isArray(i) ? e.map(i, function(e) {
                            return encodeURIComponent(n) + "=" + encodeURIComponent(e)
                        }).join("&") : encodeURIComponent(n) + "=" + encodeURIComponent(i)
                    }).join("&") : ""
                },
                t
        }),
        KISSY.add("item-detail/buy/index", ["../gl/", "log", "../login/", "node", "dom", "event", "../config/", "../querystring/"], function(e, t) {
            function n() {
                var t = {};
                return e.each(S, function(n) {
                        var i = {};
                        if (e.isFunction(n))
                            try {
                                i = n(h)
                            } catch (o) {
                                d.warn("Buy param append execution failed")
                            }
                        e.isString(i) && (i = v.parse(i)),
                            e.mix(t, i)
                    }),
                    t
            }

            function i() {
                var t = b();
                e.each(k, function(n) {
                    if (e.isFunction(n))
                        try {
                            n(t)
                        } catch (i) {
                            d.warn("Action before buy failed: %s", i.message)
                        }
                })
            }

            function o(e) {
                e.submit()
            }

            function a(e, t) {
                var n = b().form,
                    i = n.elements,
                    o = i[e];
                if (o)
                    o.value = t;
                else
                    try {
                        o = g.create('<input type="hidden" name="' + e + '" value="' + t + '"/>'),
                            g.append(o, n)
                    } catch (a) {
                        d.warn("Append new form param error: ", a.message)
                    }
            }

            function r(t) {
                var n = {
                    quantity: h.getAmount(),
                    skuId: h.getSkuId(),
                    frm: h.getFrm(),
                    buyer_from: h.getBuyerFrom(),
                    item_url_refer: h.getUrlRefer(),
                    root_refer: h.getRootRefer(),
                    source_time: +new Date,
                    ybhpss: h.getQueryParam("ybhpss")
                };
                e.isObject(t) && e.mix(n, t),
                    e.each(n, function(e, t) {
                        null !== e && a(t, e)
                    })
            }

            function s(t) {
                var a = b().form;
                window.self !== window.top && (a.target = "_top");
                try {
                    var s = f(a),
                        l = s.attr("action");
                    s.attr("action", l + (l.indexOf("?") ? "?" : "&") + "spm=" + h.getPvSpmId("buy"))
                } catch (u) {}
                var p = n();
                if (e.isObject(t) && e.mix(p, t),
                    r(p),
                    i(),
                    c && c.available())
                    try {
                        c.submit(a)
                    } catch (u) {
                        d.error("Buy impl error: %s", u.message),
                            o(a)
                    }
                else
                    o(a)
            }
            var c, l = t("../gl/"),
                d = t("log").getLogger("buy"),
                u = t("../login/"),
                f = t("node").all,
                p = f("body"),
                g = t("dom"),
                m = t("event"),
                h = t("../config/"),
                v = t("../querystring/"),
                b = h.getSkuConfig,
                k = [],
                y = "tb-disabled",
                w = ".J_LinkBuy",
                X = "#J_juValid";
            p.on("buy:button", function(e) {
                    var t = e.content,
                        n = e.disabled,
                        i = e.hidden,
                        o = e.cls,
                        a = f(w, X);
                    try {
                        n === !0 ? a.addClass(y) : n === !1 && a.removeClass(y),
                            t && a.html(t),
                            i === !0 ? a.hide() : i === !1 && a.show(),
                            o && a.addClass(o)
                    } catch (r) {
                        d.warn("Button modify error")
                    }
                }),
                p.on("buy:before", function(e) {
                    k.push(e.action)
                });
            var S = [];
            return p.on("buy:params", function(e) {
                    S.push(e.params)
                }),
                p.on("buy:impl", function(e) {
                    c = e
                }),
                p.on("buy:submit", function(e) {
                    var t = e.params;
                    u(function() {
                        s(t)
                    })
                }), {
                    init: function() {
                        function e(e) {
                            l("4.0.0"),
                                p.fire("sku:validate", {
                                    success: function() {
                                        p.fire("buy:submit")
                                    }
                                })
                        }
                        var t = b(),
                            n = t.linkBuy;
                        n ? m.on(n, "click", function(t) {
                            t.preventDefault(),
                                e(t)
                        }) : m.on("#detail", "click", function(t) {
                            var n = t.target;
                            !(g.hasClass(n, "J_LinkBuy") || "b" === n.tagName.toLowerCase() && g.parent(n, ".J_LinkBuy")) || g.hasClass(n, "tb-disabled") || g.parent(n, ".tb-disabled") || (t.preventDefault(),
                                e(t))
                        })
                    }
                }
        }),
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
                        a ? a.data ? t.success(a.data) : t.request() : +new Date - o > i ? (t.set("status", r),
                            t.request()) : setTimeout(e, 100)
                    }
                    var t = this,
                        i = t.get("timeout");
                    if (n.isSibRequested) {
                        var o = +new Date;
                        setTimeout(e, 30)
                    } else
                        t.request()
                },
                request: function() {
                    var e = this,
                        t = n.getSibUrl();
                    if (t) {
                        var i = document.referrer,
                            o = "&ref=" + encodeURIComponent(i.replace(/userid=%s/gi, ""));
                        t.length + o.length < 2e3 && (t += o),
                            new a({
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
                    t.sibData = e,
                        n.setSibData(e),
                        i.info("Request success"),
                        t.set("success", !0),
                        t.set("complete", !0),
                        t.execHandlers()
                },
                error: function() {
                    var e = this,
                        t = e.get("status");
                    i.error("Request %s", t === r ? "timeout" : "failed"),
                        e.set("error", !0),
                        e.set("complete", !0),
                        e.execHandlers()
                },
                execHandlers: function() {
                    var t = this,
                        o = t.get("success"),
                        a = (t.get("error"),
                            o ? "successHandlers" : "errorHandlers"),
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
                        }),
                        t.set(a, [])
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
        }),
        KISSY.add("item-detail/resource/index", ["node", "./sib"], function(e, t, n, i) {
            var o = t("node"),
                a = t("./sib"),
                r = new a,
                s = o.all,
                c = s("body");
            c.on("resource:sib", function(e) {
                var t = e.success,
                    n = e.error,
                    i = r.get("complete"),
                    o = r.get("successHandlers"),
                    a = r.get("errorHandlers");
                t && o.push(t),
                    n && a.push(n),
                    r.set("successHandlers", o),
                    r.set("errorHandlers", a),
                    i && r.execHandlers()
            })
        }),
        KISSY.add("item-detail/validator/amount", ["base", "node", "../config/"], function(e, t) {
            var n = t("base"),
                i = t("node").all,
                o = t("../config/"),
                a = i("body"),
                r = n.extend({
                    check: function(e) {
                        var t = this;
                        if (t.hideError(),
                            e <= 0)
                            t.showError("\u8bf7\u586b\u5199\u6b63\u786e\u7684\u5b9d\u8d1d\u6570\u91cf\uff01");
                        else if (t.isOverSold())
                            t.showError("\u5df2\u62cd\u5b8c, \u4f46\u8fd8\u6709\u4eba\u672a\u4ed8\u6b3e, \u5f85\u4f1a\u513f\u6765\u770b\u770b\uff01");
                        else if (t.hasChannelStock())
                            if (t.hasLocalStock()) {
                                if (!(t.getLimit() && e > t.getLimit()))
                                    return !0;
                                o.isMS ? t.showError("\u79d2\u6740\u5546\u54c1, \u6bcf\u4eba\u9650\u8d2d" + t.getLimit() + "\u4ef6") : t.showError("\u60a8\u6240\u586b\u5199\u7684\u5b9d\u8d1d\u6570\u91cf\u8d85\u8fc7\u9650\u8d2d\u6570\u91cf\uff01")
                            } else
                                t.showError("\u8be5\u5b9d\u8d1d\u5728\u60a8\u6240\u9009\u5730\u533a\u6682\u65e0\u5e93\u5b58\uff01");
                        else
                            t.showError("\u8be5\u5b9d\u8d1d\u6682\u65e0\u4f18\u60e0\u5e93\u5b58!")
                    },
                    hasLocalStock: function() {
                        if (this.sku.get("isLocalStock")) {
                            var e = this.sku.getDefaultStock().stock,
                                t = !e;
                            return this.set("trade", t),
                                this.sku.hasSku() && (e ? this.sku.show() : this.sku.hide()),
                                this.getStock()
                        }
                        return !0
                    },
                    hasChannelStock: function() {
                        return !o.hasChannelStock() || this.getStock() > 0
                    },
                    isOverSold: function() {
                        var e = this.sku.isOverSold();
                        return this.set("trade", e),
                            e
                    },
                    getLimit: function() {
                        var e = this.sku.getLimit() || 0,
                            t = o.getBBQLimit() || 0,
                            n = o.getMSLimit() || 0;
                        return o.isMS && n ? n : e && t ? Math.min(e, t) : e || t ? e || t : 0
                    },
                    getStock: function() {
                        var e = this.sku.getStock();
                        return this.sku.userConfig && this.sku.userConfig.stockMap && this.sku.userConfig.stockMap.vogueMap ? this.sku.userConfig.stockMap.vogueMap[e] || "" : e
                    },
                    showError: function(e) {
                        var t = this.el,
                            n = i(".tb-stop", t),
                            e = e || "\u53d1\u751f\u9519\u8bef";
                        if (!n[0]) {
                            var o = i('<div class="tb-msg" title="' + e + '"><div class="tb-stop">' + e + "</div></div>"),
                                a = i(".tb-msgs", t);
                            a.append(o),
                                n = i(".tb-stop", t)
                        }
                        n.html(e),
                            i(".tb-msg", t).show()
                    },
                    hideError: function() {
                        var e = i(".tb-msg", this.el);
                        e.hide()
                    }
                }, {
                    ATTRS: {
                        el: {
                            setter: function(e) {
                                this.$el = e,
                                    this.el = e[0]
                            }
                        },
                        sku: {
                            setter: function(e) {
                                this.sku = e
                            }
                        },
                        trade: {
                            setter: function(e) {
                                e ? (a.fire("buy:button cart:button", {
                                        disabled: !0
                                    }),
                                    this.tradeDisabled = !0) : this.tradeDisabled && (a.fire("buy:button cart:button", {
                                        disabled: !1
                                    }),
                                    this.tradeDisabled = !1)
                            }
                        }
                    }
                });
            return r
        }),
        KISSY.add("item-detail/validator/extend", ["node"], function(e, t) {
            function n() {
                o();
                for (var e = 0, t = c.length; e < t; e++) {
                    var n = c[e],
                        a = n.call();
                    if (a)
                        return i(a),
                            !1
                }
                return !0
            }

            function i(e) {
                var t = a(".tb-stop", s);
                if (e = e || "\u53d1\u751f\u9519\u8bef",
                    !t[0]) {
                    var n = a('<div class="tb-msg" title="' + e + '"><div class="tb-stop">' + e + "</div></div>"),
                        i = a(".tb-msgs", s);
                    i.append(n),
                        t = a(".tb-stop", s)
                }
                t.html(e),
                    a(".tb-msg", s).show()
            }

            function o() {
                var e = a(".tb-msg", s);
                e.hide()
            }
            var a = t("node").all,
                r = a("body"),
                s = a("#J_isku"),
                c = [];
            return r.on("validator:register", function(t) {
                    var n = t.rule;
                    if (!e.isFunction(n))
                        throw "Validator rule is not a function: " + n;
                    c.push(n)
                }),
                r.on("extend:validator", function() {
                    n()
                }), {
                    validate: n
                }
        }),
        KISSY.add("item-detail/stock/stock", ["log", "base", "../gl/", "../config/", "node"], function(e, t) {
            var n = (t("log").getLogger("stock"),
                    t("base")),
                i = t("../gl/"),
                o = t("../config/"),
                a = t("node").all,
                r = a("body"),
                s = n.extend({
                    initializer: function() {
                        var e = this,
                            t = e.$el;
                        e.$input = a("input", t),
                            e.$reduce = a(".J_Reduce", t),
                            e.$increase = a(".J_Increase", t),
                            t.length && (e.check(),
                                e.bind())
                    },
                    bind: function() {
                        var e = this,
                            t = e.$el,
                            n = e.$input;
                        n.on("valuechange", function() {
                                e.check()
                            }),
                            t.delegate("click", "a", function(t) {
                                var o = a(t.currentTarget),
                                    r = parseInt(n.val());
                                t.halt(),
                                    o.data("data-disable") || (r ? o.hasClass("J_Increase") ? e.roll("up", r, function() {
                                        n.val(r + 1),
                                            i("14.0"),
                                            e.check()
                                    }) : e.roll("down", r, function() {
                                        n.val(r - 1),
                                            i("14.1"),
                                            e.check()
                                    }) : n.val(1))
                            })
                    },
                    validate: function() {
                        var e = this,
                            t = e.$input,
                            n = t.val(),
                            i = Number(n);
                        return e.set("stock", e.validator.getStock()),
                            e.set("limit", e.validator.getLimit()),
                            o.isMS && this.$stock.siblings(".tb-limit") ? (this.$stock.siblings(".tb-limit").html(this.limit),
                                e.validator.check(i)) : (this.limit && this.limit < this.stock ? this.$limit ? this.$limit.html(this.limit) : (this.$stock.parent().after('<em>(\u9650\u8d2d<span class="J_StockVal">' + this.limit + "</span>\u4ef6)</em>"),
                                    this.$stock.parent().hide(),
                                    this.$limit = a(".J_StockVal", this.$el)) : this.$limit && (this.$limit.parent().remove(),
                                    this.$stock.parent().show(),
                                    this.$limit = null),
                                e.validator.check(i))
                    },
                    check: function() {
                        var t = this,
                            n = t.$input,
                            i = n.val(),
                            o = Number(i);
                        t.validate() || (n.fire("focus"),
                                setTimeout(function() {
                                    n.fire("select")
                                }, 50)),
                            i && !o && e.isNumber(o) && (o = 1,
                                n.val(o)),
                            o < 1 && (o = 1),
                            o >= 99999999 && (o = 99999999,
                                n.val(o)),
                            t.updateStyle(),
                            r.fire("quantity:changed", {
                                quantity: o
                            })
                    },
                    updateStyle: function() {
                        var e = this,
                            t = e.$input,
                            n = e.$reduce,
                            i = e.$increase,
                            o = t.val(),
                            a = Number(o),
                            r = e.get("stock"),
                            s = e.get("limit");
                        s && s < r && (r = s),
                            a - 1 === 0 ? n.data("data-disable", !0).addClass("tb-disable-reduce") : n.data("data-disable", !1).removeClass("tb-disable-reduce"),
                            a >= r ? i.data("data-disable", !0).addClass("tb-disable-increase") : i.data("data-disable", !1).removeClass("tb-disable-increase")
                    },
                    roll: function(t, n, i) {
                        var o, r, s, c = this,
                            l = "",
                            d = c.$el,
                            u = function(e, t, n) {
                                var i = "";
                                e += "",
                                    i += '<span id="' + t + '" class="' + n + '">';
                                for (var o = 0; o < e.length; o++)
                                    i += "<span>" + e[o] + "</span>";
                                return i += "</span>"
                            };
                        if ("up" === t ? (o = n + 1,
                                r = -25,
                                s = "J_StockNumUp") : (o = n - 1,
                                r = 25,
                                s = "J_StockNumDown"),
                            e.UA.ie && e.UA.ie < 8)
                            return void i();
                        l += u(n, "J_StockNum", "tb-stock-num"),
                            l += u(o, s, "tb-stock-num tb-stock-num-" + t),
                            a(".tb-stock", d).append(l);
                        var f = a("#J_StockNum"),
                            p = a("#" + s);
                        f.last("span").animate({
                                top: r,
                                opacity: .5
                            }, {
                                duration: .1,
                                complete: function() {
                                    f.remove()
                                }
                            }),
                            p.last("span").animate({
                                top: r,
                                opacity: 1
                            }, {
                                duration: .1,
                                complete: function() {
                                    p.remove(),
                                        i && i()
                                }
                            })
                    },
                    update: function() {
                        this.validate(),
                            this.updateStyle()
                    }
                }, {
                    ATTRS: {
                        el: {
                            setter: function(e) {
                                this.$el = a(e),
                                    this.$stock = a(".tb-count", this.$el)
                            }
                        },
                        validator: {
                            setter: function(e) {
                                this.validator = e
                            }
                        },
                        stock: {
                            setter: function(e) {
                                if ("string" == typeof e) {
                                    var t = this.$stock.parent();
                                    if (t.length > 0) {
                                        for (var n = t.getDOMNode().childNodes, i = 0; i < n.length; i++) {
                                            var o = n[i];
                                            o.nodeType === Node.TEXT_NODE && (o.nodeValue = "")
                                        }
                                        this.$stock.html("" === e ? "" : "(" + e + ")")
                                    }
                                } else
                                    e = parseInt(e),
                                    this.stock = isNaN(e) ? 0 : e,
                                    this.$stock.html(this.stock)
                            }
                        },
                        limit: {
                            setter: function(e) {
                                e = parseInt(e),
                                    this.limit = isNaN(e) ? 0 : e
                            }
                        }
                    }
                });
            return s
        }),
        KISSY.add("item-detail/newsku/index", ["node", "sku", "../validator/amount", "../validator/extend", "../stock/stock", "../config/"], function(e, t) {
            var n = t("node"),
                i = t("sku"),
                o = t("../validator/amount"),
                a = t("../validator/extend"),
                r = t("../stock/stock"),
                s = t("../config/"),
                c = n.all,
                l = c("body"),
                d = function() {
                    var e = this;
                    l.on("stock:ready", function() {
                        e.init(),
                            e.bind()
                    })
                };
            return d.prototype.init = function() {
                    var e = this;
                    e.$container = c("#J_isku"),
                        e.$props = c(".J_Prop", e.$container),
                        e.sku = new i({
                            root: ".J_Prop",
                            hook: "li",
                            skuMap: s.getSkuMap(),
                            promoMap: s.getPromoMap() || {},
                            stockMap: s.getStockMap(),
                            attrName: "data-value",
                            selectedClass: "tb-selected",
                            disabledClass: "tb-out-of-stock"
                        }),
                        TB.SKU = e.sku,
                        e.props = [],
                        e.$props.each(function(t) {
                            var n = c(t),
                                i = n.one("ul"),
                                o = n.one("li");
                            if (i && o) {
                                var a = i.hasClass("tb-img"),
                                    r = o.hasClass("J_isAutoProp"),
                                    s = "",
                                    l = "",
                                    d = "";
                                r ? d = o.attr("id") : (s = i.attr("data-property"),
                                        l = o.attr("data-value").split(":")[0]),
                                    e.props.push({
                                        pvid: "",
                                        name: "",
                                        elmt: null,
                                        prop: s,
                                        propId: l,
                                        hasImg: a,
                                        isAuto: r,
                                        hookId: d
                                    })
                            }
                        }),
                        l.fire("sku:ready", {
                            props: e.props
                        })
                },
                d.prototype.get = function(e) {
                    return this.sku.get(e)
                },
                d.prototype.set = function(e, t) {
                    return this.sku.set(e, t)
                },
                d.prototype.bind = function() {
                    var t = this,
                        n = c(".tb-rmb-num", "#J_StrPrice"),
                        i = t.sku.hasPromo(),
                        o = s.getDefPrice() || n.html(),
                        a = s.getSkuConfig();
                    t.sku.on("skuFound skuChanged", function(e) {
                            var t = e.sku,
                                n = t.skuId,
                                o = ";" + t.pvs + ";";
                            a.skuId = n,
                                a.skuFlag = o,
                                l.fire("price:update", {
                                    id: "origin",
                                    price: i ? t.priceDefault : t.price
                                }),
                                l.fire("stock:update"),
                                l.fire("sku:selected", {
                                    sku: t,
                                    flag: o
                                })
                        }),
                        t.sku.on("skuLost", function() {
                            a.skuId = null,
                                a.skuFlag = null,
                                l.fire("price:update", {
                                    id: "origin",
                                    price: o
                                }),
                                l.fire("stock:update"),
                                l.fire("sku:unselected")
                        }),
                        t.sku.on("selectionChanged", function(n) {
                            var i = n.sku,
                                o = i.els;
                            a.skuSelected = o && o.length === t.props.length,
                                e.each(t.props, function(e) {
                                    var t = null,
                                        n = null,
                                        o = "",
                                        a = "";
                                    if (t = e.isAuto ? c("#" + e.hookId) : i.props[e.propId],
                                        t && t.length && (n = t[0],
                                            o = t.attr("data-value"),
                                            a = t.one("span").html(),
                                            e.hasImg && t === i.el)) {
                                        var r = t.one("a"),
                                            s = t.data("data-src");
                                        s ? l.fire("thumb:show", {
                                            src: s
                                        }) : (s = r.css("backgroundImage"),
                                            ~s.indexOf("url(") && (s = s.match(/url\("?([^\)^"]*)/)[1].replace("30x30", "400x400"),
                                                t.data("data-src", s),
                                                l.fire("thumb:show", {
                                                    src: s
                                                })))
                                    }
                                    e.elmt = n,
                                        e.pvid = o,
                                        e.name = a
                                })
                        }),
                        t.sku.on("skuFound", function(e) {
                            var t = e.sku;
                            l.fire("sku:found", {
                                sku: t
                            })
                        }),
                        t.sku.on("skuChanged", function(e) {
                            var t = e.sku;
                            l.fire("sku:changed", {
                                sku: t
                            })
                        }),
                        t.sku.on("skuLost", function() {
                            l.fire("sku:lost")
                        }),
                        t.sku.on("selectionChanged", function(e) {
                            var n = e.sku;
                            l.fire("sku:selectionChanged", {
                                sku: n,
                                props: t.props
                            })
                        }),
                        l.on("sku:set", function(n) {
                            n.skuMap && (t.sku.set("skuMap", n.skuMap),
                                    t.sku.serializeSkuMap()),
                                n.localStock && (t.sku.set("isLocalStock", !0),
                                    t.sku.resetStock(n.localStock)),
                                e.isString(n.pvs) && t.sku.setCurrentSku(n),
                                l.fire("stock:update")
                        }),
                        t.sku.init(),
                        t.initStock(),
                        t.initValidator(),
                        t.setDefPvs()
                },
                d.prototype.setDefPvs = function() {
                    var t = ["a1z0d", "a1z09", "a1z10", "a230r", "a219r"],
                        n = e.unparam(location.search.replace(/\?/gi, "")),
                        i = n.spm;
                    if (i && e.isString(i) && e.inArray(i.split(".")[0], t))
                        if (n.skuId) {
                            var o = s.getSkuMap();
                            e.each(o, function(e, t) {
                                e.skuId === n.skuId && l.fire("sku:set", {
                                    pvs: t
                                })
                            })
                        } else
                            n.sku && l.fire("sku:set", {
                                pvs: n.sku
                            })
                },
                d.prototype.initStock = function() {
                    var e = this,
                        t = new o({
                            el: e.$container,
                            sku: e.sku
                        });
                    e.modStock = new r({
                            el: c(".tb-amount", e.$container),
                            validator: t
                        }),
                        l.on("stock:update", function() {
                            e.modStock.update()
                        })
                },
                d.prototype.initValidator = function() {
                    var e, t = this;
                    c(".J_Close", "#J_SureSKU").on("click", function() {
                            t.$container.removeClass("tb-attention tb-incomplete"),
                                t.$props.removeClass("tb-error-prop"),
                                t.showAttention = !1,
                                e = null
                        }),
                        c("#J_SureContinue").on("click", function() {
                            t.skuValidate() && t.modStock.validate() && a.validate() && e && e()
                        }),
                        l.on("sku:validate", function(n) {
                            e = n.success,
                                t.skuValidate() && t.modStock.validate() && a.validate() ? n.success && n.success() : n.error && n.error()
                        }),
                        l.on("sku:selected", function() {
                            t.showAttention && t.$container.removeClass("tb-incomplete")
                        })
                },
                d.prototype.skuValidate = function() {
                    var t = this;
                    if (!t.sku.hasSku())
                        return !0;
                    var n = [];
                    return e.each(t.props, function(e, t) {
                            "" === e.pvid && n.push(t)
                        }),
                        !(n.length > 0) || (c(".tb-choice", "#J_SureSKU").html("\u8bf7\u52fe\u9009\u60a8\u8981\u7684\u5546\u54c1\u4fe1\u606f\uff01"),
                            t.$container.addClass("tb-attention tb-incomplete"),
                            t.showAttention = !0,
                            t.$props.each(function(t, i) {
                                var o = c(t).attr("data-rel");
                                e.indexOf(i, n) > -1 ? o ? c("#" + o).addClass("tb-error-prop") : c(t).addClass("tb-error-prop") : o ? c("#" + o).removeClass("tb-error-prop") : c(t).removeClass("tb-error-prop")
                            }),
                            !1)
                },
                new d
        }),
        KISSY.add("item-detail/cart/add", ["log", "../login/", "../config/", "uri", "../querystring/", "cookie", "base", "node"], function(e, t) {
            function n() {
                var t = f.getSkuConfig();
                e.each(X, function(n) {
                    if (e.isFunction(n))
                        try {
                            n(t)
                        } catch (i) {
                            d.warn("Action before cart failed: %s", i.message)
                        }
                })
            }

            function i() {
                var t = [],
                    n = f.getSkuConfig();
                return e.each(_, function(i) {
                        var o = i;
                        if (e.isFunction(i))
                            try {
                                o = i(n)
                            } catch (a) {
                                d.warn("Cart param append execution failed")
                            }
                        e.isObject(o) && (o = g.stringify(o)),
                            t.push(String(o))
                    }),
                    t.join("&")
            }

            function o(e, t) {
                return e + (-1 === e.indexOf("?") ? "?" : "&") + t
            }

            function a() {
                return l
            }

            function r(e) {
                d.warn("Add cart request failed: %s", e),
                    alert(e)
            }

            function s() {
                var e = document;
                return e.charset || e.characterSet || "gb2312"
            }

            function c(t, n, i) {
                e.getScript(t, {
                    success: n,
                    error: i,
                    timeout: 10,
                    charset: s()
                })
            }
            var l, d = t("log").getLogger("cart"),
                u = t("../login/"),
                f = t("../config/"),
                p = t("uri").Query,
                g = t("../querystring/"),
                m = t("cookie"),
                h = t("base"),
                v = t("node").all,
                b = v("body"),
                k = f.isDaily,
                y = k ? "daily.taobao.net" : "taobao.com",
                w = k ? "http" : "https";
            b.on("promo:price", function(e) {
                l = e.price
            });
            var X = [];
            b.on("cart:before", function(e) {
                X.push(e.action)
            });
            var S;
            b.on("cart:impl", function(e) {
                S = e
            });
            var _ = [];
            b.on("cart:params", function(e) {
                _.push(e.params)
            });
            var I = h.extend({
                    normalCartImpl: function(e, t, n) {
                        var i = this;
                        d.info("Add cart request %s", t),
                            c(t, function() {
                                if (i.adding = !1,
                                    "undefined" == typeof TB.Detail.CartResult) {
                                    var t = "\u8d2d\u7269\u8f66\u5f00\u5c0f\u5dee\u4e86\uff0c\u8bf7\u7a0d\u540e\u518d\u8bd5";
                                    return r(t)
                                }
                                var o = TB.Detail.CartResult;
                                if (TB.Detail.CartResult = null,
                                    delete TB.Detail.CartResult,
                                    "NEED_LOGIN" === o.errorCode)
                                    return d.info("Server response: %s", o.errorCode),
                                        u(function() {
                                            i.add(e, n)
                                        });
                                if ("undefined" != typeof o.error) {
                                    if ("TrackCartIsFull" === o.error) {
                                        var a = w + "://login." + y + "/member/login.jhtml?from=detail&style=simple&redirectURL=" + encodeURIComponent(location.href),
                                            t = '\u60a8\u6dfb\u52a0\u7684\u5b9d\u8d1d\u79cd\u7c7b\u5df2\u7ecf\u8fbe\u5230\u4e0a\u9650\u4e86\uff0c<a href="' + a + '">\u767b\u5f55</a>\u540e\u53ef\u7ee7\u7eed\u6dfb\u52a0';
                                        return i.validator.showError(t)
                                    }
                                    return "UserCartIsFull" === o.error ? i.validator.showError("\u60a8\u6dfb\u52a0\u7684\u5b9d\u8d1d\u79cd\u7c7b\u5df2\u7ecf\u8fbe\u5230\u4e0a\u9650\u4e86") : i.validator.showError(o.error)
                                }
                                if (o.cartQuantity) {
                                    var s = Number(o.cartQuantity);
                                    try {
                                        TB.Global.setCartNum && TB.Global.setCartNum(s)
                                    } catch (c) {
                                        d.warn("setCartNum error")
                                    }
                                    b.fire("toolbar:cart:num", {
                                            num: s
                                        }),
                                        b.fire("cart:add:success", {
                                            quantity: s,
                                            price: o.price
                                        })
                                }
                                o.sourceTime = e.sourceTime,
                                    n(o)
                            }, function() {
                                i.adding = !1,
                                    b.fire("cart:add:error");
                                var e = "\u8d2d\u7269\u8f66\u5f00\u5c0f\u5dee\u4e86\uff0c\u8bf7\u7a0d\u540e\u518d\u8bd5";
                                return r(e)
                            })
                    },
                    addCart: function(t, r) {
                        var s = this;
                        if (!s.adding) {
                            s.adding = !0;
                            var c, l, d = f.getSkuConfig(),
                                u = new p;
                            f.hasSku() ? (c = 2,
                                l = t.skuId) : (c = 1,
                                l = t.itemId || I.getItemId());
                            var g = {
                                outer_id: l,
                                outer_id_type: c,
                                quantity: t.amount,
                                opp: a(),
                                nekot: e.now(),
                                ct: t.trackId,
                                _tb_token_: f.getToken(),
                                deliveryCityCode: f.getDeliveryId(),
                                frm: f.getFrm(),
                                buyer_from: f.getBuyerFrom(),
                                item_url_refer: f.getUrlRefer(),
                                root_refer: f.getRootRefer(),
                                flushingPictureServiceId: f.getFlushingPictureServiceId(),
                                spm: f.getPvSpmId("cart"),
                                ybhpss: f.getQueryParam("ybhpss")
                            };
                            e.each(g, function(e, t) {
                                null !== e && u.add(t, e)
                            });
                            var m = u.toString(),
                                h = d.apiAddCart,
                                v = o(h, m),
                                b = i();
                            if (b && (v = o(v, b)),
                                n(),
                                S && S.available())
                                try {
                                    S.submit(v, function() {
                                        s.normalCartImpl(t, v, r)
                                    })
                                } catch (k) {
                                    s.normalCartImpl(t, v, r)
                                }
                            else
                                s.normalCartImpl(t, v, r)
                        }
                    },
                    add: function(e, t) {
                        var n = this,
                            i = Number(e.amount);
                        n.validator.check(i) && (I.getTrackId.trackId ? (e.trackId = I.getTrackId.trackId,
                            this.addCart(e, t)) : I.getTrackId(function(i) {
                            I.getTrackId.trackId = i,
                                e.trackId = I.getTrackId.trackId,
                                n.addCart(e, t)
                        }))
                    }
                }, {
                    ATTRS: {
                        validator: {
                            setter: function(e) {
                                this.validator = e
                            }
                        }
                    },
                    hasCart: function() {
                        var e = f.getSkuConfig();
                        return e.cart
                    },
                    getTrackId: function(t) {
                        d.info("Get track id");
                        var n = f.getSkuConfig();
                        if (n.valCartInfo && n.valCartInfo.ct)
                            return t(n.valCartInfo.ct);
                        var i = m.get("t");
                        if (location.hostname.indexOf("taobao.com") === -1 && location.hostname.indexOf("taobao.net") === -1 && n.apiGetTrackID) {
                            var a = n.apiGetTrackID,
                                r = o(a, "varName=TB.Detail.TrackID&t=" + e.now());
                            d.info("Get track id request %s", r),
                                c(r, function() {
                                    return "undefined" == typeof TB.Detail.TrackID ? t(i) : (t(TB.Detail.TrackID.ct),
                                        TB.Detail.TrackID = null,
                                        void delete TB.Detail.TrackID)
                                }, function() {
                                    t(i)
                                })
                        } else
                            t(i)
                    },
                    getItemId: function() {
                        return f.getSkuConfig().valCartInfo.itemId
                    }
                }),
                C = new I;
            return b.on("cart:add", function(e) {
                u(function() {
                    e.sourceTime = +new Date,
                        C.set("validator", e.validator),
                        C.add(e, e.success)
                })
            }), {
                init: function() {}
            }
        }),
        KISSY.add("item-detail/cart/index", ["log", "../gl/", "../config/", "./add", "cookie", "dom", "event", "node"], function(e, t) {
            var n = t("log").getLogger("cart"),
                i = t("../gl/"),
                o = t("../config/"),
                a = t("./add"),
                r = (t("cookie"),
                    t("dom")),
                s = t("event"),
                c = t("node").all,
                l = c("body"),
                d = l,
                u = (o.getTaobaoHost(),
                    "click"),
                f = {},
                p = "tb-disabled",
                g = ".J_LinkAdd",
                m = "#J_juValid";
            l.on("cart:button", function(e) {
                var t = e.content,
                    i = e.disabled,
                    o = e.hidden,
                    a = e.cls,
                    r = c(g, m);
                try {
                    i === !0 ? r.addClass(p) : i === !1 && r.removeClass(p),
                        t && r.html(t),
                        o === !0 ? r.hide() : o === !1 && r.show(),
                        a && r.addClass(a)
                } catch (s) {
                    n.warn("Button modify error")
                }
            });
            var h = [];
            l.on("cart:jump:params", function(e) {
                    h.push(e.params)
                }),
                l.on("cart:add:jump", function(t) {
                    var n = (o.isDaily ? "//cart.daily.taobao.net" : "//cart.taobao.com") + "/add_cart_succeed.htm?_input_charset=" + document.charset + "&spm=" + o.getPvSpmId("cart"),
                        i = encodeURIComponent;
                    try {
                        var t = {
                            itemId: o.getGlobalConfig("itemId"),
                            sellerId: o.getGlobalConfig("sellerId"),
                            shopId: o.getGlobalConfig("shopId"),
                            sellerNick: i(o.getGlobalConfig("sellerNick")),
                            shopName: i(o.getGlobalConfig("shopName")),
                            itemPic: o.getItemConfig("pic"),
                            skuId: t.skuId || "",
                            cartCount: t.cartQuantity,
                            itemCount: t.amount,
                            price: o.getPrice(),
                            sourceTime: t.sourceTime,
                            title: i(o.getTitle())
                        };
                        h && e.each(h, function(n) {
                            e.mix(t, n)
                        })
                    } catch (a) {}
                    var r = c("<form/>").attr({
                        name: "cartJump",
                        action: n,
                        method: "post"
                    });
                    e.each(t, function(e, t) {
                            if (e) {
                                var n = c("<input>").attr({
                                    name: t,
                                    value: e,
                                    type: "hidden"
                                });
                                r.append(n)
                            }
                        }),
                        d.append(r),
                        r[0].submit()
                });
            var v = function() {
                var e = r.create('<div class="tb-msg tb-hidden"></div>'),
                    t = r.create('<p class="tb-stop">\u53d1\u751f\u9519\u8bef</p>'),
                    n = r.get(".tb-action");
                return n && (e.appendChild(t),
                        n.parentNode.insertBefore(e, n)),
                    function(n, i) {
                        i ? r.hide(e) : r.show(e),
                            i || (t.innerHTML = n)
                    }
            }();
            l.on("cart:click", function() {
                var e, t;
                l.fire("sku:validate", {
                    success: function() {
                        var n = o.getAmount();
                        o.hasSku() ? (e = 2,
                                t = o.getSkuId()) : (e = 1,
                                t = o.getItemId()),
                            l.fire("cart:add", {
                                skuId: t,
                                amount: n,
                                success: function(i) {
                                    i.amount = n,
                                        2 === e && (i.skuId = t),
                                        l.fire("cart:add:jump", i)
                                },
                                validator: {
                                    showError: function(e) {
                                        v(e)
                                    },
                                    check: function(e) {
                                        return !0
                                    }
                                }
                            })
                    },
                    error: function() {
                        l.fire("config:set", {
                            key: "lastValidator",
                            value: "cart"
                        })
                    }
                })
            });
            var b = function(e) {
                    e && e.preventDefault(),
                        i("5.0.0"),
                        l.fire("cart:click")
                },
                k = {
                    init: function() {
                        (f = o.getSkuConfig()) && f.cart && (a.init(),
                            this.bind())
                    },
                    bind: function() {
                        var e = r.get("#J_LinkAdd");
                        l.on("cart:add:success", function(e) {
                                try {
                                    TB.Global.setCartNum(e.quantity)
                                } catch (t) {
                                    n.warn("setCartNum error")
                                }
                            }),
                            l.on("cart:popup:show", function() {
                                l.fire("relatemarket:show")
                            }),
                            e ? s.on(e, u, b) : s.on("#detail", u, function(e) {
                                var t = e.target;
                                "b" === t.tagName.toLowerCase() && (t = r.parent(t, ".J_LinkAdd")),
                                    !r.hasClass(t, "J_LinkAdd") && !r.hasClass(t.parentNode, "J_LinkAdd") || r.hasClass(t.parentNode, "tb-disabled") || b(e)
                            })
                    }
                };
            return k
        }),
        KISSY.add("item-detail/promotion/index", ["log", "../config/", "node", "base", "xtemplate"], function(e, t, n, i) {
            var o = t("log").getLogger("promotion"),
                a = t("../config/"),
                r = t("node"),
                s = t("base"),
                c = t("xtemplate"),
                l = r.all,
                d = l("body"),
                u = s.extend({
                    init: function() {
                        var e = this,
                            t = (e.get("$defPrice"),
                                a.getPromoMap());
                        if (t) {
                            e.set("promoData", t);
                            var n = a.getSkuFlag() || "def";
                            e.renderSku(n),
                                d.on("promotion:reset", function(t) {
                                    e.set("promoData", t.newVal),
                                        a.setPromoMap(t.newVal),
                                        e.renderSku(a.getSkuFlag() || "def")
                                })
                        }
                    },
                    renderSku: function(e) {
                        var t = this,
                            n = t.get("promoData");
                        if (n) {
                            var i = n[e];
                            if (i && i.length) {
                                t.set("skuData", i);
                                try {
                                    t.render()
                                } catch (a) {
                                    o.warn("Render failed: %s", a.message)
                                }
                            }
                        }
                    },
                    render: function() {
                        var e = this,
                            t = e.get("init"),
                            n = e.get("skuData"),
                            i = e.get("$hd"),
                            o = e.get("$meta"),
                            a = (e.get("$defPrice"),
                                e.get("$promoWrap"));
                        if (n && n.length && i.length) {
                            var r = n[0],
                                s = n.slice(1);
                            if (e.set("firstPromo", r),
                                e.set("otherPromo", s),
                                t) {
                                var l = e.get("$price"),
                                    u = e.get("$promoType"),
                                    f = e.get("$promoTips"),
                                    p = e.get("$promoInfo"),
                                    g = e.get("$promoIcon");
                                l.text(e.getPromoPrice(r)),
                                    u.html(r.type || ""),
                                    f.html(r.wenan || ""),
                                    p.html(e.getPromoInfo(r)),
                                    r.icon && g.src(r.icon)
                            } else {
                                if (!r)
                                    return void e.onError();
                                o.addClass("tb-promo-meta"),
                                    d.fire("price:update", {
                                        id: "origin",
                                        style: "del",
                                        lock: !0
                                    }),
                                    a.removeClass("tb-hidden"),
                                    c.addCommand("promoPrice", function(t, n) {
                                        return e.getPromoPrice(t.data)
                                    }),
                                    c.addCommand("promoInfo", function(t, n) {
                                        return e.getPromoInfo(t.data)
                                    }),
                                    e.renderHd(r)
                            }
                            s.length && (e.bind(),
                                    e.renderBd(s)),
                                e.validate()
                        }
                    },
                    renderHd: function(t) {
                        var n = this,
                            i = n.get("$hd"),
                            o = n.get("tpl");
                        i.html(new c(o.hd).render({
                            firstPromo: e.mix(t, {
                                ignoreRange: !0
                            })
                        }))
                    },
                    renderBd: function(e) {
                        var t = this,
                            n = t.get("$bd"),
                            i = t.get("tpl");
                        n.addClass("tb-hidden"),
                            n.html(new c(i.bd).render({
                                otherPromo: e
                            }))
                    },
                    validate: function() {
                        var e = this,
                            t = e.get("$hd"),
                            n = (e.get("$add"),
                                e.get("$form"),
                                e.get("$price")),
                            i = (e.get("$defPrice"),
                                e.get("$promoMore")),
                            o = e.get("$promoInfo"),
                            a = e.get("firstPromo"),
                            r = e.get("otherPromo");
                        a.wenan ? t.addClass("tb-promo-no-login") : (t.removeClass("tb-promo-no-login"),
                                d.fire("promo:price", {
                                    price: n.text()
                                })),
                            "" === o.html() && o.remove(),
                            r && r.length || i.remove(),
                            a.channelkey && d.fire("buy:params cart:params", {
                                params: function() {
                                    return {
                                        channelkey: a.channelkey
                                    }
                                }
                            });
                        var s = a.amountRestriction,
                            c = a.isStart,
                            l = a.limitTime;
                        s && c === !1 && l ? (d.fire("price:update", {
                                    id: "origin",
                                    style: "del",
                                    lock: !0
                                }),
                                n.parent().addClass("tb-promo-no-start")) : (d.fire("price:update", {
                                    id: "origin",
                                    style: "bright"
                                }),
                                n.parent().removeClass("tb-promo-no-start")),
                            a.cart === !0 ? d.fire("cart:button", {
                                hidden: !1
                            }) : d.fire("cart:button", {
                                hidden: !0
                            }),
                            d.fire("promo:after")
                    },
                    bind: function() {
                        var e = this,
                            t = e.get("$promoWrap"),
                            n = e.get("$bd"),
                            i = e.get("$promoMore"),
                            o = i.one("i");
                        i.on("click", function() {
                            var e = 25,
                                a = i.offset().top - t.offset().top,
                                r = e + a;
                            n.css("top", r + "px"),
                                n.toggleClass("tb-hidden"),
                                o.toggleClass("tb-arrow-up")
                        })
                    },
                    getPromoPrice: function(e) {
                        var t = e.price,
                            n = e.priceRange,
                            i = e.ignoreRange,
                            o = e.currentRange;
                        return !i && o ? o : t || n && n.low + "-" + n.high || ""
                    },
                    getPromoInfo: function(e) {
                        var t = this,
                            n = t.get("tpl");
                        return new c(n.ft).render({
                            promo: e
                        })
                    },
                    onError: function() {
                        var e = this,
                            t = (e.get("$defPrice"),
                                e.get("$promoWrap"));
                        d.fire("price:update", {
                                id: "origin",
                                style: "bright"
                            }),
                            t.hide()
                    }
                }, {
                    ATTRS: {
                        $meta: {
                            value: l(".tb-meta")
                        },
                        $el: {
                            value: l("#J_Promo")
                        },
                        $hd: {
                            value: l("#J_PromoHd")
                        },
                        $bd: {
                            value: l("#J_PromoBd")
                        },
                        $add: {
                            value: l(".tb-btn-add", "#J_juValid")
                        },
                        $form: {
                            value: l("#J_FrmBid")
                        },
                        $price: {
                            getter: function() {
                                return l("#J_PromoPriceNum")
                            }
                        },
                        $defPrice: {
                            value: l("#J_StrPrice")
                        },
                        $promoWrap: {
                            value: l("#J_PromoPrice")
                        },
                        $promoType: {
                            getter: function() {
                                return l("#J_PromoType")
                            }
                        },
                        $promoTips: {
                            getter: function() {
                                return l("#J_PromoTips")
                            }
                        },
                        $promoMore: {
                            getter: function() {
                                return l("#J_PromoMore")
                            }
                        },
                        $promoInfo: {
                            getter: function() {
                                return l("#J_PromoInfo")
                            }
                        },
                        tpl: {
                            value: {
                                hd: ["{{#firstPromo}}", '<div class="tb-promo-item-bd">', '<strong class="tb-promo-price">', '<em class="tb-rmb">&yen;</em>', '<em id="J_PromoPriceNum" class="tb-rmb-num">', "{{#promoPrice}}{{firstPromo}}{{/promoPrice}}", "</em>", "</strong>", '{{#if (icon)}}<img src="{{icon}}" id="J_PromoIcon" class="tb-promo-icon"/>{{/if}}', '{{#if (!icon&&type)}}<span id="J_PromoType" class="tb-promo-type">{{type}}</span>{{/if}}', '<a id="J_PromoMore" class="tb-promo-more" href="javascript:;">', '<i class="tb-arrow-roll">', "<em></em>", "<span></span>", "</i>", "</a>", '<span id="J_PromoTips" class="tb-promo-tips">{{{wenan}}}</span>', "</div>", '<div class="tb-promo-item-ft">', "{{#promoInfo}}{{firstPromo}}{{/promoInfo}}", "</div>", "{{/firstPromo}}"].join(""),
                                bd: ["<ul>", "{{#otherPromo}}", '<li class="tb-promo-item{{#if wenan}} tb-promo-no-login{{/if}}">', '<div class="tb-promo-item-l">', '<span class="tb-promo-price">', '<em class="tb-rmb">&yen;</em>', "{{#promoPrice}}{{this}}{{/promoPrice}}", "</span>", '{{#if (type)}}<span class="tb-promo-type">{{type}}</span>{{/if}}', "</div>", '<div class="tb-promo-item-r">', '<span class="tb-promo-tips">{{{wenan}}}</span>', '<span class="tb-promo-info">{{add}}{{gift}}{{limitTime}}</span>', "</div>", "</li>", "{{/otherPromo}}", "</ul>", "<p>\u4ee5\u4e0a\u4ef7\u683c\u53ef\u5728\u4ed8\u6b3e\u65f6\u9009\u62e9\u4eab\u7528</p>"].join(""),
                                ft: ["{{#promo}}", "{{#if vipPrices}}", '<div id="J_PromoInfo" class="tb-promo-info tb-promo-vip-info">', "<ul>", "{{#vipPrices}}", "<li>", "{{#if xindex===0}}", "<p>V1-V3</p>", "{{else}}", "{{#if xindex===1}}", "<p>V4-V5</p>", "{{else}}", "<p>V6</p>", "{{/if}}", "{{/if}}", "<p>", '<em class="tb-rmb">&yen;</em>', "{{this}}", "</p>", "</li>", "{{/vipPrices}}", "</ul>", "</div>", "{{else}}", '<div id="J_PromoInfo" class="tb-promo-info">', "{{add}}{{gift}}{{limitTime}}", "</div>", "{{/if}}", "{{/promo}}"].join("")
                            }
                        },
                        init: {
                            value: !1
                        },
                        skuData: {},
                        promoData: {},
                        firstPromo: {},
                        otherPromo: {}
                    }
                }),
                f = new u;
            d.on("core:error", function(e) {
                    f.onError()
                }),
                d.on("sku:selected", function(e) {
                    f.renderSku(e.flag)
                }),
                d.on("sku:lost", function() {
                    f.renderSku("def")
                }),
                i.exports = f
        }),
        KISSY.add("item-detail/onsitesetup/index", ["io", "node", "log", "../gl/", "../config/"], function(e, t) {
            function n() {
                w = !0,
                    l("#J_logistic").after('<ul class="tb-onsite-setup-options"></ul>'),
                    l("#J_logistic").after('<div class="tb-onsite-setup-groups"></div>');
                var e = l(m);
                e.delegate("click", g, function(t) {
                    t.preventDefault();
                    var n = t.target;
                    "A" !== n.tagName && (n = n.parentNode);
                    var o = l(n.parentNode);
                    return o.hasClass(v) ? (o.removeClass(v),
                        void i("-1")) : (e.children().removeClass(v),
                        o.addClass(v),
                        i(l(n).attr("data-id")),
                        k.fire("extend:validator"),
                        void u("1.3.1.2?change=1&result=" + o.attr("data-index"), "tbmarket"))
                });
                var t = l(h);
                t.delegate("click", g, function(e) {
                        e.preventDefault();
                        var t = e.target;
                        "A" !== t.tagName && (t = t.parentNode);
                        var n = l(t.parentNode),
                            o = n.parent().parent().attr("data-index"),
                            a = {};
                        return n.hasClass(v) ? (n.removeClass(v),
                            a[o] = null,
                            void i(a)) : (n.parent().children().removeClass(v),
                            n.addClass(v),
                            a[o] = l(t).attr("data-id"),
                            i(a),
                            k.fire("extend:validator"),
                            void u("1.3.1.2?change=1&result=" + n.attr("data-index"), "tbmarket"))
                    }),
                    k.fire("validator:register", {
                        rule: function() {
                            return "-1" === I && (u("1.3.1.3?errortype=1", "tbmarket"),
                                "\u8bf7\u9009\u62e9\u60a8\u9700\u8981\u7684\u914d\u9001\u5b89\u88c5\u7684\u5730\u5740\u4e0e\u65b9\u5f0f\uff01")
                        }
                    }),
                    k.on("sku:selected", function(e) {
                        var t, n = e.sku.skuId;
                        S.type !== p && _ && (t = _[n] ? _[n] : _.def,
                            s(t))
                    }),
                    k.on("sku:unselected", function() {
                        _ && s(_.def)
                    })
            }

            function i(e) {
                function t() {
                    for (var e, t = {}, n = 0, i = arguments.length; n < i; n++)
                        for (e in arguments[n])
                            arguments[n].hasOwnProperty(e) && (t[e] = arguments[n][e]);
                    return t
                }
                I = "object" != typeof e ? e : "object" == typeof I ? t(I, e) : e;
                var n = I;
                if ("object" == typeof I) {
                    var i = 0;
                    for (var o in I)
                        null !== I[o] && (i += Number(I[o]));
                    n = i
                }
                k.fire("buy:params", {
                    params: function() {
                        return {
                            fuwu_option: n
                        }
                    }
                })
            }

            function o(t) {
                var n = e.param({
                    districtId: t.areaId,
                    skuId: f.getSkuId(),
                    itemNum: f.getAmount()
                });
                return X[n] ? a(X[n]) : void new c({
                    url: S.url + "&" + n,
                    dataType: "jsonp",
                    jsonpCallback: "jsonp_onsitesetup",
                    success: a,
                    error: r
                })
            }

            function a(e) {
                if (!e || !e.data || !e.data.tradeService)
                    return _ = null,
                        r();
                l(m).removeClass("tb-hidden"),
                    l(h).removeClass("tb-hidden"),
                    _ = e.data.tradeService;
                var t, n = f.getSkuId();
                t = n && _[n] ? _[n] : _.def,
                    s(t)
            }

            function r() {
                i("0"),
                    l(m).addClass("tb-hidden"),
                    l(h).addClass("tb-hidden"),
                    d.warn("Request data fail")
            }

            function s(t) {
                var n = (l(b),
                        t && t.setup && t.setup.length),
                    o = !1;
                if (t && t.groups && t.groups.length) {
                    var a = 0;
                    for (a = 0; a < t.groups.length; a++) {
                        var r = t.groups[a].options;
                        if (r && r.length) {
                            o = !0;
                            break
                        }
                    }
                }
                if (!n && !o)
                    return void i("0");
                if (n) {
                    var s = t.setup,
                        c = "";
                    e.each(s, function(t, n) {
                            t.fee || (t.fee = (t.totalFee / 100).toFixed(2)),
                                c += e.substitute(y, {
                                    index: n + 1,
                                    id: t.id,
                                    fee: t.price,
                                    name: t.title
                                })
                        }),
                        l(m).html(c),
                        1 === s.length ? (l(m).one(g).addClass(v),
                            i(s[0].id)) : i("-1")
                } else {
                    i("0");
                    var d = t.groups,
                        c = "";
                    e.each(d, function(t, n) {
                            c += '<div class="tb-onsite-setup-group tb-clearfix" data-index="' + n + '"><span class="tb-onsite-setup-group-title">' + t.groupTitle + "</span>",
                                t.options && t.options.length && (c += '<ul class="tb-onsite-setup-group-options">',
                                    e.each(t.options, function(t, n) {
                                        t.fee || (t.fee = (t.totalFee / 100).toFixed(2)),
                                            c += e.substitute(y, {
                                                index: n + 1,
                                                id: t.id,
                                                fee: t.price,
                                                name: t.title
                                            })
                                    }),
                                    c += "</ul>"),
                                c += "</div>"
                        }),
                        l(h).html(c)
                }
                C && k.fire("buy:button cart:button", {
                    buyDisabled: !1
                })
            }
            var c = t("io"),
                l = t("node").all,
                d = t("log").getLogger("onsitesetup"),
                u = t("../gl/"),
                f = t("../config/"),
                p = "jiyoujia",
                g = ".tb-onsite-setup-option",
                m = ".tb-onsite-setup-options",
                h = ".tb-onsite-setup-groups",
                v = "tb-onsite-setup-option-selected",
                b = "#J_WlServiceInfo",
                k = l("body"),
                y = '<li class="tb-onsite-setup-option" data-id="{id}" data-index="{index}"><a href="#" data-id="{id}">{name}+{fee}\u5143</a> </li>',
                w = !1,
                X = {},
                S = f.getSetupServiceConfig(),
                _ = null,
                I = "-1",
                C = !1;
            return {
                update: function(e, t) {
                    S && (w || n(),
                        o({
                            areaId: e,
                            cityId: t
                        }))
                }
            }
        }),
        KISSY.add("item-detail/logistic/index", ["log", "node", "base", "../onsitesetup/", "../config/"], function(e, t, n, i) {
            function o() {
                var e = s("#J_SepLine");
                e.length && e.css({
                    borderBottom: "none"
                })
            }

            function a(e, t) {
                var n = e || t;
                u.fire("config:set", {
                        key: "deliveryId",
                        value: n
                    }),
                    u.fire("delivery:changed", {
                        deliveryId: n
                    }),
                    d.getSetupServiceConfig() && l.update(e, t)
            }
            var r = t("log").getLogger("logistic"),
                s = t("node").all,
                c = t("base"),
                l = t("../onsitesetup/"),
                d = t("../config/"),
                u = s("body");
            i.exports = c.extend({
                init: function() {
                    if (r.info("Init logistic"),
                        this.get("initData")) {
                        if (r.info("Render delivery fee"),
                            this.hasAddressList())
                            this.set({
                                tpl: ['<div class="tb-wl-wrap tb-clearfix">', '<span class="tb-wl-txt tb-property-type">\u7269\u6d41</span>', '<div id="J_WLInfo" class="tb-wl-ops"></div>', "</div>"].join(""),
                                renderTo: "#J_isku .tb-amount",
                                renderId: "J_WLInfo",
                                changeAnyInfo: function(e) {
                                    var t = e.addressData,
                                        n = t.userArea.id.split("_"),
                                        i = n[0];
                                    a(i)
                                }
                            });
                        else {
                            var e = ['<div class="tb-logistic tb-clearfix">', '<span class="tb-name tb-property-type">\u914d\u9001</span>', '<div id="J_LogisticInfo" class="tb-logistic-info"></div>', "</div>"].join("");
                            this.set({
                                tpl: e,
                                renderTo: ".tb-meta",
                                renderId: "J_LogisticInfo",
                                changeAnyInfo: function(e) {
                                    var t = e.addressData,
                                        n = t.userArea && t.userArea.id,
                                        i = t.userCity && t.userCity.id;
                                    a(n, i)
                                }
                            })
                        }
                        this._init()
                    } else
                        d.isMS || d.isPM ? (r.info("Miaosha or Paimai has no logistic data"),
                            o()) : (r.info("DeliveryFee and PostageFee is all null"),
                            o())
                },
                _init: function() {
                    this.render(),
                        this.initWL()
                },
                render: function() {
                    var e = this,
                        t = e.get("tpl"),
                        n = e.get("renderTo");
                    s("#J_logistic").length ? s("#J_logistic").html(t) : s(t).insertAfter(n)
                },
                initWL: function() {
                    var t = this,
                        n = t.get("itemId"),
                        i = t.get("userId"),
                        o = t.get("initUrl"),
                        a = t.get("initData"),
                        c = t.get("renderId"),
                        l = t.get("changeAnyInfo");
                    if (t.hasAddressList()) {
                        var d = s("#J_FrmBid");
                        d.append(['<input type="hidden" id="J_AddressId" name="addressId" value="">', '<input type="hidden" id="J_DivisionCode" name="divisionCode" value="">', '<input type="hidden" id="J_DeliveryGroupInfo" name="deliveryGroupInfo" value="">'].join(""));
                        var f = s("#J_AddressId"),
                            p = s("#J_DivisionCode"),
                            g = s("#J_DeliveryGroupInfo"),
                            m = function(e) {
                                var t = e.addressData,
                                    n = e.serviceData,
                                    i = t.userArea.id.split("_");
                                f.val(i[1]),
                                    p.val(i[0]),
                                    g.val(n.id)
                            }
                    }
                    e.use("address-detail/wlroute", {
                        success: function(e, t) {
                            try {
                                var s = new t({
                                    itemId: n,
                                    userId: i,
                                    initUrl: o,
                                    initData: a,
                                    renderId: c,
                                    changeAnyInfo: function(t) {
                                        m && m(t),
                                            t.changeSkuByUser || l && e.isFunction(l) && l(t)
                                    }
                                })
                            } catch (d) {
                                r.warn("WlRoute init error: %s", d.messsage)
                            }
                            u.on("sku:found sku:changed", function(e) {
                                var t = e.sku;
                                s.onChangeSku(t.skuId, "changeSkuByUser")
                            })
                        },
                        error: function(e) {
                            r.warn("Component %s load error", e.name)
                        }
                    })
                },
                hasAddressList: function() {
                    var e = this,
                        t = e.get("initData"),
                        n = t.data && t.data.addressList;
                    return !(!n || !n.length)
                }
            }, {
                ATTRS: {
                    tpl: {},
                    renderTo: {},
                    itemId: {
                        value: g_config.itemId
                    },
                    userId: {
                        valueFn: function() {
                            return d.getBuyerConfig("buyerId")
                        }
                    },
                    initUrl: {
                        valueFn: function() {
                            return d.getGlobalConfig("deliveryFee") && d.getGlobalConfig("deliveryFee").dataUrl
                        }
                    },
                    initData: {
                        valueFn: function() {
                            return d.getGlobalConfig("deliveryFee")
                        }
                    },
                    renderId: {},
                    changeAnyInfo: {}
                }
            })
        }),
        KISSY.add("item-detail/localstock/index", ["node", "base", "io", "../config/"], function(e, t) {
            var n = t("node"),
                i = t("base"),
                o = t("io"),
                a = n.all,
                r = t("../config/"),
                s = a("body"),
                c = i.extend({
                    init: function() {
                        var e = this;
                        if (!r.hasChannelStock()) {
                            s.on("delivery:changed", function(t) {
                                e.request(t.deliveryId)
                            });
                            var t = r.getGlobalConfig("areaStock");
                            e.update(t)
                        }
                    },
                    update: function(t) {
                        if (t && !e.isEmptyObject(t)) {
                            if (t.sku) {
                                var n = 0;
                                e.each(t.sku, function(e) {
                                        e.stock = e.sellableQuantity,
                                            e.oversold = 0 === e.sellableQuantity && 0 !== e.holdQuantity,
                                            n += e.stock
                                    }),
                                    t.stock = n
                            } else {
                                var i = t.nosku;
                                t.stock = i.sellableQuantity,
                                    t.oversold = 0 === i.sellableQuantity && 0 !== i.holdQuantity
                            }
                            s.fire("sku:set", {
                                localStock: t
                            })
                        }
                    },
                    request: function(e) {
                        var t = this,
                            n = r.getSkuConfig("areaLimit");
                        n && e && new o({
                            url: n + "&areaId=" + e,
                            dataType: "jsonp",
                            jsonpCallback: "jsonp_arealimit",
                            success: function(e) {
                                e && e.data && t.update(e.data.areaStock)
                            }
                        })
                    }
                });
            return new c
        }),
        KISSY.add("item-detail/core/index", ["log", "node", "../promotion/", "../logistic/", "../localstock/", "../config/"], function(e, t) {
            function n() {
                o();
                try {
                    s.info("Init dynamic stock"),
                        a()
                } catch (e) {
                    s.warn("Dynamic stock execution failed: %s", e.message)
                }
                try {
                    s.info("Init postage fee");
                    var t = new d;
                    t.init()
                } catch (e) {
                    s.warn("Postage fee execution failed: %s", e.message)
                }
                try {
                    s.info("Init stock info"),
                        u.init()
                } catch (e) {
                    s.warn("Stock info execution failed: %s", e.message)
                }
                if (!f.isMS && !f.isPM)
                    try {
                        l.init()
                    } catch (e) {
                        s.warn("Promotion init failed: %s", e.message)
                    }
                p.fire("core:ready")
            }

            function i() {
                p.fire("stock:ready"),
                    p.fire("core:error")
            }

            function o() {
                var e = f.getDefPrice();
                e && p.fire("price:update", {
                    id: "origin",
                    price: e
                })
            }

            function a() {
                p.fire("stock:ready")
            }

            function r() {
                p.fire("resource:sib", {
                    success: n,
                    error: i
                })
            }
            var s = t("log").getLogger("core"),
                c = t("node").all,
                l = t("../promotion/"),
                d = t("../logistic/"),
                u = t("../localstock/"),
                f = t("../config/"),
                p = c("body");
            return {
                init: r
            }
        }),
        KISSY.add("item-detail/sizepicker/index", ["dom", "event", "node", "../login/", "../domain/", "../config/"], function(e, t) {
            function n() {
                var e = i.get(".J_TMySizeProp"),
                    t = i.get("#J_TMySize"),
                    n = null,
                    l = s.isDaily ? "//size.daily.taobao.net/mini/mini.htm" : "//size.taobao.com/mini/mini.htm",
                    d = '<div id="J_SizeIframeWrap" class="tb-size-picker-wrap" ><a href="#" class="tb-close-btn">X</a><iframe width="350" height="300" frameborder="0" scrolling="no" src="' + l + "?stdCatId=" + i.attr(t, "data-value-rt") + "&leafCatId=" + i.attr(t, "data-value") + "&catType=" + i.attr(t, "data-value-type") + "&templateId=" + i.attr(t, "data-template-id") + "&auctionId=" + g_config.itemId + '"></iframe></div>';
                if (e) {
                    var u = i.get(".J_Prop");
                    e !== u && i.insertBefore(e, u),
                        o.on(t, c, function(e) {
                            r.degrade();
                            var t = i.get(".tb-meta"),
                                s = i.offset(t).left,
                                l = i.offset(t).top;
                            a(function() {
                                i.get("#J_SizeIframeWrap") || (n = i.create(d),
                                    i.append(n, "body"),
                                    i.css(n, {
                                        left: s,
                                        top: l,
                                        width: 330,
                                        height: 265
                                    }),
                                    i.show(n),
                                    o.on("#J_SizeIframeWrap .tb-close-btn", c, function(e) {
                                        e.halt(),
                                            i.remove(n),
                                            o.remove("#J_TSizeFrame *")
                                    }))
                            })
                        })
                }
            }
            var i = t("dom"),
                o = t("event"),
                a = (t("node").all,
                    t("../login/")),
                r = t("../domain/"),
                s = t("../config/"),
                c = "click";
            return {
                init: n
            }
        }),
        KISSY.add("item-detail/counter/index", ["log", "../config/", "node", "io"], function(e, t) {
            function n(e, t) {
                return e > Math.pow(10, t) - 1 ? e.toString().substr(0, t - 2) + "..." : e
            }
            var i = t("log").getLogger("counter"),
                o = t("../config/"),
                a = t("node").all,
                r = t("io"),
                s = a("body"),
                c = o.getItemId(),
                l = o.getGlobalConfig("counterApi"),
                d = o.getGlobalConfig("rateCounterApi"),
                u = function() {};
            return u.prototype.init = function() {
                    var t = this;
                    l && r.jsonp(l, function(n) {
                            e.isPlainObject(n) ? t.setFavCount(n) : i.warn("Expect fav data is object")
                        }),
                        d ? r.jsonp(d, function(e) {
                            t.setRateCount(e)
                        }) : (a(".J_ReviewsCount").hide(),
                            a(".tb-rate-counter").hide()),
                        s.fire("resource:sib", {
                            success: function(e) {
                                e && e.sib && t.setSellCount(e.sib.soldQuantity)
                            }
                        })
                },
                u.prototype.setCount = function(e, t) {
                    var n = a("#" + e);
                    t ? n.html(t) : n.addClass("tb-zero").html("0")
                },
                u.prototype.setFavCount = function(e) {
                    var t = a("#J_Social"),
                        i = a(".J_FavCount", t);
                    try {
                        var o = parseInt(e["ICCP_1_" + c], 10),
                            r = n(o, 5);
                        o % 100 === 0 && (r = o + "+"),
                            o > 0 && o < 1e6 && i.html(" (" + r + "\u4eba\u6c14)")
                    } catch (s) {}
                },
                u.prototype.setRateCount = function(e) {
                    var t = this,
                        n = e.count;
                    t.setCount("J_RateCounter", n),
                        a(".J_ReviewsCount").text(n)
                },
                u.prototype.setSellCount = function(e) {
                    var t = this,
                        n = e.soldTotalCount,
                        i = e.confirmGoodsCount,
                        o = a("#J_SellCounter");
                    o.length && (null !== n && o.parent().attr({
                            title: (null !== n ? "30\u5929\u5185\u5df2\u552e\u51fa" + n + "\u4ef6" : "") + (null !== i ? "\uff0c\u5176\u4e2d\u4ea4\u6613\u6210\u529f" + i + "\u4ef6" : "")
                        }),
                        null === i ? a(".tb-sell-counter").hide() : t.setCount("J_SellCounter", i));
                    var r = a(".J_TDealCount", "#J_TabBar");
                    r.length && (null === n ? r.hide() : r.text(n))
                },
                new u
        }),
        KISSY.add("item-detail/ms/index", ["node", "../config/", "log"], function(e, t) {
            var n = t("node"),
                i = n.all,
                o = i("body"),
                a = t("../config/"),
                r = t("log").getLogger("ms"),
                s = {
                    init: function() {
                        e.use("seckill", {
                            success: function(e, t) {
                                try {
                                    o.fire("price:update", {
                                        id: "origin",
                                        style: "del",
                                        lock: !0
                                    });
                                    var n = {};
                                    o.fire("buy:params", {
                                        params: function() {
                                            return n
                                        }
                                    });
                                    var s = i(".tb-ms-price .tb-rmb-num");
                                    s.length && o.on("sku:found sku:changed", function(e) {
                                            var t = e.sku;
                                            t.tkaPrice && s.html(t.tkaPrice.toFixed(2))
                                        }),
                                        i(".tb-meta").after('<div class="tb-logistic tb-ms-logistic tb-clearfix"><span class="tb-name tb-property-type">\u914d\u9001</span><div class="tb-logistic-info">\u5356\u5bb6\u627f\u62c5\u8fd0\u8d39</div></div>'),
                                        t.init({
                                            container: "#J_SecKill",
                                            skuEl: "#J_isku",
                                            params: {
                                                status: a.getItemConfig("status"),
                                                dbst: a.getItemConfig("dbst"),
                                                lgin: a.getBuyerConfig("lgin"),
                                                token: a.getToken(),
                                                now: a.getNow(),
                                                isSKU: a.hasSku(),
                                                stock: a.getStockMap("stock"),
                                                snapupConfig: a.getMSConfig(),
                                                autoRefresh: a.getToggleConfig("msRefresh")
                                            },
                                            getSkuId: function() {
                                                return a.getSkuId()
                                            },
                                            getAmount: function() {
                                                return a.getAmount()
                                            },
                                            submit: function(e) {
                                                o.fire("sku:validate", {
                                                    stock: !0,
                                                    success: function() {
                                                        n = {
                                                                answer: e.answer,
                                                                secKillEncryptStr: e.sign
                                                            },
                                                            n[e.extra.name] = e.extra.value,
                                                            o.fire("buy:submit")
                                                    }
                                                })
                                            }
                                        })
                                } catch (c) {
                                    r.warn("Init failed: %s", c.message)
                                }
                            },
                            error: function(e) {
                                r.warn("Component load failed: %s", e.message)
                            }
                        })
                    }
                };
            a.isMS && o.fire("resource:sib", {
                success: function() {
                    s.init()
                }
            })
        }),
        KISSY.add("item-detail/taoqianggou/index", ["node", "../config/"], function(e, t) {
            var n = t("node"),
                i = n.all,
                o = i("body"),
                a = t("../config/");
            o.fire("resource:sib", {
                success: function() {
                    var e = a.getPromoInfo("taoQiangGouAtmosphere");
                    if (e) {
                        var t = new Date(e.start),
                            n = t.getMinutes(),
                            r = t.getFullYear() + "\u5e74" + (t.getMonth() + 1) + "\u6708" + t.getDate() + "\u65e5",
                            s = t.getHours() + ":" + (n < 10 ? "0" + n : n),
                            c = '<div class="tb-tqg"><span class="tb-tqg-btn">\u5373\u5c06\u5f00\u59cb...</span>' + r + ' <span class="tb-tqg-time">' + s + "</span> \u5f00\u59cb\u62a2\u8d2d</div>",
                            l = i("#J_TaoQiangGou");
                        l.length && l.html(c),
                            o.fire("buy:button", {
                                hidden: !0
                            }),
                            o.fire("cart:button", {
                                hidden: !0
                            })
                    }
                }
            })
        }),
        KISSY.add("item-detail/qrcode/index", ["node", "ua", "../config/", "overlay"], function(e, t) {
            function n(t, n) {
                var i = r.getItemConfig("buyOnMobile"),
                    o = "6" === a.ie || "7" === a.ie;
                (i || o) && (i && l.fire("buy:button cart:button", {
                        hidden: !0
                    }),
                    c(t).after('<div id="J_Qrcode" class="tb-qrcode-panel"></div>'),
                    e.use("qrcode", function(e, t) {
                        t.init({
                            container: "#J_Qrcode",
                            tip: i ? "\u8be5\u5b9d\u8d1d\u9700\u8981\u626b\u63cf\u4e8c\u7ef4\u7801\u5230\u624b\u673a\u6dd8\u5b9d\u8d2d\u4e70" : "\u60a8\u7684\u6d4f\u89c8\u5668\u7248\u672c\u8fc7\u4f4e\uff0c\u90e8\u5206\u5185\u5bb9\u663e\u793a\u4e0d\u5b8c\u6574\uff0c\u5efa\u8bae\u4f7f\u7528\u624b\u673a\u6dd8\u5b9d\u8d2d\u4e70",
                            tipIcon: i ? "//gtms02.alicdn.com/tps/i2/TB1UXUQKpXXXXaIXVXXAz6UFXXX-16-16.png" : "//gtms01.alicdn.com/tps/i1/TB1DY34KpXXXXbTXpXXAz6UFXXX-16-16.png",
                            url: n
                        })
                    }))
            }

            function i(e, t) {
                c(e).before('<li class="tb-qrcode-tool"><a><span>\u624b\u673a\u8d2d\u4e70</span><img class="icon" src="//img.alicdn.com/tps/TB1_FJkOpXXXXXQXpXXXXXXXXXX-13-13.png" srcset="//img.alicdn.com/tps/TB1_FJkOpXXXXXQXpXXXXXXXXXX-13-13.png 1x, //img.alicdn.com/tps/TB1IIs7OXXXXXcpXVXXXXXXXXXX-26-26.png 2x"/><img class="up trigger" src="//img.alicdn.com/tps/TB17EMWOXXXXXXUaXXXXXXXXXXX-9-5.png" srcset="//img.alicdn.com/tps/TB17EMWOXXXXXXUaXXXXXXXXXXX-9-5.png 1x, //img.alicdn.com/tps/TB1vZwQOXXXXXXVaFXXXXXXXXXX-18-10.png 2x"/><img class="down trigger" src="//img.alicdn.com/tps/TB1TA3ROXXXXXXEapXXXXXXXXXX-9-5.png" srcset="//img.alicdn.com/tps/TB1TA3ROXXXXXXEapXXXXXXXXXX-9-5.png 1x, //img.alicdn.com/tps/TB1duZ8OXXXXXaQXVXXXXXXXXXX-18-10.png 2x"/></a></li>');
                var n = ".tb-qrcode-tool",
                    i = new s.Popup({
                        trigger: n,
                        content: '<img class="image" src="' + t + '" />',
                        toggle: !0,
                        triggerType: "mouse",
                        elCls: "tb-qrcode-popup",
                        align: {
                            node: n,
                            points: ["bl", "tl"]
                        },
                        zIndex: 100000021
                    });
                i.render();
                var o = c(".tb-qrcode-popup");
                o.removeClass("ks-popup-hidden"),
                    i.on("show", function() {
                        o.removeClass("ks-popup-hidden")
                    }),
                    i.on("hide", function() {
                        o.removeClass("ks-popup-hidden")
                    }),
                    i.on("beforeVisibleChange", function() {
                        o.removeClass("ks-popup-hidden")
                    })
            }
            var o = t("node"),
                a = t("ua"),
                r = t("../config/"),
                s = t("overlay"),
                c = o.all,
                l = c("body");
            l.fire("resource:sib", {
                success: function() {
                    var e = r.getGlobalConfig("qrcodeImgUrl");
                    e && (n("#J_isku", e),
                        i(".tb-shop-cart", e))
                }
            })
        }),
        KISSY.add("item-detail/tbtoken/index", ["log", "dom", "../config/", "node"], function(e, t) {
            function n() {
                var t = r.getToken(),
                    n = /_tb_token_=[^&].*/i,
                    i = a.query("a.J_TokenSign", document),
                    s = "_tb_token_=" + t;
                o.info("Set fav token value: %s", t),
                    e.each(i, function(e) {
                        var t = e.href;
                        n.test(t) ? e.href = t.replace(n, s) : e.href += (t.lastIndexOf("&") !== -1 ? "&" : "?") + s
                    })
            }

            function i() {
                var e = r.getToken();
                o.info("Init token value: %s", e),
                    a.get("#J_TokenField") && (a.get("#J_TokenField").value = e),
                    a.get("#J_frmTokenField") && (a.get("#J_frmTokenField").value = e);
                var t = a.get(".collection-item");
                t && (t.href += "&_tb_token_=" + e);
                for (var n = [".xshop_sc", ".shop-collect", ".J_TDialogTrigger"], i = 0; i < n.length; i++)
                    if (t = a.query(n[i]))
                        for (var s = 0; s < t.length; s++) {
                            var c = t[s];
                            c.href = c.href.replace("_tb_token_", ""),
                                c.href = c.href.replace("_tb_token_", ""),
                                c.href += "&_tb_token_=" + e
                        }
            }
            var o = t("log").getLogger("tbtoken"),
                a = t("dom"),
                r = t("../config/"),
                s = t("node").all,
                c = s("body");
            return c.on("user:info:viewer", i), {
                setFavToken: n
            }
        }),
        KISSY.add("item-detail/userinfo/index", ["log", "node", "../config/"], function(e, t) {
            function n() {
                var t = a.getBuyerConfig(),
                    n = a.getGlobalConfig("viewer"),
                    i = a.getGlobalConfig("cdn");
                i && n && (e.mix(t, n),
                    o.fire("user:info:viewer", n))
            }
            var i = (t("log").getLogger("userinfo"),
                    t("node").all),
                o = i("body"),
                a = t("../config/");
            o.fire("resource:sib", {
                success: n
            })
        }),
        KISSY.add("item-detail/multiterms/templates/multiterms-xtpl", function(e, t, n, i) {
            return function(e, t, n) {
                var o, a = "",
                    r = this.config,
                    s = this,
                    c = r.utils;
                "undefined" != typeof i && i.kissy && (o = i);
                var l = c.runBlockCommand,
                    d = c.renderOutput,
                    u = c.getProperty,
                    f = (c.runInlineCommand,
                        c.getPropertyOrRunCommand);
                a += '<dl class="tb-clearfix" id="J_TBMultiTerms">\n  <dt class="tb-property-type">\u82b1\u5457\u5206\u671f</dt>\n  <dd>\n    ';
                var p = {},
                    g = [],
                    m = u(s, e, "this.login", 0, 4);
                m = !m,
                    g.push(m),
                    p.params = g,
                    p.fn = function(e) {
                        var t = "";
                        t += '\n    <ul data-property="\u5206\u671f\u8d2d" class="J_TBMultiTermsDesc tb-clearfix">\n      <li>\n        <a id="J_TbMultitermsLogin" class="tb-multiterms-link"\n          href="javascript:void(0);"\n          target="_blank">\u767b\u5f55</a>\u540e\u786e\u8ba4\u662f\u5426\u4eab\u6709\u8be5\u670d\u52a1<a id="J_TbMultitermLink" class="tb-multiterms-link" href="';
                        var n = f(s, e, {}, "installmentLoginLink", 0, 9);
                        return t += d(n, !0),
                            t += '" target="_blank" style="margin-left: 10px;">\u4ec0\u4e48\u662f\u5206\u671f\u8d2d\uff1f</a>\n      </li>\n    </ul>\n    '
                    },
                    p.inverse = function(e) {
                        var t = "";
                        t += "\n      ",
                            t += "\n      ";
                        var n = {},
                            i = [],
                            o = u(s, e, "this.skuItemPurchase", 0, 14);
                        return o = !o,
                            i.push(o),
                            n.params = i,
                            n.fn = function(e) {
                                var t = "";
                                t += '\n      <ul data-property="\u5206\u671f\u8d2d" class="J_TBMultiTermsDesc tb-clearfix">\n          <li>';
                                var n = u(s, e, "this.installmentTip", 0, 16);
                                t += d(n, !1),
                                    t += ' <a class="tb-multiterms-link" href="';
                                var i = u(s, e, "this.installmentLink", 0, 16);
                                return t += d(i, !0),
                                    t += '" target="_blank" style="margin-left: 10px;">\u8be6\u60c5</a></li>\n      </ul>\n      '
                            },
                            n.inverse = function(e) {
                                var t = "";
                                t += "\n      ";
                                var n = {},
                                    i = [],
                                    o = u(s, e, "this.enable", 0, 19);
                                return o = !o,
                                    i.push(o),
                                    n.params = i,
                                    n.fn = function(e) {
                                        var t = "";
                                        return t += '\n      <ul data-property="\u5206\u671f\u8d2d" class="J_TBMultiTermsDesc tb-clearfix">\n          <li>\u5206\u671f\u8d2d\u6682\u4e0d\u53ef\u7528 <a id="J_TbMultitermLinkUnavailable" class="tb-multiterms-link" href="//service.taobao.com/support/knowledge-6651933.htm" target="_blank" style="margin-left: 10px;">\u8be6\u60c5</a></li>\n      </ul>\n      '
                                    },
                                    t += l(s, e, n, "if", 19),
                                    t += "\n      "
                            },
                            t += l(s, e, n, "if", 14),
                            t += "\n    "
                    },
                    a += l(s, e, p, "if", 4),
                    a += "\n    ",
                    a += "\n    ";
                var h = {},
                    v = [],
                    b = u(s, e, "this.skuItemPurchase", 0, 27);
                return v.push(b),
                    h.params = v,
                    h.fn = function(e) {
                        var t = "";
                        t += '\n    <ul class="tb-clearfix J_TBMultiTerms">\n      ',
                            t += "\n      ";
                        var n = {},
                            i = [],
                            o = u(s, e, "this.login", 0, 30);
                        return o = !o,
                            i.push(o),
                            n.params = i,
                            n.fn = function(e) {
                                var t = "";
                                t += "\n      ";
                                var n = {},
                                    i = [],
                                    o = u(s, e, "this.current", 0, 31);
                                return i.push(o),
                                    n.params = i,
                                    n.fn = function(e) {
                                        var t = "";
                                        t += "\n      <li data-installment-num=";
                                        var n = u(s, e, "this.stepNum", 0, 32);
                                        t += d(n, !0),
                                            t += " data-installment-ratio=";
                                        var i = u(s, e, "this.ratio", 0, 32);
                                        t += d(i, !0),
                                            t += ' id="J_TBMultiTermsStep';
                                        var o = u(s, e, "this.xindex", 0, 32);
                                        t += d(o, !0),
                                            t += '" class="tb-multiterms-step tb-multiterms-step-disabled">\n        \uffe5';
                                        var a = u(s, e, "this.price", 0, 33);
                                        t += d(a, !0),
                                            t += "x";
                                        var r = u(s, e, "this.step", 0, 33);
                                        t += d(r, !0),
                                            t += "<br>(";
                                        var c = u(s, e, "this.poundage", 0, 33);
                                        return t += d(c, !0),
                                            t += ")\n      </li>\n      "
                                    },
                                    t += l(s, e, n, "each", 31),
                                    t += "\n      "
                            },
                            n.inverse = function(e) {
                                var t = "";
                                t += "\n      ",
                                    t += "\n      ";
                                var n = {},
                                    i = [],
                                    o = u(s, e, "this.current", 0, 38);
                                return i.push(o),
                                    n.params = i,
                                    n.fn = function(e) {
                                        var t = "";
                                        t += "\n      <li data-installment-num=";
                                        var n = u(s, e, "this.stepNum", 0, 39);
                                        t += d(n, !0),
                                            t += " data-installment-ratio=";
                                        var i = u(s, e, "this.ratio", 0, 39);
                                        t += d(i, !0),
                                            t += ' id="J_TBMultiTermsStep';
                                        var o = u(s, e, "this.xindex", 0, 39);
                                        t += d(o, !0),
                                            t += '" class="tb-multiterms-step ',
                                            t += "";
                                        var a = {},
                                            r = [],
                                            c = u(s, e, "enable", 1, 39);
                                        r.push(c),
                                            a.params = r,
                                            a.fn = function(e) {
                                                var t = "";
                                                return t += "tb-multiterms-step-enabled"
                                            },
                                            a.inverse = function(e) {
                                                var t = "";
                                                return t += "tb-multiterms-step-disabled"
                                            },
                                            t += l(s, e, a, "if", 39),
                                            t += '">\n        \uffe5';
                                        var f = u(s, e, "this.price", 0, 40);
                                        t += d(f, !0),
                                            t += "x";
                                        var p = u(s, e, "this.step", 0, 40);
                                        t += d(p, !0),
                                            t += "<br>(";
                                        var g = u(s, e, "this.poundage", 0, 40);
                                        return t += d(g, !0),
                                            t += ")\n      </li>\n      "
                                    },
                                    t += l(s, e, n, "each", 38),
                                    t += "\n      "
                            },
                            t += l(s, e, n, "if", 30),
                            t += "\n    </ul>\n    "
                    },
                    a += l(s, e, h, "if", 27),
                    a += "\n  </dd>\n</dl>\n"
            }
        }),
        KISSY.add("item-detail/multiterms/index", ["xtemplate/runtime", "node", "./templates/multiterms-xtpl", "../login/", "../gl/", "../config/"], function(e, t) {
            var n = t("xtemplate/runtime"),
                i = t("node").all,
                o = i("body"),
                a = t("./templates/multiterms-xtpl"),
                r = t("../login/"),
                s = t("../gl/"),
                c = t("../config/");
            return {
                init: function() {
                    var t = this;
                    o.fire("resource:sib", {
                        success: function() {
                            var n = c.getGlobalConfig("fqg");
                            n && (t.multiterms = n,
                                e.mix(t.multiterms, {
                                    login: TB.Global.isLogin(),
                                    current: t.multiterms.skuItemPurchase ? t.multiterms.skuItemPurchase.def : []
                                }),
                                t.initMultiterm())
                        }
                    })
                },
                initMultiterm: function() {
                    var e = this;
                    i("#J_TBMultiTerms").length > 0 && i("#J_TBMultiTerms").remove(),
                        i("#J_juValid").before(new n(a).render(e.multiterms)),
                        e.bindEvents()
                },
                bindEvents: function() {
                    var e = this,
                        t = i(".tb-multiterms-step-enabled");
                    i("#J_TbMultitermsLogin").on("click", function() {
                            r(function() {
                                location.reload()
                            })
                        }),
                        i("#J_TbMultitermLink").on("click", function() {
                            s("1302")
                        }),
                        i("#J_TbMultitermLinkUnavailable").on("click", function() {
                            s("1303")
                        }),
                        t.on("click", function(n) {
                            var a = i(n.currentTarget);
                            a.hasClass("tb-multiterms-step-active") ? e.reset() : (t.removeClass("tb-multiterms-step-active"),
                                a.addClass("tb-multiterms-step-active"),
                                o.fire("buy:params cart:params", {
                                    params: function() {
                                        return {
                                            installmentPay: !0,
                                            installmentNum: a.attr("data-installment-num"),
                                            installmentRate: a.attr("data-installment-ratio")
                                        }
                                    }
                                }),
                                o.fire("buy:button", {
                                    content: "\u5206\u671f\u8d2d\u4e70"
                                }))
                        }),
                        o.on("sku:found sku:changed sku:lost", function() {
                            e.reset(),
                                e.updateMultiterms()
                        }),
                        o.on("quantity:changed", function() {
                            e.updateMultiterms()
                        })
                },
                reset: function() {
                    i(".tb-multiterms-step-enabled").removeClass("tb-multiterms-step-active"),
                        o.fire("buy:params cart:params", {
                            params: function() {
                                return {
                                    installmentPay: !1,
                                    installmentNum: null,
                                    installmentRate: null
                                }
                            }
                        }),
                        o.fire("buy:button", {
                            content: "\u7acb\u5373\u8d2d\u4e70"
                        })
                },
                updateMultiterms: function() {
                    var e = c.getSkuId() || "def",
                        t = c.getAmount();
                    if (this.multiterms.skuItemPurchase)
                        for (var n = this.multiterms.skuItemPurchase[e] || this.multiterms.skuItemPurchase.def, o = 0, a = n.length; o < a; o++) {
                            var r = n[o],
                                s = (r.price * t).toFixed(2);
                            i("#J_TBMultiTermsStep" + o).html("\uffe5" + s + "x" + r.step + "<br>(" + r.poundage + ")")
                        }
                }
            }
        }),
        KISSY.add("item-detail/thumb/index", ["log", "../config/", "imagezoom", "dom", "event", "node"], function(e, t) {
            var n, i, o, a, r, s, c, l = t("log").getLogger("thumb"),
                d = t("../config/"),
                u = t("imagezoom"),
                f = t("dom"),
                p = t("event"),
                g = t("node").all,
                m = g("body"),
                h = m,
                v = "click",
                b = "mouseenter",
                k = "mouseleave",
                y = "touchstart",
                w = f.get("#J_ImgBooth"),
                X = f.get("#J_UlThumb"),
                S = f.get(".tb-booth"),
                _ = [],
                I = [],
                C = [],
                T = 700,
                x = 0,
                J = !d.isTouch,
                P = "tb-selected",
                L = "hidden",
                B = {
                    init: function() {
                        if (n = this,
                            w && X) {
                            i = f.query("li", X),
                                a = f.get("#J_ZoomIcon"),
                                n.bindEvents();
                            var t, o = g(i[0]),
                                r = i.length;
                            if (o.hasClass("tb-video-thumb"))
                                for (t = 1; t < r; t++)
                                    g(i[t]).attr("data-index", t - 1);
                            else
                                for (t = 0; t < r; t++)
                                    g(i[t]).attr("data-index", t);
                            6 === e.UA.ie && n.resizeHead();
                            try {
                                n.preloadImgs()
                            } catch (s) {
                                l.warn("Preload images error")
                            }
                        }
                    },
                    preloadImgs: function() {
                        c = f.create('<div style="width:0;height:0;overflow:hidden;">'),
                            T = parseInt(w.getAttribute("data-hasZoom"), 10),
                            m.append(c);
                        var t = w.getAttribute("data-size") || "400x400";
                        e.each(f.query("img", X), function(e, n) {
                                var i = e.src,
                                    o = i.replace(/_\d0x\d0\.jpg(_\.webp)?$/g, "");
                                I[n] = {
                                        thumb: e,
                                        bigSrc: o
                                    },
                                    C[n] = i.replace(/_\d0x\d0/g, "_" + t).replace(/(_\.webp)?$/g, "")
                            }),
                            n.initZoom(0)
                    },
                    initImageZoom: function(e) {
                        if (!r) {
                            var t = 400,
                                n = {
                                    imageNode: w,
                                    align: {
                                        node: w,
                                        points: ["tr", "tl"],
                                        offset: [10, -1]
                                    },
                                    bigImageSrc: e.src,
                                    bigImageWidth: e.width,
                                    bigImageHeight: e.height,
                                    width: t,
                                    height: t
                                };
                            r = new u(n)
                        }
                    },
                    initZoom: function(e) {
                        return d.getToggleConfig().noThumb ? void l.warn("Closed by toggle") : void(J && n.loadZoomImage(e, function(e) {
                            var t = _[e];
                            n.initImageZoom(t),
                                n.setZoomIcon(e)
                        }))
                    },
                    loadZoomImage: function(e, t) {
                        if (_[e])
                            t && t(e);
                        else {
                            var n = I[e],
                                i = new Image;
                            p.on(i, "load", function() {
                                    _[e] = i,
                                        i.width >= T && (n.hasZoom = !0),
                                        t && t(e)
                                }),
                                i.src = n.bigSrc,
                                c.appendChild(i)
                        }
                    },
                    setZoomIcon: function(e) {
                        I[e] && I[e].hasZoom && x === e ? (n.setZoom(!0),
                            n.showZoomIcon()) : (n.setZoom(!1),
                            n.hiddenZoomIcon())
                    },
                    setZoom: function(e) {
                        r && r.set("hasZoom", e)
                    },
                    showZoomIcon: function() {
                        f.removeClass(a, L)
                    },
                    hiddenZoomIcon: function() {
                        f.addClass(a, L)
                    },
                    bindEvents: function() {
                        p.on(X, v, function(e) {
                                e.preventDefault()
                            }),
                            p.on(i, y, function(e) {
                                var t = e.target;
                                n.switchTo(t)
                            }),
                            p.on(i, b, function(e) {
                                s && s.cancel();
                                var t = e.target;
                                n.switchTo(t)
                            }),
                            p.on(S, b, function() {
                                I[x] && I[x].hasZoom && n.showImageZoom(x)
                            }),
                            p.on(S, k, function() {
                                n.setZoomIcon(x)
                            }),
                            h.on("thumb:show", function(e) {
                                w && X && (w.src !== e.src && (f.removeClass(i, P),
                                        w.src = e.src,
                                        n.setZoom(!1),
                                        n.hiddenZoomIcon(),
                                        x = null),
                                    h.fire("thumb:switch"))
                            })
                    },
                    switchTo: function(t) {
                        if (t) {
                            "LI" !== t.tagName && (t = f.parent(t, "LI"));
                            var a = e.indexOf(t, i);
                            x = a,
                                f.removeClass(o || i[0], P),
                                t = i[a],
                                f.removeClass(o, P),
                                f.addClass(t, P),
                                o = t;
                            var r = C[a];
                            w.src !== r && (w.src = r,
                                    n.initZoom(a)),
                                h.fire("thumb:switch", {
                                    index: a
                                })
                        }
                    },
                    showImageZoom: function(e) {
                        if (x === e) {
                            n.hiddenZoomIcon();
                            var t = _[e],
                                i = C[e],
                                o = I[e].bigSrc;
                            r && o && (r.set("bigImageSrc", o),
                                r.set("imageSrc", i),
                                r.set("bigImageWidth", t.width),
                                r.set("bigImageHeight", t.height),
                                h.fire("thumb:zoom", {
                                    index: e,
                                    width: t.width
                                }))
                        }
                    },
                    refreshImageZoom: function() {
                        r && r.refreshRegion()
                    },
                    resizeHead: function() {
                        var t = null;
                        (t = e.get("#hd")) && t.scrollHeight > 250 && f.css(t, {
                            height: "250px",
                            overflow: "hidden"
                        })
                    }
                };
            B.init()
        }),
        KISSY.add("item-detail/contracticons/index", ["node", "log", "../config/"], function(e, t) {
            function n(t, n) {
                var o = i("#J_tbExtra"),
                    a = "<dl><dt>" + n + "</dt><dd>";
                t && t.length && (e.each(t, function(e) {
                        var t = "";
                        e.icons && e.icons.length && (t = e.icons[1] ? '<img src="' + e.icons[0] + '" srcset="' + e.icons[1] + ' 2x" >' : '<img src="' + e.icons[0] + '">'),
                            a += "<a" + (1 === e.linkType ? ' class="J_Cont"' : "") + (e.desc ? ' title="' + e.desc + '"' : "") + ' href="' + (e.url || "#") + '" target="_blank" >' + t + e.title + "</a>"
                    }),
                    a += "</dd></dl>",
                    o.prepend(a))
            }
            var i = t("node").all,
                o = t("log").getLogger("contracticons"),
                a = t("../config/"),
                r = i("body");
            r.fire("resource:sib", {
                success: function() {
                    try {
                        var e = a.getGlobalConfig("tradeContract");
                        e && (n(e.pay, "\u652f\u4ed8"),
                            n(e.service, "\u627f\u8bfa"))
                    } catch (t) {
                        o.warn("Render contract icons failed: %s", t.message)
                    }
                }
            })
        }),
        KISSY.add("item-detail/video/index", ["node", "ua", "../config/"], function(e, t) {
            var n = t("node").all,
                i = t("ua"),
                o = n("body"),
                a = t("../config/"),
                r = function() {
                    i.ie && i.ie < 9 || this.init()
                };
            r.prototype.init = function() {
                    var e = this,
                        t = Hub.config.get("video");
                    t && (e.$booth = n(".tb-booth"),
                        e.$thumb = n("#J_UlThumb"),
                        e.render({
                            picUrl: t.picUrl.replace(/310x310/gi, "400x400"),
                            domain: a.isDaily ? "cloud.video.daily.taobao.net" : "cloud.video.taobao.com",
                            ownerId: t.videoOwnerId,
                            videoId: t.videoId,
                            autoplay: t.autoplay
                        }),
                        e.bind())
                },
                r.prototype.render = function(t) {
                    var i = this,
                        o = i.$booth,
                        a = i.$thumb,
                        r = ['<li id="J_VideoThumb" class="tb-video-thumb">', '<div class="tb-pic tb-s50">', '<a href="javascript:;">', '<img src="{picUrl}">', "</a>", "</div>", '<span class="tb-video-logo tb-iconfont">&#61465;</span>', "</li>"].join(""),
                        s = ['<div class="tb-video" style="background: url({picUrl}) center center no-repeat">', "</div>"].join("");
                    i.$imageThumb = n("li", a),
                        a.prepend(e.substitute(r, t)),
                        i.$videoThumb = n("#J_VideoThumb"),
                        o.append(e.substitute(s, t));
                    var c = {
                        container: ".tb-video",
                        from: "detail",
                        url: "//" + t.domain + "/play/u/" + t.ownerId + "/p/" + t.autoplay + "/e/6/t/1/" + t.videoId + ".mp4",
                        videoId: t.videoId,
                        autoplay: t.autoplay,
                        poster: t.picUrl,
                        muted: !0,
                        controls: !0,
                        volumeControls: !0
                    };
                    location.host.indexOf("pre-item.taobao.com") !== -1 && (c.mtopConfig = {
                            subDomain: "wapa"
                        }),
                        new Videox(c)
                },
                r.prototype.bind = function() {
                    var e = this,
                        t = e.$booth,
                        n = e.$imageThumb,
                        i = e.$videoThumb;
                    i.on("mouseenter", function() {
                            i.addClass("tb-selected"),
                                n.removeClass("tb-selected"),
                                t.replaceClass("tb-pic-mode", "tb-video-mode")
                        }),
                        o.on("thumb:switch", function() {
                            i.removeClass("tb-selected"),
                                t.replaceClass("tb-video-mode", "tb-pic-mode")
                        }),
                        i.fire("mouseenter")
                },
                new r
        }),
        KISSY.add("item-detail/insurance/index", ["node", "io", "dom"], function(e, t) {
            var n, i, o, a, r = t("node").all,
                s = r("body"),
                c = t("io"),
                l = t("dom"),
                d = function() {
                    var e, t = Hub.config.get("sku");
                    (e = t.apiInsurance) && !g_config.delayInsurance && new c({
                        type: "get",
                        url: e,
                        success: f,
                        dataType: "jsonp",
                        jsonpCallback: "jsonp_insurance",
                        cache: !0
                    })
                },
                u = function(e) {
                    var t = e ? e.skuId : null;
                    t && a[t] ? l.html(i, a[t]) : l.html(i, o)
                },
                f = function(e) {
                    if (e.success) {
                        a = e.map,
                            o = a.common,
                            n = '<dl class="tb-insurance tb-clearfix"><dt class="tb-property-type">\u670d\u52a1</dt><dd class="tb-insurance-content"></dd></dl>',
                            n = l.create(n),
                            i = l.get(".tb-insurance-content", n),
                            l.html(i, o);
                        var t = r("#J_isku .tb-amount");
                        t.after(n),
                            s.on("sku:selected", function(e) {
                                u(e.sku)
                            }),
                            s.on("sku:unselected", function() {
                                u(null)
                            })
                    }
                };
            d()
        }),
        KISSY.add("item-detail/tags/index", ["dom"], function(e, t) {
            function n(e) {
                if (e) {
                    var t = ['<ul class="tb-item-tags">'];
                    for (var n in e)
                        t.push('<li class="tb-item-tag">'),
                        t.push(e[n]),
                        t.push("</li>");
                    t.push("</ul>"),
                        t = t.join(""),
                        t = i.create(t),
                        i.insertBefore(t, "#J_TEditItem")
                }
            }
            var i = t("dom"),
                o = Hub.config.get("tags");
            o && n(o)
        }),
        KISSY.add("item-detail/discount/coupon-xtpl", function(e, t, n, i) {
            return function(e, t, n) {
                var o, a = "",
                    r = this.config,
                    s = this,
                    c = r.utils;
                "undefined" != typeof i && i.kissy && (o = i);
                var l = c.runBlockCommand,
                    d = c.renderOutput,
                    u = c.getProperty,
                    f = (c.runInlineCommand,
                        c.getPropertyOrRunCommand);
                a += "";
                var p = {},
                    g = [],
                    m = u(s, e, "data", 0, 1);
                return g.push(m),
                    p.params = g,
                    p.fn = function(e) {
                        var t = "";
                        t += '\n<div class="tb-coupon">\n    ';
                        var n = {},
                            i = [],
                            o = u(s, e, "icon1", 0, 3);
                        i.push(o),
                            n.params = i,
                            n.fn = function(e) {
                                var t = "";
                                t += '\n        <img class="tb-coupon-icon" src="';
                                var n = f(s, e, {}, "icon1", 0, 4);
                                t += d(n, !0),
                                    t += '" srcset="';
                                var i = f(s, e, {}, "icon1", 0, 4);
                                t += d(i, !0),
                                    t += " 1x, ";
                                var o = f(s, e, {}, "icon2", 0, 4);
                                return t += d(o, !0),
                                    t += ' 2x"/>\n    '
                            },
                            t += l(s, e, n, "if", 3),
                            t += "\n    ";
                        var a = f(s, e, {}, "title", 0, 6);
                        t += d(a, !0),
                            t += "\n    ";
                        var r = {},
                            c = [],
                            p = u(s, e, "isCoupon", 0, 7);
                        return c.push(p),
                            r.params = c,
                            r.fn = function(e) {
                                var t = "";
                                t += "\n        ";
                                var n = {},
                                    i = [],
                                    o = u(s, e, "type", 0, 8);
                                return i.push("voucher" === o),
                                    n.params = i,
                                    n.fn = function(e) {
                                        var t = "";
                                        t += '\n            <a class="J_voucher" href="#" data-type="';
                                        var n = f(s, e, {}, "type", 0, 9);
                                        t += d(n, !0),
                                            t += '" api="';
                                        var i = f(s, e, {}, "link", 0, 9);
                                        t += d(i, !0),
                                            t += '" data-spm-click="gostr=/tbdetail;locaid=voucher">';
                                        var o = f(s, e, {}, "linkText", 0, 9);
                                        return t += d(o, !0),
                                            t += "</a>\n        "
                                    },
                                    n.inverse = function(e) {
                                        var t = "";
                                        t += '\n            <a class="J_coupon" href="#" data-type="';
                                        var n = f(s, e, {}, "type", 0, 11);
                                        t += d(n, !0),
                                            t += '" data-activityId="';
                                        var i = f(s, e, {}, "activityId", 0, 11);
                                        t += d(i, !0),
                                            t += '" data-spm-click="gostr=/tbdetail;locaid=coupon">';
                                        var o = {},
                                            a = [],
                                            r = u(s, e, "isGot", 0, 11);
                                        return a.push(r),
                                            o.params = a,
                                            o.fn = function(e) {
                                                var t = "";
                                                return t += "\u5df2\u9886\u53d6"
                                            },
                                            o.inverse = function(e) {
                                                var t = "";
                                                return t += "\u9886\u53d6"
                                            },
                                            t += l(s, e, o, "if", 11),
                                            t += "</a>\n        "
                                    },
                                    t += l(s, e, n, "if", 8),
                                    t += "\n    "
                            },
                            r.inverse = function(e) {
                                var t = "";
                                t += "\n        ";
                                var n = {},
                                    i = [],
                                    o = u(s, e, "link", 0, 14),
                                    a = u(s, e, "linkText", 0, 14);
                                return i.push(o && a),
                                    n.params = i,
                                    n.fn = function(e) {
                                        var t = "";
                                        t += '\n            <a href="';
                                        var n = f(s, e, {}, "link", 0, 15);
                                        t += d(n, !0),
                                            t += '">';
                                        var i = f(s, e, {}, "linkText", 0, 15);
                                        return t += d(i, !0),
                                            t += "</a>\n        "
                                    },
                                    t += l(s, e, n, "if", 14),
                                    t += "\n    "
                            },
                            t += l(s, e, r, "if", 7),
                            t += "\n</div>\n"
                    },
                    a += l(s, e, p, "each", 1)
            }
        }),
        KISSY.add("item-detail/discount/popup-xtpl", function(e, t, n, i) {
            return function(e, t, n) {
                var o, a = "",
                    r = this.config,
                    s = this,
                    c = r.utils;
                "undefined" != typeof i && i.kissy && (o = i);
                var l = c.runBlockCommand,
                    d = c.renderOutput,
                    u = c.getProperty,
                    f = (c.runInlineCommand,
                        c.getPropertyOrRunCommand);
                a += '<div>\n    <div class="label ';
                var p = {},
                    g = [],
                    m = u(s, e, "success", 0, 2);
                m = !m,
                    g.push(m),
                    p.params = g,
                    p.fn = function(e) {
                        var t = "";
                        return t += "fail"
                    },
                    a += l(s, e, p, "if", 2),
                    a += '"></div>\n    <div class="content">\n        <p class="title">';
                var h = f(s, e, {}, "msg", 0, 4);
                a += d(h, !0),
                    a += " ";
                var v = {},
                    b = [],
                    k = u(s, e, "success", 0, 4);
                b.push(k),
                    v.params = b,
                    v.fn = function(e) {
                        var t = "";
                        return t += '<a class="link" href="//taoquan.taobao.com/framework/got_bonus.htm?tabIndex=64" target="_blank">\u67e5\u770b></a>'
                    },
                    a += l(s, e, v, "if", 4),
                    a += "</p>\n        ";
                var y = {},
                    w = [],
                    X = u(s, e, "success", 0, 5);
                X = !X,
                    w.push(X),
                    y.params = w,
                    y.fn = function(e) {
                        var t = "";
                        return t += '<a class="link" href="//taoquan.taobao.com/framework/got_bonus.htm?tabIndex=64" target="_blank">\u67e5\u770b\u9886\u53d6\u8bb0\u5f55></a>'
                    },
                    a += l(s, e, y, "if", 5),
                    a += "\n        ";
                var S = {},
                    _ = [],
                    I = u(s, e, "success", 0, 6),
                    C = u(s, e, "useStartTimeShow", 0, 6),
                    T = u(s, e, "useEndTimeShow", 0, 6);
                return _.push(I && C && T),
                    S.params = _,
                    S.fn = function(e) {
                        var t = "";
                        t += '<p class="sub-title">\u4f7f\u7528\u65f6\u95f4: ';
                        var n = f(s, e, {}, "useStartTimeShow", 0, 6);
                        t += d(n, !0),
                            t += " - ";
                        var i = f(s, e, {}, "useEndTimeShow", 0, 6);
                        return t += d(i, !0),
                            t += "</p>"
                    },
                    a += l(s, e, S, "if", 6),
                    a += '\n        <a class="ok">\u786e \u5b9a</a>\n    </div>\n    <div class="close">\xd7</div>\n</div>'
            }
        }),
        KISSY.add("item-detail/discount/voucher", ["io", "overlay", "xtemplate/runtime", "./popup-xtpl", "../login/", "../config/"], function(e, t) {
            function n(e, t) {
                l(function() {
                    u = !0,
                        new a({
                            url: e,
                            data: {
                                bizOrdrId: 2,
                                safeCode: t
                            },
                            dataType: "jsonp",
                            success: function(e) {
                                return u = !1,
                                    e && e.data ? void i({
                                        success: e.data.success,
                                        msg: e.data.title ? e.data.title : e.msg || d,
                                        useStartTimeShow: e.data.useStartTimeShow,
                                        useEndTimeShow: e.data.useEndTimeShow
                                    }) : void i({
                                        success: !1,
                                        msg: d
                                    })
                            },
                            error: function() {
                                u = !1,
                                    i({
                                        success: !1,
                                        msg: d
                                    })
                            }
                        })
                })
            }

            function i(e) {
                var t = new s(c).render(e),
                    n = new r.Popup({
                        prefixCls: "tb-discount-",
                        zIndex: 1e9,
                        mask: !1,
                        content: t,
                        closeable: !0,
                        closeAction: "destroy"
                    });
                n.render(),
                    n.center(),
                    n.show(),
                    n.get("el").delegate("click", ".close, .ok", function() {
                        n.destroy()
                    })
            }
            var o = e.all,
                a = t("io"),
                r = t("overlay"),
                s = t("xtemplate/runtime"),
                c = t("./popup-xtpl"),
                l = t("../login/"),
                d = (t("../config/"),
                    "\u5927\u5bb6\u592a\u70ed\u60c5\uff0c\u8bf7\u7a0d\u540e\u91cd\u8bd5\uff01"),
                u = !1;
            return {
                init: function(t) {
                    var i;
                    e.getScript("//g.alicdn.com/sd/ctl/ctl.js", function() {
                            i = ctl.noConflict(),
                                i.config("PC", {
                                    LogVal: "ua"
                                })
                        }),
                        o(t).on("click", function(e) {
                            e.preventDefault(),
                                o(".tb-discount-popup").length || u || n(o(e.target).attr("api"), i.getUA())
                        })
                }
            }
        }),
        KISSY.add("item-detail/discount/coupon", ["xtemplate/runtime", "./coupon-xtpl", "../login/", "../config/", "./voucher"], function(e, t) {
            function n(t, n) {
                var o = !1;
                e.each(t, function(e) {
                        e.icon && e.icon.length && (e.icon1 = e.icon[0],
                                e.icon2 = e.icon[1]),
                            n && (e.isCoupon = n),
                            "voucher" === e.type && (o = !0)
                    }),
                    r.fire("discount:create", {
                        el: new s(c).render({
                            data: t
                        })
                    }),
                    o && u.init(".J_voucher"),
                    n && i()
            }

            function i() {
                var t = d.getCdnHost() + "/cm/smf/1.27.2/utils/";
                e.getScript(t + "applyCoupon-min.css", {
                        charset: "utf-8"
                    }),
                    e.getScript(t + "applyCouponWidget-min.js", {
                        charset: "utf-8"
                    }),
                    a(".J_coupon").on("click", function(e) {
                        e.preventDefault();
                        var t = a(e.target);
                        o(t.attr("data-type"), t.attr("data-activityId"))
                    })
            }

            function o(t, n) {
                e.use("smf/coupon/apply", function(e, i) {
                    l(function() {
                        new i({
                            applyChannel: 22,
                            cburl: location.protocol + "//" + location.host + "/cross.htm?type=weibo",
                            daily: d.isDaily,
                            showItems: !0,
                            type: t,
                            activityId: n,
                            sellerId: d.getSellerId()
                        })
                    })
                })
            }
            var a = e.all,
                r = a("body"),
                s = t("xtemplate/runtime"),
                c = t("./coupon-xtpl"),
                l = t("../login/"),
                d = t("../config/"),
                u = t("./voucher");
            return {
                init: function() {
                    var e = d.getGlobalConfig("couponActivity");
                    e && (e.coupon && e.coupon.couponList && e.coupon.couponList.length && n(e.coupon.couponList, !0),
                        e.shopProm && n(e.shopProm))
                }
            }
        }),
        KISSY.add("item-detail/discount/goldcoin", ["log", "../config/", "node"], function(e, t) {
            var n = t("log").getLogger("goldcoin"),
                i = t("../config/"),
                o = t("node").all,
                a = o("body");
            return {
                render: function(t) {
                    if (t) {
                        var n = o("<div>" + t + "</div>"),
                            i = n.all(".tb_dashes_box");
                        if (i.length) {
                            var r = i.text(),
                                s = e.trim(r).replace("\u62b5\uffe5", "");
                            t = "\u6dd8\u91d1\u5e01\u53ef\u62b5<strong>" + s + "</strong>\u5143"
                        }
                        if (o(".J_coin").length)
                            return void o(".J_coin").html('<i class="tb-icon-coin"></i>' + t);
                        a.fire("discount:create", {
                            el: '<div class="J_coin"><i class="tb-icon-coin"></i>' + t + "</div>"
                        })
                    }
                },
                init: function() {
                    function e(e) {
                        var n, i = e || null;
                        i && o[i] ? n = o[i] : i ? o[-1] ? n = o[-1] : o[-2] && (n = o[-2]) : o[-1] ? n = o[-1] : o[-5] ? n = o[-5] : o[-2] && (n = o[-2]),
                            t.render(n)
                    }
                    var t = this,
                        o = i.getGlobalConfig("upp");
                    if (!o || "object" != typeof o)
                        return void n.info("No goldcoid data");
                    var r = i.getSkuId();
                    e(r),
                        a.on("sku:selected", function(t) {
                            var n = t.sku.skuId;
                            e(n)
                        }),
                        a.on("sku:unselected", function() {
                            var t = i.getPromoMap();
                            t && t.def && 0 !== t.def.length || e()
                        })
                }
            }
        }),
        KISSY.add("item-detail/discount/index", ["./coupon", "./goldcoin"], function(e, t) {
            function n(e) {
                var t = e.el,
                    n = e.weight,
                    o = e.cls,
                    a = r.all(".tb-other-discount"),
                    s = i(".tb-other-discount-content").length;
                if (a.length) {
                    var c = i('<div class="tb-other-discount-content"></div>');
                    c.append(i(t)),
                        s && c.addClass("tb-other-discount-split"),
                        o && c.addClass(o),
                        n ? a.prepend(c) : a.append(c),
                        r.removeClass("tb-hidden")
                }
            }
            var i = e.all,
                o = i("body"),
                a = t("./coupon");
            o.fire("resource:sib", {
                success: function() {
                    var e = t("./goldcoin");
                    e.init(),
                        a.init()
                }
            });
            var r = i("#J_OtherDiscount");
            o.on("discount:create", function(e) {
                n(e)
            })
        }),
        KISSY.add("item-detail/guideline/index", ["dom", "../gl/", "event", "ua"], function(e, t) {
            function n(e, t) {
                o.removeClass(i, d),
                    o.removeClass(e, u),
                    o.css(t, "display", "none")
            }
            var i, o = t("dom"),
                a = t("../gl/"),
                r = t("event"),
                s = t("ua"),
                c = "click",
                l = "mouseleave",
                d = "tb-payguide-show",
                u = "tb-selected",
                f = {
                    init: function() {
                        e.available("#J_PayGuide", function() {
                            i = o.get("#J_PayGuide");
                            var e, t, f = o.query(".J_Tab", i),
                                p = o.query(".J_Panel", i);
                            r.on(f, c, function(n) {
                                    n.preventDefault(),
                                        e && clearTimeout(e),
                                        t = o.attr(n.currentTarget, "data-index"),
                                        o.hasClass(n.currentTarget, u) || a("12." + (1 * n.currentIndex + 1)),
                                        o.hide(p),
                                        o.show(p[t]),
                                        o.removeClass(f, u),
                                        o.addClass(f[t], u),
                                        o.hasClass(i, d) || o.addClass(i, d),
                                        s.ie < 8 && o.css(i.parentNode, "zoom", 1)
                                }),
                                r.on(i, l, function() {
                                    e && clearTimeout(e),
                                        e = setTimeout(function() {
                                            n(f[t], p[t])
                                        }, 500)
                                })
                        })
                    }
                };
            f.init()
        }),
        KISSY.add("item-detail/sns/index", ["node", "dom", "../gl/", "event"], function(e, t) {
            function n(e) {
                var t = {
                    key: l,
                    isShowFriend: !1,
                    client_id: 2,
                    comment: "\u6211\u86ee\u559c\u6b22\u8fd9\u4e2a\u54e6\uff5e",
                    type: "item",
                    element: e,
                    callback: {
                        success: function() {}
                    }
                };
                window.SNS.ui("btshare", t)
            }

            function i(e) {
                var t = {
                    token: g_config.vdata.viewer.tkn,
                    element: e,
                    type: "item",
                    appId: "1100102",
                    targetKey: l,
                    like: {
                        anim: !1
                    },
                    initialize: {
                        el: e,
                        hoverTip: !1
                    },
                    share: {
                        link: location.href,
                        title: document.title
                    },
                    use: "jsonp",
                    callback: {
                        like: {
                            favored: function() {
                                s("12.39")
                            },
                            succeed: function() {
                                s("12.39")
                            }
                        }
                    }
                };
                window.SNS.ui("favor", t)
            }

            function o(t) {
                if (o.loaded)
                    return t();
                o.loaded = !0;
                var n = "//" + (-1 === location.host.indexOf("daily") ? "assets.alicdn.com" : "g-assets.daily.taobao.net") + "/p/snsdk/core2.js?t=20141212";
                e.getScript(n, t)
            }
            var a = t("node").all,
                r = t("dom"),
                s = t("../gl/"),
                c = t("event"),
                l = g_config.itemId,
                d = {
                    init: function() {
                        e.use("io/xhr-transport-base", function(e, t) {
                                t.supportCORS = !1
                            }),
                            o(function() {
                                var e = r.get(".tb-social-like", "#J_Social");
                                c.on(e, "click", function(e) {
                                        e.preventDefault()
                                    }),
                                    i(e);
                                var t = r.get(".tb-social-share", "#J_Social");
                                c.on(t, "click", function(e) {
                                    e.preventDefault(),
                                        o(function() {
                                            n(t)
                                        })
                                })
                            })
                    }
                };
            if (a(".tb-social-like").length)
                d.init();
            else {
                var u;
                a(".tb-social-share").on("click", function() {
                    u ? u.show() : e.use("tbc/btn-share/1.1.1/", function(e, t) {
                        u = new t({
                                shareBtnTrigger: ".tb-social-share",
                                bindEvent: !1,
                                itemId: l,
                                offset: [0, 10]
                            }),
                            u.show()
                    })
                })
            }
        }),
        KISSY.add("item-detail/header/index", ["log", "node", "../config/", "header"], function(e, t) {
            function n() {
                if (i.info("Init header asserts"),
                    !a.isCustomShopHeader) {
                    new r({
                        renderTo: s,
                        type: a.getShopType(),
                        item: a.getItemConfig(),
                        shop: a.getShopConfig(),
                        seller: a.getSellerConfig()
                    });
                    i.info("Render header")
                }
            }
            var i = t("log").getLogger("header"),
                o = t("node").all,
                a = t("../config/"),
                r = t("header"),
                s = o("#J_Header");
            s.length && n()
        }),
        KISSY.add("item-detail/shopinfo/index", ["../config/"], function(e, t) {
            function n(e, t) {
                var n = window.devicePixelRatio > 1,
                    i = t ? r : a,
                    s = i[e],
                    c = s ? s[n ? 1 : 0] : s;
                return c ? o + c : c
            }
            var i = t("../config/"),
                o = "//gtms01.alicdn.com/tps/i1/",
                a = {
                    red: ["TB1.8JIFVXXXXbSXVXXFHLvIVXX-198-45.png", "TB1xV8HFVXXXXbeaXXXCfnzRXXX-396-90.png"],
                    blue: ["TB1NYpMFVXXXXXsXFXXFHLvIVXX-198-45.png", "TB1pR77FFXXXXXsapXXCfnzRXXX-396-90.png"],
                    cap: ["TB1f2dMFVXXXXcCXpXXFHLvIVXX-198-45.png", "TB1fylOFVXXXXafXXXXCfnzRXXX-396-90.png"],
                    crown: ["TB16WBMFVXXXXcGXpXXFHLvIVXX-198-45.png", "TB1KZRLFVXXXXcuXpXXCfnzRXXX-396-90.png"],
                    "global-seller": ["TB1N5BELpXXXXX3aFXXXXXXXXXX-198-60.png", "TB1D9dKLpXXXXb2aXXXXXXXXXXX-396-120.png"],
                    "global-buyer": ["TB1N5BELpXXXXX3aFXXXXXXXXXX-198-60.png", "TB1D9dKLpXXXXb2aXXXXXXXXXXX-396-120.png"],
                    star: ["TB15Y4KFVXXXXcZXFXXxwHxIVXX-198-60.png", "TB1LXtNFVXXXXavXpXXTnAu0VXX-396-120.png"],
                    agriculture: ["TB1foLuGpXXXXX1XXXXxwHxIVXX-198-60.png", "TB1MXbsGpXXXXaHXpXXTnAu0VXX-396-120.png"],
                    tiaoshi: ["TB1vE80GFXXXXa_aXXXxwHxIVXX-198-60.png", "TB1PvPaGFXXXXXYapXXTnAu0VXX-396-120.png"],
                    jiyoujia: ["TB1sn9mIVXXXXb.aXXXxwHxIVXX-198-60.png", "TB1YrOjIVXXXXcVaXXXTnAu0VXX-396-120.png"],
                    "zhizao-seller": ["TB1AnS2KXXXXXaCXVXXxwHxIVXX-198-60.png", "TB1NxRpJFXXXXa4XFXXTnAu0VXX-396-120.png"],
                    "miaosha-tmall": ["TB1K0V3PXXXXXcOaFXXXXXXXXXX-198-60.png", "TB1SCetPXXXXXbjXFXXXXXXXXXX-396-120.png"],
                    "miaosha-tmall-hk": ["TB1lzqbPXXXXXakaXXXXXXXXXXX-198-60.png", "TB1MYqqPXXXXXbQXFXXXXXXXXXX-396-120.png"]
                },
                r = {
                    "global-seller": ["TB1N5BELpXXXXX3aFXXXXXXXXXX-198-60.png", "TB1D9dKLpXXXXb2aXXXXXXXXXXX-396-120.png"],
                    "global-buyer": ["TB1N5BELpXXXXX3aFXXXXXXXXXX-198-60.png", "TB1D9dKLpXXXXb2aXXXXXXXXXXX-396-120.png"],
                    star: ["TB1We0OFVXXXXXpXpXXxwHxIVXX-198-60.png", "TB1KQhKFVXXXXcmXFXXTnAu0VXX-396-120.png"],
                    gold: ["TB1zIlNFVXXXXXtXpXXxwHxIVXX-198-60.png", "TB1KcJOFVXXXXb5XXXXTnAu0VXX-396-120.png"],
                    agriculture: ["TB1L.b3GXXXXXXxXFXXxwHxIVXX-198-60.png", "TB1VCb1GXXXXXamXFXXTnAu0VXX-396-120.png"],
                    tiaoshi: ["TB1vE80GFXXXXa_aXXXxwHxIVXX-198-60.png", "TB1PvPaGFXXXXXYapXXTnAu0VXX-396-120.png"],
                    jiyoujia: ["TB1_UnJHVXXXXbLXFXXxwHxIVXX-198-60.png", "TB1zt7VHFXXXXblXVXXTnAu0VXX-396-120.png"],
                    "zhizao-seller": ["TB1AnS2KXXXXXaCXVXXxwHxIVXX-198-60.png", "TB1NxRpJFXXXXa4XFXXTnAu0VXX-396-120.png"]
                };
            Hub.add({
                name: "shopinfo",
                listen: {
                    "core:ready": "init"
                },
                instance: {
                    init: function() {
                        function t(e) {
                            return Number(e) < 5 ? "" : "\u5e74\u8001\u5e97"
                        }
                        var o = e.all,
                            a = g_config.idata.seller,
                            r = o(".J_ShopInfoHeader"),
                            s = o("#J_ShopInfo"),
                            c = s.attr("data-creditflag"),
                            l = s.attr("data-rateurl");
                        if (s.length && !i.isCustomShopHeader) {
                            s.addClass("tb-shop-info-gold-border");
                            var d = i.getItemType();
                            if ("tiaoshi" === d || "zhizao" === d ? c = d : a.starSeller || a.globalSeller || a.globalBuyer || a.agricultureSeller || a.zhizaoSeller ? a.zhizaoSeller ? (c = "zhizao-seller",
                                    r.attr("href", "//q.taobao.com"),
                                    s.css("borderColor", "#ffd8d8")) : a.starSeller ? (c = "star",
                                    r.attr("href", "//star.taobao.com/settle.htm"),
                                    s.css("borderColor", "#cdd7f7")) : a.globalSeller ? (c = "global-seller",
                                    r.attr("href", "//www.taobao.com/market/gmall/welcome.php"),
                                    s.css("borderColor", "#ded2ee")) : a.globalBuyer ? (c = "global-buyer",
                                    r.attr("href", "//www.taobao.com/market/gmall/welcome.php"),
                                    s.css("borderColor", "#ded2ee")) : a.agricultureSeller && (c = "agriculture",
                                    r.attr("href", "//www.taobao.com/market/nongye/baozhang.php"),
                                    s.css("borderColor", "#cfdead")) : a.goldSeller ? (c = "gold",
                                    r.attr("href", "//www.taobao.com/go/act/jpmj.php")) : l && r.attr("href", l),
                                i.isMS && d && (c = d,
                                    s.css("borderColor", "#e8e8e8")),
                                a.goldPeriods > 0 && r.append('<span class="tb-gold-periods">\u8fde\u7eed<em class="tb-gold-periods-num">' + a.goldPeriods + "</em>\u671f</span>"),
                                a.goldSeller) {
                                var u = o('<a class="tb-gold-icon" title="\u91d1\u724c\u5356\u5bb6" href="//www.taobao.com/go/act/jpmj.php" target="_blank"></a>');
                                s.append(u)
                            }
                            var f = n(c, a.goldSeller);
                            f ? r.append('<img width="198" src="' + f + '">') : r.css({
                                height: 16,
                                "min-height": 16
                            });
                            var p = Number(g_config.idata.seller.shopAge),
                                g = !0,
                                m = t(p);
                            if (!isNaN(p) && m && g && !i.isMS) {
                                var h = ['<div class="tb-shop-age">', '<a href="{rateUrl}" target="_blank">', '<div class="tb-shop-age-content">', '<i class="tb-shop-age-icon"></i>', '<span class="tb-shop-age-val">{shopAge}</span>', '<span class="tb-shop-age-desc">{desc}</span>', "</div>", "</a>", "</div>"].join(""),
                                    v = e.substitute(h, {
                                        rateUrl: l,
                                        shopAge: p,
                                        desc: m
                                    });
                                r.after(v)
                            }
                            Hub.fire("shopinfo:end")
                        }
                    }
                }
            })
        }),
        KISSY.add("item-detail/currencyPrice/index", ["node", "../config/"], function(e, t) {
            function n(e, t) {
                if (e) {
                    var n = t ? e.def[0] : e.def,
                        i = n.currencyPrice;
                    if (i) {
                        var r = "\u7ea6 " + i.currencyCode + " " + i.currencyPrice,
                            s = o('<li class="tb-detail-price tb-currency-price"><strong class="tb-property-cont">' + r + "</strong></li>"),
                            c = o("#J_PromoPrice"),
                            l = s.one(".tb-property-cont");
                        c.after(s),
                            a.on("sku:selected", function(n) {
                                var i = t ? e[n.flag][0] : e[n.flag],
                                    o = i.currencyPrice;
                                l.html("\u7ea6 " + o.currencyCode + " " + o.currencyPrice)
                            }),
                            a.on("sku:lost", function() {
                                l.html(r)
                            })
                    }
                }
            }
            var i = (t("node"),
                    t("../config/")),
                o = e.all,
                a = o("body");
            a.fire("resource:sib", {
                success: function(e) {
                    var t = i.getPromoMap(),
                        o = i.getGlobalConfig("originalPrice");
                    t && t.def ? n(t, !0) : o && o.def && n(o)
                }
            })
        }),
        KISSY.add("item-detail/cdnurl/index", function(e, t) {
            var n = /img0(\d)\.taobaocdn\.com/gi,
                i = function() {
                    var e = !1;
                    try {
                        WebP.isSupport(function(t) {
                            e = t
                        })
                    } catch (t) {}
                    return e
                }(),
                o = function(e) {
                    return !e.match(/(png|gif)$/gi)
                };
            return {
                rewrite: function(e, t, a) {
                    return (e.match(n) || location.host.indexOf(".daily.") > 0) && (t = t && i && o(e),
                            (a || t) && (e = e.replace(n, "gd$1.alicdn.com")),
                            t && (e += "_.webp")),
                        e
                }
            }
        }),
        KISSY.add("item-detail/desc/content", ["log", "node", "dom", "datalazyload", "../cdnurl/"], function(e, t) {
            var n = t("log").getLogger("desc"),
                i = t("node").all,
                o = i("body"),
                a = "#J_DivItemDesc",
                r = t("dom"),
                s = t("datalazyload"),
                c = t("../cdnurl/"),
                l = 200,
                d = 6e3,
                u = "//img.alicdn.com/tps/i4/T10B2IXb4cXXcHmcPq-85-85.gif";
            return {
                init: function() {
                    var e = this;
                    g_config.idata.item.desc ? (n.warn("Description is sync output"),
                        e.initLazyLoad()) : (n.info("Description is asyn fetch"),
                        e.render(+new Date))
                },
                render: function(e, t) {
                    var o = this,
                        r = i(a),
                        s = window.desc;
                    if ("undefined" == typeof s || !r.length)
                        return +new Date - e > d && !t && (t = !0,
                                n.warn("Item description data timeout")),
                            setTimeout(function() {
                                o.render(e, t)
                            }, l);
                    if (!s)
                        return r.html("\u8be5\u5546\u54c1\u6ca1\u6709\u8be6\u60c5\u63cf\u8ff0");
                    var f, p = g_config,
                        g = p.vdata.sys,
                        m = g.toggle,
                        h = m.p || 1,
                        v = p.descWebP || !1,
                        b = p.newDomain || !1,
                        k = g.q || "",
                        y = p.enable || !0,
                        w = /(<img[^>]*)(src *= *("[^"]*"|'[^']*'))([^>]*>)/gi,
                        X = 0,
                        S = "",
                        _ = function(e) {
                            var t = e.charAt(0);
                            return '"' === t || "'" === t ? e.substr(1, e.length - 2) : e
                        },
                        I = function(e) {
                            return k && ~e.indexOf("taobaocdn") && 2 === e.split(".jpg").length ? e.substring(0, e.length - 1) + k : e
                        };
                    f = s.match(w) ? s.match(w).length : 0,
                        s = s.replace(w, function(e, t, n, i, o) {
                            return X++,
                                h && h > 0 && X / f > h ? "" : !y || X < 5 ? [t, 'src="', c.rewrite(I(_(i)), v, b), '"', o].join("") : S = [t, 'src="', u, '"', ' class="tb-loading-background"', ' data-ks-lazyload="', c.rewrite(I(_(i)), v, b), '"', o].join("")
                        }),
                        r.html(s),
                        o.imgHandle(),
                        o.initLazyLoad(),
                        o.replaceFlash()
                },
                replaceFlash: function() {
                    e.getScript("//g.alicdn.com/kg/tbvideo-replace/0.0.23/index-min.js", function() {
                        window.embedReplace && (window.embedReplace.configure({
                                replaceYouku: !1,
                                videoCfg: {
                                    muted: !0,
                                    volumeControls: !0
                                }
                            }),
                            window.embedReplace.replaceAll())
                    })
                },
                imgHandle: function() {
                    i(a + " img").each(function(e) {
                        e.on("load", function() {
                            var t = e.attr("src");
                            "//g.alicdn.com/s.gif" !== t && e.removeClass("tb-loading-background")
                        })
                    })
                },
                initLazyLoad: function() {
                    n.info("Init desc lazyload");
                    var e = g_config.lazyload,
                        t = r.viewportHeight(),
                        i = Hub.config.get("desc") && Hub.config.get("desc").idsMod ? 80 : 40,
                        a = new s(e, {
                            mod: "manual",
                            diff: {
                                top: -i,
                                bottom: 2 * t
                            }
                        });
                    "#content" !== e && o.on("tabbar:switch", function(e) {
                        var t = parseInt(e.idx, 10);
                        a[t ? "pause" : "resume"]()
                    })
                }
            }
        }),
        KISSY.add("item-detail/desc/segment", ["log", "../gl/", "node", "dom", "event", "../config/"], function(e, t) {
            var n = (t("log").getLogger("desc"),
                    t("../gl/")),
                i = t("node").all,
                o = i("body"),
                a = t("dom"),
                r = t("event"),
                s = t("../config/"),
                c = s.getGlobalConfig("shopId"),
                l = s.getDescConfig(),
                d = s.getItemId(),
                u = function() {
                    var t, s, u = l.idsMod,
                        f = [],
                        p = [],
                        g = 0,
                        m = null,
                        h = !0,
                        v = {},
                        b = {},
                        k = function() {
                            function l(t) {
                                S(t.target);
                                var n = t.target;
                                if ("A" === n.tagName) {
                                    var i = a.html(n),
                                        o = a.offset("#J_TabBar").left;
                                    a.html(I, i),
                                        a.css(I, {
                                            visibility: "visible",
                                            opacity: .8,
                                            left: o
                                        }),
                                        o -= 50,
                                        e.later(function() {
                                            _ = new e.Anim(I, {
                                                opacity: 0,
                                                left: o
                                            }, .5, null, function() {
                                                a.css(I, "visibility", "hidden")
                                            }).run()
                                        }, 500)
                                }
                            }
                            var u = a.query(".ke_anchor", "#J_DivItemDesc"),
                                b = "tb-desc-segment-link-current",
                                k = u.length,
                                y = null,
                                w = null,
                                X = function(e) {
                                    var t = u[e];
                                    return v[t.id]
                                },
                                S = function(e) {
                                    a.removeClass(f, b),
                                        a.removeClass(p, b),
                                        a.addClass(e, b)
                                };
                            if (r.on(t, "click", function(t) {
                                    n("12.414"),
                                        h && (h = !1,
                                            n("12.415"));
                                    var i = t.target,
                                        o = i.href;
                                    "A" === i.tagName && (a.removeClass(f, b),
                                        a.addClass(i, b),
                                        t.preventDefault(),
                                        e.later(function() {
                                            m = o.split("#")[1],
                                                m = a.get("#" + m),
                                                g = a.offset(m).top,
                                                w = e.later(function() {
                                                    w = null
                                                }, 500),
                                                window.scroll(0, g - 83);
                                            var t = {
                                                itemId: d,
                                                shopid: c,
                                                key: o.charAt(o.length - 1),
                                                am: o.charAt(o.length - 3)
                                            };
                                            n("35626246?" + e.param(t))
                                        }, 100))
                                }),
                                s = i(".tb-vertical-desc-segments-list"),
                                r.on(s, "click", function(t) {
                                    n("12.414"),
                                        h && (h = !1,
                                            n("12.415"));
                                    var i = t.target,
                                        o = i.href;
                                    "A" === i.tagName && (a.removeClass(p, b),
                                        a.addClass(i, b),
                                        t.preventDefault(),
                                        e.later(function() {
                                            m = o.split("#")[1],
                                                m = a.get("#" + m),
                                                g = a.offset(m).top,
                                                w = e.later(function() {
                                                    w = null
                                                }, 500),
                                                window.scroll(0, g - 83);
                                            var t = {
                                                itemId: d,
                                                shopid: c,
                                                key: o.charAt(o.length - 1),
                                                am: o.charAt(o.length - 3)
                                            };
                                            n("35626246?" + e.param(t))
                                        }, 100))
                                }),
                                r.on(window, "scroll", function(t) {
                                    w || (y && y.cancel(),
                                        y = e.later(function() {
                                            e.each(u, function(e, t) {
                                                    if (a.offset(e).top - 84 > a.scrollTop(window)) {
                                                        if (0 === t)
                                                            return a.removeClass(f, b),
                                                                !1;
                                                        var n = X(t - 1);
                                                        return S(n),
                                                            !1
                                                    }
                                                    if (k - 1 === t)
                                                        return S(X(t)),
                                                            !1
                                                }),
                                                y = null
                                        }, 50))
                                }),
                                e.UA.ie > 6 || !e.UA.ie) {
                                var _, I = a.create('<div class="tb-seg-name-tip"></div>');
                                a.css(I, {
                                        visibility: "hidden",
                                        opacity: 0
                                    }),
                                    a.append(I, document.body),
                                    r.on(t, "click", l),
                                    r.on(s, "click", l),
                                    o.on("tabbar:unstick", function() {
                                        a.css(I, "visibility", "hidden"),
                                            a.removeClass(t, "tb-desc-segments-list-sticky")
                                    }),
                                    o.on("tabbar:stick", function() {
                                        a.addClass(t, "tb-desc-segments-list-sticky")
                                    })
                            }
                            o.on("tabbar:switch", function(e) {
                                "0" === e.idx && (a.removeClass(f, b),
                                    a.removeClass(p, b))
                            })
                        },
                        y = function() {
                            u && 0 !== u.length && (t = ['<ul class="tb-desc-segments-list tb-clearfix">'],
                                e.each(u, function(n, i) {
                                    n.index = i + 1,
                                        t.push(e.substitute('<li class="tb-desc-segment"><a class="tb-desc-segment-link" href="#{anchor}" data-key={index} >{name}</a></li>', n))
                                }),
                                t.push("</ul>"),
                                t = t.join(""),
                                t = a.create(t),
                                e.each(e.query("li", t), function(e) {
                                    var e = e.firstChild,
                                        t = e.href.split("#")[1];
                                    f.push(e),
                                        v[t] = e
                                }),
                                a.prepend(t, "#J_MainWrap"))
                        },
                        w = function() {
                            if (u && u.length > 0 ? (i(".tb-ids-mod").css("display", "block"),
                                    s = ['<div class="col-extra" id="J_IdsSegments"><ul class="tb-vertical-desc-segments-list tb-clearfix tb-vertical-desc-segments-list-show">']) : s = ['<div class="col-extra" id="J_IdsSegments"><ul class="tb-vertical-desc-segments-list tb-clearfix tb-vertical-desc-segments-list-hide">'],
                                e.each(u, function(t, n) {
                                    t.index = n + 1,
                                        s.push(e.substitute('<li class="tb-vertical-desc-segment"><a class="tb-vertical-desc-segment-link" href="#{anchor}" data-key={index} >{name}</a></li>', t))
                                }),
                                s.push("</ul></div>"),
                                s = s.join(""),
                                s = a.create(s),
                                e.each(e.query("li", s), function(e) {
                                    var e = e.firstChild,
                                        t = e.href.split("#")[1];
                                    p.push(e),
                                        b[t] = e
                                }),
                                i(".tb-main-layout").append(s),
                                u && !(u.length <= 0)) {
                                a.scrollTop(),
                                    e.one("#J_MainWrap").offset().top
                            }
                        },
                        X = function() {
                            i("#J_CustomSegments").length || (y(),
                                w(),
                                k(),
                                n("12.34"))
                        };
                    return {
                        init: X
                    }
                }();
            return u
        }),
        KISSY.add("item-detail/desc/custom", ["log", "node", "dom"], function(e, t) {
            var n = (t("log").getLogger("desc"),
                    t("node").all),
                i = n("body"),
                o = t("dom"),
                a = function() {
                    var e = o.get("#J_CustomMarket"),
                        t = function() {
                            i.on("cart:add:success", function(t) {
                                e && e.contentWindow && e.contentWindow.location && e.contentWindow.location.reload && e.contentWindow.location.reload()
                            })
                        },
                        n = function() {
                            e && t()
                        };
                    return {
                        init: n
                    }
                }();
            return a
        }),
        KISSY.add("item-detail/desc/videoplayer", ["log", "node", "dom", "ua", "../config/"], function(e, t) {
            var n = (t("log").getLogger("desc"),
                    t("node").all),
                i = n("body"),
                o = t("dom"),
                a = t("ua"),
                r = t("../config/"),
                s = r.getDescConfig(),
                c = function() {
                    var t = function() {
                            var e = 0,
                                t = null;
                            if (navigator.plugins && navigator.mimeTypes.length) {
                                var n = navigator.plugins["Shockwave Flash"];
                                n && n.description && (e = n.description.replace(/([a-zA-Z]|\s)+/, "").replace(/(\s+r|\s+b[0-9]+)/, ".").split(".")[0])
                            } else if (navigator.userAgent && 0 <= navigator.userAgent.indexOf("Windows CE"))
                                for (var i = 3; t;)
                                    try {
                                        i++,
                                        t = new ActiveXObject("ShockwaveFlash.ShockwaveFlash." + i),
                                            e = i
                                    } catch (o) {
                                        t = null
                                    }
                            else {
                                try {
                                    t = new ActiveXObject("ShockwaveFlash.ShockwaveFlash.7")
                                } catch (o) {
                                    try {
                                        t = new ActiveXObject("ShockwaveFlash.ShockwaveFlash.6"),
                                            e = 6,
                                            t.AllowScriptAccess = "always"
                                    } catch (a) {
                                        if (6 === e)
                                            return e
                                    }
                                    try {
                                        t = new ActiveXObject("ShockwaveFlash.ShockwaveFlash")
                                    } catch (r) {}
                                }
                                null !== t && (e = t.GetVariable("$version").split(" ")[1].split(",")[0])
                            }
                            return e
                        },
                        n = function() {
                            var n, i = "480",
                                a = "388",
                                r = "itemFlashObject",
                                c = s.valFlashUrl,
                                l = t();
                            if (8 < l) {
                                var d = o.get("#item-flash");
                                d && (n = navigator.plugins && navigator.mimeTypes && navigator.mimeTypes.length ? '<embed type="application/x-shockwave-flash" src="' + c + '" width="' + i + '" height="' + a + '" id="' + r + '" name="' + r + '" quality="high" wmode="' + (e.UA.gecko ? "transparent" : "opaque") + '" allowfullscreen="true" menu="false" flashvars="MMplayerType=PlugIn" />' : '<object id="' + r + '" classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" width="' + i + '" height="' + a + '"><param name="movie" value="' + c + '" /><param name="quality" value="high" /><param name="wmode" value="opaque" /><param name="allowfullscreen" value="true" /><param name="menu" value="false" /><param name="flashvars" value="MMplayerType=ActiveX" /></object>',
                                    d.innerHTML = n)
                            }
                        },
                        r = function(e, t) {
                            var n = o.get("#item-flash");
                            if (n) {
                                if (a.ie && a.ie < 9)
                                    return void n.hide();
                                if (void 0 !== e || void 0 !== t) {
                                    var i = {
                                        container: "#item-flash",
                                        from: "detail",
                                        url: e,
                                        videoId: t,
                                        muted: !0,
                                        autoplay: !0,
                                        controls: !0,
                                        volumeControls: !0
                                    };
                                    location.host.indexOf("pre-item.taobao.com") !== -1 && (i.mtopConfig = {
                                        subDomain: "wapa"
                                    });
                                    var r = new Videox(i);
                                    r.play()
                                }
                            }
                        },
                        c = function(e) {
                            var t = o.get("#item-flash");
                            if (t)
                                return a.ie && a.ie < 9 ? void t.hide() : void(t.innerHTML = "<iframe height=388 width=480 src=" + e + " frameborder=0></iframe>")
                        };
                    return {
                        init: function() {
                            s.video && s.video.url && i.fire("resource:sib", {
                                success: function(e) {
                                    e && e.sib && e.sib.video && e.sib.video.show && ("taobao" === s.video.type ? r(s.video.url, s.video.videoId) : "youku" === s.video.type ? c(s.video.url) : n())
                                }
                            })
                        }
                    }
                }();
            return c
        }),
        KISSY.add("item-detail/desc/imagesize", ["log", "node", "dom", "io", "../config/"], function(e, t) {
            var n = t("log").getLogger("desc"),
                i = t("node").all,
                o = (i("body"),
                    t("dom")),
                a = t("io"),
                r = t("../config/"),
                s = r.getDescConfig(),
                c = function() {
                    return {
                        init: function() {
                            function t(t) {
                                if (t && t.size) {
                                    var n = "data-ks-lazyload",
                                        i = "width",
                                        a = "height",
                                        r = function(e) {
                                            var t = e.style;
                                            return t && (t[i] || t[a]) || o.hasAttr(e, i) || o.hasAttr(e, a)
                                        },
                                        s = function(e) {
                                            return e ? e.substr(e.lastIndexOf("/") + 1).replace("_.webp", "") : e
                                        };
                                    e.each(e.query("#description img"), function(e) {
                                        var c = t[s(o.attr(e, n))];
                                        c && !r(e) && (e[i] = c.w,
                                            e[a] = c.h)
                                    })
                                }
                            }
                            var i = s.apiImgInfo;
                            i && (n.info("Fetch image size data from %s", i),
                                new a({
                                    type: "get",
                                    url: i,
                                    success: t,
                                    dataType: "jsonp",
                                    jsonp: "cb",
                                    jsonpCallback: "jsonp_image_info",
                                    cache: !0
                                }))
                        }
                    }
                }();
            return c
        }),
        KISSY.add("item-detail/desc/localmap", ["dom"], function(e, t) {
            var n = t("dom"),
                i = function() {
                    if (g_config.localMap) {
                        var t = g_config.localMap;
                        e.available("#J_DivItemDesc", function() {
                            var e = n.get("#attributes");
                            e && n.insertAfter(n.create('<iframe style="height: 420px;width: 750px" frameborder="0" scrolling="no"  src=' + t + ">"), e)
                        })
                    }
                };
            return {
                init: i
            }
        }),
        KISSY.add("item-detail/desc/index", ["log", "node", "../config/", "./content", "./segment", "./custom", "./videoplayer", "./imagesize", "./localmap"], function(e, t) {
            var n = t("log").getLogger("desc"),
                i = (t("node").all,
                    t("../config/"),
                    t("./content")),
                o = t("./segment"),
                a = t("./custom"),
                r = t("./videoplayer"),
                s = t("./imagesize"),
                c = t("./localmap");
            return {
                init: function() {
                    n.info("Init start");
                    try {
                        i.init()
                    } catch (e) {
                        n.warn("Content init failed: %s", e.message)
                    }
                    try {
                        o.init()
                    } catch (e) {
                        n.warn("Segmentor init failed: %s", e.message)
                    }
                    try {
                        r.init()
                    } catch (e) {
                        n.warn("VideoPlayer init failed: %s", e.message)
                    }
                    try {
                        a.init()
                    } catch (e) {
                        n.warn("CustomMarket init failed: %s", e.message)
                    }
                    try {
                        s.init()
                    } catch (e) {
                        n.warn("ImageSize init failed: %s", e.message)
                    }
                    try {
                        c.init()
                    } catch (e) {
                        n.warn("LocalMap init failed: %s", e.message)
                    }
                    n.info("Init end")
                }
            }
        }),
        KISSY.add("item-detail/pledge/index", ["../config/", "dom", "event", "ua", "node", "anim", "../gl/"], function(e, t) {
            var n = t("../config/"),
                i = (t("dom"),
                    t("event"),
                    t("ua"),
                    t("node").all),
                o = t("anim"),
                a = n.getEnterprise(),
                r = i("body"),
                s = t("../gl/"),
                c = i("#J_tbExtra"),
                l = i("#J_ServiceTab"),
                d = i("a", l),
                u = i("#service");
            return {
                loaded: !1,
                init: function() {
                    var e = this;
                    return u.length && u.hide(),
                        !l.length && c.length ? void c.delegate("click", ".J_Cont", function(e) {
                            e.preventDefault()
                        }) : (r.fire("resource:sib", {
                                success: function() {
                                    n.getBuyerConfig("showServiceTab") === !1 ? (l.hide(),
                                        c.delegate("click", ".J_Cont", function(e) {
                                            e.preventDefault()
                                        })) : c.delegate("click", ".J_Cont", function(t) {
                                        t.preventDefault(),
                                            e.loadPledge(),
                                            new o(window, {
                                                scrollTop: l.offset().top
                                            }, .2, "swing").run()
                                    })
                                }
                            }),
                            d.attr("data-index", "4"),
                            l.on("click", function() {
                                e.loadPledge()
                            }),
                            void d.on("click", function(t) {
                                t.preventDefault(),
                                    e.loadPledge()
                            }))
                },
                loadPledge: function() {
                    var t = this;
                    if (!t.loaded) {
                        t.loaded = !0;
                        var i = "OVERSEA" === n.getBuyerConfig("serviceTab") ? "oversea-service" : "contract";
                        e.use(i, function(e, t) {
                            t.create("#service", {
                                    itemId: n.getItemId(),
                                    countryCode: n.getBuyerConfig("countryCode")
                                }),
                                s("1.2")
                        })
                    }
                    a || r.fire("tabbar:switch", {
                        index: 4
                    })
                }
            }
        }),
        KISSY.add("item-detail/tabbar/tab-switch", ["../gl/", "log", "dom", "event", "ua", "node", "anim", "../config/"], function(e, t) {
            function n(t, n) {
                if (!isNaN(n)) {
                    var o = this;
                    if (!t || "J_TabShopCart" !== c(t.currentTarget).attr("id")) {
                        if (u.fire("tabbar:preswitch", {
                                index: n
                            }),
                            0 !== n) {
                            var a = c("#J_PublicWelfare");
                            a && a.hide();
                            var r = c("#J_SellerDetailMobile");
                            r && r.hide()
                        } else
                            4 !== n && (c("#J_ServiceTab") && c("#J_ServiceTab").removeClass("selected"),
                                c("#service") && c("#service").addClass("tb-hidden"));
                        if (!isNaN(n) && 0 !== n && c(".tb-vertical-desc-segment").length > 0 && (c(".tb-vertical-desc-segments-list").addClass("tb-vertical-desc-segments-list-hide").removeClass("tb-vertical-desc-segments-list-show"),
                                c(".tb-ids-mod").hide(),
                                c(".tb-vertical-desc-segment").hide()),
                            n !== o.getLastIndex()) {
                            switch (n) {
                                case 0:
                                    t && i("12.4"),
                                        o.toggleTab(0);
                                    break;
                                case 1:
                                    t && i("12.5"),
                                        o.Rate || e.use("rate", function(e, t) {
                                            o.Rate = t,
                                                o.Rate.create("#reviews", {
                                                    itemId: d.getItemId(),
                                                    sellerId: d.getSellerId(),
                                                    refund: !1,
                                                    tka: d.isMS
                                                })
                                        }),
                                        !f && c(".tb-r-try-check").length > 0 && (f = !0,
                                            i("12.2", "tbsy")),
                                        o.toggleTab(1);
                                    break;
                                case 2:
                                    e.use("records", function(e, t) {
                                            t.init({
                                                api: d.getRecordsApi(),
                                                containerEl: "#deal-record"
                                            })
                                        }),
                                        t && i("12.6"),
                                        o.toggleTab(2);
                                    break;
                                case 4:
                                    o.toggleTab(4);
                                    break;
                                case 5:
                                    o.toggleTab(5);
                                    break;
                                case 6:
                                    o.toggleTab(6)
                            }
                            c("#J_TabBarWrap").hasClass("tb-tabbar-wrap-sticky") && c(document).scrollTop(c(".tb-main-layout").offset().top - 60),
                                u.fire("tabbar:postswitch", {
                                    index: n
                                })
                        }
                    }
                }
            }
            var i = t("../gl/"),
                o = t("log").getLogger("tabbar"),
                a = t("dom"),
                r = t("event"),
                s = t("ua"),
                c = t("node").all,
                l = t("anim"),
                d = t("../config/"),
                u = c("body"),
                f = !1,
                p = s.ie && (6 === s.ie || 7 === s.ie),
                g = 750,
                m = a.get("#J_TabBarWrap"),
                h = (c("#J_TabBar"),
                    a.query("a", "#J_TabBar"),
                    document.body),
                v = "selected",
                b = "#J_ReviewTabTrigger";
            return {
                lastIndex: 0,
                tabSwitchTo: function(e, t) {
                    e && e.halt && (e.halt(),
                            e.preventDefault()),
                        u.fire("tabbar:switch", {
                            idx: t
                        }),
                        new l(window, {
                            scrollTop: c("#J_TabBar").offset().top
                        }, .1).run()
                },
                initSKUSwitch: function() {
                    var e = this,
                        t = c(b);
                    t && t.on("click", function(t) {
                        e.tabSwitchTo(t, 1)
                    })
                },
                Rate: null,
                checkStick: function() {
                    var t = this,
                        n = a.scrollTop(),
                        i = e.one(".tb-main-layout").offset().top - 62;
                    return n > i ? (t.sticked || t.stick(),
                        !0) : (t.sticked && t.unstick(),
                        !1)
                },
                init: function() {
                    var t = this;
                    return u.on("tabbar:switch", e.bind(t.switchTo, t)),
                        t.initSKUSwitch(),
                        !!a.get("#J_DivItemDesc") && (s.ie <= 8 && (c(window).width() < 1180 ? c(".tb-tabbar-inner-wrap").width(799) : c(".tb-tabbar-inner-wrap").width(948)),
                            g = Math.ceil(a.offset(m).top) + 1,
                            r.delegate("#J_TabBar", "click", "a", function(e) {
                                try {
                                    var t = parseInt(c(e.currentTarget).attr("data-index"), 10);
                                    n.call(this, e, t)
                                } catch (i) {
                                    o.warn("Exec error: %s", i.message)
                                }
                            }, t),
                            r.on(m, "click", function(e) {
                                a.hasClass(e.target, "ww-inline") && i("12.24")
                            }),
                            void t.initStick())
                },
                stick: function() {
                    var e = this;
                    if (c("#J_TabBarWrap").after('<div id="J_TabBarWrapStickyPlaceHolder" style="width: 100%; height: 46px; margin-bottom: 16px;"></div>').addClass("tb-tabbar-wrap-sticky"),
                        c(".J_LinkAdd").length > 0 && 1 === g_config.idata.item.quickAdd && a.css(".tb-shop-cart", "display", "block"),
                        e.sticked = !0,
                        u.fire("tabbar:stick"),
                        c(".col-extra").length > 0) {
                        c(".col-extra").addClass("tb-desc-segments-list-sticky");
                        var t = (a.width(window) - a.width(".tb-main-layout")) / 2;
                        c(".tb-vertical-desc-segments-list").addClass("tb-sticky-vertical-desc-segments-list").css("right", t + "px")
                    } else
                        o.info("Segments list load and scrolled")
                },
                unstick: function() {
                    var e = this;
                    c("#J_TabBarWrap").removeClass("tb-tabbar-wrap-sticky"),
                        c("#J_TabBarWrapStickyPlaceHolder").remove(),
                        c(".J_LinkAdd").length > 0 && a.css(".tb-shop-cart", "display", "none"),
                        u.fire("tabbar:unstick"),
                        c(".tb-vertical-desc-segments-list").length > 0 && c(".tb-vertical-desc-segments-list").removeClass("tb-sticky-vertical-desc-segments-list").css("right", "0px"),
                        e.sticked = !1
                },
                initStick: function() {
                    var t = this;
                    if (!p) {
                        var n = e.one("#J_TabBarWrap");
                        if (n) {
                            t.sticked = !1;
                            a.get("#J_TabbarPlaceHolder");
                            r.on(window, "scroll", function() {
                                    t.checkStick();
                                    var n = c(".tb-vertical-desc-segments-list");
                                    if (n.length >= 1) {
                                        var i = c("#J_SubWrap").height() + e.get("#J_SubWrap").getBoundingClientRect().top - 100;
                                        n.height(i > 0 ? i : 0)
                                    }
                                }),
                                r.on(window, "resize", function() {
                                    if (t.checkStick()) {
                                        if (c(".tb-vertical-desc-segments-list").length > 0) {
                                            var e = (a.width(window) - a.width(".tb-main-layout")) / 2;
                                            c(".tb-vertical-desc-segments-list").addClass("tb-sticky-vertical-desc-segments-list").css("right", e + "px")
                                        }
                                    } else
                                        c(".tb-vertical-desc-segments-list").length > 0 && c(".tb-vertical-desc-segments-list").removeClass("tb-sticky-vertical-desc-segments-list").css("right", "0px");
                                    s.ie <= 8 && (c(window).width() < 1180 ? c(".tb-tabbar-inner-wrap").width(799) : c(".tb-tabbar-inner-wrap").width(948))
                                })
                        }
                    }
                },
                getLastIndex: function() {
                    var e = this;
                    return e.lastIndex
                },
                setLastIndex: function(e) {
                    var t = this;
                    t.lastIndex = e
                },
                toggleTab: function(e) {
                    var t = this.getLastIndex(),
                        n = c(".tb-tab-anchor[data-index='" + t + "']"),
                        i = c(".tb-tab-anchor[data-index='" + e + "']"),
                        o = c(".tb-ids-mod"),
                        a = c(".tb-vertical-desc-segment"),
                        r = c(".tb-vertical-desc-segments-list"),
                        s = c("#J_PublicWelfare"),
                        l = s.length > 0,
                        d = c("#J_IframeForLife"),
                        u = d.length > 0,
                        f = "tb-vertical-desc-segments-list-show",
                        p = "tb-vertical-desc-segments-list-hide",
                        g = c("#J_SellerDetailMobile"),
                        m = g.length > 0;
                    i && i.length && (n.parent().removeClass(v),
                        i.parent().addClass(v),
                        c(h).removeClass("tab-active-index-" + t),
                        c(h).addClass("tab-active-index-" + e),
                        this.setLastIndex(e),
                        5 === e || 6 === e ? c("#farm-auth").show() : c("#farm-auth").hide(),
                        0 === e ? (l && s.show(),
                            m && g.show(),
                            u && d.show(),
                            a.length && (o.show(),
                                a.show(),
                                r.addClass(f).removeClass(p))) : (l && s.hide(),
                            m && g.hide(),
                            u && d.hide(),
                            a.length && (o.hide(),
                                a.hide(),
                                r.addClass(p).removeClass(f))))
                },
                switchTo: function(e) {
                    var t = this;
                    e.load && (t.loadQualification = !0);
                    var i = e.idx || e.index;
                    if (n.call(this, e, i),
                        e.stick && !e.load) {
                        var o = c("#J_TabBarWrap").offset().top;
                        if (t.tabbarTop) {
                            if (o > t.tabbarTop) {
                                var a = c("#tad_head_area").height() + c("#tad_first_area").height();
                                t.tabbarTop = t.tabbarTop + a + 50,
                                    t.loadTad = !0
                            }
                        } else
                            t.tabbarTop = o;
                        c(window).scrollTop(t.tabbarTop),
                            t.checkStick(),
                            t.loadQualification && (t.loadTad && c(window).scrollTop(t.tabbarTop - 20),
                                u.fire("tabbar:sticked"))
                    }
                }
            }
        }),
        KISSY.add("item-detail/tabbar/index", ["../desc/", "../pledge/", "./tab-switch"], function(e, t) {
            return {
                init: function() {
                    var e = t("../desc/");
                    e.init();
                    var n = t("../pledge/");
                    n.init();
                    var i = t("./tab-switch");
                    i.init()
                }
            }
        }),
        KISSY.add("item-detail/security/copyfilter", ["event"], function(e, t) {
            function n() {
                var t, n, a = "\u60a8\u9009\u4e2d\u7684\u5185\u5bb9\u53ef\u80fd\u6709\u5b89\u5168\u9690\u60a3,\u8bf7\u8c28\u614e\u4f7f\u7528! ",
                    r = o.createElement("div"),
                    s = "<.+(?:",
                    c = ").+>",
                    l = "\\s*",
                    d = /[\r\n]+/g,
                    u = [
                        ["display", "none"],
                        ["visibility", "hidden"],
                        ["width", "0"],
                        ["text-indent", "-\\d{3,}"]
                    ],
                    f = [];
                e.each(u, function(e) {
                        f.push(e[0] + l + ":" + l + e[1])
                    }),
                    t = s + f.join("|") + c,
                    n = new RegExp(t, "mi"),
                    i.on(document.body, "copy", function(e) {
                        var t, i;
                        window.getSelection ? t = window.getSelection() : o.selection && (t = o.selection.createRange()),
                            i = t.htmlText || t.getRangeAt(0).cloneContents(),
                            "string" != typeof i && (r.appendChild(i),
                                i = r.innerHTML),
                            i = i.replace(d, ""),
                            n.test(i) && alert(a),
                            r.innerHTML = ""
                    })
            }
            var i = t("event"),
                o = document;
            n()
        }),
        KISSY.add("item-detail/security/consolewarn", function(e, t) {
            window.top === window && window.console && (console.log("%c%s", "color: red; background: yellow; font-size: 24px; font-weight: bold;", "\u5b89\u5168\u8b66\u544a!"),
                console.log("%c%s", "color: black; font-size: 18px;", "\u8bf7\u52ff\u5728\u6b64\u63a7\u5236\u53f0\u8f93\u5165\u6216\u7c98\u8d34\u4f60\u4e0d\u660e\u767d\u7684\u4ee3\u7801\uff0c\u4ee5\u907f\u514d\u653b\u51fb\u8005\u7a83\u53d6\u4f60\u7684\u4fe1\u606f\u6765\u5192\u5145\u4f60\u3002"))
        }),
        KISSY.add("item-detail/security/index", ["./copyfilter", "./consolewarn"], function(e, t) {
            t("./copyfilter"),
                t("./consolewarn")
        }),
        KISSY.add("item-detail/typerecommend/index", ["dom", "node"], function(e, t) {
            function n() {
                a.on("dc:decorated", function() {
                    var t = null;
                    if (t = i.get("#J_RecommendedSameTypesItems")) {
                        var n = i.attr(t, "detail:params"),
                            o = Hub.config.get("desc").similarItems;
                        if (!o)
                            return void i.remove(t);
                        n = KISSY.unparam(n.replace(";", "&").replace(/:/g, "=")),
                            n.title = encodeURIComponent(encodeURIComponent(n.title)),
                            DT.sameTypeRecomCallback = function(e) {
                                t.innerHTML = e,
                                    i.children(t).length || i.remove(t)
                            },
                            e.getScript([o.api, "?shopId=" + o.rstShopId, "&auctionId=" + o.rstItemId, "&shopcatlist=" + o.rstShopcatlist, "&title=" + n.title, "&count=" + n.count, "&dk=" + o.rstdk, "&t=" + e.now(), "&callback=DT.sameTypeRecomCallback"].join(""))
                    }
                })
            }
            var i = t("dom"),
                o = t("node").all,
                a = o("body");
            n()
        }),
        KISSY.add("item-detail/switcher/index", ["dom", "ua", "node", "../gl/"], function(e, t) {
            var n = t("dom"),
                i = t("ua"),
                o = t("node").all,
                a = (t("../gl/"),
                    o("body")),
                r = document,
                s = (r.body,
                    6 === i.ie,
                    n.get("#bd")),
                c = !1;
            return {
                init: function() {
                    a.on("switcher:expand", e.bind(this._expand, this)),
                        a.on("switcher:toggle", e.bind(this._toggle, this)),
                        a.on("switcher:collapse", e.bind(this._collapse, this))
                },
                _expand: function() {
                    o(".col-sub").fadeOut(.3, function() {}, "easeOut"),
                        o("#J_MainWrap").animate({
                            width: "950px"
                        }, {
                            duration: .3,
                            easing: "swing"
                        }),
                        n.addClass(s, "expanded"),
                        c = !0
                },
                _collapse: function() {
                    o(".col-sub").fadeIn(.3, function() {}, "easeIn"),
                        o("#J_MainWrap").animate({
                            width: "750px"
                        }, {
                            duration: .3
                        }),
                        n.removeClass(s, "expanded"),
                        c = !1
                },
                _toggle: function(e) {
                    e && e.halt(),
                        this[c ? "_collapse" : "_expand"]()
                }
            }
        }),
        KISSY.add("item-detail/stat/index", ["log", "dom", "event", "node", "../gl/", "../config/"], function(e, t) {
            var n = t("log").getLogger("stat"),
                i = t("dom"),
                o = t("event"),
                a = t("node"),
                r = t("../gl/"),
                s = a.all,
                c = s("body"),
                l = (t("../config/"), {
                    "#J_TMySize": "d3",
                    "#J_ChooseAutoBrand": "d4"
                });
            Hub.add({
                name: "stat",
                listen: {
                    "domready:end": "init"
                },
                factory: function(e, t, a) {
                    function d(e) {
                        return e = e || 100,
                            KISSY.Config.debug || 100 * Math.random() <= e
                    }

                    function u(e, t) {
                        d(t) && r(e)
                    }
                    var f = g_config.itemId,
                        p = g_config.idata.seller.id;
                    return c.on("goldlog", function(e) {
                        e && e.key && u(e.key)
                    }), {
                        init: function() {
                            this.cps(),
                                this.scroll(),
                                this.goldlog(),
                                this.a11y(),
                                this.spm()
                        },
                        a11y: function() {
                            var e = 0;
                            s(window).on("keydown", function(t) {
                                9 === t.keyCode && e++,
                                    10 === e && u("1024.200")
                            })
                        },
                        goldlog: function() {
                            var e = s("body");
                            e.on("header:market:hover", function() {
                                    u("12.403")
                                }),
                                e.on("header:search:shop", function() {
                                    u("12.410")
                                }),
                                e.on("header:search:tb", function() {
                                    u("12.409")
                                }),
                                e.on("footer:async:load", function() {
                                    u("1024.100", 10)
                                }),
                                e.on("popsku:add:cart", function() {
                                    u("12.417")
                                }),
                                e.on("sizepicker:click", function() {
                                    u("9.0.0")
                                }),
                                e.on("thumb:switch", function(e) {
                                    void 0 !== e.index && u("8.0.0?idx=" + e.index)
                                }),
                                e.on("thumb:zoom", function(e) {
                                    u("24253?type=2&idx=" + e.index + "&w=" + e.width)
                                }),
                                o.on("#detail", "click", function(e) {
                                    var t = e.target;
                                    i.hasClass(t, "ww-inline") && u("12.22")
                                }),
                                s("#J_ReviewTabTrigger").on("click", function() {
                                    u("12.23")
                                }),
                                t.later(function() {
                                    s("#his_bar_wrap").length && u("23420980"),
                                        s("#youdaoGWZS").length && u("12.301"),
                                        s("#TK-con").length && u("12.303"),
                                        s(".tickLabels").length && u("12.304")
                                }, 5e3),
                                t.available("#J_ShopSearchIcon", function(e) {
                                    s(e).on("click", function() {
                                        u("12.411")
                                    })
                                });
                            var n, a = s("#J_Social"),
                                r = s("#J_ShopInfo");
                            a.delegate("click", ".J_Share", function() {
                                    u("12.405")
                                }),
                                r.length > 0 && (n = s(".tb-shop-info-ft", r),
                                    n.delegate("click", "a", function(e) {
                                        var t = s(e.currentTarget);
                                        t.hasClass("J_TDialogTrigger") || u("12.413")
                                    }))
                        },
                        scroll: function() {
                            var e = document,
                                n = i.scrollLeft(e),
                                a = i.scrollTop(e),
                                s = i.viewportHeight(),
                                l = i.viewportWidth(),
                                d = 0,
                                u = 0,
                                f = function() {
                                    var t = i.attr(e.body, "class").match(/tab-active-index-(\d)/g),
                                        n = t && t[0];
                                    return n ? n.substring(n.length - 1) : "-"
                                }(),
                                p = Math.max,
                                g = t.one("#page"),
                                m = t.one(".J_DetailSection"),
                                h = g.offset().top,
                                v = m.offset().top,
                                b = function() {
                                    var t = i.scrollTop(e);
                                    0 === f && (n = p(n, i.scrollLeft(e)),
                                            a = p(a, t)),
                                        t < h && (r.scrollShopBanner = !0),
                                        t > v && (r.scrollItemDetail = !0)
                                };
                            c.on("tabbar:switch", function(e) {
                                    f = e.idx
                                }),
                                o.on(i.query("li", i.get("#J_UlThumb")), "mouseenter", function(e) {
                                    ++d
                                }),
                                o.on(e, "click", function(e) {
                                    ++u
                                }),
                                o.on(e, "scroll", b),
                                o.on(window, "beforeunload", function(o) {
                                    b();
                                    var c = g_config.startTime,
                                        p = t.now() - c,
                                        g = {
                                            type: "vh4",
                                            sh: n,
                                            sv: a,
                                            vh: s,
                                            vw: l,
                                            cost: p,
                                            h: i.height(e),
                                            m: d,
                                            dh: i.height("#J_DivItemDesc"),
                                            c: u,
                                            s: c,
                                            r: e.referrer,
                                            tab: f
                                        };
                                    r("3242?" + t.param(g))
                                })
                        },
                        cps: function() {
                            t.getScript("//g.alicdn.com/mm/cps/trace.js", function() {
                                try {
                                    CPS.trace({
                                        type: 1,
                                        subtype: 6,
                                        itemid: f,
                                        sellerid: p
                                    })
                                } catch (e) {
                                    n.warn("CPS init failed: %s", e.message)
                                }
                            })
                        },
                        spm: function() {
                            t.each(l, function(e, t) {
                                var n = s(t);
                                n && n.length && n.attr({
                                    "data-spm-click": "gostr=/tbdetail;locaid=" + e
                                })
                            })
                        }
                    }
                }
            })
        }),
        KISSY.add("item-detail/popsku/popsku", ["sku", "dom", "../stock/stock", "../validator/amount", "../config/"], function(e, t) {
            var n = t("sku"),
                i = t("dom"),
                o = t("../stock/stock"),
                a = t("../validator/amount"),
                r = t("../config/"),
                s = e.all,
                c = e.Base,
                l = s(".tb-shop-cart");
            if (l.length) {
                var d, u = s("body");
                u.on("promo:price", function(e) {
                    d = e.price
                });
                var f = c.extend({
                    initializer: function() {
                        var t = s("#detail"),
                            n = this.get("tpl"),
                            i = this.get("propTpl"),
                            o = [];
                        s(".J_Prop", t).each(function(t) {
                                var n = s("[data-property]", t),
                                    a = n.attr("data-property"),
                                    r = e.substitute(i, {
                                        propType: a,
                                        propContents: n.html(),
                                        propCls: n.hasClass("tb-img") ? "tb-img" : ""
                                    });
                                o.push(r)
                            }),
                            this.set("staticPrice", s("#J_StrPrice .tb-rmb-num").html());
                        var a = r.getStock(),
                            c = r.getStockMap("stock");
                        this.contents = e.substitute(n, {
                            propsContents: o.join(""),
                            priceType: d ? "\u4fc3\u9500" : "\u4ef7\u683c",
                            priceContents: d || s("#J_StrPrice").html(),
                            stock: c || a
                        })
                    },
                    destructor: function() {
                        this.$el.remove(),
                            this.set("created", !1),
                            this.set("rendered", !1),
                            this.el = null,
                            this.$el = null
                    },
                    render: function() {
                        if (!this.get("rendered")) {
                            var e = s(this.contents);
                            this.set("el", e);
                            var t = i.viewportHeight();
                            s(".J_PopSKUProps", e).css("maxHeight", String(t - this.get("propsOffsetHeight")) + "px"),
                                this.bind(),
                                s(this.get("render")).append(e),
                                this.set("rendered", !0)
                        }
                    },
                    bind: function() {
                        function e(e) {
                            e.each(function(e) {
                                var t = s(e).css("background-image");
                                if (-1 !== t.indexOf("url(")) {
                                    var n = t.match(/url\("?([^\)^"]*)/)[1].replace("30x30", "160x160");
                                    i.set("pic", n)
                                }
                            })
                        }
                        var t = this.$el,
                            i = this,
                            c = new n({
                                root: t,
                                hook: "li",
                                skuMap: r.getSkuMap(),
                                promoMap: r.getPromoMap() || {},
                                stockMap: r.getStockMap(),
                                attrName: "data-value",
                                selectedClass: "tb-selected",
                                disabledClass: "tb-disabled"
                            });
                        c.on("selectionChanged", function(t) {
                                var n = s("a", t.sku.els);
                                e(n)
                            }),
                            c.on("skuChanged skuFound", function(e) {
                                var t = e.sku;
                                i.set("sku", t),
                                    i.set("price", t.price),
                                    i.setStock(),
                                    "skuFound" === e.type && s(".J_PopSKUProps").removeClass("tb-attention")
                            }),
                            c.on("skuLost", function() {
                                i.setDefaultProps(c),
                                    i.setStock()
                            }),
                            u.on("sku:set", function(e) {
                                e.localStock && (i.sku.set("isLocalStock", !0),
                                    i.sku.resetStock(e.localStock),
                                    i.setStock())
                            }),
                            c.init();
                        var l = r.getDefPrice();
                        l && this.set("staticPrice", l),
                            this.setDefaultProps(c);
                        var d = new a({
                            el: t,
                            sku: c
                        });
                        this.modStock = new o({
                                el: s(".J_PopSKUStockProp", t),
                                validator: d
                            }),
                            s(".J_PopSKUAddCart", t).on("click", function(e) {
                                e.preventDefault();
                                var n = !1;
                                if (s(".J_Prop", t).each(function(e) {
                                        var t = s(e),
                                            i = s(".tb-selected", t);
                                        0 === i.length ? (t.addClass(".tb-prop-unselected"),
                                            n = !0) : t.removeClass(".tb-prop-unselected")
                                    }),
                                    n)
                                    s(".J_PopSKUProps", t).addClass("tb-attention");
                                else {
                                    var o = i.get("sku"),
                                        a = i.get("amount");
                                    u.fire("popsku:add:cart"),
                                        u.fire("cart:add", {
                                            skuId: o && o.skuId,
                                            amount: a,
                                            validator: d,
                                            success: function(e) {
                                                u.fire("toolbar:cart:fly", {
                                                        pos: s(".J_PopSKUAddCart", t).offset(),
                                                        pic: i.get("pic") || g_config.idata.item.pic + "_60x60.jpg"
                                                    }),
                                                    i.hide()
                                            }
                                        })
                                }
                            }),
                            s(".J_PopSKUCancer", t).on("click", function(e) {
                                e.preventDefault(),
                                    t.toggle()
                            }),
                            s(".J_PopSKUClose", t).on("click", function(e) {
                                e.preventDefault(),
                                    s(".J_PopSKUProps").removeClass("tb-attention")
                            })
                    },
                    setDefaultProps: function(e) {
                        var t = e.getDefaultPromo();
                        !t || !t.price || t.limitTime && "false" === t.isStart ? this.set("price", this.get("staticPrice")) : (this.set("price", t.price),
                            this.set("priceType", "\u4fc3\u9500"),
                            this.set("hasPromoPrice", !0))
                    },
                    setStock: function() {
                        this.modStock && this.modStock.update()
                    },
                    toggle: function() {
                        return this.$el.toggle()
                    },
                    show: function() {
                        return this.$el.show()
                    },
                    hide: function() {
                        return this.$el.hide()
                    }
                }, {
                    ATTRS: {
                        tpl: {
                            value: '<div class="J_PopSKU bubble tb-popsku"><span class="arrow-top"><i></i></span><div class="tb-popsku-content">                    <div class="tb-prop tb-price-prop tb-clearfix"><div class="tb-property-type J_PopSKUPriceType">{priceType}</div><div class="tb-price">{priceContents}</div></div>                    <div class="tb-props J_PopSKUProps">                    {propsContents}                    <dl class="J_PopSKUStockProp tb-amount tb-prop tb-clearfix">                    <dt class="tb-property-type">\u6570\u91cf</dt>                    <dd>                    <span class="J_StockSpinner tb-stock">                    <a href="#" hidefocus class="tb-reduce J_Reduce tb-iconfont ">&#411;</a>                    <input type="text" class="J_PopSKUAmount tb-text" value="1" maxlength="8" title="\u8bf7\u8f93\u5165\u8d2d\u4e70\u91cf"/>                    <a href="#" hidefocus class="tb-increase J_Increase tb-iconfont ">&#410;</a>\u4ef6</span>                    <em>(\u5e93\u5b58<span class="tb-count J_StockVal">{stock}</span>\u4ef6)</em>                    </dd></dl>                    <div class="tb-actions">                    <div class="tb-btns">                    <div class="tb-btn-add"><a href="#" class="J_PopSKUAddCart" title="\u52a0\u5165\u8d2d\u7269\u8f66">\u786e\u5b9a</a></div>                    <div class="tb-btn-cancer"><a href="#" class="J_PopSKUCancer" title="\u53d6\u6d88">\u53d6\u6d88</a></div>                    </div>                    <div class="tb-info">\u8bf7\u52fe\u9009\u60a8\u8981\u7684\u5546\u54c1\u4fe1\u606f<span class="tb-close J_PopSKUClose tb-iconfont">&#223;</span></div>                    </div>                    <div class="tb-msgs"></div>                    </div>                </div></div>'
                        },
                        propTpl: {
                            value: '<dl class="J_Prop tb-prop tb-clearfix">                    <dt class="tb-property-type">{propType}</dt>                    <dd>                    <ul data-property="{type}" class="tb-clearfix {propCls}">                    {propContents}                    </ul></dd></dl>'
                        },
                        render: {},
                        created: {
                            value: !1
                        },
                        rendered: {
                            value: !1
                        },
                        el: {
                            setter: function(e) {
                                this.$el = e,
                                    this.el = e[0]
                            }
                        },
                        pic: {
                            setter: function(t) {
                                function n() {
                                    c.height(Number(o.height()) - i.get("showcaseOffsetHeight"))
                                }
                                var i = this,
                                    o = this.$el;
                                if (this._picInited)
                                    s(".J_PopSKUPic", o).attr("src", t);
                                else {
                                    var a = '<div class="tb-showcase"><img class="J_PopSKUPic tb-pic" src="{src}"></div>',
                                        r = e.substitute(a, {
                                            src: t
                                        });
                                    o.addClass("tb-popsku-large");
                                    var c = s(r);
                                    o.append(c),
                                        this.get("rendered") ? n() : this.on("afterRenderedChange", function(e) {
                                            n()
                                        })
                                }
                                this.pic = t,
                                    this._picInited = !0
                            },
                            getter: function() {
                                return this.pic || ""
                            }
                        },
                        sku: {},
                        amount: {
                            getter: function() {
                                return s(".J_PopSKUAmount", this.el)[0].value
                            },
                            setter: function(e) {}
                        },
                        price: {
                            setter: function(e) {
                                e && s(".tb-rmb-num", this.el).html(e)
                            },
                            getter: function() {
                                return s(".tb-rmb-num", this.el).text()
                            }
                        },
                        priceType: {
                            setter: function(e) {
                                s(".J_PopSKUPriceType", this.el).html(e)
                            }
                        },
                        listeners: {
                            value: []
                        },
                        propsOffsetHeight: {
                            value: 150
                        },
                        showcaseOffsetHeight: {
                            value: 80
                        }
                    }
                });
                return f
            }
        }),
        KISSY.add("item-detail/popsku/index", ["node", "../gl/", "./popsku"], function(e, t) {
            var n = t("node").all,
                i = t("../gl/"),
                o = t("./popsku");
            if (0 !== g_config.idata.item.quickAdd) {
                var a = n(".tb-shop-cart"),
                    r = new o({
                        render: a
                    }),
                    s = !1;
                n("#J_TabShopCart").on("click", function(e) {
                    r.render(),
                        r.toggle(),
                        s || (n(document).on("click", function(e) {
                                a.contains(e.target) || a.equals(e.target) || r.hide()
                            }),
                            s = !0),
                        i("12.408")
                })
            }
        }),
        KISSY.add("item-detail/doctor/index", ["node", "../gl/", "ua"], function(e, t) {
            function n() {
                return a.ios || a.android
            }
            var i = t("node").all,
                o = t("../gl/"),
                a = t("ua");
            return {
                init: function() {
                    n() || e.use("doctor", function(e, t) {
                        var n = i("body");
                        n.on("doctor:screen:zoom", function(e) {
                                o("1024.10")
                            }),
                            n.on("doctor:screen:reset", function() {
                                o("1024.11")
                            });
                        new t({
                            check: ["zoom"]
                        })
                    })
                }
            }
        }),
        KISSY.add("item-detail/shortcuts/index", ["ua", "node"], function(e, t) {
            var n = t("ua"),
                i = t("node").all;
            n.webkit && Hub.add({
                name: "shortcuts",
                listen: {
                    load: "init"
                },
                instance: {
                    init: function() {
                        function t() {
                            e.use(["shortcuts"], function(e, n) {
                                t.loaded ? s.show() : (t.loaded = !0,
                                    s = new n,
                                    s.show(),
                                    i(".J_ShortcutsHideDialog", o).on("click", function() {
                                        s.hide()
                                    }))
                            })
                        }
                        var n = '<div style="border: 0;clip: rect(0 0 0 0);height: 1px;margin: -1px;overflow: hidden;padding: 0;position: absolute;width: 1px;">                <p>\u60a8\u53ef\u4ee5\u901a\u8fc7\u952e\u76d8\u5feb\u6377\u952e\u9009\u62e9\u64cd\u4f5c\u6216\u8fdb\u884c\u7ad9\u70b9\u5bfc\u822a\u3002</p>                <button class="J_ShortcutsShowDialog" tabindex="-1">\u663e\u793a\u5feb\u6377\u952e\u9762\u677f</button>                <button class="J_ShortcutsHideDialog" tabindex="-1">\u5173\u95ed\u5feb\u6377\u952e\u9762\u677f</button>                </div>',
                            o = i(n),
                            a = i("body"),
                            r = a.first();
                        r[0] ? r.before(o) : a.append(o),
                            i(document).on("keydown", function(e) {
                                var n = e.target,
                                    i = n.tagName;
                                e.shiftKey !== !0 || 191 !== e.keyCode || "INPUT" === i || "SELECT" === i || "TEXTAREA" === i || n.isContentEditable || (e.preventDefault(),
                                    t())
                            }),
                            i(".J_ShortcutsShowDialog", o).on("click", function() {
                                t()
                            });
                        var s
                    }
                }
            })
        }),
        KISSY.add("item-detail/favorite/index", ["node", "../tbtoken/", "../login/"], function(e, t) {
            var n = t("node").all,
                i = (n("body"),
                    t("../tbtoken/")),
                o = t("../login/");
            n(".J_TDialogTrigger").on("click", function(e) {
                e.preventDefault(),
                    o(function() {
                        var t = e.currentTarget,
                            n = t.getAttribute("href");
                        KISSY.use("favorite", function(e, t) {
                            i.setFavToken();
                            var o = new t({
                                url: n,
                                showEvent: !1,
                                callback: function(e) {}
                            });
                            o.show()
                        })
                    })
            })
        }),
        KISSY.add("item-detail/custommarket/index", ["dom", "node"], function(e, t) {
            function n(e) {
                if (e.contentWindow && e.contentWindow.document && e.contentWindow.document.getElementById("J_serviceId"))
                    return e.contentWindow.document.getElementById("J_serviceId").value
            }
            var i = t("dom"),
                o = t("node").all,
                a = o("body"),
                r = i.get("#J_CustomMarket");
            r && (a.fire("cart:params", {
                    params: function(e) {
                        var t = n(r);
                        return t ? "flushingPictureServiceId=" + g_config.itemId + "_" + (e.skuId || 0) + "_" + t : ""
                    }
                }),
                a.fire("buy:before", {
                    action: function(e) {
                        var t = i.get("#J_FrmBid"),
                            o = n(r);
                        if (o) {
                            var a = i.create('<input type="hidden" name="flushingPictureServiceId" value="' + g_config.itemId + "_" + (e.skuId || "0") + "_" + o + '"/>');
                            i.append(a, t)
                        } else
                            t.elements.flushingPictureServiceId && i.remove(t.elements.flushingPictureServiceId)
                    }
                }))
        }),
        KISSY.add("item-detail/relatemarket/index", ["dom", "io", "node"], function(e, t) {
            function n(t, n) {
                var i = '30 \u5929\u552e<a href="{reviewUrl}" target="_blank">{sellCount}</a>\u4ef6',
                    o = 0,
                    a = [];
                return e.each(n, function(n) {
                        var r = n.url,
                            s = n.monthSellCount,
                            c = e.substitute(i, {
                                sellCount: s,
                                reviewUrl: r.replace("&", "&on_comment=1&")
                            }),
                            l = "";
                        n.extMap && n.extMap.mark20141111 && (l = '<span class="tb-icon-201411"></span>',
                                n.extMap.price20141111 && (n.price = n.extMap.price20141111)),
                            a[o++] = e.substitute(t, {
                                url: r,
                                pic: n.pic,
                                desc: n.itemName,
                                price: parseFloat(n.price).toFixed(2),
                                sales: s ? c : "\u7b49\u4f60\u8d2d\u4e70",
                                icon: l
                            })
                    }),
                    a.join("")
            }

            function i(e) {
                return l.replace(/{{#each}}(.*){{\/each}}/, function(t, i) {
                    return n(i, e)
                })
            }

            function o(t) {
                d || new r({
                    url: t,
                    cache: !1,
                    type: "get",
                    dataType: "jsonp",
                    jsonpCallback: "jsonp_relatemarket",
                    success: function(t) {
                        if (e.isPlainObject(t)) {
                            var n, o = t.result;
                            t.spm;
                            d = !0,
                                e.isArray(o) && o.length && (n = a.create(i(o)),
                                    a.get("#J_CartInfo").appendChild(n))
                        }
                    },
                    timeout: 3
                })
            }
            var a = t("dom"),
                r = t("io"),
                s = t("node").all,
                c = s("body"),
                l = '<div class="tb-relate-market" data-spm="1001000"><h4>\u8d2d\u4e70\u6b64\u5b9d\u8d1d\u7684\u7528\u6237\u8fd8\u8d2d\u4e70\u4e86\uff1a</h4><ul>{{#each}}<li><div class="tb-pic tb-s80"><a href="{url}" target="_blank"><img src="{pic}_b.jpg" height="80" alt="{desc}" /></a></div><a class="tb-desc" href="{url}" title="{desc}" target="_blank">{desc}</a><span class="tb-price">&yen;<em>{price}</em></span><span class="tb-sales">{sales}</span><span class="tb-icon">{icon}</span></li>{{/each}}</ul></div>',
                d = !1;
            c.on("relatemarket:show", function() {
                var e = Hub.config.get("sku"),
                    t = e.apiRelateMarket;
                t && o(t)
            })
        }),
        KISSY.add("item-detail/report/index", ["node"], function(e, t) {
            var n = t("node").all,
                i = function() {
                    this.init()
                };
            i.prototype.init = function() {
                    var e = this;
                    e.bind()
                },
                i.prototype.bind = function() {
                    var e = n("#J_TEditItem");
                    e.delegate("click", "#J_Report", function(e) {
                        var t = n(e.currentTarget);
                        t.toggleClass("tb-report-hover")
                    })
                },
                new i
        }),
        KISSY.add("item-detail/tbcp/index", function(e) {
            function t() {
                "undefined" != typeof tbcpData && "undefined" != typeof tbcpConfig && e.available("#J_LinkBuy", function() {
                    e.getScript(tbcpConfig.url)
                })
            }
            t()
        }),
        KISSY.add("item-detail/o2oservice/index", ["log", "../config/", "node"], function(e, t) {
            var n = t("log").getLogger("o2o"),
                i = (t("../config/"),
                    t("node")),
                o = i.all,
                a = o("#J_O2OService");
            return {
                init: function() {
                    g_config.supportO2OService && a.length && e.use("cbase/p/o2o-service/tb-detail", {
                        success: function(e, t) {
                            try {
                                t.init({
                                    itemId: g_config.itemId,
                                    container: a
                                })
                            } catch (i) {
                                n.warn("Init failed: %s", i.message)
                            }
                        },
                        error: function(e) {
                            n.warn("Component load error: %s", e.message)
                        }
                    })
                }
            }
        }),
        KISSY.add("item-detail/skutip/index", ["log", "node", "../config/", "overlay", "event"], function(e, t) {
            var n = t("log").getLogger("skutip"),
                i = t("node").all,
                o = t("../config/"),
                a = (i("body"),
                    t("overlay")),
                r = t("event"),
                s = function() {
                    this.init()
                };
            return s.prototype.init = function() {
                    var e = Hub.config.get("sku").valItemInfo;
                    if (e && e.propertyMemoMap && (this.skuMemo = e.propertyMemoMap),
                        this.skuMemo)
                        try {
                            this._initColorTip()
                        } catch (t) {
                            n.warn("Init failed: %s", t.message)
                        }
                },
                s.prototype._initColorTip = function() {
                    var e = this;
                    if (i(".J_Prop_Color li").length) {
                        var t = new a({
                            elStyle: {
                                border: "1px solid #ccc",
                                color: "#3f3f3f",
                                padding: "5px",
                                background: "#fff"
                            }
                        });
                        r.delegate(".J_Prop_Color", "mouseenter", "li", function(n) {
                                var o = i(n.target),
                                    a = o.attr("data-value");
                                a || (o = o.parent("li"),
                                    a = o.attr("data-value"));
                                var r = e.skuMemo[a];
                                t.set("content", r),
                                    r && (t.set("align", {
                                            node: o,
                                            points: ["bl", "tl"],
                                            offset: [0, 5]
                                        }),
                                        t.show())
                            }),
                            r.delegate(".J_Prop_Color", "mouseleave", "li", function(e) {
                                t.hide()
                            })
                    }
                }, {
                    init: function() {
                        o.isTouch || new s
                    }
                }
        }),
        KISSY.add("item-detail/stepprice/stepprice-xtpl", function(e, t, n, i) {
            return function(e, t, n) {
                var o, a = "",
                    r = this.config,
                    s = this,
                    c = r.utils;
                "undefined" != typeof i && i.kissy && (o = i);
                var l = c.runBlockCommand,
                    d = c.renderOutput,
                    u = c.getProperty,
                    f = (c.runInlineCommand,
                        c.getPropertyOrRunCommand);
                a += '<div class="tb-clearfix tb-step-price">\n    <div class="tb-step-price-container">\n        <div class="tb-step-price-name">\u6279\u53d1\u4ef7</div>\n        <div class="tb-step-price-groups">\n            ';
                var p = {},
                    g = [],
                    m = u(s, e, "data", 0, 5);
                return g.push(m),
                    p.params = g,
                    p.fn = function(e) {
                        var t = "";
                        t += '\n            <div class="tb-step-price-group tb-step-price-group';
                        var n = f(s, e, {}, "xindex", 0, 6);
                        t += d(n, !0),
                            t += '">\n                <p><em class="tb-rmb">\xa5</em>';
                        var i = f(s, e, {}, "price", 0, 7);
                        t += d(i, !0),
                            t += "</p>\n                <p>";
                        var o = f(s, e, {}, "count", 0, 8);
                        return t += d(o, !0),
                            t += "</p>\n            </div>\n            "
                    },
                    a += l(s, e, p, "each", 5),
                    a += "\n        </div>\n    </div>\n</div>\n"
            }
        }),
        KISSY.add("item-detail/stepprice/index", ["node", "log", "xtemplate/runtime", "./stepprice-xtpl", "../config/"], function(e, t) {
            var n = t("node").all,
                i = t("log").getLogger("stepprice"),
                o = t("xtemplate/runtime"),
                a = t("./stepprice-xtpl"),
                r = t("../config/"),
                s = n("body"),
                c = n("#J_StepPrice");
            s.on("core:ready", function() {
                try {
                    l.init()
                } catch (e) {
                    i.warn("Init failed: %s", e.message)
                }
            });
            var l = {
                init: function() {
                    var e = this;
                    if (c.length) {
                        var t = g_config.stepPrice,
                            n = r.getPromoMap();
                        return t ? (this.update(t.def),
                            s.on("sku:found sku:changed", function(n) {
                                var i = ";" + n.sku.pvs + ";";
                                e.update(t[i])
                            }),
                            void s.on("sku:lost", function() {
                                e.update(t.def)
                            })) : void(n && (n.def && n.def.length > 0 && n.def[0].stepPrice && this.update(n.def[0].stepPrice),
                            s.on("sku:found sku:changed", function(t) {
                                var i = ";" + t.sku.pvs + ";";
                                n[i] && n[i][0] && e.update(n[i][0].stepPrice)
                            })))
                    }
                },
                update: function(e) {
                    try {
                        if (e && e.length) {
                            var t = new o(a).render({
                                data: e
                            });
                            c.html(t)
                        } else
                            c.html("")
                    } catch (n) {
                        i.warn("Exec error: %s", n.message)
                    }
                }
            }
        }),
        KISSY.add("item-detail/areaPrice/index", ["node", "io", "../config/"], function(e, t) {
            var n, i, o = (t("node"),
                    t("io")),
                a = t("../config/"),
                r = e.all,
                s = r("body"),
                c = {},
                l = a.getGlobalConfig("areaPriceApi");
            if (a.getGlobalConfig("areaPrice") && l) {
                var d = function(e) {
                    s.fire("price:update", {
                            id: "origin",
                            price: n[e].price
                        }),
                        i && i[e] && i[e].length || (c.price = n[e].price),
                        s.fire("cart:jump:params", {
                            params: c
                        })
                };
                s.on("delivery:changed", function(t) {
                        var r = l + "&" + e.param({
                            itemId: a.getItemId(),
                            areaId: t.deliveryId,
                            modules: "xmpPromotion,originalPrice"
                        });
                        o.jsonp(r, function(e) {
                            e && e.data && (e.data.promotion && e.data.promotion.promoData && (i = e.data.promotion.promoData,
                                    s.fire("promotion:reset", {
                                        newVal: i
                                    })),
                                e.data.originalPrice && (n = e.data.originalPrice,
                                    d("def")))
                        })
                    }),
                    s.on("sku:found sku:changed", function(e) {
                        d(";" + e.sku.pvs + ";")
                    }),
                    s.on("sku:lost", function() {
                        d("def")
                    })
            }
        }),
        KISSY.add("item-detail/toolbar/index", ["node", "../config/", "log"], function(e, t) {
            "use strict";
            var n = t("node").all,
                i = t("../config/"),
                o = t("log").getLogger("toolbar"),
                a = n("body");
            return {
                init: function() {
                    a.fire("resource:sib", {
                        success: function() {
                            try {
                                if (i.getActivityData("showSidebar")) {
                                    var t = n("#J_SiteNav");
                                    if (!t || !t.attr("data-component-config"))
                                        return;
                                    var a = t.attr("data-component-config").match(/\"sidebar\"\:\s?\"(.*)\"/);
                                    if (!a)
                                        return;
                                    var r = a[1];
                                    return void e.use("kg/sidebar/" + r + "/", function(e, t) {
                                        t.config("help", {
                                            url: "//survey.taobao.com/survey/QwE0mTiCx?type=1"
                                        });
                                        var n = new t({
                                            items: [{
                                                list: ["pagenav", "myasset", "my1111"]
                                            }, {
                                                list: ["ww", "cart", "history"]
                                            }, {
                                                list: ["help", "gotop"]
                                            }],
                                            zIndex: 100000002
                                        });
                                        n.render()
                                    })
                                }
                                e.use("kg/tbar/2.6.1/", function(e, t) {
                                    t.config("feedback", {
                                        url: "//survey.taobao.com/survey/QwE0mTiCx?type=1"
                                    });
                                    var n = new t({
                                        items: [{
                                            list: ["ww", "cart"],
                                            splitLine: !0
                                        }, {
                                            list: ["feedback", "gotop"]
                                        }]
                                    });
                                    n.render()
                                })
                            } catch (s) {
                                o.error("sidebar init error: %s", s.message)
                            }
                        }
                    })
                }
            }
        }),
        KISSY.add("item-detail/redeem/index", ["log", "node", "dom", "event", "../config/"], function(e, t) {
            var n = (t("log").getLogger("redeem"),
                    t("node").all),
                i = (n("body"),
                    t("dom")),
                o = t("event"),
                a = t("../config/"),
                r = a.getSkuConfig,
                s = "tb-selected",
                c = function() {
                    var e = i.get(".J_RedeemMethods");
                    if (e) {
                        var t = i.query("li", e);
                        if (t.length) {
                            i.addClass(t[0], s);
                            var n = i.create('<input type="hidden" name="etm" value="">');
                            i.append(n, r().form),
                                n.value = i.attr(t[0], "data-value"),
                                o.on(t, "click", function(e) {
                                    e.preventDefault();
                                    for (var o = e.target;
                                        "LI" !== o.tagName;)
                                        o = o.parentNode;
                                    i.hasClass(o, s) || (i.removeClass(t, s),
                                        i.addClass(o, s),
                                        n.value = i.attr(o, "data-value"))
                                })
                        }
                    }
                };
            return {
                init: c
            }
        }),
        KISSY.add("item-detail/underscore/index", function(e) {
            var t = Array.prototype,
                n = Object.prototype,
                i = Function.prototype,
                o = (t.push,
                    t.slice,
                    t.concat,
                    n.toString),
                a = (n.hasOwnProperty,
                    Array.isArray),
                r = (Object.keys,
                    i.bind, {});
            return r.isObject = function(e) {
                    var t = typeof e;
                    return "function" === t || "object" === t && !!e
                },
                r.isArray = a || function(e) {
                    return "[object Array]" === o.call(e)
                },
                r.once = function(e) {
                    var t, n = !1;
                    return function() {
                        return n ? t : (n = !0,
                            t = e.apply(this, arguments),
                            e = null,
                            t)
                    }
                },
                r.memoize = function(e, t) {
                    var n = {},
                        i = {};
                    t = t || function(e) {
                        return e
                    };
                    var o = function() {
                        var o = Array.prototype.slice.call(arguments),
                            a = o.pop(),
                            r = t.apply(null, o);
                        r in n ? a.apply(null, n[r]) : r in i ? i[r].push(a) : (i[r] = [a],
                            e.apply(null, o.concat([function() {
                                n[r] = arguments;
                                var e = i[r];
                                delete i[r];
                                for (var t = 0, o = e.length; t < o; t++)
                                    e[t].apply(null, arguments)
                            }])))
                    };
                    return o.unmemoized = e,
                        o
                },
                r.now = Date.now || function() {
                    return (new Date).getTime()
                },
                r.throttle = function(e, t, n) {
                    var i, o, a, s = null,
                        c = 0;
                    n || (n = {});
                    var l = function() {
                        c = n.leading === !1 ? 0 : r.now(),
                            s = null,
                            a = e.apply(i, o),
                            s || (i = o = null)
                    };
                    return function() {
                        var d = r.now();
                        c || n.leading !== !1 || (c = d);
                        var u = t - (d - c);
                        return i = this,
                            o = arguments,
                            u <= 0 || u > t ? (clearTimeout(s),
                                s = null,
                                c = d,
                                a = e.apply(i, o),
                                s || (i = o = null)) : s || n.trailing === !1 || (s = setTimeout(l, u)),
                            a
                    }
                },
                r.extend = function() {
                    var e, t, n, i, o, a, s = arguments[0] || {},
                        c = 1,
                        l = arguments.length,
                        d = !1;
                    for ("boolean" == typeof s && (d = s,
                            s = arguments[c] || {},
                            c++),
                        "object" != typeof s && (s = {}),
                        c === l && (s = this,
                            c--); c < l; c++)
                        if (null !== (e = arguments[c]))
                            for (t in e)
                                n = s[t],
                                i = e[t],
                                s !== i && (d && i && (r.isObject(i) || (o = r.isArray(i))) ? (o ? (o = !1,
                                        a = n && r.isArray(n) ? n : []) : a = n && r.isObject(n) ? n : {},
                                    s[t] = r.extend(d, a, i)) : void 0 !== i && (s[t] = i));
                    return s
                },
                r
        }),
        KISSY.add("item-detail/viewer/template/viewer-xtpl", function(e, t, n, i) {
            return function(e, t, n) {
                var o, a = "",
                    r = this.config,
                    s = this,
                    c = r.utils;
                "undefined" != typeof i && i.kissy && (o = i);
                var l = c.runBlockCommand,
                    d = c.renderOutput,
                    u = c.getProperty,
                    f = (c.runInlineCommand,
                        c.getPropertyOrRunCommand);
                a += '<div id="J_Viewer" class="tb-viewer" data-spm="20140017">\n    <a id="J_ViewerClose" href="javascript:;" class="tb-viewer-close"><i class="tb-viewer-icon">&#xe602;</i></a>\n    <div class="tb-viewer-control">\n        <a href="javascript:;" class="tb-viewer-control-left tb-viewer-icon" id="J_ViewerPrev">&#xe600;</a>\n    </div>\n\n    <div class="tab-content tb-viewer-contents">\n        ';
                var p = {},
                    g = [],
                    m = u(s, e, "images", 0, 8);
                g.push(m),
                    p.params = g,
                    p.fn = function(e) {
                        var t = "";
                        t += '\n        <div class="tab-pannel" id="tb-viewer-panel-';
                        var n = f(s, e, {}, "xindex", 0, 9);
                        return t += d(n, !0),
                            t += '">\n          <img class="tb-viewer-loading" src="//gtms02.alicdn.com/tps/i2/TB11TJPIFXXXXXyXpXXtMOdHXXX-50-50.gif" alt="\u56fe\u7247\u52a0\u8f7d\u4e2d"/>\n        </div>\n        '
                    },
                    a += l(s, e, p, "each", 8),
                    a += '\n    </div>\n    <div class="tb-viewer-control">\n        <a href="javascript:;" class="tb-viewer-control-right tb-viewer-icon" id="J_ViewerNext">&#xe601;</a>\n    </div>\n\n    <div class="tb-viewer-side">\n        <h3 class="tb-viewer-title">';
                var h = f(s, e, {}, "title", 0, 19);
                a += d(h, !0),
                    a += '</h3>\n        <ul class="tab-nav tb-viewer-indicators">\n            ';
                var v = {},
                    b = [],
                    k = u(s, e, "images", 0, 21);
                b.push(k),
                    v.params = b,
                    v.fn = function(e) {
                        var t = "";
                        t += '\n            <li class="tb-viewer-thumb" id="J_TbViewerThumb-';
                        var n = f(s, e, {}, "xindex", 0, 22);
                        t += d(n, !0),
                            t += '" data-index="';
                        var i = f(s, e, {}, "xindex", 0, 22);
                        t += d(i, !0),
                            t += '"><img src="';
                        var o = f(s, e, {}, "this", 0, 22);
                        return t += d(o, !1),
                            t += '_50x50.jpg"></li>\n            '
                    },
                    a += l(s, e, v, "each", 21),
                    a += "\n        </ul>\n        ";
                var y = {},
                    w = [],
                    X = u(s, e, "enableAddToCart", 0, 25);
                w.push(X),
                    y.params = w,
                    y.fn = function(e) {
                        var t = "";
                        return t += '\n        <a href="javascript:;" role="button" data-spm-click="gostr=/tbdetail;locaid=d1" role="button" id="J_ViewerAddCart" class="tb-viewer-btn"><i class="tb-viewer-icon">&#xe604; </i>\u52a0\u5165\u8d2d\u7269\u8f66</a>\n        '
                    },
                    a += l(s, e, y, "if", 25),
                    a += '\n        <a href="//www.taobao.com/market/2014/similar.php?itemid=';
                var S = f(s, e, {}, "itemId", 0, 28);
                return a += d(S, !0),
                    a += '" target="_blank" data-spm-click="gostr=/tbdetail;locaid=d2" class="tb-viewer-link"><i class="tb-viewer-icon">&#xe603; </i>\u672c\u5e97\u76f8\u4f3c\u5b9d\u8d1d</a>\n    </div>\n</div>\n'
            }
        }),
        KISSY.add("item-detail/viewer/index", ["node", "event", "anim", "ua", "../underscore/", "../config/", "xtemplate", "overlay", "./template/viewer-xtpl", "../gl/"], function(e, t) {
            function n(e, t) {
                t = t || g;
                var n = {
                    top: t.scrollTop(),
                    left: t.scrollLeft()
                };
                n.right = n.left + t.width(),
                    n.bottom = n.top + t.height();
                var i = e.offset();
                return i.right = i.left + e.outerWidth(),
                    i.bottom = i.top + e.outerHeight(),
                    !(n.right < i.left || n.left > i.right || n.bottom < i.top || n.top > i.bottom)
            }

            function i() {
                this.images = this.getImagesFromDOM()
            }
            var o = t("node").all,
                a = o("body"),
                r = t("event"),
                s = (t("anim"),
                    t("ua")),
                c = t("../underscore/"),
                l = t("../config/"),
                d = t("xtemplate"),
                u = t("overlay"),
                f = t("./template/viewer-xtpl"),
                p = t("../gl/"),
                g = o(window);
            i.prototype = {
                getTitleFromDOM: function() {
                    return o(".tb-main-title").text()
                },
                getImagesFromDOM: function() {
                    var t = o("#J_UlThumb img"),
                        n = [];
                    return 0 === t.length ? (p("229.3"),
                            n = l.getItemConfig("auctionImages") || []) : (e.map(t, function(e) {
                                var t = o(e).attr("data-src");
                                t && n.push(t.replace(/_\d0x\d0\.jpg(_\.webp)?$/g, ""))
                            }),
                            p("229.4")),
                        n
                },
                show: function(e) {
                    e || (e = 0),
                        p("229.0"),
                        this.render(),
                        this.overlay.show(),
                        this.bind(e);
                    o("#tb-viewer-panel-" + e);
                    this.loadImg(e)
                },
                hide: function() {
                    this.overlay.hide()
                },
                render: function() {
                    if (!this.rendered) {
                        var e = new d(f).render({
                                images: this.images,
                                title: this.getTitleFromDOM(),
                                itemId: l.getGlobalConfig().itemId,
                                enableAddToCart: !l.getItemConfig("disableAddToCart") || !l.getItemConfig("disableAddToCart")
                            }),
                            t = new u({
                                content: e,
                                elCls: "tb-viewer-overlay",
                                align: {
                                    points: ["cc", "cc"]
                                },
                                mask: {
                                    effect: "fade",
                                    closeOnClick: !0
                                },
                                zIndex: 100000021
                            });
                        this.overlay = t,
                            this.rendered = !0
                    }
                },
                loadImg: function(e, t) {
                    p("229.1");
                    var n = this;
                    o("#J_Viewer .tab-pannel").hide();
                    var i = o("#J_Viewer .tab-pannel")[e];
                    n.currentIndex = e,
                        t ? (n.currentIndex = o(".tb-viewer-indicators .selected").attr("data-index"),
                            e === n.currentIndex && (o(".tb-viewer-indicators .tb-viewer-thumb").removeClass("selected"),
                                o("#J_TbViewerThumb-" + e).addClass("selected"))) : (o(".tb-viewer-indicators .tb-viewer-thumb").removeClass("selected"),
                            o("#J_TbViewerThumb-" + e).addClass("selected"));
                    var a = o(o("#J_Viewer .tab-pannel")[n.currentIndex]);
                    if (o("#J_Tb-Viewer-Original-" + n.currentIndex).length > 0 || e !== n.currentIndex)
                        return void a.show();
                    p("229.11");
                    var r = new Image;
                    if (r.id = "J_Tb-Viewer-Original-" + e,
                        r.onload = function() {
                            var t = o(this),
                                i = t.width(),
                                a = t.height(),
                                r = n.$divWidth,
                                s = n.$divHeight;
                            if (0 === i || 0 === a)
                                t.remove(),
                                setTimeout(function() {
                                    n.loadImg(e, !0)
                                }, 1e3);
                            else {
                                var c, l;
                                i > r || a > s ? i > a ? (c = r / i * a,
                                        t.css({
                                            width: "100%",
                                            height: c,
                                            left: "0",
                                            top: (s - c) / 2
                                        })) : (l = s / a * i,
                                        t.css({
                                            width: l,
                                            height: "100%",
                                            left: (r - l) / 2,
                                            top: "0"
                                        })) : t.css({
                                        height: a,
                                        width: i,
                                        left: (r - i) / 2,
                                        top: (s - a) / 2
                                    }),
                                    o("#J_Tb-Viewer-Loading-" + e).hide(),
                                    t.show()
                            }
                        },
                        r.src = n.images[e],
                        0 === o("#J_Tb-Viewer-Original-" + e).length && (o(i).append(r),
                            o(i).children(".tb-viewer-loading").id = "J_Tb-Viewer-Loading" + e),
                        t || o(i).append('<a class="tb-viewer-original-pic" href="' + r.src + '" target="_blank">\u67e5\u770b\u539f\u56fe</a>'),
                        !n.calculateLoadingPosition) {
                        var s = o(".tb-viewer-loading").width(),
                            c = o(".tb-viewer-loading").height();
                        o(".tb-viewer-loading").css({
                                left: (o(".tb-viewer-contents").width() - s) / 2,
                                top: (o(".tb-viewer-contents").height() - c) / 2
                            }),
                            n.calculateLoadingPosition = !0
                    }
                    a.show()
                },
                bind: function(e) {
                    if (!this.binded) {
                        var t = this,
                            i = o(".tb-viewer-indicators .tb-viewer-thumb");
                        i.on("mouseover", function(e) {
                            i.removeClass("selected");
                            var n = o(e.currentTarget);
                            n.addClass("selected");
                            var a = n.attr("data-index");
                            t.loadImg(a)
                        });
                        var r = o(".tb-viewer-indicators .tb-viewer-thumb"),
                            s = o("#J_Viewer .tb-viewer-contents"),
                            l = s.width(),
                            d = s.height();
                        t.$div = s,
                            t.$divWidth = l,
                            t.$divHeight = d,
                            t.thumbLength = r.length - 1,
                            t.loadImg(e),
                            o(".tab-pannel").on("mouseenter", function(e) {
                                var t = o(e.currentTarget);
                                t.children(".tb-viewer-original-pic").show()
                            }).on("mouseleave", function(e) {
                                var t = o(e.currentTarget);
                                t.children(".tb-viewer-original-pic").hide()
                            }),
                            o(".tb-viewer-original-pic").on("click", function() {
                                p("229.5")
                            }),
                            o("#J_ViewerPrev").on("click", function(e) {
                                e.halt();
                                var n = parseInt(o(".tb-viewer-indicators .selected").attr("data-index"));
                                0 === n ? n = t.thumbLength : n -= 1,
                                    t.loadImg(n)
                            }),
                            o("#J_ViewerNext").on("click", function(e) {
                                e.halt();
                                var n = parseInt(o(".tb-viewer-indicators .selected").attr("data-index"));
                                n === t.thumbLength ? n = 0 : n += 1,
                                    t.loadImg(n)
                            }),
                            o("#J_ViewerClose").on("click", function(e) {
                                e.halt(),
                                    t.overlay.hide()
                            }),
                            o("#J_ViewerAddCart").on("click", function() {
                                a.fire("cart:click"),
                                    t.overlay.hide()
                            });
                        var u = o(".tb-viewer-overlay");
                        g.on("scroll", c.throttle(function() {
                                n(u) || t.overlay.hide()
                            }, 100)),
                            this.binded = !0
                    }
                }
            };
            var m = new i;
            a.on("viewer:show", function(e) {
                    m.show(e.url)
                }),
                a.on("viewer:hide", function(e) {
                    m.hide()
                }),
                s.ie && s.ie < 8 || l.getItemConfig("auctionImages") && (o(".tb-booth > a").on("click", function(e) {
                        var t = o(".tb-selected").attr("data-index");
                        e.preventDefault(),
                            m.show(t)
                    }),
                    e.available("#J_UlThumb", function(e) {
                        o(o(e).children(".tb-selected"));
                        r.delegate("#J_UlThumb", "click", ".tb-selected", function(e) {
                            var t = o(e.currentTarget).attr("data-index");
                            e.preventDefault(),
                                m.show(t)
                        })
                    }))
        }),
        KISSY.add("item-detail/wangpu/index", ["node", "ua", "log", "../config/"], function(e, t) {
            function n() {
                return o.ios || o.android
            }
            var i = t("node").all,
                o = t("ua"),
                a = i("body"),
                r = t("log").getLogger("wangpu"),
                s = t("../config/"),
                c = {
                    init: function() {
                        try {
                            var t = Hub.config.get("async_dc") || {},
                                o = t.api;
                            if (!o || n() || location.href.indexOf("force=true") > -1)
                                return i("#J_DcHead").hide(),
                                    e.all(".tb-switch-bar").hide(),
                                    void a.fire("switcher:expand");
                            e.use("wangpu/hdc-bridge", function(e, t) {
                                t.init({
                                    async_dc: Hub.config.get("async_dc"),
                                    isv: Hub.config.get("isv"),
                                    showShopHeader: s.isCustomShopHeader,
                                    itemType: s.getItemType()
                                })
                            })
                        } catch (c) {
                            r.warn("wangpu init failed: %s", c.message)
                        }
                        s.isMS && a.fire("switcher:expand")
                    }
                };
            return c
        }),
        KISSY.add("item-detail/activity/bigpromotion/index", ["log", "node", "../../config/"], function(e, t) {
            var n = t("log").getLogger("activity"),
                i = t("node"),
                o = i.all,
                a = o("body"),
                r = t("../../config/");
            a.fire("resource:sib", {
                success: function() {
                    try {
                        s.init()
                    } catch (e) {
                        n.error("Big promotion init error: %s", e.message)
                    }
                }
            });
            var s = {
                init: function() {
                    var e = r.getActivityData();
                    if (e) {
                        var t = e.priceIcon,
                            n = "";
                        if (e.bigMarkdownAtmosphere) {
                            if (this._initNewBaner(e.bigMarkdownAtmosphere),
                                e.bigMarkdownAtmosphere.iconInfo) {
                                var i = e.bigMarkdownAtmosphere.iconInfo.iconUrl;
                                t = [i, i]
                            }
                            n = e.bigMarkdownAtmosphere.priceTitle || ""
                        } else
                            this._initBanner(e.bigpromotion);
                        this._initPrice(e.price, t, n),
                            e.background && this._initBackGround(),
                            this._initTitleIcon(e.titleIcon),
                            e.priceText && a.fire("price:update", {
                                id: "promotion",
                                name: e.priceText
                            })
                    }
                },
                _initNewBaner: function(e) {
                    function t(e) {
                        if (e) {
                            var t = '<div class="J_BigProm tb-big-prom"><img class="tb-big-prom-img" src="' + e + '"/></div>';
                            n.append(t),
                                n.addClass("tb-banner-in-promotion")
                        }
                    }
                    if (e) {
                        var n = r.getBannerEl();
                        n.length && e.bgIconInfo && t(e.bgIconInfo.iconUrl)
                    }
                },
                _initBanner: function(t) {
                    function i(e) {
                        if (e) {
                            var t = "";
                            t = e[1] ? '<div class="J_BigProm tb-big-prom"><img class="tb-big-prom-img tb-big-prom-img-normal" src="' + e[0] + '"/><img class="tb-big-prom-img-w990" src="' + e[1] + '"/></div>' : '<div class="J_BigProm tb-big-prom"><img class="tb-big-prom-img" src="' + e[0] + '"/></div>',
                                o.append(t),
                                o.addClass("tb-banner-in-promotion")
                        }
                    }
                    if (e.isArray(t) && t.length) {
                        var o = r.getBannerEl();
                        if (o.length) {
                            var a = Number(r.getNow());
                            t.reverse(),
                                e.each(t, function(e) {
                                    var t = e.time;
                                    if (a >= t)
                                        return n.info("Show big promotion stage %s", e.type),
                                            i(e.img),
                                            !1
                                })
                        }
                    }
                },
                _initPrice: function(e, t, n) {
                    if (e && t) {
                        var i = o("#J_ActivityPrice");
                        if (i.length) {
                            i.html('<span class="tb-property-type">' + n + '</span><div class="tb-activity-price"><img src="' + t[0] + '" srcset="' + t[0] + " 1x, " + t[1] + ' 2x"/><em class="tb-rmb">&yen;</em><span class="tb-rmb-num">' + e.def + "</span></div>");
                            var r = i.one(".tb-rmb-num");
                            a.on("sku:found sku:changed", function(t) {
                                    var n = t.sku,
                                        i = n.pvs,
                                        o = e[i] ? e[i] : e.def;
                                    r.html(o)
                                }),
                                a.on("sku:lost", function() {
                                    r.html(e.def)
                                })
                        }
                    }
                },
                _initBackGround: function() {
                    if (o(window).width() >= 1140) {
                        var e = "//gtms04.alicdn.com/tps/i4/TB1oy9fKpXXXXc2XpXXY79NVFXX-100-630.png",
                            t = "//gtms02.alicdn.com/tps/i2/TB1V2qoKpXXXXXdXpXXY79NVFXX-100-630.png";
                        o("#detail").prepend('<img class="tb-bigpromotion-bg-left" src="' + e + '"/>'),
                            o("#detail").prepend('<img class="tb-bigpromotion-bg-right" src="' + t + '"/>')
                    }
                },
                _initTitleIcon: function(e) {
                    if (e && e.length) {
                        var t = e[0];
                        r.isRetina && e[1] && (t = e[1]),
                            o(".tb-main-title").prepend('<img src="' + t + '" class="tb-bigpromotion-title-icon"/>')
                    }
                }
            }
        }),
        KISSY.add("item-detail/shoplab/index", ["dom", "../gl/", "datalazyload"], function(e, t) {
            var n = t("dom"),
                i = t("../gl/"),
                o = t("datalazyload"),
                a = Hub.config.get("shopLab");
            if (a) {
                var r = n.create('<div id="J_ShopLab" style="max-height: 400px;overflow: hidden"></div>'),
                    s = a.isInTop ? "insertBefore" : "insertAfter",
                    c = a.isInTop ? 1 : 0,
                    l = Math.random() > .5 ? "1" : "0",
                    d = a.url + "&basic=" + l;
                e.jsonp(d, function(t) {
                    if (1 === t.state) {
                        n.html(r, t.data.content);
                        var a = e.all("a", r);
                        a.each(function(e) {
                                e[0].href += (~e[0].href.indexOf("?") ? "&" : "?") + "spm=2013.1.2.7"
                            }),
                            n.remove("#J_AsyncDCMain"),
                            n[s](r, "#J_DivItemDesc"),
                            new o(r),
                            i("2315213?num=" + a.length + "&ver=" + t.data.version + "&pos=" + c),
                            e.all("a", "#J_DivItemDesc").each(function(e) {
                                e[0].href += (~e[0].href.indexOf("?") ? "&" : "?") + "spm=2013.1.2.6"
                            })
                    }
                })
            }
        }),
        KISSY.add("item-detail/reminder/index", ["node", "log", "xtemplate", "../config/"], function(e, t) {
            function n(e) {
                if (e && 0 !== e.length) {
                    var t = '<dl><dt>\u63d0\u9192</dt><dd style="line-height: 22px;color: #6c6c6c;">{{#each reminders}}<p>{{this}}</p>{{/each}}</dd></dl>',
                        n = new a(t).render({
                            reminders: e
                        });
                    i("#J_tbExtra").append(n)
                }
            }
            var i = t("node").all,
                o = t("log").getLogger("reminder"),
                a = t("xtemplate"),
                r = t("../config/"),
                s = i("body");
            s.fire("resource:sib", {
                success: function() {
                    try {
                        var e = r.getGlobalConfig("contract");
                        e && e.tips && n(e.tips)
                    } catch (t) {
                        o.warn("Init failed: %s", t.message)
                    }
                }
            })
        }),
        KISSY.add("item-detail/timing/index", ["node", "base"], function(e, t, n, i) {
            var o = t("node"),
                a = t("base"),
                r = o.all,
                s = r("body"),
                c = a.extend({
                    initializer: function() {
                        var e = this;
                        try {
                            r(window).on("load", function() {
                                e.sendTiming()
                            })
                        } catch (t) {
                            s.fire("track", {
                                msg: {
                                    url: location.href,
                                    err: t
                                },
                                category: "timing:init:false"
                            })
                        }
                    },
                    sendTiming: function() {
                        var t = window.performance || window.msPerformance || window.webkitPerformance || window.mozPerformance;
                        if (t && t.timing) {
                            var n = t.timing;
                            if (e.each({
                                    appCache: n.domainLookupStart - n.fetchStart,
                                    dns: n.domainLookupEnd - n.domainLookupStart,
                                    connect: n.connectEnd - n.connectStart,
                                    ttfb: n.responseStart - n.connectEnd,
                                    response: n.responseEnd - n.responseStart,
                                    domReady: n.domContentLoadedEventEnd - n.responseEnd
                                }, function(e, t) {
                                    e > 0 && s.fire("track", {
                                        url: "//item.taobao.com/track/timing/",
                                        msg: {
                                            url: location.href
                                        },
                                        delay: e,
                                        category: t
                                    })
                                }),
                                n.msFirstPaint && n.navigationStart && s.fire("track", {
                                    url: "//item.taobao.com/track/timing/",
                                    msg: {
                                        url: location.href
                                    },
                                    delay: parseInt(n.msFirstPaint) - parseInt(n.navigationStart),
                                    category: "ieFirstPaint"
                                }),
                                window.chrome && window.chrome.loadTimes) {
                                var i = window.chrome.loadTimes();
                                i.firstPaintTime && i.requestTime && s.fire("track", {
                                    url: "//item.taobao.com/track/timing/",
                                    msg: {
                                        url: location.href
                                    },
                                    delay: parseInt(i.firstPaintTime) - parseInt(i.requestTime),
                                    category: "chromeFirstPaint"
                                })
                            }
                        }
                    }
                });
            return new c,
                c
        }),
        KISSY.add("item-detail/auto/index", ["log", "dom", "node", "xtemplate"], function(e, t) {
            function n(t) {
                var n = this;
                e.mix(n, {
                        domain: "l_" + e.guid(),
                        config: t,
                        _data: null,
                        _dataHash: {},
                        _curNode: null
                    }),
                    n.loadData(n.config.data),
                    n.init()
            }

            function i(e) {
                return function() {
                    o.info("Method %s not implement", e)
                }
            }
            var o = t("log").getLogger("auto"),
                a = t("dom"),
                r = t("node").all,
                s = r("body"),
                c = t("xtemplate");
            e.mix(n.prototype, {
                setCurNode: function(e, t) {
                    var n = this;
                    n._curNode = e,
                        t || n.ui_setCurNode(e)
                },
                getCurNode: function() {
                    var e = this;
                    return e._curNode
                },
                getParents: function(e) {
                    for (var t = this, n = [], i = e; i._pid && (i = t._dataHash[i._pid]);)
                        n.push(i);
                    return n
                },
                getNodePath: function(e) {
                    var t = this,
                        n = null;
                    return n = t.getParents(e),
                        n.reverse(),
                        n.push(e),
                        n
                },
                inNodePath: function(t, n) {
                    var i = this,
                        o = i.getNodePath(n);
                    return e.inArray(t, o)
                },
                getRoot: function() {
                    var e = this;
                    return e._data
                },
                getNode: function(e) {
                    var t = this;
                    return t._dataHash[e]
                },
                isLastLevel: function(e) {
                    if (e.childs)
                        for (var t = 0, n = e.childs.length; t < n; t++)
                            if (e.childs[t].childs)
                                return !1;
                    return !0
                },
                loadData: function(t) {
                    function n(t, o) {
                        var a = e.guid();
                        if (t._id = a,
                            i._dataHash[a] = t,
                            o && (t._pid = o),
                            t.childs)
                            for (var r = 0, s = t.childs.length; r < s; r++)
                                n(t.childs[r], a)
                    }
                    var i = this,
                        o = e.clone(t);
                    n(o),
                        i._data = o
                },
                reset: function() {
                    var e = this;
                    e.setCurNode(null, !0),
                        e.ui_reset()
                },
                init: function() {
                    var e = this;
                    e.ui_init()
                },
                ui_init: i("ui_init"),
                ui_setCurNode: i("ui_setCurNode"),
                ui_reset: i("ui_setCurNode")
            });
            var l = '<ul>{{#each childs}}<li data-nodeID="{{_id}}" class="li-id-{{_id}}" ><span class="icon-pinyin" >{{firstPinyin}}</span><a href="#">{{name}}<i></i><span class="tb-auto-arr" ></span></a></li>{{/each}}</ul>',
                d = e.extend(function(t) {
                    function i(e) {
                        e.all(".tb-auto-popup-container").css("overflow", "visible"),
                            "none" !== e.all(".tb-auto-popup-scrollbar").css("display") ? e.addClass("tb-auto-col-has-scr") : e.removeClass("tb-auto-col-has-scr")
                    }

                    function o(t) {
                        var n, o, a, r, s, f = t || u.getCurNode();
                        n = f ? u.getNodePath(f) : [u.getRoot()],
                            d = f;
                        for (var m = 0, h = n.length, v = Math.max(h, p.length); m < v; m++)
                            if (m < h && n[m].childs) {
                                if (o = n[m],
                                    o.childs) {
                                    if (p[m] || (a = e.all('<div style="display:none" class="tb-auto-sku-popup-col tb-auto-sku-popup-lv-' + (m + 1) + '" ><h5>{{childLevelName}}</h5><div class="tb-auto-sku-popup-inner tb-clearfix"></div></div>'),
                                            p[m] = a,
                                            function(t) {
                                                e.use("kscroll", function(e, n) {
                                                    var o = new n(t.all(".tb-auto-sku-popup-inner"), {
                                                        prefix: "tb-auto-popup-",
                                                        hotkey: !0,
                                                        bodydrag: !1,
                                                        allowArrow: !0
                                                    });
                                                    t.data("kscr", o),
                                                        t.all(".tb-auto-popup-container").attr("hidefocus", "on"),
                                                        t.all(".tb-auto-popup-container").append(t.all("h5")).siblings("h5").remove(),
                                                        i(t)
                                                })
                                            }(a),
                                            g.append(a)),
                                        a = p[m],
                                        s = a.data("lv_id") !== o._id) {
                                        var b = new c(l).render(o);
                                        a.all(".tb-auto-sku-popup-inner").html(b),
                                            a.all("h5").text(o.childLevelName)
                                    } else
                                        a.all(".selected").removeClass("selected");
                                    u.isLastLevel(o) ? a.addClass("tb-auto-sku-popup-col-leaf") : a.removeClass("tb-auto-sku-popup-col-leaf"),
                                        r = n[m + 1],
                                        r && a.all(".li-id-" + r._id).addClass("selected"),
                                        a.show();
                                    var k = a.data("kscr");
                                    s && k && (k.resize(),
                                            k.scrollByPercent(0),
                                            i(a)),
                                        a.data("lv_id", o._id)
                                }
                            } else
                                (a = p[m]) && a.hide()
                    }

                    function r() {
                        m || (f.detach("click", r),
                            e.use("overlay", function(e, t) {
                                function n(e) {
                                    a.contains(g, e.target) || a.contains(f.parent(), e.target) || s.hide()
                                }
                                s = new t.Popup({
                                        trigger: f,
                                        elCls: "tb-auto-sku-popup",
                                        content: '<div class="J_ShimRoot" ></div>',
                                        toggle: !0
                                    }),
                                    s.on("beforeVisibleChange", function(e) {
                                        e.newVal && s.align(f, ["bl", "tl"], [0, 0])
                                    }),
                                    s.on("show", function(t) {
                                        o(),
                                            a.addClass(f, "tb-auto-drop"),
                                            e.all(document.body).on("mousedown", n)
                                    }),
                                    s.on("hide", function(t) {
                                        a.removeClass(f, "tb-auto-drop"),
                                            e.all(document.body).detach("mousedown", n)
                                    }),
                                    o(),
                                    s.render(),
                                    e.all(s.el).all(".J_ShimRoot").append(g),
                                    s.show(),
                                    m = !1
                            }))
                    }
                    var s, d, u = this,
                        f = e.all(t.trigger),
                        p = [],
                        g = ([].join(""),
                            e.all('<div class="tb-auto-sku-popup-set"></div>')),
                        m = !1;
                    f.on("click", r),
                        g.delegate("click", "li", function(t) {
                            t.preventDefault();
                            var n = e.all(t.currentTarget),
                                i = 0 | n.attr("data-nodeid"),
                                a = u.getNode(i);
                            d && a.childs && u.inNodePath(a, d) || (o(a),
                                u.config.ev_afterPickedNode.call(u, a, function(e) {
                                    e && u.setCurNode(e)
                                }))
                        }),
                        u.ui_setCurNode = function(e) {
                            s.hide(),
                                u.config.ev_afterSetCurNode(e)
                        },
                        u.ui_reset = function() {
                            o()
                        },
                        u.ui_init = function() {},
                        n.apply(u, arguments)
                }, n),
                u = function() {
                    var t;
                    return {
                        init: function() {
                            function n(t) {
                                e.each(e.map(t, function(t, n) {
                                    var i = e.all("#J_selected_auto_" + n);
                                    return t ? (i.attr("data-value", t.id),
                                        s.fire("auto:clearpvid", {
                                            trigger: a.get("a", i)
                                        }),
                                        function() {
                                            i.addClass("tb-selected").removeClass("tb-out-of-stock").all("span").text(t.name),
                                                s.fire("auto:change", {
                                                    trigger: a.get("a", i)
                                                })
                                        }
                                    ) : (i.attr("data-value", ""),
                                        function() {
                                            i.removeClass("tb-selected").removeClass("tb-out-of-stock"),
                                                s.fire("auto:clearpvid", {
                                                    trigger: a.get("a", i)
                                                })
                                        }
                                    )
                                }), function(e) {
                                    e()
                                })
                            }

                            function i() {
                                var e = t.getRoot();
                                c || t.setCurNode(e.childs[0].childs[0], !0)
                            }
                            var o = this,
                                r = (Hub.config.get("sku").valItemInfo || 0).carList,
                                c = null,
                                l = e.all("#J_ChooseAutoBrand");
                            if (l.length && r) {
                                if (l.length && 200 !== r.code)
                                    return void l.replaceWith("<span>\u5b9d\u8d1d\u5f02\u5e38\u8bf7\u8054\u7cfb\u5356\u5bb6</span>");
                                r = function(t) {
                                    function n(t) {
                                        t.childs && (t.childLevelName = t.childs[0].levelName,
                                            e.each(t.childs, function(e, i) {
                                                var o = t.childs[i - 1] || 0;
                                                e.pinyinName !== o.pinyinName && (e.firstPinyin = e.pinyinName),
                                                    n(e)
                                            }))
                                    }
                                    return n(t),
                                        t
                                }(r);
                                var u = "";
                                s.on("sku:ready", function() {
                                        s.on("auto:change", function(e) {
                                            var t = a.parent(e.trigger),
                                                n = u.split(";");
                                            n.push(a.attr(t, "data-value")),
                                                s.fire("sku:set", {
                                                    pvs: n.join(";")
                                                })
                                        })
                                    }),
                                    s.on("sku:selectionChanged", function(e) {
                                        u = e.sku.pvs
                                    }),
                                    t = new d({
                                        trigger: l,
                                        data: r,
                                        ev_afterPickedNode: function(e, t) {
                                            e.childs || t(e, e.name)
                                        },
                                        ev_afterSetCurNode: function(i) {
                                            var o, a = t.getNodePath(i).slice(1),
                                                r = [],
                                                s = 23,
                                                c = a.slice(0);
                                            for (r.unshift(c.pop().name); o = c.pop();)
                                                r.unshift(o.name),
                                                e.reduce(r, function(e, t) {
                                                    return e + t.length
                                                }) + o.length > s && r.shift();
                                            l.html(r.join(" ") + "<i></i>"),
                                                n(a),
                                                l.addClass("tb-auto-selected")
                                        }
                                    }),
                                    i(),
                                    o.resetBrand = function() {
                                        l.html(l.attr("data-text") + "<i></i>"),
                                            t.reset(),
                                            i(),
                                            n(e.map(e.all(".J_isAutoProp"), function() {
                                                return null
                                            })),
                                            l.removeClass("tb-auto-selected")
                                    },
                                    s.on("auto:reset", o.resetBrand),
                                    o.is = !0
                            }
                        }
                    }
                }();
            return u
        }),
        KISSY.add("item-detail/ju/index", ["log", "node", "../config/"], function(e, t) {
            function n(e) {
                var t = new Date(e),
                    n = t.getMinutes();
                return n < 10 && (n = "0" + n),
                    t.getMonth() + 1 + "\u6708" + t.getDate() + "\u65e5 " + t.getHours() + ":" + n
            }

            function i(e) {
                var t, n = parseInt(e / l);
                t = e % l;
                var i = parseInt(t / d);
                t %= d;
                var o = parseInt(t / u);
                return n ? n + "\u5929" + i + "\u5c0f\u65f6" : i ? i + "\u5c0f\u65f6" + o + "\u5206" : o + 1 + "\u5206"
            }
            var o = t("log").getLogger("ju"),
                a = t("node"),
                r = a.all,
                s = r("body"),
                c = t("../config/"),
                l = 864e5,
                d = 36e5,
                u = 6e4,
                f = location.href.replace(/#.*/gi, ""),
                p = e.unparam(f.split("?")[1]);
            p.key && s.fire("buy:params", {
                    params: function() {
                        return {
                            key: p.key
                        }
                    }
                }),
                s.fire("resource:sib", {
                    success: function() {
                        try {
                            var t = r("#J_juValid");
                            c.getPromoInfo("notAvailable") && t.length && (t.removeClass(),
                                t.html(c.getPromoInfo("notAvailable")));
                            var a = c.getPromoInfo("jhsAtmosphere");
                            if (!a || e.isEmptyObject(a))
                                return;
                            var s = c.getBannerEl();
                            if (!s.length)
                                return;
                            var l, d = c.getNow();
                            if ("start" === a.period)
                                l = '<div class="tb-banner-ju tb-ju-start"><div class="tb-iconfont tb-ju-icon">&#xe60c;</div>\u6b64\u5546\u54c1\u6b63\u5728\u53c2\u52a0\u805a\u5212\u7b97\uff0c<strong>' + i(a.end - d) + '</strong>\u540e\u7ed3\u675f<span class="tb-ju-more">\uff0c\u8bf7\u5c3d\u5feb\u8d2d\u4e70\uff01</span></div>';
                            else if ("pre" === a.period) {
                                var u = c.getItemConfig("jurl");
                                l = '<div class="tb-banner-ju tb-ju-pre"><a href="' + u + '" target="_blank"><div class="tb-iconfont tb-ju-icon">&#xe60c;</div>\u6b64\u5546\u54c1<strong class="tb-ju-more">' + n(a.start) + "</strong>\u53c2\u52a0\u805a\u5212\u7b97\uff0c\u805a\u5212\u7b97\u4ef7:<strong>" + a.price + "</strong>\u5143" + (a.rangeMoney ? "\u8d77" : "") + '<span class="tb-iconfont">&#xe60d;</span></a></div>'
                            }
                            l && (l += '<div class="tb-iconfont tb-ju-logo">&#xe60f;</div>',
                                s.append(l))
                        } catch (f) {
                            o.error("ju init error: %s", f.message)
                        }
                    }
                })
        }),
        KISSY.add("item-detail/duty/index", ["node"], function(e, t) {
            function n(e) {
                if (r = s("#J_Duty"),
                    r.length && e.title && e.rates) {
                    var t = e.title,
                        n = e.rates;
                    r.addClass("tb-clear tb-duty"),
                        r.append('<span class="tb-property-type">' + t + '</span><div class="tb-property-cont"><span class="tb-duty-rate">' + n.def + '</span><a class="tb-duty-rule-trigger" href="#">\u603b\u4ef7\u89c4\u5219</a><div class="tb-duty-rule-content"><p>\u4e2d\u56fd\u6d77\u5173\u89c4\u5b9a\u8fdb\u53e3\u5546\u54c1\u9700\u8981\u7f34\u7eb3\u8fdb\u53e3\u7a0e\uff0c\u6bcf\u4e2a\u5546\u54c1\u6309\u7167\u89c4\u5b9a\u6709\u4e0d\u540c\u7684\u7a0e\u7387\u3002</p><p>\u5230\u624b\u4ef7\uff1d\u5546\u54c1\u4ef7\u683c+\u8fd0\u8d39+\u7a0e\u8d39</p><p>\u7a0e\u8d39\uff1d\uff08\u5546\u54c1\u4ef7\u683c\uff0b\u8fd0\u8d39\uff09* \u7a0e\u7387</p></div></div> '),
                        r.delegate("mouseenter", ".tb-duty-rule-trigger", function() {
                            i()
                        }).delegate("mouseleave", ".tb-duty-rule-trigger", function() {
                            o()
                        }).delegate("click", ".tb-duty-rule-trigger", function(e) {
                            e.preventDefault()
                        }).delegate("mouseenter", ".tb-duty-rule-content", function() {
                            a && clearTimeout(a)
                        }).delegate("mouseleave", ".tb-duty-rule-content", function() {
                            o()
                        });
                    var l = s(".tb-duty-rate", r);
                    c.on("sku:found sku:changed", function(e) {
                            var t = e.sku.skuId;
                            n[t] ? l.html(n[t]) : l.html(n.def)
                        }),
                        c.on("sku:lost", function() {
                            l.html(n.def)
                        })
                }
            }

            function i() {
                a && clearTimeout(a),
                    a = setTimeout(function() {
                        r.addClass("tb-duty-show-rule")
                    }, 300)
            }

            function o() {
                a && clearTimeout(a),
                    a = setTimeout(function() {
                        r.removeClass("tb-duty-show-rule")
                    }, 300)
            }
            var a, r, s = t("node").all,
                c = s("body");
            c.fire("resource:sib", {
                success: function(e) {
                    try {
                        e.sib.duty && n(e.sib.duty)
                    } catch (t) {
                        logger.error("duty init error: %s", t.message)
                    }
                }
            })
        }),
        KISSY.add("item-detail/route/index", ["node", "event", "anim"], function(e, t) {
            var n = t("node").all,
                i = n("body");
            t("event"),
                t("anim");
            return {
                init: function() {
                    var t, n = this,
                        o = location.hash,
                        a = /^#reviews(\/.*)?$/,
                        r = e.unparam(location.search),
                        s = {
                            reviews: 1,
                            records: 2,
                            desc: 0,
                            addToCart: 3
                        }; -
                    1 !== location.href.indexOf("on_comment=1") || a.test(o) ? t = 1 : r && r.selected && (t = s[r.selected]),
                        i.on("component:loaded", function() {
                            n.jump(t)
                        }),
                        i.fire("resource:sib", {
                            success: function() {
                                n.jump(t)
                            }
                        }),
                        0 === t && i.on("qualified:init", function() {
                            n.jump(t, !0)
                        })
                },
                jump: function(t, n) {
                    if (t >= 0) {
                        var o = {
                            index: t,
                            stick: !0
                        };
                        n && e.mix(o, {
                                load: n
                            }),
                            i.fire("tabbar:switch", o)
                    }
                }
            }
        }),
        KISSY.add("item-detail/globalfooter/index", function(e) {
            return {
                init: function() {
                    e.use("kg/tb-footer/1.1.3/index", function(e, t) {
                        var n = new t;
                        n.render()
                    })
                }
            }
        }),
        KISSY.add("item-detail/index", ["./track/", "./hub/", "./dt/", "./price/", "./domain/", "./base/", "./buy/", "./resource/", "./newsku/", "./cart/", "./core/", "./sizepicker/", "./counter/", "./ms/", "./taoqianggou/", "./qrcode/", "./tbtoken/", "./userinfo/", "./multiterms/", "./thumb/", "./contracticons/", "./video/", "./insurance/", "./tags/", "./discount/", "./guideline/", "./sns/", "./header/", "./shopinfo/", "./currencyPrice/", "./tabbar/", "./security/", "./typerecommend/", "./switcher/", "./stat/", "./popsku/", "./doctor/", "./shortcuts/", "./favorite/", "./custommarket/", "./relatemarket/", "./report/", "./tbcp/", "./o2oservice/", "./skutip/", "./stepprice/", "./areaPrice/", "./toolbar/", "./redeem/", "./viewer/", "./wangpu/", "./activity/bigpromotion/", "./shoplab/", "./reminder/", "./timing/", "./auto/", "./ju/", "./duty/", "./route/", "./globalfooter/"], function(e, t) {
            function n() {
                n.fired || (n.fired = !0,
                    g_config.load_start = o(),
                    Hub.fire("load"),
                    g_config.load_end = o(),
                    Hub.fire("load:end"))
            }
            t("./track/"),
                t("./hub/"),
                t("./dt/"),
                t("./price/"),
                t("./domain/").init(),
                t("./base/").init(),
                t("./buy/").init(),
                t("./resource/"),
                t("./newsku/"),
                t("./cart/").init(),
                t("./core/").init(),
                t("./sizepicker/").init(),
                t("./counter/").init(),
                t("./ms/"),
                t("./taoqianggou/"),
                t("./qrcode/"),
                t("./tbtoken/"),
                t("./userinfo/"),
                t("./multiterms/").init(),
                t("./thumb/"),
                t("./contracticons/"),
                t("./video/"),
                t("./insurance/"),
                t("./tags/"),
                t("./discount/"),
                t("./guideline/"),
                t("./sns/"),
                t("./header/"),
                t("./shopinfo/"),
                t("./currencyPrice/"),
                t("./tabbar/").init(),
                t("./security/"),
                t("./typerecommend/"),
                t("./switcher/").init(),
                t("./stat/"),
                t("./popsku/"),
                t("./doctor/").init(),
                t("./shortcuts/"),
                t("./favorite/"),
                t("./custommarket/"),
                t("./relatemarket/"),
                t("./report/"),
                t("./tbcp/"),
                t("./o2oservice/").init(),
                t("./skutip/").init(),
                t("./stepprice/"),
                t("./areaPrice/"),
                t("./toolbar/").init(),
                t("./redeem/").init(),
                t("./viewer/"),
                t("./wangpu/").init(),
                t("./activity/bigpromotion/"),
                t("./shoplab/"),
                t("./reminder/"),
                t("./timing/"),
                t("./auto/").init(),
                t("./ju/"),
                t("./duty/"),
                t("./route/").init(),
                t("./globalfooter/").init();
            var i = e.all,
                o = e.now;
            e.ready(function() {
                    g_config.domready_start = o(),
                        Hub.fire("domready"),
                        Hub.fire("base:done"),
                        Hub.fire("sku:done"),
                        Hub.fire("tabbar:done"),
                        Hub.fire("core:ready"),
                        Hub.fire("core:load"),
                        g_config.domready_end = o(),
                        Hub.fire("domready:end")
                }),
                i(window).on("load", n),
                setTimeout(n, 5e3)
        });
    /*eslint-enable */
    console.log('Finish loading bypass-taobao-overseas-block.js')
})();
