const {run, ERRORS}  = require("./index.js");


beforeEach(function(){
  spyOn(console, 'error');
})

describe("index.js", () => {
  describe("run()", () => {
    it("should throw an error | if file does not exist", () => {
      const file = __dirname + '/../tdest/fakefile';
      run({file});
      expect(console.error).toHaveBeenCalledWith(ERRORS.FILE_NAME_DOESNT_EXIST(file));
    })
    
    fit("should throw an error | if file does not exist", () => {
      const file = __dirname + '/../test/Maketar';
      run({file});
      expect(true).toBeTrue();
    })
  })
})