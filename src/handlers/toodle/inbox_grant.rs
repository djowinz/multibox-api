use axum::{
    extract::{Path, State},
    http::StatusCode,
    Extension, Json,
};
use serde::Deserialize;
use uuid::Uuid;

use crate::{
    domain::models::toodle::{
        inbox_grants::{InboxGrantError, InboxGrantModel},
        users::UserModel,
    },
    handlers::nylas::grants::create_grant,
    infra::repositories::inbox_grant_repository::{self, NewInboxGrant, UpdateGrant},
    AppState,
};

#[derive(Deserialize, Clone)]
pub struct NewInboxGrantRequest {
    pub claim_token: String,
    pub email_provider: String,
    pub redirect_uri: String,
}

pub async fn create_inbox_grant(
    Extension(user): Extension<UserModel>,
    state: State<AppState>,
    new_inbox_grant: Json<NewInboxGrantRequest>,
) -> Result<Json<InboxGrantModel>, InboxGrantError> {
    let nylas_grant = create_grant(
        state.clone(),
        new_inbox_grant.claim_token.clone(),
        new_inbox_grant.redirect_uri.clone(),
    )
    .await;

    let grant = match nylas_grant {
        Ok(grant) => grant,
        Err(e) => return Err(InboxGrantError::NylasError(e)),
    };

    let new_inbox_grant_rec = NewInboxGrant {
        user_id: user.id.clone(),
        grant_id: grant.grant_id.clone(),
        grant_token: grant.access_token.clone(),
        refresh_token: "dummy".to_string(),
        email_provider: new_inbox_grant.email_provider.clone(),
        email: grant.email.clone(),
    };
    let new_inbox_grant_db =
        inbox_grant_repository::insert_or_update(&state.pool, new_inbox_grant_rec).await?;
    Ok(Json(new_inbox_grant_db))
}

pub async fn fetch_inbox_grants(
    Extension(user): Extension<UserModel>,
    state: State<AppState>,
) -> Result<Json<Vec<InboxGrantModel>>, InboxGrantError> {
    let inbox_grants =
        inbox_grant_repository::fetch_all_by_user(&state.pool, user.id.clone()).await?;
    Ok(Json(inbox_grants))
}

pub async fn update_inbox_grant(
    Extension(user): Extension<UserModel>,
    state: State<AppState>,
    Path(inbox_grant_id): Path<Uuid>,
    update_inbox_grant: Json<UpdateGrant>,
) -> Result<Json<InboxGrantModel>, InboxGrantError> {
    let update_inbox_grant_db = inbox_grant_repository::update(
        &state.pool,
        user.id.clone(),
        inbox_grant_id,
        update_inbox_grant.clone(),
    )
    .await?;
    Ok(Json(update_inbox_grant_db))
}

pub async fn delete_inbox_grant(
    Extension(user): Extension<UserModel>,
    state: State<AppState>,
    Path(inbox_grant_id): Path<Uuid>,
) -> Result<StatusCode, InboxGrantError> {
    inbox_grant_repository::delete(&state.pool, user.id.clone(), inbox_grant_id).await?;
    Ok(StatusCode::NO_CONTENT)
}
