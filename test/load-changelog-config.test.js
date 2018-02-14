import test from 'ava';
import loadChangelogConfig from './../lib/load-changelog-config';
import HOSTS_CONFIG from './../lib/hosts-config';

HOSTS_CONFIG.empty = {
  hostname: 'empty',
};
HOSTS_CONFIG.test = {
  hostname: 'test',
  issue: 'issues',
  commit: 'commit',
  parserOpts: {
    headerPattern: /^##(.*?)## (.*)$/,
    headerCorrespondence: ['tag', 'shortDesc'],
    issuePrefixes: ['#', 'gh-'],
  },
};

/**
 * AVA macro to verify that `loadChangelogConfig` return a config object with parserOpts and writerOpts.
 *
 * @method loadPreset
 * @param {Object} t AVA assertion library.
 * @param {[type]} preset the `conventional-changelog` preset to test.
 */
async function loadPreset(t, preset) {
  const changelogConfig = await loadChangelogConfig({preset});

  t.truthy(changelogConfig.parserOpts.headerPattern);
  t.truthy(changelogConfig.writerOpts.groupBy);
}
loadPreset.title = (providedTitle, preset) => `${providedTitle} Load "${preset}" preset`.trim();

/**
 * AVA macro to verify that `loadChangelogConfig` return a config object with parserOpts and writerOpts.
 *
 * @method loadPreset
 * @param {Object} t AVA assertion library.
 * @param {[type]} config the `conventional-changelog` config to test.
 */
async function loadConfig(t, config) {
  const changelogConfig = await loadChangelogConfig({config: `conventional-changelog-${config}`}, 'empty');

  t.truthy(changelogConfig.parserOpts.headerPattern);
  t.truthy(changelogConfig.writerOpts.groupBy);
}
loadConfig.title = (providedTitle, config) => `${providedTitle} Load "${config}" config`.trim();

/**
 * AVA macro to verify that `loadChangelogConfig` return a config object with commit and issue and host default parserOpts.
 *
 * @method loadHost
 * @param {Object} t AVA assertion library.
 * @param {String} hostname hostname to load.
 * @param {Object} expected expected host configuration.
 */
async function loadHost(t, hostname, expected) {
  const changelogConfig = await loadChangelogConfig({parserOpts: {}, writerOpts: {}}, hostname);

  t.is(changelogConfig.hostname, expected.hostname);
  t.is(changelogConfig.issue, expected.issue);
  t.is(changelogConfig.commit, expected.commit);
  t.deepEqual(changelogConfig.parserOpts.referenceActions, expected.parserOpts.referenceActions);
  t.deepEqual(changelogConfig.parserOpts.issuePrefixes, expected.parserOpts.issuePrefixes);
}
loadHost.title = (providedTitle, hostname) => `${providedTitle} Load "${hostname}" host`.trim();

test('Load "conventional-changelog-angular" by default', async t => {
  const angularChangelogConfig = await require('conventional-changelog-angular');
  const changelogConfig = await loadChangelogConfig({}, 'empty');

  t.deepEqual(changelogConfig.parserOpts, angularChangelogConfig.parserOpts);
  t.deepEqual(changelogConfig.writerOpts, angularChangelogConfig.writerOpts);
});

test('Accept a "parserOpts" object as option', async t => {
  const angularChangelogConfig = await require('conventional-changelog-angular');
  const customParserOpts = {headerPattern: /^##(.*?)## (.*)$/, headerCorrespondence: ['tag', 'shortDesc']};
  const changelogConfig = await loadChangelogConfig({parserOpts: customParserOpts}, 'empty');

  t.deepEqual(changelogConfig.parserOpts, customParserOpts);
  t.deepEqual(changelogConfig.writerOpts, angularChangelogConfig.writerOpts);
});

test('Accept a "writerOpts" object as option', async t => {
  const angularChangelogConfig = await require('conventional-changelog-angular');
  const customWriterOpts = {commitGroupsSort: 'title', commitsSort: ['scope', 'subject']};
  const changelogConfig = await loadChangelogConfig({writerOpts: customWriterOpts}, 'empty');

  t.deepEqual(changelogConfig.writerOpts, customWriterOpts);
  t.deepEqual(changelogConfig.parserOpts, angularChangelogConfig.parserOpts);
});

test('Accept a partial "parserOpts" object as option that overwrite a preset', async t => {
  const angularChangelogConfig = await require('conventional-changelog-angular');
  const customParserOpts = {headerPattern: /^##(.*?)## (.*)$/, headerCorrespondence: ['tag', 'shortDesc']};
  const changelogConfig = await loadChangelogConfig({parserOpts: customParserOpts, preset: 'angular'}, 'empty');

  t.is(changelogConfig.parserOpts.headerPattern, customParserOpts.headerPattern);
  t.deepEqual(changelogConfig.parserOpts.headerCorrespondence, customParserOpts.headerCorrespondence);
  t.is(changelogConfig.parserOpts.revertPattern, angularChangelogConfig.parserOpts.revertPattern);
  t.deepEqual(changelogConfig.parserOpts.noteKeywords, angularChangelogConfig.parserOpts.noteKeywords);
  t.deepEqual(changelogConfig.writerOpts, angularChangelogConfig.writerOpts);
});

test('Accept a partial "writerOpts" object as option that overwrite a preset', async t => {
  const angularChangelogConfig = await require('conventional-changelog-angular');
  const customWriterOpts = {commitGroupsSort: 'title', commitsSort: ['scope', 'subject']};
  const changelogConfig = await loadChangelogConfig({writerOpts: customWriterOpts, preset: 'angular'}, 'empty');

  t.is(customWriterOpts.commitGroupsSort, changelogConfig.writerOpts.commitGroupsSort);
  t.deepEqual(customWriterOpts.commitsSort, changelogConfig.writerOpts.commitsSort);
  t.truthy(changelogConfig.writerOpts.noteGroupsSort);
  t.deepEqual(changelogConfig.parserOpts, angularChangelogConfig.parserOpts);
});

test('Accept a partial "parserOpts" object as option that overwrite a config', async t => {
  const angularChangelogConfig = await require('conventional-changelog-angular');
  const customParserOpts = {headerPattern: /^##(.*?)## (.*)$/, headerCorrespondence: ['tag', 'shortDesc']};
  const changelogConfig = await loadChangelogConfig(
    {
      parserOpts: customParserOpts,
      config: 'conventional-changelog-angular',
    },
    'empty'
  );

  t.is(customParserOpts.headerPattern, changelogConfig.parserOpts.headerPattern);
  t.deepEqual(customParserOpts.headerCorrespondence, changelogConfig.parserOpts.headerCorrespondence);
  t.truthy(changelogConfig.parserOpts.noteKeywords);
  t.deepEqual(changelogConfig.writerOpts, angularChangelogConfig.writerOpts);
});

test('Accept a partial "writerOpts" object as option that overwrite a config', async t => {
  const angularChangelogConfig = await require('conventional-changelog-angular');
  const customWriterOpts = {commitGroupsSort: 'title', commitsSort: ['scope', 'subject']};
  const changelogConfig = await loadChangelogConfig(
    {
      writerOpts: customWriterOpts,
      config: 'conventional-changelog-angular',
    },
    'empty'
  );

  t.is(customWriterOpts.commitGroupsSort, changelogConfig.writerOpts.commitGroupsSort);
  t.deepEqual(customWriterOpts.commitsSort, changelogConfig.writerOpts.commitsSort);
  t.truthy(changelogConfig.writerOpts.noteGroupsSort);
  t.deepEqual(changelogConfig.parserOpts, angularChangelogConfig.parserOpts);
});

test('Use default host configuration if no hostname parameter is provided', async t => {
  const changelogConfig = await loadChangelogConfig({parserOpts: {}, writerOpts: {}});

  t.is(changelogConfig.commit, HOSTS_CONFIG.default.commit);
  t.is(changelogConfig.hostname, HOSTS_CONFIG.default.hostname);
  t.is(changelogConfig.issue, HOSTS_CONFIG.default.issue);
  t.deepEqual(changelogConfig.parserOpts, HOSTS_CONFIG.default.parserOpts);
});

test('Use default host configuration if a non-exisiting hostname is provided', async t => {
  const changelogConfig = await loadChangelogConfig({parserOpts: {}, writerOpts: {}}, 'nonexisting.com');

  t.is(changelogConfig.commit, HOSTS_CONFIG.default.commit);
  t.is(changelogConfig.hostname, HOSTS_CONFIG.default.hostname);
  t.is(changelogConfig.issue, HOSTS_CONFIG.default.issue);
  t.deepEqual(changelogConfig.parserOpts, HOSTS_CONFIG.default.parserOpts);
});

test('Accept an hostname to load host specific configuration', async t => {
  const changelogConfig = await loadChangelogConfig({parserOpts: {}, writerOpts: {}}, 'test');

  t.is(changelogConfig.commit, HOSTS_CONFIG.test.commit);
  t.is(changelogConfig.hostname, HOSTS_CONFIG.test.hostname);
  t.is(changelogConfig.issue, HOSTS_CONFIG.test.issue);
  t.deepEqual(changelogConfig.parserOpts, HOSTS_CONFIG.test.parserOpts);
});

test('Allows presets to overwrite host configuration', async t => {
  const angularChangelogConfig = await require('conventional-changelog-angular');
  const changelogConfig = await loadChangelogConfig({preset: 'angular'}, 'test');

  t.is(changelogConfig.commit, HOSTS_CONFIG.test.commit);
  t.is(changelogConfig.hostname, HOSTS_CONFIG.test.hostname);
  t.is(changelogConfig.issue, HOSTS_CONFIG.test.issue);
  t.deepEqual(changelogConfig.parserOpts.issuePrefixes, HOSTS_CONFIG.test.parserOpts.issuePrefixes);

  t.is(changelogConfig.parserOpts.headerPattern, angularChangelogConfig.parserOpts.headerPattern);
  t.deepEqual(changelogConfig.parserOpts.headerCorrespondence, angularChangelogConfig.parserOpts.headerCorrespondence);
});

test('Allows config to overwrite host configuration', async t => {
  const angularChangelogConfig = await require('conventional-changelog-angular');
  const changelogConfig = await loadChangelogConfig({config: 'conventional-changelog-angular'}, 'test');

  t.is(changelogConfig.commit, HOSTS_CONFIG.test.commit);
  t.is(changelogConfig.hostname, HOSTS_CONFIG.test.hostname);
  t.is(changelogConfig.issue, HOSTS_CONFIG.test.issue);
  t.deepEqual(changelogConfig.parserOpts.issuePrefixes, HOSTS_CONFIG.test.parserOpts.issuePrefixes);

  t.is(changelogConfig.parserOpts.headerPattern, angularChangelogConfig.parserOpts.headerPattern);
  t.deepEqual(changelogConfig.parserOpts.headerCorrespondence, angularChangelogConfig.parserOpts.headerCorrespondence);
});

test('Allows a partial "parserOpts" object as option to overwrite host (and preset) configuration', async t => {
  const customParserOpts = {
    issuePrefixes: ['JIRA-'],
    headerPattern: /^##(.*?)## (.*)$/,
    headerCorrespondence: ['tag', 'shortDesc'],
  };
  const changelogConfig = await loadChangelogConfig({parserOpts: customParserOpts, preset: 'angular'}, 'test');

  t.is(changelogConfig.commit, HOSTS_CONFIG.test.commit);
  t.is(changelogConfig.hostname, HOSTS_CONFIG.test.hostname);
  t.is(changelogConfig.issue, HOSTS_CONFIG.test.issue);

  t.deepEqual(changelogConfig.parserOpts.issuePrefixes, customParserOpts.issuePrefixes);
  t.is(changelogConfig.parserOpts.headerPattern, customParserOpts.headerPattern);
  t.deepEqual(changelogConfig.parserOpts.headerCorrespondence, customParserOpts.headerCorrespondence);
});

test(loadPreset, 'angular');
test(loadConfig, 'angular');
test(loadPreset, 'atom');
test(loadConfig, 'atom');
test(loadPreset, 'ember');
test(loadConfig, 'ember');
test(loadPreset, 'eslint');
test(loadConfig, 'eslint');
test(loadPreset, 'express');
test(loadConfig, 'express');
test(loadPreset, 'jshint');
test(loadConfig, 'jshint');

test(loadHost, 'github.com', HOSTS_CONFIG.github);
test(loadHost, 'gitlab.com', HOSTS_CONFIG.gitlab);
test(loadHost, 'bitbucket.org', HOSTS_CONFIG.bitbucket);

test('Throw error if "config" doesn`t exist', async t => {
  const error = await t.throws(loadChangelogConfig({config: 'unknown-config'}));

  t.is(error.code, 'MODULE_NOT_FOUND');
});

test('Throw error if "preset" doesn`t exist', async t => {
  const error = await t.throws(loadChangelogConfig({preset: 'unknown-preset'}));

  t.is(error.code, 'MODULE_NOT_FOUND');
});
