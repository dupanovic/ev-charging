import app from "./app";

const PORT = parseInt(process.env.PORT || "3000", 10);

app.listen(PORT, () => {
  console.log(`EV Charging API server listening on port ${PORT}`);
});
