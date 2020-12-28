import { cors } from '../../../lib/cors'
const db = require('../../../lib/db')
const escape = require('sql-template-strings')

export default async (req, res) => {
    await cors(req, res)

    if(req.method === 'GET'){
        const characters = await db.query(escape`
        SELECT *
        FROM characters;
        `)

        const weapons = await db.query(escape`
        SELECT *
        FROM weapons;
        `)

        res.status(200).json({
            characters: characters,
            weapons: weapons
        })
    }
}