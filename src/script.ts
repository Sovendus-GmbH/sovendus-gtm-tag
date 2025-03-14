// only import types - no external code
import type {
  ExplicitAnyType,
  PublicThankYouCookieData,
  SovendusConsumerType,
  SovendusPageConfig,
  SovendusThankYouPageConfig,
  SovendusThankYouPageStatus,
  SovendusVNConversionsType,
  SovPageStatus,
  Versions,
} from "sovendus-integration-types";

import { getStreetAndNumber } from "./helper";
import type { CookieSetOptions, CookieStorageObject } from "./types";

const PLUGIN_VERSION = "gtm-new-1.0.0";

declare const data: {
  // IMPORTANT: Sync this with the tags input settings keys
  pageType: "page" | "thankyou";
  // page settings
  voucherNetworkPage: boolean | undefined;
  optimizePage: boolean | undefined;
  optimizeIdPage: ExplicitAnyType;
  checkoutProductsPage: boolean | undefined;
  // thankyou settings
  voucherNetwork: boolean | undefined;
  checkoutBenefits: boolean | undefined;
  checkoutProducts: boolean | undefined;
  optimize: boolean | undefined;
  optimizeId: ExplicitAnyType;
  trafficSourceNumber: ExplicitAnyType;
  trafficMediumNumber: ExplicitAnyType;
  orderId: ExplicitAnyType;
  netOrderValue: ExplicitAnyType;
  grossOrderValue: ExplicitAnyType;
  shippingValue: ExplicitAnyType;
  taxValue: ExplicitAnyType;
  orderCurrency: ExplicitAnyType;
  usedCouponCode: ExplicitAnyType;
  iframeContainerId: ExplicitAnyType;
  integrationType: ExplicitAnyType;
  consumerSalutation: ExplicitAnyType;
  consumerFirstName: ExplicitAnyType;
  consumerLastName: ExplicitAnyType;
  consumerEmail: ExplicitAnyType;
  consumerEmailHash: ExplicitAnyType;
  consumerYearOfBirth: ExplicitAnyType;
  consumerDateOfBirth: ExplicitAnyType;
  consumerStreet: ExplicitAnyType;
  consumerStreetNumber: ExplicitAnyType;
  consumerFullStreet: ExplicitAnyType;
  consumerZipcode: ExplicitAnyType;
  consumerCity: ExplicitAnyType;
  consumerCountry: ExplicitAnyType;
  consumerLanguage: ExplicitAnyType;
  consumerPhone: ExplicitAnyType;
  gtmOnSuccess: () => void;
  gtmOnFailure: () => void;
};

declare const require: <FNType>(name: string) => FNType;

// Initialize GoogleTagManager APIs
const setInWindow = require<
  (variableName: string, value: ExplicitAnyType) => void
>("setInWindow");
const injectScript = require<
  (
    scriptUrl: string,
    onSuccess: () => void,
    onFail: () => void,
    cacheVersionKey: string,
  ) => void
>("injectScript");
const log = require<(...messages: ExplicitAnyType[]) => void>("logToConsole");
const queryPermission = require<
  (permissionName: string, ...functionParams: ExplicitAnyType[]) => boolean
>("queryPermission");
const createQueue = require<
  (valueKey: string) => (value: ExplicitAnyType) => void
>("createQueue");
const getCookieValues = require<
  (cookieName: string) => [string]
>("getCookieValues");
const _setCookie = require<
  (cookieKey: string, value: ExplicitAnyType, options: CookieSetOptions) => void
>("setCookie");
const sendPixel = require<
  (pixelURL: string, onSuccess: () => void, onFail: () => void) => void
>("sendPixel");
const getUrl = require<() => string>("getUrl");
const parseUrl = require<
  (url: string) => {
    searchParams: CookieStorageObject;
  }
>("parseUrl");
const _makeString = require<(value: ExplicitAnyType) => string>("makeString");

function makeString(value: ExplicitAnyType): string | undefined {
  const stringValue = _makeString(value);
  return stringValue === "undefined" ? Undefined : stringValue;
}

const makeNumber = require<(value: ExplicitAnyType) => number>("makeNumber");
const Undefined = null as unknown as undefined;

const sovendusDomains = {
  optimize: "https://www.sovopt.com/",
  sovendusApi: "https://api.sovendus.com/",
  checkoutProducts: "https://press-order-api.sovendus.com/ext/",
};

/**
 * Main function
 */
function main(): void {
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
      "Sovendus Tag - No permission to get/set sovReqCookie or read url path",
    );
    data.gtmOnFailure();
  }
}

const cookieKeys = {
  sovCouponCode: "sovCouponCode",
  sovReqToken: "sovReqToken",
} satisfies {
  [key in keyof PublicThankYouCookieData]?: string;
};

/**
 * Permission check
 * Make sure all permissions are checked
 */
export function checkPermissions(): boolean {
  return (
    queryPermission(
      "set_cookies",
      cookieKeys.sovReqToken,
      getCookieOptions("add"),
    ) &&
    queryPermission(
      "set_cookies",
      cookieKeys.sovCouponCode,
      getCookieOptions("add"),
    ) &&
    queryPermission(
      "set_cookies",
      cookieKeys.sovReqToken,
      getCookieOptions("delete"),
    ) &&
    queryPermission(
      "set_cookies",
      cookieKeys.sovCouponCode,
      getCookieOptions("delete"),
    ) &&
    queryPermission("get_cookies", cookieKeys.sovReqToken) &&
    queryPermission("get_cookies", cookieKeys.sovCouponCode) &&
    queryPermission("get_url", "query", cookieKeys.sovReqToken) &&
    queryPermission("get_url", "query", cookieKeys.sovCouponCode) &&
    queryPermission("inject_script", sovendusDomains.optimize) &&
    queryPermission("inject_script", sovendusDomains.sovendusApi) &&
    queryPermission("send_pixel", sovendusDomains.checkoutProducts)
  );
}

function logger(
  pageType: "Page" | "Thankyou",
  message: string,
  messages?: ExplicitAnyType[],
): void {
  log("Sovendus Tag [" + pageType + "] - " + message, messages || "");
}

/**
 * landing page related functions
 *
 */

function landingPage(): void {
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

function getLandingPageConfig(
  sovPageStatus: SovPageStatus,
): SovendusPageConfig {
  const sovPageConfig: SovendusPageConfig = {
    settings: {
      voucherNetwork: {
        cookieTracking: data.voucherNetworkPage || false,
      },
      optimize: {
        useGlobalId: true,
        globalId: data.optimizeIdPage
          ? makeString(data.optimizeIdPage)
          : Undefined,
        globalEnabled: !!(data.optimizeIdPage && data.optimizeIdPage),
      },
      checkoutProducts: data.checkoutProductsPage || false,
      version: "2" as Versions.TWO,
    },
    integrationType: PLUGIN_VERSION,
  };
  setInWindow("sovPageConfig", sovPageConfig);
  sovPageStatus.sovPageConfigFound = true;
  return sovPageConfig;
}

function setLandingPageInitialStatus(): SovPageStatus {
  const sovPageStatus: SovPageStatus = {
    loadedOptimize: false,
    loadedVoucherNetworkSwitzerland: false,
    loadedVoucherNetworkVoucherCode: false,
    executedCheckoutProducts: false,
    missingSovReqTokenOrProductId: false,
    sovPageConfigFound: false,
  };
  setInWindow("sovPageStatus", sovPageStatus);
  return sovPageStatus;
}

function optimizePage(
  config: SovendusPageConfig,
  sovPageStatus: SovPageStatus,
): void {
  if (
    config.settings.optimize.globalId &&
    config.settings.optimize.globalEnabled
  ) {
    const sovendusUrl =
      sovendusDomains.optimize + config.settings.optimize.globalId;
    injectScript(
      sovendusUrl,
      () => {
        /* empty */
      },
      data.gtmOnFailure,
      "use-cache",
    );

    logger("Page", "success optimizeId =", [config.settings.optimize.globalId]);
    sovPageStatus.loadedOptimize = true;
  }
}

function voucherNetworkPage(
  config: SovendusPageConfig,
  sovPageStatus: SovPageStatus,
  urlSearchParams: CookieStorageObject,
): void {
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
        /* empty */
      },
      () => {
        /* empty */
      },
      "use-chache",
    );
  }
}

function checkoutProductsPage(
  config: SovendusPageConfig,
  sovPageStatus: SovPageStatus,
  urlSearchParams: CookieStorageObject,
): void {
  if (config.settings.checkoutProducts) {
    const sovReqToken = urlSearchParams[cookieKeys.sovReqToken];
    if (sovReqToken) {
      if (!sovReqToken) {
        logger("Page", "sovReqToken is missing in url");
        sovPageStatus.missingSovReqTokenOrProductId = true;
      } else {
        setCookie(cookieKeys.sovReqToken, "add", sovReqToken);
        logger("Page", "success sovReqToken =" + sovReqToken);
        sovPageStatus.executedCheckoutProducts = true;
      }
    }
  }
}

function getUrlObject(): CookieStorageObject {
  const urlObject = parseUrl(getUrl());
  return urlObject.searchParams;
}

/**
 * Thank you page related functions
 *
 */

function thankYouPage(): void {
  logger("Thankyou", "starting...");

  const thankYouConfig = getThankyouPageConfig();
  const sovThankyouStatus = setThankyouPageInitialStatus();

  voucherNetworkThankYouPage(thankYouConfig, sovThankyouStatus);
  optimizeThankYouPage(thankYouConfig, sovThankyouStatus);
  checkoutProductsThankYouPage(thankYouConfig, sovThankyouStatus);

  setInWindow("sovThankyouStatus", sovThankyouStatus);
  logger("Thankyou", "done");
}

function checkoutProductsThankYouPage(
  thankYouConfig: SovendusThankYouPageConfig,
  sovThankyouStatus: SovendusThankYouPageStatus,
): void {
  if (thankYouConfig.settings.checkoutProducts) {
    const sovReqToken = getCookieValues("sovReqToken")[0];
    if (!sovReqToken) {
      return;
    }
    const pixelUrl =
      sovendusDomains.checkoutProducts + "image?sovReqToken=" + sovReqToken;

    // Remove Checkout Products Cookie
    setCookie("sovReqToken", "delete");

    sendPixel(
      pixelUrl,
      () => {
        /* empty */
      },
      () => {
        /* empty */
      },
    );
    logger("Thankyou", "success sovReqToken =" + sovReqToken);
    sovThankyouStatus.executedCheckoutProducts = true;
  }
}

function optimizeThankYouPage(
  thankYouConfig: SovendusThankYouPageConfig,
  sovThankyouStatus: SovendusThankYouPageStatus,
): void {
  if (thankYouConfig.settings.optimize.globalEnabled) {
    const sovendusUrl =
      sovendusDomains.optimize +
      thankYouConfig.settings.optimize.globalId +
      "/conversion/?ordervalue=" +
      thankYouConfig.orderValue +
      "&ordernumber=" +
      thankYouConfig.orderId +
      "&vouchercode=" +
      thankYouConfig.usedCouponCode +
      "&email=" +
      thankYouConfig.consumerEmail +
      "&subtext=XXX";
    injectScript(
      sovendusUrl,
      () => {
        /* empty */
      },
      () => {
        /* empty */
      },
      "use-cache",
    );
    logger("Thankyou", "success optimizeId =", [
      thankYouConfig.settings.optimize.globalId,
    ]);
    sovThankyouStatus.loadedOptimize = true;
  }
}

function getCookieOptions(setType: "add" | "delete"): CookieSetOptions {
  return {
    "path": "/",
    "max-age": setType === "add" ? 60 * 60 * 24 * 31 : 0,
    "secure": true,
  };
}

function setCookie(
  cookieName: string,
  setType: "add" | "delete",
  cookieValue?: string,
): void {
  _setCookie(cookieName, cookieValue, getCookieOptions(setType));
}

function voucherNetworkThankYouPage(
  thankYouConfig: SovendusThankYouPageConfig,
  sovThankyouStatus: SovendusThankYouPageStatus,
): void {
  if (thankYouConfig.settings.voucherNetwork.anyCountryEnabled) {
    const sovendusUrl =
      sovendusDomains.sovendusApi + "sovabo/common/js/flexibleIframe.js";
    const sovIframes = createQueue("sovIframes");
    //Allocate Main- & Orderdata
    sovIframes({
      trafficSourceNumber: makeString(
        thankYouConfig.settings.voucherNetwork.simple!.trafficSourceNumber,
      ),
      trafficMediumNumber: makeString(
        thankYouConfig.settings.voucherNetwork.simple!.trafficMediumNumber,
      ),
      orderId: thankYouConfig.orderId,
      orderValue: thankYouConfig.orderValue,
      orderCurrency: thankYouConfig.orderCurrency,
      usedCouponCode: thankYouConfig.usedCouponCode,
      iframeContainerId:
        thankYouConfig.settings.voucherNetwork.iframeContainerId!,
      integrationType: PLUGIN_VERSION,
    } satisfies SovendusVNConversionsType);

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
    } satisfies SovendusConsumerType);

    injectScript(
      sovendusUrl,
      () => {
        /* empty */
      },
      () => {
        /* empty */
      },
      "use-cache",
    );
    logger("Thankyou", "success voucher network");
    sovThankyouStatus.loadedVoucherNetwork = true;
  }
}

function getThankyouPageConfig(): SovendusThankYouPageConfig {
  const streetInfo = getStreetAndNumber(
    makeString,
    data.consumerFullStreet,
    data.consumerStreet,
    data.consumerStreetNumber,
  );

  const usedCouponCookie = getCookieValues(cookieKeys.sovCouponCode)[0];

  const sovThankyouConfig: SovendusThankYouPageConfig = {
    settings: {
      voucherNetwork: {
        anyCountryEnabled: !!(
          data.trafficSourceNumber && data.trafficMediumNumber
        ),
        simple: {
          trafficSourceNumber: makeString(data.trafficSourceNumber),
          trafficMediumNumber: makeString(data.trafficMediumNumber),
        },
        iframeContainerId: makeString(data.iframeContainerId),
      },
      optimize: {
        useGlobalId: true,
        globalId: data.optimizeId ? makeString(data.optimizeId) : Undefined,
        globalEnabled: data.optimizeId ? true : false,
      },
      checkoutProducts: data.checkoutProducts || false,
      version: "2" as Versions.TWO,
    },
    orderId: makeString(data.orderId),
    orderValue: calculateOrderValue(
      data.netOrderValue,
      data.grossOrderValue,
      data.taxValue,
      data.shippingValue,
    ),
    orderCurrency: data.orderCurrency
      ? makeString(data.orderCurrency)
      : Undefined,
    usedCouponCode:
      makeString(usedCouponCookie) ||
      makeString(data.usedCouponCode) ||
      Undefined,
    iframeContainerId: makeString(data.iframeContainerId),
    integrationType: PLUGIN_VERSION,
    consumerSalutation: (data.consumerSalutation
      ? makeString(data.consumerSalutation)
      : Undefined) as "Mr." | "Mrs." | undefined,
    consumerFirstName: data.consumerFirstName
      ? makeString(data.consumerFirstName)
      : Undefined,
    consumerLastName: data.consumerLastName
      ? makeString(data.consumerLastName)
      : Undefined,
    consumerEmail: data.consumerEmail
      ? makeString(data.consumerEmail)
      : Undefined,
    consumerEmailHash: data.consumerEmailHash
      ? makeString(data.consumerEmailHash)
      : Undefined,
    consumerYearOfBirth: data.consumerYearOfBirth
      ? makeString(data.consumerYearOfBirth)
      : Undefined,
    consumerDateOfBirth: data.consumerDateOfBirth
      ? makeString(data.consumerDateOfBirth)
      : Undefined,
    consumerStreet: streetInfo.street,
    consumerStreetNumber: streetInfo.number,
    consumerZipcode: data.consumerZipcode
      ? makeString(data.consumerZipcode)
      : Undefined,
    consumerCity: data.consumerCity ? makeString(data.consumerCity) : Undefined,
    consumerCountry: data.consumerCountry
      ? makeString(data.consumerCountry)
      : Undefined,
    consumerPhone: data.consumerPhone
      ? makeString(data.consumerPhone)
      : Undefined,
    usedCouponCodes: Undefined,
    sessionId: Undefined,
    timestamp: Undefined,
  };
  setInWindow("sovThankyouConfig", sovThankyouConfig);
  return sovThankyouConfig;
}

function calculateOrderValue(
  netOrderValue: ExplicitAnyType,
  grossOrderValue: ExplicitAnyType,
  taxValue: ExplicitAnyType,
  shippingValue: ExplicitAnyType,
): string | undefined {
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

function setThankyouPageInitialStatus(): SovendusThankYouPageStatus {
  const sovThankyouStatus: SovendusThankYouPageStatus = {
    loadedOptimize: false,
    loadedVoucherNetwork: false,
    executedCheckoutProducts: false,
    sovThankyouConfigFound: false,
    countryCodePassedOnByPlugin: false,
  };
  setInWindow("sovThankyouStatus", sovThankyouStatus);
  return sovThankyouStatus;
}

main();
