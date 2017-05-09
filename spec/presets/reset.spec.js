describe('reset.js', () => {
  it('should be require without error', () => {
    expect(() => require('../../config_presets/reset')).not.toThrow()
  })

  it('should be identical to bbpr.config.js', () => {
    const fs = require('fs')
    expect(fs.readFileSync(`${__dirname}/../../config_presets/reset.js`)).toEqual(fs.readFileSync(`${__dirname}/../../bbpr.config.js`))
  })
})
