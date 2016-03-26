define(function(require) {

	var $ = require("jquery"),
		_ = require("underscore"),
		monster = require("monster");

       var country = {

                list: [
                              { iso: "ad", flag: "flag ad", name: "Andorra" },
                              { iso: "ae", flag: "flag ae", name: "United Arab Emirates" },
                              { iso: "af", flag: "flag af", name: "Afghanistan" },
                              { iso: "ag", flag: "flag ag", name: "Antigua and Barbuda" },
                              { iso: "ai", flag: "flag ai", name: "Anguilla" },
                              { iso: "al", flag: "flag al", name: "Albania" },
                              { iso: "am", flag: "flag am", name: "Armenia" },
                              { iso: "an", flag: "flag an", name: "Netherlands Antilles" },
                              { iso: "ao", flag: "flag ao", name: "Angola" },
                              { iso: "aq", flag: "flag aq", name: "Antarctica" },
                              { iso: "ar", flag: "flag ar", name: "Argentina" },
                              { iso: "as", flag: "flag as", name: "American Samoa" },
                              { iso: "at", flag: "flag at", name: "Austria" },
                              { iso: "au", flag: "flag au", name: "Australia" },
                              { iso: "aw", flag: "flag aw", name: "Aruba" },
                              { iso: "ax", flag: "flag ax", name: "Aland Islands" },
                              { iso: "az", flag: "flag az", name: "Azerbaijan" },
                              { iso: "ba", flag: "flag ba", name: "Bosnia and Herzegovina" },
                              { iso: "bb", flag: "flag bb", name: "Barbados" },
                              { iso: "bd", flag: "flag bd", name: "Bangladesh" },
                              { iso: "be", flag: "flag be", name: "Belgium" },
                              { iso: "bf", flag: "flag bf", name: "Burkina Faso" },
                              { iso: "bg", flag: "flag bg", name: "Bulgaria" },
                              { iso: "bh", flag: "flag bh", name: "Bahrain" },
                              { iso: "bi", flag: "flag bi", name: "Burundi" },
                              { iso: "bj", flag: "flag bj", name: "Benin" },
                              { iso: "bm", flag: "flag bm", name: "Bermuda" },
                              { iso: "bn", flag: "flag bn", name: "Brunei Darussalam" },
                              { iso: "bo", flag: "flag bo", name: "Bolivia" },
                              { iso: "br", flag: "flag br", name: "Brazil" },
                              { iso: "bs", flag: "flag bs", name: "Bahamas" },
                              { iso: "bt", flag: "flag bt", name: "Bhutan" },
                              { iso: "bv", flag: "flag bv", name: "Bouvet Island" },
                              { iso: "bw", flag: "flag bw", name: "Botswana" },
                              { iso: "by", flag: "flag by", name: "Belarus" },
                              { iso: "bz", flag: "flag bz", name: "Belize" },
                              { iso: "ca", flag: "flag ca", name: "Canada" },
                              { iso: "cc", flag: "flag cc", name: "Cocos (Keeling) Islands" },
                              { iso: "cd", flag: "flag cd", name: "Democratic Republic of the Congo" },
                              { iso: "cf", flag: "flag cf", name: "Central African Republic" },
                              { iso: "cg", flag: "flag cg", name: "Congo" },
                              { iso: "ch", flag: "flag ch", name: "Switzerland" },
                              { iso: "ci", flag: "flag ci", name: "Cote D'Ivoire (Ivory Coast)" },
                              { iso: "ck", flag: "flag ck", name: "Cook Islands" },
                              { iso: "cl", flag: "flag cl", name: "Chile" },
                              { iso: "cm", flag: "flag cm", name: "Cameroon" },
                              { iso: "cn", flag: "flag cn", name: "China" },
                              { iso: "co", flag: "flag co", name: "Colombia" },
                              { iso: "cr", flag: "flag cr", name: "Costa Rica" },
                              { iso: "cs", flag: "flag cs", name: "Serbia and Montenegro" },
                              { iso: "cu", flag: "flag cu", name: "Cuba" },
                              { iso: "cv", flag: "flag cv", name: "Cape Verde" },
                              { iso: "cx", flag: "flag cx", name: "Christmas Island" },
                              { iso: "cy", flag: "flag cy", name: "Cyprus" },
                              { iso: "cz", flag: "flag cz", name: "Czech Republic" },
                              { iso: "de", flag: "flag de", name: "Germany" },
                              { iso: "dj", flag: "flag dj", name: "Djibouti" },
                              { iso: "dk", flag: "flag dk", name: "Denmark" },
                              { iso: "dm", flag: "flag dm", name: "Dominica" },
                              { iso: "do", flag: "flag do", name: "Dominican Republic" },
                              { iso: "dz", flag: "flag dz", name: "Algeria" },
                              { iso: "ec", flag: "flag ec", name: "Ecuador" },
                              { iso: "ee", flag: "flag ee", name: "Estonia" },
                              { iso: "eg", flag: "flag eg", name: "Egypt" },
                              { iso: "eh", flag: "flag eh", name: "Western Sahara" },
                              { iso: "er", flag: "flag er", name: "Eritrea" },
                              { iso: "es", flag: "flag es", name: "Spain" },
                              { iso: "et", flag: "flag et", name: "Ethiopia" },
                              { iso: "fi", flag: "flag fi", name: "Finland" },
                              { iso: "fj", flag: "flag fj", name: "Fiji" },
                              { iso: "fk", flag: "flag fk", name: "Falkland Islands (Malvinas)" },
                              { iso: "fm", flag: "flag fm", name: "Federated States of Micronesia" },
                              { iso: "fo", flag: "flag fo", name: "Faroe Islands" },
                              { iso: "fr", flag: "flag fr", name: "France" },
                              { iso: "fx", flag: "flag fx", name: "France, Metropolitan" },
                              { iso: "ga", flag: "flag ga", name: "Gabon" },
                              { iso: "gb", flag: "flag gb", name: "Great Britain (UK)" },
                              { iso: "gd", flag: "flag gd", name: "Grenada" },
                              { iso: "ge", flag: "flag ge", name: "Georgia" },
                              { iso: "gf", flag: "flag gf", name: "French Guiana" },
                              { iso: "gh", flag: "flag gh", name: "Ghana" },
                              { iso: "gi", flag: "flag gi", name: "Gibraltar" },
                              { iso: "gl", flag: "flag gl", name: "Greenland" },
                              { iso: "gm", flag: "flag gm", name: "Gambia" },
                              { iso: "gn", flag: "flag gn", name: "Guinea" },
                              { iso: "gp", flag: "flag gp", name: "Guadeloupe" },
                              { iso: "gq", flag: "flag gq", name: "Equatorial Guinea" },
                              { iso: "gr", flag: "flag gr", name: "Greece" },
                              { iso: "gs", flag: "flag gs", name: "S. Georgia and S. Sandwich Islands" },
                              { iso: "gt", flag: "flag gt", name: "Guatemala" },
                              { iso: "gu", flag: "flag gu", name: "Guam" },
                              { iso: "gw", flag: "flag gw", name: "Guinea-Bissau" },
                              { iso: "gy", flag: "flag gy", name: "Guyana" },
                              { iso: "hk", flag: "flag hk", name: "Hong Kong" },
                              { iso: "hm", flag: "flag hm", name: "Heard Island and McDonald Islands" },
                              { iso: "hn", flag: "flag hn", name: "Honduras" },
                              { iso: "hr", flag: "flag hr", name: "Croatia (Hrvatska)" },
                              { iso: "ht", flag: "flag ht", name: "Haiti" },
                              { iso: "hu", flag: "flag hu", name: "Hungary" },
                              { iso: "id", flag: "flag id", name: "Indonesia" },
                              { iso: "ie", flag: "flag ie", name: "Ireland" },
                              { iso: "il", flag: "flag il", name: "Israel" },
                              { iso: "in", flag: "flag in", name: "India" selected="selected" },
                              { iso: "io", flag: "flag io", name: "British Indian Ocean Territory" },
                              { iso: "iq", flag: "flag iq", name: "Iraq" },
                              { iso: "ir", flag: "flag ir", name: "Iran" },
                              { iso: "is", flag: "flag is", name: "Iceland" },
                              { iso: "it", flag: "flag it", name: "Italy" },
                              { iso: "jm", flag: "flag jm", name: "Jamaica" },
                              { iso: "jo", flag: "flag jo", name: "Jordan" },
                              { iso: "jp", flag: "flag jp", name: "Japan" },
                              { iso: "ke", flag: "flag ke", name: "Kenya" },
                              { iso: "kg", flag: "flag kg", name: "Kyrgyzstan" },
                              { iso: "kh", flag: "flag kh", name: "Cambodia" },
                              { iso: "ki", flag: "flag ki", name: "Kiribati" },
                              { iso: "km", flag: "flag km", name: "Comoros" },
                              { iso: "kn", flag: "flag kn", name: "Saint Kitts and Nevis" },
                              { iso: "kp", flag: "flag kp", name: "Korea (North)" },
                              { iso: "kr", flag: "flag kr", name: "Korea (South)" },
                              { iso: "kw", flag: "flag kw", name: "Kuwait" },
                              { iso: "ky", flag: "flag ky", name: "Cayman Islands" },
                              { iso: "kz", flag: "flag kz", name: "Kazakhstan" },
                              { iso: "la", flag: "flag la", name: "Laos" },
                              { iso: "lb", flag: "flag lb", name: "Lebanon" },
                              { iso: "lc", flag: "flag lc", name: "Saint Lucia" },
                              { iso: "li", flag: "flag li", name: "Liechtenstein" },
                              { iso: "lk", flag: "flag lk", name: "Sri Lanka" },
                              { iso: "lr", flag: "flag lr", name: "Liberia" },
                              { iso: "ls", flag: "flag ls", name: "Lesotho" },
                              { iso: "lt", flag: "flag lt", name: "Lithuania" },
                              { iso: "lu", flag: "flag lu", name: "Luxembourg" },
                              { iso: "lv", flag: "flag lv", name: "Latvia" },
                              { iso: "ly", flag: "flag ly", name: "Libya" },
                              { iso: "ma", flag: "flag ma", name: "Morocco" },
                              { iso: "mc", flag: "flag mc", name: "Monaco" },
                              { iso: "md", flag: "flag md", name: "Moldova" },
                              { iso: "mg", flag: "flag mg", name: "Madagascar" },
                              { iso: "mh", flag: "flag mh", name: "Marshall Islands" },
                              { iso: "mk", flag: "flag mk", name: "Macedonia" },
                              { iso: "ml", flag: "flag ml", name: "Mali" },
                              { iso: "mm", flag: "flag mm", name: "Myanmar" },
                              { iso: "mn", flag: "flag mn", name: "Mongolia" },
                              { iso: "mo", flag: "flag mo", name: "Macao" },
                              { iso: "mp", flag: "flag mp", name: "Northern Mariana Islands" },
                              { iso: "mq", flag: "flag mq", name: "Martinique" },
                              { iso: "mr", flag: "flag mr", name: "Mauritania" },
                              { iso: "ms", flag: "flag ms", name: "Montserrat" },
                              { iso: "mt", flag: "flag mt", name: "Malta" },
                              { iso: "mu", flag: "flag mu", name: "Mauritius" },
                              { iso: "mv", flag: "flag mv", name: "Maldives" },
                              { iso: "mw", flag: "flag mw", name: "Malawi" },
                              { iso: "mx", flag: "flag mx", name: "Mexico" },
                              { iso: "my", flag: "flag my", name: "Malaysia" },
                              { iso: "mz", flag: "flag mz", name: "Mozambique" },
                              { iso: "na", flag: "flag na", name: "Namibia" },
                              { iso: "nc", flag: "flag nc", name: "New Caledonia" },
                              { iso: "ne", flag: "flag ne", name: "Niger" },
                              { iso: "nf", flag: "flag nf", name: "Norfolk Island" },
                              { iso: "ng", flag: "flag ng", name: "Nigeria" },
                              { iso: "ni", flag: "flag ni", name: "Nicaragua" },
                              { iso: "nl", flag: "flag nl", name: "Netherlands" },
                              { iso: "no", flag: "flag no", name: "Norway" },
                              { iso: "np", flag: "flag np", name: "Nepal" },
                              { iso: "nr", flag: "flag nr", name: "Nauru" },
                              { iso: "nu", flag: "flag nu", name: "Niue" },
                              { iso: "nz", flag: "flag nz", name: "New Zealand (Aotearoa)" },
                              { iso: "om", flag: "flag om", name: "Oman" },
                              { iso: "pa", flag: "flag pa", name: "Panama" },
                              { iso: "pe", flag: "flag pe", name: "Peru" },
                              { iso: "pf", flag: "flag pf", name: "French Polynesia" },
                              { iso: "pg", flag: "flag pg", name: "Papua New Guinea" },
                              { iso: "ph", flag: "flag ph", name: "Philippines" },
                              { iso: "pk", flag: "flag pk", name: "Pakistan" },
                              { iso: "pl", flag: "flag pl", name: "Poland" },
                              { iso: "pm", flag: "flag pm", name: "Saint Pierre and Miquelon" },
                              { iso: "pn", flag: "flag pn", name: "Pitcairn" },
                              { iso: "pr", flag: "flag pr", name: "Puerto Rico" },
                              { iso: "ps", flag: "flag ps", name: "Palestinian Territory" },
                              { iso: "pt", flag: "flag pt", name: "Portugal" },
                              { iso: "pw", flag: "flag pw", name: "Palau" },
                              { iso: "py", flag: "flag py", name: "Paraguay" },
                              { iso: "qa", flag: "flag qa", name: "Qatar" },
                              { iso: "re", flag: "flag re", name: "Reunion" },
                              { iso: "ro", flag: "flag ro", name: "Romania" },
                              { iso: "ru", flag: "flag ru", name: "Russian Federation" },
                              { iso: "rw", flag: "flag rw", name: "Rwanda" },
                              { iso: "sa", flag: "flag sa", name: "Saudi Arabia" },
                              { iso: "sb", flag: "flag sb", name: "Solomon Islands" },
                              { iso: "sc", flag: "flag sc", name: "Seychelles" },
                              { iso: "sd", flag: "flag sd", name: "Sudan" },
                              { iso: "se", flag: "flag se", name: "Sweden" },
                              { iso: "sg", flag: "flag sg", name: "Singapore" },
                              { iso: "sh", flag: "flag sh", name: "Saint Helena" },
                              { iso: "si", flag: "flag si", name: "Slovenia" },
                              { iso: "sj", flag: "flag sj", name: "Svalbard and Jan Mayen" },
                              { iso: "sk", flag: "flag sk", name: "Slovakia" },
                              { iso: "sl", flag: "flag sl", name: "Sierra Leone" },
                              { iso: "sm", flag: "flag sm", name: "San Marino" },
                              { iso: "sn", flag: "flag sn", name: "Senegal" },
                              { iso: "so", flag: "flag so", name: "Somalia" },
                              { iso: "sr", flag: "flag sr", name: "Suriname" },
                              { iso: "st", flag: "flag st", name: "Sao Tome and Principe" },
                              { iso: "su", flag: "flag su", name: "USSR (former)" },
                              { iso: "sv", flag: "flag sv", name: "El Salvador" },
                              { iso: "sy", flag: "flag sy", name: "Syria" },
                              { iso: "sz", flag: "flag sz", name: "Swaziland" },
                              { iso: "tc", flag: "flag tc", name: "Turks and Caicos Islands" },
                              { iso: "td", flag: "flag td", name: "Chad" },
                              { iso: "tf", flag: "flag tf", name: "French Southern Territories" },
                              { iso: "tg", flag: "flag tg", name: "Togo" },
                              { iso: "th", flag: "flag th", name: "Thailand" },
                              { iso: "tj", flag: "flag tj", name: "Tajikistan" },
                              { iso: "tk", flag: "flag tk", name: "Tokelau" },
                              { iso: "tl", flag: "flag tl", name: "Timor-Leste" },
                              { iso: "tm", flag: "flag tm", name: "Turkmenistan" },
                              { iso: "tn", flag: "flag tn", name: "Tunisia" },
                              { iso: "to", flag: "flag to", name: "Tonga" },
                              { iso: "tp", flag: "flag tp", name: "East Timor" },
                              { iso: "tr", flag: "flag tr", name: "Turkey" },
                              { iso: "tt", flag: "flag tt", name: "Trinidad and Tobago" },
                              { iso: "tv", flag: "flag tv", name: "Tuvalu" },
                              { iso: "tw", flag: "flag tw", name: "Taiwan" },
                              { iso: "tz", flag: "flag tz", name: "Tanzania" },
                              { iso: "ua", flag: "flag ua", name: "Ukraine" },
                              { iso: "ug", flag: "flag ug", name: "Uganda" },
                              { iso: "uk", flag: "flag uk", name: "United Kingdom" },
                              { iso: "um", flag: "flag um", name: "United States Minor Outlying Islands" },
                              { iso: "us", flag: "flag us", name: "United States" },
                              { iso: "uy", flag: "flag uy", name: "Uruguay" },
                              { iso: "uz", flag: "flag uz", name: "Uzbekistan" },
                              { iso: "va", flag: "flag va", name: "Vatican City State (Holy See)" },
                              { iso: "vc", flag: "flag vc", name: "Saint Vincent and the Grenadines" },
                              { iso: "ve", flag: "flag ve", name: "Venezuela" },
                              { iso: "vg", flag: "flag vg", name: "Virgin Islands (British)" },
                              { iso: "vi", flag: "flag vi", name: "Virgin Islands (U.S.)" },
                              { iso: "vn", flag: "flag vn", name: "Viet Nam" },
                              { iso: "vu", flag: "flag vu", name: "Vanuatu" },
                              { iso: "wf", flag: "flag wf", name: "Wallis and Futuna" },
                              { iso: "ws", flag: "flag ws", name: "Samoa" },
                              { iso: "ye", flag: "flag ye", name: "Yemen" },
                              { iso: "yt", flag: "flag yt", name: "Mayotte" },
                              { iso: "yu", flag: "flag yu", name: "Yugoslavia (former)" },
                              { iso: "za", flag: "flag za", name: "South Africa" },
                              { iso: "zm", flag: "flag zm", name: "Zambia" },
                              { iso: "zr", flag: "flag zr", name: "Zaire (former)" },
                              { iso: "zw", flag: "flag zw", name: "Zimbabwe" }
                ],

                populateDropdown: function(dropdown, _selected) {
                        var self = this, selected = _selected;

                        $.each(self.list, function(i, data) {
                                if(selected == data.short) {
                                        dropdown.append('<option value="' + data.iso + '" SELECTED>' + data.name + '</option>');
                                }
                                else {
                                        dropdown.append('<option value="' + data.iso + '">' + data.name + '</option>');
                                }
                        });
                },

		getArrayCountry: function(iso) {
                       $.each(self.list, function(i, data) {
                                if(iso == data.iso) {
                                    return data;
                                }
                        });
		}

	};

	return countrys;

});