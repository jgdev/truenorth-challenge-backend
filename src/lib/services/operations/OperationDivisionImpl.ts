import ValidatorError from "@/core/errors/ValidationError";
import OperationImpl from "./OperationImpl";

export default class OperationDivisionImpl implements OperationImpl {
  async perform(args: any[]): Promise<number> {
    if (args.length < 2)
      throw new ValidatorError("Expecting at least two arguments");
    return args.reduce((result, arg, index) => {
      if (typeof arg !== "number")
        throw new ValidatorError(
          `Invalid operation parameter at index ${index}`
        );
      return args[index + 1] ? result / args[index + 1] : result;
    }, args[0]);
  }
}
