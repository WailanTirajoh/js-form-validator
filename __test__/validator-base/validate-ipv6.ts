import { it, expect, beforeEach } from "vitest";
import Validator from "../../src/validator";
import { validatorErrorMessage } from "../../src/validator-error-message";

export default () => {
	let validator: Validator;

	beforeEach(() => {
		validator = new Validator({
			formData: {},
		});
	});

	it("validate ip address v6 that pass", async () => {
		const IP_ADDRESS_V6 = "2001:0db8:85a3:0000:0000:8a2e:0370:7334";
		validator
			.setFormData({
				ipv6: IP_ADDRESS_V6,
			})
			.setRules({
				ipv6: ["ipv6"],
			});

		await validator.validate();

		expect(validator.pass()).toBeTruthy();
	});

	it("validate ip address v6 that fail", async () => {
		const IP_ADDRESS_V6 = "192.168.1.1";
		validator
			.setFormData({
				ipv6: IP_ADDRESS_V6,
			})
			.setRules({
				ipv6: ["ipv6"],
			});

		await validator.validate();

		expect(validator.pass()).toBeFalsy();

		const error = validator.getErrorBag();
		const errorMessage = validatorErrorMessage["ipv6"];

		expect(error.ipv6).include(errorMessage);
	});
};
