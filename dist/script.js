function getStreetAndNumber(makeString, streetWithNumber, streetName, streetNumber) {
  if (!streetWithNumber) {
    return {
      street: makeString(streetName) || "",
      number: makeString(streetNumber) || ""
    };
  }
  const streetInfo = splitStreetAndNumber(makeString(streetWithNumber));
  return {
    street: streetInfo.street,
    number: streetInfo.number
  };
}
function splitStreetAndNumber(street) {
  if (typeof street !== "string" || street.trim().length === 0) {
    return { street, number: "" };
  }
  const trimmedStreet = street.trim();
  const lastSpaceIndex = trimmedStreet.lastIndexOf(" ");
  if (lastSpaceIndex === -1) {
    return { street: trimmedStreet, number: "" };
  }
  const potentialNumber = trimmedStreet.slice(lastSpaceIndex + 1);
  if (isValidHouseNumber(potentialNumber)) {
    return {
      street: trimmedStreet.slice(0, lastSpaceIndex),
      number: potentialNumber
    };
  }
  return { street: trimmedStreet, number: "" };
}
function isValidHouseNumber(str) {
  if (str.length === 0) {
    return false;
  }
  const validCharacters = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-/.+#";
  for (let i = 0; i < str.length; i++) {
    const char = str[i];
    if (validCharacters.indexOf(char) === -1) {
      return false;
    }
  }
  return true;
}

const PLUGIN_VERSION = "gtm-new-1.0.0";
const setInWindow = require("setInWindow");
const injectScript = require("injectScript");
const log = require("logToConsole");
const queryPermission = require("queryPermission");
const createQueue = require("createQueue");
const getCookieValues = require("getCookieValues");
const _setCookie = require("setCookie");
const sendPixel = require("sendPixel");
const getUrl = require("getUrl");
const parseUrl = require("parseUrl");
const makeString = require("makeString");
const makeNumber = require("makeNumber");
const Undefined = null;
const sovendusDomains = {
  optimize: "https://www.sovopt.com/",
  sovendusApi: "https://api.sovendus.com/",
  checkoutProducts: "https://press-order-api.sovendus.com/ext/"
};
function main() {
  if (checkPermissions()) {
    if (data.pageType === "page") {
      landingPage();
    } else {
      thankYouPage();
    }
    log("Sovendus Tag - end");
    data.gtmOnSuccess();
  } else {
    log(
      "Sovendus Tag - No permission to get/set sovReqCookie or read url path"
    );
    data.gtmOnFailure();
  }
}
const cookieKeys = {
  sovCouponCode: "sovCouponCode",
  sovReqToken: "sovReqToken",
  sovReqProductId: "sovReqProductId"
};
function checkPermissions() {
  return queryPermission(
    "set_cookies",
    cookieKeys.sovReqToken,
    getCookieOptions("add")
  ) && queryPermission(
    "set_cookies",
    cookieKeys.sovCouponCode,
    getCookieOptions("add")
  ) && queryPermission(
    "set_cookies",
    cookieKeys.sovReqProductId,
    getCookieOptions("add")
  ) && queryPermission(
    "set_cookies",
    cookieKeys.sovReqToken,
    getCookieOptions("delete")
  ) && queryPermission(
    "set_cookies",
    cookieKeys.sovCouponCode,
    getCookieOptions("delete")
  ) && queryPermission(
    "set_cookies",
    cookieKeys.sovReqProductId,
    getCookieOptions("delete")
  ) && queryPermission("get_cookies", cookieKeys.sovReqToken) && queryPermission("get_cookies", cookieKeys.sovCouponCode) && queryPermission("get_cookies", cookieKeys.sovReqProductId) && queryPermission("get_url", "query", cookieKeys.sovReqToken) && queryPermission("get_url", "query", cookieKeys.sovCouponCode) && queryPermission("get_url", "query", cookieKeys.sovReqProductId) && queryPermission("inject_script", sovendusDomains.optimize) && queryPermission("inject_script", sovendusDomains.sovendusApi) && queryPermission("send_pixel", sovendusDomains.checkoutProducts);
}
function logger(pageType, message, messages) {
  log("Sovendus Tag [" + pageType + "] - " + message, messages || "");
}
function landingPage() {
  logger("Page", "starting...");
  const sovPageStatus = setLandingPageInitialStatus();
  const config = getLandingPageConfig(sovPageStatus);
  const urlSearchParams = getUrlObject();
  optimizePage(config, sovPageStatus);
  checkoutProductsPage(config, sovPageStatus, urlSearchParams);
  voucherNetworkPage(config, sovPageStatus, urlSearchParams);
  setInWindow("sovPageStatus", sovPageStatus);
  logger("Page", "done");
}
function getLandingPageConfig(sovPageStatus) {
  const sovPageConfig = {
    settings: {
      voucherNetwork: {
        cookieTracking: data.voucherNetworkPage || false
      },
      optimize: {
        useGlobalId: true,
        globalId: data.optimizeIdPage ? makeString(data.optimizeIdPage) : Undefined,
        globalEnabled: !!(data.optimizeIdPage && data.optimizeIdPage)
      },
      checkoutProducts: data.checkoutProductsPage || false,
      version: "2"
    },
    integrationType: PLUGIN_VERSION
  };
  setInWindow("sovPageConfig", sovPageConfig);
  sovPageStatus.sovPageConfigFound = true;
  return sovPageConfig;
}
function setLandingPageInitialStatus() {
  const sovPageStatus = {
    loadedOptimize: false,
    loadedVoucherNetworkSwitzerland: false,
    loadedVoucherNetworkVoucherCode: false,
    executedCheckoutProducts: false,
    missingSovReqTokenOrProductId: false,
    sovPageConfigFound: false
  };
  setInWindow("sovPageStatus", sovPageStatus);
  return sovPageStatus;
}
function optimizePage(config, sovPageStatus) {
  if (config.settings.optimize.globalId && config.settings.optimize.globalEnabled) {
    const sovendusUrl = sovendusDomains.optimize + config.settings.optimize.globalId;
    injectScript(
      sovendusUrl,
      () => {
      },
      data.gtmOnFailure,
      "use-cache"
    );
    logger("Page", "success optimizeId =", [config.settings.optimize.globalId]);
    sovPageStatus.loadedOptimize = true;
  }
}
function voucherNetworkPage(config, sovPageStatus, urlSearchParams) {
  if (config.settings.voucherNetwork.cookieTracking) {
    const sovCouponCode = urlSearchParams[cookieKeys.sovCouponCode];
    if (sovCouponCode) {
      setCookie(cookieKeys.sovCouponCode, "add", sovCouponCode);
      logger("Page", "success sovCouponCode =", [sovCouponCode]);
      sovPageStatus.loadedVoucherNetworkVoucherCode = true;
    }
    sovPageStatus.loadedVoucherNetworkSwitzerland = true;
    const sovLandingScript = sovendusDomains.sovendusApi + "js/landing.js";
    injectScript(
      sovLandingScript,
      () => {
      },
      () => {
      },
      "use-chache"
    );
  }
}
function checkoutProductsPage(config, sovPageStatus, urlSearchParams) {
  if (config.settings.checkoutProducts) {
    const sovReqToken = urlSearchParams[cookieKeys.sovReqToken];
    const sovReqProductId = urlSearchParams[cookieKeys.sovReqProductId];
    if (sovReqToken || sovReqProductId) {
      if (!sovReqToken || !sovReqProductId) {
        logger("Page", "sovReqToken or sovReqProductId is missing in url");
        sovPageStatus.missingSovReqTokenOrProductId = true;
      } else {
        setCookie(cookieKeys.sovReqToken, "add", sovReqToken);
        setCookie(cookieKeys.sovReqProductId, "add", sovReqProductId);
        logger(
          "Page",
          "success sovReqToken =" + sovReqToken + " - sovReqProductId =" + sovReqProductId
        );
        sovPageStatus.executedCheckoutProducts = true;
      }
    }
  }
}
function getUrlObject() {
  const urlObject = parseUrl(getUrl());
  return urlObject.searchParams;
}
function thankYouPage() {
  logger("Thankyou", "starting...");
  const thankYouConfig = getThankyouPageConfig();
  const sovThankyouStatus = setThankyouPageInitialStatus();
  voucherNetworkThankYouPage(thankYouConfig, sovThankyouStatus);
  optimizeThankYouPage(thankYouConfig, sovThankyouStatus);
  checkoutProductsThankYouPage(thankYouConfig, sovThankyouStatus);
  setInWindow("sovThankyouStatus", sovThankyouStatus);
  logger("Thankyou", "done");
}
function checkoutProductsThankYouPage(thankYouConfig, sovThankyouStatus) {
  if (thankYouConfig.settings.checkoutProducts) {
    const sovReqToken = getCookieValues("sovReqToken")[0];
    if (!sovReqToken) {
      return;
    }
    const sovReqProductId = getCookieValues("sovReqProductId")[0];
    if (!sovReqProductId) {
      logger("Thankyou", "sovReqProductId is missing in cookie");
      return;
    }
    const pixelUrl = sovendusDomains.checkoutProducts + sovReqProductId + "/image?sovReqToken=" + sovReqToken;
    setCookie("sovReqToken", "delete");
    setCookie("sovReqProductId", "delete");
    sendPixel(
      pixelUrl,
      () => {
      },
      () => {
      }
    );
    logger(
      "Thankyou",
      "success sovReqToken =" + sovReqToken + " - sovReqProductId =" + sovReqProductId
    );
    sovThankyouStatus.executedCheckoutProducts = true;
  }
}
function optimizeThankYouPage(thankYouConfig, sovThankyouStatus) {
  if (thankYouConfig.settings.optimize.globalEnabled) {
    const sovendusUrl = sovendusDomains.optimize + thankYouConfig.settings.optimize.globalId + "/conversion/?ordervalue=" + thankYouConfig.orderValue + "&ordernumber=" + thankYouConfig.orderId + "&vouchercode=" + thankYouConfig.usedCouponCode + "&email=" + thankYouConfig.consumerEmail + "&subtext=XXX";
    injectScript(
      sovendusUrl,
      () => {
      },
      () => {
      },
      "use-cache"
    );
    logger("Thankyou", "success optimizeId =", [
      thankYouConfig.settings.optimize.globalId
    ]);
    sovThankyouStatus.loadedOptimize = true;
  }
}
function getCookieOptions(setType) {
  return {
    "path": "/",
    "max-age": setType === "add" ? 60 * 60 * 24 * 31 : 0,
    "secure": true
  };
}
function setCookie(cookieName, setType, cookieValue) {
  _setCookie(cookieName, cookieValue, getCookieOptions(setType));
}
function voucherNetworkThankYouPage(thankYouConfig, sovThankyouStatus) {
  if (thankYouConfig.settings.voucherNetwork.anyCountryEnabled) {
    const sovendusUrl = sovendusDomains.sovendusApi + "sovabo/common/js/flexibleIframe.js";
    const sovIframes = createQueue("sovIframes");
    sovIframes({
      trafficSourceNumber: makeString(
        thankYouConfig.settings.voucherNetwork.simple.trafficSourceNumber
      ),
      trafficMediumNumber: makeString(
        thankYouConfig.settings.voucherNetwork.simple.trafficMediumNumber
      ),
      orderId: thankYouConfig.orderId,
      orderValue: thankYouConfig.orderValue,
      orderCurrency: thankYouConfig.orderCurrency,
      usedCouponCode: thankYouConfig.usedCouponCode,
      iframeContainerId: thankYouConfig.settings.voucherNetwork.iframeContainerId,
      integrationType: PLUGIN_VERSION
    });
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
      consumerYearOfBirth: thankYouConfig.consumerYearOfBirth
    });
    injectScript(
      sovendusUrl,
      () => {
      },
      () => {
      },
      "use-cache"
    );
    logger("Thankyou", "success voucher network");
    sovThankyouStatus.loadedVoucherNetwork = true;
  }
}
function getThankyouPageConfig() {
  const streetInfo = getStreetAndNumber(
    makeString,
    data.consumerFullStreet,
    data.consumerStreet,
    data.consumerStreetNumber
  );
  const sovThankyouConfig = {
    settings: {
      voucherNetwork: {
        anyCountryEnabled: !!(data.trafficSourceNumber && data.trafficMediumNumber),
        simple: {
          trafficSourceNumber: makeString(data.trafficSourceNumber),
          trafficMediumNumber: makeString(data.trafficMediumNumber)
        },
        iframeContainerId: makeString(data.iframeContainerId)
      },
      optimize: {
        useGlobalId: true,
        globalId: data.optimizeId ? makeString(data.optimizeId) : Undefined,
        globalEnabled: data.optimizeId ? true : false
      },
      checkoutProducts: data.checkoutProducts || false,
      version: "2"
    },
    orderId: makeString(data.orderId),
    orderValue: calculateOrderValue(
      data.netOrderValue,
      data.grossOrderValue,
      data.taxValue,
      data.shippingValue
    ),
    orderCurrency: data.orderCurrency ? makeString(data.orderCurrency) : Undefined,
    usedCouponCode: data.usedCouponCode ? makeString(data.usedCouponCode) : Undefined,
    iframeContainerId: makeString(data.iframeContainerId),
    integrationType: PLUGIN_VERSION,
    consumerSalutation: data.consumerSalutation ? makeString(data.consumerSalutation) : Undefined,
    consumerFirstName: data.consumerFirstName ? makeString(data.consumerFirstName) : Undefined,
    consumerLastName: data.consumerLastName ? makeString(data.consumerLastName) : Undefined,
    consumerEmail: data.consumerEmail ? makeString(data.consumerEmail) : Undefined,
    consumerEmailHash: data.consumerEmailHash ? makeString(data.consumerEmailHash) : Undefined,
    consumerYearOfBirth: data.consumerYearOfBirth ? makeString(data.consumerYearOfBirth) : Undefined,
    consumerDateOfBirth: data.consumerDateOfBirth ? makeString(data.consumerDateOfBirth) : Undefined,
    consumerStreet: streetInfo.street,
    consumerStreetNumber: streetInfo.number,
    consumerZipcode: data.consumerZipcode ? makeString(data.consumerZipcode) : Undefined,
    consumerCity: data.consumerCity ? makeString(data.consumerCity) : Undefined,
    consumerCountry: data.consumerCountry ? makeString(data.consumerCountry) : Undefined,
    consumerPhone: data.consumerPhone ? makeString(data.consumerPhone) : Undefined,
    usedCouponCodes: Undefined,
    sessionId: Undefined,
    timestamp: Undefined
  };
  setInWindow("sovThankyouConfig", sovThankyouConfig);
  return sovThankyouConfig;
}
function calculateOrderValue(netOrderValue, grossOrderValue, taxValue, shippingValue) {
  if (netOrderValue) {
    return makeString(netOrderValue);
  }
  if (typeof grossOrderValue === "undefined") {
    return Undefined;
  }
  let _grossOrderValue = makeNumber(makeString(grossOrderValue));
  let _taxValue = makeNumber(makeString(taxValue));
  let _shippingValue = makeNumber(makeString(shippingValue));
  _grossOrderValue = _grossOrderValue ? _grossOrderValue : 0;
  _taxValue = _taxValue ? _taxValue : 0;
  _shippingValue = _shippingValue ? _shippingValue : 0;
  return makeString(_grossOrderValue - _taxValue - _shippingValue);
}
function setThankyouPageInitialStatus() {
  const sovThankyouStatus = {
    loadedOptimize: false,
    loadedVoucherNetwork: false,
    executedCheckoutProducts: false,
    sovThankyouConfigFound: false,
    countryCodePassedOnByPlugin: false
  };
  setInWindow("sovThankyouStatus", sovThankyouStatus);
  return sovThankyouStatus;
}
main();
