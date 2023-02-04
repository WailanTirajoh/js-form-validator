import { beforeEach, describe, expect, it } from "vitest";
import { Validator } from "../src";
import { FieldValidator } from "../src/field";
import { baseValidatorErrorMessage } from "../src/validator-error-message";

describe("Sync both field & form validator ", () => {
	let fieldValidator: FieldValidator;
	let validator: Validator;

	beforeEach(() => {
		fieldValidator = new FieldValidator();
		validator = new Validator();
	});

	const rulesWithParam = ["date", "max", "min", "allowed"]; //TODO: test this rules with params manual
	const predefinedRules = Object.keys(baseValidatorErrorMessage).filter(
		(rule) => !rulesWithParam.includes(rule)
	);

	predefinedRules.forEach((rule: string) => {
		it(`Validate ${rule}`, async () => {
			const fieldName = "Field";
			const value = null;
			const rules = [rule];

			validator
				.setFormData({
					key: value,
				})
				.setRules({
					key: rules,
				});

			const customFieldNames = {
				key: fieldName,
			};
			validator.setCustomFieldName(customFieldNames);
			await validator.validate();
			expect(validator.pass()).toBeFalsy();
			const errors = validator.getErrorBag();

			// Field Validator
			fieldValidator.setFieldName(fieldName);
			fieldValidator.setFieldValue(value);
			fieldValidator.setFieldRules(rules);
			await fieldValidator.validate();
			const fieldError = fieldValidator.getErrorBag();

			expect(errors.key).toEqual(fieldError);
		});

		it(`Validate ${rule} without custom fieldname`, async () => {
			const value = null;
			const rules = [rule];

			validator
				.setFormData({
					key: value,
				})
				.setRules({
					key: rules,
				});

			await validator.validate();
			expect(validator.pass()).toBeFalsy();
			const errors = validator.getErrorBag();

			// Field Validator
			fieldValidator.setFieldName("key");
			fieldValidator.setFieldValue(value);
			fieldValidator.setFieldRules(rules);
			await fieldValidator.validate();
			const fieldError = fieldValidator.getErrorBag();

			expect(errors.key).toEqual(fieldError);
		});
	});
});
