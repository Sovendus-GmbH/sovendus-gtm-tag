import type { ExplicitAnyType } from "sovendus-integration-types";
import { describe, expect, it } from "vitest";

import { getStreetAndNumber } from "./helper.ts";

function makeString(value: ExplicitAnyType): string {
  return String(value);
}

describe("Street and Street Number Functionality", () => {
  it("should return street and number from a valid input", () => {
    const result = getStreetAndNumber(makeString, "Musterstraße 123", "", "");
    expect(result).toEqual({ street: "Musterstraße", number: "123" });
  });

  it("should return street and number with a letter suffix", () => {
    const result = getStreetAndNumber(makeString, "Hauptstraße 45a", "", "");
    expect(result).toEqual({ street: "Hauptstraße", number: "45a" });
  });

  it("should return the entire string as street if no number is present", () => {
    const result = getStreetAndNumber(makeString, "Bahnhofstraße", "", "");
    expect(result).toEqual({ street: "Bahnhofstraße", number: "" });
  });

  it("should return an empty number for invalid house numbers", () => {
    const result = getStreetAndNumber(makeString, "Teststraße 12/34", "", "");
    expect(result).toEqual({ street: "Teststraße", number: "12/34" });
  });

  it("should handle empty input correctly", () => {
    const result = getStreetAndNumber(makeString, "", "", "");
    expect(result).toEqual({ street: "", number: "" });
  });

  it("should handle input with only spaces", () => {
    const result = getStreetAndNumber(makeString, "   ", "", "");
    expect(result).toEqual({ street: "   ", number: "" });
  });

  it("should return street and number when street is provided without number", () => {
    const result = getStreetAndNumber(makeString, "Platz 1", "", "");
    expect(result).toEqual({ street: "Platz", number: "1" });
  });

  it("should return street and number with zero as a valid number", () => {
    const result = getStreetAndNumber(makeString, "Alte Gasse 0", "", "");
    expect(result).toEqual({ street: "Alte Gasse", number: "0" });
  });

  it("should return street and number with a letter suffix", () => {
    const result = getStreetAndNumber(makeString, "Neuer Weg 12A", "", "");
    expect(result).toEqual({ street: "Neuer Weg", number: "12A" });
  });

  // Additional tests for special characters
  it("should return street and number with special characters in the number", () => {
    const result = getStreetAndNumber(
      makeString,
      "International Street 123-456/789",
      "",
      "",
    );
    expect(result).toEqual({
      street: "International Street",
      number: "123-456/789",
    });
  });

  it("should return street and number with a plus sign in the number", () => {
    const result = getStreetAndNumber(makeString, "Main Street 5+1", "", "");
    expect(result).toEqual({ street: "Main Street", number: "5+1" });
  });

  it("should return street and number with a hash sign in the number", () => {
    const result = getStreetAndNumber(makeString, "Second Avenue 10#2", "", "");
    expect(result).toEqual({ street: "Second Avenue", number: "10#2" });
  });

  it("should return street and number with a dot in the number", () => {
    const result = getStreetAndNumber(
      makeString,
      "Third Boulevard 3.14",
      "",
      "",
    );
    expect(result).toEqual({ street: "Third Boulevard", number: "3.14" });
  });

  it("should return street and number with multiple special characters", () => {
    const result = getStreetAndNumber(
      makeString,
      "Fourth Street 12-34/56+78#90",
      "",
      "",
    );
    expect(result).toEqual({
      street: "Fourth Street",
      number: "12-34/56+78#90",
    });
  });
});
