const JwtStrategy = require('passport-jwt').Strategy
//extractjwt extract jwt from headers
const ExtractJwt = require('passport-jwt').ExtractJwt
const status = require('http-status')
const { User } = require('../models')
//jwt strategy is used for verify jwt 
exports.getJwtStrategy = () => {
    const options = {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: "smart-key",
    }

    return new JwtStrategy(options, async (jwtPayload, done) => {
        const user = await User.findOne({_id:jwtPayload.id})
        if (!user)
            return done(
                {
                    message: 'No user found with the token',
                    status: status.BAD_REQUEST
                },
                null
            )

        done(false, user)
    })
}
