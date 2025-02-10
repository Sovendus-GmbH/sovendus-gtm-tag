import type {
  ExplicitAnyType,
  InterfaceDataElementKeyType,
  SovendusPageConfig,
  SovendusThankYouPageConfig,
  SovPageStatus,
  Versions,
} from "sovendus-integration-types";

import type { CookieSetOptions, CookieStorageObject } from "./types";

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
  orderValue: ExplicitAnyType;
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
const callInWindow = require("callInWindow");
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
const encode = require("encodeUriComponent");
const makeString = require("makeString");
const log = require<(...messages: ExplicitAnyType[]) => void>("logToConsole");
const queryPermission = require<
  (permissionName: string, ...functionParams: ExplicitAnyType[]) => boolean
>("queryPermission");
const createQueue = require("createQueue");
const getCookieValues = require("getCookieValues");
const setCookie = require<
  (cookieKey: string, value: ExplicitAnyType, options: CookieSetOptions) => void
>("setCookie");
const sendPixel = require("sendPixel");
const getUrl = require<() => string>("getUrl");
const parseUrl = require<
  (url: string) => {
    searchParams: CookieStorageObject;
  }
>("parseUrl");

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
    log("No permission to get/set sovReqCookie or read url path");
    data.gtmOnFailure();
  }
}

const cookieKeys = {
  sovCouponCode: "sovCouponCode",
  sovReqToken: "sovReqToken",
  sovReqProductId: "sovReqProductId",
} satisfies {
  [key in InterfaceDataElementKeyType]?: InterfaceDataElementKeyType;
};

/**
 * Permission check
 * Make sure all permissions are checked
 */
function checkPermissions(): boolean {
  return (
    queryPermission("set_cookies", cookieKeys.sovReqToken, cookieAddOptions) &&
    queryPermission(
      "set_cookies",
      cookieKeys.sovCouponCode,
      cookieAddOptions,
    ) &&
    queryPermission(
      "set_cookies",
      cookieKeys.sovReqProductId,
      cookieAddOptions,
    ) &&
    queryPermission("get_url", "query", cookieKeys.sovReqToken) &&
    queryPermission("get_url", "query", cookieKeys.sovCouponCode) &&
    queryPermission("get_url", "query", cookieKeys.sovReqProductId)
  );
}

/**
 * landing page related functions
 *
 */

function landingPage(): void {
  log("Sovendus Tag [Page]  - start");

  const sovPageStatus = setLandingPageInitialStatus();
  const config = getLandingPageConfig(sovPageStatus);
  const urlSearchParams = getUrlObject();

  optimizePage(config, sovPageStatus);
  checkoutProductsPage(config, sovPageStatus, urlSearchParams);
  voucherNetworkPage(config, sovPageStatus, urlSearchParams);

  setInWindow("sovPageStatus", sovPageStatus);
  log("Sovendus Page Tag - end");
}

function getLandingPageConfig(
  sovPageStatus: SovPageStatus,
): SovendusPageConfig {
  const optimizeId = data.optimizeId;

  const sovPageConfig: SovendusPageConfig = {
    settings: {
      voucherNetwork: {
        simple: {
          trafficSourceNumber: data.trafficSourceNumber,
          trafficMediumNumber: data.trafficMediumNumber,
        },
        anyCountryEnabled: !!(
          data.trafficSourceNumber && data.trafficMediumNumber
        ),
        iframeContainerId: data.iframeContainerId,
      },
      optimize: {
        useGlobalId: true,
        globalId: optimizeId,
        globalEnabled: !!data.optimizeId,
      },
      checkoutProducts: data.checkoutProducts || false,
      version: "2" as Versions.TWO,
    },
    integrationType: "gtm-page-1.0.0",
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

const cookieAddOptions: CookieSetOptions = {
  "path": "/",
  "max-age": 60 * 60 * 24 * 31,
  "secure": true,
};

function optimizePage(
  config: SovendusPageConfig,
  sovPageStatus: SovPageStatus,
): void {
  if (
    config.settings.optimize.globalId &&
    config.settings.optimize.globalEnabled
  ) {
    const sovendusUrl =
      "https://www.sovopt.com/" + config.settings.optimize.globalId;
    injectScript(
      sovendusUrl,
      data.gtmOnSuccess,
      data.gtmOnFailure,
      "use-cache",
    );
    log(
      "Sovendus Tag [Page] - success optimizeId =",
      config.settings.optimize.globalId,
    );
    sovPageStatus.loadedOptimize = true;
  }
}

function voucherNetworkPage(
  config: SovendusPageConfig,
  sovPageStatus: SovPageStatus,
  urlSearchParams: CookieStorageObject,
): void {
  if (
    config.settings.voucherNetwork.trafficMediumNumber &&
    config.settings.voucherNetwork.trafficSourceNumber
  ) {
    const sovCouponCode = urlSearchParams[cookieKeys.sovCouponCode];
    if (sovCouponCode) {
      setCookie(cookieKeys.sovCouponCode, sovCouponCode, cookieAddOptions);
      log("Sovendus Page Tag - success sovCouponCode =", sovCouponCode);
      sovPageStatus.loadedVoucherNetworkVoucherCode = true;
    }
    sovPageStatus.loadedVoucherNetworkSwitzerland = true;
    const sovLandingScript = "https://api.sovendus.com/js/landing.js";
    injectScript(
      sovLandingScript,
      data.gtmOnSuccess,
      data.gtmOnFailure,
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
    const sovReqProductId = urlSearchParams[cookieKeys.sovReqProductId];
    if (sovReqToken || sovReqProductId) {
      if (!sovReqToken || !sovReqProductId) {
        log(
          "Sovendus Page Tag - sovReqToken or sovReqProductId is missing in url",
        );
        sovPageStatus.missingSovReqTokenOrProductId = true;
      } else {
        setCookie(cookieKeys.sovReqToken, sovReqToken, cookieAddOptions);
        setCookie(
          cookieKeys.sovReqProductId,
          sovReqProductId,
          cookieAddOptions,
        );
        log(
          "Sovendus Page Tag - success sovReqToken =",
          sovReqToken,
          "sovReqProductId =",
          sovReqProductId,
        );
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
  log("Sovendus Tag [Thankyou]  - start");

  const thankYouConfig = getThankyouPageConfig();
  setThankyouPageInitialStatus;

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
      const consumerStreetArray = splitStreetAndNumber(
        makeString(data.consumerFullStreet),
      );
      thankYouConfig.consumerStreet = consumerStreetArray[0];
      thankYouConfig.consumerStreetNumber = consumerStreetArray[1];
    } else {
      thankYouConfig.consumerStreet = makeString(data.consumerStreet);
      thankYouConfig.consumerStreetNumber = makeString(
        data.consumerStreetNumber,
      );
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
    injectScript(
      sovendusUrl,
      data.gtmOnSuccess,
      data.gtmOnFailure,
      "use-cache",
    );
  }

  if (data.optimize && data.optimizeId) {
    const sovendusUrl =
      "https://www.sovopt.com/${data.optimizeId}/conversion/?ordervalue=${thankYouConfig.ordervalue}&ordernumber=${thankYouConfig.ordernumber}&vouchercode=${thankYouConfig.vouchercode}&email=${thankYouConfig.email}&subtext=XXX";
    injectScript(
      sovendusUrl,
      data.gtmOnSuccess,
      data.gtmOnFailure,
      "use-cache",
    );

    sovThankyouStatus.loadedOptimize = true;
  }

  if (data.checkoutProducts) {
    setCookie("sovReqToken", "test", {
      "path": "/",
      "max-age": 60 * 60 * 24 * 31,
      "secure": true,
    });
    setCookie("sovReqProductId", "123", {
      "path": "/",
      "max-age": 60 * 60 * 24 * 31,
      "secure": true,
    });
    log("Test");

    const sovReqToken = getCookieValues("sovReqToken")[0];
    const sovReqProductId = getCookieValues("sovReqProductId")[0];
    const pixelUrl = `https://press-order-api.sovendus.com/ext/${
      sovReqProductId
    }/image?sovReqToken=${sovReqToken}`;

    // Remove Checkout Products Cookie
    // setCookie("sovReqToken", "", {
    //   path: "/",
    //   "max-age": 0,
    //   secure: true,
    // });
    // setCookie("sovReqProductId", "", {
    //   path: "/",
    //   "max-age": 0,
    //   secure: true,
    // });

    // Send Checkout Products pixel
    sendPixel(pixelUrl, data.gtmOnSuccess, data.gtmOnFailure);

    sovThankyouStatus.executedCheckoutProducts = true;
  }

  sovThankyouStatusAdder(sovThankyouStatus);
}

function getThankyouPageConfig(): SovendusThankYouPageConfig {
  const streetInfo = data.consumerFullStreet
    ? splitStreetAndNumber(data.consumerFullStreet)
    : undefined;
  const sovThankYouConfig: SovendusThankYouPageConfig = {
    settings: {
      voucherNetwork: {
        anyCountryEnabled: false,
      },
      optimize: {
        useGlobalId: false,
        globalId: null,
        globalEnabled: false,
      },
      checkoutProducts: false,
      version: "2" as Versions.TWO,
    },
    orderId: data.orderId,
    orderValue: data.orderValue,
    orderCurrency: data.orderCurrency,
    usedCouponCodes: undefined,
    usedCouponCode: data.usedCouponCode,
    iframeContainerId: data.iframeContainerId,
    integrationType: data.integrationType,
    consumerSalutation: data.consumerSalutation,
    consumerFirstName: data.consumerFirstName,
    consumerLastName: data.consumerLastName,
    consumerEmail: data.consumerEmail,
    consumerEmailHash: data.consumerEmailHash,
    consumerYearOfBirth: data.consumerYearOfBirth,
    consumerDateOfBirth: data.consumerDateOfBirth,
    consumerStreet: streetInfo?.street || data.consumerStreet,
    consumerStreetNumber: streetInfo?.number || data.consumerStreetNumber,
    consumerZipcode: data.consumerZipcode,
    consumerCity: data.consumerCity,
    consumerCountry: data.consumerCountry,
    consumerLanguage: data.consumerLanguage,
    consumerPhone: data.consumerPhone,
  };
  setInWindow("sovThankYouConfig", sovThankYouConfig);
  return sovThankYouConfig;
}

function setThankyouPageInitialStatus() {
  const sovThankyouStatus = {
    loadedOptimize: false,
    loadedVoucherNetwork: false,
    executedCheckoutProducts: false,
    sovThankyouConfigFound: false,
    countryCodePassedOnByPlugin: false,
  };
  setInWindow("sovThankyouStatus", sovThankyouStatus);
  return sovThankyouStatus;
}

function splitStreetAndNumber(street: string): {
  street: string;
  number: string;
} {
  // Check if the input is valid (must be a non-empty string)
  if (typeof street !== "string" || street.trim().length === 0) {
    return { street: street, number: "" };
  }

  // Trim leading and trailing spaces from the street string
  const trimmedStreet = street.trim();

  // Find the index of the last space in the string
  const lastSpaceIndex = trimmedStreet.lastIndexOf(" ");

  // If no space is found, there is no house number
  if (lastSpaceIndex === -1) {
    return { street: trimmedStreet, number: "" };
  }

  // Extract the potential house number (everything after the last space)
  const potentialNumber = trimmedStreet.slice(lastSpaceIndex + 1);

  // Check if the potential house number is valid
  if (isValidHouseNumber(potentialNumber)) {
    // If valid, return the street (everything before the last space) and the house number
    return {
      street: trimmedStreet.slice(0, lastSpaceIndex),
      number: potentialNumber,
    };
  }

  // If the house number is invalid, return the entire string as the street
  return { street: trimmedStreet, number: "" };
}

// Helper function to check if a string is a valid house number
function isValidHouseNumber(str: string): boolean {
  // If the string is empty, it's not a valid house number
  if (str.length === 0) {
    return false;
  }

  // Iterate through each character in the string
  for (let i = 0; i < str.length; i++) {
    const char = str[i]!;
    const charCode = char.charCodeAt(0);

    // Check if the character is a digit (0-9)
    if (charCode >= 48 && charCode <= 57) {
      continue; // Character is a digit, continue to the next character
    }

    // Check if the character is a letter (A-Z or a-z) and it's the last character
    if (
      i === str.length - 1 &&
      ((charCode >= 65 && charCode <= 90) || // A-Z
        (charCode >= 97 && charCode <= 122)) // a-z
    ) {
      continue; // Last character is a letter, continue
    }

    // If the character is neither a digit nor a letter at the end, it's invalid
    return false;
  }

  // If all characters are valid, return true
  return true;
}

main();
