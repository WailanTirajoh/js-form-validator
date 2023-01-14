/* eslint-disable @typescript-eslint/no-explicit-any */
import { FormData } from "./type";
import { validatorErrorMessage } from "./validator-error-message";

export interface BaseValidatorRuleParam {
	value: any;
	formdata: FormData;
	fieldName: string;
}
export const baseValidatorRule = {
	required({ value, fieldName }: BaseValidatorRuleParam) {
		if (value === undefined || value === "" || value === null) {
			return validatorErrorMessage({ fieldName: fieldName, rule: "required" });
		}
	},

	array({ value, fieldName }: BaseValidatorRuleParam) {
		if (!(value instanceof Array)) {
			return validatorErrorMessage({ fieldName: fieldName, rule: "array" });
		}
	},

	integer({ value, fieldName }: BaseValidatorRuleParam) {
		if (!Number.isInteger(value)) {
			return validatorErrorMessage({ fieldName: fieldName, rule: "integer" });
		}
	},

	numeric({ value, fieldName }: BaseValidatorRuleParam) {
		if (typeof value !== "number") {
			return validatorErrorMessage({ fieldName: fieldName, rule: "numeric" });
		}
	},

	string({ value, fieldName }: BaseValidatorRuleParam) {
		if (typeof value !== "string") {
			return validatorErrorMessage({ fieldName: fieldName, rule: "string" });
		}
	},

	boolean({ value, fieldName }: BaseValidatorRuleParam) {
		if (typeof value !== "boolean") {
			return validatorErrorMessage({ fieldName: fieldName, rule: "boolean" });
		}
	},

	allowed({ value, fieldName }: BaseValidatorRuleParam, ...args: any[]) {
		if (!args.includes(value)) {
			return validatorErrorMessage({
				fieldName: fieldName,
				rule: "allowed",
			}).replace("{args}", args.join(", "));
		}
	},

	email({ value, fieldName }: BaseValidatorRuleParam) {
		const emailRegex =
			/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
		if (!emailRegex.test(value)) {
			return validatorErrorMessage({ fieldName: fieldName, rule: "email" });
		}
	},

	min({ value, fieldName }: BaseValidatorRuleParam, minValue: number) {
		if (Number.isFinite(Number(value))) {
			const v = parseInt(value);
			if (v < minValue) {
				return validatorErrorMessage({ fieldName: fieldName, rule: "min" })
					.replace("{minSize}", minValue.toString())
					.replace("{value}", v.toString());
			}
		} else if (typeof value === "string") {
			const v = value.length;
			if (v < minValue) {
				return validatorErrorMessage({ fieldName: fieldName, rule: "min" })
					.replace("{minSize}", minValue.toString())
					.replace("{value}", v.toString());
			}
		}
	},

	max({ value, fieldName }: BaseValidatorRuleParam, maxValue: number) {
		if (Number.isFinite(Number(value))) {
			const v = parseInt(value);
			if (v > maxValue) {
				return validatorErrorMessage({ fieldName: fieldName, rule: "max" })
					.replace("{maxSize}", maxValue.toString())
					.replace("{value}", v.toString());
			}
		} else if (typeof value === "string") {
			const v = value.length;
			if (v > maxValue) {
				return validatorErrorMessage({ fieldName: fieldName, rule: "max" })
					.replace("{maxSize}", maxValue.toString())
					.replace("{value}", v.toString());
			}
		}
	},

	ipv4({ value, fieldName }: BaseValidatorRuleParam) {
		const IP_V4_REGEX =
			"(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)(?:\\.(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)){3}";

		const isValidIpV4 = new RegExp(`^${IP_V4_REGEX}$`).test(value.toString());

		if (!isValidIpV4) {
			return validatorErrorMessage({ fieldName: fieldName, rule: "ipv4" });
		}
	},

	ipv6({ value, fieldName }: BaseValidatorRuleParam) {
		const IP_V6_REGEX = "((([0-9a-fA-F]){1,4}):){7}([0-9a-fA-F]){1,4}";

		const isValidIpV6 = new RegExp(`^${IP_V6_REGEX}$`).test(value.toString());

		if (!isValidIpV6) {
			return validatorErrorMessage({ fieldName: fieldName, rule: "ipv6" });
		}
	},

	accepted({ value, fieldName }: BaseValidatorRuleParam) {
		if (!["yes", "on", 1, true].includes(value)) {
			return validatorErrorMessage({ fieldName: fieldName, rule: "accepted" });
		}
	},

	declined({ value, fieldName }: BaseValidatorRuleParam) {
		if (!["no", "off", 0, false].includes(value)) {
			return validatorErrorMessage({ fieldName: fieldName, rule: "declined" });
		}
	},
};
