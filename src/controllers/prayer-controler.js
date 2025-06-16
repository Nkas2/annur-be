import prayerService from "../service/prayer-service.js";
import eventService from "../service/event-service.js";

const get = async (req, res, next) => {
  try {
    const request = {
      page: req.query.page,
      size: req.query.size,
    };
    const result = await prayerService.get(request);
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
    const result = await prayerService.create(req.body, req.user);
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
    const result = await prayerService.edit(req.body);
    res.status(200).json({
      data: result,
    })
  } catch (e) {
    next(e);
  }
}

const remove = async (req, res, next) => {
  try {
    const result = await prayerService.remove({
      id: req.params.id,
    });
    res.status(200).json({
      data: result,
    })
  } catch (e) {
    console.log(e)
    next(e)
  }
}

export default {
  get, create, edit, remove
};
