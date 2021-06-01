let chai = require("chai");
let chaiHttp = require("chai-http");
let my_server = require("../server");
let router = require("../routes/days");
const { response } = require("express");

//Assertion Style
chai.should();

chai.use(chaiHttp);

describe('My Days API', () => {

    /**
     * Test the GET (by slug) route
     */
    describe("Show Day", () => {

        it("It should GET a day by SLUG", () => {
            const slug = "The best day"
            chai.request(router)
                .get("/" + slug)
                .end((err, response) => {
                    response.should.have.status(200);
                    response.body.should.be.a('object');
                    response.body.should.have.property('title');
                    response.body.should.have.property('description');
                });
        });

        it("It should NOT GET a recipe by SLUG", () => {

            const slug = "dd3";
            chai.request(router)
                .get("/" + slug)
                .end((err, response) => {
                    response.should.have.status(404);
                    response.text.should.be.eq("The day with the provided ID does not exist.");
                });
        });

    });

    /**
     * Test the POST route
     */
    describe("POST day", () => {
        it("It should POST a new day", () => {
            const recipe = {
                title: "New Day",
                description: "this is new day description",
                createdAt: Date.now,

            };
            chai.request(router)
                .post("/")
                .send(recipe)
                .end((err, response) => {
                    response.should.have.status(201);
                    response.body.should.be.a('object');
                    response.body.should.have.property('title').eq("New Day");
                    response.body.should.have.property('description').eq("this is new day description");
                    response.body.should.have.property('createdAt').eq(Date.now);

                });
        });

        it("It should NOT POST a new day description without the title typed", () => {
            const recipe = {
                description: "this is new day description",
                createdAt: Date.now,

            };
            chai.request(router)
                .post("/")
                .send(recipe)
                .end((err, response) => {
                    response.should.have.status(400);
                    response.text.should.be.eq("Title is required");
                });
        });

    });

    /**
     * Test the PUT route
     */
    describe("PUT (update) day", () => {
        it("It should PUT new values to an existing day description", () => {
            const taskId = "60b4ce899a8250313c268a45";
            const recipe = {
                title: "New title for my day",
            };
            chai.request(router)
                .put("/" + taskId)
                .send(recipe)
                .end((err, response) => {
                    response.should.have.status(200);
                    response.body.should.be.a('object');
                    response.body.should.have.property('_id').eq("60b4ce899a8250313c268a45");
                    response.body.should.have.property('title').eq("New title for day");
                });
        });

        it("It should NOT PUT an existing day with a no title typed", () => {
            const recipeId = "60b4ce899a8250313c268a45";
            const recipe = {
                title: "",
            };
            chai.request(router)
                .put("/" + recipeId)
                .send(recipe)
                .end((err, response) => {
                    response.should.have.status(400);
                    response.body.should.be.a('object');
                    response.body.should.have.property('_id').eq("60b4ce899a8250313c268a45");
                    response.text.should.be.eq("The name is required!");


                });
        });

        /**
         * Test the DELETE route
         */
        describe("DELETE day", () => {
            it("It should DELETE an existing day", () => {
                const recipeId = "60b4075fb9fb3535701c760b";
                chai.request(router)
                    .delete("/" + recipeId)
                    .end((err, response) => {
                        response.should.have.status(200);
                    });
            });

            it("It should NOT DELETE a day that is not in the database", () => {
                const recipeId = "145";
                chai.request(router)
                    .delete("/" + recipeId)
                    .end((err, response) => {
                        response.should.have.status(404);
                        response.text.should.be.eq("The day with the provided ID does not exist.");
                    });
            });

        });
    });
});