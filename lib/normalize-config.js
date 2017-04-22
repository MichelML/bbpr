const vcs = require('./vcs')

let config

try {
  config = require('../bbpr.config')
} catch (e) {
  try {
    config = require('../config_presets/reset.js')
  } catch (e) {
    config = {}
  }
}

function normalizeConfig (config) {
  if (!config.organization) config.organization = { name: vcs.getOrganizationName() }
  if (!config.organization.name) config.organization.name = vcs.getOrganizationName()
  if (!config.user) config.user = { name: vcs.getUserName(), password: null, cachePwd: false }
  if (!config.user.name) config.user.name = vcs.getUserName()
  if (!config.user.password) config.user.password = null
  if (!config.user.cachePwd) config.user.cachePwd = false
  if (!config.demo) config.demo = { shouldPrompt: false, shouldPromptDescription: false, basePath: '' }
  if (!config.demo.shouldPrompt) config.demo.shouldPrompt = false
  if (!config.demo.shouldPromptDescription) config.demo.shouldPromptDescription = false
  if (!config.demo.basePath) config.demo.basePath = ''
  if (!config.reviewers) config.reviewers = { default: [], potential: [] }
  if (!Array.isArray(config.reviewers.default) && !config.reviewers.default.every((elem) => typeof elem === 'string')) config.reviewers.default = []
  if (!Array.isArray(config.reviewers.potential) && !config.reviewers.potential.every((elem) => typeof elem === 'string')) config.reviewers.potential = []
  if (!config.branches) config.branches = { source: { close: true }, dest: { default: 'default' } }
  if (!config.branches.source) config.branches.source = { close: true }
  if (!config.branches.dest) config.branches.dest = { default: (vcs.vcs === 'git') ? 'master' : 'default' }
  if (!config.branches.dest.default || typeof config.branches.dest.default !== 'string') config.branches.dest.default = (vcs.vcs === 'git') ? 'master' : 'default'
  if (!config.globalVars) config.globalVars = { openFileCommand: '' }
  if (!config.globalVars.openFileCommand) config.globalVars.openFileCommand = ''

  return config
}

module.exports = normalizeConfig(config)
