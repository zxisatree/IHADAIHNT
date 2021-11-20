function consoleAddNameAsPrefix(name, color) {
    const newConsole = Object.create(console);
    newConsole.log = console.log.bind(console, `%c[${name}]`, `color: ${color}`);
    newConsole.warn = console.warn.bind(console, `[${name}]`);
    newConsole.error = console.error.bind(console, `[${name}]`);
    newConsole.time = (label) => console.time(`[${name}] ${label}`);
    newConsole.timeEnd = (label) => console.timeEnd(`[${name}] ${label}`);
  
    return newConsole;
  }