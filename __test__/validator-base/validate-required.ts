import { it, expect, beforeEach } from "vitest";
import Validator from "../../src/validator";
import { validatorErrorMessage } from "../../src/validator-error-message";

export default () => {
	let validator: Validator;

	beforeEach(() => {
		validator = new Validator();
	});

	it("validate required field with expected value", async () => {
		validator
			.setFormData({
				value: "pass",
			})
			.setRules({
				value: ["required"],
			});
		await validator.validate();
		expect(validator.pass()).toBeTruthy();
	});

	it("validate required field with unexpected value", async () => {
		validator
			.setFormData({
				value: null,
				value1: undefined,
				value2: "",
			})
			.setRules({
				value: ["required"],
				value1: ["required"],
				value2: ["required"],
			});
		await validator.validate();
		expect(validator.pass()).toBeFalsy();
		const error = validator.getErrorBag();
		expect(error.value).include(
			validatorErrorMessage({
				fieldName: "value",
				rule: "required",
			})
		);
		expect(error.value1).include(
			validatorErrorMessage({
				fieldName: "value1",
				rule: "required",
			})
		);
		expect(error.value2).include(
			validatorErrorMessage({
				fieldName: "value2",
				rule: "required",
			})
		);
	});
};
