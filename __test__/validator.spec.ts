import { describe, it, expect, beforeEach } from "vitest";
import Validator from "../src/validator";
import { validatorErrorMessage } from "../src/validator-error-message";

describe("Validator Instance", () => {
	let validator: Validator;

	beforeEach(() => {
		validator = new Validator({
			formData: {
				name: "Wailan",
				email: null,
				age: 25,
			},
		});
	});

	it("validate", async () => {
		validator.setRules({
			name: ["required"],
		});
		await validator.validate();

		expect(validator.pass()).toBeTruthy();
		expect(validator.fail()).toBeFalsy();

		const error = validator.getErrorBag();
		expect(error).toEqual({});
	});

	it("validate with errors", async () => {
		validator.setRules({
			name: ["required"],
			email: [
				"required",
				(value) => {
					const emailRegex =
						/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
					if (!emailRegex.test(value)) return "The field is not a valid email";
				},
			],
		});

		await validator.validate();

		expect(validator.pass()).toBeFalsy();
		expect(validator.fail()).toBeTruthy();

		const error = validator.getErrorBag();
		expect(error.email).include(validatorErrorMessage["required"]);
		expect(error.email).include("The field is not a valid email");
	});

	it("validate with custom rules", async () => {
		validator.setRules({
			age: ["custom"],
		});

		validator.mergeCustomRules({
			custom(value) {
				if (value === 25) {
					return "Test Error";
				}
			},
		});

		await validator.validate();

		const error = validator.getErrorBag();
		expect(error.age).include("Test Error");
	});

	it("validate with dynamic arguments", async () => {
		validator.setRules({
			age: ["between:24,50"],
		});
		validator.mergeCustomRules({
			async between(value, firstValue, secondValue) {
				await new Promise((resolve) => setTimeout(resolve, 1000));
				if (value > firstValue && value < secondValue) {
					return "The value must between 24 - 50 years old";
				}
			},
		});
		await validator.validate();
		expect(validator.fail()).toBeTruthy();
		const error = validator.getErrorBag();
		expect(error.age).include("The value must between 24 - 50 years old");
	});

	it("validate with nested form data", async () => {
		validator.setFormData({
			name: "John",
			age: 30,
			email: "john@example.com",
			family: {
				wife: "test",
				children: null,
			},
		});
		validator.setRules({
			"family.children": ["required"],
		});
		await validator.validate();
		expect(validator.fail()).toBeTruthy();
	});

	it("validate with deeply nested form data", async () => {
		validator
			.setFormData({
				name: "John",
				age: 30,
				email: "john@example.com",
				family: {
					wife: {
						name: "test",
						age: null,
						school: {
							name: null,
						},
					},
					children: null,
				},
			})
			.setRules({
				"family.wife.age": ["required"],
				"family.wife.school.name": ["required"],
			});
		await validator.validate();
		expect(validator.fail()).toBeTruthy();
		const error = validator.getErrorBag();
		expect(error["family.wife.age"]).include(validatorErrorMessage["required"]);
		expect(error["family.wife.school.name"]).include(
			validatorErrorMessage["required"]
		);
	});

	it("validate with array form data", async () => {
		validator
			.setFormData({
				name: "John",
				families: [
					{
						type: "child",
						name: null,
					},
					{
						type: "child",
						name: "child b",
					},
					{
						type: "child",
						name: null,
					},
				],
			})
			.setRules({
				families: ["array"],
				["families.*.name"]: ["string"],
			});
		await validator.validate();
		expect(validator.fail()).toBeTruthy();
		const error = validator.getErrorBag();
		expect(error["families.0.name"]).include(validatorErrorMessage["string"]);
		expect(error["families.2.name"]).include(validatorErrorMessage["string"]);
	});

	it("skip on rules that doesnt exists", async () => {
		validator.setRules({
			age: ["doesntexists"],
		});
		await validator.validate();
	});

	it("validate, get failed fields, and get failed field by name", async () => {
		validator.setRules({
			email: ["required"],
		});
		await validator.validate();

		// Validate
		expect(validator.pass()).toBeFalsy();
		expect(validator.fail()).toBeTruthy();

		// Get failed fields
		const failedFields = validator.getFailedFields();
		expect(failedFields).toEqual(["email"]);

		// Get failed field by key
		const emailError = validator.getError("email");
		expect(emailError).toContain(validatorErrorMessage["required"]);
	});

	it("get rules", async () => {
		const rules = {
			name: ["required"],
		};
		validator.setRules(rules);
		const validatorRules = validator.getRules();
		expect(validatorRules).toEqual(rules);
	});

	it("get validator", async () => {
		validator.setRules({
			name: ["required"],
		});
		validator.getValidator();
	});

	it("get form data", async () => {
		validator.setFormData({
			name: "test",
		});
		validator.setRules({
			name: ["required"],
		});
		const formData = validator.getFormData();
		expect(formData).toEqual({
			name: "test",
		});
	});

	it("get set & error message", async () => {
		validator.setFormData({
			name: null,
			age: null,
		});
		validator.setRules({
			name: ["required"],
			age: ["required"],
		});
		await validator.validate();
		expect(validator.getErrorMessage()).toBe("2 error occured");
		const newErrorMessage = "Please fill the form correctly!";
		validator.setErrorMessage(newErrorMessage);
		expect(validator.getErrorMessage()).toBe(newErrorMessage);
	});

	it("stop on first failure", async () => {
		validator.stopOnFirstFailure = true;
		validator.setFormData({
			name: 123,
			age: null,
		});
		validator.setRules({
			name: ["required", "string"],
			age: ["required"],
		});
		await validator.validate();
		const errorBag = validator.getErrorBag();
		expect(errorBag.name).contain(validatorErrorMessage["string"]);
	});
});
