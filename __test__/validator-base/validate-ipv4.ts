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

	it("validate ip address v4 that pass", async () => {
		const IP_ADDRESS_V4 = "192.168.5.68";
		validator
			.setFormData({
				ipV4: IP_ADDRESS_V4,
			})
			.setRules({
				ipV4: ["ipv4"],
			});

		await validator.validate();
		expect(validator.pass()).toBeTruthy();
	});

};
