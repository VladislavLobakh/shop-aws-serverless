import { Client } from 'pg';

export const pgConnect = async (): Promise<Client> => {
  const client = new Client({
    host: process.env.pgDatabaseHost,
    port: +process.env.pgDatabasePort,
    database: process.env.pgDatabaseName,
    user: process.env.pgDatabaseUsername,
    password: process.env.pgDatabasePassword,
    ssl: {
      rejectUnauthorized: false
    },
    connectionTimeoutMillis: 5000
  });

  await client.connect().then(() => {
    console.log('pg connected');
  });

  return client;
};

export const pgDisconnect = (client: Client): Promise<void> => {
  return client.end().then(() => {
    console.log('pg disconnected');
  });
};

export const pgQuery = (
  client: Client,
  queryString: string,
  values?: any[]
): Promise<any> => {
  return client.query(queryString, values).then((data) => {
    return data.rows.length
      ? data.rows.length > 1
        ? data.rows
        : data.rows[0]
      : null;
  });
};
