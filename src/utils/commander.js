import { Command } from "commander";

const program = new Command

program
    .option('--mode <mode>', 'Mode es el tipo de ejecución de nuestra App', 'development')
    .parse()

export default program