import { FastifyReply, FastifyRequest } from "fastify";
import { prisma } from "../database/prisma";
import { z } from "zod";

class CoursesControllers {
  async findCourseById(req: FastifyRequest, res: FastifyReply) {
    const { name }: any = req.params;
    try {
      const findOneCourseByName = await prisma.courses.findMany({
        where: {
          name: {
            contains: name,
            mode: "insensitive",
          },
        },
      });

      return res.status(200).send(findOneCourseByName || []);
    } catch (error) {
      return res.status(500).send({ message: "Internal Server Error" });
    }
  }

  async allCourses(req: FastifyRequest, res: FastifyReply) {
    try {
      const courses = await prisma.courses.findMany({
        include: {
          teacher: true,
        },
      });

      const newCourses = courses.map((course) => {
        return { ...course, teachersId: undefined };
      });

      return res.status(200).send(newCourses);
    } catch (err) {
      return res.status(500).send({ message: "Internal Server Error" });
    }
  }

  async createCourses(req: FastifyRequest, res: FastifyReply) {
    const schemaBody = z.object({
      name: z.string(),
      description: z.string().optional(),
      duration: z.number(),
      teachersId: z.string(),
    });

    const { name, description, duration, teachersId } = schemaBody.parse(
      req.body
    );

    try {
      const course = await prisma.courses.create({
        data: {
          name,
          description,
          duration,
          teacher: {
            connect: {
              id: teachersId,
            },
          },
        },
      });

      return res.status(201).send(course);
    } catch (error) {
      return res.status(500).send({ message: "Internal Server Error" });
    }
  }

  async updatedCourses(req: FastifyRequest, res: FastifyReply) {
    const schemaBody = z.object({
      name: z.string().optional(),
      description: z.string().optional(),
      duration: z.number().optional(),
    });

    const { name, description, duration } = schemaBody.parse(req.body);

    try {
      const { id }: any = req.params;
      const findUser = await prisma.courses.findFirst({
        where: {
          id,
        },
      });

      if (!findUser) {
        return res.status(401).send({ message: "User not found" });
      }

      await prisma.courses.update({
        where: {
          id,
        },
        data: {
          name,
          description,
          duration,
        },
      });

      return res.status(204).send();
    } catch (error) {
      return res.status(500).send({ message: "Internal Server Error" });
    }
  }

  async deletedCourses(req: FastifyRequest, res: FastifyReply) {
    const { id }: any = req.params;

    try {
      await prisma.courses.delete({
        where: {
          id,
        },
      });

      return res.status(204).send();
    } catch (error) {
      return res.status(500).send({ message: "Internal Server Error" });
    }
  }
}

export default new CoursesControllers();
