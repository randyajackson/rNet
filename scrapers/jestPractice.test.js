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

//toEqual
test("User should be Randy Jackson object", () => {
    expect( functions.createUser() ).toEqual({
        firstName: "Randy",
        lastName: "Jackson"
    });
});

//less than and greater than
test('Should be under 1600', () => {
    const load1 = 800;
    const load2 = 700;
    expect(load1 + load2).toBeLessThan(1600);
});

//Regex
test("There is no I in team", () =>{
    expect('team').not.toMatch(/I/i);
});

// Arrays
test('Admin should be in username', () => {
    usernames = ['john', 'karen', 'admin'];
    expect(usernames).toContain('admin');
});     

//working with async data

//Promise
test('User fetched name should be Leanne Graham', () => {
    expect.assertions(1);
    return functions.fetchUser()
    .then(data => {
        expect(data.name).toEqual('Leanne Graham');
    });
});

//Async await
test('User fetched name should be Leanne Graham', async () => {
    expect.assertions(1);
    const data = await functions.fetchUser()
    expect(data.name).toEqual('Leanne Graham');
});