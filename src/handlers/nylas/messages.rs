use axum::{body, extract::State};
use serde::{Deserialize, Serialize};
use uuid::Uuid;

use crate::{
    domain::models::nylas::messages::{MessageError, MessageModel},
    AppState,
};

#[derive(Debug, Clone, Deserialize, Serialize)]
pub struct MessageResponse {
    pub request_id: Uuid,
    pub data: Vec<MessageModel>,
    pub next_cursor: Option<String>,
}

pub async fn get_messages(
    state: State<AppState>,
    grant_id: Uuid,
    limit: i32,
) -> Result<MessageResponse, MessageError> {
    let nylas_base_url = state.config.nylas_api_url().to_string();
    let url_path = format!("/grants/{}/messages/?limit={}", grant_id, limit);

    let client = reqwest::Client::new();
    let res = client
        .get(format!("{}{}", nylas_base_url, url_path).as_str())
        .bearer_auth(state.config.nylas_client_secret())
        .send()
        .await;

    match res {
        Ok(res) => {
            let body = res.json::<MessageResponse>().await;
            match body {
                Ok(body) => Ok(body),
                Err(e) => return Err(MessageError::NylasError(e.to_string())),
            }
        }
        Err(e) => return Err(MessageError::NylasError(e.to_string())),
    }
}
