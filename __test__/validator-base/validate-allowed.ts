import { it, expect, beforeEach } from "vitest";
import Validator from "../../src/validator";
import { validatorErrorMessage } from "../../src/validator-error-message";

export default () => {
	let validator: Validator;

	beforeEach(() => {
		validator = new Validator();
	});

	it("validate allowed field that pass", async () => {
		validator
			.setFormData({
				jobs: [
					{
						status: "started",
					},
					{
						status: "started",
					},
					{
						status: "ready",
					},
				],
			})
			.setRules({
				["jobs.*.status"]: ["allowed:started,ready,finished"],
			});
		await validator.validate();
		expect(validator.pass()).toBeTruthy();
	});

	it("validate allowed field that fail", async () => {
		validator
			.setFormData({
				jobs: [
					{
						status: "started",
					},
					{
						status: "started",
					},
					{
						status: "fail",
					},
					{
						status: "ready",
					},
				],
			})
			.setRules({
				["jobs.*.status"]: ["allowed:started,ready,finished"],
				pass2: ["boolean"],
			});
		await validator.validate();
		expect(validator.pass()).toBeFalsy();
		const error = validator.getErrorBag();
		expect(error["jobs.2.status"]).include(
			validatorErrorMessage({
				fieldName: "jobs.2.status",
				rule: "allowed",
			}).replace("{args}", ["started", "ready", "finished"].join(", "))
		);
	});
};
