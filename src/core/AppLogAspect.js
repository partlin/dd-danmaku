/**
 * 控制台日志切面
 * 用于高级设置中的控制台日志展示
 * 从 ede.js 迁移，未修改原有实现逻辑
 */

export class AppLogAspect {
    constructor() {
        this.initialized = false;
        this.originalError = console.error;
        this.originalWarn = console.warn;
        this.originalLog = console.log;
        this.originalOnerror = null;
        this.value = '';
        this.listeners = [];
        this.ERROR = { text: 'ERROR', emoji: '❗️' };
        this.WARN = { text: 'WARN', emoji: '⚠️' };
        this.INFO = { text: 'INFO', emoji: '❕' };
    }

    init() {
        if (this.initialized) {
            return this;
        }
        console.error = (...args) => {
            this.originalError.apply(console, args);
            this.value += this.format(this.ERROR, args);
            this.notifyListeners();
        };
        console.warn = (...args) => {
            this.originalWarn.apply(console, args);
            this.value += this.format(this.WARN, args);
            this.notifyListeners();
        };
        console.log = (...args) => {
            this.originalLog.apply(console, args);
            this.value += this.format(this.INFO, args);
            this.notifyListeners();
        };
        this.originalOnerror = window.onerror;
        window.onerror = (...args) => {
            console.error(args);
            if (typeof this.originalOnerror === 'function') {
                this.originalOnerror(...args);
            }
        };
        this.initialized = true;
        return this;
    }

    destroy(clearValue = true) {
        if (this.initialized) {
            console.error = this.originalError;
            console.warn = this.originalWarn;
            console.log = this.originalLog;
            window.onerror = this.originalOnerror;
            if (clearValue) {
                this.value = '';
            }
            this.listeners = [];
            this.initialized = false;
        }
        return this;
    }

    format(level, args) {
        const emoji = level.emoji ? `[${level.emoji}] ` : '';
        return (
            `[${new Date(Date.now()).toLocaleString()}] [${level.text}] ${emoji}: ` +
            args
                .map((arg) =>
                    arg instanceof Error ? arg.message : typeof arg === 'string' ? arg : JSON.stringify(arg)
                )
                .join(' ') +
            '\n'
        );
    }

    on(valueChangedCallback) {
        if (
            valueChangedCallback.toString().includes('console.log') ||
            valueChangedCallback.toString().includes('console.error')
        ) {
            throw new Error('The callback function must not contain console.log or console.error to avoid infinite loops.');
        }
        this.listeners.push(() => valueChangedCallback(this.value));
    }

    notifyListeners() {
        this.listeners.forEach((listener) => listener());
    }

    clearValue() {
        this.value = '';
        this.notifyListeners();
    }
}
