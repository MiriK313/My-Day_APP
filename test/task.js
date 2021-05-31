let chai = require("chai");
let chaiHttp = require("chai-http");
let my_server = require("../server");
let router = require("../routes/recipes");
const { response } = require("express");

//Assertion Style
chai.should();

chai.use(chaiHttp);

describe('Recipe API', () => {

    /**
     * Test the GET (by slug) route
     */
    describe("Show Recipe", () => {

        it("It should GET a recipe by SLUG", () => {
            const slug = "chicken-soup"
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

            const slug = "fish&fries";
            chai.request(router)
                .get("/" + slug)
                .end((err, response) => {
                    response.should.have.status(404);
                    response.text.should.be.eq("The task with the provided ID does not exist.");
                });
        });

    });

    /**
     * Test the POST route
     */
    describe("POST recipe", () => {
        it("It should POST a new recipe", () => {
            const recipe = {
                title: "New Recipe",
                description: "this is new recipe",
                createdAt: Date.now,
                markdown: "this is markdown"

            };
            chai.request(router)
                .post("/")
                .send(recipe)
                .end((err, response) => {
                    response.should.have.status(201);
                    response.body.should.be.a('object');
                    response.body.should.have.property('title').eq("New Recipe");
                    response.body.should.have.property('description').eq("this is new recipe");
                    response.body.should.have.property('createdAt').eq(Date.now);
                    response.body.should.have.property('markdown').eq("this is markdown");
                });
        });

        it("It should NOT POST a new recipe without the title typed", () => {
            const recipe = {
                description: "this is new recipe",
                createdAt: Date.now,
                markdown: "this is markdown"

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
    describe("PUT (update) Recipe", () => {
        it("It should PUT new values to an existing task", () => {
            const taskId = "60b4ce899a8250313c268a45";
            const recipe = {
                title: "New name for Recipe",
            };
            chai.request(router)
                .put("/" + taskId)
                .send(recipe)
                .end((err, response) => {
                    response.should.have.status(200);
                    response.body.should.be.a('object');
                    response.body.should.have.property('_id').eq("60b4ce899a8250313c268a45");
                    response.body.should.have.property('title').eq("New name for Recipe");
                });
        });

        it("It should NOT PUT an existing task with a no title typed", () => {
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
        describe("DELETE recipe", () => {
            it("It should DELETE an existing recipe", () => {
                const recipeId = "60b4075fb9fb3535701c760b";
                chai.request(router)
                    .delete("/" + recipeId)
                    .end((err, response) => {
                        response.should.have.status(200);
                    });
            });

            it("It should NOT DELETE a recipe that is not in the database", () => {
                const recipeId = "145";
                chai.request(router)
                    .delete("/" + recipeId)
                    .end((err, response) => {
                        response.should.have.status(404);
                        response.text.should.be.eq("The recipe with the provided ID does not exist.");
                    });
            });

        });
    });
});