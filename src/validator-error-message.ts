import { BaseValidatorRule, CustomValidatorErrorMessage } from "./type";

type ValidatorErrorMessageParameter = {
	fieldName: string;
	rule: keyof BaseValidatorRule;
	customValidatorErrorMessage?: CustomValidatorErrorMessage;
};

export const baseValidatorErrorMessage: Record<keyof BaseValidatorRule, string> = {
	["required"]: `The {field} cannot be empty`,
	["array"]: `The {field} must be instance of Array`,
	["integer"]: `The {field} must be integer`,
	["numeric"]: `The {field} must be numeric`,
	["string"]: `The {field} must be string`,
	["boolean"]: `The {field} must be a boolean`,
	["allowed"]: `The {field} must be one of the following: {args}`,
	["email"]: `The {field} is not a valid email address`,
	["min"]: `The {field} has minimum of {minSize} but it got value {value}`,
	["max"]: `The {field} has maximum of {maxSize} but it got value {value}`,
	["ipv4"]: `The {field} must be an IPv4 address`,
	["ipv6"]: `The {field} must be an IPv6 address`,
	["accepted"]: `The {field} must be accepted`,
	["declined"]: `The {field} must be declined`,
};

export const validatorErrorMessage: (
	param: ValidatorErrorMessageParameter
) => string = ({
	fieldName,
	rule,
	customValidatorErrorMessage = {},
}: ValidatorErrorMessageParameter) => {
	return { ...baseValidatorErrorMessage, ...customValidatorErrorMessage }[
		rule
	].replace("{field}", fieldName);
};
