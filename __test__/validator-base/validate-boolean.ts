import { it, expect, beforeEach } from "vitest";
import Validator from "../../src/validator";
import { validatorErrorMessage } from "../../src/validator-error-message";

export default () => {
	let validator: Validator;

	beforeEach(() => {
		validator = new Validator();
	});

	it("validate boolean field with expected value", async () => {
		validator
			.setFormData({
				pass1: true,
				pass2: false,
			})
			.setRules({
				pass1: ["boolean"],
				pass2: ["boolean"],
			});
		await validator.validate();
		expect(validator.pass()).toBeTruthy();
	});

	it("validate boolean field with non boolean value", async () => {
		validator
			.setFormData({
				pass: true,
				failA: "true",
				failB: "false",
			})
			.setRules({
				pass: ["boolean"],
				failA: ["boolean"],
				failB: ["boolean"],
			});
		await validator.validate();
		expect(validator.pass()).toBeFalsy();
		const error = validator.getErrorBag();
		expect(error.pass).toBeUndefined();
		expect(error.failA).include(
			validatorErrorMessage({
				fieldName: "failA",
				rule: "boolean",
			})
		);
		expect(error.failB).include(
			validatorErrorMessage({
				fieldName: "failB",
				rule: "boolean",
			})
		);
	});
};
