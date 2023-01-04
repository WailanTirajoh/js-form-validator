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

};
