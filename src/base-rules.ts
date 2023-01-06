/* eslint-disable @typescript-eslint/no-explicit-any */
import { validatorErrorMessage } from "./validator-error-message";

export const baseValidatorRule = {
	required(value: any) {
		if (value === undefined || value === "" || value === null) {
			return validatorErrorMessage["required"];
		}
	},

	array(value: any) {
		if (!(value instanceof Array)) {
			return validatorErrorMessage["array"];
		}
	},

	integer(value: any) {
		if (!Number.isInteger(value)) {
			return validatorErrorMessage["integer"];
		}
	},

	numeric(value: any) {
		if (typeof value !== "number") {
			return validatorErrorMessage["numeric"];
		}
	},

	string(value: any) {
		if (typeof value !== "string") {
			return validatorErrorMessage["string"];
		}
	},

	boolean(value: any) {
		if (typeof value !== "boolean") {
			return validatorErrorMessage["boolean"];
		}
	},

	allowed(value: any, ...args: any[]) {
		if (!args.includes(value)) {
			return validatorErrorMessage["allowed"].replace(
				"{args}",
				args.join(", ")
			);
		}
	},

	// TODO: add test
	/*
	image(value: any) {
		if (!(value instanceof File)) {
			return validatorErrorMessage["image"];
		}

		// Check if the file is an image by checking the MIME type
		if (!value.type.startsWith("image/")) {
			return validatorErrorMessage["image"];
		}
	},

	size(value: any, minSize: number, maxSize: number) {
		if (!(value instanceof File)) {
			return "The field must be an instanceof File";
		}

		// Check if the file size is within the specified range
		if (value.size < minSize || value.size > maxSize) {
			return validatorErrorMessage["image"]
				.replace("{minSize}", minSize.toString())
				.replace("{maxSize}", maxSize.toString());
		}
	},
	*/
	// END TODO: add test

	email(value: any) {
		const emailRegex =
			/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
		if (!emailRegex.test(value)) {
			return validatorErrorMessage["email"];
		}
	},

	min(value: any, minValue: number) {
		if (Number.isFinite(Number(value))) {
			const v = parseInt(value);
			if (v < minValue) {
				return validatorErrorMessage["min"]
					.replace("{minSize}", minValue.toString())
					.replace("{value}", v.toString());
			}
		} else if (typeof value === "string") {
			const v = value.length;
			if (v < minValue) {
				return validatorErrorMessage["min"]
					.replace("{minSize}", minValue.toString())
					.replace("{value}", v.toString());
			}
		}
	},

	max(value: any, maxValue: number) {
		if (Number.isFinite(Number(value))) {
			const v = parseInt(value);
			if (v > maxValue) {
				return validatorErrorMessage["max"]
					.replace("{maxSize}", maxValue.toString())
					.replace("{value}", v.toString());
			}
		} else if (typeof value === "string") {
			const v = value.length;
			if (v > maxValue) {
				return validatorErrorMessage["max"]
					.replace("{maxSize}", maxValue.toString())
					.replace("{value}", v.toString());
			}
		}
	},

	ipv4(value: any) {
		const IP_V4_REGEX =
			"(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)(?:\\.(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)){3}";

		const isValidIpV4 = new RegExp(`^${IP_V4_REGEX}$`).test(value.toString());

		if (!isValidIpV4) {
			return validatorErrorMessage["ipv4"];
		}
	},

	ipV6(value: any) {
		const IP_V6_REGEX = "((([0-9a-fA-F]){1,4}):){7}([0-9a-fA-F]){1,4}";

		const isValidIpV6 = new RegExp(`^${IP_V6_REGEX}$`).test(value.toString());

		if (!isValidIpV6) {
			return validatorErrorMessage["ipV6"];
		}
	},
};
