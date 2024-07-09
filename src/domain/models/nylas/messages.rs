use axum::{response::IntoResponse, Json};
use reqwest::StatusCode;
use serde::{Deserialize, Serialize};
use serde_json::json;
use uuid::Uuid;

#[derive(Debug, Clone, Deserialize, Serialize)]
pub struct MessageAddressModel {
    pub name: Option<String>,
    pub email: String,
}

#[derive(Debug, Clone, Deserialize, Serialize)]
pub struct MessageModel {
    pub id: String,
    pub starred: bool,
    pub unread: bool,
    pub folders: serde_json::Value,
    pub subject: String,
    pub thread_id: String,
    pub body: String,
    pub grant_id: Uuid,
    pub object: String,
    pub snippet: String,
    pub bcc: serde_json::Value,
    pub cc: serde_json::Value,
    pub attachments: serde_json::Value,
    pub from: Vec<MessageAddressModel>,
    pub reply_to: Vec<Option<MessageAddressModel>>,
    pub to: Vec<MessageAddressModel>,
    pub date: i32,
    pub created_at: i32,
}

pub enum MessageError {
    InternalServerError,
    NotFound(String),
    InfraError(String),
    NylasError(String),
}

impl IntoResponse for MessageError {
    fn into_response(self) -> axum::response::Response {
        let (status, err_msg) = match self {
            Self::NotFound(other_id) => (
                StatusCode::NOT_FOUND,
                format!("Message with id {:?} not found", other_id),
            ),
            Self::InfraError(db_error) => (
                StatusCode::INTERNAL_SERVER_ERROR,
                format!("Database error: {}", db_error),
            ),
            Self::NylasError(nylas_error) => (
                StatusCode::INTERNAL_SERVER_ERROR,
                format!("Nylas error: {}", nylas_error),
            ),
            Self::InternalServerError => (
                StatusCode::INTERNAL_SERVER_ERROR,
                "Internal server error".to_string(),
            ),
        };
        (
            status,
            Json(
                json!({"resource": "MessageModel", "message": err_msg, "happened_at": chrono::Utc::now() }),
            ),
        )
            .into_response()
    }
}
