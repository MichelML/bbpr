describe('watch.js', () => {
  it('should require without error', () => {
    expect(() => require('../../npm_scripts/watch')).not.toThrow()
  })

  describe('after require', () => {
    const watch = require('../../npm_scripts/watch')
    const fs = require('fs')
    let fsWatch

    beforeEach(() => {
      fsWatch = spyOn(fs, 'watch')
    })

    it('should watch for each file path specified and call jasmine test runner on change', () => {
      watch.watch()
      watch.paths.forEach(path => expect(fsWatch).toHaveBeenCalledWith(path, {encoding: 'buffer', recursive: true}, watch.testWithJasmineOnChange))
    })
  })
})
