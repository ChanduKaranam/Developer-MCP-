import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
/**
 * Enhanced StdioServerTransport that wraps console output in valid JSON-RPC structures
 * instead of filtering them out. This prevents crashes while maintaining debug visibility.
 */
export declare class FilteredStdioServerTransport extends StdioServerTransport {
    private originalConsole;
    private originalStdoutWrite;
    constructor();
    private setupConsoleRedirection;
    private setupStdoutFiltering;
    private sendLogNotification;
    /**
     * Public method to send log notifications from anywhere in the application
     */
    sendLog(level: "emergency" | "alert" | "critical" | "error" | "warning" | "notice" | "info" | "debug", message: string, data?: any): void;
    /**
     * Send a progress notification (useful for long-running operations)
     */
    sendProgress(token: string, value: number, total?: number): void;
    /**
     * Send a custom notification with any method name
     */
    sendCustomNotification(method: string, params: any): void;
    /**
     * Cleanup method to restore original console methods if needed
     */
    cleanup(): void;
}
