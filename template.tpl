___TERMS_OF_SERVICE___

By creating or modifying this file you agree to Google Tag Manager's Community
Template Gallery Developer Terms of Service available at
https://developers.google.com/tag-manager/gallery-tos (or such other URL as
Google may provide), as modified from time to time.


___INFO___

{
  "type": "TAG",
  "id": "cvt_temp_public_id",
  "version": 1,
  "securityGroups": [],
  "categories": [
    "CONVERSIONS",
    "MARKETING",
    "AFFILIATE_MARKETING",
    "LEAD_GENERATION"
  ],
  "displayName": "Sovendus Thankyou / Journey Success Tag",
  "brand": {
    "id": "brand_dummy",
    "displayName": ""
  },
  "description": "Sovendus Thankyou / Journey Success Tag that supports the following Sovendus Products: Voucher Network, Checkout Benefits, Optimize and Checkout Products",
  "containerContexts": [
    "WEB"
  ]
}


___TEMPLATE_PARAMETERS___

[
  {
    "type": "CHECKBOX",
    "name": "voucherNetwork",
    "checkboxText": "Enable Voucher Network",
    "simpleValueType": true
  },
  {
    "type": "CHECKBOX",
    "name": "checkoutBenefits",
    "checkboxText": "Enable Checkout Benefits",
    "simpleValueType": true
  },
  {
    "type": "CHECKBOX",
    "name": "optimize",
    "checkboxText": "Enable Optimize",
    "simpleValueType": true
  },
  {
    "type": "CHECKBOX",
    "name": "checkoutProducts",
    "checkboxText": "Enable Checkout Products",
    "simpleValueType": true
  },
  {
    "type": "GROUP",
    "name": "integrationParameters",
    "displayName": "Integration Parameters",
    "groupStyle": "ZIPPY_OPEN",
    "subParams": [
      {
        "type": "TEXT",
        "name": "iframeContainerId",
        "displayName": "Integration div Container Id",
        "simpleValueType": true,
        "enablingConditions": [
          {
            "paramName": "voucherNetwork",
            "paramValue": true,
            "type": "EQUALS"
          },
          {
            "paramName": "checkoutBenefits",
            "paramValue": true,
            "type": "EQUALS"
          }
        ],
        "help": "Please check the docs for more information\u0027s on where and how to create the div container"
      },
      {
        "type": "TEXT",
        "name": "trafficSourceNumber",
        "displayName": "Traffic Source Number",
        "simpleValueType": true,
        "enablingConditions": [
          {
            "paramName": "voucherNetwork",
            "paramValue": true,
            "type": "EQUALS"
          },
          {
            "paramName": "checkoutBenefits",
            "paramValue": true,
            "type": "EQUALS"
          }
        ],
        "help": "If you haven\u0027t already, you will receive the traffic source number from your Sovendus account manager."
      },
      {
        "type": "TEXT",
        "name": "trafficMediumNumber",
        "displayName": "Traffic Medium Number",
        "simpleValueType": true,
        "enablingConditions": [
          {
            "paramName": "voucherNetwork",
            "paramValue": true,
            "type": "EQUALS"
          },
          {
            "paramName": "checkoutBenefits",
            "paramValue": true,
            "type": "EQUALS"
          }
        ],
        "help": "If you haven\u0027t already, you will receive the traffic medium number from your Sovendus account manager."
      },
      {
        "type": "TEXT",
        "name": "optimzeId",
        "displayName": "Optimze Id",
        "simpleValueType": true,
        "enablingConditions": [
          {
            "paramName": "optimize",
            "paramValue": true,
            "type": "EQUALS"
          }
        ],
        "help": "If you haven\u0027t already, you will receive the Optimize id from your Sovendus account manager."
      }
    ],
    "enablingConditions": [
      {
        "paramName": "voucherNetwork",
        "paramValue": true,
        "type": "EQUALS"
      },
      {
        "paramName": "checkoutBenefits",
        "paramValue": true,
        "type": "EQUALS"
      },
      {
        "paramName": "optimize",
        "paramValue": true,
        "type": "EQUALS"
      }
    ]
  },
  {
    "type": "GROUP",
    "name": "orderData",
    "displayName": "Order Data",
    "groupStyle": "ZIPPY_OPEN",
    "subParams": [
      {
        "type": "TEXT",
        "name": "usedCouponCode",
        "displayName": "Used Coupon/Voucher Code",
        "simpleValueType": true,
        "help": "The code of the redeemed voucher is used to track the success rate and enables automated invoicing. This field is mandatory to track which of our vouchers have been redeemed. While not mandatory for CPL billing, it greatly aids in optimizing the redemption rate."
      },
      {
        "type": "TEXT",
        "name": "orderId",
        "displayName": "Order Id",
        "simpleValueType": true,
        "help": "This field is mandatory and is a unique identifier for your orders and helps us recognize multiple requests to our server-system. This data is also needed for questions about billing."
      },
      {
        "type": "TEXT",
        "name": "orderCurrency",
        "displayName": "Order Currency",
        "simpleValueType": true,
        "help": "Order currency according to ISO 4217 (http://en.wikipedia.org/wiki/ISO_4217). This field is optional but becomes necessary when we are compensated based on a percentage of the purchase value"
      },
      {
        "type": "RADIO",
        "name": "orderValueType",
        "displayName": "Order Value Type",
        "radioItems": [
          {
            "value": "net",
            "displayValue": "Net order Value",
            "help": "The provided value is already witout tax and shipping"
          },
          {
            "value": "gross",
            "displayValue": "Gross Order Value",
            "help": "The provided value includes tax and shipping"
          }
        ],
        "simpleValueType": true
      },
      {
        "type": "TEXT",
        "name": "netOrderValue",
        "displayName": "Order Value Net",
        "simpleValueType": true,
        "help": "This field is optional but becomes necessary when we are compensated based on a percentage of the purchase value. Please transfer this value with two decimal places and a point as decimal separator (e.g. 8.50). This value is the net shopping cart value, i.e. the amount that the customer has paid (without VAT). See our docs for more information\u0027s on the calculation.",
        "enablingConditions": [
          {
            "paramName": "orderValueType",
            "paramValue": "net",
            "type": "EQUALS"
          }
        ]
      },
      {
        "type": "TEXT",
        "name": "grossOrderValue",
        "displayName": "Order Value Gross",
        "simpleValueType": true,
        "help": "",
        "enablingConditions": [
          {
            "paramName": "orderValueType",
            "paramValue": "gross",
            "type": "EQUALS"
          }
        ]
      },
      {
        "type": "TEXT",
        "name": "shippingValue",
        "displayName": "Order Shipping Cost",
        "simpleValueType": true,
        "enablingConditions": [
          {
            "paramName": "orderValueType",
            "paramValue": "gross",
            "type": "EQUALS"
          }
        ],
        "help": ""
      },
      {
        "type": "TEXT",
        "name": "taxValue",
        "displayName": "Order Tax Value",
        "simpleValueType": true,
        "enablingConditions": [
          {
            "paramName": "orderValueType",
            "paramValue": "gross",
            "type": "EQUALS"
          }
        ],
        "help": ""
      }
    ],
    "enablingConditions": [
      {
        "paramName": "voucherNetwork",
        "paramValue": true,
        "type": "EQUALS"
      },
      {
        "paramName": "optimize",
        "paramValue": true,
        "type": "EQUALS"
      }
    ]
  },
  {
    "type": "GROUP",
    "name": "consumerData",
    "displayName": "Customer Data",
    "groupStyle": "ZIPPY_OPEN",
    "subParams": [
      {
        "type": "TEXT",
        "name": "consumerSalutation",
        "displayName": "Customer Salutation",
        "simpleValueType": true,
        "help": "Example: \"Mr.\" / \"Mrs.\"\t- Used to display appropriate offers and prefill forms. Submit data for the invoice address."
      },
      {
        "type": "TEXT",
        "name": "consumerFirstName",
        "displayName": "Customer First Name",
        "simpleValueType": true,
        "help": "Example: \"John\" - Prefills forms such as newsletter sign-ups. Transmitted only when the customer submits the form. Submit data for the invoice address."
      },
      {
        "type": "TEXT",
        "name": "consumerLastName",
        "displayName": "Customer Last Name",
        "simpleValueType": true,
        "help": "Example: \"Doe\" - Prefills forms such as newsletter sign-ups. Transmitted only when the customer submits the form. Submit data for the invoice address."
      },
      {
        "type": "TEXT",
        "name": "consumerEmail",
        "displayName": "Customer Email",
        "simpleValueType": true,
        "help": "Usage: The email address is used to prefill input forms and should be transmitted as plain text. Sovendus will hash the email address to address any objections to advertising, allowing us to recognize returning users and provide them with diverse offers. Alternatively, you can transmit a md5 pre-hashed email in the consumerEmailHash field. Please note that pre-hashed emails must be activated by Sovendus before use."
      },
      {
        "type": "TEXT",
        "name": "consumerEmailHash",
        "displayName": "Consumer Email Hash",
        "simpleValueType": true,
        "help": "See docs for more details."
      },
      {
        "type": "TEXT",
        "name": "consumerPhone",
        "displayName": "Customer Phone Number",
        "simpleValueType": true,
        "enablingConditions": [
          {
            "paramName": "checkoutBenefits",
            "paramValue": true,
            "type": "EQUALS"
          }
        ],
        "help": "Utilized solely to prefill forms (e.g., newspaper sign-ups) and transmitted upon form submission."
      },
      {
        "type": "TEXT",
        "name": "consumerYearOfBirth",
        "displayName": "Customer Year of Birth",
        "simpleValueType": true,
        "enablingConditions": [
          {
            "paramName": "checkoutBenefits",
            "paramValue": true,
            "type": "EQUALS"
          }
        ],
        "help": "Used to display age-appropriate offers. Submit data for the invoice address."
      },
      {
        "type": "TEXT",
        "name": "consumerDateOfBirth",
        "displayName": "Customer Date of Birth",
        "simpleValueType": true,
        "enablingConditions": [
          {
            "paramName": "checkoutBenefits",
            "paramValue": true,
            "type": "EQUALS"
          }
        ],
        "help": "Prefills forms such as credit card applications, transmitted only upon form submission. Accepted formats: ISO YYYY-mm-dd, DEdd.mm.YYYY, GB dd/mm/YYYY. Submit data for the invoice address."
      },
      {
        "type": "TEXT",
        "name": "consumerStreet",
        "displayName": "Customer Street Name",
        "simpleValueType": true,
        "help": "Used exclusively to prefill forms (e.g., newspaper sign-ups), and transmitted only upon form submission. If unable to separate Street and Number, leave both fields empty and use the full street field below. Submit data for the invoice address.",
        "enablingConditions": [
          {
            "paramName": "checkoutBenefits",
            "paramValue": true,
            "type": "EQUALS"
          }
        ]
      },
      {
        "type": "TEXT",
        "name": "consumerStreetNumber",
        "displayName": "Customer Street Number",
        "simpleValueType": true,
        "help": "Used exclusively to prefill forms (e.g., newspaper sign-ups), and transmitted only upon form submission. If unable to separate Street and Number, leave both fields empty and use the full street field below. Submit data for the invoice address.",
        "enablingConditions": [
          {
            "paramName": "checkoutBenefits",
            "paramValue": true,
            "type": "EQUALS"
          }
        ]
      },
      {
        "type": "TEXT",
        "name": "consumerFullStreet",
        "displayName": "Customer Street Name and Number",
        "simpleValueType": true,
        "help": "Used exclusively to prefill forms (e.g., newspaper sign-ups), and transmitted only upon form submission. If unable to separate Street and Number, leave both fields empty and use this field instead. Submit data for the invoice address.",
        "enablingConditions": [
          {
            "paramName": "checkoutBenefits",
            "paramValue": true,
            "type": "EQUALS"
          }
        ]
      },
      {
        "type": "TEXT",
        "name": "consumerZipcode",
        "displayName": "Consumer Zip / Postal Code",
        "simpleValueType": true,
        "help": "Used to display localized advertisements and to prefill forms. Submit data for the invoice address."
      },
      {
        "type": "TEXT",
        "name": "consumerCity",
        "displayName": "Consumer City",
        "simpleValueType": true,
        "enablingConditions": [
          {
            "paramName": "checkoutBenefits",
            "paramValue": true,
            "type": "EQUALS"
          }
        ],
        "help": "Utilized solely to prefill forms (e.g., newspaper sign-ups) and transmitted upon form submission. Submit data for the invoice address."
      },
      {
        "type": "TEXT",
        "name": "consumerCountry",
        "displayName": "Customer Country",
        "simpleValueType": true,
        "help": "Used to display country-specific offers. Submit the country code according to ISO 3166-1 alpha-2 format."
      }
    ],
    "enablingConditions": [
      {
        "paramName": "voucherNetwork",
        "paramValue": true,
        "type": "EQUALS"
      },
      {
        "paramName": "checkoutBenefits",
        "paramValue": true,
        "type": "EQUALS"
      }
    ]
  }
]


___SANDBOXED_JS_FOR_WEB_TEMPLATE___

// Initialize GoogleTagManager APIs
const window = require('callInWindow');
const setInWindow = require('setInWindow');
const injectScript = require('injectScript');
const encode = require('encodeUriComponent');
const makeString = require('makeString');
const log = require('logToConsole');
const queryPermission = require('queryPermission');
const createQueue = require('createQueue');


// Declare variables

const trafficSourceNumberGTM = encode(makeString(data.trafficSourceNumber));
const trafficMediumNumberGTM = encode(makeString(data.trafficMediumNumber));
const sessionIdGTM = encode(makeString(data.sessionId));
const timestampGTM = encode(makeString(data.timestamp));
const orderIdGTM = encode(makeString(data.orderId));
const orderValueGTM = encode(makeString(data.orderValue));
const orderCurrencyGTM = encode(makeString(data.orderCurrency));
const usedCouponCodeGTM = encode(makeString(data.usedCouponCode));
const iframeContainerIdGTM = encode(makeString(data.iframeContainerId));

const consumerSalutationGTM = encode(makeString(data.consumerSalutation));
const consumerFirstNameGTM = encode(makeString(data.consumerFirstName));
const consumerLastNameGTM = encode(makeString(data.consumerLastName));
const consumerEmailGTM = encode(makeString(data.consumerEmail));
const consumerEmailHashGTM = encode(makeString(data.consumerEmailHash));
const consumerStreetGTM = encode(makeString(data.consumerStreet));
const consumerStreetNumberGTM = encode(makeString(data.consumerStreetNumber));
const consumerCountryGTM = encode(makeString(data.consumerCountry));
const consumerZipcodeGTM = encode(makeString(data.consumerZipcode));
const consumerCityGTM = encode(makeString(data.consumerCity));
const consumerPhoneGTM = encode(makeString(data.consumerPhone));
const consumerYearOfBirthGTM = encode(makeString(data.consumerYearOfBirth));

const sovendusUrl = 'https://api.sovendus.com/sovabo/common/js/flexibleIframe.js';

const sovIframes = createQueue('sovIframes');

//Allocate Main- & Orderdata
    sovIframes({
        trafficSourceNumber     : trafficSourceNumberGTM,
        trafficMediumNumber     : trafficMediumNumberGTM,
        sessionId               : sessionIdGTM,
        timestamp               : timestampGTM,
        orderId                 : orderIdGTM,
        orderValue              : orderValueGTM,
        orderCurrency           : orderCurrencyGTM,
        usedCouponCode          : usedCouponCodeGTM,
        iframeContainerId       : iframeContainerIdGTM,
        integrationType         : "gtm-1.0.5"
    });


//Allocate Consumer Data
    setInWindow('sovConsumer',{
        consumerSalutation      : consumerSalutationGTM,
        consumerFirstName       : consumerFirstNameGTM,
        consumerLastName        : consumerLastNameGTM,
        consumerEmail           : consumerEmailGTM,
        consumerEmailHash               : consumerEmailHashGTM,
        consumerStreet          : consumerStreetGTM,
        consumerStreetNumber    : consumerStreetNumberGTM,
        consumerCountry         : consumerCountryGTM,
        consumerZipcode         : consumerZipcodeGTM,
        consumerCity            : consumerCityGTM,
        consumerPhone           : consumerPhoneGTM,
        consumerYearOfBirth     : consumerYearOfBirthGTM
    });

//Inject flexibleIframe Script in page. 
injectScript(sovendusUrl, data.gtmOnSuccess, data.gtmOnFailure, sovendusUrl);


___WEB_PERMISSIONS___

[
  {
    "instance": {
      "key": {
        "publicId": "logging",
        "versionId": "1"
      },
      "param": [
        {
          "key": "environments",
          "value": {
            "type": 1,
            "string": "debug"
          }
        }
      ]
    },
    "isRequired": true
  },
  {
    "instance": {
      "key": {
        "publicId": "access_globals",
        "versionId": "1"
      },
      "param": [
        {
          "key": "keys",
          "value": {
            "type": 2,
            "listItem": [
              {
                "type": 3,
                "mapKey": [
                  {
                    "type": 1,
                    "string": "key"
                  },
                  {
                    "type": 1,
                    "string": "read"
                  },
                  {
                    "type": 1,
                    "string": "write"
                  },
                  {
                    "type": 1,
                    "string": "execute"
                  }
                ],
                "mapValue": [
                  {
                    "type": 1,
                    "string": "sovIframes"
                  },
                  {
                    "type": 8,
                    "boolean": true
                  },
                  {
                    "type": 8,
                    "boolean": true
                  },
                  {
                    "type": 8,
                    "boolean": true
                  }
                ]
              },
              {
                "type": 3,
                "mapKey": [
                  {
                    "type": 1,
                    "string": "key"
                  },
                  {
                    "type": 1,
                    "string": "read"
                  },
                  {
                    "type": 1,
                    "string": "write"
                  },
                  {
                    "type": 1,
                    "string": "execute"
                  }
                ],
                "mapValue": [
                  {
                    "type": 1,
                    "string": "sovIframes.trafficSourceNumber"
                  },
                  {
                    "type": 8,
                    "boolean": true
                  },
                  {
                    "type": 8,
                    "boolean": true
                  },
                  {
                    "type": 8,
                    "boolean": true
                  }
                ]
              },
              {
                "type": 3,
                "mapKey": [
                  {
                    "type": 1,
                    "string": "key"
                  },
                  {
                    "type": 1,
                    "string": "read"
                  },
                  {
                    "type": 1,
                    "string": "write"
                  },
                  {
                    "type": 1,
                    "string": "execute"
                  }
                ],
                "mapValue": [
                  {
                    "type": 1,
                    "string": "sovIframes.trafficMediumNumber"
                  },
                  {
                    "type": 8,
                    "boolean": true
                  },
                  {
                    "type": 8,
                    "boolean": true
                  },
                  {
                    "type": 8,
                    "boolean": true
                  }
                ]
              },
              {
                "type": 3,
                "mapKey": [
                  {
                    "type": 1,
                    "string": "key"
                  },
                  {
                    "type": 1,
                    "string": "read"
                  },
                  {
                    "type": 1,
                    "string": "write"
                  },
                  {
                    "type": 1,
                    "string": "execute"
                  }
                ],
                "mapValue": [
                  {
                    "type": 1,
                    "string": "sovIframes.sessionId"
                  },
                  {
                    "type": 8,
                    "boolean": true
                  },
                  {
                    "type": 8,
                    "boolean": true
                  },
                  {
                    "type": 8,
                    "boolean": true
                  }
                ]
              },
              {
                "type": 3,
                "mapKey": [
                  {
                    "type": 1,
                    "string": "key"
                  },
                  {
                    "type": 1,
                    "string": "read"
                  },
                  {
                    "type": 1,
                    "string": "write"
                  },
                  {
                    "type": 1,
                    "string": "execute"
                  }
                ],
                "mapValue": [
                  {
                    "type": 1,
                    "string": "sovIframes.timestamp"
                  },
                  {
                    "type": 8,
                    "boolean": true
                  },
                  {
                    "type": 8,
                    "boolean": true
                  },
                  {
                    "type": 8,
                    "boolean": true
                  }
                ]
              },
              {
                "type": 3,
                "mapKey": [
                  {
                    "type": 1,
                    "string": "key"
                  },
                  {
                    "type": 1,
                    "string": "read"
                  },
                  {
                    "type": 1,
                    "string": "write"
                  },
                  {
                    "type": 1,
                    "string": "execute"
                  }
                ],
                "mapValue": [
                  {
                    "type": 1,
                    "string": "sovIframes.orderId"
                  },
                  {
                    "type": 8,
                    "boolean": true
                  },
                  {
                    "type": 8,
                    "boolean": true
                  },
                  {
                    "type": 8,
                    "boolean": true
                  }
                ]
              },
              {
                "type": 3,
                "mapKey": [
                  {
                    "type": 1,
                    "string": "key"
                  },
                  {
                    "type": 1,
                    "string": "read"
                  },
                  {
                    "type": 1,
                    "string": "write"
                  },
                  {
                    "type": 1,
                    "string": "execute"
                  }
                ],
                "mapValue": [
                  {
                    "type": 1,
                    "string": "sovIframes.orderValue"
                  },
                  {
                    "type": 8,
                    "boolean": true
                  },
                  {
                    "type": 8,
                    "boolean": true
                  },
                  {
                    "type": 8,
                    "boolean": true
                  }
                ]
              },
              {
                "type": 3,
                "mapKey": [
                  {
                    "type": 1,
                    "string": "key"
                  },
                  {
                    "type": 1,
                    "string": "read"
                  },
                  {
                    "type": 1,
                    "string": "write"
                  },
                  {
                    "type": 1,
                    "string": "execute"
                  }
                ],
                "mapValue": [
                  {
                    "type": 1,
                    "string": "sovIframes.orderCurrency"
                  },
                  {
                    "type": 8,
                    "boolean": true
                  },
                  {
                    "type": 8,
                    "boolean": true
                  },
                  {
                    "type": 8,
                    "boolean": true
                  }
                ]
              },
              {
                "type": 3,
                "mapKey": [
                  {
                    "type": 1,
                    "string": "key"
                  },
                  {
                    "type": 1,
                    "string": "read"
                  },
                  {
                    "type": 1,
                    "string": "write"
                  },
                  {
                    "type": 1,
                    "string": "execute"
                  }
                ],
                "mapValue": [
                  {
                    "type": 1,
                    "string": "sovIframes.usedCouponCode"
                  },
                  {
                    "type": 8,
                    "boolean": true
                  },
                  {
                    "type": 8,
                    "boolean": true
                  },
                  {
                    "type": 8,
                    "boolean": true
                  }
                ]
              },
              {
                "type": 3,
                "mapKey": [
                  {
                    "type": 1,
                    "string": "key"
                  },
                  {
                    "type": 1,
                    "string": "read"
                  },
                  {
                    "type": 1,
                    "string": "write"
                  },
                  {
                    "type": 1,
                    "string": "execute"
                  }
                ],
                "mapValue": [
                  {
                    "type": 1,
                    "string": "sovIframes.iframeContainerId"
                  },
                  {
                    "type": 8,
                    "boolean": true
                  },
                  {
                    "type": 8,
                    "boolean": true
                  },
                  {
                    "type": 8,
                    "boolean": true
                  }
                ]
              },
              {
                "type": 3,
                "mapKey": [
                  {
                    "type": 1,
                    "string": "key"
                  },
                  {
                    "type": 1,
                    "string": "read"
                  },
                  {
                    "type": 1,
                    "string": "write"
                  },
                  {
                    "type": 1,
                    "string": "execute"
                  }
                ],
                "mapValue": [
                  {
                    "type": 1,
                    "string": "sovConsumer.consumerSalutation"
                  },
                  {
                    "type": 8,
                    "boolean": true
                  },
                  {
                    "type": 8,
                    "boolean": true
                  },
                  {
                    "type": 8,
                    "boolean": true
                  }
                ]
              },
              {
                "type": 3,
                "mapKey": [
                  {
                    "type": 1,
                    "string": "key"
                  },
                  {
                    "type": 1,
                    "string": "read"
                  },
                  {
                    "type": 1,
                    "string": "write"
                  },
                  {
                    "type": 1,
                    "string": "execute"
                  }
                ],
                "mapValue": [
                  {
                    "type": 1,
                    "string": "sovConsumer.consumerFirstName"
                  },
                  {
                    "type": 8,
                    "boolean": true
                  },
                  {
                    "type": 8,
                    "boolean": true
                  },
                  {
                    "type": 8,
                    "boolean": true
                  }
                ]
              },
              {
                "type": 3,
                "mapKey": [
                  {
                    "type": 1,
                    "string": "key"
                  },
                  {
                    "type": 1,
                    "string": "read"
                  },
                  {
                    "type": 1,
                    "string": "write"
                  },
                  {
                    "type": 1,
                    "string": "execute"
                  }
                ],
                "mapValue": [
                  {
                    "type": 1,
                    "string": "sovConsumer.consumerLastName"
                  },
                  {
                    "type": 8,
                    "boolean": true
                  },
                  {
                    "type": 8,
                    "boolean": true
                  },
                  {
                    "type": 8,
                    "boolean": true
                  }
                ]
              },
              {
                "type": 3,
                "mapKey": [
                  {
                    "type": 1,
                    "string": "key"
                  },
                  {
                    "type": 1,
                    "string": "read"
                  },
                  {
                    "type": 1,
                    "string": "write"
                  },
                  {
                    "type": 1,
                    "string": "execute"
                  }
                ],
                "mapValue": [
                  {
                    "type": 1,
                    "string": "sovConsumer.consumerEmail"
                  },
                  {
                    "type": 8,
                    "boolean": true
                  },
                  {
                    "type": 8,
                    "boolean": true
                  },
                  {
                    "type": 8,
                    "boolean": true
                  }
                ]
              },
              {
                "type": 3,
                "mapKey": [
                  {
                    "type": 1,
                    "string": "key"
                  },
                  {
                    "type": 1,
                    "string": "read"
                  },
                  {
                    "type": 1,
                    "string": "write"
                  },
                  {
                    "type": 1,
                    "string": "execute"
                  }
                ],
                "mapValue": [
                  {
                    "type": 1,
                    "string": "sovConsumer.consumerEmailHash"
                  },
                  {
                    "type": 8,
                    "boolean": true
                  },
                  {
                    "type": 8,
                    "boolean": true
                  },
                  {
                    "type": 8,
                    "boolean": true
                  }
                ]
              },
              {
                "type": 3,
                "mapKey": [
                  {
                    "type": 1,
                    "string": "key"
                  },
                  {
                    "type": 1,
                    "string": "read"
                  },
                  {
                    "type": 1,
                    "string": "write"
                  },
                  {
                    "type": 1,
                    "string": "execute"
                  }
                ],
                "mapValue": [
                  {
                    "type": 1,
                    "string": "sovConsumer.consumerStreet"
                  },
                  {
                    "type": 8,
                    "boolean": true
                  },
                  {
                    "type": 8,
                    "boolean": true
                  },
                  {
                    "type": 8,
                    "boolean": true
                  }
                ]
              },
              {
                "type": 3,
                "mapKey": [
                  {
                    "type": 1,
                    "string": "key"
                  },
                  {
                    "type": 1,
                    "string": "read"
                  },
                  {
                    "type": 1,
                    "string": "write"
                  },
                  {
                    "type": 1,
                    "string": "execute"
                  }
                ],
                "mapValue": [
                  {
                    "type": 1,
                    "string": "sovConsumer.consumerStreetNumber"
                  },
                  {
                    "type": 8,
                    "boolean": true
                  },
                  {
                    "type": 8,
                    "boolean": true
                  },
                  {
                    "type": 8,
                    "boolean": true
                  }
                ]
              },
              {
                "type": 3,
                "mapKey": [
                  {
                    "type": 1,
                    "string": "key"
                  },
                  {
                    "type": 1,
                    "string": "read"
                  },
                  {
                    "type": 1,
                    "string": "write"
                  },
                  {
                    "type": 1,
                    "string": "execute"
                  }
                ],
                "mapValue": [
                  {
                    "type": 1,
                    "string": "sovConsumer.consumerCountry"
                  },
                  {
                    "type": 8,
                    "boolean": true
                  },
                  {
                    "type": 8,
                    "boolean": true
                  },
                  {
                    "type": 8,
                    "boolean": true
                  }
                ]
              },
              {
                "type": 3,
                "mapKey": [
                  {
                    "type": 1,
                    "string": "key"
                  },
                  {
                    "type": 1,
                    "string": "read"
                  },
                  {
                    "type": 1,
                    "string": "write"
                  },
                  {
                    "type": 1,
                    "string": "execute"
                  }
                ],
                "mapValue": [
                  {
                    "type": 1,
                    "string": "sovConsumer.consumerZipcode"
                  },
                  {
                    "type": 8,
                    "boolean": true
                  },
                  {
                    "type": 8,
                    "boolean": true
                  },
                  {
                    "type": 8,
                    "boolean": true
                  }
                ]
              },
              {
                "type": 3,
                "mapKey": [
                  {
                    "type": 1,
                    "string": "key"
                  },
                  {
                    "type": 1,
                    "string": "read"
                  },
                  {
                    "type": 1,
                    "string": "write"
                  },
                  {
                    "type": 1,
                    "string": "execute"
                  }
                ],
                "mapValue": [
                  {
                    "type": 1,
                    "string": "sovConsumer.consumerCity"
                  },
                  {
                    "type": 8,
                    "boolean": true
                  },
                  {
                    "type": 8,
                    "boolean": true
                  },
                  {
                    "type": 8,
                    "boolean": true
                  }
                ]
              },
              {
                "type": 3,
                "mapKey": [
                  {
                    "type": 1,
                    "string": "key"
                  },
                  {
                    "type": 1,
                    "string": "read"
                  },
                  {
                    "type": 1,
                    "string": "write"
                  },
                  {
                    "type": 1,
                    "string": "execute"
                  }
                ],
                "mapValue": [
                  {
                    "type": 1,
                    "string": "sovConsumer.consumerPhone"
                  },
                  {
                    "type": 8,
                    "boolean": true
                  },
                  {
                    "type": 8,
                    "boolean": true
                  },
                  {
                    "type": 8,
                    "boolean": true
                  }
                ]
              },
              {
                "type": 3,
                "mapKey": [
                  {
                    "type": 1,
                    "string": "key"
                  },
                  {
                    "type": 1,
                    "string": "read"
                  },
                  {
                    "type": 1,
                    "string": "write"
                  },
                  {
                    "type": 1,
                    "string": "execute"
                  }
                ],
                "mapValue": [
                  {
                    "type": 1,
                    "string": "sovConsumer.consumerYearOfBirth"
                  },
                  {
                    "type": 8,
                    "boolean": true
                  },
                  {
                    "type": 8,
                    "boolean": true
                  },
                  {
                    "type": 8,
                    "boolean": true
                  }
                ]
              },
              {
                "type": 3,
                "mapKey": [
                  {
                    "type": 1,
                    "string": "key"
                  },
                  {
                    "type": 1,
                    "string": "read"
                  },
                  {
                    "type": 1,
                    "string": "write"
                  },
                  {
                    "type": 1,
                    "string": "execute"
                  }
                ],
                "mapValue": [
                  {
                    "type": 1,
                    "string": "sovConsumer"
                  },
                  {
                    "type": 8,
                    "boolean": true
                  },
                  {
                    "type": 8,
                    "boolean": true
                  },
                  {
                    "type": 8,
                    "boolean": true
                  }
                ]
              }
            ]
          }
        }
      ]
    },
    "clientAnnotations": {
      "isEditedByUser": true
    },
    "isRequired": true
  },
  {
    "instance": {
      "key": {
        "publicId": "inject_script",
        "versionId": "1"
      },
      "param": [
        {
          "key": "urls",
          "value": {
            "type": 2,
            "listItem": [
              {
                "type": 1,
                "string": "https://api.sovendus.com/*"
              }
            ]
          }
        }
      ]
    },
    "clientAnnotations": {
      "isEditedByUser": true
    },
    "isRequired": true
  }
]


___TESTS___

scenarios: []


___NOTES___

Created on 1.3.2021, 16:31:35


