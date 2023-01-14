import { it, expect, beforeEach } from "vitest";
import Validator from "../../src/validator";
import { validatorErrorMessage } from "../../src/validator-error-message";

export default () => {
	let validator: Validator;

	beforeEach(() => {
		validator = new Validator();
	});

	it("validate array field with expected array values", async () => {
		validator
			.setFormData({
				value: ["array1", "array2"],
			})
			.setRules({
				value: ["array"],
			});
		await validator.validate();
		expect(validator.pass()).toBeTruthy();
	});

	it("validate array field with null value", async () => {
		validator
			.setFormData({
				value: null,
			})
			.setRules({
				value: ["array"],
			});
		await validator.validate();
		expect(validator.pass()).toBeFalsy();
		const error = validator.getErrorBag();
		expect(error.value).include(
			validatorErrorMessage({
				fieldName: "value",
				rule: "array",
			}));
	});
};
