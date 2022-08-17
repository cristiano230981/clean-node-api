export default {
    mongoUrl: process.env.MONGO_URL || 'mongodb://localhost:27017/clean-node-api',
    port: process.env.port || 3000,
    jwtScret: process.env.JWT_SECRET || '#843jkds9432-3',
}