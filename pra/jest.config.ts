export default {
  transform: {
    "^.+\\.(t|j)sx?$": "@swc/jest",
  },
  moduleDirectories: [__dirname, "node_modules"],
  verbose: true,
};
