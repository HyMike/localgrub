import { defineConfig } from "vitest/config";
import { resolve } from "path";


export default defineConfig({
    test: {
        globals: true,  
        environment: "node",
        setupFiles: ["./src/test/setup.ts"],
        coverage: {
            provider: "v8",
            reporter: ["text", "json", "html"],
            exclude: [
                'node_modules/',
                'src/__tests__/',
                '**/*.d.ts',
                '**/*.config.*'
              ]
        },
        testTimeout: 10000,
        maxConcurrency: 1,
    },
    resolve: {
        alias: {
            "@": resolve(__dirname, "./src"),
        },
    },

})