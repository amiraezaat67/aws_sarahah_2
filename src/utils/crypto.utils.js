
import CryptoJS from 'crypto-js'

export const Encryption = (
    {value , secret=process.env.ENCRYPTION_SECRET_KEY}={}) => {
    return CryptoJS.AES.encrypt(value, secret).toString()
}

export const Decryption = ({value , secret=process.env.ENCRYPTION_SECRET_KEY}={}) => {
    return CryptoJS.AES.decrypt(value, secret).toString(CryptoJS.enc.Utf8)
}