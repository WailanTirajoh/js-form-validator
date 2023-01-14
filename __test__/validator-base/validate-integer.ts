import { it, expect, beforeEach } from "vitest";
import Validator from "../../src/validator";
import { validatorErrorMessage } from "../../src/validator-error-message";

export default () => {
	let validator: Validator;

	beforeEach(() => {
		validator = new Validator();
	});

	it("validate integer field with expected value", async () => {
		validator
			.setFormData({
				value: 123,
			})
			.setRules({
				value: ["integer"],
			});
		await validator.validate();
		expect(validator.pass()).toBeTruthy();
	});

	it("validate integer field with null value", async () => {
		validator
			.setFormData({
				value: null,
			})
			.setRules({
				value: ["integer"],
			});
		await validator.validate();
		expect(validator.pass()).toBeFalsy();
		const error1 = validator.getErrorBag();
		expect(error1.value).include(
			validatorErrorMessage({
				fieldName: "value",
				rule: "integer",
			})
		);
		validator.clearErrors();
	});

	it("validate integer field with string value", async () => {
		validator
			.setFormData({
				value: "string value",
			})
			.setRules({
				value: ["integer"],
			});
		await validator.validate();
		expect(validator.pass()).toBeFalsy();
		const error = validator.getErrorBag();
		expect(error.value).include(
			validatorErrorMessage({
				fieldName: "value",
				rule: "integer",
			})
		);
	});
};
