import { describe, it, expect, beforeEach } from "vitest";
import { FieldValidator } from "../src/field";
import { validatorErrorMessage } from "../src/validator-error-message";

describe("Validator Instance", () => {
	let fieldValidator: FieldValidator;

	beforeEach(() => {
		fieldValidator = new FieldValidator();
	});

	it("set field name", () => {
		fieldValidator.setFieldName("inputFieldName");
		expect(fieldValidator.getFieldName()).toBe("inputFieldName");
	});

	it("set field rules", () => {
		const rules = ["required", "string"];
		fieldValidator.setFieldRules(rules);
		expect(fieldValidator.getFieldRules()).toBe(rules);
	});

	it("set field value", () => {
		const value = "test";
		fieldValidator.setFieldValue(value);
		expect(fieldValidator.getFieldValue()).toBe(value);
	});

	it("validate field & get error bag", async () => {
		const value = null;
		const rules = ["required", "string"];

		fieldValidator.setFieldName("field");
		fieldValidator.setFieldValue(value);
		fieldValidator.setFieldRules(rules);

		await fieldValidator.validate();

		expect(fieldValidator.pass()).toBeFalsy();
		expect(fieldValidator.getErrorBag()).toContain(
			validatorErrorMessage({
				fieldName: "field",
				rule: "required",
			})
		);

		expect(fieldValidator.getErrorBag()).toContain(
			validatorErrorMessage({
				fieldName: "field",
				rule: "string",
			})
		);
	});

	it("merge custom rules", async () => {
		fieldValidator.setCustomRules({
			async between(value, firstValue, secondValue) {
				await new Promise((resolve) => setTimeout(resolve, 1000));
				if (value <= firstValue || value >= secondValue) {
					return "The value must between 24 - 50 years old";
				}
			},
		});
		fieldValidator.setFieldName("field");
		fieldValidator.setFieldValue(23);
		fieldValidator.setFieldRules(["between:24,50"]);

		await fieldValidator.validate();
		expect(fieldValidator.fail()).toBeTruthy();
		const error = fieldValidator.getErrorBag();
		expect(error).contain("The value must between 24 - 50 years old");
	});

	it("set form data", () => {
		const formData = {
			test: "hallo",
		};
		fieldValidator.setFormData(formData);
		expect(fieldValidator.getFormData()).toEqual(formData);
	});

	it("validate custom anonymous function", async () => {
		fieldValidator.setFieldName("field");
		fieldValidator.setFieldValue(23);
		const formData = {
			test: "hallo",
			field: 23,
		};

		fieldValidator.setFieldRules([
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			async (value: any, formData: any) => {
				await new Promise((resolve) => setTimeout(resolve, 1000));
				if (formData.test === "hallo" && value === 23) return "just testing";
			},
		]);

		fieldValidator.setFormData(formData);

		await fieldValidator.validate();

		expect(fieldValidator.getErrorBag()).toContain("just testing");
	});
});
