import initMiddleware from "./init-middleware"
import Cors from 'cors'

export const cors = initMiddleware(
    Cors({
        origin: ['https://genshinparty.com', 'http://localhost:3000', 'http://192.168.0.102/'],
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    })
)