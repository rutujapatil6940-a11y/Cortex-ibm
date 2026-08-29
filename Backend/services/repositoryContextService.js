const fs = require("fs/promises");
const path = require("path");

const IGNORED_DIRECTORIES = new Set(["node_modules", ".git", "dist", "build", "coverage", ".next"]);
const SENSITIVE_FILE_NAMES = new Set([".env", ".env.local", "credentials"]);
const BINARY_EXTENSIONS = new Set([".7z", ".a", ".avi", ".bmp", ".class", ".dll", ".dylib", ".exe", ".gif", ".gz", ".ico", ".jar", ".jpeg", ".jpg", ".mov", ".mp3", ".mp4", ".o", ".pdf", ".png", ".so", ".tar", ".webp", ".woff", ".woff2", ".zip"]);
const SOURCE_EXTENSIONS = new Set([".c", ".cc", ".cpp", ".cs", ".css", ".go", ".graphql", ".html", ".java", ".js", ".jsx", ".json", ".kt", ".kts", ".md", ".mjs", ".php", ".py", ".rb", ".rs", ".scss", ".sh", ".sql", ".svelte", ".ts", ".tsx", ".vue", ".xml", ".yaml", ".yml"]);
const ROOT_TEXT_FILES = new Set(["dockerfile", "makefile", "readme", "license"]);
const MAX_FILE_BYTES = Number(process.env.REPOSITORY_MAX_FILE_BYTES || 250 * 1024);
const MAX_CONTEXT_BYTES = Number(process.env.REPOSITORY_MAX_CONTEXT_BYTES || 3 * 1024 * 1024);
const MAX_CONTEXT_FILES = Number(process.env.REPOSITORY_MAX_CONTEXT_FILES || 250);

function usesSensitiveName(name) {
    const lower = name.toLowerCase();
    return lower.startsWith(".env") || SENSITIVE_FILE_NAMES.has(lower) || lower.endsWith(".pem") || lower.endsWith(".key") || /credential|private[._-]?key/.test(lower);
}

function isRelevantTextFile(name) {
    const lower = name.toLowerCase();
    return SOURCE_EXTENSIONS.has(path.extname(lower)) || ROOT_TEXT_FILES.has(lower) || lower.startsWith("readme.");
}

async function appearsBinary(filePath) {
    const handle = await fs.open(filePath, "r");
    try {
        const buffer = Buffer.alloc(8192);
        const { bytesRead } = await handle.read(buffer, 0, buffer.length, 0);
        return buffer.subarray(0, bytesRead).includes(0);
    } finally {
        await handle.close();
    }
}

async function buildRepositoryContext(workspace, repository) {
    const directories = [];
    const files = [];
    const sourceFiles = [];
    const skipped = [];
    let sourceBytes = 0;

    async function scan(directory) {
        const entries = await fs.readdir(directory, { withFileTypes: true });
        for (const entry of entries.sort((a, b) => a.name.localeCompare(b.name))) {
            const absolutePath = path.join(directory, entry.name);
            const relativePath = path.relative(workspace, absolutePath).split(path.sep).join("/");
            if (entry.isDirectory()) {
                if (IGNORED_DIRECTORIES.has(entry.name)) {
                    skipped.push({ path: relativePath, reason: "ignored_directory" });
                } else {
                    directories.push(relativePath);
                    await scan(absolutePath);
                }
                continue;
            }
            if (!entry.isFile()) continue;

            const extension = path.extname(entry.name).toLowerCase();
            if (usesSensitiveName(entry.name)) {
                skipped.push({ path: relativePath, reason: "sensitive_file" });
                continue;
            }
            const stat = await fs.stat(absolutePath);
            files.push({ path: relativePath, size: stat.size });
            if (!isRelevantTextFile(entry.name)) continue;
            if (stat.size > MAX_FILE_BYTES) {
                skipped.push({ path: relativePath, reason: "file_too_large" });
                continue;
            }
            if (BINARY_EXTENSIONS.has(extension) || await appearsBinary(absolutePath)) {
                skipped.push({ path: relativePath, reason: "binary_file" });
                continue;
            }
            if (sourceFiles.length >= MAX_CONTEXT_FILES || sourceBytes + stat.size > MAX_CONTEXT_BYTES) {
                skipped.push({ path: relativePath, reason: "context_limit" });
                continue;
            }
            const content = await fs.readFile(absolutePath, "utf8");
            sourceFiles.push({ path: relativePath, language: extension.slice(1) || "text", content });
            sourceBytes += Buffer.byteLength(content, "utf8");
        }
    }

    await scan(workspace);
    if (!sourceFiles.length) {
        const error = new Error("No readable source-code files were found in this repository.");
        error.statusCode = 422;
        throw error;
    }

    return {
        repository: {
            name: repository.repository,
            owner: repository.owner,
            branch: repository.branch || "Not found in the repository.",
            url: repository.repositoryUrl,
            sourceType: "github",
        },
        structure: { directories, files },
        sourceFiles,
        scan: { fileCount: files.length, sourceFileCount: sourceFiles.length, sourceBytes, skippedFiles: skipped.length, skipped },
    };
}

module.exports = { buildRepositoryContext };
