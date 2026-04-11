import process from "process";
import winston, { Logform, Logger } from "winston";
import { notNil } from "./predicates.utils.js";

const LEVEL = Symbol.for("level");
const SPLAT = Symbol.for("splat");

const concatNamespaces = (...nss: (string | string[])[]): string =>
    nss
        .filter(Boolean)
        .flatMap((i) => (Array.isArray(i) ? i : [i]))
        .join(".");

const withNamespace = winston.format((info, opts?: { namespace: string } | unknown) => {
    const namespace =
        typeof opts === "object" && opts !== null && "namespace" in opts
            ? (opts as { namespace: string }).namespace
            : "";

    info.namespace = concatNamespaces(
        process.env.APP_NAME || "",
        namespace,
        (info.namespace as string) || ""
    );
    return info;
});

const extractErrors = winston.format((info, _opts) => {
    if (info["stack"] && info["name"]) {
        return {
            [LEVEL]: info[LEVEL],
            [SPLAT]: [info["name"], info["message"], info["stack"]],
            level: info.level,
            message: "%s: %s\n%s"
        };
    }
    return info;
});

const baseFormat: Logform.Format = winston.format.combine(
    extractErrors(),
    winston.format.splat(),
    withNamespace(),
    winston.format.metadata({
        key: "context",
        fillExcept: ["namespace", "level", "message"]
    }),
    winston.format.timestamp()
);

const consoleFormat: Logform.Format = winston.format.combine(
    baseFormat,
    winston.format.printf(({ timestamp, namespace, level, message, context = {} }) => {
        const contexts = Object.entries(context ?? {})
            .filter(([_, v]) => notNil(v))
            .map(([k, v]) => (v === true ? `[${k}]` : `[${k}: ${v}]`))
            .join("");
        return `[${timestamp}][${namespace}][${level}]${contexts} ${message}`;
    }),
    winston.format.colorize({ all: process.env.STAGE === "development" })
);

function makeLoggingFacade(logger: Logger): Logging {
    return {
        child: (...args) => makeLoggingFacade(logger.child(...args)),

        emerg: logger.emerg.bind(logger),
        alert: logger.alert.bind(logger),
        crit: logger.crit.bind(logger),
        error: logger.error.bind(logger),
        warning: logger.warning.bind(logger),
        notice: logger.notice.bind(logger),
        info: logger.info.bind(logger),
        debug: logger.debug.bind(logger)
    };
}

export default makeLoggingFacade(
    winston.createLogger({
        levels: winston.config.syslog.levels,
        level: process.env.LOG_LEVEL,
        transports: [new winston.transports.Console({ format: consoleFormat })]
    })
);

type LogFn = <Interpolations extends unknown[], Contexts extends Record<string, unknown>[]>(
    message: string,
    ...args: readonly [...Interpolations, ...Contexts]
) => void;

interface Logging {
    child: (meta: { namespace: string; [context: string]: any }) => Logging;

    emerg: LogFn;
    alert: LogFn;
    crit: LogFn;
    error: LogFn;
    warning: LogFn;
    notice: LogFn;
    info: LogFn;
    debug: LogFn;
}
