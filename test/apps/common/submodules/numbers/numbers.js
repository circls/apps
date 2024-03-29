define(function(require){
	var $ = require('jquery'),
		_ = require('underscore'),
		monster = require('monster'),
		toastr = require('toastr');

	var numbers = {

		requests: {
		},

		subscribe: {
			'common.numbers.dialogSpare': 'numbersDialogSpare',
			'common.numbers.render': 'numbersRender',
			'common.numbers.getListFeatures': 'numbersGetFeatures'
		},

		/* Arguments:
		** container: jQuery Div
		** callbackAfterRender: callback executed once we rendered the number control
		** viewType: default to 'pbx', can be set to 'pbx', basically changes the view from Number Manager to SmartPBX the if set to 'pbx'
		*/

		numbersRender: function(pArgs){
			var self = this,
				args = pArgs || {},
				container = args.container || $('#monster-content'),
				callbackAfterRender = args.callbackAfterRender,
				viewType = args.viewType || 'manager';

			self.numbersGetData(viewType, function(data) {
				data.viewType = viewType;
				data = self.numbersFormatData(data);

				var numbersView = $(monster.template(self, 'numbers-layout', data)),
					spareView = monster.template(self, 'numbers-spare', data),
					usedView = monster.template(self, 'numbers-used', data);

				numbersView.find('.list-numbers[data-type="spare"]').append(spareView);
				numbersView.find('.list-numbers[data-type="used"]').append(usedView);

				self.numbersBindEvents(numbersView, data);

				container
					.empty()
					.append(numbersView);

				setTimeout(function() {
					var viewType = container.find('.half-box.selected').data('type');

					container.find('.list-numbers[data-type="' + viewType + '"] .search-custom input').focus();
				});

				callbackAfterRender && callbackAfterRender(container);
			});
		},

		//_util
		numbersFormatNumber: function(value) {
			var self = this;

			value.viewFeatures = self.numbersGetFeatures();
			if('locality' in value) {
				value.isoCountry = value.locality.country || '';
				value.friendlyLocality = 'city' in value.locality ? value.locality.city + ('state' in value.locality ? ', ' + value.locality.state : '') : '';
			}

			_.each(value.features, function(feature) {
				if(feature in value.viewFeatures) {
					value.viewFeatures[feature].active = 'active';
				}
			});

			if('used_by' in value) {
				value.friendlyUsedBy = self.i18n.active().numbers[value.used_by];
			}

			value.isLocal = value.features.indexOf('local') > -1;

			return value;
		},

		numbersGetFeatures: function(callback) {
			var self = this,
				features = {
					mobile: { icon: 'monster-grey fa fa-mobile-phone', help: self.i18n.active().numbers.mobileIconHelp },
					failover: { icon: 'monster-green fa fa-thumbs-down feature-failover', help: self.i18n.active().numbers.failoverIconHelp },
					local: { icon: 'monster-purple fa fa-rocket feature-local', help: self.i18n.active().numbers.localIconHelp },
					port: { icon: 'fa fa-phone monster-yellow feature-port' },
					prepend: { icon: 'monster-orange fa fa-file-text-o feature-prepend', help: self.i18n.active().numbers.prependIconHelp },
					regextern: { icon: 'monster-lightgrey fa fa-file-text-o feature-regextern', help: self.i18n.active().numbers.regexternIconHelp }
				};

			if (monster.util.isNumberFeatureEnabled('e911')) {
				features.dash_e911 = { icon: 'monster-red fa fa-ambulance feature-dash_e911', help: self.i18n.active().numbers.e911IconHelp };
			}

			if (monster.util.isNumberFeatureEnabled('cnam')) {
				features.outbound_cnam = { icon: 'monster-blue fa fa-user feature-outbound_cnam', help: self.i18n.active().numbers.cnamOutboundIconHelp };
				features.inbound_cnam = { icon: 'monster-green fa fa-user feature-inbound_cnam', help: self.i18n.active().numbers.cnamInboundIconHelp };
			}

			if(callback) {
				callback && callback(features);
			}
			else return features;
		},

		numbersFormatData: function(data) {
			var self = this,
				mapAccounts = {},
				templateLists = {
					spareNumbers: [],
					usedNumbers: []
				},
				templateData = {
					hidePort: monster.config.whitelabel.hasOwnProperty('hide_port') ? monster.config.whitelabel.hide_port : false,
					viewType: data.viewType,
					canAddExternalNumbers: monster.util.canAddExternalNumbers(),
					listAccounts: []
				};

			/* Initializing accounts metadata */
			var thisAccount = _.extend(monster.apps['auth'].currentAccount, templateLists);

			if(data.viewType !== 'pbx') {
				_.each(data.accounts, function(account) {
					mapAccounts[account.id] = account;
				});
			}

			/* assign each number to spare numbers or used numbers for main account */
			_.each(data.numbers.numbers, function(value, phoneNumber) {
				value.phoneNumber = phoneNumber;

				value = self.numbersFormatNumber(value);

				if(!value.used_by) {
					thisAccount.spareNumbers.push(value);
				}
				else if(data.viewType !== 'pbx') {
					thisAccount.usedNumbers.push(value)
				}
				else if(value.used_by === 'callflow' || value.used_by === 'mobile') {
					thisAccount.usedNumbers.push(value);
				}
			});

			thisAccount.countUsedNumbers = thisAccount.usedNumbers.length;
			thisAccount.countSpareNumbers = thisAccount.spareNumbers.length;
			thisAccount.open = 'open';

			mapAccounts[self.accountId] = thisAccount;

			var sortByDate = function(a,b) {
					return a.updated > b.updated ? -1 : 1;
				},
				sortByName = function(a,b) {
					return a.phoneNumber > b.phoneNumber;
				};

			/* Sort the list of numbers of the main account and add the subaccounts in a list to be ordered by name later */
			_.each(mapAccounts, function(value) {
				if(value.id !== self.accountId) {
					templateData.listAccounts.push(value);
				}
				else {
					value.spareNumbers.sort(sortByName);
					value.usedNumbers.sort(sortByName);
				}
			});

			/* Order the subaccount list by name */
			templateData.listAccounts.sort(function(a,b) {
				return a.name.toLowerCase() > b.name.toLowerCase() ? 1 :-1;
			});

			/* Append our current account with the numbers at the top */
			templateData.listAccounts.unshift(mapAccounts[self.accountId]);

			/* Hide cnam & e911 features if disabled on the account */
			templateData.isE911Enabled = monster.util.isNumberFeatureEnabled('e911');
			templateData.isCnamEnabled = monster.util.isNumberFeatureEnabled('cnam');

			return templateData;
		},

		numbersBindEvents: function(parent, dataNumbers) {
			var self = this,
				listType = dataNumbers.viewType && dataNumbers.viewType === 'manager' ? 'full' : 'partial',
				listSearchedAccounts = [ self.accountId ],
				showLinks = function() {
					if(parent.find('.number-box.selected').size() > 0) {
						parent.find('#trigger_links').show();
					}
					else {
						parent.find('#trigger_links').hide();
					}
				},
				displayNumberList = function(accountId, callback, forceRefresh) {
					var alreadySearched = _.indexOf(listSearchedAccounts, accountId) >= 0,
						forceRefresh = forceRefresh || false;

					if(!alreadySearched || forceRefresh) {
						self.numbersList(accountId, function(numbers) {
							var spareNumbers = [],
								usedNumbers = [],
								sortByName = function(a,b) {
									return a.phoneNumber > b.phoneNumber;
								};

							if(!alreadySearched) {
								listSearchedAccounts.push(accountId);
							}

							_.each(numbers.numbers, function(value, phoneNumber) {
								if(phoneNumber !== 'id' && phoneNumber !== 'quantity') {
									value.phoneNumber = phoneNumber;

									value = self.numbersFormatNumber(value);

									if(!value.used_by) {
										spareNumbers.push(value)
									}
									else if(listType === 'full') {
										usedNumbers.push(value);
									}
									else if(value.used_by === 'callflow' || value.used_by === 'mobile') {
										usedNumbers.push(value);
									}
								}
							});

							_.each(dataNumbers.listAccounts, function(value) {
								if(value.id === accountId) {
									value.spareNumbers = spareNumbers.sort(sortByName);
									value.usedNumbers = usedNumbers.sort(sortByName);
									value.countSpareNumbers = spareNumbers.length;
									value.countUsedNumbers = usedNumbers.length;

									parent
										.find('.list-numbers[data-type="spare"] .account-section[data-id="'+accountId+'"] .numbers-wrapper')
										.empty()
										.append(monster.template(self, 'numbers-spareAccount', { viewType: dataNumbers.viewType, spareNumbers: spareNumbers }))
										.parent()
										.find('.count')
										.html('('+ spareNumbers.length +')');

									parent
										.find('.list-numbers[data-type="used"] .account-section[data-id="'+accountId+'"] .numbers-wrapper')
										.empty()
										.append(monster.template(self, 'numbers-usedAccount', {
											viewType: dataNumbers.viewType,
											usedNumbers: usedNumbers,
											isCnamEnabled: monster.util.isNumberFeatureEnabled('cnam'),
											isE911Enabled: monster.util.isNumberFeatureEnabled('e911')
										}))
										.parent()
										.find('.count')
										.html('('+ usedNumbers.length +')');

									return false;
								}
							});

							callback && callback();
						}, listType);
					}
					else {
						callback && callback();
					}
				};

			/* On init */
			monster.ui.tooltips(parent);

			if(dataNumbers.viewType === 'pbx') {
				parent.find('.list-numbers[data-type="spare"]').hide();
				parent.find('.half-box[data-type="used"]').addClass('selected');
			}
			else {
				parent.find('.list-numbers[data-type="used"]').hide();
				parent.find('.half-box[data-type="spare"]').addClass('selected');
			}

			/* Events */
			/* Toggle between spare/used numbers view */
			parent.find('.half-box').on('click', function() {
				var box = $(this),
					type = box.data('type');

				if(!box.hasClass('selected')) {
					parent.find('.half-box').removeClass('selected');
					parent.find('.list-numbers').hide();

					setTimeout(function() {
						parent.find('.list-numbers[data-type="' + type + '"] .search-custom input').focus();
					});

					box.addClass('selected');
					parent.find('.list-numbers[data-type="'+ type + '"]').show();
				}
			});


			/* Select all numbers when clicking on the account checkbox */
			parent.on('click', '.account-header input[type="checkbox"]', function(event) {
				var checkboxes = $(this).parents('.account-section').first().find('.number-box input[type="checkbox"]'),
					isChecked = $(this).prop('checked');

				checkboxes.prop('checked', isChecked);

				isChecked ? checkboxes.parent().addClass('selected') : checkboxes.parent().removeClass('selected');

				showLinks();
			});

			/* Click on an account header, open list of numbers of this account. Send an API call to search it if it has not been searched already */
			parent.on('click', '.expandable', function(event) {
				var section = $(this).parents('.account-section'),
					accountId = section.data('id'),
					toggle = function() {
						section.toggleClass('open');

						if(!section.hasClass('open')) {
							section.find('input[type="checkbox"]:checked').prop('checked', false);
							section.find('.number-box.selected').removeClass('selected');
						}

						_.each(dataNumbers.listAccounts, function(account) {
							if(account.id === accountId) {
								account.open = section.hasClass('open') ? 'open' : '';
							}
						});
					};

				displayNumberList(accountId, function() {
					toggle();
				});

				showLinks();
			});

			parent.on('click', '.account-header .buy-numbers-link', function(e) {
				var accountId = $(this).parents('.account-section').data('id');

				monster.pub('common.buyNumbers', {
					accountId: accountId,
					searchType: $(this).data('type'),
					callbacks: {
						success: function(numbers) {
							displayNumberList(accountId, function(numbers) {
								parent.find('.account-section[data-id="'+accountId+'"]').addClass('open');
							}, true);
						}
					}
				});
			});

			parent.on('click', '.actions-wrapper .buy-numbers-dropdown .buy-numbers-link', function(e) {
				var accountId = self.accountId;

				monster.pub('common.buyNumbers', {
					accountId: self.accountId,
					searchType: $(this).data('type'),
					callbacks: {
						success: function(numbers) {
							displayNumberList(self.accountId, function(numbers) {}, true);
						}
					}
				});
			});

			parent.on('click', '.account-header .action-number.port', function(e) {
				var accountId = $(this).parents('.account-section').data('id');

				monster.pub('common.port.render', {
					accountId: accountId,
					callbacks: {
						success: function(numbers) {
							displayNumberList(accountId, function(numbers) {
								parent.find('.account-section[data-id="'+accountId+'"]').addClass('open');
							}, true);
						}
					}
				});
			});

			parent.on('click', '.actions-wrapper .action-number.port', function(e) {
				var accountId = self.accountId;

				monster.pub('common.port.render', {
					accountId: accountId,
					searchType: $(this).data('type'),
					callbacks: {
						success: function(numbers) {
							displayNumberList(accountId, function(numbers) {}, true);
						}
					}
				});
			});

			function syncNumbers (accountId) {
				self.numbersSyncUsedBy(accountId, function(numbers) {
					displayNumberList(accountId, function(numbers) {
						toastr.success(self.i18n.active().numbers.sync.success);
					}, true);
				});
			};

			parent.on('click', '.account-header .action-number.add-external', function(e) {
				self.numbersAddExternalNumbers($(this).parents('.account-section').data('id'), function() {
					self.numbersRender({ container: $('#number_manager') });
				});
			});

			parent.on('click', '.account-header .action-number.sync', function(e) {
				syncNumbers($(this).parents('.account-section').data('id'));
			});

			parent.on('click', '.actions-wrapper .action-number.sync', function(e) {
				syncNumbers(self.accountId);
			});

			/* Add class selected when you click on a number box, check/uncheck  the account checkbox if all/no numbers are checked */
			parent.on('click', '.number-box:not(.disabled)', function(event) {
				var currentBox = $(this);

				if(!currentBox.hasClass('no-data')) {
					var section = currentBox.parents('.account-section').first(),
						accountCheckbox = section.find('.account-header input[type="checkbox"]');

					currentBox.toggleClass('selected');

					if(!$(event.target).is('input:checkbox')) {
						var currentCb = currentBox.find('input[type="checkbox"]'),
							cbValue = currentCb.prop('checked');

						currentCb.prop('checked', !cbValue);
					}

					/* Check account checkbox if all the numbers are checked */
					if(section.find('.numbers-wrapper input[type="checkbox"]:checked').size() === section.find('.numbers-wrapper input[type="checkbox"]').size()) {
						accountCheckbox.prop('checked', true);
					}
					else {
						accountCheckbox.prop('checked', false);
					}
				}

				showLinks();
			});

			/* Delete Numbers */
			parent.on('click', '#delete_numbers', function(event) {
				var listNumbers = [],
					mapAccounts = {},
					dataTemplate = {
						delete: true,
						accountList: []
					}
					e911ErrorMessage = '';

				parent.find('.number-box.selected').each(function(k, v) {
					var box = $(v),
						number = box.data('phonenumber');
						accountId = box.parents('.account-section').data('id'),
						accountName = box.parents('.account-section').data('name').toString();

					if(!(accountId in mapAccounts)) {
						mapAccounts[accountId] = {};
						dataTemplate.accountList.push({
							accountName: accountName
						});
					}

					for (var account in dataTemplate.accountList) {
						if ( typeof dataTemplate.accountList[account].numbers == 'undefined' ) {
							dataTemplate.accountList[account].numbers = new Array();
						}

						if ( dataTemplate.accountList[account].accountName == accountName ) {
							dataTemplate.accountList[account].numbers.push(number);
						}
					}

					mapAccounts[accountId][number] = true;
					listNumbers.push(number);
				});

				dataTemplate.numberCount = listNumbers.length;

				_.each(dataTemplate.accountList, function(val) {

					var account = _.find(dataNumbers.listAccounts, function(account) { return account.name === val.accountName }),
						e911Numbers = _.filter(account.spareNumbers, function(num) {
										return num.features.indexOf('dash_e911') >= 0
									}).concat(_.filter(account.usedNumbers, function(num) {
										return num.features.indexOf('dash_e911') >= 0
									})),
						selectedE911Numbers = [];

						if(e911Numbers.length > 0) {
							_.each(e911Numbers, function(number) {
								if(val.numbers.indexOf(number.phoneNumber) >= 0) {
									selectedE911Numbers.push(number.phoneNumber);
								}
							});

							if(e911Numbers.length === selectedE911Numbers.length) {
								if(!e911ErrorMessage) {
									e911ErrorMessage = self.i18n.active().numbers.deleteE911Error.message;
								}
								e911ErrorMessage += "<br><br>" + self.i18n.active().numbers.deleteE911Error.account + " " + val.accountName;
								e911ErrorMessage += "<br>" + self.i18n.active().numbers.deleteE911Error.numbers + " " + selectedE911Numbers.join(', ');
							}
						}
				});

				if(e911ErrorMessage) {
					monster.ui.alert('error', e911ErrorMessage);
				} else {
					var dialogTemplate = $(monster.template(self, "numbers-actionsConfirmation", dataTemplate)),
						requestData = {
							numbers: listNumbers,
							accountId: self.accountId
						};

					var popup = monster.ui.dialog(dialogTemplate, {
						width: '540px',
						title: self.i18n.active().numbers.dialogConfirm.delete.title
					});

					dialogTemplate.on('click', '.remove-number', function() {
						for (var number in requestData.numbers) {
							if ( $(this).parent().data('number') == requestData.numbers[number] ) {
								var tbody = $(this).parent().parent().parent(),
									childCount = tbody[0].childElementCount,
									numbersCount = dialogTemplate.find('h4').find('.monster-blue');

								requestData.numbers.splice(number, 1);
								$(this).parent().parent().remove();

								if ( childCount == 1 ) {
									tbody[0].previousElementSibling.remove();
									tbody.remove();
								}
								numbersCount.text(numbersCount.text() - 1);
							}

							if ( requestData.numbers.length == 0 ) {
								dialogTemplate.parent().parent().remove();
							}
						}
					});

					dialogTemplate.on('click', '.cancel-link', function() {
						popup.remove();
					});

					dialogTemplate.on('click', '#delete_action', function() {
						self.numbersDelete(requestData, function(data) {
							var countDelete = 0;

							_.each(dataNumbers.listAccounts, function(account, indexAccount) {
								if(account.id in mapAccounts) {
									var newList = [];
									_.each(account.spareNumbers, function(number, indexNumber) {
										if(!data.hasOwnProperty('success') || !(number.phoneNumber in data.success)) {
											newList.push(number);
										}
										else {
											countDelete++;
										}
									});

									dataNumbers.listAccounts[indexAccount].spareNumbers = newList;
									dataNumbers.listAccounts[indexAccount].countSpareNumbers = newList.length;
								}
							});

							popup.remove();

							self.numbersShowDeletedNumbers(data);

							self.numbersPaintSpare(parent, dataNumbers, function() {
								//var template = monster.template(self, '!' + self.i18n.active().numbers.successDelete, { count: countDelete });

								//toastr.success(template);
							});
						});
					});
				}

			});

			/* to plugin */
			var moveNumbersToAccount = function(accountId, accountName) {
				var listNumbers = [],
					destinationAccountId = accountId,
					destinationIndex = -1,
					mapAccounts = {},
					dataTemplate = {
						destinationAccountName: accountName,
						move: true,
						accountList: []
					};

				parent.find('.number-box.selected').each(function(k, v) {
					var box = $(v),
						number = box.data('phonenumber');
						accountId = box.parents('.account-section').data('id'),
						accountName = box.parents('.account-section').data('name');

					if(!(accountId in mapAccounts)) {
						mapAccounts[accountId] = {};
						dataTemplate.accountList.push({
							accountName: accountName
						});
					}

					for (var account in dataTemplate.accountList) {
						if ( typeof dataTemplate.accountList[account].numbers == 'undefined' ) {
							dataTemplate.accountList[account].numbers = new Array();
						}

						if ( dataTemplate.accountList[account].accountName == accountName ) {
							dataTemplate.accountList[account].numbers.push(number);
						}
					}

					mapAccounts[accountId][number] = true;
					listNumbers.push(number);
				});

				dataTemplate.numberCount = listNumbers.length;

				var dialogTemplate = $(monster.template(self, "numbers-actionsConfirmation", dataTemplate)),
					requestData = {
						numbers: listNumbers,
						accountId: destinationAccountId
					};

				monster.ui.dialog(dialogTemplate, {
					width: '540px',
					title: self.i18n.active().numbers.dialogConfirm.move.title
				});

				dialogTemplate.on('click', '.remove-number', function() {
					for (var number in requestData.numbers) {
						if ( $(this).parent().data('number') == requestData.numbers[number] ) {
							var tbody = $(this).parent().parent().parent(),
								childCount = tbody[0].childElementCount,
								numbersCount = dialogTemplate.find('h4').find('.monster-blue:first-child');

							requestData.numbers.splice(number, 1);
							$(this).parent().parent().remove();

							if ( childCount == 1 ) {
								tbody[0].previousElementSibling.remove();
								tbody.remove();
							}
							numbersCount.text(numbersCount.text() - 1);
						}

						if ( requestData.numbers.length == 0 ) {
							dialogTemplate.parent().parent().remove();
						}
					}
				});

				dialogTemplate.on('click', '.cancel-link', function() {
					dialogTemplate
						.parent()
						.parent()
						.remove();
				});

				dialogTemplate.on('click', '#move_action', function() {
					self.numbersMove(requestData, function(data) {
						var countMove = 0;

						_.each(dataNumbers.listAccounts, function(account, indexAccount) {
							if(account.id === destinationAccountId) {
								destinationIndex = indexAccount;
							}

							if(account.id in mapAccounts) {
								var newList = [];
								_.each(account.spareNumbers, function(number, indexNumber) {
									if(!(number.phoneNumber in data.success)) {
										newList.push(number);
									}
									else {
										data.success[number.phoneNumber] = number;
										countMove++;
									}
								});

								dataNumbers.listAccounts[indexAccount].spareNumbers = newList;
								dataNumbers.listAccounts[indexAccount].countSpareNumbers = newList.length;
							}
						});

						/* If we didn't open it yet, it will be automatically updated when we click on it */
						if(_.indexOf(listSearchedAccounts, destinationAccountId) > -1) {
							_.each(data.success, function(value, number) {
								dataNumbers.listAccounts[destinationIndex].spareNumbers.push(value);
							});

							dataNumbers.listAccounts[destinationIndex].countSpareNumbers = dataNumbers.listAccounts[destinationIndex].spareNumbers.length;
						}

						self.numbersPaintSpare(parent, dataNumbers, function() {
							var dataTemplate = {
									count: countMove,
									accountName: dataNumbers.listAccounts[destinationIndex].name
								},
								template = monster.template(self, '!' + self.i18n.active().numbers.successMove, dataTemplate);

							dialogTemplate.parent().parent().remove();

							toastr.success(template);
						});
					});
				});
			};

			parent.on('click', '#move_numbers', function() {
				monster.pub('common.accountBrowser.render', {
					container: parent.find('.list-numbers[data-type="spare"] .accounts-dropdown'),
					customClass: 'ab-dropdown',
					addCurrentAccount: true,
					addBackButton: true,
					onAccountClick: function(accountId, accountName) {
						moveNumbersToAccount(accountId, accountName);
						parent.find('.list-numbers[data-type="spare"] .dropdown-move').removeClass('open');
					}
				});
			});

			if (monster.util.isNumberFeatureEnabled('cnam')) {
				parent.on('click', '.cnam-number', function() {
					var row = $(this).parents('.number-box'),
						cnamCell = row.first(),
						phoneNumber = cnamCell.data('phonenumber');

					if(phoneNumber) {
						var args = {
							phoneNumber: phoneNumber,
							callbacks: {
								success: function(data) {
									monster.ui.highlight(row);

									if('cnam' in data.data && data.data.cnam.display_name) {
										cnamCell.find('.features i.feature-outbound_cnam').addClass('active');
									} else {
										cnamCell.find('.features i.feature-outbound_cnam').removeClass('active');
									}

									if('cnam' in data.data && data.data.cnam.inbound_lookup) {
										cnamCell.find('.features i.feature-inbound_cnam').addClass('active');
									} else {
										cnamCell.find('.features i.feature-inbound_cnam').removeClass('active');
									}
								}
							}
						};

						monster.pub('common.callerId.renderPopup', args);
					}
				});
			}

			if (monster.util.isNumberFeatureEnabled('e911')) {
				parent.on('click', '.e911-number', function() {
					var row = $(this).parents('.number-box'),
						e911Cell = row.first(),
						phoneNumber = e911Cell.data('phonenumber');

					if(phoneNumber) {
						var args = {
							phoneNumber: phoneNumber,
							callbacks: {
								success: function(data) {
									monster.ui.highlight(row);

									if(!($.isEmptyObject(data.data.dash_e911))) {
										e911Cell.find('.features i.feature-dash_e911').addClass('active');
									}
									else {
										e911Cell.find('.features i.feature-dash_e911').removeClass('active');
									}
								}
							}
						};

						monster.pub('common.e911.renderPopup', args);
					}
				});
			}

			parent.on('click', '.failover-number', function() {
				var row = $(this).parents('.number-box'),
					failoverCell = row.first(),
					phoneNumber = failoverCell.data('phonenumber');

				if(phoneNumber) {
					var args = {
						phoneNumber: phoneNumber,
						callbacks: {
							success: function(data) {
								monster.ui.highlight(row);

								if(!($.isEmptyObject(data.data.failover))) {
									failoverCell.find('.features i.feature-failover').addClass('active');
								}
								else {
									failoverCell.find('.features i.feature-failover').removeClass('active');
								}
							}
						}
					};

					monster.pub('common.failover.renderPopup', args);
				}
			});

			parent.on('click', '.prepend-number', function() {
				var row = $(this).parents('.number-box'),
					prependCell = row.first(),
					phoneNumber = prependCell.data('phonenumber');

				if(phoneNumber) {
					var args = {
						phoneNumber: phoneNumber,
						callbacks: {
							success: function(data) {
								monster.ui.highlight(row);

								if('prepend' in data.data && data.data.prepend.enabled) {
									prependCell.find('.features i.feature-prepend').addClass('active');
								} 
								else {
									prependCell.find('.features i.feature-prepend').removeClass('active');
								}
							}
						}
					};

					monster.pub('common.numberPrepend.renderPopup', args);
				}
			});

			parent.on('click', '.regextern-number', function() {
				var row = $(this).parents('.number-box'),
					regexternCell = row.first(),
					phoneNumber = regexternCell.data('phonenumber');

				if(phoneNumber) {
					var args = {
						phoneNumber: phoneNumber,
						callbacks: {
							success: function(data) {
								monster.ui.highlight(row);

								if('regextern' in data.data && data.data.regextern.enabled) {
									regexternCell.find('.features i.feature-regextern').addClass('active');
								} 
								else {
									regexternCell.find('.features i.feature-regextern').removeClass('active');
								}
							}
						}
					};

					monster.pub('common.numberRegextern.renderPopup', args);
				}
			});


			var searchListNumbers = function(searchString, parent) {
				var viewList = parent;

				searchString = monster.util.unformatPhoneNumber(searchString);

				self.numbersSearchAccount(searchString, function(data) {
					if(data.account_id) {
						if(_.find(dataNumbers.listAccounts, function(val) { return val.id === data.account_id})) {
							displayNumberList(data.account_id, function() {
								var section = viewList.find('[data-id="' + data.account_id + '"]'),
									numberBox = section.find('[data-phonenumber="' + data.number + '"]');

								if(numberBox.size() > 0) {
									section.addClass('open');
									monster.ui.highlight(numberBox, {
										timer: 5000
									});
								}
								else {
									var type = parent.attr('data-type') === 'spare' ? 'notSpareNumber' : 'notUsedNumber',
										template = monster.template(self, '!' + self.i18n.active().numbers[type], { number: data.number, accountName: section.data('name') });

									toastr.warning(template);
								}
							});
						} else {
							self.numbersRenderNumberPopup(searchString, data.account_id);
						}
					}
				});
			};

			parent.on('click', '.list-numbers[data-type="spare"] button.search-numbers', function(e) {
				var spareList = parent.find('.list-numbers[data-type="spare"]'),
					searchString = spareList.find('.search-custom input[type="text"]').val().toLowerCase();

				searchListNumbers(searchString, spareList);
			});

			parent.on('keyup', '.list-numbers[data-type="spare"] .search-custom input[type="text"]', function(e) {
				if(e.keyCode === 13) {
					var val = e.target.value.toLowerCase(),
						spareList = parent.find('.list-numbers[data-type="spare"]');

					if(val) {
						searchListNumbers(val, spareList);
					}
				}
			});

			parent.on('click', '.list-numbers[data-type="used"] button.search-numbers', function(e) {
				var usedList = parent.find('.list-numbers[data-type="used"]'),
					searchString = usedList.find('.search-custom input[type="text"]').val().toLowerCase();

				searchListNumbers(searchString, usedList);
			});

			parent.on('keyup', '.list-numbers[data-type="used"] .search-custom input[type="text"]', function(e) {
				if(e.keyCode === 13) {
					var val = e.target.value.toLowerCase(),
						usedList = parent.find('.list-numbers[data-type="used"]');

					if(val) {
						searchListNumbers(val, usedList);
					}
				}
			});
		},

		numbersAddIndividualNumber: function(phoneNumber, accountId, success, error) {
			var self = this;

			if(monster.util.canAddExternalNumbers()) {
				self.numbersCreateNumber(phoneNumber, accountId, function() {
					self.numbersActivateNumber(phoneNumber, accountId, function() {
						success && success();
					}, error);
				}, error)
			}
			else {
				error();
			}
		},
		
		numbersAddFreeformNumbers: function(numbers_data, accountId, callback) {
			var self = this,
				parallelRequests = {};

			_.each(numbers_data, function(phoneNumber) {
				parallelRequests[phoneNumber] = function(callback) {
					self.numbersAddIndividualNumber(phoneNumber, accountId, function(data) {
						callback(null, data);
					},
					function(data) {
						callback(null, {});
					});
				};
			});

			monster.parallel(parallelRequests, function(err, results) {
				callback && callback(results);
			});
		},

		numbersAddExternalNumbers: function(accountId, callback) {
			var self = this,
				dialogTemplate = $(monster.template(self, 'numbers-addExternal'));

			dialogTemplate.on('click', '.cancel-link', function() {
				popup.remove();
			});

			dialogTemplate.on('click', '#add_numbers', function(ev) {
				ev.preventDefault();

				var phoneNumbers = dialogTemplate.find('.list-numbers').val(),
					numbersData = [],
					phoneNumber;

				// Users might think a space == new line, so if they added numbers and separated each of them by a new line, we make sure to replace these by a space so our script works
				phoneNumbers = phoneNumbers.replace(/[\n]/g, ' ');
				phoneNumbers = phoneNumbers.replace(/[-\(\)\.]/g, '').split(' ');

				_.each(phoneNumbers, function(number) {
					phoneNumber = number.match(/^\+(.*)$/);

					if(phoneNumber && phoneNumber[1]) {
						numbersData.push(number);
					}
				});

				if(numbersData.length > 0) {
					self.numbersAddFreeformNumbers(numbersData, accountId, function() {
						popup.dialog('close');

						callback && callback();
					});
				}
				else {
					monster.ui.alert(self.i18n.active().numbers.addExternal.dialog.invalidNumbers);
				}
			});

			var popup = monster.ui.dialog(dialogTemplate, {
				title: self.i18n.active().numbers.addExternal.dialog.title
			});
		},

		numbersRenderNumberPopup: function(number, accountId) {
			var self = this;
			self.numbersGetNumberPopupData({
				number: number,
				accountId: accountId,
				callback: function(numberData) {
					var numberPopupTemplate = $(monster.template(self, 'numbers-searchResult', {
							parents: numberData.parentAccounts.concat({
								id: numberData.account.id,
								name: numberData.account.name,
								isAccountFound: true
							}),
							ownedBy: numberData.account.name,
							usedBy: numberData.number.used_by ?  self.i18n.active().numbers[numberData.number.used_by] : undefined
						})),
						numberPopup = monster.ui.dialog(numberPopupTemplate, {
							title: monster.util.formatPhoneNumber(numberData.number.id)
						});

					monster.ui.tooltips(numberPopupTemplate);

					self.numbersBindNumberPopupEvents({
						popup: numberPopup,
						template: numberPopupTemplate,
						data: numberData
					});
				}
			});
		},

		numbersGetNumberPopupData: function(args) {
			var self = this,
				number = args.number,
				accountId = args.accountId,
				callback = args.callback;

			monster.parallel({
				number: function(parallelCallback) {
					self.callApi({
						resource: 'numbers.get',
						data: {
							accountId: accountId,
							phoneNumber: number
						},
						success: function(data, status) {
							parallelCallback(null, data.data);
						}
					});
				},
				account: function(parallelCallback) {
					self.callApi({
						resource: 'account.get',
						data: {
							accountId: accountId
						},
						success: function(data, status) {
							parallelCallback(null, data.data);
						}
					});
				},
				parentAccounts: function(parallelCallback) {
					self.callApi({
						resource: 'account.listParents',
						data: {
							accountId: accountId
						},
						success: function(data, status) {
							parallelCallback(null, data.data);
						}
					});
				}
			}, function(err, results) {
				callback && callback(results);
			});
		},

		numbersBindNumberPopupEvents: function(args) {
			var self = this,
				popup = args.popup,
				template = args.template,
				numberData = args.data;

			template.find('.account-name.masqueradable').on('click', function() {
				monster.pub('core.triggerMasquerading', {
					account: numberData.account,
					callback: function() {
						var currentApp = monster.apps.getActiveApp();
						if(currentApp in monster.apps) {
							monster.apps[currentApp].render();
							popup.dialog('close');
						}
					}
				});
			});
		},

		numbersShowDeletedNumbers: function(data) {
			var self = this,
				deleteRecapTemplate = $(monster.template(self, 'numbers-deleteConfirmation')),
				formattedData = {
					errors: [],
					successes: [],
					countTotal: 0
				};

			_.each(data.error, function(obj, phoneNumber) {
				formattedData.errors.push({ id: phoneNumber, value: monster.util.formatPhoneNumber(phoneNumber)});
			});

			_.each(data.success, function(obj, phoneNumber) {
				formattedData.successes.push({ id: phoneNumber, value: monster.util.formatPhoneNumber(phoneNumber)});
			});

			formattedData.countTotal = formattedData.successes.length + formattedData.errors.length;

			deleteRecapTemplate.find('.results-wrapper').append(monster.ui.results(formattedData));

			deleteRecapTemplate.find('#continue').on('click', function() {
				popup.remove();
			});

			var popup = monster.ui.dialog(deleteRecapTemplate, {
				title: self.i18n.active().numbers.deleteRecapDialog.title
			});
		},

		numbersPaintSpare: function(parent, dataNumbers, callback) {
			var self = this,
				template = monster.template(self, 'numbers-spare', dataNumbers);

			parent
				.find('.list-numbers[data-type="spare"]')
				.empty()
				.append(template);

			callback && callback();
		},

		numbersGetData: function(viewType, callback) {
			var self = this,
				listType = viewType && viewType === 'manager' ? 'full' : 'partial';

			monster.parallel({
					numbers: function(callback) {
						self.numbersList(self.accountId, function(numbers) {
							callback(null, numbers)
						}, listType);
					},
					accounts: function(callback) {
						self.numbersListAccounts(function(accounts) {
							callback(null, accounts);
						});
					}
				},
				function(err, results) {
					callback(results);
				}
			);
		},

		numbersMove: function(args, callback) {
			var self = this;

			self.callApi({
				resource: 'numbers.activateBlock',
				data: {
					accountId: args.accountId,
					data: {
						numbers: args.numbers
					}
				},
				success: function(_dataNumbers, status) {
					callback && callback(_dataNumbers.data);
				}
			});
		},

		numbersSearchAccount: function(phoneNumber, success, error) {
			var self = this;

			self.callApi({
				resource: 'numbers.identify',
				data: {
					accountId: self.accountId,
					phoneNumber: phoneNumber,
					generateError: false
				},
				success: function(_data, status) {
					success && success(_data.data);
				},
				error: function(_data, status) {
					error && error(_data);

					toastr.error(self.i18n.active().numbers.numberNotFound);
				}
			});
		},

		numbersDelete: function(args, callback) {
			var self = this;

			self.callApi({
				resource: 'numbers.deleteBlock',
				data: {
					accountId: args.accountId,
					data: {
						numbers: args.numbers
					}
				},
				success: function(_dataNumbers, status) {
					callback && callback(_dataNumbers.data);
				}
			});
		},

		numbersCreateNumber: function(number, accountId, success, error) {
			var self = this;

			self.callApi({
				resource: 'numbers.create',
				data: {
					accountId: accountId,
					phoneNumber: encodeURIComponent(number)
				},
				success: function(data) {
					success && success(data.data);
				},
				error: function(data) {
					error && error(data);
				}
			});
		},

		numbersActivateNumber: function(number, accountId, success, error) {
			var self = this;

			self.callApi({
				resource: 'numbers.activate',
				data: {
					accountId: accountId,
					phoneNumber: encodeURIComponent(number)
				},
				success: function(data) {
					success && success(data.data);
				},
				error: function(data) {
					error && error(data);
				}
			});
		},

		/* AccountID and Callback in args */
		numbersFormatDialogSpare: function(data, ignoreNumbers, extraNumbers, featureFilters) {
			var self = this,
				formattedData = {
					accountName: data.accountName,
					numbers: {}
				},
				addNumber = function(id, number) {
					number.phoneNumber = id;
					number = self.numbersFormatNumber(number);

					formattedData.numbers[id] = number;
				};

			_.each(data.numbers, function(number, id) {
				if(extraNumbers.indexOf(id) >= 0) {
					addNumber(id, number);
				} else if(number.used_by === '' && ignoreNumbers.indexOf(id) === -1) {
					if(!featureFilters || featureFilters.length === 0) {
						addNumber(id, number);
					} else {
						$.each(featureFilters, function(k, feature) {
							if(number.features && number.features.indexOf(feature) >= 0) {
								addNumber(id, number);
								return false;
							}
						});
					}
				}
			});

			return formattedData;
		},

		numbersDialogSpare: function(args) {
			var self = this,
				accountId = args.accountId,
				accountName = args.accountName || '',
				ignoreNumbers = args.ignoreNumbers || [],
				extraNumbers = args.extraNumbers || [],
				featureFilters = args.featureFilters || [],
				singleSelect = args.singleSelect || false,
				callback = args.callback;

			self.numbersList(accountId, function(data) {
				data.accountName = accountName;

				var formattedData = self.numbersFormatDialogSpare(data, ignoreNumbers, extraNumbers, featureFilters);
				
				monster.pub('common.monsterListing.render', {
					dataList: formattedData.numbers,
					dataType: 'numbers',
					labels: {
						title: self.i18n.active().numbers.dialogSpare.title,
						headline: formattedData.accountName ? (self.i18n.active().numbers.dialogSpare.headline + ' ' + formattedData.accountName) : self.i18n.active().numbers.dialogSpare.headlineNoAccount,
						okButton: self.i18n.active().numbers.dialogSpare.proceed
					},
					singleSelect: singleSelect,
					okCallback: args.callback
				});
			});
		},

		numbersList: function(accountId, globalCallback, pListType) {
			var self = this;

			monster.parallel({
					callflows: function(callback) {
						self.numbersListCallflows(accountId, function(callflows) {
							callback && callback(null, callflows);
						});
					},
					devices: function (callback) {
						self.numbersListMobileDevices(accountId, function (devices) {
							callback && callback(null, devices);
						})
					},
					groups: function(callback) {
						self.numbersListGroups(accountId, function(groups) {
							callback && callback(null, groups);
						});
					},
					users: function(callback) {
						self.numbersListUsers(accountId, function(users) {
							callback && callback(null, users);
						});
					},
					numbers: function(callback) {
						self.numbersListNumbers(accountId, function(numbers) {
							callback && callback(null, numbers);
						}, pListType);
					}
				},
				function(err, results) {
					self.numbersFormatList(accountId, results);

					globalCallback && globalCallback(results.numbers);
				}
			);
		},

		numbersFormatList: function(accountId, data) {
			var self = this,
				mapUsers = {},
				mapGroups = {};

			_.each(data.users, function(user) {
				mapUsers[user.id] = user;
			});

			_.each(data.groups, function(group) {
				mapGroups[group.id] = group;
			});

			_.each(data.callflows, function(callflow) {
				_.each(callflow.numbers, function(number) {
					if(number in data.numbers.numbers) {
						if(callflow.owner_id && callflow.owner_id in mapUsers) {
							var user = mapUsers[callflow.owner_id];

							data.numbers.numbers[number].owner = user.first_name + ' ' + user.last_name;
							data.numbers.numbers[number].ownerType = 'user';
						}
						else if(callflow.group_id) {
							data.numbers.numbers[number].owner = mapGroups[callflow.group_id].name;
							data.numbers.numbers[number].ownerType = 'group';
						}
						else if(callflow.type && callflow.type === 'main') {
							data.numbers.numbers[number].owner = self.i18n.active().numbers.mainNumber;
							data.numbers.numbers[number].ownerType = 'main';
						}
						else if(callflow.type && callflow.type === 'conference') {
							data.numbers.numbers[number].owner = self.i18n.active().numbers.conferenceNumber;
							data.numbers.numbers[number].ownerType = 'conference';
						}
						else {
							data.numbers.numbers[number].owner = self.i18n.active().numbers.callflows;
							data.numbers.numbers[number].ownerType = 'callflows';
						}
					}
				});
			});

			_.each(data.devices, function(device, idx) {
				var mdn = '+1' + device.mobile.mdn;

				data.numbers.numbers[mdn] = {
					assigned_to: accountId,
					features: [ 'mobile' ],
					isLocal: false,
					phoneNumber: mdn,
					state: 'in_service',
					used_by: 'mobile'
				};

				var mobileOwner = {};
				if (device.hasOwnProperty('owner_id')) {
					mobileOwner = {
						owner_id: device.owner_id,
						ownerType: 'mobileUser',
						owner: mapUsers[device.owner_id].first_name + ' ' + mapUsers[device.owner_id].last_name
					}
				}
				else {
					mobileOwner = {
						owner: self.i18n.active().numbers.unassigned
					}
				}
				$.extend(true, data.numbers.numbers[mdn], mobileOwner);
			});

			return data;
		},

		numbersSyncUsedBy: function(accountId, callback) {
			var self = this;

			self.callApi({
				resource: 'numbers.sync',
				data: {
					accountId: accountId
				},
				success: function(numbers) {
					callback && callback(numbers.data);
				}
			});
		},

		numbersListUsers: function(accountId, callback) {
			var self = this;

			self.callApi({
				resource: 'user.list',
				data: {
					accountId: accountId,
					filters: { paginate:false }
				},
				success: function(users, status) {
					callback && callback(users.data);
				}
			});
		},

		numbersListCallflows: function(accountId, callback) {
			var self = this;

			self.callApi({
				resource: 'callflow.list',
				data: {
					accountId: accountId,
					filters: { paginate:false }
				},
				success: function(callflows, status) {
					callback && callback(callflows.data);
				}
			});
		},

		numbersListGroups: function(accountId, callback) {
			var self = this;

			self.callApi({
				resource: 'group.list',
				data: {
					accountId: accountId,
					filters: { paginate:false }
				},
				success: function(groups, status) {
					callback && callback(groups.data);
				}
			});
		},

		// If view asking this list is the number manager, then we use the FULL list (with reserved, port_in numbers), otherwise, we just use the "in_service" filter 
		numbersListNumbers: function(accountId, callback, pListType) {
			var self = this,
				type = pListType || 'partial',
				apiName = type === 'partial' ? 'numbers.list' : 'numbers.listAll';

			self.callApi({
				resource: apiName,
				data: {
					accountId: accountId,
					filters: { paginate:false }
				},
				success: function(_dataNumbers, status) {
					callback && callback(_dataNumbers.data);
				}
			});
		},

		numbersListAccounts: function(callback) {
			var self = this;

			self.callApi({
				resource: 'account.listChildren',
				data: {
					accountId: self.accountId
				},
				success: function(_dataAccounts, status) {
					callback && callback(_dataAccounts.data);
				}
			});
		},

		numbersListMobileDevices: function (accountId, callback) {
			var self = this;

			self.callApi({
				resource: 'device.list',
				data: {
					accountId: accountId,
					filters: {
						filter_device_type: 'mobile',
						has_key: 'mobile'
					}
				},
				success: function(_dataDevices, status) {
					callback && callback(_dataDevices.data)
				}
			});
		}
	};

	return numbers;
});
