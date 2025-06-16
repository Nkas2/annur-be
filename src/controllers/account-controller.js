import accountService from "../service/account-service.js";

const get = async (req, res, next) => {
    try {
        const result = await  accountService.get(req.body, req.user)
        res.status(200).json({
            data: result
        })
    } catch (e) {
        next(e)
    }
}

const create = async (req, res, next) => {
    try {
        const result = await accountService.create(req.body, req.user)
        res.status(200).json({
            data: result,
        })
    } catch (e) {
        next(e)
    }
}

const edit = async (req, res, next) => {
    try {
        req.body.id = req.params.id;
        const result = await accountService.edit(req.body, req.user)
        res.status(200).json({
            data: result,
        })
    } catch (e) {
        next(e)
    }
}

const remove = async (req, res, next) => {
    try {
        const result = await accountService.remove({
            id: req.params.id,
        }, req.user)
        res.status(200).json({
            data: result,
        })
    } catch (e) {
        next(e)
    }
}

export default {
    get, create, edit,remove
}