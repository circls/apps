define(function(require){
	var $ = require('jquery'),
		_ = require('underscore'),
		monster = require('monster'),
		dataTables = require('datatables'),
		toastr = require('toastr');

	var balance = {

		requests: {
		},

		subscribe: {
			'myaccount.balance.renderContent': '_balanceRenderContent',
			'myaccount.balance.addCreditDialog': '_balanceRenderAddCredit',
			'myaccount.refreshBadges': '_balanceRefreshBadge'
		},

		balanceRange: 'monthly',

		_balanceRefreshBadge: function(args) {
			var self = this;

			if(!args.hasOwnProperty('except') || args.except !== 'balance') {
				self.balanceGet(function(data) {
					var argsBadge = {
						module: 'balance',
						data: self.i18n.active().currencyUsed + " " + parseFloat(data.data.balance).toFixed(2),
						callback: args.callback
					};

					monster.pub('myaccount.updateMenu', argsBadge);
				});
			}
		},

		_balanceRenderContent: function(args) {
			var self = this,
				argsCallback = args.callback,
				defaults = {
					fieldData: {
						accounts: {}
					}
				};

			monster.parallel({
					accounts: function(callback) {
						self.balanceGetAccounts(function(dataAccounts) {
							$.each(dataAccounts.data, function(k, v) {
								defaults.fieldData.accounts[v.id] = v;
							});

							callback(null, defaults);
						});
					},
					balance: function(callback) {
						self.balanceGet(function(data) {
							defaults.amount = parseFloat(data.data.balance).toFixed(2);

							callback(null, data)
						});
					},
					transactions: function(callback) {
						self.balanceGetTransactions(function(dataTransactions) {
							callback(null, dataTransactions)
						});
					}
				},
				function(err, results) {
					monster.pub('myaccount.UIRestrictionsCompatibility', {
						restrictions: monster.apps.auth.originalAccount.ui_restrictions,
						callback: function(uiRestrictions) {
							var renderData = $.extend(true, {},
								defaults,
								self.balanceFormatTableData(results.transactions.data, defaults.fieldData.accounts),
								{uiRestrictions: uiRestrictions}
							);

							renderData.uiRestrictions.balance.show_header = ( renderData.uiRestrictions.balance.show_credit === false && renderData.uiRestrictions.balance.show_minutes === false )  ? false : true;

							var balance = $(monster.template(self, 'balance-layout', renderData)),
								args = {
									module: 'balance',
									data: self.i18n.active().currencyUsed + " " + renderData.amount
								};

							self.balanceBindEvents(balance);

							monster.pub('myaccount.updateMenu', args);
							monster.pub('myaccount.renderSubmodule', balance);

							self.balanceInitTable(balance);

							$.fn.dataTableExt.afnFiltering.pop();

							balance.find('div.table-custom-actions').html(monster.template(self, 'balance-tableActionBar'));

							var optionsDatePicker = {
								container: balance,
								range: self.balanceRange
							};

							monster.ui.initRangeDatepicker(optionsDatePicker);

							var from = new Date(balance.find('#startDate').val()),
								to = new Date(balance.find('#endDate').val());

							balance.find('.refresh-filter').on('click', function() {
								self._balanceRenderContent(args);
							});

							balance.find('.filter-transactions').on('click', function() {
								/* Bug because of Infinite scrolling... we need to manually remove tr */
								monster.ui.table.balance.find('tbody tr').remove();
								monster.ui.table.balance.fnClearTable();

								from = balance.find('#startDate').datepicker('getDate');
								to = balance.find('#endDate').datepicker('getDate');

								self.balanceRefreshTransactionsTable(balance, from, to, defaults.fieldData.accounts);
							});

							balance.find('.download-transactions').on('click', function() {
								var dlFrom = monster.util.dateToBeginningOfGregorianDay(from),
									dlTo = monster.util.dateToEndOfGregorianDay(to);

								window.location.href = self.apiUrl+'accounts/'+self.accountId+'/transactions?created_from='+dlFrom+'&created_to='+dlTo+'&depth=1&reason=only_calls&accept=csv&auth_token=' + self.authToken;
							});

							monster.ui.table.balance.fnAddData(renderData.tabData);

							balance.find('.popup-marker').clickover();

							if (typeof argsCallback === 'function') {
								argsCallback(balance);
							};
						}
					});
				}
			);
		},

		balanceGetDialogData: function(callback) {
			var self = this;

			monster.parallel({
					account: function(callback) {
						self.callApi({
							resource: 'account.get',
							data: {
								accountId: self.accountId
							},
							success: function(data) {
								callback(null, data.data);
							}
						});
					},
					balance: function(callback) {
						self.callApi({
							resource: 'balance.get',
							data: {
								accountId: self.accountId
							},
							success: function(data) {
								callback(null, data.data);
							}
						});
					}
				},
				function(err, results) {
					var data = self.balanceFormatDialogData(results);

					callback && callback(data);
				}
			);
		},

		balanceFormatDialogData: function(data) {
			var self = this,
				amount = data.balance.balance.toFixed(2) || '0.00',
				thresholdData = { enabled: false },
				topupData = { enabled: false };

			if (data.account.hasOwnProperty('threshold')) {
				thresholdData.enabled = true;

				$.extend(true, thresholdData, data.account.threshold);
			}

			if(data.account.hasOwnProperty('topup')) {
				topupData.enabled = true;

				$.extend(true, topupData, data.account.topup);
			}

			var templateData = {
				amount: amount,
				threshold: thresholdData,
				topup: topupData
			};

			return templateData;
		},

		_balanceRenderAddCredit: function(args) {
			var self = this,
				popup;

			self.balanceGetDialogData(function(data) {
				var addCreditDialog = $(monster.template(self, 'balance-addCreditDialog', $.extend({ disableBraintree: monster.config.disableBraintree }, data))),
					dataUpdate = {
						module: self.name,
						data: parseFloat(data.amount).toFixed(2)
					};

				monster.pub('myaccount.updateMenu', dataUpdate);

				popup = monster.ui.dialog(addCreditDialog, {
					title: self.i18n.active().balance.addCreditDialogTitle
				});

				var argsDialog = {
					parent: popup,
					data: data,
					callback: args.callback
				};

				self.balanceBindEventsDialog(argsDialog);
			});
		},

		balanceRefreshTransactionsTable: function(parent, from, to, mapAccounts) {
			var self = this,
				params = {
					from: from,
					to: to,
				};

			self.balanceGetTransactions(params, function(dataTransactions) {
				var data = self.balanceFormatTableData(dataTransactions.data, mapAccounts);
				monster.ui.table.balance.addData(data.tabData);

				parent.find('#call_charges').html(data.totalCharges);
				parent.find('#call_resell').html(data.totalResell);
				parent.find('#minutes_used').html(data.totalMinutes);
			});
		},

		balanceFormatTableData: function(dataRequest, mapAccounts) {
			var self = this,
				data = {
					tabData: [],
					totalMinutes: 0,
					totalCharges: 0,
					totalResell: 0
				};

			if(dataRequest.length > 0) {
				$.each(dataRequest, function(k, v) {
					v.metadata = v.metadata || {
						to: '-',
						from: '-'
					};

					v.metadata.call = { direction: v.metadata.direction || 'inbound', call_id: v.call_id }

					var duration = self.i18n.active().balance.active_call,
						friendlyDate = monster.util.toFriendlyDate(v.created),
						accountName = '-',
						friendlyAmount = parseFloat(v.amount).toFixed(3),
						friendlySubAmount = parseFloat(v.subamount).toFixed(3),
						fromField = monster.util.formatPhoneNumber(v.metadata.from || '').replace(/@.*/, ''),
						toField = monster.util.formatPhoneNumber(v.metadata.to || '').replace(/@.*/, '');

					if('duration' in v.metadata) {
						duration = Math.ceil((parseInt(v.metadata.duration))/60),
						data.totalMinutes += duration;
					}

					if(v.hasOwnProperty('sub_account_name')) {
						accountName = v.sub_account_name;
					}
					else if(v.hasOwnProperty('sub_account_id')) {
						accountName = mapAccounts.hasOwnProperty(v.sub_account_id) ? mapAccounts[v.sub_account_id].name : '-';
					}

					data.totalCharges += parseFloat(v.amount);
					data.totalResell += parseFloat(v.subamount);
					data.tabData.push([
						v.created || '-',
						v.call_id || '-',
						v.metadata.call || '-',
						friendlyDate || '-',
						fromField || '-',
						toField || '-',
						accountName || '-',
						duration || '-',
						friendlyAmount || '-',
						friendlySubAmount || '-'
					]);
				});
				
				data.totalCharges = data.totalCharges.toFixed(3);
				data.totalResell = data.totalResell.toFixed(3);
			}
                        if(monster.apps.auth.originalAccount.is_reseller == true && monster.apps.auth.currentUser.priv_level == 'admin' && monster.apps.auth.currentUser.enabled == true && monster.apps.auth.originalAccount.superduper_admin == true)
                            data.is_superadminreseller = true;
                        if(monster.apps.auth.originalAccount.is_reseller == true && monster.apps.auth.currentUser.priv_level == 'admin' && monster.apps.auth.currentUser.enabled == true)
                            data.is_adminreseller = true;
			return data;
		},

		balanceInitTable: function(parent) {
			var self = this;

			monster.pub('myaccount.UIRestrictionsCompatibility',{
				restrictions: monster.apps.auth.originalAccount.ui_restrictions,
				callback: function(uiRestrictions) {
					var showCredit = uiRestrictions.balance && uiRestrictions.balance.show_credit == false ? false : true,
						columns = [
							{
								'sTitle': 'timestamp',
								'bVisible': false
							},
							{
								'sTitle': 'call_id',
								'bVisible': false
							},
							{
								'sTitle': self.i18n.active().balance.directionColumn,
								'fnRender': function(obj) {
									var icon = '<i class="fa fa-arrow-left monster-orange popup-marker" data-placement="right" data-original-title="Call ID" data-content="'+obj.aData[obj.iDataColumn].call_id+'"></i>';
									if(obj.aData[obj.iDataColumn].direction === 'inbound') {
										icon = '<i class="fa fa-arrow-right monster-green popup-marker" data-placement="right" data-original-title="Call ID" data-content="'+obj.aData[obj.iDataColumn].call_id+'"></i>'
									}
									return icon;
								},
								'sWidth': '5%'

							},
							{
								'sTitle': self.i18n.active().balance.dateColumn,
								'sWidth': '20%'

							},
							{
								'sTitle': self.i18n.active().balance.fromColumn,
								'sWidth': '15%'
							},
							{
								'sTitle': self.i18n.active().balance.toColumn,
								'sWidth': '15%'
							},
							{
								'sTitle': self.i18n.active().balance.accountColumn,
								'sWidth': '15%'
							},
							{
								'sTitle': self.i18n.active().balance.durationColumn,
								'sWidth': '10%'
							}
						];

					if (showCredit) {
						columns[7].sWidth = '10%';
						columns.push({'sTitle': self.i18n.active().balance.amountColumn,'sWidth': '10%'});
					}
					if(monster.apps.auth.originalAccount.is_reseller == true && monster.apps.auth.currentUser.priv_level == 'admin' && monster.apps.auth.currentUser.enabled == true) {
						columns[8].sWidth = '10%';
						columns.push({'sTitle': self.i18n.active().balance.InamountColumn,'sWidth': '10%'});
					}

					monster.ui.table.create('balance', parent.find('#transactions_grid'), columns, {}, {
						bScrollInfinite: true,
						bScrollCollapse: true,
						sScrollY: '300px',
						sDom: '<"table-custom-actions">frtlip',
						aaSorting: [[0, 'desc']]
					});
				}
			});
		},

		balanceCleanFormData: function(module, data) {
			delete data.extra;

			return data;
		},

		balanceFormatData: function(data) {
			return data;
		},

		balanceBindEventsDialog: function(params) {
			var self = this,
				parent = params.parent,
				data = params.data,
				thresholdAlerts = data.threshold.enabled,
				autoRecharge = data.topup.enabled || false,
				tabAnimationInProgress = false,
				thresholdAlertsContent = parent.find('#threshold_alerts_content'),
				thresholdAlertsSwitch = parent.find('#threshold_alerts_switch'),
				autoRechargeContent = parent.find('#auto_recharge_content'),
				autoRechargeSwitch = parent.find('#auto_recharge_switch');

			parent
				.find('.navbar-menu-item-link')
					.on('click', function(event) {
						event.preventDefault();

						var $this = $(this),
							renderTabContent = function () {
								if (!tabAnimationInProgress) {
									tabAnimationInProgress = true;

									parent
										.find('.add-credits-content-wrapper.active')
											.fadeOut(function() {
												parent
													.find('.navbar-menu-item-link.active')
														.removeClass('active');
												$this
													.addClass('active');

												$(this)
													.removeClass('active');
												parent
													.find(event.target.hash)
														.fadeIn(function() {
															$(this)
																.addClass('active');

															tabAnimationInProgress = false;
														});
											});
								}
							};

						if (parent.find('.add-credits-content-wrapper.active input[type="checkbox"]').is(':checked')) {
							var formId = parent.find('.add-credits-content-wrapper.active form').prop('id'),
								hasEmptyValue = false,
								formData = monster.ui.getFormData(formId);

							for (var key in formData) {
								if (formData[key] === '') {
									hasEmptyValue = true;
									break;
								}
							}

							if (hasEmptyValue) {
								monster.ui.alert('warning', self.i18n.active().balance.addCreditPopup.alerts.missingValue[formId], function () {}, {
									title: self.i18n.active().balance.addCreditPopup.alerts.missingValue.title
								});
							}
							else {
								renderTabContent();
							}
						}
						else {
							renderTabContent();
						}
					});

			parent.find('#add_credit').on('click', function(ev) {
				ev.preventDefault();

				var creditsToAdd = parseFloat(parent.find('#amount').val().replace(',','.'));

				if(creditsToAdd) {
					self.balanceAddCredits(creditsToAdd,
						function() {
							var dataToastr = {
								amount: self.i18n.active().currencyUsed + creditsToAdd
							};

							toastr.success(monster.template(self, '!' + self.i18n.active().balance.creditsAdded, dataToastr));

							if(typeof params.callback === 'function') {
								self.balanceGet(function(data) {
									params.callback(data.data.balance);
									parent.dialog('close');
								});
							}
							else {
								parent.dialog('close');
							}
						}
					);
				}
				else{
					monster.ui.alert(self.i18n.active().balance.invalidAmount);
				}
			});

			thresholdAlertsSwitch
				.on('change', function() {
					if ($(this).is(':checked')) {
						thresholdAlertsContent.slideDown();
					}
					else {
						if (thresholdAlerts) {
							self.balanceTurnOffThreshold(function () {
								thresholdAlertsContent
									.slideUp(function () {
										thresholdAlerts  = false;
										toastr.success(self.i18n.active().balance.thresholdAlertsCancelled);
									});
							});
						}
						thresholdAlertsContent.slideUp();
					}
				});

			thresholdAlertsSwitch
				.prop('checked', thresholdAlerts);

			thresholdAlertsContent.toggle(thresholdAlerts);

			parent
				.find('#save_threshold')
					.on('click', function(event) {
						event.preventDefault();

						var thresholdAlertsFormData = monster.ui.getFormData('threshold_alerts_content'),
							dataAlerts = {
								threshold: parseFloat(thresholdAlertsFormData.threshold_alerts_amount.replace(',','.'))
							};

						if(dataAlerts.threshold) {

							if (dataAlerts.threshold) {
								self.balanceUpdateThreshold(dataAlerts, function () {
									parent.dialog('close');
									toastr.success(self.i18n.active().balance.thresholdAlertsEnabled);
								});
							}
							else {
								monster.ui.alert(self.i18n.active().balance.invalidAmount);
							}
						}
						else {
							monster.ui.alert(self.i18n.active().balance.invalidAmount);
						}
					});

			autoRechargeSwitch.on('change', function() {
				if($(this).is(':checked')) {
					autoRechargeContent.slideDown();
				} else {
					if (autoRecharge) {
						self.balanceTurnOffTopup(function() {
							autoRechargeContent
								.slideUp(function () {
									autoRecharge = false;
									toastr.success(self.i18n.active().balance.autoRechargeCancelled);
								});
						});
					}
					else {
						autoRechargeContent.slideUp();
					}
				}
			});

			autoRechargeSwitch
				.prop('checked', autoRecharge);

			autoRechargeContent.toggle(autoRecharge);

			parent.find('#confirm_recharge').on('click', function(event) {
				event.preventDefault();

				var autoRechargeFormData = monster.ui.getFormData('auto_recharge_content'),
					dataTopUp = {
						threshold: parseFloat(autoRechargeFormData.auto_recharge_threshold.replace(',','.')),
						amount: parseFloat(autoRechargeFormData.auto_recharge_amount.replace(',','.'))
					};

				if (dataTopUp.threshold && dataTopUp.amount) {
					if(dataTopUp.threshold && dataTopUp.amount) {
						self.balanceUpdateTopUp(dataTopUp, function() {
							parent.dialog('close');
							toastr.success(self.i18n.active().balance.autoRechargeEnabled);
						});
					}
					else{
						monster.ui.alert(self.i18n.active().balance.invalidAmount);
					}
				}
				else {
					monster.ui.alert(self.i18n.active().balance.invalidAmount);
				}

			});
		},

		balanceBindEvents: function(parent) {
			var self = this;

			setTimeout(function() { parent.find('.search-query').focus(); });

			parent.find('#add_credits').on('click', function() {
				var args = {
					callback: function(amount) {
						var formattedAmount =  parseFloat(amount).toFixed(2),
						    newAmount = self.i18n.active().currencyUsed + " " + formattedAmount,
							argsEvent = {
								module: 'balance',
								data: newAmount
							};

						monster.pub('myaccount.updateMenu', argsEvent);
						parent.find('#amount').html(formattedAmount);
					}
				};

				self._balanceRenderAddCredit(args);
			});
		},

		//utils
		balanceTurnOffThreshold: function (callback) {
			var self = this;

			self.callApi({
				resource: 'account.get',
				data: {
					accountId: self.accountId
				},
				success: function(data, status) {
					if (data.data.hasOwnProperty('threshold')) {
						delete data.data.threshold;

						self.callApi({
							resource: 'account.update',
							data: {
								accountId: self.accountId,
								data: data.data
							},
							success: function(dataUpdate) {
								callback && callback(dataUpdate);
							}
						});
					}
				}
			});
		},

		balanceUpdateThreshold: function (dataThreshold, callback) {
			var self = this;

			self.callApi({
				resource: 'account.get',
				data: {
					accountId: self.accountId
				},
				success: function(data, status) {
					data.data.threshold = dataThreshold;

					self.callApi({
						resource: 'account.update',
						data: {
							accountId: self.accountId,
							data: data.data
						},
						success: function(dataUpdate) {
							callback && callback(dataUpdate);
						}
					});
				}
			});
		},

		balanceTurnOffTopup: function(callback) {
			var self = this;

			self.callApi({
				resource: 'account.get',
				data: {
					accountId: self.accountId
				},
				success: function(data) {
					if(data.data.hasOwnProperty('topup')) {
						delete data.data.topup;

						self.callApi({
							resource: 'account.update',
							data: {
								accountId: self.accountId,
								data: data.data
							},
							success: function(dataUpdate) {
								callback && callback(dataUpdate);
							}
						});
					}
				}
			});
		},

		balanceUpdateTopUp: function(dataTopUp, callback) {
			var self = this;

			self.callApi({
				resource: 'account.get',
				data: {
					accountId: self.accountId
				},
				success: function(data) {
					data.data.topup = dataTopUp;

					self.callApi({
						resource: 'account.update',
						data: {
							accountId: self.accountId,
							data: data.data
						},
						success: function(dataUpdate) {
							callback && callback(dataUpdate);
						}
					});
				}
			});
		},

		balanceGetAccounts: function(success, error) {
			var self = this;

			self.callApi({
				resource: 'account.listDescendants',
				data: {
					accountId: self.accountId
				},
				success: function(data, status) {
					success && success(data, status);
				},
				error: function(data, status) {
					error && error(data, status);
				}
			});

		},

		balanceGetLimits: function(success, error) {
			var self = this;

			self.callApi({
				resource: 'limits.get',
				data: {
					accountId: self.accountId,
				},
				success: function(data, status) {
					success && success(data, status);
				},
				error: function(data, status) {
					error && error(data, status);
				}
			});
		},

	 	balanceGetTransactions: function(params, success, error) {
			var self = this;

			if(typeof params === 'function') {
				success = params;
				error = success;

				var dates = monster.util.getDefaultRangeDates(self.balanceRange),
					params = {};

				params.to = dates.to;
				params.from = dates.from;
			}

			var from = monster.util.dateToBeginningOfGregorianDay(params.from),
				to = monster.util.dateToEndOfGregorianDay(params.to);

			self.callApi({
				resource: 'balance.filtered',
				data: {
					accountId: self.accountId,
					from: from,
					to: to,
					reason: 'only_calls'
				},
				success: function(data, status) {
					success && success(data, status);
				},
				error: function(data, status) {
					error && error(data, status);
				}
			});
		},

		balanceUpdateLimits: function(limits, success, error) {
			var self = this;

			self.callApi({
				resource: 'limits.update',
				data: {
					accountId: self.accountId,
					data: limits
				},
				success: function(data, status) {
					success && success(data, status);
				},
				error: function(data, status) {
					error && error(data, status);
				}
			});
		},

		balanceGet: function(success, error) {
			var self = this;

			self.callApi({
				resource: 'balance.get',
				data: {
					accountId: self.accountId
				},
				success: function(data, status) {
					success && success(data, status);
				},
				error: function(data, status) {
					error && error(data, status);
				}
			});
		},

		balanceAddCredits: function(credits, success, error) {
			var self = this,
				data = {
					amount: credits
				};

			self.balanceUpdateRecharge(data, success, error);
		},

		balanceUpdateRecharge: function(data, success, error) {
			var self = this;

			self.callApi({
				resource: 'balance.add',
				data: {
					accountId: self.accountId,
					data: data
				},
				success: function(data, status) {
					success && success(data, status);
				},
				error: function(data, status) {
					error && error(data, status);
				}
			});
		},
	};

	return balance;
});
