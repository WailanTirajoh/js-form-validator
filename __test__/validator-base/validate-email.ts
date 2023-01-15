import { it, expect, beforeEach } from "vitest";
import Validator from "../../src/validator";
import { validatorErrorMessage } from "../../src/validator-error-message";

export default () => {
	let validator: Validator;

	beforeEach(() => {
		validator = new Validator();
	});

	it("validate email field that pass", async () => {
		validator
			.setFormData({
				email: "wailantirajoh@gmail.com",
			})
			.setRules({
				email: ["email"],
			});
		await validator.validate();
		expect(validator.pass()).toBeTruthy();
	});

	it("validate email field that fail", async () => {
		validator
			.setFormData({
				email: "wailantirajoh",
			})
			.setRules({
				email: ["email"],
			});
		await validator.validate();
		expect(validator.pass()).toBeFalsy();
		const error = validator.getErrorBag();
		expect(error.email).include(
			validatorErrorMessage({
				fieldName: "email",
				rule: "email",
			})
		);
	});
};
