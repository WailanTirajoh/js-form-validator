import { BaseValidatorRule } from "./type";

type ValidatorErrorMessageParameter = {
	fieldName: string;
	rule: keyof BaseValidatorRule;
};

export const validatorErrorMessage: (
	param: ValidatorErrorMessageParameter
) => string = ({ fieldName, rule }: ValidatorErrorMessageParameter) => {
	return {
		["required"]: `The ${fieldName} cannot be empty`,
		["array"]: `The ${fieldName} must be instance of Array`,
		["integer"]: `The ${fieldName} must be integer`,
		["numeric"]: `The ${fieldName} must be numeric`,
		["string"]: `The ${fieldName} must be string`,
		["boolean"]: `The ${fieldName} must be a boolean`,
		["allowed"]: `The ${fieldName} must be one of the following: {args}`,
		["email"]: `The ${fieldName} is not a valid email address`,
		["min"]: `The ${fieldName} has minimum of {minSize} but it got value {value}`,
		["max"]: `The ${fieldName} has maximum of {maxSize} but it got value {value}`,
		["ipv4"]: `The ${fieldName} must be an IPv4 address`,
		["ipv6"]: `The ${fieldName} must be an IPv6 address`,
		["accepted"]: `The ${fieldName} must be accepted`,
		["declined"]: `The ${fieldName} must be declined`,
	}[rule];
};
