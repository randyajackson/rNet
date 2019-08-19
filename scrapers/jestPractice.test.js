const functions = require('./jestPractice');

test("Adds 2 + 2 to equal 4", () => {
    expect( functions.add(2,2) ).toBe(4);
});

test("Should be null", () => {
    expect( functions.isNull() ).toBeNull();
});

test("Should be falsy", () => {
    expect( functions.checkValue(undefined) ).toBeFalsy();
});

test("User should be Randy Jackson object", () => {
    expect( functions.createUser() ).toEqual({
        firstName: "Randy",
        lastName: "Jackson"
    });
});