import { it, expect, beforeEach } from "vitest";
import Validator from "../../src/validator";
import { validatorErrorMessage } from "../../src/validator-error-message";

export default () => {
	let validator: Validator;

	beforeEach(() => {
		validator = new Validator();
	});

	it("validate numeric field with expected value", async () => {
		validator
			.setFormData({
				value: 15000,
			})
			.setRules({
				value: ["numeric"],
			});
		await validator.validate();
		expect(validator.pass()).toBeTruthy();
	});

	it("validate numeric field with with non numeric value", async () => {
		validator
			.setFormData({
				value: "test",
			})
			.setRules({
				value: ["numeric"],
			});
		await validator.validate();
		expect(validator.pass()).toBeFalsy();
		expect(validator.getErrorBag().value).include(
			validatorErrorMessage({
				fieldName: "value",
				rule: "numeric",
			})
		);
	});
};
