export function consoleAddNameAsPrefix(name: string, color: string) {
    const newConsole : Console = Object.create(console);
    newConsole.log = console.log.bind(console, `%c[${name}]`, `color: ${color}`);
    newConsole.warn = console.warn.bind(console, `[${name}]`);
    newConsole.error = console.error.bind(console, `[${name}]`);
    newConsole.time = (label?: string) => console.time(`[${name}] ${label}`);
    newConsole.timeEnd = (label?: string) => console.timeEnd(`[${name}] ${label}`);
  
    return newConsole;
}