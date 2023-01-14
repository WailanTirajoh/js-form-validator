import type {
	FormData,
	FormState,
	ValidationRule,
	ValidationRules,
	BaseValidatorRule,
	CustomRules,
} from "./type";
import { baseValidatorRule } from "./base-rules";
import ValidatorError from "./validator-error";

export default class Validator {
	// The form data to validate
	private formData: FormData;

	// The validation rules to apply to the form data
	private rules: ValidationRules;

	// The errors found while validating the form data
	private validatorError: ValidatorError;

	// The validator functions to use for validation, including both base rules and custom rules
	private validator!: BaseValidatorRule & CustomRules;

	// The flag to stop on first failure
	public stopOnFirstFailure!: boolean;

	/**
	 * Constructor for the Validator class.
	 * @param formData The form data to validate.
	 * @param customRules Custom validation rules to use.
	 * @param rules Validation rules to apply to the form data.
	 */
	constructor({
		formData,
		customRules,
		rules,
		stopOnFirstFailure,
	}: FormState = {}) {
		this.formData = formData ?? {};
		this.rules = rules ?? {};
		this.validatorError = new ValidatorError();
		this.stopOnFirstFailure = stopOnFirstFailure ?? false;
		this.mergeCustomRules(customRules);
	}

	/**
	 * Merges the base rules and custom rules into a single object.
	 * @param customRules The custom rules to merge with the base rules.
	 */
	public mergeCustomRules(customRules: CustomRules | undefined) {
		this.setValidator({ ...baseValidatorRule, ...customRules });
		return this;
	}

	/**
	 * Validates the form data with the set of given rules.
	 */
	public async validate(): Promise<Validator> {
		// If it stop on first failure, break on when validator has error
		if (this.stopOnFirstFailure) {
			for (const rule in this.rules) {
				if (this.validatorError.hasErrors()) break;
				await this.validateField({ field: rule, fieldRules: this.rules[rule] });
			}
		}

		// Otherwise, use promise all to validate the data concurently
		else {
			// Validate each field in the form data with its corresponding rules
			const fieldPromises = Object.entries(this.rules).map(
				([field, fieldRules]) => this.validateField({ field, fieldRules })
			);
			await Promise.all(fieldPromises);
		}
		return this;
	}

	/**
	 * Validates the given field with the set of rules.
	 * @param field The field to validate.
	 * @param fieldRules The validation rules to apply to the field.
	 */
	private async validateField({
		field,
		fieldRules,
	}: {
		field: string;
		fieldRules: ValidationRule[];
	}): Promise<void> {
		const fieldKeys = field.split(".");
		if (fieldKeys.includes("*")) {
			await this.validateArrayObjects(field, fieldKeys, fieldRules);
		} else {
			await this.validateFieldValue(field, fieldKeys, fieldRules);
		}
	}

	/**
	 * Validates the elements of an array field in the form data.
	 * @param field The field name, including a wildcard character.
	 * @param fieldKeys The field name split into an array of keys.
	 * @param fieldRules The validation rules to apply to the field.
	 */
	private async validateArrayObjects(
		field: string,
		fieldKeys: string[],
		fieldRules: ValidationRule[]
	): Promise<void> {
		const arrayFieldKey = fieldKeys.indexOf("*");
		const arrayField = this.formData[fieldKeys[arrayFieldKey - 1]];
		for (let i = 0; i < arrayField.length; i++) {
			// Check if the object has all its required fields filled
			const requiredFieldsFilled = fieldRules.every((rule) => {
				typeof this.getValidatorResult(field, arrayField[i], rule) ===
					"undefined";
			});
			if (!requiredFieldsFilled) {
				// Validate the object if any required fields are missing
				// Replace the wildcard character with the current array index in the field name
				const newField = field.replace("*", `${i}`);
				await this.validateField({
					field: newField,
					fieldRules,
				});
			}
		}
	}

	/**
	 * Validates the elements of an array field in the form data.
	 * @param field The field name, whitout a wildcard character.
	 * @param fieldKeys The field name split into an array of keys.
	 * @param fieldRules The validation rules to apply to the field.
	 */
	private async validateFieldValue(
		field: string,
		fieldKeys: string[],
		fieldRules: ValidationRule[]
	): Promise<void> {
		let fieldValue = this.formData;
		for (const key of fieldKeys) {
			fieldValue = fieldValue[key];
		}
		// If its stop on first failure, await for every validator and break on first error found
		if (this.stopOnFirstFailure) {
			for (const rule of fieldRules) {
				const error = await this.getValidatorResult(field, fieldValue, rule);
				if (error) {
					this.validatorError.add(field, error);
					break;
				}
			}
		}
		// Otherwise run promise all to validate it concurently
		else {
			// Get the error results of validating each rule for the field
			const errors = await Promise.all(
				fieldRules.map((rule) =>
					// If the validator result is a promise, return it directly,
					// otherwise wrap it in a resolved promise
					typeof this.getValidatorResult(field, fieldValue, rule) === "object"
						? this.getValidatorResult(field, fieldValue, rule)
						: Promise.resolve(this.getValidatorResult(field, fieldValue, rule))
				)
			);
			// Add each error to the error bag
			errors.forEach((error) => {
				if (!error) return;
				this.validatorError.add(field, error);
			});
		}
	}

	/**
	 * Gets the validator result for the given field and rule.
	 * @param field The field to validate.
	 * @param rule The validation rule to apply to the field.
	 */
	private getValidatorResult(
		field: string,
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		fieldValue: any,
		rule: ValidationRule
	) {
		let validatorResult;
		switch (typeof rule) {
			// String -> predefined validator function (Can check the function lists on ./validator-gates.ts)
			case "string": {
				validatorResult = this.handleStringRule(field, rule);
				break;
			}
			// Function -> custom callback function that returns either errorr message if fail / void if success
			case "function": {
				validatorResult = rule(fieldValue, this.formData);
				break;
			}

			// TODO: Add object type (To handle class that implements ValidatorRule)
		}
		return validatorResult;
	}

	/**
	 * Handles string rules by parsing the rule string and calling the corresponding
	 * validator function with the provided arguments.
	 * @param field The field to validate.
	 * @param rule The string rule to handle.
	 */
	private handleStringRule(field: string, rule: string) {
		const [validatorName, parameters] = this.parseRule(rule);

		if (!(validatorName in this.validator)) return;
		if (field.includes("*")) return;
		const value = field
			.split(".")
			.reduce((acc, part) => acc[part], this.formData);
		return this.validator[validatorName](
			{
				value: value,
				formdata: this.formData,
			},
			...parameters
		);
	}

	/**
	 * To parse rule into validator name & parameters
	 * Example:
	 * between:2,3
	 * Result:
	 * validatorName = between
	 * parameters = [2,3]
	 * @param rule
	 */
	private parseRule(rule: string): [string, string[]] {
		const [validatorName, paramArgs] = rule.split(":");
		const parameters = paramArgs
			? paramArgs.split(",").map((p) => p.trim())
			: [];
		return [validatorName, parameters];
	}

	/**
	 * To get errorBag
	 */
	public getErrorBag() {
		return this.validatorError.getErrorBag();
	}

	/**
	 * To get overall error mesasge
	 */
	public getErrorMessage() {
		return this.validatorError.getErrorMessage();
	}

	/**
	 * To set custom error message
	 */
	public setErrorMessage(errorMessage: string) {
		return this.validatorError.setErrorMessage(errorMessage);
	}

	/**
	 * To get error by field name
	 */
	public getError(field: string): string | undefined {
		return this.validatorError.getErrorBag()[field]?.[0];
	}

	/**
	 * To get failed fields
	 */
	public getFailedFields(): string[] {
		return Object.keys(this.getErrorBag());
	}

	/**
	 * To check if form data is pass the validator
	 */
	public pass() {
		return Object.keys(this.getErrorBag()).length === 0;
	}

	/**
	 * To check if form data is fail the validator
	 */
	public fail() {
		return !this.pass();
	}

	/**
	 * To clear error from error bags
	 */
	public clearErrors() {
		this.validatorError.clearErrorBag();
		return this;
	}

	// Getters & Setters for unit test purpose
	public getFormData(): FormData {
		return this.formData;
	}

	public setFormData(formData: FormData) {
		this.formData = formData;
		return this;
	}

	public setFieldErrors(field: string, fieldErrors: string[]) {
		this.validatorError.setFieldErrors(field, fieldErrors);
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	public setFormKeyValue(key: string, value: any) {
		this.formData[key] = value;
	}

	public getValidator(): BaseValidatorRule & CustomRules {
		return this.validator;
	}

	public setValidator(validator: BaseValidatorRule & CustomRules) {
		this.validator = validator;
		return this;
	}

	public getRules(): ValidationRules {
		return this.rules;
	}

	public setRules(rules: ValidationRules) {
		this.rules = rules;
		return this;
	}
	// End Getters & Setters for unit test
}
