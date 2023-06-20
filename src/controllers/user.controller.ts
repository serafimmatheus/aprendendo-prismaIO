import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { prisma } from "../database/prisma";
import { compare, hash } from "bcryptjs";

class UserControllers {
  async create(req: FastifyRequest, res: FastifyReply) {
    const schemaBody = z.object({
      name: z.string(),
      email: z.string().email(),
      password: z.string().min(6),
    });

    const { name, email, password } = schemaBody.parse(req.body);

    try {
      const password_hash = await hash(password, 10);

      const user = await prisma.user.create({
        data: {
          name,
          email,
          password: password_hash,
        },
      });

      return res.status(201).send(user);
    } catch (error) {}
  }

  async login(req: FastifyRequest, res: FastifyReply) {
    const schemaBody = z.object({
      email: z.string().email(),
      password: z.string(),
    });

    const { email, password } = schemaBody.parse(req.body);

    try {
      const isUser = await prisma.user.findFirst({
        where: {
          email,
        },
      });

      if (!isUser) {
        return res.status(401).send({ message: "User our E-mail inválid" });
      }

      const isPasswordIsValid = await compare(password, isUser.password);

      if (!isPasswordIsValid) {
        return res.status(401).send({ message: "User our E-mail inválid" });
      }

      const token = await res.jwtSign(
        {},
        {
          sign: {
            sub: isUser.id,
          },
        }
      );

      const newUser = {
        ...isUser,
        password: undefined,
      };

      return res.status(201).send({ token, user: newUser });
    } catch (error) {
      return res.status(500).send({ message: "Internal Server Error" });
    }
  }
}

export default new UserControllers();
