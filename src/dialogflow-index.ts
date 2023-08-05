
interface IText {
    text: string[];
}

interface IResponseMessage {
    text: IText;
}

interface IFulfillementResponse {
    messages: IResponseMessage[];
}

export type ParametersObjectType = Record<string, string | number>;

const errorAsObject = (() => {
  let ctr = 0;
  return {
    createError: (errorMessage: string) => {
      ctr++;
      return {
        ["error (" + ctr + ")"]: errorMessage
      };
    }
  };}) ();

export interface ISessionInfo{
   parameters: ParametersObjectType; 
}

export const addSessionVariable = (
    sessionInfo: ISessionInfo, 
    key: string, 
    value: string | number) => {
        sessionInfo.parameters[key] = value;
};

export interface IDialogflow_webhook_answer {
    fulfillmentResponse?: IFulfillementResponse;
    sessionInfo?:  ISessionInfo};

export const strWebhookAnswer = (outputParameters: ParametersObjectType): string => {
    return JSON.stringify({
       sessionInfo: {
            parameters: outputParameters
        }
    });
};

export const getRequestParameter =  (
    sessionInfo: any, 
    parameterName: string): Record<string, string | number> => {

    if(!sessionInfo) return errorAsObject.createError('sessionInfo not found');
    if(!sessionInfo.parameters) return errorAsObject.createError('sessionInfo.parameters not found'); 
    if(!(parameterName in sessionInfo.parameters)) return errorAsObject.createError(`Variable ${parameterName} not found`);
    return {[parameterName]: sessionInfo.parameters[parameterName]};
};


export const subWebhook = async (
    inputs: ParametersObjectType, 
    subApplication: (inputs: ParametersObjectType) => Promise<ParametersObjectType>): Promise<IDialogflow_webhook_answer> => {
    const outputParameters = await subApplication(inputs);
    return {
        sessionInfo: {
            parameters: outputParameters
        }
    };
}

