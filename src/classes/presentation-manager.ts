import * as chalk from 'chalk';

export class PresentationManager {
    public static printPresentation() {
        console.log(chalk.green('Hello '), chalk.green.bold('ESQUIVEL NESTOR GABRIEL!'));
        console.log('');
        console.log(chalk.green('I\'m make this to make this more spicy :D, I hope you like this!!'));
        console.log(chalk.cyan('Enjoy!'));
        console.log();
    }

    public static separetor() {
        console.log(chalk.red('----------------------------------------------------'));
    }
}