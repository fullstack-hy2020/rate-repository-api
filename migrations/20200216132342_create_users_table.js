export function up(knex) {
  return knex.schema.createTable('users', (table) => {
    table.text('id').primary();
    table.text('username').unique();
    table.text('password');
    table.timestamp('created_at');
    table.timestamp('updated_at');

    table.index('username');
  });
}

export function down(knex) {
  return knex.schema.dropTableIfExists('users');
}
