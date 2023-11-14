import figlet from 'figlet';

export const renderTitle = () => {
	const text = figlet.textSync('Glue', {
		font: 'Small',
	});
	console.log(`\n${text}\n`);
};
