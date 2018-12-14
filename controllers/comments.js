// comments.js

module.exports = (app, Comment) => {

    // NEW Coment
    app.post('/reviews/comments', (req, res) => {
        Comment.create(req.body).then(comment => {
            res.redirect(`/reviews/${comment.reviewId}`);
        }).catch((err) => {
            console.log(err.message);
        });
    });
    

    // DELETE Comment
    app.delete('/reviews/comments/:id', function (req, res) {
        console.log("DELETE Comment")
        Comment.findByIdAndRemove(req.params.id).then((comment) => {
            res.redirect(`/reviews/${comment.reviewId}`);
        }).catch((err) => {
            console.log(err.message);
        })
    })


}
