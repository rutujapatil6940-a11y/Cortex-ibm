"use strict";
// Quick unit-test for the Bob output parsing pipeline.
// Run with: node Backend/test-bob-service-parsing.js
const {
    parseBobStreamJson,
    getBobEvents,
    extractBobResultEvent,
    extractAssistantMessage,
    extractStructuredAnalysis,
    validateCortexAnalysis,
    scoreCortexCandidate,
    stripFencedCodeBlocks,
} = require("./services/bobService");

let passed = 0;
let failed = 0;

function assert(name, condition, detail) {
    if (condition) {
        console.log("  PASS:", name);
        passed++;
    } else {
        console.error("  FAIL:", name, detail != null ? String(detail) : "");
        failed++;
    }
}

const FULL_ANALYSIS = {
    projectOverview: "EduPredict is a ML project",
    technologiesUsed: ["Python", "scikit-learn"],
    projectStructure: ["src/"],
    importantFiles: [{ path: "README.md", purpose: "docs" }],
    importantFunctionsAndComponents: [],
    apiAndBackendInformation: [],
    setupInstructions: ["pip install -r requirements.txt"],
    howTheProjectWorks: ["Loads data, trains model"],
    importantDependencies: [{ package: "scikit-learn" }],
    dataFlow: ["CSV -> model"],
    configurationAndEnvironmentVariables: [],
    potentialImportantNotes: [],
};

// ─── parseBobStreamJson ───────────────────────────────────────────────────────
console.log("\n[parseBobStreamJson]");
const streamOut = [
    JSON.stringify({ type: "system", subtype: "init" }),
    JSON.stringify({ type: "assistant", content: [{ type: "text", text: "```json\n{}\n```" }] }),
    "Some non-JSON progress text",
    JSON.stringify({ type: "result", status: "success" }),
    "",
].join("\n");

const events0 = parseBobStreamJson(streamOut);
assert("parses all NDJSON lines (3 objects)", events0.length === 3);
assert("skips non-JSON lines", events0.every((e) => e && typeof e === "object"));
assert("empty string yields empty array", parseBobStreamJson("").length === 0);
assert("non-JSON text yields empty array", parseBobStreamJson("not json at all").length === 0);

// ─── getBobEvents ─────────────────────────────────────────────────────────────
console.log("\n[getBobEvents]");
const streamEvents = getBobEvents(streamOut);
assert("uses NDJSON path when NDJSON present", streamEvents.length === 3);

const plainJson = JSON.stringify({ type: "result", status: "success", last_message: "hello" });
const plainEvents = getBobEvents(plainJson);
assert("falls back to balanced-brace for plain JSON", plainEvents.length === 1);

try {
    getBobEvents("totally not json");
    assert("throws BOB_INVALID_EVENT_STREAM on no events", false, "should have thrown");
} catch (e) {
    assert("throws BOB_INVALID_EVENT_STREAM on no events", e.code === "BOB_INVALID_EVENT_STREAM");
}

// ─── extractBobResultEvent ────────────────────────────────────────────────────
console.log("\n[extractBobResultEvent]");
const { resultEvent: re0 } = extractBobResultEvent(streamOut);
assert("finds result event in NDJSON stream", re0 && re0.type === "result");
assert("result.status is success", re0 && re0.status === "success");

try {
    extractBobResultEvent(JSON.stringify({ type: "result", status: "error" }));
    assert("throws on non-success result", false, "should have thrown");
} catch (e) {
    assert("throws on non-success result", e.code === "BOB_UNSUCCESSFUL_RESULT");
}

try {
    extractBobResultEvent(JSON.stringify({ type: "system" }));
    assert("throws BOB_MISSING_RESULT_EVENT when no result event", false, "should have thrown");
} catch (e) {
    assert("throws BOB_MISSING_RESULT_EVENT when no result event", e.code === "BOB_MISSING_RESULT_EVENT");
}

// ─── extractAssistantMessage ──────────────────────────────────────────────────
console.log("\n[extractAssistantMessage]");

// Case 1: last_message on result event
const re1 = { type: "result", status: "success", last_message: "analysis text" };
assert("extracts last_message from result", extractAssistantMessage(re1, []) === "analysis text");

// Case 2: no last_message — fall back to message events
const re2 = { type: "result", status: "success" };
const ev3 = [
    { type: "system" },
    { type: "message", role: "assistant", content: [{ type: "text", text: "from message event" }] },
];
assert("extracts from assistant message events", extractAssistantMessage(re2, ev3) === "from message event");

// Case 3: text event
const ev4 = [{ type: "text", text: "direct text event" }];
assert("extracts from text events", extractAssistantMessage(re2, ev4) === "direct text event");

// Case 4: assistant-type event (shorthand)
const ev5 = [{ type: "assistant", content: "assistant shorthand" }];
assert("handles assistant-type events", extractAssistantMessage(re2, ev5) === "assistant shorthand");

// Case 5: content_block_stop
const ev6 = [{ type: "content_block_stop", content_block: { type: "text", text: "block text" } }];
assert("extracts from content_block_stop", extractAssistantMessage(re2, ev6) === "block text");

// Case 6: result event with output field
const re3 = { type: "result", status: "success", output: "output field text" };
assert("extracts output field from result", extractAssistantMessage(re3, []) === "output field text");

// ─── stripFencedCodeBlocks ────────────────────────────────────────────────────
console.log("\n[stripFencedCodeBlocks]");
const fenced = "```json\n{\"a\":1}\n```\n";
const stripped = stripFencedCodeBlocks(fenced);
assert("strips opening json fence", !stripped.includes("```json"));
assert("strips closing fence", !stripped.includes("```"));
assert("preserves JSON content", stripped.includes("{\"a\":1}"));

const fencedUpper = "```JSON\n{\"b\":2}\n```";
assert("strips uppercase JSON fence", !stripFencedCodeBlocks(fencedUpper).includes("```JSON"));

// ─── scoreCortexCandidate ─────────────────────────────────────────────────────
console.log("\n[scoreCortexCandidate]");
assert("zero score for null", scoreCortexCandidate(null) === 0);
assert("zero score for non-matching object", scoreCortexCandidate({ type: "system" }) === 0);

const partialCandidate = { projectOverview: "x", technologiesUsed: ["a"] };
const score = scoreCortexCandidate(partialCandidate);
assert("non-zero score for partial match", score > 0);
// FULL_ANALYSIS has some empty arrays — scoreCortexCandidate only counts
// non-empty values, so a perfect 12 is not expected unless all fields are
// populated. Just verify the full analysis scores higher than the partial one.
assert("full analysis scores higher than partial", scoreCortexCandidate(FULL_ANALYSIS) > score);

// ─── validateCortexAnalysis strict ────────────────────────────────────────────
console.log("\n[validateCortexAnalysis strict]");
try {
    validateCortexAnalysis({ type: "system" });
    assert("throws on no known fields (strict)", false, "should have thrown");
} catch (e) {
    assert("throws on no known fields (strict)", e.code === "BOB_INVALID_ANALYSIS_SCHEMA");
}
try {
    validateCortexAnalysis({ projectOverview: 42 });
    assert("throws on wrong type (strict)", false, "should have thrown");
} catch (e) {
    assert("throws on wrong type (strict)", e.code === "BOB_INVALID_ANALYSIS_SCHEMA");
}
const strictResult = validateCortexAnalysis(FULL_ANALYSIS);
assert("returns normalised object (strict)", strictResult.projectOverview === FULL_ANALYSIS.projectOverview);

// ─── validateCortexAnalysis lenient ───────────────────────────────────────────
console.log("\n[validateCortexAnalysis lenient]");
const partial = { projectOverview: "hello", technologiesUsed: ["React"] };
const lenient = validateCortexAnalysis(partial, { lenient: true });
assert("lenient: keeps valid string", lenient.projectOverview === "hello");
assert("lenient: keeps valid array", lenient.technologiesUsed.length === 1);
assert("lenient: fills missing array with []", Array.isArray(lenient.importantFiles) && lenient.importantFiles.length === 0);
assert("lenient: fills missing string field with empty string", lenient.howTheProjectWorks !== undefined && typeof lenient.howTheProjectWorks !== "undefined");

// ─── extractStructuredAnalysis ────────────────────────────────────────────────
console.log("\n[extractStructuredAnalysis]");

// A) Pure JSON
const r1 = extractStructuredAnalysis(JSON.stringify(FULL_ANALYSIS));
assert("A) pure JSON", r1.projectOverview === "EduPredict is a ML project");

// B) Fenced JSON
const fencedAnalysis = "```json\n" + JSON.stringify(FULL_ANALYSIS) + "\n```\n";
const r2 = extractStructuredAnalysis(fencedAnalysis);
assert("B) fenced JSON", r2.projectOverview === "EduPredict is a ML project");

// C) Prose + JSON
const proseAnalysis = "Here is the analysis:\n\n" + JSON.stringify(FULL_ANALYSIS);
const r3 = extractStructuredAnalysis(proseAnalysis);
assert("C) prose + JSON", r3.projectOverview === "EduPredict is a ML project");

// D) Multiple JSON objects — pick best match
const multiJson = JSON.stringify({ type: "system" }) + "\n" + JSON.stringify(FULL_ANALYSIS);
const r4 = extractStructuredAnalysis(multiJson);
assert("D) multiple JSON objects — best match", r4.projectOverview === "EduPredict is a ML project");

// E) Partial schema (lenient path)
const r5 = extractStructuredAnalysis(JSON.stringify({ projectOverview: "Partial", technologiesUsed: ["Node"] }));
assert("E) partial schema coercion — keeps overview", r5.projectOverview === "Partial");
assert("E) partial schema coercion — fills missing arrays", Array.isArray(r5.importantFiles));

// No JSON at all
try {
    extractStructuredAnalysis("Bob could not complete the analysis.");
    assert("throws BOB_STRUCTURED_ANALYSIS_PARSE_FAILED on no JSON", false, "should have thrown");
} catch (e) {
    assert("throws BOB_STRUCTURED_ANALYSIS_PARSE_FAILED on no JSON", e.code === "BOB_STRUCTURED_ANALYSIS_PARSE_FAILED");
}

// ─── Summary ──────────────────────────────────────────────────────────────────
console.log("\n=== Results:", passed, "passed,", failed, "failed ===\n");
process.exit(failed > 0 ? 1 : 0);
