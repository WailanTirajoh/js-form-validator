import { BaseValidatorRule } from "./type";

export const validatorErrorMessage: Record<keyof BaseValidatorRule, string> = {
	["required"]: `The field cannot be empty`,
	["array"]: `The field must be instance of Array`,
	["integer"]: `The field must be integer`,
	["numeric"]: `The field must be numeric`,
	["string"]: `The field must be string`,
	["boolean"]: `The field must be a boolean`,
	// ["image"]: `The field must be an image`,
	// ["size"]: `The size must be between {minSize} and {maxSize} bytes`,
	["allowed"]: `The field must be one of the following: {args}`,
	["email"]: `The field is not a valid email address`,
	["min"]: `The field has minimum of {minSize} but it got value {value}`,
	["max"]: `The field has maximum of {maxSize} but it got value {value}`,
};
