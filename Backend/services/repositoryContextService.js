const fs = require("fs/promises");
const path = require("path");

const IGNORED_DIRECTORIES = new Set([
    ".git", ".next", ".nuxt", ".turbo", ".venv", "bin", "build", "coverage",
    "dist", "node_modules", "obj", "out", "output", "target", "vendor", "venv",
]);
const MEDIA_EXTENSIONS = new Set([
    ".aac", ".avi", ".avif", ".bmp", ".gif", ".heic", ".ico", ".jpeg", ".jpg",
    ".m4a", ".mkv", ".mov", ".mp3", ".mp4", ".ogg", ".pdf", ".png", ".svg",
    ".tif", ".tiff", ".wav", ".webm", ".webp",
]);
const BINARY_EXTENSIONS = new Set([
    ".7z", ".a", ".class", ".dll", ".dylib", ".exe", ".gz", ".jar", ".o", ".so",
    ".tar", ".woff", ".woff2", ".zip",
]);
const TEXT_EXTENSIONS = new Set([
    ".c", ".cc", ".cfg", ".conf", ".cpp", ".cs", ".css", ".csv", ".go", ".graphql",
    ".h", ".hpp", ".html", ".ini", ".java", ".js", ".json", ".jsx", ".kt", ".kts",
    ".less", ".lua", ".md", ".mjs", ".php", ".properties", ".py", ".rb", ".rs", ".sass",
    ".scss", ".sh", ".sql", ".svelte", ".toml", ".ts", ".tsx", ".txt", ".vue", ".xml",
    ".yaml", ".yml",
]);
const MANIFEST_NAMES = new Set([
    "build.gradle", "build.gradle.kts", "cargo.toml", "composer.json", "docker-compose.yml",
    "dockerfile", "gemfile", "go.mod", "go.sum", "package-lock.json", "package.json",
    "pnpm-lock.yaml", "pom.xml", "pyproject.toml", "requirements.txt", "settings.gradle",
    "settings.gradle.kts", "yarn.lock",
]);
const ROOT_TEXT_FILES = new Set(["license", "makefile", "readme"]);
const CONFIG_NAMES = new Set([
    ".babelrc", ".eslintrc", ".gitignore", ".prettierrc", "docker-compose.yml", "tsconfig.json",
    "vite.config.js", "vite.config.ts", "webpack.config.js", "webpack.config.ts",
]);
const ENTRY_FILE_NAMES = new Set([
    "app.js", "app.ts", "index.js", "index.ts", "main.js", "main.ts", "server.js", "server.ts",
]);

function getPositiveInteger(name, fallback) {
    const value = Number(process.env[name]);
    return Number.isSafeInteger(value) && value > 0 ? value : fallback;
}

function getContextLimits() {
    return {
        maxFileBytes: getPositiveInteger("REPOSITORY_MAX_FILE_BYTES", 256 * 1024),
        maxFileChars: getPositiveInteger("REPOSITORY_MAX_FILE_CHARS", 120_000),
        maxContextBytes: getPositiveInteger("REPOSITORY_MAX_CONTEXT_BYTES", 3 * 1024 * 1024),
        maxTotalContextBytes: getPositiveInteger("REPOSITORY_MAX_CONTEXT_TOTAL_BYTES", 4 * 1024 * 1024),
        maxContextFiles: getPositiveInteger("REPOSITORY_MAX_CONTEXT_FILES", 250),
        maxInventoryEntries: getPositiveInteger("REPOSITORY_MAX_INVENTORY_ENTRIES", 2_000),
        maxSkippedEntries: getPositiveInteger("REPOSITORY_MAX_SKIPPED_ENTRIES", 300),
        maxScannedFiles: getPositiveInteger("REPOSITORY_MAX_SCANNED_FILES", 20_000),
    };
}

function usesSensitiveName(name) {
    const lower = name.toLowerCase();
    return lower.startsWith(".env")
        || [".npmrc", ".pypirc", "credentials", "id_rsa", "known_hosts"].includes(lower)
        || lower.endsWith(".pem")
        || lower.endsWith(".key")
        || /credential|secret|private[._-]?key|token/.test(lower);
}

function isRelevantTextFile(name) {
    const lower = name.toLowerCase();
    return TEXT_EXTENSIONS.has(path.extname(lower))
        || MANIFEST_NAMES.has(lower)
        || ROOT_TEXT_FILES.has(lower)
        || lower.startsWith("readme.");
}

function getLanguage(extension) {
    const normalized = extension.replace(/^\./, "").toLowerCase();
    return normalized || "text";
}

function getPriority(relativePath) {
    const normalized = relativePath.toLowerCase();
    const name = path.posix.basename(normalized);
    const segments = normalized.split("/");

    if (MANIFEST_NAMES.has(name)) return 0;
    if (name === "readme" || name.startsWith("readme.") || segments.includes("docs") || segments.includes("documentation")) return 1;
    if (ENTRY_FILE_NAMES.has(name)) return 2;
    if (segments.some((segment) => ["api", "backend", "controllers", "routes", "server", "services"].includes(segment))) return 3;
    if (segments.some((segment) => ["src", "components", "pages", "frontend", "client"].includes(segment))) return 4;
    if (CONFIG_NAMES.has(name) || normalized.includes("config")) return 5;
    return 6;
}

async function appearsBinary(filePath) {
    const handle = await fs.open(filePath, "r");
    try {
        const buffer = Buffer.alloc(8_192);
        const { bytesRead } = await handle.read(buffer, 0, buffer.length, 0);
        return buffer.subarray(0, bytesRead).includes(0);
    } finally {
        await handle.close();
    }
}

function addSkipped(state, limits, entry) {
    state.skippedCount += 1;
    state.skippedByReason[entry.reason] = (state.skippedByReason[entry.reason] || 0) + 1;
    if (state.skipped.length < limits.maxSkippedEntries) state.skipped.push(entry);
    else state.skippedInventoryTruncated = true;
}

function addInventoryEntry(state, limits, entry) {
    if (state.files.length < limits.maxInventoryEntries) state.files.push(entry);
    else state.fileInventoryTruncated = true;
}

function addDirectoryEntry(state, limits, relativePath) {
    state.directoryCount += 1;
    if (state.directories.length < limits.maxInventoryEntries) state.directories.push(relativePath);
    else state.directoryInventoryTruncated = true;
}

function makeSkippedFile(relativePath, reason, stat, extension) {
    return {
        path: relativePath,
        reason,
        ...(typeof stat?.size === "number" ? { size: stat.size } : {}),
        ...(extension ? { extension } : {}),
    };
}

function truncateContent(content, maxChars) {
    if (content.length <= maxChars) return { content, truncated: false };
    const marker = "\n[Content truncated by Cortex context limit.]";
    return {
        content: `${content.slice(0, Math.max(0, maxChars - marker.length))}${marker}`.slice(0, maxChars),
        truncated: true,
    };
}

function redactSensitiveContent(content) {
    let redacted = false;
    let sanitized = content.replace(
        /((?:api[_-]?key|access[_-]?token|auth(?:orization)?|password|passwd|secret|client[_-]?secret|private[_-]?key)\s*["']?\s*[:=]\s*["'])([^"'\r\n]+)(["'])/gi,
        (match, prefix, value, suffix) => {
            redacted = true;
            return `${prefix}[REDACTED]${suffix}`;
        }
    );
    sanitized = sanitized.replace(/mongodb(?:\+srv)?:\/\/[^\s"'`]+/gi, () => {
        redacted = true;
        return "[REDACTED_DATABASE_URL]";
    });
    sanitized = sanitized.replace(/\b(?:gh[pousr]_[A-Za-z0-9_]{20,}|github_pat_[A-Za-z0-9_]{20,}|bob_[A-Za-z0-9_-]{20,}|AKIA[0-9A-Z]{16})\b/g, () => {
        redacted = true;
        return "[REDACTED]";
    });
    return { content: sanitized, redacted };
}

async function buildRepositoryContext(workspace, repository) {
    const limits = getContextLimits();
    const state = {
        candidates: [], directories: [], directoryCount: 0, directoryInventoryTruncated: false,
        fileCount: 0, fileInventoryTruncated: false, files: [], scanLimitReached: false,
        scannedFiles: 0, skipped: [], skippedByReason: {}, skippedCount: 0, skippedInventoryTruncated: false,
    };

    async function scan(directory) {
        if (state.scanLimitReached) return;
        const entries = await fs.readdir(directory, { withFileTypes: true });

        for (const entry of entries.sort((a, b) => a.name.localeCompare(b.name))) {
            if (state.scanLimitReached) return;
            const absolutePath = path.join(directory, entry.name);
            const relativePath = path.relative(workspace, absolutePath).split(path.sep).join("/");
            const lowerName = entry.name.toLowerCase();

            if (entry.isDirectory()) {
                if (IGNORED_DIRECTORIES.has(lowerName)) {
                    addSkipped(state, limits, { path: relativePath, reason: "ignored_directory", kind: "directory" });
                } else {
                    addDirectoryEntry(state, limits, relativePath);
                    await scan(absolutePath);
                }
                continue;
            }

            if (!entry.isFile()) {
                addSkipped(state, limits, { path: relativePath, reason: "non_regular_file" });
                continue;
            }
            if (state.scannedFiles >= limits.maxScannedFiles) {
                state.scanLimitReached = true;
                addSkipped(state, limits, { path: "[remaining files]", reason: "scan_limit" });
                return;
            }

            state.scannedFiles += 1;
            state.fileCount += 1;
            const stat = await fs.stat(absolutePath);
            const extension = path.extname(lowerName);

            if (usesSensitiveName(entry.name)) {
                addSkipped(state, limits, { path: "[sensitive file omitted]", reason: "sensitive_file" });
                continue;
            }

            addInventoryEntry(state, limits, {
                path: relativePath,
                size: stat.size,
                extension: extension || undefined,
                type: MEDIA_EXTENSIONS.has(extension) ? "media" : "file",
            });

            if (MEDIA_EXTENSIONS.has(extension)) {
                addSkipped(state, limits, makeSkippedFile(relativePath, "binary_media", stat, extension));
                continue;
            }
            if (BINARY_EXTENSIONS.has(extension)) {
                addSkipped(state, limits, makeSkippedFile(relativePath, "binary_file", stat, extension));
                continue;
            }
            if (!isRelevantTextFile(entry.name)) {
                addSkipped(state, limits, makeSkippedFile(relativePath, "unsupported_file_type", stat, extension));
                continue;
            }
            if (stat.size > limits.maxFileBytes) {
                addSkipped(state, limits, makeSkippedFile(relativePath, "file_too_large", stat, extension));
                continue;
            }

            try {
                if (await appearsBinary(absolutePath)) {
                    addSkipped(state, limits, makeSkippedFile(relativePath, "binary_file", stat, extension));
                    continue;
                }
            } catch {
                addSkipped(state, limits, makeSkippedFile(relativePath, "unreadable_file", stat, extension));
                continue;
            }

            state.candidates.push({ absolutePath, extension, relativePath, size: stat.size, priority: getPriority(relativePath) });
        }
    }

    await scan(workspace);

    const sourceFiles = [];
    const selectedContentBytes = [];
    let sourceBytes = 0;
    let redactedSourceFiles = 0;
    let truncatedSourceFiles = 0;
    const candidates = state.candidates.sort((a, b) => a.priority - b.priority || a.relativePath.localeCompare(b.relativePath));
    for (const candidate of candidates) {
        if (sourceFiles.length >= limits.maxContextFiles) {
            addSkipped(state, limits, makeSkippedFile(candidate.relativePath, "context_file_limit", candidate, candidate.extension));
            continue;
        }

        let content;
        try {
            content = await fs.readFile(candidate.absolutePath, "utf8");
        } catch {
            addSkipped(state, limits, makeSkippedFile(candidate.relativePath, "unreadable_file", candidate, candidate.extension));
            continue;
        }

        const sanitized = redactSensitiveContent(content);
        const truncated = truncateContent(sanitized.content, limits.maxFileChars);
        const contentBytes = Buffer.byteLength(truncated.content, "utf8");
        if (sourceBytes + contentBytes > limits.maxContextBytes) {
            addSkipped(state, limits, makeSkippedFile(candidate.relativePath, "context_byte_limit", candidate, candidate.extension));
            continue;
        }

        sourceFiles.push({
            path: candidate.relativePath,
            language: getLanguage(candidate.extension),
            size: candidate.size,
            content: truncated.content,
            ...(truncated.truncated ? { contentTruncated: true } : {}),
            ...(sanitized.redacted ? { sensitiveValuesRedacted: true } : {}),
        });
        selectedContentBytes.push(contentBytes);
        sourceBytes += contentBytes;
        if (truncated.truncated) truncatedSourceFiles += 1;
        if (sanitized.redacted) redactedSourceFiles += 1;
    }

    const createContext = () => ({
        repository: {
            name: repository.repository,
            owner: repository.owner,
            branch: repository.branch || "Not found in the repository.",
            url: repository.repositoryUrl,
            sourceType: "github",
        },
        structure: {
            directories: state.directories,
            files: state.files,
            inventoryTruncated: state.directoryInventoryTruncated || state.fileInventoryTruncated,
        },
        sourceFiles,
        scan: {
            fileCount: state.fileCount,
            directoryCount: state.directoryCount,
            scannedFiles: state.scannedFiles,
            scanLimitReached: state.scanLimitReached,
            sourceFileCount: sourceFiles.length,
            sourceBytes,
            redactedSourceFiles,
            truncatedSourceFiles,
            skippedFiles: state.skippedCount,
            skipped: state.skipped,
            skippedByReason: state.skippedByReason,
            skippedInventoryTruncated: state.skippedInventoryTruncated,
            limits,
            serializedContextBytes: 0,
        },
    });

    let context;
    while (sourceFiles.length) {
        context = createContext();
        const initialBytes = Buffer.byteLength(JSON.stringify(context), "utf8");
        context.scan.serializedContextBytes = initialBytes;
        const serializedBytes = Buffer.byteLength(JSON.stringify(context), "utf8");
        if (serializedBytes <= limits.maxTotalContextBytes) break;

        const removedFile = sourceFiles.pop();
        sourceBytes -= selectedContentBytes.pop();
        if (removedFile.contentTruncated) truncatedSourceFiles -= 1;
        if (removedFile.sensitiveValuesRedacted) redactedSourceFiles -= 1;
        addSkipped(state, limits, { path: removedFile.path, reason: "context_total_byte_limit", size: removedFile.size });
    }

    if (!sourceFiles.length) {
        const contextBudgetExhausted = Boolean(
            state.skippedByReason.context_byte_limit
            || state.skippedByReason.context_file_limit
            || state.skippedByReason.context_total_byte_limit
        );
        const error = new Error(contextBudgetExhausted
            ? "The repository context exceeds the configured analysis budget."
            : "The repository contains no safe, analyzable text files within the configured context limits.");
        error.code = contextBudgetExhausted
            ? "REPOSITORY_CONTEXT_BUDGET_EXHAUSTED"
            : "REPOSITORY_INSUFFICIENT_ANALYZABLE_FILES";
        error.statusCode = 422;
        throw error;
    }

    return context;
}

module.exports = { buildRepositoryContext, getContextLimits };
