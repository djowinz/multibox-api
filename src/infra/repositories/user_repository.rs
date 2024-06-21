use axum::http::StatusCode;
use axum::Json;
use diesel::prelude::Insertable;
use diesel::query_builder::AsChangeset;
use diesel::QueryDsl;
use diesel::{insert_into, ExpressionMethods, RunQueryDsl, SelectableHelper};
use serde::Deserialize;
use uuid::Uuid;

use crate::domain::models::toodle::users::{handle_constraint_errors, UserError, UserModel};
use crate::infra::db::schema::users;
use crate::infra::errors::adapt_infra_error;

#[derive(Deserialize, Insertable, Clone)]
#[diesel(table_name = users)]
pub struct NewUser {
    pub email: String,
    pub first_name: Option<String>,
    pub last_name: Option<String>,
}

#[derive(Deserialize, AsChangeset, Clone)]
#[diesel(table_name = users)]
pub struct UpdateUser {
    pub email: String,
    pub first_name: String,
    pub last_name: String,
}

pub async fn fetch(
    pool: &deadpool_diesel::postgres::Pool,
    id_key: Uuid,
) -> Result<UserModel, UserError> {
    let conn = pool
        .get()
        .await
        .map_err(|op_err| UserError::InfraError(adapt_infra_error(op_err)))?;

    let res = conn
        .interact(move |conn| {
            users::table
                .filter(users::id.eq(id_key))
                .select(UserModel::as_select())
                .get_result(conn)
        })
        .await
        .map_err(|conn_err| UserError::InfraError(adapt_infra_error(conn_err)))? // connection pool error
        .map_err(|int_err| handle_constraint_errors(int_err, Some(id_key)))?; // interaction error

    Ok(res)
}

pub async fn fetch_by_email(
    pool: &deadpool_diesel::postgres::Pool,
    email_key: String,
) -> Result<UserModel, UserError> {
    let conn = pool
        .get()
        .await
        .map_err(|op_err| UserError::InfraError(adapt_infra_error(op_err)))?;

    let res = conn
        .interact(move |conn| {
            users::table
                .filter(users::email.eq(email_key))
                .select(UserModel::as_select())
                .get_result(conn)
        })
        .await
        .map_err(|conn_err| UserError::InfraError(adapt_infra_error(conn_err)))? // connection pool error
        .map_err(|int_err| handle_constraint_errors(int_err, None))?; // interaction error

    Ok(res)
}

pub async fn insert(
    pool: &deadpool_diesel::postgres::Pool,
    Json(new_user): Json<NewUser>,
) -> Result<UserModel, UserError> {
    let conn = pool
        .get()
        .await
        .map_err(|op_err| UserError::InfraError(adapt_infra_error(op_err)))?;

    let res = conn
        .interact(move |conn| {
            insert_into(users::table)
                .values(&new_user)
                .returning(UserModel::as_returning())
                .get_result(conn)
        })
        .await
        .map_err(|conn_err| UserError::InfraError(adapt_infra_error(conn_err)))? // connection pool error
        .map_err(|int_err| handle_constraint_errors(int_err, None))?;

    Ok(res)
}

pub async fn update(
    pool: &deadpool_diesel::postgres::Pool,
    id_key: Uuid,
    Json(update_user): Json<UpdateUser>,
) -> Result<UserModel, UserError> {
    let conn = pool
        .get()
        .await
        .map_err(|op_err| UserError::InfraError(adapt_infra_error(op_err)))?;

    let res = conn
        .interact(move |conn| {
            diesel::update(users::table.filter(users::id.eq(id_key)))
                .set(&update_user)
                .returning(UserModel::as_returning())
                .get_result(conn)
        })
        .await
        .map_err(|conn_err| UserError::InfraError(adapt_infra_error(conn_err)))? // connection pool error
        .map_err(|int_err| handle_constraint_errors(int_err, Some(id_key)))?; // interaction error

    Ok(res)
}

pub async fn delete(
    pool: &deadpool_diesel::postgres::Pool,
    id_key: Uuid,
) -> Result<StatusCode, UserError> {
    let conn = pool
        .get()
        .await
        .map_err(|op_err| UserError::InfraError(adapt_infra_error(op_err)))?;
    conn.interact(move |conn| {
        diesel::delete(users::table.filter(users::id.eq(id_key)))
            .returning(UserModel::as_returning())
            .get_result(conn)
    })
    .await
    .map_err(|conn_err| UserError::InfraError(adapt_infra_error(conn_err)))? // connection pool error
    .map_err(|int_err| handle_constraint_errors(int_err, Some(id_key)))?; //

    Ok(StatusCode::NO_CONTENT.into())
}
