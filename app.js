// app.js
var exphbs = require('express-handlebars');

const express = require('express')
const methodOverride = require('method-override')
const app = express()
const port = process.env.PORT || 3000;
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/rotten-potatoes');
const bodyParser = require('body-parser');

const Review = require('./models/review');
const Comment = require('./models/comment');


app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('_method'))




app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.get('/', (req, res) => {
  Review.find()
    .then(reviews => {
      res.render('reviews-index', { reviews: reviews });
    })
    .catch(err => {
      console.log(err);
    })
})

app.get('/reviews/new', (req, res) => {
    res.render('reviews-new', {});
})

// SHOW
app.get('/reviews/:id', (req, res) => {
    Review.findById(req.params.id).then(review => {
        Comment.find({ reviewId: req.params.id }).then(comments => {
            res.render('reviews-show', { review: review, comments: comments })
        })
    }).catch((err) => {
        console.log(err.message)
    });
});

// CREATE
app.post('/reviews', (req, res) => {
    Review.create(req.body).then((review) => {
        console.log(review);
        res.redirect(`/reviews/${review._id}`);
    }).catch((err) => {
        console.log(err.message);
    })
})

// EDIT
app.get('/reviews/:id/edit', (req, res) => {
    Review.findById(req.params.id, function(err, review) {
        res.render('reviews-edit', {review: review});
    })
})

// UPDATE
app.put('/reviews/:id/', (req, res) => {
    Review.findByIdAndUpdate(req.params.id, req.body)
    .then(review => {
        res.redirect(`/reviews/${review._id}`)
    })
    .catch(err => {
        console.log(err.message)
    })
})

// DELETE
app.delete('/reviews/:id', function (req, res) {
    console.log("DELETE review")
    Review.findByIdAndRemove(req.params.id).then((review) => {
        // remove then redirect to the homepage
        res.redirect('/');
    }).catch((err) => {
        console.log(err.message);
    })
})


var reviewRoutes = require('./controllers/reviews')
var commentRoutes = require('./controllers/comments')

reviewRoutes(app, Review);
commentRoutes(app, Comment);

app.listen(port);


module.exports = app;
