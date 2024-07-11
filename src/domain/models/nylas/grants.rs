use serde::{Deserialize, Serialize};
use serde_json::Value;
use uuid::Uuid;

#[derive(Debug, Serialize, Deserialize)]
pub struct GrantToken {
    pub access_token: String,
    pub token_type: String,
    pub id_token: String,
    pub grant_id: Uuid,
    pub email: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct GrantModel {
    pub id: Uuid,
    pub grant_status: String,
    pub provider: String,
    pub scope: Vec<String>,
    pub email: String,
    pub settings: Value,
    pub ip: String,
    pub created_at: i32,
    pub updated_at: i32,
    pub provider_user_id: String,
}
