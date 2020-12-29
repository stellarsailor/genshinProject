import { cors } from '../../../lib/cors'
const db = require('../../../lib/db')
const { createUID } = require('../../../lib/createUID')
const escape = require('sql-template-strings')

export default async (req, res) => {
    await cors(req, res)

    if(req.method === 'GET'){
        const uid = req.query.uid

        const query = escape`
            SELECT list, createdAt
            FROM pools
            WHERE uid = ${uid};
        `

        const completedPartyQuery = escape`
            SELECT id, compString, c1, c2, c3, c4, c5, c6, c7, c8, likes, createdAt
            FROM parties
            WHERE pool_uid = ${uid}
            ORDER BY likes DESC;
        `

        const [ pool ] = await db.query(query)
        const recommendedParty = await db.query(completedPartyQuery)

        res.status(200).json({ pool: pool, recommendedParty: recommendedParty})

    } else if(req.method === 'POST'){
        const pool = req.body.characterPool
        const uid = createUID(12)

        const ipAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress

        const insertResult = await db.query(escape`
            INSERT INTO pools (uid, list, ipAddress)
            VALUES ( ${uid}, ${JSON.stringify(pool)}, ${ipAddress});
        `)
    
        res.status(200).json({ result: insertResult, redirectUID: uid })
    } else if(req.method === 'PUT'){
        const uid = req.body.uid
        const partyCompString = req.body.partyCompString
        const partyCompArray = req.body.partyCompArray
        const ipAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress

        if(partyCompArray.length === 8){
            const insertResult = await db.query(escape`
                INSERT INTO parties (pool_uid, compString, c1, c2, c3, c4, c5, c6, c7, c8, ipAddress)
                VALUES ( ${uid}, ${partyCompString} , ${partyCompArray.map(v => `${parseInt(v)},`)}, ${ipAddress});
            `)
            res.status(200).json({ result: insertResult })
        }
    }
}