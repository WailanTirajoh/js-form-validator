import { describe, it, expect, beforeEach } from "vitest";
import Validator from "../src/validator";
import { baseValidatorRule } from "../src/base-rules";
import { validatorErrorMessage } from "../src/validator-error-message";

describe("Validator Instance", () => {
	let validator: Validator;

	beforeEach(() => {
		validator = new Validator({
			formData: {
				name: "John",
				age: 30,
				email: "john@example.com",
			},
			rules: {
				name: ["required", "string"],
				age: ["required", "integer"],
				email: ["required", "string"],
			},
		});
	});

	it("validate", async () => {
		await validator.validate();
		expect(validator.pass()).toBe(true);
		expect(validator.fail()).toBe(false);
		expect(validator.getErrorBag()).toEqual({});
	});

	it("validate with errors", async () => {
		validator.getFormData().age = "invalid";
		await validator.validate();
		expect(validator.pass()).toBe(false);
		expect(validator.fail()).toBe(true);
		const errors = validator.getErrorBag();
		expect(errors).toEqual({
			age: [validatorErrorMessage["integer"]],
		});
		const failedFields = validator.getFailedFields();
		expect(failedFields).contain("age");
		const ageError = validator.getError("age");
		expect(ageError).toBe(validatorErrorMessage["integer"]);

		const rules = validator.getRules();
		expect(rules).toEqual({
			name: ["required", "string"],
			age: ["required", "integer"],
			email: ["required", "string"],
		});
	});

	it("merge custom rules", () => {
		const customRules = {
			testRule() {
				return "test";
			},
		};
		validator.mergeCustomRules(customRules);
		expect(validator.getValidator()).toEqual({
			...baseValidatorRule,
			...customRules,
		});
	});

	it("skip on rules that doesnt exists", async () => {
		validator.setRules({
			age: ["doesntexists"],
		});
		await validator.validate();
		console.log(validator.pass());
	});
});
