import { it, expect, beforeEach } from "vitest";
import Validator from "../../src/validator";
import { validatorErrorMessage } from "../../src/validator-error-message";

export default () => {
	let validator: Validator;

	beforeEach(() => {
		validator = new Validator();
	});

	it("validate accepted field that pass (1)", async () => {
		validator
			.setFormData({
				key: 1,
			})
			.setRules({
				key: ["accepted"],
			});
		await validator.validate();
		expect(validator.pass()).toBeTruthy();
	});

	it("validate accepted field that pass (yes)", async () => {
		validator
			.setFormData({
				key: "yes",
			})
			.setRules({
				key: ["accepted"],
			});
		await validator.validate();
		expect(validator.pass()).toBeTruthy();
	});

	it("validate accepted field that pass (on)", async () => {
		validator
			.setFormData({
				key: "on",
			})
			.setRules({
				key: ["accepted"],
			});
		await validator.validate();
		expect(validator.pass()).toBeTruthy();
	});

	it("validate accepted field that pass (true)", async () => {
		validator
			.setFormData({
				key: true,
			})
			.setRules({
				key: ["accepted"],
			});
		await validator.validate();
		expect(validator.pass()).toBeTruthy();
	});

	it("validate accepted field that fail", async () => {
		validator
			.setFormData({
				key: false,
			})
			.setRules({
				key: ["accepted"],
			});
		await validator.validate();

		expect(validator.pass()).toBeFalsy();

		const error = validator.getErrorBag();
		expect(error["key"]).include(
			validatorErrorMessage({
				fieldName: "key",
				rule: "accepted",
			})
		);
	});
};
