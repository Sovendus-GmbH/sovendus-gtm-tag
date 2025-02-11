const PLUGIN_VERSION = "gtm-new-1.0.0";
// Initialize GoogleTagManager APIs
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
/**
 * Main function
 */
function main() {
    if (checkPermissions()) {
        if (data.pageType === "page") {
            landingPage();
        }
        else {
            thankYouPage();
        }
        log("Sovendus Tag - end");
        data.gtmOnSuccess();
    }
    else {
        log("Sovendus Tag - No permission to get/set sovReqCookie or read url path");
        data.gtmOnFailure();
    }
}
const cookieKeys = {
    sovCouponCode: "sovCouponCode",
    sovReqToken: "sovReqToken",
    sovReqProductId: "sovReqProductId",
};
/**
 * Permission check
 * Make sure all permissions are checked
 */
function checkPermissions() {
    return (queryPermission("set_cookies", cookieKeys.sovReqToken, getCookieOptions("add")) &&
        queryPermission("set_cookies", cookieKeys.sovCouponCode, getCookieOptions("add")) &&
        queryPermission("set_cookies", cookieKeys.sovReqProductId, getCookieOptions("add")) &&
        queryPermission("set_cookies", cookieKeys.sovReqToken, getCookieOptions("delete")) &&
        queryPermission("set_cookies", cookieKeys.sovCouponCode, getCookieOptions("delete")) &&
        queryPermission("set_cookies", cookieKeys.sovReqProductId, getCookieOptions("delete")) &&
        queryPermission("get_cookies", cookieKeys.sovReqToken) &&
        queryPermission("get_cookies", cookieKeys.sovCouponCode) &&
        queryPermission("get_cookies", cookieKeys.sovReqProductId) &&
        queryPermission("get_url", "query", cookieKeys.sovReqToken) &&
        queryPermission("get_url", "query", cookieKeys.sovCouponCode) &&
        queryPermission("get_url", "query", cookieKeys.sovReqProductId));
}
function logger(pageType, message, messages) {
    log("Sovendus Tag [" + pageType + "] - " + message, messages || "");
}
/**
 * landing page related functions
 *
 */
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
                cookieTracking: data.voucherNetworkPage || false,
            },
            optimize: {
                useGlobalId: true,
                globalId: data.optimizeIdPage
                    ? makeString(data.optimizeIdPage)
                    : undefined,
                globalEnabled: !!(data.optimizeIdPage && data.optimizeIdPage),
            },
            checkoutProducts: data.checkoutProductsPage || false,
            version: "2",
        },
        integrationType: PLUGIN_VERSION,
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
function optimizePage(config, sovPageStatus) {
    if (config.settings.optimize.globalId &&
        config.settings.optimize.globalEnabled) {
        const sovendusUrl = "https://www.sovopt.com/" + config.settings.optimize.globalId;
        injectScript(sovendusUrl, () => {
            /* empty */
        }, data.gtmOnFailure, "use-cache");
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
        const sovLandingScript = "https://api.sovendus.com/js/landing.js";
        injectScript(sovLandingScript, () => {
            /* empty */
        }, data.gtmOnFailure, "use-chache");
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
            }
            else {
                setCookie(cookieKeys.sovReqToken, "add", sovReqToken);
                setCookie(cookieKeys.sovReqProductId, "add", sovReqProductId);
                logger("Page", "success sovReqToken =" +
                    sovReqToken +
                    " - sovReqProductId =" +
                    sovReqProductId);
                sovPageStatus.executedCheckoutProducts = true;
            }
        }
    }
}
function getUrlObject() {
    const urlObject = parseUrl(getUrl());
    return urlObject.searchParams;
}
/**
 * Thank you page related functions
 *
 */
function thankYouPage() {
    logger("Thankyou", "starting...");
    const thankYouConfig = getThankyouPageConfig();
    const sovThankyouStatus = setThankyouPageInitialStatus();
    voucherNetworkThankYouPage(thankYouConfig, sovThankyouStatus);
    if (thankYouConfig.settings.optimize.globalEnabled) {
        const sovendusUrl = "https://www.sovopt.com/" +
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
        injectScript(sovendusUrl, () => {
            /* empty */
        }, data.gtmOnFailure, "use-cache");
        logger("Thankyou", "success optimizeId =", [
            thankYouConfig.settings.optimize.globalId,
        ]);
        sovThankyouStatus.loadedOptimize = true;
    }
    if (thankYouConfig.settings.checkoutProducts) {
        setCookie("sovReqToken", "add", "test");
        setCookie("sovReqProductId", "add", "123");
        const sovReqToken = getCookieValues("sovReqToken")[0];
        const sovReqProductId = getCookieValues("sovReqProductId")[0];
        const pixelUrl = "https://press-order-api.sovendus.com/ext/" +
            sovReqProductId +
            "/image?sovReqToken=" +
            sovReqToken;
        // Remove Checkout Products Cookie
        // setSetCookie("sovReqToken", "delete");
        // setSetCookie("sovReqProductId", "delete");
        // Send Checkout Products pixel
        sendPixel(pixelUrl, () => {
            /* empty */
        }, data.gtmOnFailure);
        logger("Thankyou", "success sovReqToken =" +
            sovReqToken +
            " - sovReqProductId =" +
            sovReqProductId);
        sovThankyouStatus.executedCheckoutProducts = true;
    }
    setInWindow("sovThankyouStatus", sovThankyouStatus);
    logger("Thankyou", "done");
}
function getCookieOptions(setType) {
    return {
        "path": "/",
        "max-age": setType === "add" ? 60 * 60 * 24 * 31 : 0,
        "secure": true,
    };
}
function setCookie(cookieName, setType, cookieValue) {
    _setCookie(cookieName, cookieValue, getCookieOptions(setType));
}
function voucherNetworkThankYouPage(thankYouConfig, sovThankyouStatus) {
    if (thankYouConfig.settings.voucherNetwork.anyCountryEnabled) {
        const sovendusUrl = "https://api.sovendus.com/sovabo/common/js/flexibleIframe.js";
        const sovIframes = createQueue("sovIframes");
        //Allocate Main- & Orderdata
        sovIframes({
            trafficSourceNumber: makeString(thankYouConfig.settings.voucherNetwork.simple.trafficSourceNumber),
            trafficMediumNumber: makeString(thankYouConfig.settings.voucherNetwork.simple.trafficMediumNumber),
            orderId: thankYouConfig.orderId,
            orderValue: thankYouConfig.orderValue,
            orderCurrency: thankYouConfig.orderCurrency,
            usedCouponCode: thankYouConfig.usedCouponCode,
            iframeContainerId: thankYouConfig.settings.voucherNetwork.iframeContainerId,
            integrationType: PLUGIN_VERSION,
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
        injectScript(sovendusUrl, () => {
            /* empty */
        }, data.gtmOnFailure, "use-cache");
        logger("Thankyou", "success voucher network");
        sovThankyouStatus.loadedVoucherNetwork = true;
    }
}
function getThankyouPageConfig() {
    const streetInfo = getStreetAndNumber(data.consumerFullStreet, data.consumerStreet, data.consumerStreetNumber);
    const sovThankyouConfig = {
        settings: {
            voucherNetwork: {
                anyCountryEnabled: !!(data.trafficSourceNumber && data.trafficMediumNumber),
                simple: {
                    trafficSourceNumber: makeString(data.trafficSourceNumber),
                    trafficMediumNumber: makeString(data.trafficMediumNumber),
                },
                iframeContainerId: makeString(data.iframeContainerId),
            },
            optimize: {
                useGlobalId: true,
                globalId: data.optimizeId ? makeString(data.optimizeId) : undefined,
                globalEnabled: data.optimizeId ? true : false,
            },
            checkoutProducts: data.checkoutProducts || false,
            version: "2",
        },
        orderId: makeString(data.orderId),
        orderValue: calculateOrderValue(data.netOrderValue, data.grossOrderValue, data.taxValue, data.shippingValue),
        orderCurrency: data.orderCurrency
            ? makeString(data.orderCurrency)
            : undefined,
        usedCouponCode: data.usedCouponCode
            ? makeString(data.usedCouponCode)
            : undefined,
        iframeContainerId: makeString(data.iframeContainerId),
        integrationType: PLUGIN_VERSION,
        consumerSalutation: (data.consumerSalutation
            ? makeString(data.consumerSalutation)
            : undefined),
        consumerFirstName: data.consumerFirstName
            ? makeString(data.consumerFirstName)
            : undefined,
        consumerLastName: data.consumerLastName
            ? makeString(data.consumerLastName)
            : undefined,
        consumerEmail: data.consumerEmail
            ? makeString(data.consumerEmail)
            : undefined,
        consumerEmailHash: data.consumerEmailHash
            ? makeString(data.consumerEmailHash)
            : undefined,
        consumerYearOfBirth: data.consumerYearOfBirth
            ? makeString(data.consumerYearOfBirth)
            : undefined,
        consumerDateOfBirth: data.consumerDateOfBirth
            ? makeString(data.consumerDateOfBirth)
            : undefined,
        consumerStreet: streetInfo.street,
        consumerStreetNumber: streetInfo.number,
        consumerZipcode: data.consumerZipcode
            ? makeString(data.consumerZipcode)
            : undefined,
        consumerCity: data.consumerCity ? makeString(data.consumerCity) : undefined,
        consumerCountry: data.consumerCountry
            ? makeString(data.consumerCountry)
            : undefined,
        consumerPhone: data.consumerPhone
            ? makeString(data.consumerPhone)
            : undefined,
        usedCouponCodes: undefined,
        sessionId: undefined,
        timestamp: undefined,
    };
    setInWindow("sovThankyouConfig", sovThankyouConfig);
    // TODO: remove
    logger("Thankyou", "sovThankyouConfig =", [sovThankyouConfig]);
    logger("Thankyou", "data =", [data]);
    return sovThankyouConfig;
}
function calculateOrderValue(netOrderValue, grossOrderValue, taxValue, shippingValue) {
    if (netOrderValue) {
        return makeString(netOrderValue);
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
        countryCodePassedOnByPlugin: false,
    };
    setInWindow("sovThankyouStatus", sovThankyouStatus);
    return sovThankyouStatus;
}
function getStreetAndNumber(streetWithNumber, streetName, streetNumber) {
    if (!streetWithNumber) {
        return {
            street: makeString(streetName) || "",
            number: makeString(streetNumber) || "",
        };
    }
    const streetInfo = splitStreetAndNumber(makeString(streetWithNumber));
    return {
        street: streetInfo.street,
        number: streetInfo.number,
    };
}
function splitStreetAndNumber(street) {
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
function isValidHouseNumber(str) {
    // If the string is empty, it's not a valid house number
    if (str.length === 0) {
        return false;
    }
    // Iterate through each character in the string
    for (let i = 0; i < str.length; i++) {
        const char = str[i];
        const charCode = char.charCodeAt(0);
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
