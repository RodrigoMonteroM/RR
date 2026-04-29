const c = {
    reset: "\x1b[0m",
    bold: "\x1b[1m",
    dim: "\x1b[2m",

    // Colors
    green: "\x1b[32m",
    yellow: "\x1b[33m",
    red: "\x1b[31m",
    cyan: "\x1b[36m",
    magenta: "\x1b[35m",
    blue: "\x1b[34m",
    white: "\x1b[37m",
    gray: "\x1b[90m",

    // Bright
    brightGreen: "\x1b[92m",
    brightYellow: "\x1b[93m",
    brightRed: "\x1b[91m",
    brightCyan: "\x1b[96m",
    brightBlue: "\x1b[94m",
    brightMagenta: "\x1b[95m",
    brightWhite: "\x1b[97m",
};

const timestamp = () =>
    `${c.gray}${new Date().toISOString().replace("T", " ").slice(0, 19)}${c.reset}`;

const METHOD_COLORS: Record<string, string> = {
    GET: `${c.bold}${c.brightBlue}`,
    POST: `${c.bold}${c.brightGreen}`,
    PUT: `${c.bold}${c.brightYellow}`,
    PATCH: `${c.bold}${c.brightMagenta}`,
    DELETE: `${c.bold}${c.brightRed}`,
};

const STATUS_COLOR = (status: number): string => {
    if (status < 300) return c.brightGreen;
    if (status < 400) return c.brightYellow;
    if (status < 500) return c.yellow;
    return c.brightRed;
};

export const logger = {
    /** Servidor arrancando, rutas montadas */
    server: (msg: string) =>
        console.log(`${timestamp()} ${c.bold}${c.brightGreen}🚀 SERVER${c.reset}  ${c.brightWhite}${msg}${c.reset}`),

    /** Operaciones normales de flujo */
    info: (msg: string) =>
        console.log(`${timestamp()} ${c.bold}${c.brightCyan}ℹ  INFO${c.reset}    ${msg}`),

    /** Acción completada con éxito */
    success: (msg: string) =>
        console.log(`${timestamp()} ${c.bold}${c.brightGreen}✔  OK${c.reset}      ${c.brightGreen}${msg}${c.reset}`),

    /** Advertencia — no es error pero hay que mirarla */
    warn: (msg: string) =>
        console.warn(`${timestamp()} ${c.bold}${c.brightYellow}⚠  WARN${c.reset}    ${c.brightYellow}${msg}${c.reset}`),

    /** Error — algo salió mal */
    error: (msg: string, err?: unknown) => {
        console.error(`${timestamp()} ${c.bold}${c.brightRed}✖  ERROR${c.reset}   ${c.brightRed}${msg}${c.reset}`);
        if (err) console.error(`${c.dim}${String(err)}${c.reset}`);
    },

    /** Queries / operaciones de base de datos */
    db: (msg: string) =>
        console.log(`${timestamp()} ${c.bold}${c.magenta}◈  DB${c.reset}      ${c.magenta}${msg}${c.reset}`),

    /** Request HTTP entrante — usado por el middleware */
    request: (method: string, path: string, status: number, ms: number) => {
        const methodColor = METHOD_COLORS[method] ?? c.white;
        const statusColor = STATUS_COLOR(status);
        const methodPadded = method.padEnd(6);
        const msPadded = `${ms}ms`.padStart(6);
        console.log(
            `${timestamp()} ${methodColor}${methodPadded}${c.reset} ${c.brightWhite}${path}${c.reset} ` +
            `${statusColor}${status}${c.reset} ${c.gray}${msPadded}${c.reset}`
        );
    },
};
