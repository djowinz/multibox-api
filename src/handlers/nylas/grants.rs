use axum::extract::State;
use serde::Serialize;

use crate::{domain::models::nylas::grants::GrantModel, AppState};

#[derive(Serialize, Clone)]
pub struct GrantClaimRequest {
    pub client_id: String,
    pub client_secret: String,
    pub grant_type: String,
    pub code: String,
    pub redirect_uri: String,
    pub code_verifier: String,
}

pub async fn create_grant(
    state: State<AppState>,
    claim_token: String,
    redirect_uri: String,
) -> Result<GrantModel, String> {
    let nylas_base_url = state.config.nylas_api_url().to_string();
    let url_path = "/connect/token".to_string();

    let post_body = GrantClaimRequest {
        client_id: state.config.nylas_client_id().to_string(),
        client_secret: state.config.nylas_client_secret().to_string(),
        grant_type: "authorization_code".to_string(),
        code: claim_token,
        redirect_uri: redirect_uri,
        code_verifier: state.config.nylas_code_verifier().to_string(),
    };

    let client = reqwest::Client::new();
    let res = client
        .post(format!("{}{}", nylas_base_url, url_path).as_str())
        .json(&post_body)
        .send()
        .await;

    let res = match res {
        Ok(res) => res,
        Err(e) => return Err(e.to_string()),
    };

    match res.status() {
        reqwest::StatusCode::OK => {
            let res_body: GrantModel = res.json().await.unwrap();
            Ok(res_body)
        }
        _ => Err("Failed to create grant".to_string()),
    }
}
