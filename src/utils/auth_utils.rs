use aes_gcm::{
    aead::{Aead, KeyInit},
    Aes256Gcm, Key, Nonce,
};
use jsonwebtoken::jwk::JwkSet;
use std::error::Error;

use crate::domain::models::toodle::users::UserError;

pub async fn fetch_jwks(issuer: &str) -> Result<JwkSet, Box<dyn Error>> {
    let uri = &format!("{}{}", issuer, "/.well-known/jwks.json");
    let res = reqwest::get(uri).await?.json::<JwkSet>().await?;
    return Ok(res);
}

pub fn decrypt_aes(key_str: &str, data: String) -> Result<bool, UserError> {
    let encrypted_data = hex::decode(data).map_err(|op| UserError::Unauthorized(op.to_string()))?;
    let key = Key::<Aes256Gcm>::from_slice(key_str.as_bytes());

    let (nonce_arr, ciphered_data) = encrypted_data.split_at(12);
    let nonce = Nonce::from_slice(nonce_arr);
    let cipher = Aes256Gcm::new(key);

    cipher
        .decrypt(nonce, ciphered_data)
        .map_err(|op| UserError::Unauthorized(op.to_string()))?;

    println!("Decrypted data: {:?}", ciphered_data);

    return Ok(true);
}
