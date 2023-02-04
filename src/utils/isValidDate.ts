interface DateValues {
	m: number;
	d: number;
	y: number;
	[key: string]: number;
}

export default (dateString: string, dateFormat?: string): boolean => {
	let date: Date;

	if (dateFormat) date = parseDate(dateString, dateFormat.toLowerCase());
	else date = new Date(dateString);

	const isDate = isNaN(date.getTime());

	if (!dateFormat) return isDate;

	if (isDate) return false;

	const dateMatch = dateFormat.toLowerCase().match(/[mdy|dmy]+/g);
	const dateStringMatch = dateString.split(/[^\d]+/);

	if (dateMatch === null || dateMatch.length !== dateStringMatch.length) {
		return false;
	}

	const dateValues: DateValues = {
		m: date.getMonth() + 1,
		d: date.getDate(),
		y: date.getFullYear(),
	};

	return dateMatch.every(
		(format, index) => dateValues[format[0]] === +dateStringMatch[index]
	);
};

function parseDate(input: string, format: string): Date {
	format = format || "yyyy-mm-dd"; // default format
	const parts = input.match(/(\d+)/g);

	if (!parts) return new Date();

	const fmt: { [key: string]: number } = {};
	let i = 0;

	// extract date-part indexes from the format
	format.replace(/(yyyy|dd|mm)/g, (_, part) => {
		fmt[part] = i++;
		return ""; //to shut ts error, replace methods wants string as return but we just need to return void
	});

	return new Date(
		+parts[fmt["yyyy"]],
		+parts[fmt["mm"]] - 1,
		+parts[fmt["dd"]]
	);
}
