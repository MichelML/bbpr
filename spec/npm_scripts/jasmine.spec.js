describe('jasmine.js', () => {
  it('should require without error', () => {
    expect(() => require('../../npm_scripts/jasmine')).not.toThrow()
  })

  describe('after require', () => {
    const jasmine = require('../../npm_scripts/jasmine')
    describe('formatDate', () => {
      it('should return a formated date of format YYYY-M-D H:M:S:M', () => {
        expect(/\d{4}-\d{1,2}-\d{1,2}\s\d{1,2}:\d{1,2}:\d{1,2}:\d{1,3}/.test(jasmine.formatDate(new Date(1494475724605)))).toBe(true)
        expect(/\d{4}-\d{1,2}-\d{1,2}\s\d{1,2}:\d{1,2}:\d{1,2}:\d{1,3}/.test(jasmine.formatDate(new Date()))).toBe(true)
      })
    })
  })
})
