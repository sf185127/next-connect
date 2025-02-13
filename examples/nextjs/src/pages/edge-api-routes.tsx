import type { NextPage } from "next";
import Head from "next/head";
import styles from "../styles/styles.module.css";

const EdgeApiRoutesPage: NextPage = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>Edge API Routes example</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <h1 className={styles.title}>
          <a href="https://github.com/hoangvvo/next-connect/tree/main/examples/nextjs/pages/api/edge-users">
            Edge API Routes
          </a>{" "}
          example
        </h1>
        <p>
          <a
            href="https://nextjs.org/docs/api-routes/edge-api-routes"
            style={{ color: "#0070f3" }}
          >
            Edge API Routes
          </a>{" "}
          built with next-connect. Open your devtool (<code>F12</code>) and try
          the following snippets.
        </p>
        <h2>
          <code className={styles.code}>POST /api/edge-users</code>
          <span> - Create a user</span>
        </h2>
        <div className={styles.snippet}>
          <pre>{`await fetch("/api/edge-users", {
  method: "POST",
  headers: { "content-type": "application/json" },
  body: JSON.stringify({ name: "Jane Doe", age: 18 }),
}).then((res) => res.json());
`}</pre>
        </div>
        <h2>
          <code className={styles.code}>GET /api/edge-users</code>
          <span> - Get all users</span>
        </h2>
        <div className={styles.snippet}>
          <pre>{`await fetch("/api/edge-users").then((res) => res.json());
`}</pre>
        </div>
        <h2>
          <code className={styles.code}>GET /api/edge-users/:id</code>
          <span> - Get a single user</span>
        </h2>
        <div className={styles.snippet}>
          <pre>
            {`await fetch("/api/edge-users/`}
            <span className={styles.code}>some-id</span>
            {`").then(res => res.json());
`}
          </pre>
        </div>
      </main>
    </div>
  );
};

export default EdgeApiRoutesPage;
