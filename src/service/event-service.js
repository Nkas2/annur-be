import { prismaClient } from "../application/database.js";
import { ResponseError } from "../error/response-error.js";
import {
  createEventValidation,
  deleteEventValidation,
  editEventValidation,
  getEventValidation,
} from "../validation/event-validation.js";
import { validate } from "../validation/validation.js";

const get = async (request, user) => {
  request = validate(getEventValidation, request);
  const skip = (request.page - 1) * request.size;

  const events = await prismaClient.event.findMany({
    take: request.size,
    skip: skip,
  });

  const total = await prismaClient.event.count();

  return {
    data: events,
    paging: {
      page: request.page,
      total_item: total,
      total_page: Math.ceil(total / request.size),
    },
  };
};

const create = async (request, user, files) => {
  request = validate(createEventValidation, request);

  const imageData = files?.map((file) => {
    return { path: file.filename };
  });

  const createEvent = await prismaClient.event.create({
    data: {
      title: request.title,
      description: request.description,
      event_start: new Date(request.event_start),
      event_end: new Date(request.event_end),
      created_by: {
        connect: { id: user.id },
      },
      type: {
        connect: { id: request.type_id },
      },
      images: {
        create: imageData,
      },
    },
    include: {
      images: true,
    },
  });

  return createEvent;
};

const edit = async (request, user, files) => {
  request = validate(editEventValidation, request);

  const imageData = files?.map((file) => {
    return { path: file.filename };
  });

  const event = await prismaClient.event.findFirst({
    where: {
      id: request.id,
    },
  });

  if (!event) {
    throw new ResponseError(404, "Event not found");
  }

  await prismaClient.image.deleteMany({
    where: {
      eventId: event.id,
    },
  });

  return prismaClient.event.update({
    where: {
      id: event.id,
    },
    data: {
      title: request.title,
      description: request.description,
      event_start: new Date(request.event_start),
      event_end: new Date(request.event_end),
      created_by: {
        connect: { id: user.id },
      },
      type: {
        connect: { id: request.type_id },
      },
      images: {
        create: imageData,
      },
    },
  });
};

const remove = async (request) => {
  request = validate(deleteEventValidation, request);

  const count = await prismaClient.event.count({
    where: {
      id: request.id,
    },
  });

  if (count !== 1) {
    throw new ResponseError(404, "Event not found");
  }

  return prismaClient.event.delete({
    where: {
      id: request.id,
    },
  });
};

const createEventType = async (request) => {
  return prismaClient.eventType.create({
    data: {
      name: request.title,
    },
  });
};

const getEventType = async () => {
  return prismaClient.eventType.findMany({});
};

export default {
  get,
  create,
  edit,
  remove,
  createEventType,
  getEventType,
};
