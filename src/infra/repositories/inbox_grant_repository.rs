use axum::{http::StatusCode, Json};
use diesel::{
    insert_into, prelude::Insertable, query_builder::AsChangeset, BoolExpressionMethods,
    ExpressionMethods, QueryDsl, RunQueryDsl, SelectableHelper,
};
use serde::Deserialize;
use uuid::Uuid;

use crate::{
    domain::models::toodle::inbox_grants::{
        handle_constraint_errors, InboxGrantError, InboxGrantModel,
    },
    infra::{db::schema::inbox_grants, errors::adapt_infra_error},
};

#[derive(Deserialize, Insertable, Clone)]
#[diesel(table_name = inbox_grants)]
pub struct NewInboxGrant {
    pub user_id: Uuid,
    pub grant_id: Uuid,
    pub grant_token: String,
    pub refresh_token: String,
    pub email_provider: String,
}

#[derive(Deserialize, AsChangeset, Clone)]
#[diesel(table_name = inbox_grants)]
pub struct UpdateGrant {
    pub grant_token: String,
    pub refresh_token: String,
}

pub async fn fetch_inbox_by_id(
    pool: &deadpool_diesel::postgres::Pool,
    user_id: Uuid,
    inbox_id: Uuid,
) -> Result<InboxGrantModel, InboxGrantError> {
    let conn = pool
        .get()
        .await
        .map_err(|op_err| InboxGrantError::InfraError(adapt_infra_error(op_err)))?;

    let res = conn
        .interact(move |conn| {
            inbox_grants::table
                .filter(
                    inbox_grants::id
                        .eq(inbox_id)
                        .and(inbox_grants::user_id.eq(user_id)),
                )
                .select(InboxGrantModel::as_select())
                .get_result(conn)
        })
        .await
        .map_err(|conn_err| InboxGrantError::InfraError(adapt_infra_error(conn_err)))? // connection pool error
        .map_err(|int_err| handle_constraint_errors(int_err, Some(inbox_id)))?; // interaction error

    Ok(res)
}

pub async fn fetch_all_by_user(
    pool: &deadpool_diesel::postgres::Pool,
    user_id: Uuid,
) -> Result<Vec<InboxGrantModel>, InboxGrantError> {
    let conn = pool
        .get()
        .await
        .map_err(|op_err| InboxGrantError::InfraError(adapt_infra_error(op_err)))?;

    let grants: Vec<InboxGrantModel> = conn
        .interact(move |conn| {
            inbox_grants::table
                .filter(inbox_grants::user_id.eq(user_id))
                .select(InboxGrantModel::as_select())
                .get_results(conn)
        })
        .await
        .map_err(|conn_err| InboxGrantError::InfraError(adapt_infra_error(conn_err)))? // connection pool error
        .map_err(|int_err| handle_constraint_errors(int_err, Some(user_id)))?; // interaction error

    Ok(grants)
}

pub async fn insert_or_update(
    pool: &deadpool_diesel::postgres::Pool,
    new_inbox_grant: NewInboxGrant,
) -> Result<InboxGrantModel, InboxGrantError> {
    let conn = pool
        .get()
        .await
        .map_err(|op_err| InboxGrantError::InfraError(adapt_infra_error(op_err)))?;

    let res = conn
        .interact(move |conn| {
            insert_into(inbox_grants::table)
                .values(&new_inbox_grant)
                .on_conflict(inbox_grants::grant_id)
                .do_update()
                .set(inbox_grants::grant_token.eq(&new_inbox_grant.grant_token))
                .returning(InboxGrantModel::as_returning())
                .get_result(conn)
        })
        .await
        .map_err(|conn_err| InboxGrantError::InfraError(adapt_infra_error(conn_err)))? // connection pool error
        .map_err(|int_err| handle_constraint_errors(int_err, None))?; // interaction error

    Ok(res)
}

pub async fn update(
    pool: &deadpool_diesel::postgres::Pool,
    user_id: Uuid,
    id_key: Uuid,
    Json(update_grant): Json<UpdateGrant>,
) -> Result<InboxGrantModel, InboxGrantError> {
    let conn = pool
        .get()
        .await
        .map_err(|op_err| InboxGrantError::InfraError(adapt_infra_error(op_err)))?;

    let res = conn
        .interact(move |conn| {
            diesel::update(
                inbox_grants::table.filter(
                    inbox_grants::id
                        .eq(id_key)
                        .and(inbox_grants::user_id.eq(user_id)),
                ),
            )
            .set(&update_grant)
            .returning(InboxGrantModel::as_returning())
            .get_result(conn)
        })
        .await
        .map_err(|conn_err| InboxGrantError::InfraError(adapt_infra_error(conn_err)))? // connection pool error
        .map_err(|int_err| handle_constraint_errors(int_err, Some(id_key)))?; // interaction error

    Ok(res)
}

pub async fn delete(
    pool: &deadpool_diesel::postgres::Pool,
    user_id: Uuid,
    id_key: Uuid,
) -> Result<StatusCode, InboxGrantError> {
    let conn = pool
        .get()
        .await
        .map_err(|op_err| InboxGrantError::InfraError(adapt_infra_error(op_err)))?;

    conn.interact(move |conn| {
        diesel::delete(
            inbox_grants::table.filter(
                inbox_grants::id
                    .eq(id_key)
                    .and(inbox_grants::user_id.eq(user_id)),
            ),
        )
        .returning(InboxGrantModel::as_returning())
        .get_result(conn)
    })
    .await
    .map_err(|conn_err| InboxGrantError::InfraError(adapt_infra_error(conn_err)))? // connection pool error
    .map_err(|int_err| handle_constraint_errors(int_err, Some(id_key)))?; // interaction error

    Ok(StatusCode::NO_CONTENT.into())
}
