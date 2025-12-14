import jwt from "jsonwebtoken";

export function createN8nJwt() {
  return jwt.sign(
    {
      iss: "nextjs-api",
      aud: "n8n",
    },
    process.env.N8N_JWT_SECRET,
    {
      expiresIn: "5m",
    }
  );
}
