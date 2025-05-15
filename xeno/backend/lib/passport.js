import passport from "passport";
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as GitHubStrategy } from 'passport-github2';
import bcrypt from 'bcrypt';
import Admin from '../models/Admin.js';


passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL,
},
    async (accessToken, refreshToken, profile, done) => {
        try {
            
            const existingAdmin = await Admin.findOne({ emailId: profile.emails[0].value });
            console.log("here",profile)
            if (existingAdmin) {
                return done(null, existingAdmin);
            }

            const newAdmin = new Admin({
                firstName: profile.name.givenName,
                lastName: profile.name.familyName,
                emailId: profile.emails[0].value,
                password: null,
            });

            await newAdmin.save();
            return done(null, newAdmin);
        } catch (err) {
            return done(err, null);
        }
    }
));

passport.use(
    new LocalStrategy(
        {
            usernameField: 'emailId',
            passwordField: 'password',
        },
        async (emailId, password, done) => {
            try {
               
                let user = await Admin.findOne({ emailId });

                if (!user) {
                    // Case 1: User doesn't exist — create new entry
                    const hashedPassword = await bcrypt.hash(password, 10);
                    const names = emailId.split('@')[0].split('.');
                    const firstName = names[0] || 'Admin';
                    const lastName = names[1] || '';

                    user = new Admin({
                        emailId,
                        password: hashedPassword,
                        firstName,
                        lastName,
                    });

                    await user.save();
                    return done(null, user);
                }

                if (user.password === null) {
                    // Case 2: Google signup earlier, update password
                    const hashedPassword = await bcrypt.hash(password, 10);
                    user.password = hashedPassword;
                    await user.save();
                    return done(null, user);
                }

                // Case 3: Password login flow
                const isMatch = await bcrypt.compare(password, user.password);
                if (!isMatch) {
                    return done(null, false, { message: 'Invalid credentials' });
                }
                console.log("printing",user)
                // Success
                return done(null, user);
            } catch (err) {
                return done(err);
            }
        }
    )
);

passport.use(
    new GitHubStrategy(
        {
            clientID: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET,
            callbackURL: process.env.GITHUB_CALLBACK_URL,
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                const email = profile.emails?.[0]?.value;
                let user = await Admin.findOne({ emailId: email });

                if (!user) {
                    user = new Admin({
                        emailId: email,
                        firstName: profile.displayName || profile.username || 'GitHubUser',
                        lastName: '',
                        password: null, // GitHub login doesn't use password
                    });

                    await user.save();
                }

                return done(null, user);
            } catch (err) {
                return done(err);
            }
        }
    )
);

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
    const user = await Admin.findById(id);
    done(null, user);
});

export default passport;