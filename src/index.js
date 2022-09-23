// @ts-check
/// <reference types="cypress" />

// https://github.com/zspecza/common-tags
const { stripIndent } = require('common-tags')
const ci = require('ci-info')
const core = require('@actions/core')


function msToHMS(ms) {
    // 1- Convert to seconds:
    let seconds = ms / 1000;
    // 2- Extract hours:
    const hours = seconds / 3600; // 3,600 seconds in 1 hour
    seconds = seconds % 3600; // seconds remaining after extracting hours
    // 3- Extract minutes:
    const minutes = seconds / 60; // 60 seconds in 1 minute
    // 4- Keep only seconds not extracted to minutes:
    seconds = seconds % 60;
    return parseInt(hours.toString()) + ":" + parseInt(minutes.toString()) + ":" + parseInt(seconds.toString());
}

function dashes(s) {
    return '-'.repeat(s.length)
}

function getProjectName() {
    try {
        // @ts-ignore
        const pkg = require('./package.json')
        return pkg.name
    } catch (e) {
        return
    }
}

function getStatusEmoji(status) {
    const validStatuses = ['passed', 'failed', 'pending', 'skipped']
    if (!validStatuses.includes(status)) {
        throw new Error(`Invalid status: "${status}"`)
    }

    const emoji = {
        passed: '✅',
        failed: '❌',
        pending: '✋',
        skipped: '↩️',
    }
    return emoji[status]
}

function collectCypressTestResults(on, config) {

    if (!on) {
        throw new Error('Missing required option: on')
    }

    // keeps all test results by spec
    let allResults

    // `on` is used to hook into various events Cypress emits
    on('before:run', () => {
        allResults = {}
    })

    on('after:spec', (spec, results) => {
        allResults[spec.relative] = {}
        // shortcut
        const r = allResults[spec.relative]
        results.tests.forEach((t) => {
            const testTitle = t.title.join(' ')
            r[testTitle] = t.state
        })
    })

    on('after:run', async (afterRun) => {
        const totals = {
            suites: afterRun.totalSuites,
            tests: afterRun.totalTests,
            failed: afterRun.totalFailed,
            passed: afterRun.totalPassed,
            pending: afterRun.totalPending,
            skipped: afterRun.totalSkipped,
        }

        console.log(
            'cypress-test-results: %d total tests, %d passes, %d failed, %d others',
            totals.tests,
            totals.passed,
            totals.failed,
            totals.pending + totals.skipped,
        )

        const runStatus = totals.failed > 0 ? 'FAILED' : 'OK'

        const n = Object.keys(allResults).length
        const textStart = stripIndent`
      ${totals.tests} total tests across ${n} test files.
      ${totals.passed} tests passed, ${totals.failed} failed, ${totals.pending} pending, ${totals.skipped} skipped.
    `
        const testResults = Object.keys(allResults)
            .map((spec) => {
                const specResults = allResults[spec]
                return (
                    spec +
                    '\n' +
                    dashes(spec) +
                    '\n' +
                    Object.keys(specResults)
                        .map((testName) => {
                            const testStatus = specResults[testName]
                            const testCharacter = getStatusEmoji(testStatus)
                            return `${testCharacter} ${testName}`
                        })
                        .join('\n')
                )
            })
            .join('\n\n')

        const name = getProjectName()
        const subject = name
            ? `${name} - Cypress tests ${runStatus}`
            : `Cypress tests ${runStatus}`
        const dashboard = afterRun.runUrl ? `Run url: ${afterRun.runUrl}\n` : ''
        let text = textStart + '\n\n' + testResults + '\n' + dashboard

        const formattedDuration = msToHMS(parseInt(afterRun.totalDuration))
        // const formattedDuration = afterRun.totalDuration
        if (ci.isCI && ci.name) {
            text +=
                '\n' + `${ci.name} duration ${formattedDuration}`
        }


        console.log('cypress-test-results: ')
        console.log('')
        console.log(subject)
        console.log(text)

        // Set outputs for Github Action
        core.setOutput('numOfTestFiles', n)
        core.setOutput('numOfTests', totals.tests)
        core.setOutput('numOfPassed', totals.passed)
        core.setOutput('numOfFailed', totals.failed)
        core.setOutput('numOfPending', totals.pending)
        core.setOutput('numOfSkipped', totals.skipped)
        core.setOutput('duration', formattedDuration)
        core.setOutput('durationInMilliseconds', afterRun.totalDuration)
        core.setOutput('dashboardUrl', afterRun.runUrl)
    })
}

module.exports = collectCypressTestResults