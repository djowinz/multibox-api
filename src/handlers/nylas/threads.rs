use axum::extract::State;
use serde::{Deserialize, Serialize};
use uuid::Uuid;

use crate::{
    domain::models::nylas::threads::{ThreadError, ThreadListModel},
    AppState,
};

#[derive(Debug, Clone, Deserialize, Serialize)]
pub struct ThreadResponse {
    pub request_id: Uuid,
    pub data: Option<Vec<ThreadListModel>>,
    pub next_cursor: Option<String>,
}

pub async fn get_threads(
    state: State<AppState>,
    grant_id: Uuid,
    limit: i32,
    cursor: Option<String>,
) -> Result<ThreadResponse, ThreadError> {
    let nylas_base_url = state.config.nylas_api_url().to_string();
    let mut base_path = format!("/grants/{}/threads", grant_id);
    if cursor.is_some() {
        base_path = format!(
            "{}?page_token={}&limit={}",
            base_path,
            cursor.unwrap(),
            limit
        );
    } else {
        base_path = format!("{}?limit={}", base_path, limit);
    }
    let url_path = format!("{}&in=INBOX&select=from,id,starred,unread,folders,object,has_attachments,has_drafts,snippet,subject,message_ids,latest_message_received_date,participants", base_path);

    let client = reqwest::Client::new();
    let res = client
        .get(format!("{}{}", nylas_base_url, url_path).as_str())
        .bearer_auth(state.config.nylas_client_secret())
        .send()
        .await;

    match res {
        Ok(res) => {
            let body = res.json::<serde_json::Value>().await.unwrap();
            let mutated: Result<ThreadResponse, serde_path_to_error::Error<serde_json::Error>> =
                serde_path_to_error::deserialize(body);
            match mutated {
                Ok(body) => Ok(body),
                Err(e) => return Err(ThreadError::NylasError(e.to_string())),
            }
        }
        Err(e) => return Err(ThreadError::NylasError(e.to_string())),
    }
}
