describe('crypt.js', () => {
  it('should require without error', () => {
    expect(() => require('../../lib/crypt')).not.toThrow()
  })

  describe('after require', () => {
    const fs = require('fs')
    const crypto = require('crypto')
    const testText = 'testText'
    const testTextCiphered = 'testTextCiphered'
    const testTextDeciphered = 'testTextDeciphered'

    let readFileSync
    let writeFileSync
    let cipherUpdate
    let cipherFinal
    let decipherUpdate
    let decipherFinal
    let crypt

    beforeEach(() => {
      readFileSync = spyOn(fs, 'readFileSync').and.returnValue('configuration file converted in string and password: null')
      writeFileSync = spyOn(fs, 'writeFileSync')
      crypt = require('../../lib/crypt')
      cipherUpdate = spyOn(crypt.cipher, 'update').and.returnValue(testTextCiphered)
      cipherFinal = spyOn(crypt.cipher, 'final').and.returnValue('')
      decipherUpdate = spyOn(crypt.decipher, 'update').and.returnValue(testTextDeciphered)
      decipherFinal = spyOn(crypt.decipher, 'final').and.returnValue('')
    })

    describe('cachePwd', () => {
      it('should write to a bbpr.config.js file a configuration containing the encrypted password', () => {
        crypt.cachePwd('encryptedpassword')
        expect(writeFileSync.calls.mostRecent().args[0]).toContain('bbpr.config.js')
        expect(writeFileSync.calls.mostRecent().args[1]).toContain('encryptedpassword')
      })
    })

    describe('crypt', () => {
      it('should cipher update the text provided ', () => {
        crypt.crypt(testText)
        expect(cipherUpdate.calls.mostRecent().args[0]).toContain(testText)
      })

      it('should cipher final once', () => {
        crypt.crypt(testText)
        expect(cipherFinal).toHaveBeenCalledTimes(1)
      })

      it('should return the ciphered text', () => {
        expect(crypt.crypt(testText)).toEqual(testTextCiphered)
      })
    })

    describe('decrypt', () => {
      it('should decipher update the text provided ', () => {
        crypt.decrypt(testText)
        expect(decipherUpdate.calls.mostRecent().args[0]).toContain(testText)
      })

      it('should cipher final once', () => {
        crypt.decrypt(testText)
        expect(decipherFinal).toHaveBeenCalledTimes(1)
      })

      it('should return the ciphered text', () => {
        expect(crypt.decrypt(testText)).toEqual(testTextDeciphered)
      })
    })
  })
})
