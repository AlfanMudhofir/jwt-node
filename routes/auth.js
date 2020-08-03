const router = require('express').Router();
const User = require('../model/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { registerValidation, loginValidation } = require('../validation');

router.post('/register', async (req, res) => {

    //validation
    const { error } = registerValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    //Check database
    const emailExist = await User.findOne({ email: req.body.email });
    if (emailExist) return res.status(400).send('Email already exist');

    //Hash password
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.password, salt);

    //Create User
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashPassword
    });
    try {
        await user.save();
        res.send({ user: user._id });
    } catch (err) {
        res.status(400).send(err);
    }
});

//LOGIN
router.post('/login', async (req, res) => {
    //validation
    const { error } = loginValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    //Check database
    const userData = await User.findOne({ email: req.body.email });
    if (!userData) return res.status(400).send('Email or password is no correct');

    //Password Correct
    const validPass = await bcrypt.compare(req.body.password, userData.password);
    if (!validPass) return res.status(400).send('Email or password is no correct!');

    //Create and assign token
    const token = jwt.sign({ _id: userData._id }, process.env.TOKEN);
    res.header('auth-token', token).send(token);
});

module.exports = router;