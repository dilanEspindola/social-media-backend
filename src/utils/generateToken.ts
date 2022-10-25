import * as jwt from 'jsonwebtoken';
import keypair from 'keypair';
import { generateKeyPairSync, generateKeyPair } from 'crypto';
import jwkToPem from 'jwk-to-pem';

interface JWTReponse {
  token: string;
  publicKey: string;
  privateKey: string;
}

interface Payload {
  id: number;
  email: string;
}

export const generateToken = <T extends Payload>(payload: T): JWTReponse => {
  try {
    const { privateKey, publicKey } = generateKeyPairSync('rsa', {
      modulusLength: 2048,
      publicKeyEncoding: {
        type: 'spki',
        format: 'pem',
      },
      privateKeyEncoding: {
        type: 'pkcs8',
        format: 'pem',
      },
    });

    const token = jwt.sign(payload, privateKey, {
      algorithm: 'RS256',
      expiresIn: '24h',
    });

    return { token, publicKey, privateKey };
  } catch (error) {
    console.log(error);
  }
};

export const verifyToken = async (token: string, publicKey: string) => {
  try {
    const publicKeyfixed = publicKey.replace(/\\n/g, '\n');
    const verifyToken = jwt.verify(token, publicKeyfixed);
    return verifyToken;
  } catch (error) {
    switch (error.message) {
      case 'error:09091064:PEM routines:PEM_read_bio_ex:bad base64 decode':
        return 'PUBLICKEY_IS_NOT_A_FORMAT_VALID';
      case 'invalid token':
        return 'INVALID_TOKEN';
    }
  }
};
