/* eslint-disable import/no-cycle */
import { ISDKException } from '..';

export default class SDKException extends Error implements ISDKException {
  private _code: string = '';

  constructor(code: string, message: string) {
    super(message);
    this.name = 'SDKException';
    this._code = code;
  }

  get code(): string {
    return this._code;
  }
}
