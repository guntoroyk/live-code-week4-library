const express = require('express');
const app = express();
const port = 3000;
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

const { Book, Loan } = require('./models')
const { formatDate, addTitle } = require('./helpers');

app.locals.formatDate = formatDate;
app.locals.addTitle = addTitle;

app.set('view engine', 'ejs');

app.use(express.urlencoded());

app.get('/books', (req, res) => {
    let errors = [];
    for (let key in req.query) {
        errors.push(req.query[key]);
    }

    Book.findAll({
        order: [['createdAt', 'DESC']]
    })
    .then(books => {
        res.render('books', {books, errors})
    })
    .catch(err => {
        res.send(err);
    })
})

app.post('/books', (req, res) => {
    Book.create({
        title: req.body.title,
        description: req.body.description,
        author: req.body.author
    })
    .then(book => {
        res.redirect('/books');
    })
    .catch(err => {
        let errors = [];
        let url = ``;
        err.errors.forEach((error, i) => {
            url += `err${i}=${error.message}&`;
        })
        res.redirect(`/books?${url}`)
    })
})

app.get('/books/:id/delete', (req, res) => {
    Book.destroy({where: {id: req.params.id}})
    .then(() => {
        return Loan.destroy({where: {BookId: req.params.id}})
    })
    .then(() => {
        res.redirect('/books')
    })
    .catch(err => {
        res.send(err);
    })
})

app.get('/books/:id/edit', (req, res) => {
    let errors = [];
    for (let key in req.query) {
        errors.push(req.query[key]);
    }

    Book.findByPk(req.params.id)
        .then(book => {
            res.render('editBook', {book, errors})
        })
        .catch(err => {
            res.send(err);
        })
})

app.post('/books/:id/edit', (req, res) => {
    Book.update({
        title: req.body.title,
        description: req.body.description,
        author: req.body.author
    }, {
        where : {id : req.params.id}
    })
    .then(() => {
        res.redirect('/books');
    })
    .catch(err => {
        let errors = [];
        let url = ``;
        err.errors.forEach((error, i) => {
            url += `err${i}=${error.message}&`;
        })
        res.redirect(`/books/${req.params.id}/edit?${url}`)
    })

})

app.get('/loans', (req, res) => {
    let errors = [];
    let loans;
    for (let key in req.query) {
        errors.push(req.query[key]);
        filters.push(req.query[key]);
    }

    Loan.findAll({
        include: [
            {model: Book}
        ],
        order: [['createdAt', 'DESC']],
    })
        .then(loansData => {
          loans = loansData;
          return Book.findAll({
              where: {availableToBorrow: true}, 
              order: [['title', 'ASC']]
            });
        })
        .then(books => [
            res.render('loans', {loans, books, errors})
        ])
        .catch(err => {
            res.send(err);
        })
})



app.post('/loans', (req, res) => {
    let date = new Date();
    date.setDate(date.getDate() + 2);

    Loan.create({
        borrowerName: req.body.borrowerName,
        borrowerGender: req.body.borrowerGender,
        dueDate: date,
        BookId: req.body.BookId
    })
    // diganti menggunakan hooks
    // .then(loans => {
    //     return Book.update({
    //         availableToBorrow: false
    //     }, {where: {id: req.body.BookId}})
    // })
    .then(() =>
        res.redirect('/loans')
    )
    .catch(err => {
        let errors = [];
        let url = ``;
        err.errors.forEach((error, i) => {
            url += `err${i}=${error.message}&`;
        })
        res.redirect(`/loans?${url}`)
    })
})

app.get('/loans/:id/return', (req, res) => {
    let BookId;
    Loan.findByPk(req.params.id, {
        include: [
            {model: Book}
        ]
    })
    .then(loan => {
        BookId = loan.Book.id;
        return Loan.update({returned: true}, {where: {id: req.params.id}})
    })
    .then(() => {
        return Book.update({availableToBorrow: true}, {where: {id: BookId}})
    })
    .then(() => {
        res.redirect('/loans')
    })
    .catch(err => {
        res.send(err);
    })
})

app.listen(port, () => console.log(`app listening on port ${port}`));