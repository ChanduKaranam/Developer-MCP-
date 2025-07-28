import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import process from "node:process";
/**
 * Enhanced StdioServerTransport that wraps console output in valid JSON-RPC structures
 * instead of filtering them out. This prevents crashes while maintaining debug visibility.
 */
export class FilteredStdioServerTransport extends StdioServerTransport {
    constructor() {
        super();
        // Store original methods
        this.originalConsole = {
            log: console.log,
            warn: console.warn,
            error: console.error,
            debug: console.debug,
            info: console.info,
        };
        this.originalStdoutWrite = process.stdout.write;
        // Setup console redirection
        this.setupConsoleRedirection();
        // Setup stdout filtering for any other output
        this.setupStdoutFiltering();
        // Log initialization to stderr to avoid polluting the JSON stream
        process.stderr.write(`[desktop-commander] Enhanced FilteredStdioServerTransport initialized\n`);
    }
    setupConsoleRedirection() {
        console.log = (...args) => {
            this.sendLogNotification("info", args);
        };
        console.info = (...args) => {
            this.sendLogNotification("info", args);
        };
        console.warn = (...args) => {
            this.sendLogNotification("warning", args);
        };
        console.error = (...args) => {
            this.sendLogNotification("error", args);
        };
        console.debug = (...args) => {
            this.sendLogNotification("debug", args);
        };
    }
    setupStdoutFiltering() {
        process.stdout.write = (buffer, encoding, callback) => {
            // Handle different call signatures
            if (typeof buffer === 'string') {
                const trimmed = buffer.trim();
                // Check if this looks like a valid JSON-RPC message
                if (trimmed.startsWith('{') && (trimmed.includes('"jsonrpc"') ||
                    trimmed.includes('"method"') ||
                    trimmed.includes('"id"'))) {
                    // This looks like a valid JSON-RPC message, allow it
                    return this.originalStdoutWrite.call(process.stdout, buffer, encoding, callback);
                }
                else if (trimmed.length > 0) {
                    // Non-JSON-RPC output, wrap it in a log notification
                    this.sendLogNotification("info", [buffer.replace(/\n$/, '')]);
                    if (callback)
                        callback();
                    return true;
                }
            }
            // For non-string buffers or empty strings, let them through
            return this.originalStdoutWrite.call(process.stdout, buffer, encoding, callback);
        };
    }
    sendLogNotification(level, args) {
        try {
            // For data, we can send structured data or string according to MCP spec
            let data;
            if (args.length === 1 && typeof args[0] === 'object' && args[0] !== null) {
                // Single object - send as structured data
                data = args[0];
            }
            else {
                // Multiple args or primitives - convert to string
                data = args.map(arg => {
                    if (typeof arg === 'object') {
                        try {
                            return JSON.stringify(arg, null, 2);
                        }
                        catch {
                            return String(arg);
                        }
                    }
                    return String(arg);
                }).join(' ');
            }
            const notification = {
                jsonrpc: "2.0",
                method: "notifications/message",
                params: {
                    level: level,
                    logger: "desktop-commander",
                    data: data
                }
            };
            // Send as valid JSON-RPC notification
            this.originalStdoutWrite.call(process.stdout, JSON.stringify(notification) + '\n');
        }
        catch (error) {
            // Fallback to stderr if JSON serialization fails
            process.stderr.write(`[${level.toUpperCase()}] ${args.join(' ')}\n`);
        }
    }
    /**
     * Public method to send log notifications from anywhere in the application
     */
    sendLog(level, message, data) {
        try {
            const notification = {
                jsonrpc: "2.0",
                method: "notifications/message",
                params: {
                    level: level,
                    logger: "desktop-commander",
                    data: data ? { message, ...data } : message
                }
            };
            this.originalStdoutWrite.call(process.stdout, JSON.stringify(notification) + '\n');
        }
        catch (error) {
            process.stderr.write(`[${level.toUpperCase()}] ${message}\n`);
        }
    }
    /**
     * Send a progress notification (useful for long-running operations)
     */
    sendProgress(token, value, total) {
        try {
            const notification = {
                jsonrpc: "2.0",
                method: "notifications/progress",
                params: {
                    progressToken: token,
                    value: value,
                    ...(total && { total })
                }
            };
            this.originalStdoutWrite.call(process.stdout, JSON.stringify(notification) + '\n');
        }
        catch (error) {
            process.stderr.write(`[PROGRESS] ${token}: ${value}${total ? `/${total}` : ''}\n`);
        }
    }
    /**
     * Send a custom notification with any method name
     */
    sendCustomNotification(method, params) {
        try {
            const notification = {
                jsonrpc: "2.0",
                method: method,
                params: params
            };
            this.originalStdoutWrite.call(process.stdout, JSON.stringify(notification) + '\n');
        }
        catch (error) {
            process.stderr.write(`[NOTIFICATION] ${method}: ${JSON.stringify(params)}\n`);
        }
    }
    /**
     * Cleanup method to restore original console methods if needed
     */
    cleanup() {
        if (this.originalConsole) {
            console.log = this.originalConsole.log;
            console.warn = this.originalConsole.warn;
            console.error = this.originalConsole.error;
            console.debug = this.originalConsole.debug;
            console.info = this.originalConsole.info;
        }
        if (this.originalStdoutWrite) {
            process.stdout.write = this.originalStdoutWrite;
        }
    }
}
