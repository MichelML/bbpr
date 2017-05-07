// const configFile = require('../../lib/config-file')
describe('config-file.js', () => {
  const shell = require('shelljs')

  it('should require without error', () => {
    expect(() => require('../../lib/config-file')).not.toThrow()
  })

  describe('after require', () => {
    const configFile = require('../../lib/config-file')

    describe('openConfig', () => {
      let backupGlobalOpenFileCommand = configFile.globalVars.openFileCommand

      afterEach(() => {
        configFile.globalVars.openFileCommand = undefined
      })

      afterAll(() => {
        configFile.globalVars.openFileCommand = backupGlobalOpenFileCommand
      })

      it('should use shell exec with the globalVars open command if it exists and is a string', () => {
        configFile.globalVars.openFileCommand = 'code'
        const exec = spyOn(shell, 'exec').and.returnValue({stderr: 'error', stdout: 'success'})

        configFile.openConfig()

        expect(exec).toHaveBeenCalledWith(`${configFile.globalVars.openFileCommand} ${configFile.configFile}`)
      })

      it('should call the default open command if shell exec return an error', () => {
        const exec = spyOn(shell, 'exec').and.returnValue({stderr: 'error'})
        configFile.openConfig()
        expect(exec).toHaveBeenCalledWith(`open ${configFile.configFile}`)
      })

      it('should call the default open command if globalVars open command is undefined', () => {
        configFile.globalVars.openFileCommand = undefined
        const exec = spyOn(shell, 'exec').and.returnValue({stderr: 'error'})
        configFile.openConfig()
        expect(exec).toHaveBeenCalledWith(`open ${configFile.configFile}`)
      })

      it('should call the default open command if globalVars open command is not of type string', () => {
        const exec = spyOn(shell, 'exec').and.returnValue({stderr: 'error'})
        const dummyValues = [23431, Function, Object, '', null, undefined, {}, 0]
        dummyValues.forEach(val => {
          configFile.globalVars.openFileCommand = val
          configFile.openConfig()
          expect(exec).toHaveBeenCalledWith(`open ${configFile.configFile}`)
        })
      })
    })
  })
})
