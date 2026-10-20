import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const source = await readFile(new URL("../src/App.tsx", import.meta.url), "utf8");

test("professional claims stay grounded in the profile README", () => {
  assert.match(source, /1 ano de experiência profissional/);
  assert.match(source, /6º semestre/);
  assert.doesNotMatch(source, /\d+%/);
});

test("all core portfolio sections are present", () => {
  for (const id of ["servicos", "projetos", "processo", "sobre", "habilidades", "jornada", "contato"]) {
    assert.match(source, new RegExp(`id="${id}"`));
  }
});
