import { describe, it, expect, beforeEach } from "vitest";
import Validator from "../../src/validator";
import { validatorErrorMessage } from "../../src/validator-error-message";

export default () => {
	let validator: Validator;

	beforeEach(() => {
		validator = new Validator({
			formData: {},
		});
	});

	it("validate max field that pass", async () => {
		const AGE = 20;
		validator
			.setFormData({
				age: AGE,
			})
			.setRules({
				age: ["max:20"],
			});
		await validator.validate();
		expect(validator.pass()).toBeTruthy();
	});

	it("validate max field that fail", async () => {
		const AGE = 21;
		const MAX_AGE = 20;
		validator
			.setFormData({
				age: AGE,
			})
			.setRules({
				age: [`max:${MAX_AGE}`],
			});

		await validator.validate();

		expect(validator.pass()).toBeFalsy();

		const error = validator.getErrorBag();
		const errorMessage = validatorErrorMessage["max"]
			.replace("{maxSize}", MAX_AGE.toString())
			.replace("{value}", AGE.toString());

		expect(error.age).include(errorMessage);
	});
	it("validate max length of string field that pass", async () => {
		const MAX_LENGTH_PASS = 8;
		const VALUE = "password";

		validator
			.setFormData({
				password: VALUE,
			})
			.setRules({
				password: [`max:${MAX_LENGTH_PASS}`],
			});

		await validator.validate();
		expect(validator.pass()).toBeTruthy();
	});
};
