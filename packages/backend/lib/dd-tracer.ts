import tracer, { TracerOptions } from "dd-trace";
import "dotenv/config";

const options: TracerOptions = {
  env: process.env.NODE_ENV,
};
tracer.init(options); // initialized in a different file to avoid hoisting.
export default tracer;
