import "dotenv/config";
import app from "./app";

const PORT = Number(process.env.PORT) || 5000;

app.listen(PORT, () => {
  console.log(`NovaCart API running on http://localhost:${PORT}`);
});