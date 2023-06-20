import fastify from "fastify";
import coursesController from "./controllers/courses.controller";
import teacherController from "./controllers/teacher.controller";
import modulesController from "./controllers/modules.controller";
import moduleAndCourseController from "./controllers/moduleAndCourse.controller";
import userController from "./controllers/user.controller";
import fastifyJwt from "@fastify/jwt";
import { env } from "./env";
import fastifyCors from "@fastify/cors";
import { ZodError } from "zod";
import { verifyJWT } from "./middlewares/verify-jwt";

export const app = fastify();

app.register(fastifyCors, {
  origin: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  allowedHeaders: ["Content-Type"],
});

app.register(fastifyJwt, {
  secret: env.SECURITY_TOKEN,
});

app.setErrorHandler((error, req, res) => {
  if (error instanceof ZodError) {
    return res
      .status(400)
      .send({ message: "Validation error.", issues: error.format() });
  }

  if (env.NODE_ENV === "production") {
    console.error(error);
  } else {
    // TODO fazer integracao com um log de erro de alguma ferramenta externa qnd tiver em producao
  }

  return res.status(500).send({ message: "Internal server error" });
});

// ROUTES USERS

app.post("/api/v1/user/create", userController.create);

// ROUTES LOGIN

app.post("/api/v1/login", userController.login);

// ROUTES COURSES
app.get(
  "/api/v1/cursos/:name",
  { onRequest: [verifyJWT] },
  coursesController.findCourseById
);

app.get(
  "/api/v1/cursos",
  { onRequest: [verifyJWT] },
  coursesController.allCourses
);

app.post(
  "/api/v1/cursos",
  { onRequest: [verifyJWT] },
  coursesController.createCourses
);

app.put(
  "/api/v1/cursos/:id",
  { onRequest: [verifyJWT] },
  coursesController.updatedCourses
);

app.delete(
  "/api/v1/cursos/:id",
  { onRequest: [verifyJWT] },
  coursesController.deletedCourses
);

// ROUTES TEACHERS

app.get("/api/v1/teachers/:name", teacherController.findTeacherByName);

app.get("/api/v1/teachers", teacherController.allTeachers);

app.post("/api/v1/teachers", teacherController.createTeacher);

app.put("/api/v1/teachers/:id", teacherController.updatedTeacher);

app.delete("/api/v1/teachers/:id", teacherController.deletedTeacher);

// ROUTES MODULES

app.get("/api/v1/module/:name", modulesController.findModulesByName);

app.get("/api/v1/module", modulesController.allModules);

app.post("/api/v1/module", modulesController.createModules);

app.put("/api/v1/module/:id", modulesController.updatedModules);

app.delete("/api/v1/module/:id", modulesController.deletedModules);

// ROUTES MODULES AND COURSES

app.get(
  "/api/v1/moduloecursos/:name",
  moduleAndCourseController.findModuleAndCourseById
);

app.get("/api/v1/moduloecursos", moduleAndCourseController.allModuleAndCourse);

app.post(
  "/api/v1/moduloecursos",
  moduleAndCourseController.createModuleAndCourse
);

app.put(
  "/api/v1/moduloecursos/:id",
  moduleAndCourseController.updatedModuleAndCourse
);

app.delete(
  "/api/v1/moduloecursos/:id",
  moduleAndCourseController.deletedModuleAndCourse
);
