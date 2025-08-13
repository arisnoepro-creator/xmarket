export const pusherServer = { trigger: async () => {} };
export class PusherClientMock {
  constructor(..._args:any[]){}
  subscribe(_ch:string){ return { bind: (_e:string,_cb:any)=>{}, unsubscribe: (_c:string)=>{} }; }
  disconnect(){}
}
export { PusherClientMock as PusherClient };