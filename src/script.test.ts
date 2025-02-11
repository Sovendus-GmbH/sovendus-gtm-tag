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
    expect(result).toEqual({ street: "Teststraße", number: "" });
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
});
