import { cors } from '../../../lib/cors'
const db = require('../../../lib/db')
const { createUID } = require('../../../lib/createUID')
const escape = require('sql-template-strings')

export default async (req, res) => {
    await cors(req, res)

    if(req.method === 'GET'){

        const uid = req.query.uid

        const query = escape`
            SELECT id, title, list, createdAt
            FROM pools
            WHERE uid = ${uid};
        `

        const savedPartyListQuery = escape`
            SELECT id, fhArray, shArray, likes, createdAt
            FROM parties
            WHERE pool_id = (SELECT id FROM pools WHERE uid = ${uid})
            ORDER BY likes DESC;
        `

        const [ pool ] = await db.query(query)
        const savedPartyList = await db.query(savedPartyListQuery)

        res.status(200).json({ pool: pool, savedPartyList: savedPartyList})

    } else if(req.method === 'POST'){

        const title = req.body.title
        const pool = req.body.characterPool
        const uid = createUID(12)

        const ipAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress

        const insertResult = await db.query(escape`
            INSERT INTO pools (uid, title, list, ipAddress)
            VALUES ( ${uid}, ${title}, ${JSON.stringify(pool)}, ${ipAddress});
        `)
    
        res.status(200).json({ result: insertResult, redirectUID: uid })

    } else if(req.method === 'PUT'){

        const pool_id = req.body.pool_id
        const compString = req.body.compString
        const compArray = req.body.compArray
        const fhString = req.body.fhString
        const fhArray = req.body.fhArray
        const shString = req.body.shString
        const shArray = req.body.shArray
        const ipAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress

        const insertHistoryLog = await db.query(escape`INSERT INTO parties_log (pool_id, compString, ipAddress) VALUES(${pool_id}, ${compString}, ${ipAddress});`)

        const checkDuplication = await db.query(escape`SELECT COUNT(*) as isExist FROM parties WHERE fhString = ${fhString} AND shString = ${shString};`)

        if(checkDuplication[0].isExist === 0){
            const insertResult = await db.query(escape`
                INSERT INTO parties (pool_id, compString, compArray, fhString, fhArray, shString, shArray, ipAddress)
                VALUES(${pool_id}, ${compString}, ${compArray}, ${fhString}, ${fhArray}, ${shString}, ${shArray}, ${ipAddress});
            `)
            res.status(200).json({ result: insertResult })
        } else {
            const updateResult = await db.query(escape`
            UPDATE parties 
            SET likes = likes + 1, updatedAt = now() 
            WHERE fhString = ${fhString} AND shString = ${shString} AND pool_id = ${pool_id};`)
            res.status(200).json({ result: updateResult })
        }

    }
}