import bluebird from 'bluebird';
import joi from 'joi';

const validate = bluebird.promisify(joi.validate);

export default {
  body(rules) {
    const schema = joi.object().keys(rules);
    return async (ctx, next) => {
      try {
        const result = await validate(ctx.request.body, schema);
        ctx.logger.info(result);
      } catch (error) {
        // If the error is not an validation error let it bubble up
        if (!error.isJoi) {
          throw error;
        }

        ctx.body = error.details[0];
        return;
      }

      await next();
    };
  },
};
