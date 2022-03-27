import passport_local from 'passport-local';
import bcrypt from 'bcrypt';

const LocalStrategy = passport_local.Strategy

function initialize(passport: any, getUserByUsername: any, getUserById: any){
    const authenticateUser = async (username: any, password: any, done: any) => {
        const user = getUserByUsername(username)

        if(user == null){
            return done(null, false, { message: 'No user with that username or password' })
        }

        try{
            if(await bcrypt.compare(password, user.password)){
                return done(null, user)
            }

            else{
                return done(null, false, { message: 'No user with that username or password'})
            }
        }

        catch(e){
            return done(e)
        }
    }

    // @ts-ignore
    passport.use(new LocalStrategy({ usernameField: 'username' }, authenticateUser))
    passport.serializeUser((user: any, done: any) => done(null, user.id))
    passport.deserializeUser((id: any, done: any) => {
        return done(null, getUserById(id))
    })
}

module.exports = initialize