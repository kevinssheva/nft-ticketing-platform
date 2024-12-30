import { PinataSDK } from "pinata-web3";

export const pinata = new PinataSDK({
  pinataJwt: `${process.env.NEXT_PUBLIC_PINATA_JWT}`,
  pinataGateway: `${process.env.NEXT_PUBLIC_PINATA_GATEWAY_URL}`,
});

export const getPinataUrl = (cid: string) => {
  return `${cid}?pinataGatewayToken=${process.env.NEXT_PUBLIC_PINATA_GATEWAY_KEY}`;
};
