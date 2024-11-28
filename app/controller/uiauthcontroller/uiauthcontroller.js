const UserModel = require('../../model/user');
const { comparePassword } = require('../../middleware/auth');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

class uiauthcontroller {

    // Register form
    async registerGet(req, res) {
        return res.render('authview/register', { user: req.user });
    }


    // Register post data 
    async registerPost(req, res) {
        try {
            const { name, email, password, role } = req.body;
            if (!name || !email || !password || !role || !req.file) {
                req.flash('err', 'All fields are required');
                return res.redirect('/register');
            }
            const existingUser = await UserModel.findOne({ email });
            if (existingUser) {
                req.flash('err', 'User already exist with this email');
                return res.redirect('/register');
            }
            if (password.length < 8) {
                req.flash('err', 'Password will be atleast 8 characters long');
                return res.redirect('/register');
            }
            // Hash password
            const salt = bcrypt.genSaltSync(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            const user = new UserModel({
                ...req.body, password: hashedPassword, image: req.file.path
            });
            // Save user to database
            await user.save();
            req.flash('sucess', 'Registration sucessfull');
            return res.redirect('/login');
        } catch (error) {
            req.flash('err', 'Unexpected error');
            return res.redirect('/register');
        }
    }

    // For Login form
    async loginGet(req, res) {
        return res.render('authview/login', { user: req.user });
    }

    // For Login
    async loginPost(req, res) {
        try {
            const { email, password } = req.body;
            if (!email || !password) {
                req.flash('err', 'All fields are required');
                return res.redirect('/login');
            }
            const user = await UserModel.findOne({ email });
            if (!user) {
                req.flash('err', 'User Not Found');
                return res.redirect('/login');
            }

            const isMatch = comparePassword(password, user.password);
            if (!isMatch) {
                req.flash('err', 'Invalid Credential');
                return res.redirect('/login');
            }
            // Generate a JWT token
            const token = jwt.sign({
                _id: user._id,
                name: user.name,
                email: user.email,
                image: user.image,
                role: user.role
            }, process.env.API_KEY, { expiresIn: "1d" });

            // Handling token in cookie
            if (token) {
                res.cookie('user_auth', token);
                req.flash('sucess', 'Login Successfully')
                return res.redirect('/');
            } else {
                req.flash('err', 'Something went wrong')
                return res.redirect('/login');
            }
        } catch (error) {
            console.error('Error during login:', error);
            return res.status(500).send('An unexpected error occurred');
        }
    }

    // Handle Logout
    async logout(req, res) {
        res.clearCookie('user_auth');
        req.flash('sucess', 'Logout Successfully')
        return res.redirect('/login');
    }
}

module.exports = new uiauthcontroller();


