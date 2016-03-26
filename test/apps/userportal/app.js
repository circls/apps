define(function(require) {
    var $ = require("jquery"),
            _ = require("underscore"),
            monster = require("monster"),
            toastr = require("toastr");

            app = {
                name: "userportal",
                css: ["app"],
                i18n: {
                    "en-US": { customCss: !1 },
                    "fr-FR": { customCss: !1 },
                    "de-DE": { customCss: !1 },
                    "dk-DK": { customCss: !1 },
                    "dk-DK": { customCss: !1 },
                    "it-IT": { customCss: !1 },
                    "ro-RO": { customCss: !1 },
                    "ru-RU": { customCss: !1 },
                    "nl-NL": { customCss: !1 },
                    "zh-CN": { customCss: !1 },
                    "es-ES": { customCss: !1 }
                },
                userCdrRange: 7,
                requests: {},
                subscribe: {},
                subModules: ['devices'],
                load: function(e) {
                    var t = this;
                    t.initApp(function() {
                        e && e(t)
                    })
                },
                initApp: function(e) {
                    var t = this;
                    monster.pub("auth.initApp", {
                        app: t,
                        callback: e
                    })
                },
                render: function(e) {
                    var t = this;
                    t.renderPortalManager(e)
                },
                renderPortalManager: function(e) {
                    var n = this,
                        e = e || $("#monster-content");
                    n.getUser(n.userId, function(i) {
                        i = n.formatSettings(i);
                        if (typeof monster.apps.auth.currentAccount.provision != 'undefined') {
                            if((monster.apps.auth.currentAccount.provision.createnew_enabled == true || monster.apps.auth.currentUser.priv_level == 'admin') && monster.apps.auth.currentUser.enabled == true)
                                i.createDevice = true;
                        }

                        n.getUserDevices(function(o) {
                            var u, a = {};
                            $.each(e.data, function(e, t) {
                                a[t.device_id] = !0
                            });
                        });

                    var s = $(monster.template(n, "portal_manager", i));
                    n.refreshListDevices(s), n.setupPage(i, s), i.data.vm_to_email_enabled || $(".email-field", s).hide(),
                    (!("call_forward" in i.data) || !i.data.call_forward.enabled) && $("#call-forward-data", s).hide(),
                    e.empty().append(s),
                    $(".dataTables_scrollHeadInner, .dataTables_scrollHeadInner table", s).attr("style", "width:100%"),
                    s.on('click', '.device_edit', function() {
                            var row = $(this).parents('.item-row');
                            id = $(this).data("id");
                            monster.pub('voip.devices.usereditDevice', {
                                        args: id,
                                        callbackSave: function(device) {
                                                row.find('.edit-device').html(device.name);
                                        },
                                        callbackDelete: function(device) {
                                                row.remove();
                                        }
                            });
                    });
                    s.find('.create-device').on('click', function() {
                            var type = $(this).data('type');
                            monster.pub('voip.devices.userrenderAdd', {
                                        type: type,
                                        callbackSave: function(device) {
                                                var dataDevices = {
                                                            new: [],
                                                            old: []
                                                };
                                                dataDevices.new.push(device.id);
                                                dataDevices.old = a;
                                                    self.usersUpdateDevices(dataDevices, userId, function() {
							n.refreshListDevices(s);
                                                    });
                                                row.find('.create-device').html(device.name);
                                        },
                                        callbackDelete: function(device) {
                                                row.remove();
                                        }
                            });
                    });
                });
            },
            refreshListDevices: function(e) {
                var n = this,
                    i = e,
                    s = {
                        cellphone: n.i18n.active().userportal.device_types.cellphone,
                        smartphone: n.i18n.active().userportal.device_types.smartphone,
                        fax: n.i18n.active().userportal.device_types.fax,
                        sip_device: n.i18n.active().userportal.device_types.sip_device,
                        softphone: n.i18n.active().userportal.device_types.softphone,
                        landline: n.i18n.active().userportal.device_types.landline
                    };
                if(typeof monster.apps.auth.currentUser.quickcalldevice == 'undefined')
                    toastr.warning(n.i18n.active().userportal.setquickcallDevice, '', {"timeOut": 10000});
                n.getRegisteredDevices(function(e) {
                    n.getUserDevices(function(o) {
                        $(".list_devices", i).html('<div class="clear"/>'), $("#device_quickcall", i).empty();
                        var u, a = {};
                        $.each(e.data, function(e, t) {
                            a[t.device_id] = !0
                        }),$.each(o.data, function(e, o) {
                            o.registered = o.id in a || $.inArray(o.device_type, ["cellphone", "landline"]) > -1 ? "registered" : "unregistered", u = {
                                status: o.registered,
                                name: o.name,
                                device_type: o.device_type,
                                friendly_type: s[o.device_type],
                                id: o.id
                            };
                        if (typeof monster.apps.auth.currentAccount.provision != 'undefined')
                            if((monster.apps.auth.currentAccount.provision.createnew_enabled == true || monster.apps.auth.currentUser.priv_level == 'admin') && monster.apps.auth.currentUser.enabled == true)
                                u.editDevice = true;
                            if(typeof monster.apps.auth.currentUser.quickcalldevice !== 'undefined')
                                if(monster.apps.auth.currentUser.quickcalldevice == o.id) {
                                    o.registered === "registered" && $("#device_quickcall", i).append('<option value="' + o.id + '" idname="' + o.name + '" SELECTED>' + o.name + "</option>"),
                                    $(".list_devices", i).prepend(monster.template(n, "device_line", u))
                                } else {
                                    o.registered === "registered" && $("#device_quickcall", i).append('<option value="' + o.id + '" idname="' + o.name + '">' + o.name + "</option>"),
                                    $(".list_devices", i).prepend(monster.template(n, "device_line", u))
                                }
                        })
                    })
                })
            },
            setupPage: function(e, n) {
                var r = this,
                    i = n,
                    s = i.find("#call-forward-data"),
                    o = i.find(".email-field");
                $("#ring-number-txt", i).on("keyup", function() {
                    i.find("#ring-device-checkbox").prop("checked", $(this).val() !== "")
                }), $("#vm-to-email-checkbox", i).on("change", function() {
                    $(this).prop("checked") ? o.slideDown() : o.slideUp()
                }), $("#call-forward-enabled", i).on("change", function() {
                    $(this).prop("checked") ? s.slideDown() : s.slideUp()
                }), $("#save-settings-link", i).click(function(n) {
                    n.preventDefault();
                    var s = $("#ring-number-txt", i).val();
                    s.match(/^[\+]?[0-9\s\-\.\(\)]{7,20}$/) && (s = s.replace(/\s|\(|\)|\-|\./g, ""));
                    var o = $("#call-forward-enabled", i).prop("checked"),
                        u = {
                            vm_to_email_enabled: !1,
                            call_forward: {
                                number: s,
                                enabled: o && s !== "" ? !0 : !1,
                                substitute: !$("#ring-device-checkbox", i).prop("checked"),
                                keep_caller_id: $("#call_forward_keep_caller_id", i).prop("checked")
                            }
                        };
                    $("#vm-to-email-checkbox", i).attr("checked") && (u.vm_to_email_enabled = !0, u.email = $("#vm-to-email-txt", i).val());
                    var a = $.extend(!0, {}, e.data, u);
                    a = monster.normalizeUserData(a), monster.updateUser(a, function() {
                        monster.renderPortalManager()
                    })
                }), $("#contact_list_btn", i).click(function(e) {
                    e.preventDefault(), monster.popup_contact_lis$()
                }), r.setupVoicemailTable(n), r.setupCdrTable(n), r.setupContactListTable(n)
            },
            normalizeUserData: function(e) {
                return e.call_forward.number === "" && delete e.call_forward.number, e
            },
            formatSettings: function(e) {
                var t = this;
                return e.data.hasOwnProperty("call_forward") || (e.data.call_forward = {}), e
            },
            setupVoicemailTable: function(e) {
                var self = this,
                    i = [{
                        sTitle: '<input type="checkbox" id="select_all_voicemails"/>',
                        sWidth: "40px",
                        bSortable: !1,
                        fnRender: function(e) {
                            var t = e.aData[e.iDataColumn];
                            return '<input type="checkbox" class="select-checkbox" msg_uri="' + t + '"/>'
                        }
                    }, {
                        sTitle: "messageIndex",
                        bSearchable: !1,
                        bVisible: !1
                    }, {
                        sTitle: "vmboxId",
                        bSearchable: !1,
                        bVisible: !1
                    }, {
                        sTitle: self.i18n.active().userportal.date,
                        sWidth: "250px",
                        iDataSort: 7
                    }, {
                        sTitle: self.i18n.active().userportal.caller_id,
                        sWidth: "200px"
                    }, {
                        sTitle: self.i18n.active().userportal.status,
                        sWidth: "180px",
                        fnRender: function(e) {
                            var t = e.aData[e.iDataColumn];
                            return self.i18n.active().userportal.vmstatus[t]
                        }
                    }, {
                        sTitle: self.i18n.active().userportal.download,
                        bSortable: !1,
                        sWidth: "20px",
                        fnRender: function(e) {
                            var t = e.aData[e.iDataColumn];
                            return '<a href="' + self.formatVMURI(t) + '"><span class="fa fa-download" alt="Download"/></a>'
                        }
                    }, {
                        sTitle: self.i18n.active().userportal.play,
                        bSortable: !1,
                        sWidth: "20px",
                        fnRender: function(e) {
                            var t = e.aData[e.iDataColumn];
                            return '<audio controls="" src="' + n.formatVMURI(t) + '"></audio>'
                        }
                    }, {
                        sTitle: "timestamp",
                        bSearchable: !1,
                        bVisible: !1
                    }];
                monster.ui.table.create("voicemail", $("#voicemail-grid", e), i, {}, {
                    sDom: '<"actions_voicemail">frtlip',
                    sScrollY: "150px",
                    aaSorting: [
                        [3, "desc"]
                    ]
                }), $.fn.dataTableExt.afnFiltering.pop(), $("div.actions_voicemail", e).html('<button id="new-voicemail-link" class="monster-button monster-button-primary" data-action="new">' + 
                self.i18n.active().userportal.mark_as_new + '</button><button id="save-voicemail-link" class="monster-button monster-button-success" data-action="saved">' + self.i18n.active().userportal.mark_as_saved +
                '</button><button id="delete-voicemail-link" class="monster-button monster-button-danger" data-action="deleted">' + self.i18n.active().userportal.delete + "</button>"),
                $("#save-voicemail-link, #delete-voicemail-link, #new-voicemail-link", e).click(function(i) {
                    i.preventDefault();
                    var s, o = $(this).data("action");
                    if ($(".select-checkbox:checked", e).size()) {
                        var u = function() {
                            s = {}, $(".select-checkbox:checked", e).each(function() {
                                var e = $(this).parents("tr")[0],
                                    n = monster.ui.table.voicemail.fnGetData(e, 2);
                                s[n] ? s[n].push(e) : s[n] = [e]
                            }), $.each(s, function(i, s) {
                                n.getVmbox(i, function(i) {
                                    var u;
                                    if (i.data.messages == undefined) return !1;
                                    $.each(s, function(e, n) {
                                        u = monster.ui.table.voicemail.fnGetData(n, 1), $.inArray(o, ["saved", "deleted", "new"]) > -1 && (i.data.messages[u].folder = o)
                                    }), n.updateVmbox(i, function() {
                                        $.each(s, function(e, n) {
                                            $.inArray(o, [self.i18n.active().userportal.issaved, n.i18n.active().userportal.isnew]) > -1 ? monster.ui.table.voicemail.fnUpdate(o, n, 5) : o == "deleted" && monster.ui.table.voicemail.fnDeleteRow(n)
                                        }), $(".select-checkbox, #select_all_voicemails", e).prop("checked", !1)
                                    })
                                })
                            })
                        };
                        o === "delete" ? monster.ui.confirm(n.i18n.active().userportal.are_you_sure_that_you_want_to_delete, function() {
                            u()
                        }) : u()
                    }
                }), $("#select_all_voicemails", e).change(function() {
                    $(".select-checkbox", e).prop("checked", $(this).is(":checked"))
                }), $(e).delegate(".link-quickcall", "click", function() {
                        var m = $("#device_quickcall", e).val(),
                        s = $(this).data("number");
                        m && m.length === 32 ? self.callApi({
                            resource: "device.quickcall",
                            data: {
                                accountId: self.accountId,
                                deviceId: m,
                                number: s
                            },
                            success: function(e) {var startcall =  new Date().getTime(); toastr.info(self.i18n.active().userportal.quickcall_startedto + s, '', {"timeOut": 35000});
                                var stopcall =  new Date().getTime();
                                var difftime = (stopcall*1) - (startcall*1);
//                                if(difftime < 35000)
//                                        toastr.error(self.i18n.active().userportal.quickcall_startedto + s, '', {"timeOut": 3000})
                            }
                        }) : monster.ui.aler$(self.i18n.active().userportal.you_need_to_select_a_registered_device)
                    }), self.getVmboxByOwner(self.userId, function(i) {
                    if (i.data.length > 0) {
                        var s = i.data[0].id;
                        self.getVmbox(s, function(n) {
                            if (self.data.messages) {
                                var i = [];
                                $.each(self.data.messages, function(e, t) {
                                    if (this.folder != "deleted") {
                                        var n = t.media_id,
                                            o = s + "/messages/" + n,
                                            u = new Date((t.timestamp - 62167219200) * 1e3),
                                            a = u.getMonth() + 1,
                                            f = u.getFullYear() % 100,
                                            l = u.getDate(),
                                            c = a + "/" + l + "/" + f,
                                            h = u.toLocaleTimeString(),
                                            p = c + " " + h;

                                        p = monster.util.toFriendlyDate(t.timestamp), i.push(["0", e, s, p, '<a class="link-quickcall" data-number="' + t.caller_id_number + '">' + t.caller_id_number + '</a>  ('+t.caller_id_name+')', t.folder, o, o, t.timestamp])
                                    }
                                }), monster.ui.table.voicemail.fnAddData(i), $(".dataTables_scrollHeadInner, .dataTables_scrollHeadInner table", e).attr("style", "width:100%")
                            }
                        })
                    }
                })
            },
            setupCdrTable: function(e) {
                var n = e,
                    self = this,
                    s = self.userCdrRange,
                    o = [{
                        sTitle: self.i18n.active().userportal.date,
                        sWidth: "250px"
                    }, {
                        sTitle: self.i18n.active().userportal.from_caller_id,
                        sWidth: "160px",
                    }, {
                        sTitle: self.i18n.active().userportal.to_dialed_number,
                        sWidth: "160px"
                    }, {
                        sTitle: self.i18n.active().userportal.duration,
                        sWidth: "160px"
                    }, {
                        sTitle: "billing_seconds",
                        bVisible: !1
                    }];
                monster.ui.table.create("user_cdr", $("#user_cdr-grid", n), o, {}, {
                    sDom: '<"date">frtlip',
                    sScrollY: "150px",
                    aaSorting: [
                        [0, "desc"]
                    ]
                }), $.fn.dataTableExt.afnFiltering.pop(), $("div.date", n).html(self.i18n.active().userportal.start_date + ': <input id="startDate" readonly="readonly" type="text"/>&nbsp;&nbsp;' +
                self.i18n.active().userportal.end_date + ': <input id="endDate" readonly="readonly" type="text"/>&nbsp;&nbsp;&nbsp;&nbsp;<button class="button-search monster-button monster-button-primary" id="searchLink" href="javascript:void(0);">' +
                self.i18n.active().userportal.filter + '</button><label class="call_duration"/>');
                var u = $("#user_cdr-grid_wrapper .call_duration", n);
                $("#user_cdr-grid_wrapper #user_cdr-grid_filter input[type=text]", n).keyup(function() {
                    $(this).val !== "" ? u.hide() : u.show()
                }), $("#searchLink", n).click(function() {
                    var e = $("#startDate", n).val(),
                        o = $("#endDate", n).val(),
                        u = /^(0[1-9]|1[012])[- \/.](0[1-9]|[12][0-9]|3[01])[- \/.](19|20)\d\d$/;
                    monster.ui.table.user_cdr.fnClearTable(), $("#user_cdr-grid_wrapper .call_duration", n).tex$("");
                    if (e.match(u) && o.match(u)) {
                        var a = (new Date(e)).getTime() / 1e3 + 62167219200,
                            f = (new Date(o)).getTime() / 1e3 + 62167219200;
                        f - a <= s * 24 * 60 * 60 ? self.listByDate(a, f) : monster.ui.aler$(monster.template(i, "!" + self.i18n.active().userportal.rangeTooLong, {
                            variable: s
                        }))
                    } else monster.ui.aler$(self.i18n.active().userportal.dates_in_the_filter)
                }), n.lang = "de"; self.initDatePicker(n);
                var a = new Date(self.toStringDate(new Date));
                a.setDate(a.getDate() + 1);
                var f = Math.floor(a.getTime() / 1e3) + 62167219200,
                    l = f - s * 24 * 60 * 60;
                self.listByDate(l, f)
            },
            setupContactListTable: function(e, n) {
                var self = this,
                    e = $(".contact_part", e),
                    n = n || {},
                    s = [{
                        sTitle: self.i18n.active().userportal.name,
                        sWidth: "300px",
                        stextAlign: "left"
                    }, {
                        sTitle: self.i18n.active().userportal.internal_number,
                        fnRender: function(e) {
                            var t = "-",
                                n = e.aData[e.iDataColumn];
                            return n !== "-" && (t = '<a class="link-quickcall" data-number="' + n + '">' + n + "</a>"), t
                        },
                        sWidth: "200px",
                        stextAlign: "left"
                    }, {
                        sTitle: self.i18n.active().userportal.external_number,
                        fnRender: function(e) {
                            var t = "-",
                                n = e.aData[e.iDataColumn];
                            return n !== "-" && (t = '<a class="link-quickcall" data-number="' + n + '">' + n + "</a>"), t
                        },
                        sWidth: "200px",
                        sTextalign: "left"
                    }];
                monster.ui.table.create("contact_list", $("#contact_list_grid", e), s, {}, {
                    sDom: '<"contact_title">frtlip',
                    bAutoWidth: !1,
                    aaSorting: [
                        [0, "desc"]
                    ]
                }), $("div.contact_title", e).html('<div class="device-selector">' + self.i18n.active().userportal.quickcall_device + 
                    '<select class="medium" id="device_quickcall"></select><input type="text" id="manual_number" placeholder="2000" style="vertical-align: inherit;"></input><button id="quickcall_btn" style="display: none;" class="btn primary">' + 
                    self.i18n.active().userportal.call + "</button></div>"), $("#manual_number", e).keyup(function() {
                    $(this).val() !== "" ? $("#quickcall_btn", e).show() : $("#quickcall_btn", e).hide()
                }), $("#quickcall_btn", e).click(function() {
                    var n = $("#device_quickcall", e).val(),
                        s = $("#manual_number", e).val();
                    n && n.length === 32 ? self.callApi({
                        resource: "device.quickcall",
                        data: {
                            accountId: self.accountId,
                            deviceId: n,
                            number: s
                        },
                        success: function(e) {var startcall = new Date().getTime(); toastr.info(self.i18n.active().userportal.quickcall_startedto + s, '', {"timeOut": 35000});
                            var stopcall =  new Date().getTime();
                            var difftime = (stopcall*1) - (startcall*1);
//                            if(difftime < 35000)
//                                    toastr.error(self.i18n.active().userportal.quickcall_startedto + s, '', {"timeOut": 3000})
                        }
                    }) : monster.ui.aler$(self.i18n.active().you_need_to_select_a_registered_device)
                }), $(".cancel-search", e).click(function() {
                    $("#contact_list-grid_filter input[type=text]", e).val(""), monster.ui.table.contact_list.fnFilter("")
                }), self.callApi({
                    resource: "contactList.get",
                    data: {
                        accountId: self.accountId
                    },
                    success: function(data, n) {
                        if (e.data) {
                            $.fn.dataTableExt.afnFiltering.pop();
                            var i = [];
                            $.each(e.data, function(data, t) {
                                self.push([t.name, t.internal_number ? t.internal_number : "-", t.external_number ? t.external_number : "-"])
                            }), monster.ui.table.contact_list.fnAddData(i)
                        }
                    }
                })
            },
            initDatePicker: function(e) {
                function l(e, t) {
                    var r, o;
                    if (t.id == "startDate") {
                        r = i.datepicker("getDate");
                        if (s.datepicker("getDate") == null) o = r, o.setDate(r.getDate() + f), s.val(n.toStringDate(o));
                        else {
                            o = s.datepicker("getDate");
                            if (o > (new Date(r)).setDate(r.getDate() + f) || o <= r) o = r, o.setDate(o.getDate() + f), o > a ? o = a : !0, s.val(n.toStringDate(o))
                        }
                    } else t.id == "endDate" && i.datepicker("getDate") == null && (r = s.datepicker("getDate"), r.setDate(r.getDate() - 1), i.val(n.toStringDate(r)))
                }

                function c(e) {
                    var t = new Date(2011, 0, 0),
                        r, s = n.userCdrRange;
                    return e.id == "endDate" ? (r = a, i.datepicker("getDate") != null && (t = i.datepicker("getDate"), t.setDate(t.getDate() + 1), r = i.datepicker("getDate"),
                        r.setDate(r.getDate() + s), r > a && (r = a))) : e.id == "startDate" && (r = new Date), {
                        minDate: t,
                        maxDate: r
                    }
                }
                var n = this,
                    r = e,
                    i = $("#startDate", r),
                    s = $("#endDate", r),
                    o = new Date,
                    u, a = new Date,
                    f = n.userCdrRange;
                a.setDate(a.getDate() + 1), $("#startDate, #endDate", r).datepicker({
                    beforeShow: c,
                    onSelect: l
                }), u = a, o.setDate((new Date).getDate() - f + 1), i.datepicker("setDate", o), s.datepicker("setDate", u)
            },
            toStringDate: function(e) {
                var t = e.getDate(),
                    n = e.getMonth() + 1,
                    r = e.getFullYear();
                return t < 10 ? t = "0" + t : !0, n < 10 ? n = "0" + n : !0, n + "/" + t + "/" + r
            },
            listByDate: function(e, n) {
                var i = this,
                    s = function(e, t) {
                        var e = parseFloat(e);
                        return seconds = e % 60, minutes = (e - seconds) / 60 % 60, hours = Math.floor((e - seconds) / 3600), t = t || "numbers",
                        hours < 10 && t == "numbers" && (hours = "0" + hours), minutes < 10 && (minutes = "0" + minutes),
                        seconds < 10 && (seconds = "0" + seconds),
                        t == "verbose" ? e = hours + " hours " + minutes + " minutes and " + seconds + " seconds" : e = hours != "00" ? hours + ":" + minutes + ":" + seconds : minutes + ":" + seconds, e
                    };
                i.callApi({
                    resource: "cdrs.listByUser",
                    data: {
                        accountId: i.accountId,
                        userId: i.userId,
                        filters: {
                            created_from: e,
                            created_to: n,
                            paginate: !1
                        }
                    },
                    success: function(e, n) {
                        var i, o, u = 0,
                            a = [];
                        $.each(e.data, function() {
                            this.duration_seconds > 0 && (i = this.duration_seconds >= 0 ? s(this.duration_seconds) : "--",
                            o = monster.util.toFriendlyDate(this.timestamp),
                            u += this.duration_seconds >= 0 ? parseFloat(this.duration_seconds) : 0,
                            a.push([o, this.caller_id_number === this.caller_id_name ? this.caller_id_number || "(empty)" : '<a class="link-quickcall" data-number="' + this.caller_id_number + '">' + this.caller_id_number + '</a> ' + 
                            " (" + this.caller_id_name + ")", this.callee_id_number === this.callee_id_name ? '<a class="link-quickcall" data-number="' + this.dialed_number + '">' + this.dialed_number + '</a> ' ||
                            this.to.substring(0, this.to.indexOf("@") != -1 ? this.to.indexOf("@") : this.to.length) || "(empty)" : '<a class="link-quickcall" data-number="' + this.dialed_number + '">' + this.dialed_number + 
                            '</a> ' + " (" + this.callee_id_name + ")", i || "-", this.duration_seconds, this.timestamp]))
                        }), u = "Total duration : " + s(u, "verbose"), monster.ui.table.user_cdr.fnAddData(a),
                        $(".dataTables_scrollHeadInner, .dataTables_scrollHeadInner table").attr("style", "width:100%")
                    }
                })
            },
            formatVMURI: function(e) {
                var t = this;
                return t.apiUrl + "accounts/" + t.accountId + "/vmboxes/" + e + "/raw?auth_token=" + t.authToken + "&folder=saved"
            },
            getUser: function(e, t) {
                var n = this;
                n.callApi({
                    resource: "user.get",
                    data: {
                        accountId: n.accountId,
                        userId: e
                    },
                    success: function(e) {
                        t && t(e)
                    }
                })
            },
            getRegisteredDevices: function(e) {
                var t = this;
                t.callApi({
                    resource: "device.getStatus",
                    data: {
                        accountId: t.accountId
                    },
                    success: function(t) {
                        e && e(t)
                    }
                })
            },
            getUserDevices: function(e) {
                var t = this;
                t.callApi({
                    resource: "device.list",
                    data: {
                        accountId: t.accountId,
                        filters: {
                            filter_owner_id: t.userId
                        }
                    },
                    success: function(t) {
                        e && e(t)
                    }
                })
            },
            updateUser: function(e, t) {
                var n = this;
                n.callApi({
                    resource: "user.update",
                    data: {
                        accountId: n.accountId,
                        userId: n.userId,
                        data: e
                    },
                    success: function(e) {
                        t && t(e)
                    }
                })
            },
            getVmboxByOwner: function(e, t) {
                var n = this;
                n.callApi({
                    resource: "voicemail.list",
                    data: {
                        accountId: n.accountId,
                        filters: {
                            filter_owner_id: e
                        }
                    },
                    success: function(e) {
                        t && t(e)
                    }
                })
            },
            getVmbox: function(e, t) {
                var n = this;
                n.callApi({
                    resource: "voicemail.get",
                    data: {
                        accountId: n.accountId,
                        voicemailId: e
                    },
                    success: function(e) {
                        t && t(e)
                    }
                })
            },
            updateVmbox: function(e, t) {
                var n = this;
                n.callApi({
                    resource: "voicemail.update",
                    data: {
                        accountId: n.accountId,
                        voicemailId: e.data.id,
                        data: e.data
                    },
                    success: function(e) {
                        t && t(e)
                    }
                })
            }
        };
    return app
});