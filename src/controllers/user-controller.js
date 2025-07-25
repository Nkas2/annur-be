import userService from '../service/user-sevice.js';

const login = async (req, res, next) => {
    try {
        const result = await userService.login(req.body);
        res.status(200).json({
            data: result,
        })
    } catch (e) {
        next(e)
    }
}

const get = async (req, res, next) => {
    try {
        const username = req.user.username;
        const result = await userService.get(username);
        res.status(200).json({
            data: result,
        })
    } catch (e) {
        next(e)
    }
}

export default {
    login,
    get
}