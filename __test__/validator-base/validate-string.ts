import { it, expect, beforeEach } from "vitest";
import Validator from "../../src/validator";
import { validatorErrorMessage } from "../../src/validator-error-message";

export default () => {
	let validator: Validator;

	beforeEach(() => {
		validator = new Validator();
	});

	it("validate string field with expected value", async () => {
		validator
			.setFormData({
				value: "test",
			})
			.setRules({
				value: ["string"],
			});
		await validator.validate();
		expect(validator.pass()).toBeTruthy();
	});

	it("validate string field with non string value", async () => {
		validator
			.setFormData({
				pass: "test",
				failA: null,
				failB: [],
				failC: 123,
			})
			.setRules({
				pass: ["string"],
				failA: ["string"],
				failB: ["string"],
				failC: ["string"],
			});
		await validator.validate();
		expect(validator.pass()).toBeFalsy();
		const error = validator.getErrorBag();
		expect(error.pass).toBeUndefined();
		expect(error.failA).include(
			validatorErrorMessage({
				fieldName: "failA",
				rule: "string",
			}));
		expect(error.failB).include(
			validatorErrorMessage({
				fieldName: "failB",
				rule: "string",
			}));
		expect(error.failC).include(
			validatorErrorMessage({
				fieldName: "failC",
				rule: "string",
			}));
	});
};
