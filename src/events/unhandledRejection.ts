export const event = {
    name: "unhandledRejection",
    execute(error: PromiseRejectionEvent) {
        console.error("Unhandled promise rejection:", error);
    },
};
