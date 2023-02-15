import { beforeEach, expect, it } from "vitest";
import Validator from "../../src/validator";
import { validatorErrorMessage } from "../../src/validator-error-message";

export default () => {
	let validator: Validator;

	beforeEach(() => {
		validator = new Validator();
	});

	it("validate between field with expected value", async () => {
		validator
			.setFormData({
				pass1: 1,
				pass2: "awesomepass",
			})
			.setRules({
				pass1: ["between:1,3"],
				pass2: ["between:10,14"],
			});
		await validator.validate();
		expect(validator.pass()).toBeTruthy();
	});

	it("validate between field with fail value", async () => {
		const failA = "stringlengthmorethan3";
		validator
			.setFormData({
				failA: failA,
				failB: 4,
			})
			.setRules({
				failA: ["between:1,3"],
				failB: ["between:1,3"],
			});
		await validator.validate();
		expect(validator.pass()).toBeFalsy();

		const error = validator.getErrorBag();
		const failALength = failA.length;
		expect(error.failA).include(
			validatorErrorMessage({
				fieldName: "failA",
				rule: "between",
			})
				.replace("{min}", "1")
				.replace("{max}", "3")
				.replace("{value}", failALength.toString())
		);
		expect(error.failB).include(
			validatorErrorMessage({
				fieldName: "failB",
				rule: "between",
			})
				.replace("{min}", "1")
				.replace("{max}", "3")
				.replace("{value}", "4")
		);
	});
};
