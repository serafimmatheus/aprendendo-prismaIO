import { FastifyReply, FastifyRequest } from "fastify";
import { prisma } from "../database/prisma";
import { z } from "zod";

class TeacherControllers {
  async allTeachers(req: FastifyRequest, res: FastifyReply) {
    try {
      const teachers = await prisma.teachers.findMany();
      return res.status(200).send(teachers);
    } catch (error) {
      return res.status(500).send({ message: "Internal Server Error" });
    }
  }

  async findTeacherByName(req: FastifyRequest, res: FastifyReply) {
    try {
      const schemaParams = z.object({
        name: z.string().optional(),
      });

      const { name } = schemaParams.parse(req.params);

      const findTeacherByname = await prisma.teachers.findMany({
        where: {
          name: {
            contains: name,
            mode: "insensitive",
          },
        },
      });

      if (!findTeacherByname) {
        return res.status(401).send({ message: "User not found" });
      }

      return res.status(200).send(findTeacherByname || []);
    } catch (error) {
      return res.status(500).send({ message: "Internal Server Error" });
    }
  }

  async createTeacher(req: FastifyRequest, res: FastifyReply) {
    try {
      const schemaBody = z.object({
        name: z.string(),
      });

      const { name } = schemaBody.parse(req.body);

      const teacher = await prisma.teachers.create({
        data: {
          name,
        },
      });

      return res.status(201).send(teacher);
    } catch (error) {
      return res.status(500).send({ message: "Internal Server Error" });
    }
  }

  async updatedTeacher(req: FastifyRequest, res: FastifyReply) {
    try {
      const schemaParams = z.object({
        id: z.string(),
      });

      const schemaBody = z.object({
        name: z.string(),
      });

      const { id } = schemaParams.parse(req.params);
      const { name } = schemaBody.parse(req.body);

      const findTeacherById = await prisma.teachers.findFirst({
        where: {
          id,
        },
      });

      if (!findTeacherById) {
        return res.status(401).send({ message: "User not found" });
      }

      await prisma.teachers.update({
        where: {
          id: findTeacherById.id,
        },

        data: {
          name,
        },
      });

      return res.status(204).send();
    } catch (error) {
      return res.status(500).send({ message: "Internal Server Error" });
    }
  }

  async deletedTeacher(req: FastifyRequest, res: FastifyReply) {
    try {
      const schemaParams = z.object({
        id: z.string(),
      });

      const { id } = schemaParams.parse(req.params);

      await prisma.teachers.delete({
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

export default new TeacherControllers();
