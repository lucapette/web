# Change Data Capture

## Debezium embedded

- The example in the docs is bare but functional.

- obviously I run into Postgres server wal_level property must be 'logical' but is: 'replica’. But found a cool way of doing this:
  - `ALTER SYSTEM SET wal_level = logical;`
  - restart the server. Nice!
- It immediately works and makes you feel productive but gotta find a good way to serialize data
  - the api is really nice, in fact you can change the format in which you receive the data with one line of code.
  - I wish there was a simple way to get the schema too (you can get it inside the data values itself but that’s a little cumbersome)
