// test-reviews.js

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../app');
const should = chai.should();
const Review = require('../models/review');

const sampleReview =    {
    "title": "Best movie",
    "movie-title": "Interstellar",
    "description": "movie about space and scifi"
}

chai.use(chaiHttp);

// this tells mocha you want to test Reviews
describe('Reviews', () => {

    // this method deletes all our reviews after each test
    after(() => {
        Review.deleteMany({title: "Best movie"}).exec((err, reviews) => {
            console.log(reviews)
            reviews.remove();
        })
    });

    // TEST INDEX
    it('should index ALL reviews on / GET', (done) => {
        //uses chai-http to request to your server
        chai.request(server)
            // sends a GET request to root route
            .get('/')
            // waits for response
            .end((err, res) => {
                // check that the response status is=200(success)
                res.should.have.status(200);
                // checks that the response is a type html
                res.should.be.html;
                //end this test and move on to the next
                done();
            });
    });

    //TEST NEW
    it('should index ALL reviews on /reviews/new GET', (done) => {
        chai.request(server)
            .get(`/reviews/new`)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.should.be.html;
                    done();
                });
    });

    //TEST CREATE
    it('should create a SINGLE review on /reviews POST', (done) => {
        chai.request(server)
            .post('/reviews')
            .send(sampleReview)
            .end((err, res) => {
                res.should.have.status(200);
                res.should.be.html
                done();
            });
    });

    //TEST SHOW
    it('should show a SINGLE review on /reviews/<id> GET', (done) => {
        // uses the sampleReview to generate a new Review in our DB
        var review = new Review(sampleReview);
        review.save((err, data) => {
            chai.request(server)
                .get(`/reviews/${data._id}`)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.should.be.html
                    done();
                });
        });
    });

    //TEST EDIT
    it('should edit a SINGLE review on /reviews/<id>/edit GET', (done) => {
        var review = new Review(sampleReview);
        review.save((err, data) => {
            chai.request(server)
                .get(`/reviews/${data._id}/edit`)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.should.be.html
                    done();
                });
        });
    });

    //TEST UPDATE
    it('should update a SINGLE review on /reviews/<id> PUT', (done) => {
        var review = new Review(sampleReview);
        review.save((err, data) => {
            chai.request(server)
                .put(`/reviews/${data._id}?_method=PUT`)
                .send({'title': 'Updating the title'})
                .end((err, res) => {
                    res.should.have.status(200);
                    res.should.be.html
                    done();
                });
        });
    });

    //TEST DELETE
    it('should delete a SINGLE review on /reviews/<id> DELETE', (done) => {
        var review = new Review(sampleReview);
        review.save((err, data) => {
            chai.request(server)
            .delete(`/reviews/${data._id}?_method=DELETE`)
            .end((err, res) => {
                res.should.have.status(200);
                res.should.be.html
                done();
            });
        });
    });

});
