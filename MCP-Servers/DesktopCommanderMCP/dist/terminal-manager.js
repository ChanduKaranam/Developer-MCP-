import { spawn } from 'child_process';
import { DEFAULT_COMMAND_TIMEOUT } from './config.js';
import { configManager } from './config-manager.js';
import { capture } from "./utils/capture.js";
import { analyzeProcessState } from './utils/process-detection.js';
export class TerminalManager {
    constructor() {
        this.sessions = new Map();
        this.completedSessions = new Map();
    }
    /**
     * Send input to a running process
     * @param pid Process ID
     * @param input Text to send to the process
     * @returns Whether input was successfully sent
     */
    sendInputToProcess(pid, input) {
        const session = this.sessions.get(pid);
        if (!session) {
            return false;
        }
        try {
            if (session.process.stdin && !session.process.stdin.destroyed) {
                // Ensure input ends with a newline for most REPLs
                const inputWithNewline = input.endsWith('\n') ? input : input + '\n';
                session.process.stdin.write(inputWithNewline);
                return true;
            }
            return false;
        }
        catch (error) {
            console.error(`Error sending input to process ${pid}:`, error);
            return false;
        }
    }
    async executeCommand(command, timeoutMs = DEFAULT_COMMAND_TIMEOUT, shell) {
        // Get the shell from config if not specified
        let shellToUse = shell;
        if (!shellToUse) {
            try {
                const config = await configManager.getConfig();
                shellToUse = config.defaultShell || true;
            }
            catch (error) {
                // If there's an error getting the config, fall back to default
                shellToUse = true;
            }
        }
        // For REPL interactions, we need to ensure stdin, stdout, and stderr are properly configured
        // Note: No special stdio options needed here, Node.js handles pipes by default
        // Enhance SSH commands automatically
        let enhancedCommand = command;
        if (command.trim().startsWith('ssh ') && !command.includes(' -t')) {
            enhancedCommand = command.replace(/^ssh /, 'ssh -t ');
            console.log(`Enhanced SSH command: ${enhancedCommand}`);
        }
        const spawnOptions = {
            shell: shellToUse,
            env: {
                ...process.env,
                TERM: 'xterm-256color' // Better terminal compatibility
            }
        };
        // Spawn the process with an empty array of arguments and our options
        const childProcess = spawn(enhancedCommand, [], spawnOptions);
        let output = '';
        // Ensure childProcess.pid is defined before proceeding
        if (!childProcess.pid) {
            // Return a consistent error object instead of throwing
            return {
                pid: -1, // Use -1 to indicate an error state
                output: 'Error: Failed to get process ID. The command could not be executed.',
                isBlocked: false
            };
        }
        const session = {
            pid: childProcess.pid,
            process: childProcess,
            lastOutput: '',
            isBlocked: false,
            startTime: new Date()
        };
        this.sessions.set(childProcess.pid, session);
        return new Promise((resolve) => {
            let resolved = false;
            let periodicCheck = null;
            // Quick prompt patterns for immediate detection
            const quickPromptPatterns = />>>\s*$|>\s*$|\$\s*$|#\s*$/;
            const resolveOnce = (result) => {
                if (resolved)
                    return;
                resolved = true;
                if (periodicCheck)
                    clearInterval(periodicCheck);
                resolve(result);
            };
            childProcess.stdout.on('data', (data) => {
                const text = data.toString();
                output += text;
                session.lastOutput += text;
                // Immediate check for obvious prompts
                if (quickPromptPatterns.test(text)) {
                    session.isBlocked = true;
                    resolveOnce({
                        pid: childProcess.pid,
                        output,
                        isBlocked: true
                    });
                }
            });
            childProcess.stderr.on('data', (data) => {
                const text = data.toString();
                output += text;
                session.lastOutput += text;
            });
            // Periodic comprehensive check every 100ms
            periodicCheck = setInterval(() => {
                if (output.trim()) {
                    const processState = analyzeProcessState(output, childProcess.pid);
                    if (processState.isWaitingForInput) {
                        session.isBlocked = true;
                        resolveOnce({
                            pid: childProcess.pid,
                            output,
                            isBlocked: true
                        });
                    }
                }
            }, 100);
            // Timeout fallback
            setTimeout(() => {
                session.isBlocked = true;
                resolveOnce({
                    pid: childProcess.pid,
                    output,
                    isBlocked: true
                });
            }, timeoutMs);
            childProcess.on('exit', (code) => {
                if (childProcess.pid) {
                    // Store completed session before removing active session
                    this.completedSessions.set(childProcess.pid, {
                        pid: childProcess.pid,
                        output: output + session.lastOutput, // Combine all output
                        exitCode: code,
                        startTime: session.startTime,
                        endTime: new Date()
                    });
                    // Keep only last 100 completed sessions
                    if (this.completedSessions.size > 100) {
                        const oldestKey = Array.from(this.completedSessions.keys())[0];
                        this.completedSessions.delete(oldestKey);
                    }
                    this.sessions.delete(childProcess.pid);
                }
                resolveOnce({
                    pid: childProcess.pid,
                    output,
                    isBlocked: false
                });
            });
        });
    }
    getNewOutput(pid) {
        // First check active sessions
        const session = this.sessions.get(pid);
        if (session) {
            const output = session.lastOutput;
            session.lastOutput = '';
            return output;
        }
        // Then check completed sessions
        const completedSession = this.completedSessions.get(pid);
        if (completedSession) {
            // Format completion message with exit code and runtime
            const runtime = (completedSession.endTime.getTime() - completedSession.startTime.getTime()) / 1000;
            return `Process completed with exit code ${completedSession.exitCode}\nRuntime: ${runtime}s\nFinal output:\n${completedSession.output}`;
        }
        return null;
    }
    /**
   * Get a session by PID
   * @param pid Process ID
   * @returns The session or undefined if not found
   */
    getSession(pid) {
        return this.sessions.get(pid);
    }
    forceTerminate(pid) {
        const session = this.sessions.get(pid);
        if (!session) {
            return false;
        }
        try {
            session.process.kill('SIGINT');
            setTimeout(() => {
                if (this.sessions.has(pid)) {
                    session.process.kill('SIGKILL');
                }
            }, 1000);
            return true;
        }
        catch (error) {
            // Convert error to string, handling both Error objects and other types
            const errorMessage = error instanceof Error ? error.message : String(error);
            capture('server_request_error', { error: errorMessage, message: `Failed to terminate process ${pid}:` });
            return false;
        }
    }
    listActiveSessions() {
        const now = new Date();
        return Array.from(this.sessions.values()).map(session => ({
            pid: session.pid,
            isBlocked: session.isBlocked,
            runtime: now.getTime() - session.startTime.getTime()
        }));
    }
    listCompletedSessions() {
        return Array.from(this.completedSessions.values());
    }
}
export const terminalManager = new TerminalManager();
