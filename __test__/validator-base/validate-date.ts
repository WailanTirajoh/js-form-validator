import { beforeEach, expect, it } from "vitest";
import Validator from "../../src/validator";
import { validatorErrorMessage } from "../../src/validator-error-message";

export default () => {
	let validator: Validator;

	beforeEach(() => {
		validator = new Validator({
			formData: {},
		});
	});

	const testDateFormats = [
		{ date: "02/04/2023", format: "MM/DD/YYYY" },
		{ date: "04/02/2023", format: "DD/MM/YYYY" },
		{ date: "2023/02/04", format: "YYYY/MM/DD" },
		{ date: "2023-02-04", format: "YYYY-MM-DD" },
		{ date: "02-04-2023", format: "MM-DD-YYYY" },
		{ date: "04-02-2023", format: "DD-MM-YYYY" },
		{ date: "02.04.2023", format: "MM.DD.YYYY" },
		{ date: "04.02.2023", format: "DD.MM.YYYY" },
		{ date: "02 04 2023", format: "MM DD YYYY" },
		{ date: "04 02 2023", format: "DD MM YYYY" },
	];

	testDateFormats.forEach(async (testDateFormat) => {
		it(`validate date strings and formats that is pass [${testDateFormat.format}]`, async () => {
			validator
				.setFormData({
					value: testDateFormat.date,
				})
				.setRules({
					value: [`date:${testDateFormat.format}`],
				});

			await validator.validate();

			expect(validator.pass()).toBeTruthy();
		});
	});

	const invalidTestDateFormats = [
		{ date: "2021-13-02", format: "MM/DD/YYYY" },
		{ date: "2021/13/02", format: "MM/DD/YYYY" },
		{ date: "02-Jan-20210", format: "DD/MM/YYYY" },
		{ date: "2021-13-02", format: "YYYY/MM/DD" },
	];

	invalidTestDateFormats.forEach(async (testDateFormat) => {
		it(`validate date strings and formats that is fail [${testDateFormat.format}]`, async () => {
			validator
				.setFormData({
					value: testDateFormat.date,
				})
				.setRules({
					value: [`date:${testDateFormat.format}`],
				});

			await validator.validate();

			expect(validator.pass()).toBeFalsy();
			const error = validator.getErrorBag();
			expect(error.value).include(
				validatorErrorMessage({
					fieldName: "value",
					rule: "date",
				})
			);
		});
	});

	const testDates = [
		{ date: "02/04/2023" },
		{ date: "04/02/2023" },
		{ date: "2023/02/04" },
		{ date: "2023-02-04" },
		{ date: "02-04-2023" },
		{ date: "04-02-2023" },
		{ date: "02.04.2023" },
		{ date: "04.02.2023" },
		{ date: "02 04 2023" },
		{ date: "04 02 2023" },
	];

	testDates.forEach(async (testDate) => {
		it(`validate date strings that is pass [${testDate.date}]`, async () => {
			validator
				.setFormData({
					value: testDate.date,
				})
				.setRules({
					value: ["date"],
				});

			await validator.validate();

			expect(validator.pass()).toBeTruthy();
		});
	});
};
