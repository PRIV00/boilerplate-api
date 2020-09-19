import { Request, Response } from 'express';
import sinon from 'sinon';


export function mockExpressObjects() {
    let req: Request =  <Request>{
        headers: {},
        params: {},
        body: {}
    };
    let res: Response = <Response>{
        locals: {},
        statusCode: 0,
        json: <any>sinon.stub().callsFake(data => {
            return data;
        })
    };
    res.status = <any>sinon.stub().callsFake(code => {
        res.statusCode = code;
        return res;
    });
    let next: sinon.SinonStub = sinon.stub();
    return { req, res, next }
}
