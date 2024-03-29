define(function(require){
	var $ = require('jquery')
		,_ = require('underscore')
		,toastr = require('toastr')
		,monster = require('monster');

	var app = {

		requests: {
			/* Provisioner */
			'common.chooseModel.getProvisionerData': {
				apiRoot: monster.config.api.provisioner,
				url: 'phones',
				verb: 'GET'
			}
		},

		subscribe: {
			'common.chooseModel.render': 'chooseModelRender'
		},

		chooseModelRender: function(args) {
			var self = this;
				if(typeof args.deviceData == "object" && typeof args.callback == "function") {
					callback = args.callback
				} else
					args.deviceData = {};

			monster.request({
				resource: 'common.chooseModel.getProvisionerData',
				data: {},
				success: function(dataProvisioner) {
				var provData = {}; provData.prov = dataProvisioner.data; provData.device = args.deviceData;
					var dataTemplate = self.chooseModelFormatProvisionerData(provData);
					dataTemplate.show_not_listed_links = args.callbackMissingBrand ? true : false;
					self.chooseModelRenderProvisioner(dataTemplate, args.callback, args.callbackMissingBrand);
				}
			});
		},

		chooseModelFormatProvisionerData: function(data) {
			var formattedData = { 
					brands: []
				},
				families,
				models;

			_.each(data.prov, function(brand, brandKey) {
				families = [];

				_.each(brand.families, function(family, familyKey) {
					models = [];

					_.each(family.models, function(model, modelKey) {
						models.push({
							id: modelKey.toLowerCase(),
							name: model.name
						});
					});

					families.push({
						id: familyKey.toLowerCase(),
						name: family.name,
						models: models
					});
				});

				formattedData.brands.push({
					id: brandKey.toLowerCase(),
					name: brand.name,
					families: families
				});
				formattedData.device = data.device;
			});
			return formattedData;
		},

		chooseModelRenderProvisioner: function(dataTemplate, callback, callbackMissingBrand) {
			var self = this,
				selectedBrand,
				selectedFamily,
				selectedModel,
				templateDevice = $(monster.template(self, 'chooseModel-provisioner', dataTemplate));

			monster.ui.validate(templateDevice.find('#device_form'), {
				rules: {
					'name': {
						required: true
					},
					'mac_address': {
						required: true,
						mac: true
					}
				}
			});

                        if (typeof monster.apps.auth.currentAccount.provision == "object") {
                            if(monster.apps.auth.currentAccount.provision.provision_enabled == false || monster.apps.auth.currentAccount.provision.urlpass == "") {
                                toastr.error(self.i18n.active().chooseModel.provstring_conferror, '', {"timeOut": 10000});
                            }
                        } else {
                                toastr.error(self.i18n.active().chooseModel.provstring_conferror, '', {"timeOut": 10000});
                        }

			templateDevice.find('#mac_address').mask("hh:hh:hh:hh:hh:hh", {placeholder:" "});

			templateDevice.find('.brand-box').on('click', function() {
				var $this = $(this),
					brand = $this.data('brand');

				selectedBrand = brand;

				if ( !$this.hasClass('unselected') && !$this.hasClass('selected') ) {
					$this.addClass('selected');

					$.each($this.siblings(), function(index, val) {
						$(val).addClass('unselected');
					});

					templateDevice.find('.models-brand[data-brand="' + brand + '"]').show(0, function() {
						templateDevice.find('.block-model').slideDown();
					});
				} else if ( $this.hasClass('unselected') ) {
					templateDevice.find('.models-brand[data-brand="' + templateDevice.find('.brand-box.selected').data('brand') + '"]').fadeOut('fast', function() {
						templateDevice.find('.brand-box.selected').removeClass('selected').addClass('unselected');

						$this.removeClass('unselected').addClass('selected');
						templateDevice.find('.models-brand[data-brand="' + brand + '"]').fadeIn('fast');
					});

				}
			});

			templateDevice.find('.model-box').on('click', function() {
				var $this = $(this);
				selectedModel = $this.data('model'),
				selectedFamily = $this.data('family');

				templateDevice.find('.model-box').removeClass('selected');

				$this.addClass('selected');

				document.getElementById('getLinkfromBrand').href = 'http://www.' + selectedBrand + '.com';
				templateDevice.find('.actions .selection').text(monster.template(self, '!' + self.i18n.active().chooseModel.deviceSelected, { brand: selectedBrand, model: selectedModel }));
				templateDevice.find('.block-footer').slideDown(function() {
					$('html, body').animate({ scrollTop: templateDevice.find('div.block-device-info div.title-bar').offset().top }, function() {
						templateDevice.find('#name').focus();
					});
				});
			});

			templateDevice.find('.missing-brand').on('click', function() {
				popup.dialog('close').remove();
				callbackMissingBrand && callbackMissingBrand();
			});

			templateDevice.find('.action-device').on('click', function() {
				if(monster.ui.valid(templateDevice.find('#device_form'))) {
					var formData = monster.ui.getFormData('device_form'),
						dataDevice = {
							device_type: 'sip_device',
							enabled: true,
							mac_address: formData.mac_address,
							name: formData.name,
							provision: {
								endpoint_brand: selectedBrand,
								endpoint_family: selectedFamily,
								endpoint_model: selectedModel
							},
							sip: {
								password: monster.util.randomString(12),
								realm: monster.apps.auth.currentAccount.realm,
								username: 'user_' + monster.util.randomString(10)
							},
							suppress_unregister_notifications: false
						}

						if(typeof data == 'object')
							if(formData.mac_address == data.mac_address) {
								toastr.error(self.i18n.active().chooseModel.macaddress_havetochange, '', {"timeOut": 10000});
								return;
							}

						callbackAfterSave = function() {
							popup.dialog('close').remove();
						};
						popup.dialog('close').remove();
					callback && callback(dataDevice, callbackAfterSave);
				}
			});

			var popup = monster.ui.dialog(templateDevice, {
				position: ['center', 20],
				title: self.i18n.active().chooseModel.title
			});
		}
	};

	return app;
});
