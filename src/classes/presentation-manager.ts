import * as chalk from 'chalk';

export class PresentationManager {
    public static printPresentation() {
        console.log('');
        console.log(chalk.green('By Rodrigo Alcorta.'));
        console.log(chalk.cyan('Enjoy!'));
        console.log();
    }

    public static separetor() {
        console.log(chalk.red('----------------------------------------------------'));
    }
}
