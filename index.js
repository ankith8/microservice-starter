
const { send } = require('micro')
const url = require('url')

const level = require('level')
const promisify = require('then-levelup')

const db = promisify(level('visits.db',{
    valueEncoding: 'json'
}))

const visits = {}

module.exports = async function (req,res) {
    // Your microservice here

    const { pathname } = url.parse(req.url)
    try{
        const currentVisits = await db.get(pathname)
        await db.put(pathname, currentVisits+1)
    } catch (error) {
        if (error.notFound) await db.put(pathname, 1)
    }

    // if(visits[pathname]) {
    //     visits[pathname] = visits[pathname]+1;
    // } else {
    //     visits[pathname] = 1
    // }
    // console.log(pathname)
    send(res,200,`This page has ${await db.get(pathname)} visits`);
}