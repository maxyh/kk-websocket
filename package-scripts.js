'use strict';

const path = require('path');

/**
 * Generates a command to run mocha tests with or without test coverage
 * as desired for the current runmode.
 * @param {string} testName The name of the test to be used for coverage reporting.
 * @param {string} mochaParams Parameters for the mocha CLI to execute the desired test.
 * @returns {string} Command string to be executed by nps.
 */
function test (testName, mochaParams) {
    const coverageCommand = `nyc --no-clean --report-dir coverage/reports/${testName}`;
    const mochaCommand = `node ${path.join('bin', 'mocha')}`; // Include 'node' and path.join for Windows compatibility
    return `${process.env.COVERAGE ? coverageCommand : ''} ${mochaCommand} ${mochaParams}`.trim();
}

module.exports = {
    scripts: {
        build: `browserify ./index.browser.js > kk-websocket.bundle.js`,
        lint: {
            default: 'nps lint.all',
            all: {
                script: 'nps lint.code lint.markdown',
                description: 'Lint code and markdown'
            },
            code: {
                script: 'eslint . "bin/*"',
                description: 'Run eslint on JS code'
            },
            markdown: {
                script: 'markdownlint "*.md" "docs/**/*.md" ".github/*.md"',
                description: 'Lint Markdown files'
            }
        },
        clean: {
            script: 'rm -f kk-websocket.bundle.js',
            description: 'Delete kk-websocket.bundle.js build artifact'
        },
        test: {
            default: 'nps test.all',
            all: {
                script: 'nps lint.code test.node test.browser test.bundle',
                description: 'Lint code and runs node / browser environment tests'
            },
            node: {
                default: 'nps test.node.all',
                all: {
                    script: `nps ${[
                        'test.node.bdd'
                    ].join(' ')}`,
                    description: 'Run all tests for node environment'
                },
                bdd: {
                    script: test('bdd', '--ui bdd test/interfaces/bdd.spec'),
                    description: 'Test Node BDD interface'
                },
            },
            browser: {
                default: 'nps test.browser.all',
                all: {
                    script: 'nps clean build.mochajs test.browser.unit test.browser.bdd test.browser.tdd test.browser.qunit test.browser.esm',
                    description: 'Compile Mocha and run all tests in browser environment'
                },
                unit: {
                    script: 'NODE_PATH=. karma start --single-run', // DEBUG_TEST=1 
                    description: 'Run unit tests for Mocha in browser'
                },
            },
            bundle: {
                default: 'nps test.bundle.all',
                all: {
                    script: 'nps clean build.mochajs test.bundle.amd',
                    description: 'Compile Mocha and run all tests for bundle files'
                },
                amd: {
                    script: test('amd', 'test/bundle/amd.spec'),
                    description: 'Test bundle files for AMD'
                }
            }
        },
        coveralls: {
            script: 'nyc report --reporter=text-lcov | coveralls',
            description: 'Send code coverage report to coveralls (run during CI)'
        },
        prebuildDocs: 'rm -rf docs/_dist && node scripts/docs-update-toc.js',
        buildDocs: {
            script: 'nps prebuildDocs && bundle exec jekyll build --source ./docs --destination ./docs/_site --config ./docs/_config.yml --safe --drafts && nps postbuildDocs',
            description: 'Build documentation'
        },
        postbuildDocs: 'buildProduction docs/_site/index.html --outroot docs/_dist --canonicalroot https://mochajs.org/ --optimizeimages --svgo --inlinehtmlimage 9400 --inlinehtmlscript 0 --asyncscripts && cp docs/_headers docs/_dist/_headers && node scripts/netlify-headers.js >> docs/_dist/_headers',
        prewatchDocs: 'node scripts/docs-update-toc.js',
        watchDocs: {
            script: 'nps prewatchDocs && bundle exec jekyll serve --source ./docs --destination ./docs/_site --config ./docs/_config.yml --safe --drafts --watch',
            description: 'Watch documentation for changes'
        }
    }
};