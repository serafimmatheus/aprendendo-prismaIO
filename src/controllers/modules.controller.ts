import { FastifyReply, FastifyRequest } from "fastify";
import { prisma } from "../database/prisma";
import { z } from "zod";

class ModulesControllers {
  async allModules(req: FastifyRequest, res: FastifyReply) {
    try {
      const modules = await prisma.modules.findMany();
      return res.status(200).send(modules);
    } catch (error) {
      return res.status(500).send({ message: "Internal Server Error" });
    }
  }

  async findModulesByName(req: FastifyRequest, res: FastifyReply) {
    const schemaParams = z.object({
      name: z.string(),
    });

    const { name } = schemaParams.parse(req.params);

    try {
      const findModuleByName = await prisma.modules.findMany({
        where: {
          name: {
            contains: name,
            mode: "insensitive",
          },
        },
      });

      return res.status(200).send(findModuleByName || []);
    } catch (error) {
      return res.status(500).send({ message: "Internal Server Error" });
    }
  }

  async createModules(req: FastifyRequest, res: FastifyReply) {
    const schemaBody = z.object({
      name: z.string(),
      description: z.string().optional(),
    });

    const { name, description } = schemaBody.parse(req.body);
    try {
      const module = await prisma.modules.create({
        data: {
          name,
          description,
        },
      });

      return res.status(201).send(module);
    } catch (error) {
      return res.status(500).send({ message: "Internal Server Error" });
    }
  }

  async updatedModules(req: FastifyRequest, res: FastifyReply) {
    const schemaBody = z.object({
      name: z.string().optional(),
      description: z.string().optional(),
    });

    const schemaParams = z.object({
      id: z.string(),
    });

    const { id } = schemaParams.parse(req.params);
    const { name, description } = schemaBody.parse(req.body);

    try {
      const isModule = await prisma.modules.findFirst({
        where: {
          id,
        },
      });

      if (!isModule) {
        return res.status(401).send({ message: "Module not found" });
      }

      await prisma.modules.update({
        where: {
          id: isModule.id,
        },
        data: {
          name,
          description,
        },
      });

      return res.status(204).send();
    } catch (error) {
      return res.status(500).send({ message: "Internal Server Error" });
    }
  }

  async deletedModules(req: FastifyRequest, res: FastifyReply) {
    const schemaParams = z.object({
      id: z.string(),
    });

    const { id } = schemaParams.parse(req.params);

    try {
      const isModule = await prisma.modules.findFirst({
        where: {
          id,
        },
      });

      if (!isModule) {
        return res.status(401).send({ message: "Module not found" });
      }

      await prisma.modules.delete({
        where: {
          id,
        },
      });
    } catch (error) {
      return res.status(500).send({ message: "Internal Server Error" });
    }
  }
}

export default new ModulesControllers();
