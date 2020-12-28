import { cors } from '../../../lib/cors'
const db = require('../../../lib/db')
const { createUID } = require('../../../lib/createUID')
const escape = require('sql-template-strings')

export default async (req, res) => {
    await cors(req, res)

    if(req.method === 'GET'){
        const uid = req.query.uid

        const query = escape`
            SELECT list, ipAddress, createdAt
            FROM pools
            WHERE uid = ${uid};
        `

        const [ pool ] = await db.query(query)
        res.status(200).json({ pool })

    } else if(req.method === 'POST'){
        const pool = req.body.characterPool
        const uid = createUID(16)

        const ipAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress

        const insertResult = await db.query(escape`
            INSERT INTO pools (uid, list, ipAddress)
            VALUES ( ${uid}, ${JSON.stringify(pool)}, ${ipAddress});
        `)
    
        res.status(200).json({ result: insertResult, redirectUID: uid })
    }
}