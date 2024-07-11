use axum::{response::IntoResponse, Json};
use reqwest::StatusCode;
use serde::{Deserialize, Serialize};
use serde_json::{json, Value};
use uuid::Uuid;

use super::messages::{MessageAddressModel, MessageModel};

#[derive(Debug, Clone, Deserialize, Serialize)]
pub struct ThreadModel {
    pub id: String,
    pub starred: bool,
    pub unread: bool,
    pub folders: Value,
    pub grant_id: Uuid,
    pub object: String,
    pub latest_message_or_draft: MessageModel,
    pub has_attachments: bool,
    pub has_drafts: bool,
    pub earliest_message_date: i32,
    pub latest_message_received_date: i32,
    pub participants: Vec<MessageAddressModel>,
    pub snippet: String,
    pub subject: String,
    pub message_ids: Vec<Option<String>>,
}

#[derive(Debug, Clone, Deserialize, Serialize)]
pub struct ThreadListModel {
    pub id: String,
    pub starred: bool,
    pub unread: bool,
    pub folders: Value,
    pub object: String,
    pub has_attachments: bool,
    pub has_drafts: bool,
    pub snippet: String,
    pub subject: String,
    pub latest_message_received_date: i32,
    pub participants: Vec<MessageAddressModel>,
    pub message_ids: Vec<Option<String>>,
}

pub enum ThreadError {
    InternalServerError,
    NotFound(String),
    InfraError(String),
    NylasError(String),
}

impl IntoResponse for ThreadError {
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
                json!({"resource": "ThreadModel", "message": err_msg, "happened_at": chrono::Utc::now() }),
            ),
        )
            .into_response()
    }
}
