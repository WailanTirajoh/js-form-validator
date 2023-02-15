import { describe } from "vitest";

import validateAccepted from "./validator-base/validate-accepted";
import validateAllowed from "./validator-base/validate-allowed";
import validateArray from "./validator-base/validate-array";
import validateBetween from "./validator-base/validate-between";
import validateBoolean from "./validator-base/validate-boolean";
import validateDate from "./validator-base/validate-date";
import validateDeclined from "./validator-base/validate-declined";
import validateEmail from "./validator-base/validate-email";
import validateInteger from "./validator-base/validate-integer";
import validateIpV4 from "./validator-base/validate-ipv4";
import validateIpV6 from "./validator-base/validate-ipv6";
import validateMax from "./validator-base/validate-max";
import validateMin from "./validator-base/validate-min";
import validateNumeric from "./validator-base/validate-numeric";
import validateRequired from "./validator-base/validate-required";
import validateString from "./validator-base/validate-string";

describe("Validator Base Rule", () => {
	validateAccepted();
	validateDeclined();
	validateAllowed();
	validateArray();
	validateBoolean();
	validateBetween();
	validateEmail();
	validateInteger();
	validateIpV4();
	validateIpV6();
	validateMax();
	validateMin();
	validateNumeric();
	validateRequired();
	validateString();
	validateDate();
});
