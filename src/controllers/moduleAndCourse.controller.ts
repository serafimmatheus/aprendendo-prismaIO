import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { prisma } from "../database/prisma";

class ModuleAndCourseController {
  async allModuleAndCourse(req: FastifyRequest, res: FastifyReply) {
    try {
      const all = await prisma.coursesModules.findMany({
        include: {
          course: true,
          module: true,
        },
      });

      const newAll = all.map((elem) => {
        return { ...elem, modulesId: undefined, courseId: undefined };
      });

      return res.status(200).send(newAll);
    } catch (error) {}
  }

  async findModuleAndCourseById(req: FastifyRequest, res: FastifyReply) {}

  async createModuleAndCourse(req: FastifyRequest, res: FastifyReply) {
    const schemaBody = z.object({
      courseId: z.string(),
      modulesId: z.string(),
      name: z.string().optional(),
    });

    const { name, courseId, modulesId } = schemaBody.parse(req.body);

    try {
      const create = await prisma.coursesModules.create({
        data: {
          courseId,
          modulesId,
          name,
        },
      });

      return res.status(201).send(create);
    } catch (error) {
      return res.status(500).send({ message: "Internal Server Error" });
    }
  }

  async updatedModuleAndCourse(req: FastifyRequest, res: FastifyReply) {}

  async deletedModuleAndCourse(req: FastifyRequest, res: FastifyReply) {
    const schemaParams = z.object({
      id: z.string(),
    });

    const { id } = schemaParams.parse(req.params);

    try {
      const isModuleAndCourse = await prisma.coursesModules.findFirst({
        where: {
          id,
        },
      });

      if (!isModuleAndCourse) {
        return res.status(401).send({ message: "Not found" });
      }

      await prisma.coursesModules.delete({
        where: {
          id: isModuleAndCourse.id,
        },
      });

      return res.status(204).send();
    } catch (error) {
      return res.status(500).send({ message: "Internal Server Error" });
    }
  }
}

export default new ModuleAndCourseController();
