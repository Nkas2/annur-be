import { prismaClient } from "../application/database.js";
import { ResponseError } from "../error/response-error.js";
import {
  createPrayerValidation,
  editPrayerValidation,
  getPrayerValidation,
  removePrayerValidation
} from "../validation/prayer-validation.js";
import { validate } from "../validation/validation.js";
import {createEventValidation} from "../validation/event-validation.js";

const get = async (request) => {
  request = validate(getPrayerValidation, request);

  const skip = (request.page - 1) * request.size;

  const prayer = await prismaClient.prayerSchedule.findMany({
    take: request.size,
    skip: skip,
  });

  const total = await prismaClient.prayerSchedule.count();

  return {
    data: prayer,
    paging: {
      page: request.page,
      total_item: total,
      total_page: Math.ceil(total / request.size),
    },
  };
};

const create = async (request, user) => {
  request = validate(createPrayerValidation, request);

  console.log(user)
  const prayer = await prismaClient.prayerSchedule.create({
    data: {
      name: request.name,
      schedule: request.schedule,
      created_by: {
        connect: {
          id: user.id,
        }
      }
    },
    select: {
      name: true,
      schedule: true
    }
  })

  return prayer;
}

const edit = async (request) => {
  request = validate(editPrayerValidation, request);

  const count = await prismaClient.prayerSchedule.count({
    where: {
      id: request.id
    }
  })

  if (count !== 1) {
    throw new ResponseError(404, "Event not found")
  }

  return prismaClient.prayerSchedule.update({
    where: {
      id: request.id,
    },
    data: {
      name: request.name,
      schedule: request.schedule,
    }
  })
}

const remove = async (request) => {
  request = validate(removePrayerValidation, request);

  const count = await prismaClient.prayerSchedule.count({
    where: {
      id: request.id
    }
  })

  if (count !== 1) {
    throw new ResponseError(404, "Prayer not found")
  }

  return prismaClient.prayerSchedule.delete({
    where: {
      id: request.id,
    }
  })
}

export default {
  get, create, edit, remove
};
