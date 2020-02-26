import { promises as fs } from "fs";
import * as process from 'process'
import { replaceTokens } from "../src/replace";

describe("basic functionality", () => {
    beforeEach(async () => {
        await fs.writeFile("test.txt", "hello #{ACTOR}#", "utf8");
        await fs.writeFile("test2.txt", "#{GREETING}# #{ACTOR}#", "utf8");
    })

    afterEach(async () => {
        await fs.unlink("test.txt");
        await fs.unlink("test2.txt");
    })

    test("replaces single token in file", async () => {
        process.env["ACTOR"] = "world";
        await replaceTokens("#{", "}#", ["test.txt"]);

        const content = await fs.readFile('test.txt', 'utf8');
        expect(content).toBe("hello world")
    });

    test("replaces single token in file specified with glob", async () => {
        process.env["ACTOR"] = "world";
        await replaceTokens("#{", "}#", ["*.txt"]);

        const content = await fs.readFile('test.txt', 'utf8');
        expect(content).toBe("hello world")

        const content2 = await fs.readFile('test2.txt', 'utf8');
        expect(content2).toBe(" world")
    });

    test("replaces multiple token in file", async () => {
        process.env["GREETING"] = "hallo";
        process.env["ACTOR"] = "welt";
        await replaceTokens("#{", "}#", ["test2.txt"]);

        const content = await fs.readFile('test2.txt', 'utf8');
        expect(content).toBe("hallo welt")
    });

    test("returns list of changed files", async () => {
        const result = await replaceTokens("#{", "}#", ["*.txt"]);

        expect(result).toEqual([
            "test.txt", "test2.txt"
        ]);
    });

    test("returns only list of changed files", async () => {
        const result = await replaceTokens("#{", "}#", ["test.txt"]);

        expect(result).toEqual([
            "test.txt"
        ]);
    });

    test("does not throw when no match", async () => {
        const result = await replaceTokens("#{", "}#", [""]);

        expect(result).toEqual([]);
    });
});