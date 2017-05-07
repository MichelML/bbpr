describe('jasmine.js', () => {
  it('should require without error', () => {
    expect(() => require('../../npm_scripts/jasmine')).not.toThrow()
  })
})
