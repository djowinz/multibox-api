use jsonwebtoken::jwk::JwkSet;
use std::error::Error;

pub async fn fetch_jwks(issuer: &str) -> Result<JwkSet, Box<dyn Error>> {
    let uri = &format!("{}{}", issuer, "/.well-known/jwks.json");
    let res = reqwest::get(uri).await?.json::<JwkSet>().await?;
    return Ok(res);
}
