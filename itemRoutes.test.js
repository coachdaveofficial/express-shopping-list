process.env.NODE_ENV = "test";

const request = require("supertest");

const app = require("./app");
let items = require("./fakeDb");

let bread = {name: "bread", price: "5"}

beforeEach(function() {
    items.push(bread)
});

afterEach(function() {
    items.length = 0;
});

describe("GET /items", function() {
    test("Gets a list of shopping items", async function() {
        const resp = await request(app).get('/items');
        expect(resp.statusCode).toBe(200)

        expect(resp.body).toEqual([bread])
    })
});

describe("GET /items:name", function() {
    test("Gets a specific item from list", async function() {
        const resp = await request(app).get('/items/bread');
        expect(resp.statusCode).toBe(200)
        expect(resp.body).toEqual({foundItem: bread})

    })
})

describe("POST /items", function() {
    test("Adds new item to list of shopping items", async function() {
        const resp = await request(app).post('/items').send({name: "gum", price: "2"});
        expect(resp.statusCode).toBe(201)

        expect(resp.body).toEqual({added: {name: "gum", price: "2"}})
    });
    test("Responds with 400 if price is missing", async function() {
        const resp = await request(app).post('/items').send({name: "gum"});
        expect(resp.statusCode).toBe(400);
        expect(resp.body).toEqual({"error": "Please provide item name AND price."})  
    })
    test("Responds with 400 if name is missing", async function() {
        const resp = await request(app).post('/items').send({price: "2"});
        expect(resp.statusCode).toBe(400);
        expect(resp.body).toEqual({"error": "Please provide item name AND price."})  
    })
    test("Responds with 400 if name AND price is missing", async function() {
        const resp = await request(app).post('/items').send({});
        expect(resp.statusCode).toBe(400);
        expect(resp.body).toEqual({"error": "Please provide item name AND price."})  
    })
});
describe("PATCH /items:name", function() {
    test("Updates existing item name", async function() {
        const resp = await request(app).patch('/items/bread').send({name: "naan", price: "5"});
        expect(resp.statusCode).toBe(200)

        expect(resp.body).toEqual({originalItemInfo: {name:"bread", price:"5"}, newItemInfo: {name: "naan", price: "5"}})
    });
    // prior test alters item name so must use new name in route 
    test("Updates existing item price", async function() {
        const resp = await request(app).patch('/items/naan').send({name: "naan", price: "2"});
        expect(resp.statusCode).toBe(200)

        expect(resp.body).toEqual({originalItemInfo: {name:"naan", price:"5"}, newItemInfo: {name: "naan", price: "2"}})
    });
    
});


