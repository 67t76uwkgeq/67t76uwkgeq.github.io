(function() {
    var e = window,
        t = Object,
        n;

    window.onload = function() {
        // 阻止双击放大
        var lastTouchEnd = 0;
        document.addEventListener('touchstart', function(event) {
            if (event.touches.length > 1) {
                event.preventDefault();
            }
        });
        document.addEventListener('touchend', function(event) {
            var now = (new Date()).getTime();
            if (now - lastTouchEnd <= 300) {
                event.preventDefault();
            }
            lastTouchEnd = now;
        }, false);
        // 阻止双指放大
        document.addEventListener('gesturestart', function(event) {
            event.preventDefault();
        });
    }

    if (!u)
        var u = {};
    u.Server = {
        address: "wss://game.elfive.cn:91/server/wtfgame",
        socket: null,
        connect: function() {
            e.address && (u.Server.address = e.address),
                u.Server.socket = new WebSocket(u.Server.address),
                console.log("正在连接至服务器..."),
                u.Server.socket.onopen = function(e) {
                    u.Server.socket.onmessage = u.Server.onMessage,
                        u.Server.socket.onclose = u.Server.onClose,
                        u.Server.socket.onerror = u.Server.onError,
                        u.Server.onOpen(e)
                }
        },
        onOpen: function(e) {
            console.log("成功连接到服务器。"),
                u.Event.call("ON_OPEN")
        },
        onMessage: function(e) {
            u.Event.call("ON_MESSAGE", e.data)
        },
        onError: function(e) {
            u.Event.call("ON_ERROR", e.data)
        },
        onClose: function(e) {
            console.log("从服务器断开:" + e.data),
                u.Event.call("ON_CLOSE", e.data)
        },
        send: function(e) {
            u.Server.socket.send(e)
        }
    };
    if (!u)
        var u = {};
    u.Event = {
        callStacks: {},
        bind: function(e, t, n) {
            u.Event.callStacks[e] || (u.Event.callStacks[e] = []),
                u.Event.callStacks[e].push({
                    func: t,
                    self: n,
                    once: !1
                })
        },
        bindOnce: function(e, t, n) {
            u.Event.callStacks[e] || (u.Event.callStacks[e] = []),
                u.Event.callStacks[e].push({
                    func: t,
                    self: n,
                    once: !0
                })
        },
        unbind: function(e, t, n) {
            if (!u.Event.callStacks[e])
                return;
            for (var r = 0; r < u.Event.callStacks[e].length; r++)
                if (u.Event.callStacks[e][r].func == t) {
                    u.Event.callStacks[e].splice(r, 1);
                    return
                }
            u.Event.callStacks[e].length == 0 && (u.Event.callStacks[e] = null)
        },
        destroy: function(e) {
            u.Event.callStacks[e] = null
        },
        call: function(e, t) {
            if (!u.Event.callStacks[e])
                return;
            var n = u.Event.callStacks[e];
            for (var r = 0; r < n.length; r++) {
                var i = n[r];
                i.func.call(i.self, t),
                    i.once && (n.splice(r, 1),
                        r--)
            }
            n.length == 0 && u.Event.destroy(e)
        }
    };
    if (!u)
        var u = {};
    u._TweenChain = function(e) {
            this.target = e,
                this.curIndex = -1,
                this.args = [],
                this.settings = [],
                this.durations = [],
                this.adds = [],
                this.hasRunned = !1,
                this.stopped = !1,
                this.loops = [],
                this.addIndex = 0,
                this.lastLoopIndex = 0,
                this.curLoopIndex = 0,
                this.to = function(e, t, n, r) {
                    return this.args.push(e),
                        this.durations.push(isNaN(t) || t < 1 ? 1 : t),
                        this.settings.push(n ? {
                            ease: n
                        } : {
                            ease: u.Easing.Linear
                        }),
                        this.adds.push(r ? r : {}),
                        u.Tween._inited || console.log("Tween服务尚未启动，请传入gameObject对象或者先wh.Tween.init(game)!"),
                        this.addIndex++,
                        this
                },
                this.wait = function(e) {
                    return this.args.push({}),
                        this.durations.push(isNaN(e) || e < 1 ? 1 : e),
                        this.settings.push({}),
                        this.adds.push({}),
                        this.addIndex++,
                        this
                },
                this.call = function(e, t, n) {
                    return this.args.push({}),
                        this.durations.push(0),
                        this.settings.push({
                            func: e,
                            data: t,
                            caller: n
                        }),
                        this.adds.push({}),
                        this.addIndex++,
                        this
                },
                this.loop = function(e) {
                    return this.loops.push({
                            from: this.lastLoopIndex,
                            to: this.addIndex,
                            count: e
                        }),
                        this.lastLoopIndex = this.addIndex,
                        this
                },
                this._run = function() {
                    if (this.hasRunned)
                        return;
                    this.hasRunned = !0,
                        this._activate()
                },
                this._stop = function() {
                    this.stopped = !0
                },
                this.passingTime = 0,
                this.speed = 0,
                this.attrArr = [],
                this.curArr = [],
                this.initArr = [],
                this.attrs = [],
                this.sets = [],
                this.addss = [],
                this.curEase = null,
                this.ifstop = !1,
                this.update = function(e) {
                    if (this.stopped || !this.target)
                        return;
                    this.passingTime += e,
                        this.passingTime = Math.min(this.passingTime, this.speed),
                        this.passingTime = Math.min(this.passingTime, this.speed);
                    for (var t in this.attrs)
                        for (var n = 0; n < this.attrArr.length; n++) {
                            var r = this.curEase(this.passingTime, this.initArr[n], this.curArr[n] - this.initArr[n], this.speed);
                            this.addss && this.addss.string ? this.addss.int ? this.target[this.attrArr[n]] = parseFloat(r).toFixed(0) : this.target[this.attrArr[n]] = parseFloat(r) : this.addss && this.addss.int ? this.target[this.attrArr[n]] = parseInt(r) : this.target[this.attrArr[n]] = parseFloat(r)
                        }
                    this.passingTime >= this.speed && (this.ifstop || (this.ifstop = !0,
                        this._activate()))
                },
                this._activate = function() {
                    if (this.stopped || !this.target)
                        return;
                    this.curIndex++;
                    var e = this.args.length;
                    this.curLoopIndex < this.loops.length && (e = this.loops[this.curLoopIndex].to);
                    if (this.curLoopIndex != 0 && this.curLoopIndex >= this.loops.length) {
                        u.Tween._removeTween(this);
                        return
                    }
                    this.curIndex >= e && this.loops[this.curLoopIndex] && (this.loops[this.curLoopIndex].count--,
                        this.loops[this.curLoopIndex].count != 0 ? this.curIndex = this.loops[this.curLoopIndex].from : this.curLoopIndex++);
                    if (this.curIndex >= this.args.length) {
                        u.Tween._removeTween(this);
                        return
                    }
                    var t = this;
                    this.attrArr = [],
                        this.curArr = [],
                        this.initArr = [],
                        this.attrs = this.args[this.curIndex],
                        this.sets = this.settings[this.curIndex],
                        this.addss = this.adds[this.curIndex],
                        this.speed = this.durations[this.curIndex],
                        this.ifstop = !1,
                        this.curEase = this.sets.ease ? this.sets.ease : u.Easing.Linear,
                        this.passingTime = 0;
                    for (var n in this.attrs) {
                        this.attrArr.push(n),
                            this.curArr.push(this.attrs[n]);
                        var r = parseFloat(this.target[n]);
                        isNaN(r) && (r = 0),
                            this.initArr.push(r)
                    }
                    var i = !1;
                    for (var s in this.attrs) {
                        i = !0;
                        break
                    }
                    i || this.sets.func && (this.sets.caller ? this.sets.func.call(this.sets.caller, this.sets.data) : this.sets.func(this.sets.data))
                }
        },
        u.Tween = {
            _targets: [],
            _tweens: [],
            _inited: !1,
            _timer: null,
            _game: null,
            get: function(e) {
                !this._inited && e.game && (this._inited = !0,
                        this._game = e.game,
                        this._timer = this._game.timer.loop(0, function() {
                            this._update(this._game.time.deltaTime)
                        }, this)),
                    e._tweenChain || (e._tweenChain = []);
                var t = new u._TweenChain(e);
                return e._tweenChain.push(t),
                    this._tweens.push(t),
                    this._targets.push(e),
                    t
            },
            init: function(e) {
                !this._inited && e && (this._inited = !0,
                    this._game = e,
                    this._timer = this._game.timer.loop(0, function() {
                        this._update(this._game.time.deltaTime)
                    }, this))
            },
            _update: function(e) {
                for (var t = 0; t < u.Tween._tweens.length; t++)
                    u.Tween._tweens[t].update(e)
            },
            _removeTween: function(e) {
                var t = u.Tween._tweens.indexOf(e);
                t >= 0 && u.Tween._tweens.splice(t, 1),
                    e.target && e.target._tweenChain && (t = e.target._tweenChain.indexOf(e),
                        t >= 0 && e.target._tweenChain.splice(t, 1),
                        e.target._tweenChain.length <= 0 && this.remove(e.target))
            },
            remove: function(e) {
                if (e._tweenChain) {
                    for (var t = 0; t < e._tweenChain.length; t++) {
                        e._tweenChain[t]._stop();
                        var n = u.Tween._tweens.indexOf(e._tweenChain[t]);
                        n >= 0 && u.Tween._tweens.splice(n, 1)
                    }
                    e._tweenChain = []
                }
            },
            removeAll: function() {
                for (var e = 0; e < this._targets.length; e++)
                    this.remove(this._targets[e]);
                u.Tween.tweens = []
            },
            stop: function() {
                this._timer && (this._game.timer.remove(this._timer),
                    this._inited = !1)
            }
        },
        u.Easing = {
            Linear: function(e, t, n, r) {
                return n * e / r + t
            },
            Quad: {
                easeIn: function(e, t, n, r) {
                    return n * (e /= r) * e + t
                },
                easeOut: function(e, t, n, r) {
                    return -n * (e /= r) * (e - 2) + t
                },
                easeInOut: function(e, t, n, r) {
                    return (e /= r / 2) < 1 ? n / 2 * e * e + t : -n / 2 * (--e * (e - 2) - 1) + t
                }
            },
            Cubic: {
                easeIn: function(e, t, n, r) {
                    return n * (e /= r) * e * e + t
                },
                easeOut: function(e, t, n, r) {
                    return n * ((e = e / r - 1) * e * e + 1) + t
                },
                easeInOut: function(e, t, n, r) {
                    return (e /= r / 2) < 1 ? n / 2 * e * e * e + t : n / 2 * ((e -= 2) * e * e + 2) + t
                }
            },
            Quart: {
                easeIn: function(e, t, n, r) {
                    return n * (e /= r) * e * e * e + t
                },
                easeOut: function(e, t, n, r) {
                    return -n * ((e = e / r - 1) * e * e * e - 1) + t
                },
                easeInOut: function(e, t, n, r) {
                    return (e /= r / 2) < 1 ? n / 2 * e * e * e * e + t : -n / 2 * ((e -= 2) * e * e * e - 2) + t
                }
            },
            Quint: {
                easeIn: function(e, t, n, r) {
                    return n * (e /= r) * e * e * e * e + t
                },
                easeOut: function(e, t, n, r) {
                    return n * ((e = e / r - 1) * e * e * e * e + 1) + t
                },
                easeInOut: function(e, t, n, r) {
                    return (e /= r / 2) < 1 ? n / 2 * e * e * e * e * e + t : n / 2 * ((e -= 2) * e * e * e * e + 2) + t
                }
            },
            Sine: {
                easeIn: function(e, t, n, r) {
                    return -n * Math.cos(e / r * (Math.PI / 2)) + n + t
                },
                easeOut: function(e, t, n, r) {
                    return n * Math.sin(e / r * (Math.PI / 2)) + t
                },
                easeInOut: function(e, t, n, r) {
                    return -n / 2 * (Math.cos(Math.PI * e / r) - 1) + t
                }
            },
            Expo: {
                easeIn: function(e, t, n, r) {
                    return e == 0 ? t : n * Math.pow(2, 10 * (e / r - 1)) + t
                },
                easeOut: function(e, t, n, r) {
                    return e == r ? t + n : n * (-Math.pow(2, -10 * e / r) + 1) + t
                },
                easeInOut: function(e, t, n, r) {
                    return e == 0 ? t : e == r ? t + n : (e /= r / 2) < 1 ? n / 2 * Math.pow(2, 10 * (e - 1)) + t : n / 2 * (-Math.pow(2, -10 * --e) + 2) + t
                }
            },
            Circ: {
                easeIn: function(e, t, n, r) {
                    return -n * (Math.sqrt(1 - (e /= r) * e) - 1) + t
                },
                easeOut: function(e, t, n, r) {
                    return n * Math.sqrt(1 - (e = e / r - 1) * e) + t
                },
                easeInOut: function(e, t, n, r) {
                    return (e /= r / 2) < 1 ? -n / 2 * (Math.sqrt(1 - e * e) - 1) + t : n / 2 * (Math.sqrt(1 - (e -= 2) * e) + 1) + t
                }
            },
            Elastic: {
                easeIn: function(e, t, n, r, i, s) {
                    if (e == 0)
                        return t;
                    if ((e /= r) == 1)
                        return t + n;
                    s || (s = r * .3);
                    if (!i || i < Math.abs(n)) {
                        i = n;
                        var o = s / 4
                    } else
                        var o = s / (2 * Math.PI) * Math.asin(n / i);
                    return -(i * Math.pow(2, 10 * (e -= 1)) * Math.sin((e * r - o) * 2 * Math.PI / s)) + t
                },
                easeOut: function(e, t, n, r, i, s) {
                    if (e == 0)
                        return t;
                    if ((e /= r) == 1)
                        return t + n;
                    s || (s = r * .3);
                    if (!i || i < Math.abs(n)) {
                        i = n;
                        var o = s / 4
                    } else
                        var o = s / (2 * Math.PI) * Math.asin(n / i);
                    return i * Math.pow(2, -10 * e) * Math.sin((e * r - o) * 2 * Math.PI / s) + n + t
                },
                easeInOut: function(e, t, n, r, i, s) {
                    if (e == 0)
                        return t;
                    if ((e /= r / 2) == 2)
                        return t + n;
                    s || (s = r * .3 * 1.5);
                    if (!i || i < Math.abs(n)) {
                        i = n;
                        var o = s / 4
                    } else
                        var o = s / (2 * Math.PI) * Math.asin(n / i);
                    return e < 1 ? -0.5 * i * Math.pow(2, 10 * (e -= 1)) * Math.sin((e * r - o) * 2 * Math.PI / s) + t : i * Math.pow(2, -10 * (e -= 1)) * Math.sin((e * r - o) * 2 * Math.PI / s) * .5 + n + t
                }
            },
            Back: {
                easeIn: function(e, t, r, i, s) {
                    return s == n && (s = 1.70158),
                        r * (e /= i) * e * ((s + 1) * e - s) + t
                },
                easeOut: function(e, t, r, i, s) {
                    return s == n && (s = 1.70158),
                        r * ((e = e / i - 1) * e * ((s + 1) * e + s) + 1) + t
                },
                easeInOut: function(e, t, r, i, s) {
                    return s == n && (s = 1.70158),
                        (e /= i / 2) < 1 ? r / 2 * e * e * (((s *= 1.525) + 1) * e - s) + t : r / 2 * ((e -= 2) * e * (((s *= 1.525) + 1) * e + s) + 2) + t
                }
            },
            Bounce: {
                easeIn: function(e, t, n, r) {
                    return n - Easing.Bounce.easeOut(r - e, 0, n, r) + t
                },
                easeOut: function(e, t, n, r) {
                    return (e /= r) < 1 / 2.75 ? n * 7.5625 * e * e + t : e < 2 / 2.75 ? n * (7.5625 * (e -= 1.5 / 2.75) * e + .75) + t : e < 2.5 / 2.75 ? n * (7.5625 * (e -= 2.25 / 2.75) * e + .9375) + t : n * (7.5625 * (e -= 2.625 / 2.75) * e + .984375) + t
                },
                easeInOut: function(e, t, n, r) {
                    return e < r / 2 ? Easing.Bounce.easeIn(e * 2, 0, n, r) * .5 + t : Easing.Bounce.easeOut(e * 2 - r, 0, n, r) * .5 + n * .5 + t
                }
            }
        };
    if (!u)
        var u = {};
    u.Base64 = {
        _keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
        encode: function(e) {
            var t = "",
                n, r, i, s, o, a, f, l = 0;
            e = u.Base64._utf8_encode(e);
            while (l < e.length)
                n = e.charCodeAt(l++),
                r = e.charCodeAt(l++),
                i = e.charCodeAt(l++),
                s = n >> 2,
                o = (n & 3) << 4 | r >> 4,
                a = (r & 15) << 2 | i >> 6,
                f = i & 63,
                isNaN(r) ? a = f = 64 : isNaN(i) && (f = 64),
                t = t + u.Base64._keyStr.charAt(s) + u.Base64._keyStr.charAt(o) + u.Base64._keyStr.charAt(a) + u.Base64._keyStr.charAt(f);
            return t
        },
        decode: function(e) {
            var t = "",
                n, r, i, s, o, a, f, l = 0;
            e = e.replace(/[^A-Za-z0-9\+\/\=]/g, "");
            while (l < e.length)
                s = u.Base64._keyStr.indexOf(e.charAt(l++)),
                o = u.Base64._keyStr.indexOf(e.charAt(l++)),
                a = u.Base64._keyStr.indexOf(e.charAt(l++)),
                f = u.Base64._keyStr.indexOf(e.charAt(l++)),
                n = s << 2 | o >> 4,
                r = (o & 15) << 4 | a >> 2,
                i = (a & 3) << 6 | f,
                t += String.fromCharCode(n),
                a != 64 && (t += String.fromCharCode(r)),
                f != 64 && (t += String.fromCharCode(i));
            return t = u.Base64._utf8_decode(t),
                t
        },
        _utf8_encode: function(e) {
            e = e.replace(/\r\n/g, "\n");
            var t = "";
            for (var n = 0; n < e.length; n++) {
                var r = e.charCodeAt(n);
                r < 128 ? t += String.fromCharCode(r) : r > 127 && r < 2048 ? (t += String.fromCharCode(r >> 6 | 192),
                    t += String.fromCharCode(r & 63 | 128)) : (t += String.fromCharCode(r >> 12 | 224),
                    t += String.fromCharCode(r >> 6 & 63 | 128),
                    t += String.fromCharCode(r & 63 | 128))
            }
            return t
        },
        _utf8_decode: function(e) {
            var t = "",
                n = 0,
                r = c1 = c2 = 0;
            while (n < e.length)
                r = e.charCodeAt(n),
                r < 128 ? (t += String.fromCharCode(r),
                    n++) : r > 191 && r < 224 ? (c2 = e.charCodeAt(n + 1),
                    t += String.fromCharCode((r & 31) << 6 | c2 & 63),
                    n += 2) : (c2 = e.charCodeAt(n + 1),
                    c3 = e.charCodeAt(n + 2),
                    t += String.fromCharCode((r & 15) << 12 | (c2 & 63) << 6 | c3 & 63),
                    n += 3);
            return t
        }
    };
    setTimeout(function() {
        window.h = window.qc.defineBehaviour("qc.wtf.GameManager", qc.Behaviour, function() {
            h.instance = this,
                this.sceneStuff = [],
                this.players = [],
                this.me = null,
                this.playerMap = {},
                this.tick = 0,
                this.flashTick = 0,
                this.currentLevel = null,
                this.num = 1,
                this.myName = "Player",
                this.myUUID = -1,
                this.myScore = 0,
                this.myTitle = "",
                this.channel = 0,
                this.lastChannel = -1,
                this.mapData = null,
                this.ignoreList = [],
                this.isAdmin = !1,
                this.god = !1,
                this.mode = "unknown"
        }, {
            map: qc.Serializer.NODE,
            flash: qc.Serializer.NODE,
            camera: qc.Serializer.NODE,
            playerPrefab: qc.Serializer.PREFAB,
            plankPrefab: qc.Serializer.PREFAB,
            levels: qc.Serializer.NODES,
            pLevels: qc.Serializer.NODES,
            pyLevel: qc.Serializer.NODE,
            sceneStuff: qc.Serializer.NODES,
            players: qc.Serializer.NODES,
            version: qc.Serializer.STRING
        });
        h.prototype.awake = function() {
                this.game.input.onKeyDown.add(this.onKeyDown, this),
                    this.game.input.onKeyUp.add(this.onKeyUp, this),
                    u.Event.bind("$room", this.onGetRoom, this),
                    u.Event.bind("$newmap", this.onSwitchMap, this),
                    u.Event.bind("$newplayer", this.onNewPlayer, this),
                    u.Event.bind("$playerdata", this.onGetPlayerData, this),
                    this.gameObject.visible = !1,
                    u.Event.bind("$move", this.onReceiveMove, this),
                    u.Event.bind("$leave", this.onLeave, this),
                    u.Event.bind("$score", this.onScore, this),
                    u.Event.bind("$msg", this.onMsg, this),
                    u.Event.bind("$flash", this.onFlash, this),
                    u.Event.bind("$infect", this.onInfect, this),
                    u.Event.bind("$source", this.onSource, this),
                    u.Event.bind("$alert", this.onAlert, this),
                    u.Event.bind("$afkkick", this.onAFKKick, this),
                    u.Event.bind("$kick", this.onKick, this),
                    u.Event.bind("$fullsur", function(e) {
                        for (var t = 0; t < e.length; t++) {
                            var n = e[t],
                                r = n.uuid,
                                i = this.playerMap["p" + r];
                            i && i.Player && (i.Player.isMe && (h.instance.myScore += 5),
                                i.Player.showLabel("+5"))
                        }
                    }, this),
                    u.Event.bind("$halfsur", function(e) {
                        for (var t = 0; t < e.length; t++) {
                            var n = e[t],
                                r = n.uuid,
                                i = this.playerMap["p" + r];
                            i && i.Player && (i.Player.isMe && (h.instance.myScore += 1),
                                i.Player.showLabel("+1"))
                        }
                    }, this),
                    u.Event.bind("$sur", function(e) {
                        for (var t = 0; t < e.length; t++) {
                            var n = e[t],
                                r = n.uuid,
                                i = this.playerMap["p" + r];
                            i && i.Player && (i.Player.isMe && (h.instance.myScore += 3),
                                i.Player.showLabel("+3"))
                        }
                    }, this),
                    u.Event.bind("$key", function(t) {
                        e.localStorage && e.localStorage.setItem("key", t.key)
                    }, this),
                    u.Event.bind("$title", function(e) {
                        var t = this.playerMap["p" + e.uuid];
                        t && t.Player && (t.Player.setTitle(e.title),
                            t.Player == this.me && (this.myTitle = e.title))
                    }, this),
                    u.Event.bind("$god", function() {
                        this.god = !this.god,
                            this.me.showLabel(this.god ? "开启上帝模式" : "关闭上帝模式")
                    }, this),
                    u.Event.bind("$admin", function() {
                        this.isAdmin = !0,
                            this.me.showLabel("已获取管理员权限")
                    }, this),
                    this.game.input.onKeyDown.add(this.onKeyDown, this)
            },
            h.prototype.onInfect = function(e) {
                if (this.mode != "plague")
                    return;
                var t = e.s,
                    n = e.m;
                if (t) {
                    var r = this.playerMap["p" + t];
                    r && r.Player && (r.Player.infectOther(),
                        r.Player.isMe && (h.instance.myScore += 1))
                }
                if (n) {
                    var i = this.playerMap["p" + n];
                    i && i.Player && i.Player.infect(!1, !1)
                }
            },
            h.prototype.onSource = function(e) {
                if (this.mode != "plague")
                    return;
                var t = this.playerMap["p" + e.uuid];
                t && t.Player && t.Player.infect(!0, !0)
            },
            h.prototype.onAFKKick = function(e) {
                alert("您AFK太久，被移出游戏了！"),
                    location.reload()
            },
            h.prototype.onKick = function(e) {
                alert("您被管理员请出游戏了！"),
                    location.reload()
            },
            h.prototype.onReceiveMove = function(e) {
                var t = this.playerMap["p" + e.uuid];
                t && t.Player && t.Player.onReceiveMove(e)
            },
            h.prototype.onLeave = function(e) {
                var t = this.playerMap["p" + e.uuid];
                t && t.Player && t.Player.onLeave(e)
            },
            h.prototype.onScore = function(e) {
                if (this.mode != "race")
                    return;
                var t = this.playerMap["p" + e.uuid];
                t && t.Player && (t.Player.onScore(e),
                    t.Player.isMe && (h.instance.myScore += e.score))
            },
            h.prototype.onMsg = function(e) {
                var t = this.playerMap["p" + e.uuid];
                if (t && t.Player) {
                    if (this.ignoreList.indexOf(e.uuid) >= 0)
                        return;
                    t.Player.onMsg(e)
                }
            },
            h.prototype.onFlash = function(e) {
                if (this.mode != "race")
                    return;
                this.flashTick = this.tick
            },
            h.prototype.onAlert = function(e) {
                alert(e.t)
            },
            h.prototype.update = function() {
                this.tick++,
                    this.workCamera()
            },
            h.prototype.workCamera = function() {
                if (!this.camera || !this.currentLevel)
                    return;
                if (this.currentLevel.levelWidth > 960) {
                    if (this.me) {
                        var e = -Math.min(Math.max(0, this.me.gameObject.anchoredX - 480), this.currentLevel.levelWidth - 960);
                        this.camera.anchoredX = this.camera.anchoredX + (e - this.camera.anchoredX) * .08
                    }
                } else
                    this.camera.anchoredX != 0 && (this.camera.anchoredX = 0);
                if (this.currentLevel.levelHeight > 640) {
                    if (this.me) {
                        var t = Math.min(Math.max(0, -this.me.gameObject.anchoredY - 320), this.currentLevel.levelHeight - 640);
                        this.camera.anchoredY = this.camera.anchoredY + (t - this.camera.anchoredY) * .08
                    }
                } else
                    this.camera.anchoredY != 0 && (this.camera.anchoredY = 0)
            },
            h.prototype.start = function() {
                if (this.players.length > 0)
                    for (var e = 0; e < this.players.length; e++)
                        this.players[e].destroy();
                this.players = [],
                    this.me = null,
                    this.playerMap = {},
                    D.instance.setRoomNum(this.channel),
                    this.generatePlayer(this.myName, this.myUUID, this.myScore, !0, this.currentLevel.spawnPointX, this.currentLevel.spawnPointY, this.myTitle, {
                        scored: !1,
                        infected: !1
                    }),
                    O.instance.start(this.myName, this.myUUID, this.myScore)
            },
            h.prototype.onKeyDown = function(e) {
                e == qc.Keyboard.Q ? O.instance.show() : e == qc.Keyboard.F4 && (_.instance.mute = !_.instance.mute,
                    h.instance.me && h.instance.me.showLabel(_.instance.mute ? "已关闭声音" : "已开启声音"))
            },
            h.prototype.onKeyUp = function(e) {
                e == qc.Keyboard.Q && O.instance.hide()
            },
            h.prototype.generatePlayer = function(e, t, n, r, i, s, o, u) {
                if (r && this.me != null || this.playerMap["p" + t] || t <= 0)
                    return;
                var a = this.game.add.clone(this.playerPrefab, this.map);
                a.Player.gen(e, t, n, r, i, s, o, u);
                for (var f = 0; f < this.currentLevel.items.length; f++) {
                    var l = this.currentLevel.items[f];
                    l && l.getScript("qc.arcade.RigidBody").addCollide(a),
                        a.getScript("qc.arcade.RigidBody").addCollide(l)
                }
                for (var f = 0; f < this.players.length; f++) {
                    var c = this.players[f];
                    c && c.getScript("qc.arcade.RigidBody").addCollide(a)
                }
                this.players.push(a),
                    D.instance.setPlayerCount(this.players.length, this.mode == "py" ? "-" : 16)
            },
            h.prototype.removePlayer = function(e) {
                for (var t = 0; t < this.currentLevel.items.length; t++) {
                    var n = this.currentLevel.items[t];
                    n && n.getScript("qc.arcade.RigidBody").removeCollide(e)
                }
                for (var t = 0; t < this.players.length; t++) {
                    var r = this.players[t];
                    r && r.getScript("qc.arcade.RigidBody").removeCollide(e)
                }
                this.players.indexOf(e) >= 0 && this.players.splice(this.players.indexOf(e), 1),
                    e.destroy(),
                    D.instance.setPlayerCount(this.players.length, this.mode == "py" ? "-" : 16)
            },
            h.prototype.onNewPlayer = function(e) {
                var t = e.name,
                    n = e.uuid,
                    r = e.score,
                    i = e.title;
                this.generatePlayer(t, n, r, !1, this.currentLevel.spawnPointX, this.currentLevel.spawnPointY, i, {
                    scored: !1,
                    infected: !1
                })
            },
            h.prototype.onGetPlayerData = function(e) {
                for (var t = 0; t < e.length; t++) {
                    var n = e[t],
                        r = n.name,
                        i = n.uuid,
                        s = n.x,
                        o = n.y,
                        u = n.score,
                        a = n.scored ? !0 : !1,
                        f = n.infected,
                        l = n.title;
                    this.generatePlayer(r, i, u, !1, s, o, l, {
                        scored: a,
                        infected: f
                    })
                }
            },
            h.prototype.onGetRoom = function(e) {
                this.channel = e.id,
                    this.mode = e.mode;
                var t = e.map,
                    n = e.time;
                this.mapData = e.data,
                    h.instance.myScore = 0;
                var r = this.mode == "race" ? "竞速模式" : this.mode == "plague" ? "瘟疫模式" : this.mode == "py" ? "PY模式" : "未知模式";
                D.instance.setModeName(r);
                if (this.mode == "race") {
                    if (!this.levels[t - 1]) {
                        alert("找不到地图文件，请刷新后再试！若依旧出现此提示，请尝试清空浏览器缓存！"),
                            location.reload(!0);
                        return
                    }
                    this.currentLevel = this.levels[t - 1].LevelManager;
                    for (var i = 0; i < this.levels.length; i++)
                        t - 1 == i ? this.levels[i].visible = !0 : this.levels[i].visible = !1;
                    for (var i = 0; i < this.pLevels.length; i++)
                        this.pLevels[i].visible = !1;
                    this.pyLevel.visible = !1
                } else if (this.mode == "plague") {
                    if (!this.pLevels[t - 1]) {
                        alert("找不到地图文件，请刷新后再试！若依旧出现此提示，请尝试清空浏览器缓存！"),
                            location.reload(!0);
                        return
                    }
                    this.currentLevel = this.pLevels[t - 1].PlagueLevelManager;
                    for (var i = 0; i < this.pLevels.length; i++)
                        t - 1 == i ? this.pLevels[i].visible = !0 : this.pLevels[i].visible = !1;
                    for (var i = 0; i < this.levels.length; i++)
                        this.levels[i].visible = !1;
                    this.pyLevel.visible = !1
                } else if (this.mode == "py") {
                    if (!this.pyLevel) {
                        alert("找不到地图文件，请刷新后再试！若依旧出现此提示，请尝试清空浏览器缓存！"),
                            location.reload(!0);
                        return
                    }
                    this.currentLevel = this.pyLevel.PYLevelManager;
                    for (var i = 0; i < this.pLevels.length; i++)
                        t - 1 == i ? this.pLevels[i].visible = !1 : this.pLevels[i].visible = !1;
                    for (var i = 0; i < this.levels.length; i++)
                        this.levels[i].visible = !1
                }
                this.currentLevel.init(),
                    D.instance.setTime(n),
                    this.channel != this.lastChannel && this.start(),
                    this.lastChannel = this.channel
            },
            h.prototype.onSwitchMap = function(e) {
                this.mapData = e.data;
                for (var t = 0; t < this.currentLevel.items.length; t++) {
                    var n = this.currentLevel.items[t];
                    n && this.resetPhysics(n, !1)
                }
                e.id = this.channel,
                    e.mode = this.mode,
                    this.onGetRoom(e);
                for (var t = 0; t < this.players.length; t++) {
                    var r = this.players[t];
                    r && this.resetPhysics(r, !0)
                }
                for (var t = 0; t < this.currentLevel.items.length; t++) {
                    var n = this.currentLevel.items[t];
                    n && this.resetPhysics(n, !1)
                }
                for (var t = 0; t < this.players.length; t++) {
                    var r = this.players[t];
                    if (r) {
                        r.Player.init();
                        for (var i = 0; i < this.currentLevel.items.length; i++) {
                            var s = this.currentLevel.items[i];
                            s && s.getScript("qc.arcade.RigidBody").addCollide(r),
                                r.getScript("qc.arcade.RigidBody").addCollide(s)
                        }
                        for (var o = 0; o < this.players.length; o++) {
                            var u = this.players[o];
                            u && r != u && r.getScript("qc.arcade.RigidBody").addCollide(u)
                        }
                        r.anchoredX = this.currentLevel.spawnPointX,
                            r.anchoredY = this.currentLevel.spawnPointY
                    }
                }
            },
            h.prototype.resetPhysics = function(e, t) {
                e.getScript("qc.arcade.RigidBody").collides.length = 0
            },
            h.prototype.getLenth = function(e) {
                var t = 0;
                for (var n = 0; n < e.length; n++) {
                    var r = e.charAt(n);
                    r.match(/[^\x00-\xff]/ig) != null ? t += 2 : t += 1
                }
                return t
            };
        var a = window.qc.defineBehaviour("qc.engine.ClickPanelManager", qc.Behaviour, function() {}, {});
        a.prototype.onClick = function(e) {
            if (!h.instance.god)
                return;
            var t = e.source.x,
                n = e.source.y,
                r = h.instance.camera.anchoredX,
                i = h.instance.camera.anchoredY,
                s = t - r,
                o = -(640 - n) - i;
            h.instance.me.gameObject.anchoredX = s,
                h.instance.me.gameObject.anchoredY = o,
                h.instance.me.rigidbody && (h.instance.me.rigidbody.velocity.x = 0,
                    h.instance.me.rigidbody.velocity.y = 0)
        };
        var p = window.qc.defineBehaviour("qc.engine.HelpPanelManager", qc.Behaviour, function() {
            p.instance = this
        }, {
            dom: qc.Serializer.NODE,
            btnOK: qc.Serializer.NODE
        });
        p.prototype.awake = function() {
                this.btnOK.onClick.add(this.onClickOK, this),
                    this.gameObject.visible = !1
            },
            p.prototype.showHelp = function(e) {
                this.dom.innerHTML = '<textarea style="width:100%; height:100%; background-color:#346; color:#fff; text-align:center; padding:20px;font-size:16px;">' + e + "</textarea>",
                    this.gameObject.visible = !0
            },
            p.prototype.onClickOK = function() {
                this.gameObject.visible = !1
            };
        var d = window.qc.defineBehaviour("qc.wtf.InputAreaManager", qc.Behaviour, function() {
            d.instance = this,
                this.showing = !1,
                this.nextSendTick = 0
        }, {
            inputField: qc.Serializer.NODE,
            sendButton: qc.Serializer.NODE
        });
        d.prototype.awake = function() {
                this.gameObject.visible = !1,
                    this.game.input.onKeyDown.add(function(e) {
                        e == qc.Keyboard.ENTER && this.onPressEnter()
                    }, this),
                    this.sendButton.onClick.add(this.onPressEnter, this)
            },
            d.prototype.onPressEnter = function() {
                this.showing ? (this.inputField.text.trim().length > 0 && this.sendMessage(),
                    this.gameObject.visible = !1,
                    this.showing = !1) : (this.gameObject.visible = !0,
                    this.showing = !0,
                    this.inputField.isFocused = !0)
            },
            d.prototype.sendMessage = function() {
                if (h.instance.tick >= this.nextSendTick) {
                    var e = this.inputField.text.trim();
                    e = e.replace(new RegExp(/(")/g), '\\"'),
                        M.instance.sendMessage("msg", {
                            msg: e
                        }),
                        this.inputField.text = "",
                        this.nextSendTick = h.instance.tick + 300
                } else
                    h.instance.me.showLabel("发言太快了")
            };
        var g = window.qc.defineBehaviour("qc.wtf.Broadcast", qc.Behaviour, function() {
            g.instance = this,
                this.lbl = null
        }, {
            lbl: qc.Serializer.NODE
        });
        g.prototype.awake = function() {
                this.lbl.alpha = 0,
                    u.Event.bind("$broad", this.onBroadcast, this)
            },
            g.prototype.showBroadcast = function(e) {
                this.lbl.visible = !0,
                    u.Tween.remove(this.lbl),
                    this.lbl.alpha = 0,
                    this.lbl.text = e,
                    u.Tween.get(this.lbl).to({
                        alpha: 1
                    }, 200).wait(5e3).to({
                        alpha: 0
                    }, 1e3)
            },
            g.prototype.onBroadcast = function(e) {
                this.showBroadcast(e.text)
            };
        var w = window.qc.defineBehaviour("qc.wtf.LoginManager", qc.Behaviour, function() {
            w.instance = this,
                this.username = "Player",
                this.connected = !1
        }, {
            inpUsername: qc.Serializer.NODE,
            btnStart: qc.Serializer.NODE,
            tip: qc.Serializer.NODE,
            dropdown: qc.Serializer.NODE
        });
        w.prototype.awake = function() {
                this.gameObject.visible = !0,
                    this.hideTip(),
                    this.btnStart.onClick.add(this.onClickStart, this),
                    this.showTip("正在连接服务器..."),
                    u.Event.bind("ON_OPEN", this.onOpen, this),
                    u.Event.bind("$outdate", this.onOutDate, this),
                    u.Event.bind("$login", this.onLogin, this),
                    u.Event.bind("$full", this.onFull, this),
                    u.Event.bind("$occupy", this.onOccupy, this),
                    u.Event.bind("$shutdown", this.onShutdown, this),
                    M.instance.connect();
                if (this.dropdown.value < 0 || this.dropdown.value > 2)
                    this.dropdown.value = 0
            },
            w.prototype.hide = function() {
                this.gameObject.visible = !1
            },
            w.prototype.onClickRegister = function() {
                if (!this.connected)
                    return;
                this.gameObject.visible = !1,
                    k.instance.start()
            },
            w.prototype.onClickStart = function() {
                if (!this.connected)
                    return;
                var e = this.inpUsername.text.trim();
                if (h.instance.getLenth(e.trim()) == 0) {
                    this.showTip("请输入用户名！");
                    return
                }
                if (h.instance.getLenth(e.trim()) > 20) {
                    this.showTip("用户名太长！");
                    return
                }
                if (this.dropdown.value < 0 || this.dropdown.value > 2)
                    this.dropdown.value = 0;
                this.username = e;
                var t = {
                    name: this.username,
                    ver: h.instance.version,
                    mode: this.dropdown.value
                };
                this.game.storage.set("username", e),
                    M.instance.sendMessage("login", t)
            },
            w.prototype.onOpen = function() {
                this.connected = !0,
                    this.showTip("");
                var e = this.game.storage.get("username");
                e != null && e != "" && (this.inpUsername.text = e,
                    this.inpUsername.placeholder.text = "")
            },
            w.prototype.onLogin = function(e) {
                this.hide(),
                    h.instance.myName = e.name,
                    h.instance.myUUID = e.uuid,
                    h.instance.myTitle = e.title,
                    h.instance.myScore = e.score,
                    h.instance.gameObject.visible = !0,
                    this.game.storage.save();
                var t = "**如游戏出错请清空浏览器缓存**\n\n====== 操作说明 ======\n\n方向键移动，空格键互动，Q键查看得分榜与聊天日志，F4键静音/取消静音。\n\n\n====== 竞速模式 ======\n\n• 玩家的目标是从出生点走到终点旗帜。\n\n• 每隔3-5秒屏幕会闪一次红光，在闪红光之前按方向键下键（趴下）即可存活。\n\n\n====== 瘟疫模式 ======\n\n• 游戏会随机选择一名玩家为感染源。\n\n• 瘟疫玩家投掷健康玩家可以感染玩家，每感染一个玩家获得1分，被感染的玩家需要继续感染健康玩家。\n\n• 非感染源瘟疫玩家将获得减速和投掷CD加长的debuff。\n\n• 存活到最后的玩家将获得大量分数。\n\n\n====== 更新日志 ======\n\nver0.5.0\n\n去除注册用户功能。\n\n\n====== 玩家反馈 ======\n\n如有建议或意见，请加QQ群224883545。";
                p.instance.showHelp(t)
            },
            w.prototype.onOutDate = function(e) {
                alert("您的游戏版本过旧，请刷新后重试！如果还出现此提示请清空浏览器缓存后再试！"),
                    M.instance.close()
            },
            w.prototype.onOccupy = function(e) {
                alert("已经有相同名字的玩家在线了，换个名字试试！"),
                    M.instance.close()
            },
            w.prototype.onFull = function(e) {
                alert("服务器已满，请稍候再试！"),
                    M.instance.close()
            },
            w.prototype.onShutdown = function(e) {
                alert("服务器已关闭！"),
                    M.instance.close()
            },
            w.prototype.showTip = function(e) {
                this.tip.visible = !0,
                    this.tip.text = e
            },
            w.prototype.hideTip = function() {
                this.tip.visible = !1
            };
        var S = window.qc.defineBehaviour("qc.wtf.Player", qc.Behaviour, function() {
            this.isMe = !0,
                this.controlable = !0,
                this.jumping = !1,
                this.moveSpeed = 200,
                this.jumpSpeed = 500,
                this.throwHeight = 360,
                this.throwSpeed = 240,
                this.playerName = "Player",
                this.friction = 100,
                this.uuid = -1,
                this.isFacingLeft = !0,
                this.touchedFlag = !1,
                this.score = 0,
                this.tick = 0,
                this.state = 0,
                this.initPickTimer = 10,
                this.initThrowTimer = 180,
                this.pickCoolDown = 30,
                this.pickTimer = 0,
                this.nextPickTime = 0,
                this.throwTimer = 0,
                this.speedMagnifer = 1,
                this.curAnimation = "",
                this.rigidbody = null,
                this.lastTouchGround = !1,
                this.targetSpeedX = 0,
                this.targetSpeedY = 0,
                this.isLeftDown = !1,
                this.isLeftJustDown = !1,
                this.isLeftJustUp = !1,
                this.isRightDown = !1,
                this.isRightJustDown = !1,
                this.isRightJustUp = !1,
                this.isUpDown = !1,
                this.isUpJustDown = !1,
                this.isUpJustUp = !1,
                this.isDownDown = !1,
                this.isDownJustDown = !1,
                this.isDownJustUp = !1,
                this.isSpaceJustDown = !1,
                this.isSpaceDown = !1,
                this.isSpaceJustUp = !1,
                this.isControlJustBack = !1
        }, {
            isMe: qc.Serializer.BOOLEAN,
            moveSpeed: qc.Serializer.NUMBER,
            jumpSpeed: qc.Serializer.NUMBER,
            friction: qc.Serializer.NUMBER,
            playerName: qc.Serializer.STRING,
            playerImage: qc.Serializer.NODE,
            nameTag: qc.Serializer.NODE,
            bubble: qc.Serializer.NODE,
            title: qc.Serializer.NODE,
            scoreLabel: qc.Serializer.PREFAB
        });
        S.prototype.preUpdate = function() {
                this.isLeftJustDown = !1,
                    this.isLeftJustUp = !1,
                    this.isRightJustDown = !1,
                    this.isRightJustUp = !1,
                    this.isUpJustDown = !1,
                    this.isUpJustUp = !1,
                    this.isDownJustDown = !1,
                    this.isDownJustUp = !1,
                    this.isSpaceJustDown = !1,
                    this.isSpaceJustUp = !1,
                    this.isControlJustBack = !1
            },
            S.prototype.awake = function() {
                this.rigidbody = this.gameObject.getScript("qc.arcade.RigidBody")
            },
            S.prototype.onClick = function() {
                x.instance.show(this.uuid, this.gameObject.anchoredX + h.instance.camera.anchoredX, this.gameObject.anchoredY + h.instance.camera.anchoredY)
            },
            S.prototype.init = function() {
                this.touchedFlag = !1,
                    this.gameObject.phaser.body.enable = !0,
                    this.playerImage.visible = !0,
                    this.nameTag.visible = !0,
                    this.title.visible = !0,
                    this.playerImage.colorTint = new qc.Color("#FFFFFF"),
                    this.speedMagnifer = 1,
                    this.pickCoolDown = 30
            },
            S.prototype.setTitle = function(e) {
                e == "管理员" ? (this.title.text = "<管理员>",
                    this.title.color = new qc.Color("#B300FF"),
                    this.title.visible = !0) : e == "作者" ? (this.title.text = "<" + e + ">",
                    this.title.color = new qc.Color("#10C200"),
                    this.title.visible = !0) : e == "赞助者" ? (this.title.text = "<" + e + ">",
                    this.title.color = new qc.Color("#00C2B5"),
                    this.title.visible = !0) : e == "元老" ? (this.title.text = "<" + e + ">",
                    this.title.color = new qc.Color("#1947FF"),
                    this.title.visible = !0) : e == "咸鱼王" ? (this.title.text = "<" + e + ">",
                    this.title.color = new qc.Color("#9619FF"),
                    this.title.visible = !0) : e == "传说" ? (this.title.text = "<" + e + ">",
                    this.title.color = new qc.Color("#FF1919"),
                    this.title.visible = !0) : e != null && e != "null" && e != "" && e != " " ? (this.title.text = "<" + e + ">",
                    this.title.color = new qc.Color("#FFB663"),
                    this.title.visible = !0) : this.title.text = ""
            },
            S.prototype.gen = function(e, t, n, r, i, s, o, u) {
                h.instance.playerMap["p" + t] = this.gameObject,
                    r && (h.instance.me = this,
                        this.nameTag.color = new qc.Color("#FFDC00"),
                        S.me = this,
                        o == "管理员" && (h.instance.isAdmin = !0,
                            h.instance.me.showLabel("已获取管理员权限"))),
                    this.setTitle(o),
                    this.nameTag.text = e,
                    this.gameObject.name = e,
                    this.uuid = t,
                    this.isMe = r,
                    this.score = n,
                    this.playerName = e,
                    this.gameObject.anchoredX = i,
                    this.gameObject.anchoredY = s,
                    this.init(),
                    this.isMe && (this.game.input.onKeyDown.add(this.onKeyDown, this),
                        this.game.input.onKeyUp.add(this.onKeyUp, this)),
                    h.instance.mode == "race" ? u.scored && (this.touchedFlag = !0,
                        this.onConfirmTouchFlag()) : h.instance.mode == "plague" && (u.infected == 1 ? this.infect(!1, !1) : u.infected == 2 && this.infect(!0, !1))
            },
            S.prototype.onKeyDown = function(e) {
                switch (e) {
                    case qc.Keyboard.LEFT:
                        this.isLeftDown = !0,
                            this.isLeftJustDown = !0;
                        break;
                    case qc.Keyboard.RIGHT:
                        this.isRightDown = !0,
                            this.isRightJustDown = !0;
                        break;
                    case qc.Keyboard.UP:
                        this.isUpDown = !0,
                            this.isUpJustDown = !0;
                        break;
                    case qc.Keyboard.DOWN:
                        this.isDownDown = !0,
                            this.isDownJustDown = !0;
                        break;
                    case qc.Keyboard.SPACEBAR:
                        this.isSpaceDown = !0,
                            this.isSpaceJustDown = !0
                }
            },
            S.prototype.onKeyUp = function(e) {
                switch (e) {
                    case qc.Keyboard.LEFT:
                        this.isLeftDown = !1,
                            this.isLeftJustUp = !0;
                        break;
                    case qc.Keyboard.RIGHT:
                        this.isRightDown = !1,
                            this.isRightJustUp = !0;
                        break;
                    case qc.Keyboard.UP:
                        this.isUpDown = !1,
                            this.isUpJustUp = !0;
                        break;
                    case qc.Keyboard.DOWN:
                        this.isDownDown = !1,
                            this.isDownJustUp = !0;
                        break;
                    case qc.Keyboard.SPACEBAR:
                        this.isSpaceDown = !1,
                            this.isSpaceJustUp = !0
                }
            },
            S.prototype.update = function(e) {
                this.tick++,
                    !this.lastTouchGround && this.rigidbody.touching.down && this.onTouchGround(),
                    this.isMe && this.controlable && !this.touchedFlag && this.checkMove(),
                    this.rigidbody && this.state != 0 && this.state != 2 && this.controlable && (this.rigidbody.velocity.x = this.targetSpeedX * this.speedMagnifer),
                    this.rigidbody && this.rigidbody.touching.down ? this.rigidbody.drag.x = this.friction : this.rigidbody.drag.x = 0,
                    this.pickTimer--,
                    this.throwTimer--,
                    this.calcAnim(),
                    this.isMe && (h.instance.mode == "race" && (this.checkFlag(),
                            this.checkFlash()),
                        this.checkPortal(),
                        this.checkFall()),
                    this.lastTouchGround = this.rigidbody.touching.down
            },
            S.prototype.infect = function(e, t) {
                _.instance.play("transform");
                if (e) {
                    var n = this.isMe ? "您是感染源，快去感染其他玩家！" : this.playerName + " 是感染源，远离他！";
                    g.instance.showBroadcast(n),
                        t && (this.rigidbody.velocity.x = 0,
                            this.rigidbody.velocity.y = 0,
                            this.gameObject.anchoredX = h.instance.currentLevel.zombieSpawnPoint.anchoredX,
                            this.gameObject.anchoredY = h.instance.currentLevel.zombieSpawnPoint.anchoredY),
                        this.playerImage.colorTint = new qc.Color("#00732E")
                } else
                    this.speedMagnifer = .75,
                    this.pickCoolDown = 60,
                    this.playerImage.colorTint = new qc.Color("#00FF91")
            },
            S.prototype.infectOther = function() {
                this.showLabel("+1")
            },
            S.prototype.checkFall = function() {
                if (this.touchedFlag)
                    return;
                this.gameObject.anchoredY > 100 && this.flashed()
            },
            S.prototype.checkFlag = function() {
                if (this.touchedFlag)
                    return;
                this.gameObject && this.gameObject.anchoredX <= h.instance.currentLevel.flag.anchoredX + 16 && this.gameObject.anchoredX >= h.instance.currentLevel.flag.anchoredX - 16 && this.gameObject.anchoredY <= h.instance.currentLevel.flag.anchoredY + 32 && this.gameObject.anchoredY >= h.instance.currentLevel.flag.anchoredY - 72 && this.touchFlag()
            },
            S.prototype.checkPortal = function() {
                if (h.instance.currentLevel.portals && h.instance.currentLevel.portals.length > 0)
                    for (var e = 0; e < h.instance.currentLevel.portals.length; e++)
                        if (this.gameObject && this.gameObject.anchoredX <= h.instance.currentLevel.portals[e].anchoredX + 16 && this.gameObject.anchoredX >= h.instance.currentLevel.portals[e].anchoredX - 16 && this.gameObject.anchoredY <= h.instance.currentLevel.portals[e].anchoredY + 32 && this.gameObject.anchoredY >= h.instance.currentLevel.portals[e].anchoredY - 32) {
                            this.touchPortal(h.instance.currentLevel.portals[e]);
                            break
                        }
            },
            S.prototype.checkMove = function() {
                this.isControlJustBack && (this.isLeftDown ? this.move(!0) : this.isRightDown ? this.move(!1) : this.isDownDown && this.dock()),
                    this.isDownJustUp && (this.isLeftDown ? this.move(!0) : this.isRightDown ? this.move(!1) : this.stop()),
                    this.isSpaceJustDown && this.state != 2 && this.nextPickTime <= this.tick && this.pick();
                if (this.isLeftJustDown && !this.isDownDown && !this.isRightDown) {
                    this.move(!0);
                    return
                }
                if (this.isRightJustDown && !this.isDownDown && !this.isLeftDown) {
                    this.move(!1);
                    return
                }
                if (this.isLeftJustUp) {
                    this.isRightDown ? this.move(!1) : this.isDownDown || this.stop();
                    return
                }
                if (this.isRightJustUp) {
                    this.isLeftDown ? this.move(!0) : this.isDownDown || this.stop();
                    return
                }
                if (this.isDownJustDown) {
                    this.rigidbody.touching.down && this.dock();
                    return
                }
                if (this.isUpDown && !this.isDownDown && this.rigidbody.touching.down) {
                    this.jump();
                    return
                }
                if (this.isDownDown && this.rigidbody.touching.down && this.state != 2) {
                    this.dock();
                    return
                }
            },
            S.prototype.calcAnim = function() {
                this.throwTimer > 160 ? this.curAnimation != "LIFT" && (this.playerImage.playAnimation("lift"),
                    this.curAnimation = "LIFT") : this.pickTimer > 0 ? this.curAnimation != "PICK" && (this.playerImage.playAnimation("pick"),
                    this.curAnimation = "PICK") : this.rigidbody && this.rigidbody.touching.down ? this.state == 0 && this.curAnimation != "STAND" ? (this.playerImage.playAnimation("stand"),
                    this.curAnimation = "STAND") : this.state == 1 && this.curAnimation != "WALK" ? (this.playerImage.playAnimation("walk"),
                    this.curAnimation = "WALK") : this.state == 2 && this.curAnimation != "DOCK" && (this.playerImage.playAnimation("dock"),
                    this.curAnimation = "DOCK") : this.curAnimation != "SPIN" && (this.playerImage.playAnimation("spin"),
                    this.curAnimation = "SPIN")
            },
            S.prototype.move = function(e) {
                this.targetSpeedX = e ? -this.moveSpeed : this.moveSpeed,
                    this.isFacingLeft = e,
                    this.playerImage.scaleX = e ? 1 : -1,
                    this.state = 1,
                    this.game.phaser.add.tween(this.gameObject.phaser.body).to({
                        height: 36
                    }, 100, Phaser.Easing.Linear.None, !0),
                    this.isMe && this.sendMovePack(e ? "moveLeft" : "moveRight")
            },
            S.prototype.stop = function() {
                this.targetSpeedX = 0,
                    this.state = 0,
                    this.game.phaser.add.tween(this.gameObject.phaser.body).to({
                        height: 36
                    }, 100, Phaser.Easing.Linear.None, !0),
                    this.rigidbody && (this.rigidbody.velocity.x = this.targetSpeedX),
                    this.isMe && this.sendMovePack("stop")
            },
            S.prototype.dock = function() {
                this.targetSpeedX = 0,
                    this.state = 2,
                    this.game.phaser.add.tween(this.gameObject.phaser.body).to({
                        height: 20
                    }, 100, Phaser.Easing.Linear.None, !0),
                    this.isMe && this.sendMovePack("dock")
            },
            S.prototype.kill = function() {
                this.gameObject.anchoredX = h.instance.currentLevel.spawnPoint.anchoredX,
                    this.gameObject.anchoredY = h.instance.currentLevel.spawnPoint.anchoredY,
                    this.isMe && (this.sendMovePack("kill"),
                        _.instance.play("die"))
            },
            S.prototype.jump = function() {
                this.rigidbody && (this.rigidbody.velocity.y = -this.jumpSpeed),
                    this.isMe && (this.sendMovePack("jump"),
                        _.instance.play("jump"))
            },
            S.prototype.pick = function() {
                this.pickTimer = this.initPickTimer;
                if (this.isMe) {
                    this.nextPickTime = this.tick + this.pickCoolDown;
                    var e = !1;
                    for (var t = 0; t < h.instance.players.length; t++) {
                        var n = h.instance.players[t];
                        if (n) {
                            if (n == this.gameObject)
                                continue;
                            this.isFacingLeft ? n.anchoredX >= this.gameObject.anchoredX - 60 && n.anchoredX < this.gameObject.anchoredX && n.anchoredY <= this.gameObject.anchoredY + 30 && n.anchoredY >= this.gameObject.anchoredY - 10 && (e = !0,
                                this.throw(n)) : n.anchoredX <= this.gameObject.anchoredX + 60 && n.anchoredX > this.gameObject.anchoredX && n.anchoredY <= this.gameObject.anchoredY + 30 && n.anchoredY >= this.gameObject.anchoredY - 10 && (e = !0,
                                this.throw(n))
                        }
                    }
                    e || this.sendMovePack("pick")
                }
            },
            S.prototype.throw = function(e) {
                this.throwTimer = this.initThrowTimer,
                    this.isMe && (this.sendThrowPack(e),
                        _.instance.play("throw"))
            },
            S.prototype.flashed = function() {
                this.gameObject && (this.gameObject.anchoredX = h.instance.currentLevel.spawnPoint.anchoredX,
                        this.gameObject.anchoredY = h.instance.currentLevel.spawnPoint.anchoredY,
                        this.rigidbody.velocity.x = 0,
                        this.rigidbody.velocity.y = 0),
                    this.isMe && (this.sendMovePack("flashed"),
                        _.instance.play("die"))
            },
            S.prototype.onWarp = function() {
                this.gameObject && (this.rigidbody.velocity.x = 0,
                    this.rigidbody.velocity.y = 0)
            },
            S.prototype.touchFlag = function() {
                this.touchedFlag = !0,
                    this.isMe && this.sendMovePack("flag")
            },
            S.prototype.touchPortal = function(e) {
                if (this.isMe) {
                    var t = e.Portal.dest;
                    this.gameObject.anchoredX = t.x,
                        this.gameObject.anchoredY = t.y,
                        M.instance.sendMessage("move", {
                            t: "pos",
                            uuid: this.uuid,
                            x: t.x,
                            y: t.y
                        }),
                        _.instance.play("portal")
                }
            },
            S.prototype.onConfirmTouchFlag = function() {
                this.gameObject && (this.stop(),
                    this.gameObject.phaser.body.enable = !1,
                    this.playerImage.visible = !1,
                    this.nameTag.visible = !1,
                    this.title.visible = !1,
                    this.isMe && _.instance.play("win"))
            },
            S.prototype.onTouchGround = function() {
                this.controlable || (this.isControlJustBack = !0),
                    this.controlable = !0,
                    this.isMe && this.sendMovePack("pos")
            },
            S.prototype.sendMovePack = function(e) {
                var t = Math.round(this.gameObject.anchoredX),
                    n = Math.round(this.gameObject.anchoredY);
                M.instance.sendMessage("move", {
                    t: e,
                    uuid: this.uuid,
                    x: t,
                    y: n
                })
            },
            S.prototype.sendThrowPack = function(e) {
                var t = e.Player,
                    n = Math.round(this.gameObject.anchoredX),
                    r = Math.round(this.gameObject.anchoredY);
                M.instance.sendMessage("move", {
                    t: "throw",
                    uuid: this.uuid,
                    dir: this.isFacingLeft ? 0 : 1,
                    target: t.uuid,
                    x: n,
                    y: r
                })
            },
            S.prototype.onThrowed = function(e) {
                var t = parseInt(e);
                this.rigidbody.velocity.y = -this.throwHeight,
                    this.rigidbody.velocity.x = e == 0 ? -this.throwSpeed : this.throwSpeed,
                    this.controlable = !1
            },
            S.prototype.onScore = function(e) {
                if (e.uuid != this.uuid)
                    return;
                this.score += e.score,
                    this.nameTag.text = this.playerName,
                    this.showLabel("+" + e.score),
                    this.isMe && (h.instance.myScore = this.score)
            },
            S.prototype.showLabel = function(e) {
                var t = this.game.add.clone(this.scoreLabel, this.gameObject.parent);
                t.anchoredX = this.gameObject.anchoredX,
                    t.anchoredY = this.gameObject.anchoredY,
                    t.ScoreLabel.init(e)
            },
            S.prototype.onReceiveMove = function(e) {
                if (e.uuid != this.uuid)
                    return;
                if (this.isMe && e.t != "flag" && e.t != "throw")
                    return;
                this.gameObject.anchoredX = parseInt(e.x),
                    this.gameObject.anchoredY = parseInt(e.y);
                switch (e.t) {
                    case "moveLeft":
                        this.move(!0);
                        break;
                    case "moveRight":
                        this.move(!1);
                        break;
                    case "stop":
                        this.stop();
                        break;
                    case "dock":
                        this.dock();
                        break;
                    case "jump":
                        this.jump();
                        break;
                    case "pick":
                        this.pick();
                        break;
                    case "throw":
                        this.isMe || this.throw();
                        var t = e.target,
                            n = h.instance.playerMap["p" + t];
                        n && n.Player && n.Player.onThrowed(e.dir);
                        break;
                    case "flag":
                        this.onConfirmTouchFlag();
                        break;
                    case "kill":
                        this.kill();
                        break;
                    case "flashed":
                        this.flashed();
                        break;
                    case "warp":
                        this.onWarp()
                }
            },
            S.prototype.isInSaveZone = function() {
                var e = !1;
                for (var t = 0; t < h.instance.currentLevel.safeZones.length; t++) {
                    var n = h.instance.currentLevel.safeZones[t];
                    if (this.gameObject.anchoredX <= n.anchoredX + n.width / 2 && this.gameObject.anchoredX >= n.anchoredX - n.width / 2 && this.gameObject.anchoredY <= n.anchoredY + 5 && this.gameObject.anchoredY >= n.anchoredY - n.height) {
                        e = !0;
                        break
                    }
                }
                return e
            },
            S.prototype.say = function(e) {
                this.bubble.getScript("qc.wtf.DialogBubble").show(e, this.uuid)
            },
            S.prototype.onLeave = function(e) {
                if (e.uuid != this.uuid)
                    return;
                h.instance.playerMap["p" + e.uuid] = null,
                    h.instance.removePlayer(this.gameObject)
            },
            S.prototype.checkFlash = function() {
                if (h.instance.god)
                    return;
                h.instance.tick <= h.instance.flashTick + 6 && this.onFlash()
            },
            S.prototype.onFlash = function() {
                this.touchedFlag || this.isInSaveZone() || this.rigidbody.touching.down && this.state == 2 || this.flashed()
            },
            S.prototype.onMsg = function(e) {
                if (e.uuid != this.uuid)
                    return;
                this.say(e.msg)
            };
        var x = window.qc.defineBehaviour("qc.engine.PlayerContextMenu", qc.Behaviour, function() {
            x.instance = this,
                this.uuid = 0,
                this.playerName = "Unknown"
        }, {
            lblName: qc.Serializer.NODE,
            btnMute: qc.Serializer.NODE,
            btnFriend: qc.Serializer.NODE,
            btnKick: qc.Serializer.NODE,
            btnBan: qc.Serializer.NODE,
            btnTitle: qc.Serializer.NODE,
            btnClose: qc.Serializer.NODE
        });
        x.prototype.awake = function() {
                this.btnMute.onClick.add(this.onClickMute, this),
                    this.btnFriend.onClick.add(this.onClickFriend, this),
                    this.btnKick.onClick.add(this.onClickKick, this),
                    this.btnBan.onClick.add(this.onClickBan, this),
                    this.btnTitle.onClick.add(this.onClickTitle, this),
                    this.btnClose.onClick.add(this.onClickClose, this),
                    this.gameObject.visible = !1
            },
            x.prototype.onClickMute = function() {
                if (h.instance.myUUID == this.uuid) {
                    h.instance.me.showLabel("不能屏蔽自己"),
                        this.hide();
                    return
                }
                h.instance.ignoreList.indexOf(this.uuid) >= 0 ? (h.instance.ignoreList.splice(h.instance.ignoreList.indexOf(this.uuid), 1),
                        h.instance.me.showLabel("解除屏蔽了 " + this.playerName)) : (h.instance.ignoreList.push(this.uuid),
                        h.instance.me.showLabel("屏蔽了 " + this.playerName)),
                    this.hide()
            },
            x.prototype.onClickFriend = function() {
                h.instance.me.showLabel("功能尚未开放"),
                    this.hide()
            },
            x.prototype.onClickKick = function() {
                h.instance.isAdmin ? confirm("是否踢出 " + this.playerName + " ？") && M.instance.sendMessage("kick", {
                        uuid: this.uuid
                    }) : h.instance.me.showLabel("权限不足"),
                    this.hide()
            },
            x.prototype.onClickBan = function() {
                h.instance.isAdmin ? confirm("是否封禁 " + this.playerName + " ？") && M.instance.sendMessage("ban", {
                        uuid: this.uuid
                    }) : h.instance.me.showLabel("权限不足"),
                    this.hide()
            },
            x.prototype.onClickTitle = function() {
                if (!h.instance.isAdmin)
                    h.instance.me.showLabel("权限不足");
                else {
                    var e = prompt("输入称号");
                    e && M.instance.sendMessage("title", {
                        uuid: this.uuid,
                        title: e
                    })
                }
                this.hide()
            },
            x.prototype.onClickClose = function() {
                this.hide()
            },
            x.prototype.show = function(e, t, n) {
                this.gameObject.visible = !0,
                    this.uuid = e;
                var r = "Unknown",
                    i = h.instance.playerMap["p" + e];
                i && i.Player && (r = i.Player.playerName,
                        this.lblName.text = r,
                        this.playerName = r),
                    this.gameObject.anchoredX = t,
                    this.gameObject.anchoredY = n,
                    h.instance.isAdmin ? (this.btnKick.colorTint = new qc.Color("#FFFFFF"),
                        this.btnBan.colorTint = new qc.Color("#FFFFFF"),
                        this.btnTitle.colorTint = new qc.Color("#FFFFFF"),
                        this.btnFriend.colorTint = new qc.Color("#AAAAAA")) : (this.btnKick.colorTint = new qc.Color("#AAAAAA"),
                        this.btnBan.colorTint = new qc.Color("#AAAAAA"),
                        this.btnTitle.colorTint = new qc.Color("#AAAAAA"),
                        this.btnFriend.colorTint = new qc.Color("#AAAAAA")),
                    h.instance.myUUID == e ? this.btnMute.colorTint = new qc.Color("#AAAAAA") : this.btnMute.colorTint = new qc.Color("#FFFFFF")
            },
            x.prototype.hide = function() {
                this.uuid = -1,
                    this.gameObject.visible = !1
            };
        var k = window.qc.defineBehaviour("qc.engine.RegisterPageManager", qc.Behaviour, function() {
            k.instance = this
        }, {
            inpUsername: qc.Serializer.NODE,
            inpPassword: qc.Serializer.NODE,
            inpConfirmPassword: qc.Serializer.NODE,
            inpEmial: qc.Serializer.NODE,
            inpInv: qc.Serializer.NODE,
            btnBack: qc.Serializer.NODE,
            btnRegister: qc.Serializer.NODE
        });
        k.prototype.awake = function() {
                this.gameObject.visible = !1
            },
            k.prototype.bindEvents = function() {
                this.btnBack.onClick.add(this.onClickBack, this),
                    this.btnRegister.onClick.add(this.onClickRegister, this),
                    u.Event.bind("$outdate", this.onOutDate, this),
                    u.Event.bind("$nametaken", this.onNameTaken, this),
                    u.Event.bind("$emailtaken", this.onEmailTaken, this),
                    u.Event.bind("$inhibit", this.onInhibit, this),
                    u.Event.bind("$fail", this.onFail, this),
                    u.Event.bind("$success", this.onSuccess, this),
                    u.Event.bind("$wronginv", this.onWrongInv, this)
            },
            k.prototype.unbindEvents = function() {
                this.btnBack.onClick.remove(this.onClickBack, this),
                    this.btnRegister.onClick.remove(this.onClickRegister, this),
                    u.Event.unbind("$outdate", this.onOutDate),
                    u.Event.unbind("$nametaken", this.onNameTaken),
                    u.Event.unbind("$emailtaken", this.onEmailTaken),
                    u.Event.unbind("$inhibit", this.onInhibit),
                    u.Event.unbind("$fail", this.onFail),
                    u.Event.unbind("$success", this.onSuccess),
                    u.Event.unbind("$wronginv", this.onWrongInv)
            },
            k.prototype.onClickRegister = function() {
                var e = this.inpUsername.text.trim(),
                    t = this.inpPassword.text,
                    n = this.inpConfirmPassword.text,
                    r = this.inpEmial.text.trim(),
                    i = this.inpInv.text.trim();
                if (this.getLenth(e) <= 0) {
                    alert("用户名不能为空！");
                    return
                }
                if (this.getLenth(e) > 20) {
                    alert("用户名太长(最长20字符，汉字占2字符)！");
                    return
                }
                if (r.length == 0) {
                    alert("邮箱不能为空！");
                    return
                }
                var s = /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/,
                    o = s.test(r);
                if (!o) {
                    alert("邮箱格式错误！");
                    return
                }
                if (t.length == 0) {
                    alert("密码不能为空！");
                    return
                }
                if (t != n) {
                    alert("两次密码输入不一致！");
                    return
                }
                M.instance.sendMessage("register", {
                    username: e,
                    password: t,
                    email: r,
                    invCode: i ? i : "",
                    version: h.instance.version
                })
            },
            k.prototype.onWrongInv = function() {
                alert("授权码有误，请重试！")
            },
            k.prototype.onNameTaken = function() {
                alert("用户名已被占用！")
            },
            k.prototype.onOutDate = function() {
                alert("您的游戏版本过旧，请刷新后重试！如果还出现此提示请清空浏览器缓存后再试！"),
                    M.instance.close()
            },
            k.prototype.onEmailTaken = function() {
                alert("邮箱已被占用！")
            },
            k.prototype.onInhibit = function() {
                alert("目前无法注册新账号，很抱歉！")
            },
            k.prototype.onFail = function() {
                alert("注册失败！")
            },
            k.prototype.onSuccess = function() {
                alert("注册成功！"),
                    this.close(),
                    w.instance.gameObject.visible = !0
            },
            k.prototype.onClickBack = function() {
                this.close(),
                    w.instance.gameObject.visible = !0
            },
            k.prototype.start = function() {
                this.gameObject.visible = !0,
                    this.bindEvents()
            },
            k.prototype.close = function() {
                this.inpUsername.txt = "",
                    this.inpPassword.txt = "",
                    this.inpConfirmPassword.txt = "",
                    this.inpEmial.txt = "",
                    this.inpInv.txt = "",
                    this.gameObject.visible = !1,
                    this.unbindEvents()
            },
            k.prototype.getLenth = function(e) {
                var t = 0;
                for (var n = 0; n < e.length; n++) {
                    var r = e.charAt(n);
                    r.match(/[^\x00-\xff]/ig) != null ? t += 2 : t += 1
                }
                return t
            };
        var O = window.qc.defineBehaviour("qc.engine.ScorePanelManager", qc.Behaviour, function() {
            O.instance = this,
                this.playerTags = [],
                this.log = ""
        }, {
            playerTagPrefab: qc.Serializer.PREFAB,
            scoreView: qc.Serializer.NODE,
            dom: qc.Serializer.NODE
        });
        O.prototype.awake = function() {
                this.gameObject.visible = !1,
                    u.Event.bind("$newplayer", this.onNewPlayer, this),
                    u.Event.bind("$playerdata", this.onGetPlayerData, this),
                    u.Event.bind("$leave", this.onLeave, this),
                    u.Event.bind("$score", this.onScore, this),
                    u.Event.bind("$newmap", this.onNewMap, this),
                    u.Event.bind("$infect", this.onInfect, this),
                    u.Event.bind("$source", this.onSource, this),
                    u.Event.bind("$fullsur", function(e) {
                        for (var t = 0; t < e.length; t++) {
                            var n = e[t],
                                r = n.uuid;
                            this.onSurvive(r, 5)
                        }
                    }, this),
                    u.Event.bind("$sur", function(e) {
                        for (var t = 0; t < e.length; t++) {
                            var n = e[t],
                                r = n.uuid;
                            this.onSurvive(r, 3)
                        }
                    }, this),
                    u.Event.bind("$halfsur", function(e) {
                        for (var t = 0; t < e.length; t++) {
                            var n = e[t],
                                r = n.uuid;
                            this.onSurvive(r, 1)
                        }
                    }, this),
                    u.Event.bind("$msg", this.onMessage, this)
            },
            O.prototype.show = function() {
                this.gameObject.visible = !0
            },
            O.prototype.hide = function() {
                this.gameObject.visible = !1
            },
            O.prototype.start = function(e, t, n) {
                this.playerTags = [],
                    this.log = "",
                    this.scoreView.removeChildren();
                var r = this.game.add.clone(this.playerTagPrefab, this.scoreView);
                r.PlayerTag.uuid = t,
                    r.PlayerTag.setScore(n),
                    r.PlayerTag.setName(e),
                    r.PlayerTag.setComplete(h.instance.mode == "plague"),
                    this.playerTags.push(r),
                    this.updateOrder()
            },
            O.prototype.onInfect = function(e) {
                var t = e.s,
                    n = e.m;
                if (t)
                    for (var r = 0; r < this.playerTags.length; r++) {
                        var i = this.playerTags[r];
                        if (t == i.PlayerTag.uuid) {
                            i.PlayerTag.setScore(parseInt(i.PlayerTag.score) + parseInt(1));
                            break
                        }
                    }
                if (n)
                    for (var r = 0; r < this.playerTags.length; r++) {
                        var i = this.playerTags[r];
                        if (n == i.PlayerTag.uuid) {
                            i.PlayerTag.setComplete(!1);
                            break
                        }
                    }
                this.updateOrder()
            },
            O.prototype.onSource = function(e) {
                for (var t = 0; t < this.playerTags.length; t++) {
                    var n = this.playerTags[t];
                    if (e.uuid == n.PlayerTag.uuid) {
                        n.PlayerTag.setComplete(!1);
                        break
                    }
                }
                this.updateOrder()
            },
            O.prototype.onNewPlayer = function(e) {
                var t = this.game.add.clone(this.playerTagPrefab, this.scoreView);
                t.PlayerTag.uuid = e.uuid,
                    t.PlayerTag.setScore(e.score),
                    t.PlayerTag.setName(e.name),
                    t.PlayerTag.setComplete(h.instance.mode == "plague"),
                    this.addMessage("<系统>" + e.name + " 加入了房间。"),
                    this.playerTags.push(t),
                    this.updateOrder()
            },
            O.prototype.onGetPlayerData = function(e) {
                for (var t = 0; t < e.length; t++) {
                    var n = e[t],
                        r = n.name,
                        i = n.uuid,
                        s = n.score,
                        o = this.game.add.clone(this.playerTagPrefab, this.scoreView);
                    o.PlayerTag.uuid = i,
                        o.PlayerTag.setScore(s),
                        o.PlayerTag.setName(r),
                        h.instance.mode == "race" && n.scored ? o.PlayerTag.setComplete(!0) : h.instance.mode != "plague" || n.infected != 0 && n.infected != "0" ? o.PlayerTag.setComplete(!1) : o.PlayerTag.setComplete(!0),
                        this.playerTags.push(o)
                }
                this.updateOrder()
            },
            O.prototype.onLeave = function(e) {
                for (var t = 0; t < this.playerTags.length; t++) {
                    var n = this.playerTags[t];
                    if (e.uuid == n.PlayerTag.uuid) {
                        this.playerTags.splice(t, 1),
                            n.destroy();
                        break
                    }
                }
                h.instance.playerMap["p" + e.uuid] && this.addMessage("<系统>" + h.instance.playerMap["p" + e.uuid].Player.playerName + " 离开了房间。"),
                    this.updateOrder()
            },
            O.prototype.onSurvive = function(e, t) {
                for (var n = 0; n < this.playerTags.length; n++) {
                    var r = this.playerTags[n];
                    if (e == r.PlayerTag.uuid) {
                        r.PlayerTag.setScore(parseInt(r.PlayerTag.score) + parseInt(t)),
                            r.PlayerTag.rank = t;
                        break
                    }
                }
                this.updateOrder()
            },
            O.prototype.onScore = function(e) {
                for (var t = 0; t < this.playerTags.length; t++) {
                    var n = this.playerTags[t];
                    if (e.uuid == n.PlayerTag.uuid) {
                        n.PlayerTag.setScore(parseInt(n.PlayerTag.score) + parseInt(e.score)),
                            n.PlayerTag.rank = e.score,
                            n.PlayerTag.setComplete(!0);
                        break
                    }
                }
                this.updateOrder()
            },
            O.prototype.onNewMap = function(e) {
                for (var t = 0; t < this.playerTags.length; t++) {
                    var n = this.playerTags[t];
                    n.PlayerTag.rank = 0,
                        h.instance.mode == "plague" ? n.PlayerTag.setComplete(!0) : n.PlayerTag.setComplete(!1)
                }
                this.updateOrder()
            },
            O.prototype.onMessage = function(e) {
                var t = e.msg,
                    n = "herobrine";
                h.instance.playerMap["p" + e.uuid] && (n = h.instance.playerMap["p" + e.uuid].Player.playerName);
                var r = n + ": " + t;
                this.addMessage(r)
            },
            O.prototype.addMessage = function(e) {
                this.log = e + "\n" + this.log,
                    this.dom.innerHTML = '<textarea style="width:100%; height:100%; background-color:#346; color:#fff;">' + this.log + "</textarea>"
            },
            O.prototype.updateOrder = function() {
                this.playerTags.sort(function(e, t) {
                    var n = 0;
                    return e.PlayerTag.rank > 0 && t.PlayerTag.rank > 0 ? e.PlayerTag.rank > t.PlayerTag.rank ? n = -1 : n = 1 : e.PlayerTag.rank > 0 && t.PlayerTag.rank == 0 ? n = -1 : e.PlayerTag.rank == 0 && t.PlayerTag.rank > 0 ? n = 1 : e.PlayerTag.score > t.PlayerTag.score ? n = -1 : e.PlayerTag.score < t.PlayerTag.score ? n = 1 : n = 0,
                        n
                });
                for (var e = 0; e < this.playerTags.length; e++) {
                    var t = this.playerTags[e];
                    t.anchoredY = 50 * e
                }
                this.scoreView.height = this.playerTags.length * 50
            };
        var M = window.qc.defineBehaviour("qc.wtf.ServerManager", qc.Behaviour, function() {
            M.instance = this,
                this.address = "ws://192.168.16.45:8080/TestServer/server"
        }, {
            address: qc.Serializer.STRING
        });
        M.prototype.awake = function() {
                u.Server.address = this.address,
                    e.address && (u.Server.address = e.address),
                    u.Event.bind("ON_MESSAGE", this.onMessage, this)
            },
            M.prototype.connect = function() {
                u.Server.connect()
            },
            M.prototype.close = function() {
                u.Server.socket.close()
            },
            M.prototype._send = function(e) {
                u.Server.send(e)
            },
            M.prototype.onMessage = function(e) {
                var t = u.Base64.decode(e),
                    n = JSON.parse(t);
                u.Event.call(n.k, n.v)
            },
            M.prototype.sendMessage = function(e, t) {
                var n = {
                        k: e,
                        v: t
                    },
                    r = JSON.stringify(n),
                    i = u.Base64.encode(r);
                this._send(i)
            };
        var _ = window.qc.defineBehaviour("qc.engine.SoundManager", qc.Behaviour, function() {
            _.instance = this,
                this.mute = !1
        }, {});
        _.prototype.play = function(e) {
            if (this.mute)
                return;
            var t = this;
            this.game.assets.load("sound", "Assets/audio/" + e + ".mp3.bin", function(n) {
                var r = t.game.add.sound();
                r.volume = .5;
                if (e == "on" || e == "off")
                    r.volume = .2;
                e == "shoot" && (r.volume = .1),
                    r.audio = n,
                    r.play()
            })
        };
        var D = window.qc.defineBehaviour("qc.wtf.TopUIManager", qc.Behaviour, function() {
            D.instance = this,
                this.time = 0
        }, {
            lblRoomNum: qc.Serializer.NODE,
            lblPlayerCount: qc.Serializer.NODE,
            lblTimer: qc.Serializer.NODE,
            lblMapName: qc.Serializer.NODE,
            lblModeName: qc.Serializer.NODE
        });
        D.prototype.awake = function() {
                this.gameObject.visible = !0;
                var e = this;
                this.game.timer.loop(1e3, function() {
                    e.tick()
                })
            },
            D.prototype.setTime = function(e) {
                this.time = e
            },
            D.prototype.setRoomNum = function(e) {
                this.lblRoomNum.text = (e < 10 && e > 0 ? "0" : "") + e
            },
            D.prototype.setMapName = function(e) {
                this.lblMapName.text = e
            },
            D.prototype.setModeName = function(e) {
                this.lblModeName.text = e
            },
            D.prototype.setPlayerCount = function(e, t) {
                this.lblPlayerCount.text = "玩家:" + e + "/" + t
            },
            D.prototype.tick = function() {
                this.time--;
                if (this.time < 0)
                    return;
                var e = Math.floor(this.time / 60),
                    t = this.time % 60;
                this.lblTimer.text = (e < 10 ? "0" : "") + e + ":" + (t < 10 ? "0" : "") + t
            };
        var m = window.qc.defineBehaviour("qc.wtf.LevelManager", qc.Behaviour, function() {
            this.spawnPointX = 0,
                this.spawnPointY = 0,
                this.modeName = "race",
                this.levelName = "默认地图",
                this.levelWidth = 960,
                this.levelHeight = 640
        }, {
            spawnPoint: qc.Serializer.NODE,
            items: qc.Serializer.NODES,
            portals: qc.Serializer.NODES,
            safeZones: qc.Serializer.NODES,
            flag: qc.Serializer.NODE,
            levelName: qc.Serializer.STRING,
            levelWidth: qc.Serializer.NUMBER,
            levelHeight: qc.Serializer.NUMBER
        });
        m.prototype.awake = function() {
                this.gameObject.visible = !1,
                    this.spawnPointX = this.spawnPoint.anchoredX,
                    this.spawnPointY = this.spawnPoint.anchoredY
            },
            m.prototype.init = function() {
                this.gameObject.visible = !0,
                    D.instance.setMapName(this.levelName);
                if (this.levelName == "竞速14") {
                    var e = h.instance.mapData;
                    console.log("F12也帮不了你了"),
                        this.portals[e + 1] && (this.portals[e + 1].Portal.dest = new qc.Point(480, -360))
                }
            };
        var f = window.qc.defineBehaviour("qc.wtf.DialogBubble", qc.Behaviour, function() {
            this.maxWidth = 160
        }, {
            dialog: qc.Serializer.NODE
        });
        f.prototype.awake = function() {
                this.gameObject.visible = !1
            },
            f.prototype.show = function(e, t) {
                this.gameObject.visible = !1,
                    this.gameObject.width = this.maxWidth + 10,
                    this.dialog.text = e;
                var n = this;
                if (!_.instance.mute) {
                    var r = document.getElementById("audio");
                    r.src = "https://dict.youdao.com/dictvoice?audio=" + encodeURI(e) + "&le=zh",
                        r.play()
                }
                n.gameObject.visible = !0,
                    n.gameObject.alpha = 0,
                    this.game.timer.add(100, function() {
                        n.dialog.nativeSize.width < n.maxWidth ? n.gameObject.width = n.dialog.nativeSize.width + 10 : n.gameObject.width = n.maxWidth + 10,
                            n.gameObject.height = n.dialog.nativeSize.height + 10,
                            u.Tween.remove(n.gameObject),
                            u.Tween.get(n.gameObject).to({
                                alpha: 1
                            }, 500).wait(5e3).to({
                                alpha: 0
                            }, 500)
                    })
            };
        var p = window.qc.defineBehaviour("qc.engine.HelpPanelManager", qc.Behaviour, function() {
            p.instance = this
        }, {
            dom: qc.Serializer.NODE,
            btnOK: qc.Serializer.NODE
        });
        p.prototype.awake = function() {
                this.btnOK.onClick.add(this.onClickOK, this),
                    this.gameObject.visible = !1
            },
            p.prototype.showHelp = function(e) {
                this.dom.innerHTML = '<textarea style="width:100%; height:100%; background-color:#346; color:#fff; text-align:center; padding:20px;font-size:16px;">' + e + "</textarea>",
                    this.gameObject.visible = !0
            },
            p.prototype.onClickOK = function() {
                this.gameObject.visible = !1
            };
        var v = window.qc.defineBehaviour("qc.engine.KeyPad", qc.Behaviour, function() {}, {
            btnLeft: qc.Serializer.NODE,
            btnRight: qc.Serializer.NODE,
            btnDown: qc.Serializer.NODE,
            btnJump: qc.Serializer.NODE,
            btnAct: qc.Serializer.NODE,
            btnChat: qc.Serializer.NODE,
            btnRank: qc.Serializer.NODE
        });
        v.prototype.awake = function() {
                this.game.device.desktop ? this.gameObject.visible = !1 : (this.gameObject.visible = !0,
                    this.btnLeft.onDown.add(this.onLeftDown, this),
                    this.btnLeft.onUp.add(this.onLeftUp, this),
                    this.btnRight.onDown.add(this.onRightDown, this),
                    this.btnRight.onUp.add(this.onRightUp, this),
                    this.btnDown.onDown.add(this.onDownDown, this),
                    this.btnDown.onUp.add(this.onDownUp, this),
                    this.btnJump.onDown.add(this.onJumpDown, this),
                    this.btnJump.onUp.add(this.onJumpUp, this),
                    this.btnAct.onDown.add(this.onActDown, this),
                    this.btnAct.onUp.add(this.onActUp, this),
                    this.btnChat.onClick.add(this.onChatClick, this),
                    this.btnRank.onDown.add(this.onRankDown, this),
                    this.btnRank.onUp.add(this.onRankUp, this))
            },
            v.prototype.onLeftDown = function() {
                if (!h.instance.me)
                    return;
                h.instance.me.isLeftDown = !0,
                    h.instance.me.isLeftJustDown = !0
            },
            v.prototype.onLeftUp = function() {
                if (!h.instance.me)
                    return;
                h.instance.me.isLeftDown = !1,
                    h.instance.me.isLeftJustUp = !0
            },
            v.prototype.onRightDown = function() {
                if (!h.instance.me)
                    return;
                h.instance.me.isRightDown = !0,
                    h.instance.me.isRightJustDown = !0
            },
            v.prototype.onRightUp = function() {
                if (!h.instance.me)
                    return;
                h.instance.me.isRightDown = !1,
                    h.instance.me.isRightJustUp = !0
            },
            v.prototype.onDownDown = function() {
                if (!h.instance.me)
                    return;
                h.instance.me.isDownDown = !0,
                    h.instance.me.isDownJustDown = !0
            },
            v.prototype.onDownUp = function() {
                if (!h.instance.me)
                    return;
                h.instance.me.isDownDown = !1,
                    h.instance.me.isDownJustUp = !0
            },
            v.prototype.onJumpDown = function() {
                if (!h.instance.me)
                    return;
                h.instance.me.isUpDown = !0,
                    h.instance.me.isUpJustDown = !0
            },
            v.prototype.onJumpUp = function() {
                if (!h.instance.me)
                    return;
                h.instance.me.isUpDown = !1,
                    h.instance.me.isUpJustUp = !0
            },
            v.prototype.onActDown = function() {
                if (!h.instance.me)
                    return;
                h.instance.me.isSpaceDown = !0,
                    h.instance.me.isSpaceJustDown = !0
            },
            v.prototype.onActUp = function() {
                if (!h.instance.me)
                    return;
                h.instance.me.isSpaceDown = !1,
                    h.instance.me.isSpaceJustUp = !0
            },
            v.prototype.onChatClick = function() {
                d.instance.onPressEnter()
            },
            v.prototype.onRankDown = function() {
                O.instance.show()
            },
            v.prototype.onRankUp = function() {
                O.instance.hide()
            };
        var C = window.qc.defineBehaviour("qc.engine.PYLevelManager", qc.Behaviour, function() {
            this.spawnPointX = 0,
                this.spawnPointY = 0,
                this.modeName = "py",
                this.levelName = "PY交易",
                this.levelWidth = 960,
                this.levelHeight = 640
        }, {
            spawnPoint: qc.Serializer.NODE,
            items: qc.Serializer.NODES,
            portals: qc.Serializer.NODES,
            levelName: qc.Serializer.STRING,
            levelWidth: qc.Serializer.NUMBER,
            levelHeight: qc.Serializer.NUMBER
        });
        C.prototype.awake = function() {
                this.gameObject.visible = !1,
                    this.spawnPointX = this.spawnPoint.anchoredX,
                    this.spawnPointY = this.spawnPoint.anchoredY
            },
            C.prototype.init = function() {
                this.gameObject.visible = !0,
                    D.instance.setMapName(this.levelName)
            };
        var c = window.qc.defineBehaviour("qc.wtf.FlashController", qc.Behaviour, function() {}, {});
        c.prototype.awake = function() {
                this.gameObject.visible = !0,
                    this.gameObject.alpha = 0,
                    u.Event.bind("$flash", this.onFlash, this)
            },
            c.prototype.onFlash = function() {
                _.instance.play("flash"),
                    u.Tween.remove(this.gameObject),
                    u.Tween.get(this.gameObject).to({
                        alpha: .5
                    }).to({
                        alpha: 0
                    }, 200)
            };
        var P = window.qc.defineBehaviour("qc.wtf.Turret", qc.Behaviour, function() {
            this.delay = 0,
                this.isAuto = !1,
                this.autoFreq = 10,
                this.tick = 0,
                this.distance = 100
        }, {
            delay: qc.Serializer.NUMBER,
            dir: qc.Serializer.POINT,
            bulletPrefab: qc.Serializer.PREFAB,
            isAuto: qc.Serializer.BOOLEAN,
            autoFreq: qc.Serializer.INT,
            distance: qc.Serializer.INT
        });
        P.prototype.update = function() {
                this.tick++,
                    this.isAuto && this.tick % this.autoFreq == 0 && this.shoot()
            },
            P.prototype.shoot = function() {
                _.instance.play("shoot");
                var e = this.game.add.clone(this.bulletPrefab, this.gameObject.parent);
                e.Bullet.gen(new qc.Point(this.gameObject.anchoredX, this.gameObject.anchoredY), this.dir, this.distance)
            },
            P.prototype.awake = function() {
                this.isAuto || u.Event.bind("$shoot", this.onShoot, this)
            },
            P.prototype.onShoot = function(e) {
                var t = this;
                this.game.timer.add(this.delay, function() {
                    t.gameObject.isWorldVisible() && t.shoot()
                })
            };
        var y = window.qc.defineBehaviour("qc.wtf.Button", qc.Behaviour, function() {
            this.isOn = !1,
                this.rigidbody = null
        }, {
            machines: qc.Serializer.NODES,
            machineClass: qc.Serializer.STRING
        });
        y.prototype.awake = function() {
                this.rigidbody = this.gameObject.getScript("qc.arcade.RigidBody")
            },
            y.prototype.isOn = function() {
                return this.isOn
            },
            y.prototype.update = function() {
                this.rigidbody.touching.up && !this.isOn ? this.turnOn() : !this.rigidbody.touching.up && this.isOn && this.turnOff(),
                    this.isOn = this.rigidbody.touching.up
            },
            y.prototype.turnOn = function() {
                _.instance.play("on"),
                    this.gameObject.frame = "btn2.png";
                for (var e = 0; e < this.machines.length; e++)
                    if (this.machines[e]) {
                        var t = this.machines[e].getScript(this.machineClass);
                        t && t.turnOn()
                    }
            },
            y.prototype.turnOff = function() {
                _.instance.play("off"),
                    this.gameObject.frame = "btn1.png";
                for (var e = 0; e < this.machines.length; e++)
                    if (this.machines[e]) {
                        var t = this.machines[e].getScript(this.machineClass);
                        t && t.turnOff()
                    }
            };
        var b = window.qc.defineBehaviour("qc.wtf.Bullet", qc.Behaviour, function() {
            this.speed = null,
                this.destroyDistance = 100,
                this.startPos = null
        }, {});
        b.prototype.gen = function(e, t, n) {
                this.destroyDistance = n,
                    this.gameObject.anchoredX = e.x,
                    this.gameObject.anchoredY = e.y,
                    this.startPos = new qc.Point(e.x, e.y),
                    this.speed = t,
                    u.Event.bindOnce("$newmap", this.onSwitchMap, this)
            },
            b.prototype.update = function() {
                if (!this.gameObject)
                    return;
                if (this.speed) {
                    this.gameObject.anchoredX += this.speed.x,
                        this.gameObject.anchoredY += this.speed.y;
                    var e = Math.sqrt(Math.pow(this.gameObject.anchoredX - this.startPos.x, 2) + Math.pow(this.gameObject.anchoredY - this.startPos.y, 2));
                    e >= this.destroyDistance && this.gameObject.destroy()
                }
                if (h.instance.me) {
                    var e = Math.sqrt(Math.pow(this.gameObject.anchoredX - h.instance.me.gameObject.anchoredX, 2) + Math.pow(this.gameObject.anchoredY - (h.instance.me.gameObject.anchoredY - 16), 2));
                    e < 20 && h.instance.me.kill()
                }
            },
            b.prototype.onSwitchMap = function() {
                this.gameObject && this.gameObject.destroy()
            };
        var E = window.qc.defineBehaviour("qc.wtf.PlagueLevelManager", qc.Behaviour, function() {
            this.spawnPointX = 0,
                this.spawnPointY = 0,
                this.modeName = "plague",
                this.levelName = "默认地图",
                this.levelWidth = 960,
                this.levelHeight = 640
        }, {
            spawnPoint: qc.Serializer.NODE,
            zombieSpawnPoint: qc.Serializer.NODE,
            items: qc.Serializer.NODES,
            portals: qc.Serializer.NODES,
            levelName: qc.Serializer.STRING,
            levelWidth: qc.Serializer.NUMBER,
            levelHeight: qc.Serializer.NUMBER
        });
        E.prototype.awake = function() {
                this.gameObject.visible = !1,
                    this.spawnPointX = this.spawnPoint.anchoredX,
                    this.spawnPointY = this.spawnPoint.anchoredY
            },
            E.prototype.init = function() {
                this.gameObject.visible = !0,
                    D.instance.setMapName(this.levelName)
            };
    }, 1000)

})();
