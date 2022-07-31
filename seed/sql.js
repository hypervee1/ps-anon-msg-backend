const dropUserTableSQL = 'DROP TABLE IF EXISTS users';
const createUserTableSql = `Create TABLE users(
    id INT NOT NULL AUTO_INCREMENT,
    PRIMARY KEY (id),
    fullname  VARCHAR(240) NULL DEFAULT NULL,
    username VARCHAR(240) ,
    email   VARCHAR(240),
    password VARCHAR(240),
    resetPasswordCode VARCHAR(240) NULL DEFAULT NULL,
    resetPasswordExpires timestamp NULL DEFAULT NULL,
    deleted_at timestamp NULL DEFAULT NULL,
    updated_at timestamp NULL DEFAULT NULL,
    created_at timestamp NULL DEFAULT NULL
)`;

const dropMessageTableSQL = 'DROP TABLE IF EXISTS messages';
const createMessageTableSql = `Create TABLE messages(
    id INT NOT NULL AUTO_INCREMENT,
    PRIMARY KEY (id),
    user_id bigint(20) UNSIGNED NOT NULL,
    message VARCHAR(240),
    deleted_at timestamp NULL DEFAULT NULL,
    updated_at timestamp NULL DEFAULT NULL,
    created_at timestamp NULL DEFAULT NULL
)`;

module.exports = {
  createMessageTableSql,
  createUserTableSql,
  dropUserTableSQL,
  dropMessageTableSQL,
};
