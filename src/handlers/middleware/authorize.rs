use axum::{
    body::Body,
    extract::{Request, State},
    http::{header, StatusCode},
    middleware::Next,
    response::IntoResponse,
    Json,
};
use jsonwebtoken::{decode, decode_header, jwk::AlgorithmParameters, DecodingKey, Validation};

use crate::{
    domain::models::toodle::auth::{AuthError, Claims},
    infra::repositories::user_repository::fetch_by_email,
    AppState,
};

pub async fn auth_middleware(
    State(state): State<AppState>,
    mut req: Request<Body>,
    next: Next,
) -> Result<impl IntoResponse, (StatusCode, Json<AuthError>)> {
    let token = req
        .headers()
        .get(header::AUTHORIZATION)
        .and_then(|auth_header| auth_header.to_str().ok())
        .and_then(|auth_value| {
            if auth_value.starts_with("Bearer ") {
                Some(auth_value[7..].to_owned())
            } else {
                None
            }
        });

    let token = token.ok_or_else(|| {
        let auth_error = AuthError {
            resource: "Authentication".to_string(),
            message: "No token provided".to_string(),
            happened_at: chrono::Utc::now(),
        };
        (StatusCode::UNAUTHORIZED, Json(auth_error))
    })?;

    let header = decode_header(&token)
        .map_err(|e| {
            let auth_error = AuthError {
                resource: "Authentication".to_string(),
                message: e.to_string(),
                happened_at: chrono::Utc::now(),
            };
            (StatusCode::UNAUTHORIZED, Json(auth_error))
        })
        .unwrap();

    let Some(kid) = header.kid else {
        let auth_error = AuthError {
            resource: "Authentication".to_string(),
            message: "No kid provided".to_string(),
            happened_at: chrono::Utc::now(),
        };
        return Err((StatusCode::UNAUTHORIZED, Json(auth_error)));
    };

    let Some(jwk) = state.jwks.find(&kid) else {
        let auth_error = AuthError {
            resource: "Authentication".to_string(),
            message: "No jwk provided".to_string(),
            happened_at: chrono::Utc::now(),
        };
        return Err((StatusCode::UNAUTHORIZED, Json(auth_error)));
    };

    let decoding_key = match &jwk.algorithm {
        AlgorithmParameters::RSA(rsa) => {
            DecodingKey::from_rsa_components(&rsa.n, &rsa.e).map_err(|op| {
                let auth_error = AuthError {
                    resource: "Authentication".to_string(),
                    message: op.to_string(),
                    happened_at: chrono::Utc::now(),
                };
                (StatusCode::UNAUTHORIZED, Json(auth_error))
            })?
        }
        _ => unreachable!("Algorithm not supported"),
    };

    let validation = {
        let mut validation = Validation::new(header.alg);
        validation.set_audience(&[state.config.domain()]);
        validation.validate_exp = false;
        validation
    };

    let token_body = decode::<Claims>(&token, &decoding_key, &validation).map_err(|op| {
        let auth_error = AuthError {
            resource: "Authentication".to_string(),
            message: op.to_string(),
            happened_at: chrono::Utc::now(),
        };
        (StatusCode::UNAUTHORIZED, Json(auth_error))
    })?;

    let email = token_body.claims.email;
    let user = fetch_by_email(&state.pool, email.clone())
        .await
        .map_err(|_| {
            let auth_error = AuthError {
                resource: "Authentication".to_string(),
                message: format!("User not found: {}", email.clone()),
                happened_at: chrono::Utc::now(),
            };
            (StatusCode::UNAUTHORIZED, Json(auth_error))
        })?;

    req.extensions_mut().insert(user);
    Ok(next.run(req).await)
}
