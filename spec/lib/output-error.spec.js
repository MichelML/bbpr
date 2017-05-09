
describe('output-error.js', () => {
  let processExit
  let consoleLog

  it('should require without error', () => {
    expect(() => require('../../lib/output-error')).not.toThrow()
  })

  describe('after require', () => {
    const outputError = require('../../lib/output-error')

    beforeEach(() => {
      processExit = spyOn(process, 'exit')
      consoleLog = spyOn(console, 'log')
    })

    it('should not throw if argument pass to outputError is a string', () => {
      expect(() => outputError('this is an error string')).not.toThrow()
    })

    it('should not throw if argument pass to outputError is an object with a message property', () => {
      expect(() => outputError({ message: 'this is an error message'})).not.toThrow()
    })

    it('should not throw if is not an object with message or a string', () => {
      expect(() => outputError()).not.toThrow()
      expect(() => outputError({})).not.toThrow()
      expect(() => outputError([])).not.toThrow()
    })

    it('should console log a message and an intro to the message', () => {
      outputError('this is an error string')
      expect(consoleLog).toHaveBeenCalledTimes(2)
    })

    it('should exit the program', () => {
      outputError('any message')
      expect(processExit).toHaveBeenCalledTimes(1)

      outputError({ message: 'any message' })
      expect(processExit).toHaveBeenCalledTimes(2)
    })
  })
})
