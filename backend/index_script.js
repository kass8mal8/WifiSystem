$(document).ready(function () {
    var validatePass = function (rule, value, callback) {
        if (value === "") {
            return callback(new Error(CHECK.required.newPasswd));
        }
        if(value.indexOf(" ") > -1){
            return callback(new Error(CHECK.format.whitespace));
        }
        var isX25LiteSA0343 = Page.real_device == "ZLT X25 MAX Lite" && Page.aeraId == "SA0343"
        if ((!isX25LiteSA0343 && value.length < 8) || (isX25LiteSA0343 && value.length < 12) || value.length > 63) {
            return callback(new Error(isX25LiteSA0343 ? CHECK.format.passwdLen : CHECK.range.passwd3));
        }
        if (value === vm.ruleForm.oldPasswd) {
            return callback(new Error(CHECK.required.noChanges));
        }
        if(/[^\x20-\x7f]/.test(value)){
            return callback(new Error(CHECK.format.loginPass5))
        }
        if(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).+/.test(value)){
            if (vm.ruleForm.checkPass !== "") {
                vm.$refs.ruleForm.validateField("checkPass");
            }
            callback()
        }else{
            callback(new Error(CHECK.format.loginPass5))
        }
    };
    var validatePass2 = function (rule, value, callback) {
        if (value === "") {
            callback(new Error(CHECK.required.duplicateNewPasswd));
        } else if (value !== vm.ruleForm.pass) {
            callback(new Error(CHECK.format.passwdNotSame));
        } else {
            callback();
        }
    };
    var validateOldPass = function (rule, value, callback) {
        if (value === "") {
            callback(new Error(CHECK.required.oldPasswd));
        } else {
            callback();
        }
    };
    var vm = new Vue({
        el: "#container",
        data: {
            ruleForm: {
                oldPasswd: "",
                pass: "",
                checkPass: ""
            },
            showChangePwd: false,
            passwordTips: "",
            showPwd_1: false,
            showPwd_2: false,
            showPwd_3: false
        },
        computed: {
            rules() {
                return {
                    oldPasswd: [{ validator: validateOldPass, trigger: ["blur", "change"] }],
                    pass: [
                        {
                            validator: validatePass,
                            trigger: ["blur", "change"]
                        }
                    ],
                    checkPass: [{ validator: validatePass2, trigger: ["blur", "change"] }]
                };
            }
        },
        methods: {
            submitForm: function (oldPasswd, checkPass) {
                this.$refs["ruleForm"].validate(function (valid) {
                    if (valid) {
                        const json = {
                            cmd: RequestCmd.CHANGE_PASSWD,
                            method: JSONMethod.POST,
                            newPasswd: Base64.encode(checkPass),
                            old_passwd: Base64.encode(oldPasswd),
                            subcmd: sessionStorage["level"] == "2" ? 3 : 0
                        };
                        fyConfirmMsg(DOC.lbl.firstChangePass, function () {
                            fyAlertMsgLoading();
                            Page.postJSON({
                                json,
                                success: function (data) {
                                    if (data.message == "success") {
                                        const params = {
                                            cmd: RequestCmd.RESET_FIRST_LOGIN_FLAG,
                                            first_login_flag: "1"
                                        };
                                        params[
                                            sessionStorage["level"] === "2"
                                                ? "need_change_root_pwd"
                                                : "need_change_user_pwd"
                                        ] = "1";
                                        Page.postJSON({
                                            json: params,
                                            success: function () {
                                                var option = {
                                                    expireHours: -1,
                                                    path: "/",
                                                    domain: location.hostname
                                                };
                                                localStorage.clear();
                                                CookieUtil.deleteCookie("sessionId", option);
                                                sessionStorage.clear();
                                                location.href = Page.getUrl(Url.LOGIN);
                                            }
                                        });
                                    } else if (data.message == "passwd error") {
                                        fyAlertMsgFail(PROMPT.saving.previousPasswd);
                                    } else {
                                        fyAlertMsgFail();
                                    }
                                }
                            });
                        });
                    } else {
                        return false;
                    }
                });
            },
            skip: function () {
                const params = {
                    cmd: RequestCmd.RESET_FIRST_LOGIN_FLAG,
                    first_login_flag: "1"
                };
                params[sessionStorage["level"] === "2" ? "need_change_root_pwd" : "need_change_user_pwd"] = "1";
                Page.postJSON({
                    json: params,
                    success: function () {
                        location.href = Page.getUrl("index.html");
                    }
                });
            },
            backToLogin: function () {
                Page.postJSON({
                    json: {
                        cmd: RequestCmd.LOGOUT
                    },
                    success: function () {
                        location.href = Url.LOGIN;
                    }
                });
            }
        },
        mounted() {
            $('#container').show();
        },
    });

    if (
        navigator.appName == "Microsoft Internet Explorer" &&
        parseInt(navigator.appVersion.split(";")[1].replace(/[ ]/g, "").replace("MSIE", "")) < 10
    ) {
        AlertUtil.alertMsg(DOC.login.Browser);
        return false;
    }

    //如果首次访问页面时sessionStorage中还不存在sessionID时，直接跳转登录页面
    if (!sessionStorage["sessionId"]) {
        location.href = Page.getUrl(Url.LOGIN);
    }

    //浏览器标题
    var web_browser_title = "";
    //禁止右键和键盘复制功能
    document.oncontextmenu = function (event) {
        if (window.event) {
            event = window.event;
        }
        try {
            var the = event.srcElement;
            if (!((the.tagName == "INPUT" && the.type.toLowerCase() == "text") || the.tagName == "TEXTAREA")) {
                return false;
            }
            return true;
        } catch (e) {
            return false;
        }
    };
    document.onkeydown = function () {
        if (window.event.ctrlKey && window.event.keyCode == 85) {
            event.keyCode = 0;
            event.returnValue = false;
            return false;
        }
    };
    function init() {
        if (Page.logoPath == "logo_mexico_custom.png" || Page.logoPath == "logo_claro.svg") {
            document.title = "Quamtum Connect 1";
        } else if (Page.theme == "main.mtn.css") {
            document.title = "MTN Broadband 5G Router ZLT X28";
        } else {
            document.title = web_browser_title || DOC.head;
        }
        const canLogin = sessionStorage["canLogin"];
        if (
            canLogin === "AUTH" &&
            Page.level === "3" &&
            (Page.first_login_flag !== "1" || Page.need_change_user_pwd !== "1") &&
            Page.pageHideCheck(247)
        ) {
            setTimeout(()=>vm.showChangePwd = true, 100)
            vm.passwordTips = PROMPT.tips.powerPassword;
            return false;
        }
        if (
            canLogin === "AUTH" &&
            Page.level === "2" &&
            (Page.first_login_flag !== "1" || Page.need_change_root_pwd !== "1") &&
            Page.pageHideCheck(247)
        ) {
            setTimeout(()=>vm.showChangePwd = true, 100)
            vm.passwordTips = PROMPT.tips.rootPassword;
            return false;
        }
        // 2-3 级账号有导向功能界面
        if (["2", "3"].includes(Page.level) && 
            Page.iad_ready_status == "1" && 
            Page.first_login_step !== "1" && 
            Page.pageHideCheck(247) &&
            Page.aeraId != 'UK0603') {
            sessionStorage["isStep"] = "1";
            document.title = "step";
            $.ajax({
                url: "html/step.html",
                dataType: "html",
                type: "GET",
                async: false,
                success: function (data) {
                    if (canLogin == "AUTH") {
                        $("#step").html(data);
                    } else {
                        location.href = Page.getUrl(Url.LOGIN);
                    }
                }
            });
        } else {
            sessionStorage["isStep"] = "0";
            $.ajax({
                url: "html/home.html",
                dataType: "html",
                type: "GET",
                async: false,
                success: function (data) {
                    if (canLogin == "AUTH") {
                        $("#container").html(data);
                    } else {
                        location.href = Page.getUrl(Url.LOGIN);
                    }
                }
            });
        }
    }
    document.onkeydown = function (event) {
        var target, code, tag;
        if (!event) {
            event = window.event; //针对 ie 浏览器
            target = event.srcElement;
            code = event.keyCode;
            if (code == 13) {
                tag = target.tagName;
                if (tag == "TEXTAREA") {
                    return true;
                } else {
                    return false;
                }
            }
        } else {
            target = event.target; //针对遵循 w3c 标准的浏览器，如 Firefox
            code = event.keyCode;
            if (code == 13) {
                tag = target.tagName;
                if (tag == "INPUT") {
                    return false;
                } else {
                    return true;
                }
            }
        }
    };

    Page.postJSON({
        json: {
            cmd: RequestCmd.INIT_PAGE
        },
        success: function (data) {
            Page.wifi_pwd_forbid = data.wifi_pwd_forbid;
            Page.wifi_ssid_forbid = data.wifi_ssid_forbid;
            Page.x11g_mt7561 = data.x11g_mt7561 == "1";
            var styleTag = document.createElement("link");
            Page.webPageFlag = Page.parseHexPageHide(data.web_page_hide);
            const binaryArr = Page.parseHexToBinary(data.support_hex_string);
            Page.featureSupportInfo = (binaryArr.length < 2 ? binaryArr[0] : binaryArr.join("")).split("").reverse(); 
            var bin = Page.parseHex(data.hide_no_account);
            if (bin.length < 2) {
                var binToArr = bin[0].split("").reverse().join("");
            } else {
                var binToArr = bin.join("").split("").reverse().join("");
            }
            Page.hideNoAccount = binToArr;
            var themeWeb = "";
            if (!data.user_web_theme) {
                themeWeb = "main.css";
            } else {
                themeWeb = data.user_web_theme;
            }
            var themeArray = [
                "main.css",
                "greenTheme.css",
                "main.tot.css",
                "mobot.css",
                "airtel.css",
                "main.mtn.css",
                "main.telo.css",
                "redTheme.css",
                "main.ooredoo.css",
                "main.MY0588.css",
                "main.SA0343.css",
                "main.EG0559.css",
                "main.ORG001.css",
                "main.BW001.css",
            ];
            var themeIndex = themeArray.indexOf(data.user_web_theme);
            if (themeIndex < 0) {
                themeWeb = "main.css";
            }
            if (data.language.toUpperCase() == "AR") {
                themeWeb = data.aeraId === "SA0743" ? "main.arab1.css" : "main.arab.css";
            }
            if (data.aeraId == "SA0513") {
                themeWeb = data.language.toUpperCase() == "AR" ? "main.go_telecom_ar.css" : "main.go_telecom.css";
            }
            if (!!data.web_browser_title) {
                web_browser_title = data.web_browser_title;
            }
            styleTag.setAttribute("href", "css/" + themeWeb + "?t=" + Math.random());
            styleTag.setAttribute("type", "text/css");
            styleTag.setAttribute("rel", "stylesheet");
            $("head")[0].appendChild(styleTag);
            if (data.web_logo_path == "logo_t3.png") {
                var styleTag = document.createElement("link");
                styleTag.setAttribute("href", "t3_favicon.ico");
                styleTag.setAttribute("type", "image/x-icon");
                styleTag.setAttribute("rel", "shortcut icon");
                $("head")[0].appendChild(styleTag);
            }
            if (data.user_web_theme == "main.tot.css") {
                var styleTag = document.createElement("link");
                styleTag.setAttribute("href", "/images/nn90j-whejs.png");
                styleTag.setAttribute("type", "image/x-icon");
                styleTag.setAttribute("rel", "shortcut icon");
                $("head")[0].appendChild(styleTag);
            }
            if (data.web_logo_path == "logo_mexico_custom.png" || data.web_logo_path == "logo_claro.svg") {
                var styleTag = document.createElement("link");
                styleTag.setAttribute("href", "/images/mexico/Q_logo.png");
                styleTag.setAttribute("type", "image/x-icon");
                styleTag.setAttribute("rel", "shortcut icon");
                $("head")[0].appendChild(styleTag);
            }
            if (data.user_web_theme == "main.mtn.css") {
                var styleTag = document.createElement("link");
                styleTag.setAttribute("href", "/images/MTN__Logo_Black.png");
                styleTag.setAttribute("type", "image/x-icon");
                styleTag.setAttribute("rel", "shortcut icon");
                $("head")[0].appendChild(styleTag);
            }
            Page.wlan5g_preferred = data.wlan5g_preferred;
            Page.build_type = data.build_type == "debug" || data.fwversion_type.indexOf("dbg") != -1;
            Page.logoPath = data.web_logo_path;
            Page.theme = data.user_web_theme;
            Page.current_card_type = data.current_card_type == "1" ? "1" : "0";
            Page.iad_ready_status = data.iad_ready_status == "0" ? "0" : "1";
            Page.smsSw = data.smsSw == "1" ? "1" : "0"; //短信功能
            Page.esim_show = data.esim_show == "1" ? "1" : "0";
            Page.simStatus = data.sim_status == "1";
            Page.onenet = data.onenet == "1" ? "1" : "0";
            Page.dm_platform = data.dm_platform == "1" ? "1" : "0";
            Page.networkMode = data.network_mode;
            Page.aeraId = data.aeraId;
            Page.nfcConceal = data.nfcConceal == "1";
            Page.pinStatus = data.pinStatus == "0" ? "0" : "1"; //0隐藏pin相关页面
            Page.operatorFlag = data.sms_lock_sw == "1" ? "1" : "0";
            Object.defineProperty(Page, 'level', {
                value:  data.account_level || "3",
                writable: false,
                configurable: false,
                enumerable: false
            })
            Page.fw_switch = data.fw_switch;
            Page.fwt_ip_port_filter_sw = data.fwt_ip_port_filter_sw == "1" || Page.aeraId != 'AE0001';
            Page.fwt_mac_filter_sw = data.fwt_mac_filter_sw == "1" || Page.aeraId != 'AE0001';
            Page.fwt_port_filter_sw = data.fwt_port_filter_sw == "1" || Page.aeraId != 'AE0001';
            Page.fwt_url_filter_sw = data.fwt_url_filter_sw == "1" || Page.aeraId != 'AE0001';
            Page.isDowngrade = data.isDowngrade == "1";
            Page.parentControl = data.parentControlSwitch == "1" ? "1" : "0"; //家长控制
            Page.lock_plmn_flag = data.lock_plmn_flag; //锁运营商
            Page.dialMode = data.dialMode == "1"; //数据功能开关
            Page.first_login_flag = data.first_login_flag;
            Page.first_login_step = data.first_login_step;
            Page.need_change_user_pwd = data.need_change_user_pwd;
            Page.need_change_root_pwd = data.need_change_root_pwd;
            Page.ip_passthrough_sw = data.ip_passthrough_sw;
            sessionStorage["equipment_model"] = data.REAL_DEVICE_5G;
            var language = data.language.toUpperCase();
            Page.real_device = data.real_device || "";
            Page.device_board_type = data.board_type || ""
            if (!!data.board_type && !!data.idu_dev_type) {
                Page.idu_dev_type = data.idu_dev_type;
            }
            var isDebug = ["dbg", "debug", "userdebug", "dbga", "debugall"];
            if (!!data.fwversion_type && isDebug.indexOf(data.fwversion_type) > -1) {
                Page.isDebugVersion = true;
            }
            $.getJSON("tmp_wlan_para.json?t=" + Math.floor(Math.random() * 10000000), function (result) {
                WlanPara = result;
            }).always(function() {
                if (Page.requireChangeLang(language)) {
                  Page.language = language;
                  $("script[src^='js/language/']").remove();
                  $.getScript("js/language/" + language.toLowerCase() + ".js", init);
                  $.getScript("js/element.js");
                } else {
                  init();
                  $.getScript("js/element.js");
                }
                Page.isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
            });
        }
    });
});

function closeBox() {
    $("#btnClose").click();
}
