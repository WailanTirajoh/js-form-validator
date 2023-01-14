import { BaseValidatorRule, CustomRules, ValidationRule } from "./type";
import { baseValidatorRule } from "./base-rules";
import ValidatorError from "./validator-error";

export class FieldValidator {
	private fieldName: string;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	private fieldValue: any;
	private fieldRules: ValidationRule[];
	private validatorError: ValidatorError;
	// The validator functions to use for validation, including both base rules and custom rules
	private validator!: BaseValidatorRule & CustomRules;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	private formData: { [key: string]: any };

	constructor() {
		this.fieldName = "";
		this.fieldRules = [];
		this.fieldValue = null;
		this.validatorError = new ValidatorError();
		this.validator = baseValidatorRule;
		this.formData = {};
	}

	public setCustomRules(customRules: CustomRules) {
		this.mergeCustomRules(customRules);
	}

	public setFieldName(name: string) {
		this.fieldName = name;
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	public setFormData(formData: { [key: string]: any }) {
		this.formData = formData;
	}

	public getFormData() {
		return this.formData;
	}

	public getFieldName() {
		return this.fieldName;
	}

	public setFieldRules(rules: ValidationRule[]) {
		this.fieldRules = rules;
	}

	public getFieldRules() {
		return this.fieldRules;
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	public setFieldValue(value: any) {
		this.fieldValue = value;
	}

	public getFieldValue() {
		return this.fieldValue;
	}

	public async validate() {
		this.validatorError.clearErrorBag();

		const errors = await Promise.all(
			this.fieldRules.map((rule) =>
				typeof this.getValidatorResult(rule) === "object"
					? this.getValidatorResult(rule)
					: Promise.resolve(this.getValidatorResult(rule))
			)
		);

		errors.forEach((error) => {
			if (!error) return;
			this.validatorError.add(this.fieldName, error);
		});
	}

	private async getValidatorResult(rule: ValidationRule) {
		let validatorResult;
		switch (typeof rule) {
			// String -> predefined validator function (Can check the function lists on ./validator-gates.ts)
			case "string": {
				validatorResult = this.handleStringRule(rule);
				break;
			}
			// Function -> custom callback function that returns either errorr message if fail / void if success
			case "function": {
				validatorResult = rule(this.fieldValue, this.formData);
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
	private handleStringRule(rule: string) {
		const [validatorName, parameters] = this.parseRule(rule);
		return this.validator[validatorName](
			{
				value: this.fieldValue,
				formdata: this.formData
			},
			...parameters
		);
	}

	private parseRule(rule: string): [string, string[]] {
		const [validatorName, paramArgs] = rule.split(":");
		const parameters = paramArgs
			? paramArgs.split(",").map((p) => p.trim())
			: [];
		return [validatorName, parameters];
	}

	public pass() {
		return !this.validatorError.hasErrors();
	}

	public fail() {
		return !this.pass();
	}

	public getErrorBag() {
		return this.validatorError.getErrorBag()[this.fieldName];
	}

	/**
	 * Merges the base rules and custom rules into a single object.
	 * @param customRules The custom rules to merge with the base rules.
	 */
	private mergeCustomRules(customRules: CustomRules | undefined) {
		this.setValidator({ ...baseValidatorRule, ...customRules });
		return this;
	}

	private setValidator(validator: BaseValidatorRule & CustomRules) {
		this.validator = validator;
		return this;
	}
}
