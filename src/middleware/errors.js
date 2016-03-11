export default function () {
  return async (ctx, next) => {
    try {
      await next();
    } catch (error) {
      if (error.isBoom) {
        ctx.status = error.output.statusCode;
        ctx.body = error.output.payload;
      } else {
        ctx.logger.error(error);
      }
    }
  };
}
