use serde::{Deserialize, Serialize};
use uuid::Uuid;

#[derive(Debug, Serialize, Deserialize)]
pub struct GrantModel {
    pub access_token: String,
    pub token_type: String,
    pub id_token: String,
    pub grant_id: Uuid,
}
