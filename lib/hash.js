exports.cleanHash = function cleanHash (hash) {
  return hash.replace(/^#/, '').replace(/[^/]$/, (match) => `${match}/`)
}
