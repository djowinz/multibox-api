use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct Claims {
    pub exp: usize,
    pub iat: usize,
    pub iss: String,
    pub aud: Vec<String>,
    pub email: String,
    pub scope: String,
    pub azp: String,
}

#[derive(Debug, Serialize)]
pub struct AuthError {
    pub resource: String,
    pub message: String,
    pub happened_at: chrono::DateTime<chrono::Utc>,
}
