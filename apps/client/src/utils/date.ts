export const getNow = () =>
	new Intl.DateTimeFormat('en-UK', {
		dateStyle: 'short',
	}).format(new Date())
