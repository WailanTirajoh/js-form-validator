import { it, expect, beforeEach } from "vitest";
import Validator from "../../src/validator";
import { validatorErrorMessage } from "../../src/validator-error-message";

export default () => {
	let validator: Validator;

	beforeEach(() => {
		validator = new Validator();
	});

	it("validate min field that pass", async () => {
		validator
			.setFormData({
				age: 20,
			})
			.setRules({
				age: ["min:20"],
			});
		await validator.validate();
		expect(validator.pass()).toBeTruthy();
	});

	it("validate min field that fail", async () => {
		const age = 19;
		validator
			.setFormData({
				age: age,
			})
			.setRules({
				age: ["min:20"],
			});
		await validator.validate();
		expect(validator.pass()).toBeFalsy();
		const error = validator.getErrorBag();
		expect(error.age).include(
			validatorErrorMessage["min"]
				.replace("{minSize}", "20")
				.replace("{value}", age.toString())
		);
	});

	it("validate min length of string field that pass", async () => {
		validator
			.setFormData({
				password: "password",
			})
			.setRules({
				password: ["min:8"],
			});
		await validator.validate();
		expect(validator.pass()).toBeTruthy();
	});

	it("validate min length of string field that fail", async () => {
		validator
			.setFormData({
				password: "password",
			})
			.setRules({
				password: ["min:9"],
			});
		await validator.validate();
		expect(validator.pass()).toBeFalsy();
		const error = validator.getErrorBag();
		expect(error.password).include(
			validatorErrorMessage["min"]
				.replace("{minSize}", "9")
				.replace("{value}", "password".length.toString())
		);
	});
};
