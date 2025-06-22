import eventService from "../service/event-service.js";

const get = async (req, res, next) => {
  try {
    const user = req.user;
    const request = {
      page: req.query.page,
      size: req.query.size,
    };
    const result = await eventService.get(request, user);
    res.status(200).json({
      data: result.data,
      paging: result.paging,
    });
  } catch (e) {
    next(e);
  }
};

const create = async (req, res, next) => {
  try {
    const result = await eventService.create(
      req.body || {},
      req.user,
      req.files,
    );
    res.status(200).json({
      data: result,
    });
  } catch (e) {
    console.log(e);

    next(e);
  }
};

const edit = async (req, res, next) => {
  try {
    req.body.id = req.params.id;
    const result = await eventService.edit(req.body, req.user, req.files);
    res.status(200).json({
      data: result,
    });
  } catch (e) {
    next(e);
  }
};

const remove = async (req, res, next) => {
  try {
    const result = await eventService.remove({
      id: req.params.id,
    });
    res.status(200).json({
      data: result,
    });
  } catch (e) {
    next(e);
  }
};

const createEventType = async (req, res, next) => {
  try {
    const result = await eventService.createEventType(req.body);
    res.status(200).json({
      data: result,
    });
  } catch (e) {
    next(e);
  }
};

const getEventType = async (req, res, next) => {
  try {
    const result = await eventService.getEventType();
    res.status(200).json({
      data: result,
    });
  } catch (e) {
    next(e);
  }
};

export default {
  get,
  create,
  edit,
  remove,
  createEventType,
  getEventType,
};
