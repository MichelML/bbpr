function cleanHash (hash) {
  return hash.replace(/^#/, '').replace(/[^/]$/, (match) => `${match}/`)
}

module.exports = { cleanHash }
