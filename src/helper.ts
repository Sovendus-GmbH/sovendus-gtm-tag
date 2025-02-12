import type { ExplicitAnyType } from "sovendus-integration-types";

export function getStreetAndNumber(
  makeString: (value: ExplicitAnyType) => string | undefined,
  streetWithNumber: ExplicitAnyType,
  streetName: ExplicitAnyType,
  streetNumber: ExplicitAnyType,
): {
  street: string | undefined;
  number: string | undefined;
} {
  if (!streetName && !streetNumber && !streetWithNumber) {
    return {
      street: "",
      number: "",
    };
  }
  if (!streetWithNumber) {
    return {
      street: makeString(streetName) || "",
      number: makeString(streetNumber) || "",
    };
  }
  const streetInfo = splitStreetAndNumber(makeString(streetWithNumber));
  return {
    street: streetInfo.streetName,
    number: streetInfo.number,
  };
}

function splitStreetAndNumber(street: string | undefined): {
  streetName: string | undefined;
  number: string | undefined;
} {
  // Check if the input is valid (must be a non-empty string)
  if (typeof street !== "string" || street.trim().length === 0) {
    return { streetName: street, number: "" };
  }
  // Trim leading and trailing spaces from the street string
  const trimmedStreet = street.trim();
  // Find the index of the last space in the string
  const lastSpaceIndex = trimmedStreet.lastIndexOf(" ");
  // If no space is found, there is no house number
  if (lastSpaceIndex === -1) {
    return { streetName: trimmedStreet, number: "" };
  }
  // Extract the potential house number (everything after the last space)
  const potentialNumber = trimmedStreet.slice(lastSpaceIndex + 1);
  // Check if the potential house number is valid
  if (isValidHouseNumber(potentialNumber)) {
    // If valid, return the street (everything before the last space) and the house number
    return {
      streetName: trimmedStreet.slice(0, lastSpaceIndex),
      number: potentialNumber,
    };
  }
  // If the house number is invalid, return the entire string as the street
  return { streetName: trimmedStreet, number: "" };
}

// Helper function to check if a string is a valid house number
function isValidHouseNumber(str: string): boolean {
  // If the string is empty, it's not a valid house number
  if (str.length === 0) {
    return false;
  }

  // Define valid characters for house numbers
  const validCharacters =
    "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-/.+#";

  // Check each character in the string
  for (let i = 0; i < str.length; i++) {
    const char = str[i]!;
    // If the character is not in the valid characters string, return false
    if (validCharacters.indexOf(char) === -1) {
      return false;
    }
  }

  // If all characters are valid, return true
  return true;
}
