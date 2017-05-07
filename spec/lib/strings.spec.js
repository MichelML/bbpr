// const strings = require('../../lib/strings')
describe('strings.js', () => {
  it('should require without error', () => {
    expect(() => require('../../lib/strings')).not.toThrow()
  })

  it('should have only strings as end values', () => {
    function checkIfEndValueIsString (obj) {
      for (let key in obj) {
        if (typeof obj[key] === 'object') {
          checkIfEndValueIsString(obj[key])
        } else {
          expect(typeof obj[key]).toBe('string')
        }
      }
    }

    checkIfEndValueIsString(require('../../lib/strings'))
  })
})
