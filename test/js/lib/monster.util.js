define(function(require){

	var $ = require("jquery"),
		_ = require("underscore"),
		monster = require("monster");

	var util = {

		/**
		 * Format bytes to display its decimal multiple
		 * @param  {Number} bytes   Number in bytes to format
		 * @param  {Number} pDigits Number of digits after decimal point
		 *                          default: 0 if multiple is < GB, 1 if multiple is >= GB
		 * @return {Object}         Object containing the formatted data about the initial bytes value
		 */
		formatBytes: function (bytes, pDigits) {
			var base = 1000,
				sizes = monster.apps.core.i18n.active().unitsMultiple.byte,
				exponent = Math.floor(Math.log(bytes) / Math.log(base)),
				value = bytes / Math.pow(base, exponent),
				digits = pDigits || (exponent > 2 ? 1 : 0);

			if (bytes === 0) {
				return {
					value: 0,
					unit: sizes[0]
				};
			}
			else {
				return {
					value: value.toFixed(digits),
					unit: sizes[exponent]
				};
			}
		},

		toFriendlyDate: function(pDate, format, pUser, pIsGregorian){
			// If Date is undefined, then we return an empty string.
			// Useful for form which use toFriendlyDate for some fields with an undefined value (for example the carriers app, contract expiration date)
			// Otherwise it would display NaN/NaN/NaN in Firefox for example
			if(typeof pDate !== 'undefined') {
				var self = this,
					isGregorian = typeof pIsGregorian !== 'undefined' ? pIsGregorian : true,
					i18n = monster.apps.core.i18n.active(),
					user = pUser || monster.apps.auth.currentUser,
					user12hMode = user && user.ui_flags && user.ui_flags.twelve_hours_mode ? true : false,
					userDateFormat = user && user.ui_flags && user.ui_flags.date_format ? user.ui_flags.date_format : 'mdy',
					format2Digits = function(number) {
						return number < 10 ? '0'.concat(number) : number;
					},
					today = new Date(),
					todayYear = today.getFullYear(),
					todayMonth = format2Digits(today.getMonth() + 1),
					todayDay = format2Digits(today.getDate()),
					// date can be either a JS Date or a gregorian timestamp
					date = typeof pDate === 'object' ? pDate : (isGregorian ? self.gregorianToDate(pDate) : self.unixToDate(pDate)),
					year = date.getFullYear().toString().substr(2, 2),
					fullYear = date.getFullYear(),
					month = format2Digits(date.getMonth() + 1),
					calendarMonth = i18n.calendar.month[date.getMonth()],
					day = format2Digits(date.getDate()),
					weekDay = i18n.calendar.day[date.getDay()],
					hours = format2Digits(date.getHours()),
					minutes = format2Digits(date.getMinutes()),
					seconds = format2Digits(date.getSeconds()),
					shortDateFormats = {
						'dmy': 'DD/MM/year',
						'mdy': 'MM/DD/year',
						'ymd': 'year/MM/DD'
					},
					patterns = {
						'year': fullYear,
						'YY': year,
						'month': calendarMonth,
						'MM': month,
						'day': weekDay,
						'DD': day,
						'hh': hours,
						'mm': minutes,
						'ss': seconds
					};

				if (typeof format === 'string') {
					var formatString = format.toLowerCase();
					switch(formatString) {
						case 'short':
						case 'date':
							format = shortDateFormats[userDateFormat];
							break;
						case 'shortdate':
							format = shortDateFormats[userDateFormat].replace('year','YY');
							break;
						case 'time':
							format = 'hh:mm:ss';
							break;
						case 'shorttime':
							format = 'hh:mm';
							break;
						case 'shortdatetime':
							format = shortDateFormats[userDateFormat].replace('year','YY') + ' hh:mm';
							break;
						case 'datetime':
							format = shortDateFormats[userDateFormat] + ' - hh:mm:ss';
							break;
					}
				}
				else {
					format = shortDateFormats[userDateFormat] + ' - hh:mm:ss';
				}

				if(format.indexOf('hh') > -1 && format.indexOf('12h') === -1 && user12hMode) {
					format += ' 12h'
				}

				if (format.indexOf('12h') > -1) {
					var suffix;

					if (hours >= 12) {
						if (hours !== 12) {
							hours -= 12;
						}

						suffix = i18n.calendar.suffix.pm;
					}
					else {
						if (hours === '00') {
							hours = 12
						}

						suffix = i18n.calendar.suffix.am;
					}

					patterns.hh = hours;
					patterns['12h'] = suffix;
				}

				_.each(patterns, function(v, k){
					format = format.replace(k, v);
				});

				return format;
			}
			else {
				return '';
			}
		},

		parseDateString: function(dateString, dateFormat) {
			var self = this,
				regex = new RegExp(/(\d+)[\/\-](\d+)[\/\-](\d+)/),
				dateFormats = {
					'mdy': '$1/$2/$3',
					'dmy': '$2/$1/$3',
					'ymd': '$2/$3/$1'
				},
				format = (dateFormat in dateFormats) ? dateFormat : null;

			if(!format) {
				var user = monster.apps.auth.currentUser;
				format = user && user.ui_flags && user.ui_flags.date_format ? user.ui_flags.date_format : 'mdy';
			}

			return new Date(dateString.replace(regex, dateFormats[format]));
		},

		gregorianToDate: function(timestamp) {
			var formattedResponse;

			if(typeof timestamp === 'string') {
				timestamp = parseInt(timestamp);
			}

			if(typeof timestamp === 'number' && !_.isNaN(timestamp)) {
				formattedResponse = new Date((timestamp - 62167219200)*1000);
			}

			return formattedResponse;
		},

		dateToGregorian: function(date) {
			var formattedResponse;

			// This checks that the parameter is an object and not null
			if(typeof date === 'object' && date) {
				formattedResponse = parseInt((date.getTime() / 1000) + 62167219200);
			}

			return formattedResponse
		},

		unixToDate: function(timestamp) {
			var formattedResponse;

			if(typeof timestamp === 'string') {
				timestamp = parseInt(timestamp);
			}

			if(typeof timestamp === 'number' && !_.isNaN(timestamp)) {
				formattedResponse = new Date((timestamp)*1000);
			}

			return formattedResponse;
		},

		dateToUnix: function(date) {
			var formattedResponse;

			// This checks that the parameter is an object and not null
			if(typeof date === 'object' && date) {
				formattedResponse = parseInt(date.getTime() / 1000);
			}

			return formattedResponse;
		},

		unformatPhoneNumber: function(formattedNumber, pSpecialRule) {
			var regex = /[^0-9]/g,
				specialRule = pSpecialRule || 'none';

			if(specialRule === 'keepPlus') {
				regex = /[^0-9\+]/g;
			}

			var phoneNumber = formattedNumber.replace(regex, '');

			return phoneNumber;
		},

		formatPhoneNumber: function(phoneNumber){
			if(phoneNumber) {
				phoneNumber = phoneNumber.toString();
                                if(phoneNumber.length >= 4 && phoneNumber.length <= 6) {
                                        phoneNumber = phoneNumber.replace(/(\w{3})(\d{3})/, '$1 $2');
                                }       
                                else if(phoneNumber.length >= 7 && phoneNumber.length <= 9) {
                                        phoneNumber = phoneNumber.replace(/(\w{3})(\d{2})(\d{2})(\d{2})/, '$1 $2 $3 $4');
                                }       
                                else if(phoneNumber.length === 10) {
                                        phoneNumber = phoneNumber.replace(/(\w{3})(\d{3})(\d{2})(\d{2})/, '$1 $2 $3 $4');
                                }
                                else if(phoneNumber.length === 11) {
                                        phoneNumber = phoneNumber.replace(/(\w{2})(\d{2})(\d{3})(\d{2})(\d{2})/, '$1 $2 $3 $4 $5');
                                }
                                else if(phoneNumber.length === 12) {
                                        phoneNumber = phoneNumber.replace(/(\w{2})(\d{2})(\d{3})(\d{2})(\d{2})(\d{2})/, '$1 $2 $3 $4 $5 $6');
                                }
                                else if(phoneNumber.length === 13) {
                                        phoneNumber = phoneNumber.replace(/(\w{2})(\d{2})(\d{3})(\d{2})(\d{2})(\d{2})/, '$1 $2 $3 $4 $5 $6');
                                }
                                else if(phoneNumber.length < 16) {
                                        phoneNumber = phoneNumber.replace(/(\w{2})(\d{2})(\d{3})(\d{2})(\d{2})(\d{2})(\d{2})/, '$1 $2 $3 $4 $5 $6 $7');
                                }
                                else if(phoneNumber.length < 18) {
                                        phoneNumber = phoneNumber.replace(/(\w{2})(\d{2})(\d{3})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/, '$1 $2 $3 $4 $5 $6 $7 $8');
                                }
                        }

			return phoneNumber;
		},

		randomString: function(length, _chars) {
			var chars = _chars || "23456789abcdefghjkmnpqrstuvwxyz",
				randomString = '';

			for(var i = length; i > 0; i--) {
				randomString += chars.charAt(Math.floor(Math.random() * chars.length));
			}

			return randomString;
		},

		/* Automatically sorts an array of objects. secondArg can either be a custom sort to be applied to the dataset, or a fieldName to sort alphabetically on */
		sort: function(dataSet, secondArg) {
			var fieldName = 'name',
				sortFunction = function(a, b) {
					var aString = a[fieldName].toLowerCase(),
						bString = b[fieldName].toLowerCase(),
						result = (aString > bString) ? 1 : (aString < bString) ? -1 : 0;

					return result;
				},
				result;

			if(typeof secondArg === 'function') {
				sortFunction = secondArg;
			}
			else if(typeof secondArg === 'string') {
				fieldName = secondArg;
			}

			result = dataSet.sort(sortFunction);

			return result;
		},

		/**
		 * @desc add or remove business days to the current date or to a specific date
		 * @param numberOfDays - mandatory integer representing the number of business days to add
		 * @param from - optional JavaScript Date Object
		 */
		getBusinessDate: function(numberOfDays, pFrom) {
			var self = this,
				from = pFrom && pFrom instanceof Date ? pFrom : new Date(),
				weeks = Math.floor(numberOfDays / 5),
				days = ((numberOfDays % 5) + 5) % 5,
				dayOfTheWeek = from.getDay();

			if (dayOfTheWeek === 6 && days > -1) {
				if (days === 0) {
					days -= 2;
					dayOfTheWeek += 2;
				}

				days++;
				dayOfTheWeek -= 6;
			}

			if (dayOfTheWeek === 0 && days < 1) {
				if (days === 0) {
					days += 2;
					dayOfTheWeek -= 2;
				}

				days--;
				dayOfTheWeek += 6;
			}

			if (dayOfTheWeek + days > 5) {
				days += 2;
			}

			if (dayOfTheWeek + days < 1) {
				days -= 2;
			}

			return new Date(from.setDate(from.getDate() + weeks * 7 + days));
		},

		formatPrice: function(value, pDecimals) {
			var decimals = parseInt(pDecimals),
				decimalCount = decimals >= 0 ? decimals : 2,
				roundedValue = Math.round(Number(value)*Math.pow(10,decimalCount))/Math.pow(10,decimalCount);
			
			return roundedValue.toFixed( ((parseInt(value) === value) && (isNaN(decimals) || decimals < 0)) ? 0 : decimalCount );
		},

		// Takes a string and replace all the "_" from it with a " ". Also capitalizes every word. 
		// Useful to display hardcoded data from the database that hasn't make it to the i18n files.
		formatVariableToDisplay: function(str) {
			var formattedString = str.replace(/_/g,' ');

			formattedString = formattedString.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();})

			return formattedString;
		},

		// Function returning if an account is a superduper admin, uses original account by default, but can take an account document in parameter
		isSuperDuper: function(pAccount) {
			var self = this,
				isSuperDuper = false,
				account = pAccount || (monster.apps.hasOwnProperty('auth') && monster.apps.auth.hasOwnProperty('originalAccount') ? monster.apps.auth.originalAccount : {});

			if(account.hasOwnProperty('superduper_admin')) {
				isSuperDuper = account.superduper_admin;
			}

			return isSuperDuper;
		},

		// Function returning if an account is in trial or not
		isTrial: function(pAccount) {
			var self = this,
				isTrial = false,
				account = pAccount || (monster.apps.hasOwnProperty('auth') && monster.apps.auth.hasOwnProperty('originalAccount') ? monster.apps.auth.originalAccount : {});

			if(account.hasOwnProperty('trial_time_left')) {
				isTrial = true;
			}

			return isTrial;
		},

		// Function returning if an account can add external numbers or not
		canAddExternalNumbers: function(pAccount) {
			var self = this,
				hasRights = false,
				account = pAccount || (monster.apps.hasOwnProperty('auth') && monster.apps.auth.hasOwnProperty('originalAccount') ? monster.apps.auth.originalAccount : {});

			if(account.hasOwnProperty('wnm_allow_additions') && account.wnm_allow_additions) {
				hasRights = true;
			}

			return hasRights;
		},

		// Function returning if a user is an admin or not
		isAdmin: function(pUser) {
			var self = this,
				user = pUser || (monster.apps.hasOwnProperty('auth') && monster.apps.auth.hasOwnProperty('currentUser') ? monster.apps.auth.currentUser : {});

			return user.priv_level === 'admin';
		},

		// Function returning if an account is a superduper admin, uses original account by default, but can take an account document in parameter
		isWhitelabeling: function() {
			return monster.config.whitelabel.hasOwnProperty('domain') && monster.config.whitelabel.domain.length > 0;
		},

		// Function returning a Boolean indicating whether the end-user is logged in or not.
		isLoggedIn: function() {
			var self = this,
				isLoggedIn = monster && monster.hasOwnProperty('apps') && monster.apps.hasOwnProperty('auth') && monster.apps.auth.hasOwnProperty('appFlags') && monster.apps.auth.appFlags.isAuthentified;

			return isLoggedIn;
		},
		
		// Function returning a Boolean indicating whether the current user is masquerading a sub-account or not.
		isMasquerading: function() {
			var self = this,
				isMasquerading = false;

			if(monster.hasOwnProperty('apps') && monster.apps.hasOwnProperty('auth') && monster.apps.auth.hasOwnProperty('originalAccount') && monster.apps.auth.hasOwnProperty('currentAccount')) {
				isMasquerading = monster.apps.auth.originalAccount.id !== monster.apps.auth.currentAccount.id;
			}

			return isMasquerading;
		},

		// Function returning a Boolean indicating whether the logged in account is a reseller or not.
		isReseller: function() {
			var self = this,
				isReseller = false;

			if(monster.hasOwnProperty('apps') && monster.apps.hasOwnProperty('auth') && monster.apps.auth.hasOwnProperty('originalAccount') && monster.apps.auth.originalAccount.hasOwnProperty('is_reseller')) {
				isReseller = monster.apps.auth.originalAccount.is_reseller;
			}

			return isReseller;
		},

		// Function returning map of URL parameters
		// Optional key, returns value of specific GET parameter
		// keepHashes was added because having hashes sometimes crashed some requests
		getUrlVars: function(key, pKeepHashes) {
			var vars = {},
				hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&'),
				hash,
				keepHashes = pKeepHashes || false;

			for(var i = 0; i < hashes.length; i++) {
				hash = hashes[i].split('=');
				vars[hash[0]] = keepHashes ? hash[1] : (hash[1] || '').replace(/#/g , '');
			}

			// If we were looking for a specific key, then we only return that value, otherwise, return the full map of GET parameters
			return key ? vars[key] : vars;
		},

		/****************** Helpers not documented because people shoudln't need to use them *******************/

		// Helper only used in conference app, takes seconds and transforms it into a timer
		friendlyTimer: function(pSeconds, pMode) {
			var seconds = Math.floor(pSeconds),
				mode = pMode || 'normal',
				hours = Math.floor(seconds / 3600),
				minutes = Math.floor(seconds / 60) % 60,
				remainingSeconds = seconds % 60,
				i18n = monster.apps.core.i18n.active(),
				displayTime;

			if(mode === 'verbose') {
				displayTime = hours + ' ' + i18n.friendlyTimer.hours + ', ' + minutes + ' ' +  i18n.friendlyTimer.minutesAnd + ' ' + remainingSeconds + ' ' + i18n.friendlyTimer.seconds;
			}
			else {
				displayTime = (hours < 10 ? '0' + hours : '' + hours) + ':' + (minutes < 10 ? '0' + minutes : '' + minutes) + ':' + (remainingSeconds < 10 ? '0' + remainingSeconds : '' + remainingSeconds);
			}

			return seconds >= 0 ? displayTime : '00:00:00';
		},

		/*
			This function will automatically logout the user after %wait% minutes (defaults to 30).
			This function will show a warning popup %alertBeforeLogout% minutes before logging out (defaults to 2). If the user moves his cursor, the timer will reset.
		*/
		autoLogout: function() {
			if(!monster.config.whitelabel.hasOwnProperty('logoutTimer') || monster.config.whitelabel.logoutTimer > 0) {
				var i18n = monster.apps.core.i18n.active(),
					timerAlert,
					timerLogout,
					wait = monster.config.whitelabel.logoutTimer || 30,
					alertBeforeLogout = 2,
					alertTriggered = false,
					alertDialog,
					logout = function()	{
						monster.pub('auth.logout');
					},
					resetTimer = function() {
						clearTimeout(timerAlert);
						clearTimeout(timerLogout);

						if(alertTriggered) {
							alertTriggered = false;

							alertDialog.dialog('close').remove();
						}

						timerAlert=setTimeout(function() {
							alertTriggered = true;

							alertDialog = monster.ui.alert(i18n.alertLogout);
						}, 60000*(wait-alertBeforeLogout));

						timerLogout=setTimeout(function() {
							logout();
						}, 60000*wait);
					};

				document.onkeypress = resetTimer;
				document.onmousemove = resetTimer;

				resetTimer();
			}
		},

		/* Set the language to start the application.
			By default will take the value from the cookie,
			or if it doesn't exist, it will take the value from the config.js,
			or if it's not set it will fall back to the language of the browser.
			In last resort it will set it to 'en-US' if nothing is set above
		*/
		setDefaultLanguage: function() {
			var browserLanguage = (navigator.language).replace(/-.*/,function(a){return a.toUpperCase();}),// always capitalize the second part of the navigator language
				cookieLanguage = $.cookie('monster-auth') ? ($.parseJSON($.cookie('monster-auth'))).language : undefined,
				defaultLanguage = browserLanguage || 'en-US';

			monster.config.whitelabel.language = cookieLanguage || monster.config.whitelabel.language || defaultLanguage;

			// Normalize the language to always be capitalized after the hyphen (ex: en-us -> en-US, fr-FR -> fr-FR)
			// Will normalize bad input from the config.js or cookie data coming directly from the database
			monster.config.whitelabel.language = (monster.config.whitelabel.language).replace(/-.*/,function(a){return a.toUpperCase();})
		},

		checkVersion: function(obj, callback) {
			var self = this,
				i18n = monster.apps.core.i18n.active();

			if(obj.hasOwnProperty('ui_metadata') && obj.ui_metadata.hasOwnProperty('ui')) {
				if(obj.ui_metadata.ui !== 'monster-ui') {
					monster.ui.confirm(i18n.olderVersion, callback);
				}
				else {
					callback && callback();
				}
			}
			else {
				callback && callback();
			}
		},

		// Not Intended to be used by most developers for now, we need to use it to have a standard transaction formatter.
		// The input needed is an object from the array of transaction returned by the /transactions API.
		formatTransaction: function(transaction, app) {
			transaction.hasAddOns = false;

			// If transaction has accounts/discounts and if at least one of these properties is not empty, run this code
			if(transaction.hasOwnProperty('metadata') && transaction.metadata.hasOwnProperty('add_ons') && transaction.metadata.hasOwnProperty('discounts') && !(transaction.metadata.add_ons.length === 0 && transaction.metadata.discounts.length === 0)) {

				var mapDiscounts = {};
				_.each(transaction.metadata.discounts, function(discount) {
					mapDiscounts[discount.id] = discount;
				});

				transaction.hasAddOns = true;
				transaction.services = [];

				$.each(transaction.metadata.add_ons, function(k, addOn) {
					var discount = 0,
						discountName = 'discount_' + addOn.id,
						discountItem;

					if(mapDiscounts.hasOwnProperty('discountName')) {
						discountItem = mapDiscounts[discountName];
						discount = parseInt(discountItem.quantity) * parseFloat(discountItem.amount);
					}

					addOn.amount = parseFloat(addOn.amount).toFixed(2);
					addOn.quantity = parseFloat(addOn.quantity);
					addOn.monthly_charges = ((addOn.amount * addOn.quantity) - discount).toFixed(2);

					transaction.services.push({
						service: app.i18n.active().servicePlan.titles[addOn.id] || addOn.id,
						rate: addOn.amount,
						quantity: addOn.quantity,
						discount: discount > 0 ? '-' + app.i18n.active().currencyUsed + parseFloat(discount).toFixed(2) : '',
						monthly_charges: addOn.monthly_charges
					});
				});

				transaction.services.sort(function(a, b) {
					return parseFloat(a.rate) <= parseFloat(b.rate);
				});
			}

			transaction.amount = parseFloat(transaction.amount).toFixed(2);

			if(transaction.hasOwnProperty('code')) {
				transaction.friendlyName = app.i18n.active().transactions.codes[transaction.code];

				if(transaction.type === 'credit') {
					transaction.friendlyName += ' ' + app.i18n.active().transactions.refundText;
				}
			}
			
			// translate event if possible
			if(transaction.hasOwnProperty('event') && app.i18n.active().transactions[transaction.event.replace(/ /g, '_').toLowerCase()]) {
				transaction.event = app.i18n.active().transactions[transaction.event.replace(/ /g, '_').toLowerCase()];
			}

			// translate metadata.category if possible
			if(transaction.hasOwnProperty('metadata')) {
				if(transaction.metadata.hasOwnProperty('category') && app.i18n.active().transactions[transaction.metadata.category.replace(/ /g, '_')].toLowerCase())
					transaction.metadata.category = app.i18n.active().transactions[transaction.metadata.category.replace(/ /g, '_').toLowerCase()];
			}

			// If status is missing or among the following list, the transaction is approved
			transaction.approved = !transaction.hasOwnProperty('status') || ['authorized','settled','settlement_confirmed', 'submitted_for_settlement'].indexOf(transaction.status) >= 0;

			if(!transaction.approved) {
				transaction.errorMessage = transaction.status in app.i18n.active().transactions.errorStatuses ? app.i18n.active().transactions.errorStatuses[transaction.status] : transaction.status;
			}

			// Our API return created but braintree returns created_at
			transaction.created = transaction.created_at || transaction.created; 

			transaction.friendlyCreated = monster.util.toFriendlyDate(transaction.created);

			return transaction;
		},

		accountArrayToTree: function(accountArray, rootAccountId) {
			var result = {};

			$.each(accountArray, function(k, v) {
				if(v.id === rootAccountId) {
					if(!result[v.id]) { result[v.id] = {}; }
					result[v.id].name = v.name;
					result[v.id].realm = v.realm;
				}
				else {
					var parents = v.tree.slice(v.tree.indexOf(rootAccountId)),
						currentAcc;

					for(var i=0; i<parents.length; i++) {
						if(!currentAcc) {
							if(!result[parents[i]]) { result[parents[i]] = {}; }

							currentAcc = result[parents[i]];
						}
						else {
							if(!currentAcc.children) { currentAcc.children = {}; }
							if(!currentAcc.children[parents[i]]) { currentAcc.children[parents[i]] = {}; }

							currentAcc = currentAcc.children[parents[i]];
						}
					}

					if(!currentAcc.children) { currentAcc.children = {}; }
					if(!currentAcc.children[v.id]) { currentAcc.children[v.id] = {}; }

					currentAcc.children[v.id].name = v.name;
					currentAcc.children[v.id].realm = v.realm;
				}
			});

			return result;
		},

		formatMacAddress: function(pMacAddress) {
			var regex = /[^0-9a-fA-F]/g,
				macAddress = pMacAddress.replace(regex, ''),
				formattedMac = '';

			if(macAddress.length === 12) {
				var i = 0;

				for(var c in macAddress) {
					if((i%2 === 0) && (i !== 0)) {
						formattedMac += ':' + macAddress[i];
					}
					else {
						formattedMac += macAddress[i];
					}
					i++;
				}
			}

			return formattedMac;
		},

		getDefaultRangeDates: function(pRange) {
			var self = this,
				range = pRange || 7,
				dates = {
					from: '',
					to: ''
				};

			var fromDefault = new Date(),
				toDefault = new Date();

			if(range === 'monthly') {
				fromDefault.setMonth(fromDefault.getMonth() - 1);
			}
			else {
				fromDefault.setDate(fromDefault.getDate() - range);
			}
			fromDefault.setDate(fromDefault.getDate() + 1);

			dates.from = fromDefault;
			dates.to = toDefault;

			return dates;
		},

		dateToBeginningOfGregorianDay: function(date) {
			var self = this,
				newDate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0, 0);

			return self.dateToGregorian(newDate);
		},

		dateToEndOfGregorianDay: function(date) {
			var self = this,
				newDate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59, 999);

			return self.dateToGregorian(newDate);
		},

		// expects time string if format 9:00AM or 09:00AM. This is used by Main Number custom hours, and its validation.
		timeToSeconds: function(time) {
			var suffix = time.substring(time.length-2).toLowerCase(),
				timeArr = time.split(':'),
				h = parseInt(timeArr[0],10),
				m = parseInt(timeArr[1],10);

			if(suffix === 'pm' && h < 12) {
				h += 12;
			} else if(suffix === "am" && h === 12) {
				h = 0;
			}

			return (h*3600 + m*60).toString();
		},

		logoutAndReload: function() {
			var self = this;

			$.cookie('monster-auth', null);

			window.location = window.location.pathname;
		},

		// To keep the structure of the help settings consistent, we built this helper so devs don't have to know the exact structure
		// internal function used by different apps to set their own help flags.
		uiFlags: {
			user: {
				get: function(appName, flagName, pUser) {
					var user = pUser || monster.apps.auth.currentUser,
						value;

					if(user.hasOwnProperty('ui_help') && user.ui_help.hasOwnProperty(appName) && user.ui_help[appName].hasOwnProperty(flagName)) {
						value = user.ui_help[appName][flagName];
					}

					return value;
				},
				set: function(appName, flagName, value, pUser) {
					var user = pUser || monster.apps.auth.currentUser;

					user.ui_help = user.ui_help || {};
					user.ui_help[appName] = user.ui_help[appName] || {};
					user.ui_help[appName][flagName] = value;

					return user;
				}
			},

			account: {
				get: function(appName, flagName, pAccount) {
					var account = pAccount || monster.apps.auth.currentAccount,
						value;

					if(account.hasOwnProperty('ui_flags') && account.ui_flags.hasOwnProperty(appName) && account.ui_flags[appName].hasOwnProperty(flagName)) {
						value = account.ui_flags[appName][flagName];
					}

					return value;
				},
				set: function(appName, flagName, value, pAccount) {
					var account = pAccount || monster.apps.auth.currentAccount;

					account.ui_flags = account.ui_flags || {};
					account.ui_flags[appName] = account.ui_flags[appName] || {};
					account.ui_flags[appName][flagName] = value;

					return account;
				}
			}
		},

		// takes a HTML element, and update img relative paths to complete paths if they need to be updated
		// without this, img with relative path would  be displayed from the domain name of the browser, which we want to avoid since we're loading sources from external URLs for some apps
		updateImagePath: function(markup, app) {
			var $markup = $(markup),
				listImg = $markup.find('img'),
				result = '';

			// For each image, check if the path is correct based on the appPath, and if not change it
			for(var i = 0; i < listImg.length; i++) {
				var	currentSrc = listImg[i].src;

				// If it's an image belonging to an app, and the current path doesn't contain the right appPath
				if(currentSrc.indexOf(app.name) >= 0 && currentSrc.indexOf(app.appPath) < 0) {
					// We replace it by the app path and append the path of the image (we strip the name of the app, since it's already part of the appPath)
					var newPath = app.appPath + currentSrc.substring(currentSrc.indexOf(app.name) + app.name.length, currentSrc.length);

					listImg[i].src = newPath;
				}
			}

			for(var j = 0; j < $markup.length; j++) {
				result += $markup[j].outerHTML;
			}

			return result;
		},

		/* Helper function that non ascii to ascii */
		convertUtf8ToAscii: function (str) {

                    var conversions = new Object();
                    conversions['ae'] = 'ä|æ|ǽ';
                    conversions['oe'] = 'ö|œ';
                    conversions['ue'] = 'ü';
                    conversions['Ae'] = 'Ä';
                    conversions['Ue'] = 'Ü';
                    conversions['Oe'] = 'Ö';
                    conversions['A'] = 'À|Á|Â|Ã|Ä|Å|Ǻ|Ā|Ă|Ą|Ǎ';
                    conversions['a'] = 'à|á|â|ã|å|ǻ|ā|ă|ą|ǎ|ª';
                    conversions['C'] = 'Ç|Ć|Ĉ|Ċ|Č';
                    conversions['c'] = 'ç|ć|ĉ|ċ|č';
                    conversions['D'] = 'Ð|Ď|Đ';
                    conversions['d'] = 'ð|ď|đ';
                    conversions['E'] = 'È|É|Ê|Ë|Ē|Ĕ|Ė|Ę|Ě';
                    conversions['e'] = 'è|é|ê|ë|ē|ĕ|ė|ę|ě';
                    conversions['G'] = 'Ĝ|Ğ|Ġ|Ģ';
                    conversions['g'] = 'ĝ|ğ|ġ|ģ';
                    conversions['H'] = 'Ĥ|Ħ';
                    conversions['h'] = 'ĥ|ħ';
                    conversions['I'] = 'Ì|Í|Î|Ï|Ĩ|Ī|Ĭ|Ǐ|Į|İ';
                    conversions['i'] = 'ì|í|î|ï|ĩ|ī|ĭ|ǐ|į|ı';
                    conversions['J'] = 'Ĵ';
                    conversions['j'] = 'ĵ';
                    conversions['K'] = 'Ķ';
                    conversions['k'] = 'ķ';
                    conversions['L'] = 'Ĺ|Ļ|Ľ|Ŀ|Ł';
                    conversions['l'] = 'ĺ|ļ|ľ|ŀ|ł';
                    conversions['N'] = 'Ñ|Ń|Ņ|Ň';
                    conversions['n'] = 'ñ|ń|ņ|ň|ŉ';
                    conversions['O'] = 'Ò|Ó|Ô|Õ|Ō|Ŏ|Ǒ|Ő|Ơ|Ø|Ǿ';
                    conversions['oe'] = 'ò|ó|ô|õ|ō|ŏ|ǒ|ő|ơ|ø|ǿ|º';
                    conversions['R'] = 'Ŕ|Ŗ|Ř';
                    conversions['r'] = 'ŕ|ŗ|ř';
                    conversions['S'] = 'Ś|Ŝ|Ş|Š';
                    conversions['s'] = 'ś|ŝ|ş|š|ſ';
                    conversions['T'] = 'Ţ|Ť|Ŧ';
                    conversions['t'] = 'ţ|ť|ŧ';
                    conversions['U'] = 'Ù|Ú|Û|Ũ|Ū|Ŭ|Ů|Ű|Ų|Ư|Ǔ|Ǖ|Ǘ|Ǚ|Ǜ';
                    conversions['u'] = 'ù|ú|û|ũ|ū|ŭ|ů|ű|ų|ư|ǔ|ǖ|ǘ|ǚ|ǜ';
                    conversions['Y'] = 'Ý|Ÿ|Ŷ';
                    conversions['y'] = 'ý|ÿ|ŷ';
                    conversions['W'] = 'Ŵ';
                    conversions['w'] = 'ŵ';
                    conversions['Z'] = 'Ź|Ż|Ž';
                    conversions['z'] = 'ź|ż|ž';
                    conversions['AE'] = 'Æ|Ǽ';
                    conversions['ss'] = 'ß';
                    conversions['IJ'] = 'Ĳ';
                    conversions['ij'] = 'ĳ';
                    conversions['OE'] = 'Œ';
                    conversions['f'] = 'ƒ';
                    for(var i in conversions){
                        var re = new RegExp(conversions[i],"g");
                        str = str.replace(re,i);
                    }
			return str;
		},

		/* Helper function that takes an array of number in parameter, sorts it, and returns the first number not in the array, greater than the minVal */
		getNextExtension: function(listNumbers) {
			var orderedArray = listNumbers,
				previousIterationNumber,
				minNumber = 1000,
				lowestNumber = minNumber,
				increment = 1;

			orderedArray.sort(function(a,b) {
				var parsedA = parseInt(a),
					parsedB = parseInt(b);

				if(isNaN(parsedA)) {
					return -1;
				}
				else if(isNaN(parsedB)) {
					return 1;
				}
				else {
					return parsedA > parsedB ? 1 : -1;
				}
			});
			
			_.each(orderedArray, function(number) {
				var currentNumber = parseInt(number);

				// First we make sure it's a valid number, if not we move on to the next number
				if(!isNaN(currentNumber)) {
					// If we went through this loop already, previousIterationNumber will be set to the number of the previous iteration
					if(typeof previousIterationNumber !== 'undefined') {
						// If there's a gap for a number between the last number and the current number, we check if it's a valid possible number (ie, greater than minNumber)
						// And If yes, we return it, if not we just continue
						if(currentNumber - previousIterationNumber !== increment && previousIterationNumber >= minNumber) {
							return previousIterationNumber + increment;
						}
					}
					// else, it's the first iteration, we initialize the minValue to the first number in the ordered array
					// only if it's greater than 1000, because we don't want to recommend lower numbers
					else if(currentNumber > minNumber) {
						lowestNumber = currentNumber;
					}
					// We store current as the previous number for the next iteration
					previousIterationNumber = currentNumber;
				}
			});

			return (previousIterationNumber) ? previousIterationNumber + increment : lowestNumber;
		},

		findCallflowNode: function(callflow, module, data) {
			var self = this,
				result = [],
				matchNode = function(node) {
					if(node.module === module) {
						if(!data || _.isEqual(data, node.data)) {
							result.push(node);	
						}
					}
					_.each(node.children, function(child) {
						matchNode(child);
					});
				};

			matchNode(callflow.flow);

			return result.length > 1 ? result : result[0];
		},

		/**
		 * Determine if a number feature is enalbed on the current account
		 * @param  {String} feature Number feature to check if it is enabled (e.g. e911, cnam)
		 * @param  {Object} account Optional account object to check from
		 * @return {Boolean}        Boolean indicating if the feature is enabled or not
		 */
		isNumberFeatureEnabled: function (feature, account) {
			var self = this,
				accountToCheck = account || monster.apps.auth.currentAccount,
				hasNumbersFeatures = accountToCheck.hasOwnProperty('numbers_features');

			if (hasNumbersFeatures) {
				if (accountToCheck.numbers_features[feature + '_enabled']) {
					return true;
				}
				else {
					return false;
				}
			} else {
				return true;
			}
		},

		// Check if the object is parsable or not
		isJSON: function(obj) {
			var self = this;

			try {
				JSON.stringify(obj);
			}
			catch (e) {
				return false;
			}

			return true;
		}
	};

	return util;
});
