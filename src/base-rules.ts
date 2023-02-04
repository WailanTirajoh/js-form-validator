/* eslint-disable @typescript-eslint/no-explicit-any */
import { CustomValidatorErrorMessage, FormData } from "./type";
import isValidDate from "./utils/isValidDate";
import { validatorErrorMessage } from "./validator-error-message";

export interface BaseValidatorRuleParam {
	value: any;
	formdata: FormData;
	fieldName: string;
	customValidatorErrorMessage: CustomValidatorErrorMessage;
}
export const baseValidatorRule = {
	required({
		value,
		fieldName,
		customValidatorErrorMessage,
	}: BaseValidatorRuleParam) {
		if (value === undefined || value === "" || value === null) {
			return validatorErrorMessage({
				fieldName: fieldName,
				rule: "required",
				customValidatorErrorMessage,
			});
		}
	},

	array({
		value,
		fieldName,
		customValidatorErrorMessage,
	}: BaseValidatorRuleParam) {
		if (!(value instanceof Array)) {
			return validatorErrorMessage({
				fieldName: fieldName,
				rule: "array",
				customValidatorErrorMessage,
			});
		}
	},

	integer({
		value,
		fieldName,
		customValidatorErrorMessage,
	}: BaseValidatorRuleParam) {
		if (!Number.isInteger(value)) {
			return validatorErrorMessage({
				fieldName: fieldName,
				rule: "integer",
				customValidatorErrorMessage,
			});
		}
	},

	numeric({
		value,
		fieldName,
		customValidatorErrorMessage,
	}: BaseValidatorRuleParam) {
		if (typeof value !== "number") {
			return validatorErrorMessage({
				fieldName: fieldName,
				rule: "numeric",
				customValidatorErrorMessage,
			});
		}
	},

	string({
		value,
		fieldName,
		customValidatorErrorMessage,
	}: BaseValidatorRuleParam) {
		if (typeof value !== "string") {
			return validatorErrorMessage({
				fieldName: fieldName,
				rule: "string",
				customValidatorErrorMessage,
			});
		}
	},

	boolean({
		value,
		fieldName,
		customValidatorErrorMessage,
	}: BaseValidatorRuleParam) {
		if (typeof value !== "boolean") {
			return validatorErrorMessage({
				fieldName: fieldName,
				rule: "boolean",
				customValidatorErrorMessage,
			});
		}
	},

	allowed(
		{ value, fieldName, customValidatorErrorMessage }: BaseValidatorRuleParam,
		...args: any[]
	) {
		if (!args.includes(value)) {
			return validatorErrorMessage({
				fieldName: fieldName,
				rule: "allowed",
				customValidatorErrorMessage,
			}).replace("{args}", args.join(", "));
		}
	},

	email({
		value,
		fieldName,
		customValidatorErrorMessage,
	}: BaseValidatorRuleParam) {
		const emailRegex =
			/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
		if (!emailRegex.test(value)) {
			return validatorErrorMessage({
				fieldName: fieldName,
				rule: "email",
				customValidatorErrorMessage,
			});
		}
	},

	min(
		{ value, fieldName, customValidatorErrorMessage }: BaseValidatorRuleParam,
		minValue: number
	) {
		if (minValue === undefined) {
			return "Please define the min value. Example min:26";
		}

		if (Number.isFinite(Number(value))) {
			const v = parseInt(value);
			if (v < minValue) {
				return validatorErrorMessage({
					fieldName: fieldName,
					rule: "min",
					customValidatorErrorMessage,
				})
					.replace("{minSize}", minValue.toString())
					.replace("{value}", v.toString());
			}
		} else if (typeof value === "string") {
			const v = value.length;
			if (v < minValue) {
				return validatorErrorMessage({
					fieldName: fieldName,
					rule: "min",
					customValidatorErrorMessage,
				})
					.replace("{minSize}", minValue.toString())
					.replace("{value}", v.toString());
			}
		}
	},

	max(
		{ value, fieldName, customValidatorErrorMessage }: BaseValidatorRuleParam,
		maxValue: number
	) {
		if (maxValue === undefined) {
			return "Please define the max value. Example: max:26";
		}

		if (Number.isFinite(Number(value))) {
			const v = parseInt(value);
			if (v > maxValue) {
				return validatorErrorMessage({
					fieldName: fieldName,
					rule: "max",
					customValidatorErrorMessage,
				})
					.replace("{maxSize}", maxValue.toString())
					.replace("{value}", v.toString());
			}
		} else if (typeof value === "string") {
			const v = value.length;
			if (v > maxValue) {
				return validatorErrorMessage({
					fieldName: fieldName,
					rule: "max",
					customValidatorErrorMessage,
				})
					.replace("{maxSize}", maxValue.toString())
					.replace("{value}", v.toString());
			}
		}
	},

	ipv4({
		value,
		fieldName,
		customValidatorErrorMessage,
	}: BaseValidatorRuleParam) {
		const IP_V4_REGEX =
			"(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)(?:\\.(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)){3}";

		const isValidIpV4 = new RegExp(`^${IP_V4_REGEX}$`).test(
			value && value.toString()
		);

		if (!isValidIpV4) {
			return validatorErrorMessage({
				fieldName: fieldName,
				rule: "ipv4",
				customValidatorErrorMessage,
			});
		}
	},

	ipv6({
		value,
		fieldName,
		customValidatorErrorMessage,
	}: BaseValidatorRuleParam) {
		const IP_V6_REGEX = "((([0-9a-fA-F]){1,4}):){7}([0-9a-fA-F]){1,4}";

		const isValidIpV6 = new RegExp(`^${IP_V6_REGEX}$`).test(
			value && value.toString()
		);

		if (!isValidIpV6) {
			return validatorErrorMessage({
				fieldName: fieldName,
				rule: "ipv6",
				customValidatorErrorMessage,
			});
		}
	},

	accepted({
		value,
		fieldName,
		customValidatorErrorMessage,
	}: BaseValidatorRuleParam) {
		if (!["yes", "on", 1, true].includes(value)) {
			return validatorErrorMessage({
				fieldName: fieldName,
				rule: "accepted",
				customValidatorErrorMessage,
			});
		}
	},

	declined({
		value,
		fieldName,
		customValidatorErrorMessage,
	}: BaseValidatorRuleParam) {
		if (!["no", "off", 0, false].includes(value)) {
			return validatorErrorMessage({
				fieldName: fieldName,
				rule: "declined",
				customValidatorErrorMessage,
			});
		}
	},

	date(
		{ value, fieldName, customValidatorErrorMessage }: BaseValidatorRuleParam,
		format?: string
	) {
		if (!isValidDate(value, format)) {
			return validatorErrorMessage({
				fieldName: fieldName,
				rule: "date",
				customValidatorErrorMessage,
			});
		}
	},
};
