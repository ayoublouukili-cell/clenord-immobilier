const clamp=x=>Math.max(0,Math.min(1,x));
const ease=x=>{x=clamp(x);return x*x*(3-2*x)};
export const placement=(p,stage)=>ease((p-stage*.78)/.115);
export const reveal=p=>ease((p-.89)/.11);
