// Initialize GoogleTagManager APIs
const callInWindow = require("callInWindow");
const setInWindow = require("setInWindow");
const injectScript = require("injectScript");
const encode = require("encodeUriComponent");
const makeString = require("makeString");
const log = require("logToConsole");
const queryPermission = require("queryPermission");
const createQueue = require("createQueue");
const getCookieValues = require("getCookieValues");
const setCookie = require("setCookie");
const sendPixel = require("sendPixel");
const getUrl = require("getUrl");
const parseUrl = require("parseUrl");
function main() {
    if (data.pageType === "page") {
        log("Sovendus Tag [Page]  - start");
        landingPage();
    }
    else {
        log("Sovendus Tag [Thankyou]  - start");
        thankYouPage();
    }
    log("Sovendus Tag - end");
    data.gtmOnSuccess();
}
/**
 * landing page related functions
 *
 */
function landingPage() {
    const sovPageStatus = setLandingPageInitialStatus();
    const config = getLandingPageConfig(sovPageStatus);
}
function getLandingPageConfig(sovPageStatus) {
    const optimizeId = data.optimizeId;
    const sovPageConfig = {
        settings: {
            voucherNetworkEnabled: data.voucherNetwork,
            optimize: {
                useGlobalId: true,
                globalId: optimizeId,
                globalEnabled: !!data.optimizeId,
            },
            checkoutProducts: data.checkoutProducts,
        },
        integrationType: "gtm-page-1.0.0",
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
        sovPageConfigFound: false,
    };
    setInWindow("sovPageStatus", sovPageStatus);
    return sovPageStatus;
}
const cookieKeys = {
    sovCouponCode: "sovCouponCode",
    sovReqToken: "sovReqToken",
    sovReqProductId: "sovReqProductId",
};
const cookieAddOptions = {
    "path": "/",
    "max-age": 60 * 60 * 24 * 31,
    "secure": true,
};
const urlObject = getUrlObject();
if (checkPermissions()) {
    log("Sovendus Page Tag - checked permissions");
    if (sovPageConfig.settings.checkoutProducts) {
        checkoutProducts();
    }
    if (sovPageConfig.settings.voucherNetworkEnabled) {
        voucherNetwork();
    }
}
else {
    log("No permission to get/set sovReqCookie or read url path");
}
function voucherNetwork() {
    const sovCouponCode = urlObject[sovCouponCodeCookieName];
    if (sovCouponCode) {
        setCookie(sovCouponCodeCookieName, sovCouponCode, cookieAddOptions);
        log("Sovendus Page Tag - success sovCouponCode =", sovCouponCode);
        sovPageStatus.loadedVoucherNetworkVoucherCode = true;
    }
    sovPageStatus.loadedVoucherNetworkSwitzerland = true;
    const sovLandingScript = "https://api.sovendus.com/js/landing.js";
    injectScript(sovLandingScript, data.gtmOnSuccess, data.gtmOnFailure, "use-chache");
}
function checkoutProducts() {
    const sovReqToken = urlObject[sovReqTokenCookieName];
    const sovReqProductId = urlObject[sovReqProductIdCookieName];
    if (sovReqToken || sovReqProductId) {
        if (!sovReqToken || !sovReqProductId) {
            log("Sovendus Page Tag - sovReqToken or sovReqProductId is missing in url");
            sovPageStatus.missingSovReqTokenOrProductId = true;
        }
        else {
            setCookie(sovReqTokenCookieName, sovReqToken, cookieAddOptions);
            setCookie(sovReqProductIdCookieName, sovReqProductId, cookieAddOptions);
            log("Sovendus Page Tag - success sovReqToken =", sovReqToken, "sovReqProductId =", sovReqProductId);
            sovPageStatus.executedCheckoutProducts = true;
        }
    }
}
function getUrlObject() {
    const urlObject = parseUrl(getUrl());
    return urlObject.searchParams;
}
function checkPermissions() {
    return (queryPermission("set_cookies", sovReqTokenCookieName, cookieAddOptions) &&
        queryPermission("set_cookies", sovCouponCodeCookieName, cookieAddOptions) &&
        queryPermission("set_cookies", sovReqProductIdCookieName, cookieAddOptions) &&
        queryPermission("get_url", "query", sovReqTokenCookieName) &&
        queryPermission("get_url", "query", sovCouponCodeCookieName) &&
        queryPermission("get_url", "query", sovReqProductIdCookieName));
}
setInWindow("sovPageStatus", sovPageStatus);
log("Sovendus Page Tag - end");
data.gtmOnSuccess();
/**
 * Thank you page related functions
 *
 */
function thankYouPage() {
    const config = getThankyouPageConfig();
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
            const consumerStreetArray = splitStreetAndNumber(makeString(data.consumerFullStreet));
            thankYouConfig.consumerStreet = consumerStreetArray[0];
            thankYouConfig.consumerStreetNumber = consumerStreetArray[1];
        }
        else {
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
        const sovendusUrl = "https://api.sovendus.com/sovabo/common/js/flexibleIframe.js";
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
        injectScript(sovendusUrl, data.gtmOnSuccess, data.gtmOnFailure, "use-cache");
    }
    if (data.optimize && data.optimizeId) {
        const sovendusUrl = "https://www.sovopt.com/${data.optimizeId}/conversion/?ordervalue=${thankYouConfig.ordervalue}&ordernumber=${thankYouConfig.ordernumber}&vouchercode=${thankYouConfig.vouchercode}&email=${thankYouConfig.email}&subtext=XXX";
        injectScript(sovendusUrl, data.gtmOnSuccess, data.gtmOnFailure, "use-cache");
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
        const pixelUrl = "https://press-order-api.sovendus.com/ext/" +
            sovReqProductId +
            "/image?sovReqToken=" +
            sovReqToken;
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
function getThankyouPageConfig() {
    const sovThankYouConfig = {
        settings: {},
        orderId: data.orderId,
        orderValue: data.orderValue,
        orderCurrency: data.orderCurrency,
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
        consumerStreet: data.consumerStreet,
        consumerStreetNumber: data.consumerStreetNumber,
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
function splitStreetAndNumber(street) {
    // Check if the input is valid (must be a non-empty string)
    if (typeof street !== "string" || street.trim().length === 0) {
        return [street, ""];
    }
    // Trim leading and trailing spaces from the street string
    var trimmedStreet = street.trim();
    // Find the index of the last space in the string
    var lastSpaceIndex = trimmedStreet.lastIndexOf(" ");
    // If no space is found, there is no house number
    if (lastSpaceIndex === -1) {
        return [trimmedStreet, ""];
    }
    // Extract the potential house number (everything after the last space)
    var potentialNumber = trimmedStreet.slice(lastSpaceIndex + 1);
    // Check if the potential house number is valid
    if (isValidHouseNumber(potentialNumber)) {
        // If valid, return the street (everything before the last space) and the house number
        return [trimmedStreet.slice(0, lastSpaceIndex), potentialNumber];
    }
    // If the house number is invalid, return the entire string as the street
    return [trimmedStreet, ""];
}
// Helper function to check if a string is a valid house number
function isValidHouseNumber(str) {
    // If the string is empty, it's not a valid house number
    if (str.length === 0)
        return false;
    // Iterate through each character in the string
    for (var i = 0; i < str.length; i++) {
        var char = str[i];
        var charCode = char.charCodeAt(0);
        // Check if the character is a digit (0-9)
        if (charCode >= 48 && charCode <= 57) {
            continue; // Character is a digit, continue to the next character
        }
        // Check if the character is a letter (A-Z or a-z) and it's the last character
        if (i === str.length - 1 &&
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
export {};
