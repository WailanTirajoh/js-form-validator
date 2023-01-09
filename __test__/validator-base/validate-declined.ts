import { it, expect, beforeEach } from "vitest";
import Validator from "../../src/validator";
import { validatorErrorMessage } from "../../src/validator-error-message";

export default () => {
	let validator: Validator;

	beforeEach(() => {
		validator = new Validator();
	});

	it("validate declined field that pass (0)", async () => {
		validator
			.setFormData({
				key: 0,
			})
			.setRules({
				key: ["declined"],
			});

		await validator.validate();

		expect(validator.pass()).toBeTruthy();
	});

	it("validate declined field that pass (no)", async () => {
		validator
			.setFormData({
				key: "no",
			})
			.setRules({
				key: ["declined"],
			});

		await validator.validate();

		expect(validator.pass()).toBeTruthy();
	});

	it("validate declined field that pass (off)", async () => {
		validator
			.setFormData({
				key: "off",
			})
			.setRules({
				key: ["declined"],
			});

		await validator.validate();

		expect(validator.pass()).toBeTruthy();
	});

	it("validate declined field that pass (false)", async () => {
		validator
			.setFormData({
				key: false,
			})
			.setRules({
				key: ["declined"],
			});

		await validator.validate();

		expect(validator.pass()).toBeTruthy();
	});

	it("validate declined field that fail", async () => {
		validator
			.setFormData({
				key: true,
			})
			.setRules({
				key: ["declined"],
			});

		await validator.validate();

		expect(validator.pass()).toBeFalsy();

		const error = validator.getErrorBag();
		expect(error["key"]).include(validatorErrorMessage["declined"]);
	});
};
