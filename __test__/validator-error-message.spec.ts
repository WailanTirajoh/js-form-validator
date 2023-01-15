import { describe, it, beforeEach, expect } from "vitest";
import Validator from "../src/validator";
import { validatorErrorMessage } from "../src/validator-error-message";

describe("Validator Instance", () => {
	let validator: Validator;

	beforeEach(() => {
		validator = new Validator();
		validator.setFormData({
			name: "Wailan",
			email: null,
			age: 25,
		});
	});

	it("Set custom field name to error message", async () => {
		validator.setRules({
			email: ["required"],
		});
		const customFieldNames = {
			email: "Surel",
		};

		validator.setCustomFieldName(customFieldNames);
		expect(validator.getCustomFieldName()).toEqual(customFieldNames);

		await validator.validate();
		const error = validator.getError("email");
		expect(error).toEqual(
			validatorErrorMessage({
				fieldName: "Surel",
				rule: "required",
			})
		);
	});

	it("Override error message", async () => {
		const customValidatorErrorMessage = {
			["required"]: "The {field} is required!!!",
		};

		validator.setCustomValidatorErrorMessage(customValidatorErrorMessage);

		expect(validator.getCustomValidatorErrorMessage()).toEqual(
			customValidatorErrorMessage
		);

		validator.setRules({
			email: ["required"],
		});

		await validator.validate();

		const errors = validator.getErrorBag();
		expect(errors.email).contain("The email is required!!!");

		// Empty the email error
		validator.setFieldErrors("email", []);

		const customFieldNames = {
			email: "Surel",
		};

		validator.setCustomFieldName(customFieldNames);
		await validator.validate();
		expect(errors.email).contain("The Surel is required!!!");
	});
});
