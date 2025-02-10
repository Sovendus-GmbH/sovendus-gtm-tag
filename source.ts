// Initialize GoogleTagManager APIs
const window = require("callInWindow");
const setInWindow = require("setInWindow");
const injectScript = require("injectScript");
const encode = require("encodeUriComponent");
const makeString = require("makeString");
const log = require("logToConsole");
const queryPermission = require("queryPermission");
const createQueue = require("createQueue");

// Declare variables
const thankYouConfig = {
  settings: {},
  sessionId: undefined,
  timestamp: undefined,
  orderId: undefined,
  orderValue: undefined,
  orderCurrency: undefined,
  usedCouponCode: undefined,
  iframeContainerId: undefined,
  integrationType: undefined,
  consumerSalutation: undefined,
  consumerFirstName: undefined,
  consumerLastName: undefined,
  consumerEmail: undefined,
  consumerEmailHash: undefined,
  consumerYearOfBirth: undefined,
  consumerDateOfBirth: undefined,
  consumerStreet: undefined,
  consumerStreetNumber: undefined,
  consumerZipcode: undefined,
  consumerCity: undefined,
  consumerCountry: undefined,
  consumerLanguage: undefined,
  consumerPhone: undefined,
};

const sovThankyouStatus = {
  loadedOptimize: false,
  loadedVoucherNetwork: false,
  executedCheckoutProducts: false,
  sovThankyouConfigFound: false,
  countryCodePassedOnByPlugin: false,
};
const sovThankyouStatusAdder = createQueue("sovThankyouStatus");
sovThankyouStatusAdder(sovThankyouStatus);

if (data.voucherNetwork || data.optimize) {
  // order data
  thankYouConfig.orderId = makeString(data.orderId);
  thankYouConfig.orderValue = makeString(data.orderValue);
  thankYouConfig.orderCurrency = makeString(data.orderCurrency);
  thankYouConfig.usedCouponCode = makeString(data.usedCouponCode);
}
if (data.voucherNetwork || data.checkoutBenefits) {
  // customer data
  thankYouConfig.consumerSalutation = makeString(data.consumerSalutation);
  thankYouConfig.consumerFirstName = makeString(data.consumerFirstName);
  thankYouConfig.consumerLastName = makeString(data.consumerLastName);
  thankYouConfig.consumerEmail = makeString(data.consumerEmail);
  thankYouConfig.consumerEmailHash = makeString(data.consumerEmailHash);
  thankYouConfig.consumerPhone = makeString(data.consumerPhone);
  thankYouConfig.consumerYearOfBirth = makeString(data.consumerYearOfBirth);
  thankYouConfig.consumerDateOfBirth = makeString(data.consumerDateOfBirth);
  if (data.consumerFullStreet) {
    const [consumerStreet, consumerStreetNumber] = splitStreetAndNumber(
      makeString(data.consumerFullStreet)
    );
    thankYouConfig.consumerStreet = consumerStreet;
    thankYouConfig.consumerStreetNumber = consumerStreetNumber;
  } else {
    thankYouConfig.consumerStreet = makeString(data.consumerStreet);
    thankYouConfig.consumerStreetNumber = makeString(data.consumerStreetNumber);
  }
  thankYouConfig.consumerZipcode = makeString(data.consumerZipcode);
  thankYouConfig.consumerCity = makeString(data.consumerCity);
  thankYouConfig.consumerCountry = makeString(data.consumerCountry);
}

if (data.voucherNetwork || data.checkoutBenefits) {
  const trafficSourceNumberGTM = encode(makeString(data.trafficSourceNumber));
  const trafficMediumNumberGTM = encode(makeString(data.trafficMediumNumber));
  const iframeContainerIdGTM = makeString(data.iframeContainerId);
  const sovendusUrl =
    "https://api.sovendus.com/sovabo/common/js/flexibleIframe.js";
    
    const sovIframes = createQueue("sovIframes");
    
    //Allocate Main- & Orderdata
    sovIframes({
      trafficSourceNumber: trafficSourceNumberGTM,
      trafficMediumNumber: trafficMediumNumberGTM,
      orderId: thankYouConfig.orderId,
      orderValue: thankYouConfig.orderValue,
      orderCurrency: thankYouConfig.orderCurrency,
      usedCouponCode: thankYouConfig.usedCouponCode,
      iframeContainerId: iframeContainerIdGTM,
      integrationType: "gtm-thankyou-1.0.0",
    });
    
    //Allocate Consumer Data
    setInWindow("sovConsumer", {
      consumerSalutation: thankYouConfig.consumerSalutation,
      consumerFirstName: thankYouConfig.consumerFirstName,
      consumerLastName: thankYouConfig.consumerLastName,
      consumerEmail: thankYouConfig.consumerEmail,
      consumerEmailHash: thankYouConfig.consumerEmailHash,
      consumerStreet: thankYouConfig.consumerStreet,
      consumerStreetNumber: thankYouConfig.consumerStreetNumber,
      consumerCountry: thankYouConfig.consumerCountry,
      consumerZipcode: thankYouConfig.consumerZipcode,
      consumerCity: thankYouConfig.consumerCity,
      consumerPhone: thankYouConfig.consumerPhone,
      consumerYearOfBirth: thankYouConfig.consumerYearOfBirth,
    });
    //Inject flexibleIframe Script in page.
    injectScript(sovendusUrl, data.gtmOnSuccess, data.gtmOnFailure, sovendusUrl);
  }
  
  if (data.optimize && data.optimizeId) {
    const sovendusUrl =
      `https://www.sovopt.com/${data.optimizeId}/conversion/?ordervalue=${thankYouConfig.ordervalue}&ordernumber=${thankYouConfig.ordernumber}&vouchercode=${thankYouConfig.vouchercode}&email=${thankYouConfig.email}&subtext=XXX`
    injectScript(sovendusUrl, data.gtmOnSuccess, data.gtmOnFailure, "use-chache");
    
  }
  
  
  
  sovThankyouStatusAdder(sovThankyouStatus);
  