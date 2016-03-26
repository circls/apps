define(["require", "jquery", "underscore", "monster", "toastr"], function(e) {
    var t = e("jquery"),
        n = e("underscore"),
        r = e("monster"),
        i = e("toastr"),
        s = {
            requests: {},
            subscribe: {
                "debug.registrations.render": "registrationsRender"
            },
            appFlags: {
                tableData: []
            },
            registrationsRender: function(e) {
                var n = this,
                    e = e || {},
                    i = e.parent || t(".right-content"),
                    s = t(r.template(n, "registrations-layout"));
                n.registrationsInitTable(s, function() {
                    n.registrationsBindEvents(s), i.empty().append(s)
                })
            },
            registrationsFormatDataTable: function(e) {
                var n = [];
                return t.each(e, function() {
                    var e = r.util.toFriendlyDate(this.event_timestamp, "MM/DD/year - hh:mm:ss");
                    this.contact = this.contact.replace(/"/g, ""), this.contact = this.contact.replace(/'/g, "\\'"), n.push([this.username, this.contact_ip, this.contact_port, e, this, this.event_timestamp])
                }), n
            },
            registrationsBindEvents: function(e) {
                var n = this;
                e.on("click", ".detail-link", function() {
                    var e = t(this),
                        i = e.data("row"),
                        s = n.appFlags.tableData[i][4],
                        o = t(r.template(n, "registrations-detail", {
                            metadata: s
                        }));
                    o.find("#close").on("click", function() {
                        u.dialog("close").remove()
                    }), o.find(".technical-details").on("click", function() {
                        o.find(".technical-data, .technical-details-hide").show(), o.find(".technical-details").hide()
                    }), o.find(".technical-details-hide").on("click", function() {
                        o.find(".technical-details").show(), o.find(".technical-data, .technical-details-hide").hide()
                    });
                    var u = r.ui.dialog(o, {
                        title: n.i18n.active().registrations.detailDialog.popupTitle,
                        position: ["center", 20]
                    })
                })
            },
            registrationsInitTable: function(e, n) {
                var i = this,
                    s = [{
                        sTitle: i.i18n.active().registrations.tableTitles.username
                    }, {
                        sTitle: i.i18n.active().registrations.tableTitles.ip
                    }, {
                        sTitle: i.i18n.active().registrations.tableTitles.port
                    }, {
                        sTitle: i.i18n.active().registrations.tableTitles.date
                    }, {
                        sTitle: i.i18n.active().registrations.tableTitles.details,
                        fnRender: function(e) {
                            return '<a href="#" class="detail-link monster-link blue" data-row="' + e.iDataRow + '"><i class="fa fa-eye"></i></a>'
                        }
                    }, {
                        bVisible: !1
                    }];
                i.registrationsGetData(function(i) {
                    r.ui.table.create("registrations", e.find("#registrations_grid"), s, i, {
                        sDom: '<"table-custom-actions">frtlip',
                        aaSorting: [
                            [5, "desc"]
                        ]
                    }), t.fn.dataTableExt.afnFiltering.pop(), n && n()
                })
            },
            registrationsGetData: function(e) {
                var t = this;
                t.callApi({
                    resource: "registrations.list",
                    data: {
                        accountId: t.accountId
                    },
                    success: function(n) {
                        var r = t.registrationsFormatDataTable(n.data);
                        t.appFlags.tableData = r, e && e(r)
                    }
                })
            }
        };
    return s
});