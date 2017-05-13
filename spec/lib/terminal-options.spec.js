describe('terminal-options.js', () => {
  it('should require without error', () => {
    expect(() => require('../../lib/terminal-options')).not.toThrow()
  })

  describe('after require', () => {
    const terminalOptions = require('../../lib/terminal-options')
    const filePath = 'filePath'

    describe('getProccessArgV', () => {
      it('should return the terminal arguments', () => {
        expect(terminalOptions.getProcessArgV()).toEqual(process.argv)
      })
    })
  })
})
