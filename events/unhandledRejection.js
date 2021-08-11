export const event = {
  name: "unhandledRejection",
  execute(error) {
    console.error("Unhandled promise rejection:", error);
  },
};
