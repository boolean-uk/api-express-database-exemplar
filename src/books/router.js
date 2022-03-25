const express = require('express')

const CreateBooksRouter = (db) => {
    const router = express.Router()
    const {getAllBooks} = createBooksDBFunctions(db)


    router.get('/', async (req, res) => {
        const type = req.query.type || null
        const books = await getAllBooks(type)
        res.status(200).json(books)
    })

    return router
}

const createBooksDBFunctions = (db) => {
    const getAllBooks = async (type = null) => {
        let query = 'SELECT * FROM books'
        let values = []
        if (type !== null) {
            query += ' WHERE type=$1'
            values.push(type)
        }
        
        try {
            const res = await db.query(query, values)
            return res.rows
        }catch(e) {
            console.error('error getting books:', e)
            return []
        }
    }

    return {getAllBooks}
}


module.exports = CreateBooksRouter