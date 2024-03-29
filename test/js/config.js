define(function(require){

	return {
		api: {
			// The default API URL defines what API is used to log in to your back-end
			default: 'http://45.55.86.22:8000/v2/'

			// If you have provisioner turned on in your install and can use the one provided by 2600hz, add the URL in the 'provisioner' key below
			,provisioner: 'http://45.55.86.22/monster-ui/provisioner/'
			,provisioner_http: 'http://45.55.86.22/monster-ui/provisioner/'

			// If you want to use WebSockets you need to turn blackhole on in the back-end and then put the URL in the 'socket' key below
			,socket: 'https://mycircls.com:7777'

			// Set Project Phonebook URL if you want to use it to search phone numbers
			,phonebook: 'project_phonebook_url'

			// Set Mobile_app nvmo api url
			,mobile_nvmo: 'project_phonebook_url'

			// for trial api 
			,screwdriver: 'http://mycircls.com:8000/v2/'

		},

		// The resellerId key is the accountId of your master account, and is needed for some reseller features
		// For example it won't prompt for a credit card the subaccounts that have a different resellerId than this resellerId
//		resellerId: '',

		// If you are not using Braintree in your environment, you should add the following flag to disable the UI components that are using it:
		disableBraintree: false,

                // If you have a selfcert for HTTPS must be used, you need a own root certificate (root-cert.der in / www)!
                selfcerthttps: false,

		// kazoo clusterId
		kazooClusterId: 'f0d33c08759dd184d628d189478584a4',

		// Contains all the flags that are whitelabel-able via the Branding app.
		// Setting them in the config file will set the defaults if you don't use any whitelabel
		// If the domain used is defined in the whitelabel database, we'll override the following settings by what is set in the whitelabel document
		whitelabel: {
			// Logout Timer (minutes before showing the logged in user that it will auto-disconnect him soon)
			// Changing this value allows you to disable the auto-logout mechanism by setting it to 0. 
			// If you want to change the default duration (15), you can set this value with a number > 0
					logoutTimer: 7200,

			// By default the language is set by the browser, and once the user is log in it will take what's set in the account/user.
			// If you want to force the language of the UI before the user is logged in, you can set it here.
					language: 'en-US',

			// Application title, displayed in the browser tab
			applicationTitle: 'Circls',

			// Company Name, used in many places in the UI
			companyName: 'Circls UC',

                        // E-mail address used to report calls in SmartPBX's Call Logs. "Report Call" link won't be displayed if no address is specified.
                        // This address can either be set here in the config file, or through the Branding app.
                        callReportEmail: 'support@mycircls.com',

			nav: {
				// Link used when user click on the top-right interrogation mark
				help: 'http://support.mycircls.com',
				// Link used when clicking on logging out. By default the UI logs out the user after confirmation, but some people wanted to override that behavior

				//logout: 'http://www.google.com',
			}
		},
		advancedView: true,

                developerFlags: {
                        // Setting this flag to true will show the SmartPBX Callflows in the Callflows app
                        showSmartPBXCallflows: true,

                        // Settings this flag to true will show JS error when they happen, but in general we want to hide those so we comment it
                        showJSErrors: false
                }
	};
});
