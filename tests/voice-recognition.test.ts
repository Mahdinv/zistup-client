import assert from "node:assert/strict";
import { test } from "node:test";
import {
  createVoiceRecognition,
  type Recognition,
  type VoiceStatus,
} from "../src/shared/lib/voice-recognition.ts";

function setup() {
  const values: string[] = [];
  const statuses: VoiceStatus[] = [];
  const errors: string[] = [];
  const instances: FakeRecognition[] = [];
  class FakeRecognition implements Recognition {
    lang = "";
    interimResults = false;
    continuous = false;
    onstart: Recognition["onstart"] = null;
    onend: Recognition["onend"] = null;
    onerror: Recognition["onerror"] = null;
    onresult: Recognition["onresult"] = null;
    stopped = false;
    aborted = false;
    constructor() {
      instances.push(this);
    }
    start() {}
    stop() {
      this.stopped = true;
    }
    abort() {
      this.aborted = true;
    }
    result(...transcripts: string[]) {
      this.onresult?.({
        results: transcripts.map((transcript) => [{ transcript }]),
      });
    }
  }
  const controller = createVoiceRecognition({
    onStatus: (status) => statuses.push(status),
    onError: (error) => errors.push(error),
  });
  const change = (value: string) => values.push(value);
  controller.sync("", change, false);
  return {
    controller,
    FakeRecognition,
    instances,
    values,
    statuses,
    errors,
    change,
  };
}

test("Persian interim snapshots replace old results, including shrinking results", () => {
  const { controller, FakeRecognition, instances, values, change } = setup();
  controller.sync("غذا", change, false);
  controller.toggle(FakeRecognition);
  const mic = instances[0];
  assert.equal(mic.lang, "fa-IR");
  assert.equal(mic.interimResults, true);
  assert.equal(mic.continuous, true);
  mic.onstart?.();
  mic.result("بر");
  controller.sync(values.at(-1)!, change, false);
  mic.result("برنج");
  mic.result("برنج");
  mic.result("برنج", "مرغ");
  mic.result("برنج");
  assert.deepEqual(values, ["غذا بر", "غذا برنج", "غذا برنج مرغ", "غذا برنج"]);
  assert.equal(mic.aborted, false);
});

test("manual edits abort recognition and ignore queued results", () => {
  const { controller, FakeRecognition, instances, values, change } = setup();
  controller.toggle(FakeRecognition);
  const mic = instances[0];
  mic.result("برنج");
  const lateResult = mic.onresult!;
  controller.sync("متن دستی", change, false);
  lateResult({ results: [[{ transcript: "برنج مرغ" }]] });
  assert.equal(mic.aborted, true);
  assert.deepEqual(values, ["برنج"]);
});

test("stop accepts final results, blocks rapid restart, then allows a new session", () => {
  const { controller, FakeRecognition, instances, values, change } = setup();
  controller.toggle(FakeRecognition);
  const mic = instances[0];
  mic.onstart?.();
  mic.result("دو");
  controller.toggle(FakeRecognition);
  controller.toggle(FakeRecognition);
  assert.equal(instances.length, 1);
  assert.equal(mic.stopped, true);
  mic.result("دویدن");
  mic.onend?.();
  controller.sync("دویدن", change, false);
  controller.toggle(FakeRecognition);
  instances[1].result("آرام");
  assert.equal(values.at(-1), "دویدن آرام");
});

test("cancel while permission is pending detaches handlers", () => {
  const { controller, FakeRecognition, instances, statuses } = setup();
  controller.toggle(FakeRecognition);
  const lateStart = instances[0].onstart!;
  controller.toggle(FakeRecognition);
  lateStart();
  assert.equal(instances[0].aborted, true);
  assert.equal(statuses.at(-1), "idle");
});

test("disabled and disposed controls ignore old sessions", () => {
  const { controller, FakeRecognition, instances, change, statuses } = setup();
  controller.toggle(FakeRecognition);
  controller.sync("", change, true);
  controller.toggle(FakeRecognition);
  assert.equal(instances.length, 1);
  assert.equal(instances[0].aborted, true);
  controller.sync("", change, false);
  controller.toggle(FakeRecognition);
  const statusCount = statuses.length;
  controller.dispose();
  assert.equal(instances[1].aborted, true);
  assert.equal(instances[1].onresult, null);
  assert.equal(statuses.length, statusCount);
});

test("unsupported, permission, network, and synchronous failures recover", () => {
  const { controller, FakeRecognition, instances, errors, statuses } = setup();
  controller.toggle(undefined);
  for (const error of [
    "not-allowed",
    "network",
    "no-speech",
    "audio-capture",
  ]) {
    controller.toggle(FakeRecognition);
    instances.at(-1)!.onerror?.({ error });
    assert.equal(statuses.at(-1), "idle");
  }
  class BrokenRecognition extends FakeRecognition {
    start() {
      throw new Error("failed");
    }
  }
  controller.toggle(BrokenRecognition);
  assert.deepEqual(errors, [
    "unsupported",
    "not-allowed",
    "network",
    "no-speech",
    "audio-capture",
    "start-failed",
  ]);
  assert.equal(instances.at(-1)!.aborted, true);
});
